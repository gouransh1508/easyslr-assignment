import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc';
import { db } from '~/server/db';
import { taskSchema } from '~/server/lib/validators/task';
import { TRPCError } from '@trpc/server';

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.task.create({
          data: {
            title: input.title,
            description: input.description,
            priority: input.priority,
            tag: input.tag,
            deadline: new Date(input.deadline),
            assignee: input.assignee,
            createdById: ctx.session.user.id,
          },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create task',
        });
      }
    }),

  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;
      try {
        const [tasks, totalCount] = await Promise.all([
          db.task.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          db.task.count(),
        ]);

        return {
          tasks,
          totalCount,
        };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tasks',
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const task = await db.task.findUnique({
          where: { id: input.id },
        });

        if (!task) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found',
          });
        }

        return task;
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch task',
        });
      }
    }),

  update: protectedProcedure
    .input(
      taskSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const existing = await db.task.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found',
          });
        }

        return await db.task.update({
          where: { id: input.id },
          data: {
            title: input.title,
            description: input.description,
            priority: input.priority,
            tag: input.tag,
            deadline: new Date(input.deadline),
            assignee: input.assignee,
          },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update task',
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const task = await db.task.findUnique({
          where: { id: input.id },
        });
        if (!task) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Task not found',
          });
        }

        return await db.task.delete({
          where: { id: input.id },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete task',
        });
      }
    }),
});
