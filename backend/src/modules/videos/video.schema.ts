import { z } from 'zod';

export const createVideoSchema = z.object({
  section_id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  youtube_video_id: z.string().min(1),
  order_index: z.number().int().nonnegative(),
  duration_seconds: z.number().int().nonnegative().optional(),
});

export const updateVideoSchema = createVideoSchema.partial();

export const updateProgressSchema = z.object({
  last_position_seconds: z.number().int().nonnegative().optional(),
  is_completed: z.boolean().optional(),
});
