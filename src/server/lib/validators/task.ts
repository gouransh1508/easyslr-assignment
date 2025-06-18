import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  tag: z.enum(['Feature', 'Bug', 'Improvement']),
  deadline: z.string().min(1, 'Deadlien is required'),
  assignee: z.string().min(1, 'Assignee is required'),
});
