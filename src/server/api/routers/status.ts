import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc';

export const statusRouter = createTRPCRouter({
  getStatusesByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.status.findMany({
        where: { projectId: input.projectId },
        select: {
          id: true,
          name: true,
        },
      });
    }),
});
