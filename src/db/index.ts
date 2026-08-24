import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { getDatabase } from '@netlify/database';

let httpClient;
try {
  // Try to use Netlify's built-in DB connection which handles credentials automatically
  const netlifyDb = getDatabase();
  // @ts-ignore - The httpClient is present on the serverless driver
  // @ts-ignore
  httpClient = netlifyDb.httpClient || neon(process.env.DATABASE_URL!);
} catch (error) {
  // If getDatabase fails (e.g., local dev without netlify cli), fall back to manual env var
  // @ts-ignore
  httpClient = neon(process.env.DATABASE_URL!);
}

export const db = drizzle(httpClient, { schema });
