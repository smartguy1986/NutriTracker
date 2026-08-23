import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

import { getConnectionString } from '@netlify/database';

// @ts-ignore
let connectionString = process.env.DATABASE_URL;
try {
  connectionString = getConnectionString();
} catch (error) {
  // Fall back to DATABASE_URL locally
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString!, { prepare: false });
export const db = drizzle(client, { schema });
