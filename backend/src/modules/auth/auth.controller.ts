import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../index';
import { registerSchema, loginSchema } from './auth.schema';
import { generateAccessToken, generateRefreshToken, hashToken, verifyRefreshToken, TokenPayload } from '../../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
      },
    });

    const payload = { userId: user.id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      },
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user.id.toString(), email: user.email, name: user.name },
      token: accessToken
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
       res.status(400).json({ error: error.errors });
       return;
    }
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const payload = { userId: user.id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      },
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        user: { id: user.id.toString(), email: user.email, name: user.name },
        token: accessToken
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
       res.status(400).json({ error: error.errors });
       return;
    }
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }

    // Verify token payload
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const hashedToken = hashToken(refreshToken);
    
    // Check if token exists in DB and is not revoked
    const storedToken = await prisma.refreshToken.findFirst({
        where: {
            user_id: BigInt(payload.userId),
            token_hash: hashedToken,
            revoked_at: null,
            expires_at: {
                gt: new Date()
            }
        }
    });

    if (!storedToken) {
       res.status(401).json({ error: 'Refresh token invalid or revoked' });
       return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
    res.json({ token: newAccessToken });
    
  } catch (error: any) {
    res.status(500).json({ error: 'Refresh failed' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken) {
            const hashedToken = hashToken(refreshToken);
            await prisma.refreshToken.updateMany({
                where: { token_hash: hashedToken },
                data: { revoked_at: new Date() }
            });
        }
        res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
};
