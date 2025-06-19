import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc';
import { db } from '~/server/db';
import { TRPCError } from '@trpc/server';
import { projectSchema } from '~/server/lib/validators/project';

export const projectsRouter = createTRPCRouter({
  getAllProjects: protectedProcedure.query(
    async ({ ctx }) => {
      return ctx.db.project.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    },
  ),

  create: protectedProcedure
    .input(projectSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.project.create({
          data: {
            name: input.name,
            description: input.description,
            createdById: ctx.session.user.id,
            Status: {
              create: [
                { name: 'To Do' },
                { name: 'In Progress' },
                { name: 'Done' },
              ],
            },
          },
          include: {
            Status: true,
          },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create project',
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
        const [projects, totalCount] = await Promise.all([
          db.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
              createdBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            skip,
            take: limit,
          }),
          db.project.count(),
        ]);

        return {
          projects,
          totalCount,
        };
      } catch (err) {
        console.log(err, 'ererererr');
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch projects',
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const project = await db.project.findUnique({
          where: { id: input.id },
        });

        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        return project;
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch project',
        });
      }
    }),

  update: protectedProcedure
    .input(
      projectSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const existing = await db.project.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Projects not found',
          });
        }

        return await db.project.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
          },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update project',
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const project = await db.project.findUnique({
          where: { id: input.id },
        });
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }

        return await db.project.delete({
          where: { id: input.id },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete project',
        });
      }
    }),
});
