import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from '../../db/schema';

// Initialize the database connection with schema
export const db = drizzle(sql, { schema });

// Export types
export type { User, Job, Application } from '../../db/schema';
