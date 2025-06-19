import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(
      3,
      'Project name must be at least 3 characters long',
    )
    .max(
      100,
      'Project name must be less than 100 characters',
    ),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description too long')
    .optional(),
});
