import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

if (!globalForPrisma.prisma) {
    // In dev, Next.js hot reload can cause multiple instances.
    const dbPath = path.join(process.cwd(), "dev.db");

    // The adapter expects a URL starting with 'file:' (or ':memory:')
    const adapter = new PrismaBetterSqlite3({
        url: `file:${dbPath}`
    });

    globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
}

export const prisma = globalForPrisma.prisma!;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
