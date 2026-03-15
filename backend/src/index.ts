import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import sectionRoutes from './modules/sections/section.routes';
import videoRoutes from './modules/videos/video.routes';
import enrollmentRoutes from './modules/enrollments/enrollment.routes';

dotenv.config();

// Patch BigInt for JSON Serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();
export const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins in development for easier network testing
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'LMS API Server Running!' });
});

// Basic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
