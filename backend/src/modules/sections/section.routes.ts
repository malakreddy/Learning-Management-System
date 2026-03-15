import { Router } from 'express';
import { getSectionsBySubject, createSection, updateSection, deleteSection } from './section.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/subject/:subjectId', getSectionsBySubject);

// Protected administrative routes
router.post('/', authenticate, createSection);
router.put('/:id', authenticate, updateSection);
router.delete('/:id', authenticate, deleteSection);

export default router;
