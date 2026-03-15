import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'secret', {
    expiresIn: '15m', // Short lived access token
  });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
    expiresIn: '7d', // Long lived refresh token
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret') as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as TokenPayload;
};

// Generates a random hash for the refresh token storage
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
