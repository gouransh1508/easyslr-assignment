import { postRouter } from '~/server/api/routers/post';
import {
  createCallerFactory,
  createTRPCRouter,
} from '~/server/api/trpc';
import { authRouter } from './routers/auth';
import { tasksRouter } from './routers/task';
import { userRouter } from './routers/user';
import { projectsRouter } from './routers/project';
import { statusRouter } from './routers/status';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  tasks: tasksRouter,
  user: userRouter,
  project: projectsRouter,
  status: statusRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
