import { Router } from 'express';
import { getAllSubjects, getSubjectBySlug, createSubject, updateSubject, deleteSubject } from './subject.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', getAllSubjects);
router.get('/:slug', getSubjectBySlug);

// Protected admin routes (in a real app, verify admin role)
router.post('/', authenticate, createSubject);
router.put('/:id', authenticate, updateSubject);
router.delete('/:id', authenticate, deleteSubject);

export default router;
