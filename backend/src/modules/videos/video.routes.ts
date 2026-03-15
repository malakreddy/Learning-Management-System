import { Router } from 'express';
import { getVideosBySection, createVideo, updateVideo, deleteVideo, updateProgress, getProgress } from './video.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/section/:sectionId', getVideosBySection);

// Video Progress routes (protected for regular users)
router.get('/:videoId/progress', authenticate, getProgress);
router.post('/:videoId/progress', authenticate, updateProgress);

// Admin routes
router.post('/', authenticate, createVideo);
router.put('/:id', authenticate, updateVideo);
router.delete('/:id', authenticate, deleteVideo);

export default router;
