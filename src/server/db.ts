// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { env } from '~/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export const db = prisma;
