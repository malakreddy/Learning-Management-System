import { Router } from 'express';
import { enrollUser, getUserEnrollments, checkEnrollment } from './enrollment.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Protected user routes
router.post('/', authenticate, enrollUser);
router.get('/', authenticate, getUserEnrollments);
router.get('/check/:subjectId', authenticate, checkEnrollment);

export default router;
