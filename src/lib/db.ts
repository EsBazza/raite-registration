import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Force reload after schema update
const globalForPrisma = globalThis as unknown as {
  prisma_v10: PrismaClient | undefined;
};

// Standard Next.js singleton pattern
export const db =
  globalForPrisma.prisma_v10 ??
  (() => {
    const connectionString = `${process.env.DATABASE_URL}`.trim();
    const isLocal = connectionString.includes("localhost") || 
                    connectionString.includes("127.0.0.1") ||
                    connectionString.includes("::1");
    
    // Only enforce SSL if we are definitely in production (Vercel) and not local
    const useSSL = process.env.VERCEL === "1" || (process.env.NODE_ENV === "production" && !isLocal);

    const pool = new pg.Pool({ 
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v10 = db;
