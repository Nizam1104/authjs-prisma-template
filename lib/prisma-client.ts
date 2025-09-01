import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

// In serverless environments, especially when using Row Level Security (RLS)
// with dynamic JWT tokens, a true "singleton" PrismaClient instance (one instance
// shared across all requests) is not feasible. Each request requires a new
// PrismaClient instance configured with its specific JWT for RLS.

// Prisma's internal connection pooling efficiently manages the underlying
// database connections, so creating a new PrismaClient instance per request
// is the recommended and correct approach for this use case.

// The `globalThis` pattern is typically used in development (e.g., Next.js hot-reloading)
// to prevent multiple *unconfigured* PrismaClient instances from being created,
// which can exhaust database connections. It's not applicable here because
// the client *must* be configured per request.

/**
 * Creates and returns a new PrismaClient instance configured with the
 * current user's Supabase JWT for Row Level Security (RLS).
 *
 * This function should be called for every request that requires database access
 * with RLS.
 *
 * @returns {Promise<PrismaClient>} A promise that resolves to a new PrismaClient instance.
 * @throws {Error} If no authenticated session is found.
 */
// export async function getPrismaClient(): Promise<PrismaClient> {
//     const session = await auth();

//     if (!session?.supabaseAccessToken) {
//         // Depending on your application's requirements, you might:
//         // 1. Throw an error (as done here) if unauthenticated access is strictly forbidden.
//         // 2. Return a PrismaClient without RLS configuration if some public data is accessible.
//         throw new Error('No authenticated session found. Cannot create Prisma client with RLS.');
//     }

//     // Create a new Prisma client with the JWT token for RLS.
//     // The `encodeURIComponent` is crucial for correctly passing the JWT in the URL.
//     const prisma = new PrismaClient({
//         datasources: {
//             db: {
//                 url: `${process.env.DATABASE_URL}?options=-c%20request.jwt.claims=${encodeURIComponent(session.supabaseAccessToken)}`
//             }
//         }
//     });

//     return prisma;
// }

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma