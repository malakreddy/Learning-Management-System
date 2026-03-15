import { z } from 'zod';

export const createSectionSchema = z.object({
  subject_id: z.number().int().positive(),
  title: z.string().min(1),
  order_index: z.number().int().nonnegative(),
});

export const updateSectionSchema = createSectionSchema.partial();
