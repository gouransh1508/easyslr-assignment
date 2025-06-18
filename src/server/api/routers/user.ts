import { z } from 'zod';
import {
  protectedProcedure,
  createTRPCRouter,
} from '../trpc';
import { userProfileSchema } from '~/server/lib/validators/user';
import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';

export const userRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await db.user.findUnique({
          where: { id: input.id },
          select: {
            id: true,
            email: true,
            name: true,
            profilePicture: true,
            bio: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return user;
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user',
        });
      }
    }),

  updateProfile: protectedProcedure
    .input(
      userProfileSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          email: input.email,
          bio: input.bio ?? '',
        },
      });
    }),

  updateProfilePicture: protectedProcedure
    .input(z.object({ imageUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { profilePicture: input.imageUrl },
      });
    }),
});
