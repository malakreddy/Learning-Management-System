import { z } from 'zod';

export const createSubjectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  is_published: z.boolean().default(false),
});

export const updateSubjectSchema = createSubjectSchema.partial();
