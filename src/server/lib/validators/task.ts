import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(['Low', 'Medium', 'High']),
  tag: z.enum(['Feature', 'Bug', 'Improvement']),
  deadline: z.string().min(1),
  assignee: z.string().min(1),
});
