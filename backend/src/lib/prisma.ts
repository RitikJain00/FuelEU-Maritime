// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

// Extend the NodeJS global type to include prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Use existing Prisma client in dev to avoid multiple instances
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // optional for debugging
  })

if (process.env.NODE_ENV !== "production") global.prisma = prisma
