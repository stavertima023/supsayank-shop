import { PrismaClient } from "@prisma/client";

declare global {
  // Declaration only; no need for eslint override
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.__prisma__ ?? new PrismaClient({
  log: ["query", "error", "warn"],
});

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}


