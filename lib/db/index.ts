/**
 * Neon serverless Postgres client + Drizzle instance.
 *
 * Env var: DATABASE_URL (Neon connection string).
 * Use `vercel env pull` or set directly in .env.local.
 */

import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== "development") {
  throw new Error("DATABASE_URL is required in production");
}

// Lazy client — never throw at import time in dev so the build still works
// before credentials are provisioned.
const sql = connectionString ? neon(connectionString) : null;

export const db = sql ? drizzle(sql, { schema }) : null;

export { schema };
