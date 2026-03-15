import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  subject_id: z.coerce.number().int().positive(),
});
