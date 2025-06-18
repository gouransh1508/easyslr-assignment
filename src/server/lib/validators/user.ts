import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(200).optional(),
  profilePicture: z.string().optional(),
});
