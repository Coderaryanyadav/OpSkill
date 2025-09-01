import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '@/lib/env';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Connection pool configuration for server-side operations
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10, // Reduced for Supabase connection limits
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

// Event listeners for pool events
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Don't attempt to reconnect automatically as it might cause issues with Supabase
});

// For query builder (Drizzle ORM) - Client for direct queries
const queryClient = postgres(env.DATABASE_URL, {
  max: 10, // Reduced for Supabase connection limits
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
  transform: {
    undefined: null // Handle undefined values
  },
  debug: env.NODE_ENV === 'development',
  onnotice: () => {}, // Suppress notices
  onparameter: () => {} // Suppress parameter logging
});

export const db = drizzle(queryClient, { 
  schema,
  logger: env.NODE_ENV === 'development',
});

// Health check function
export async function checkDatabaseHealth(): Promise<{ status: 'healthy' | 'unhealthy'; error?: string }> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return { status: 'healthy' };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Enhanced query execution with retry logic
export async function executeQuery<T extends Record<string, any>>(
  query: string, 
  params: any[] = [], 
  maxRetries = 3
): Promise<T[]> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    const client = await pool.connect();
    
    try {
      const result = await client.query<T>(query, params);
      return result.rows;
    } catch (error) {
      lastError = error as Error;
      console.error(`Query attempt ${i + 1} failed:`, error);
      
      // If it's a connection error, wait before retrying
      if (isConnectionError(error)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      // For other errors, break the retry loop
      break;
    } finally {
      client.release();
    }
  }
  
  throw new Error(`Failed to execute query after ${maxRetries} attempts: ${lastError?.message}`);
}

// Transaction with retry logic
export async function executeTransaction<T>(
  callback: (tx: any) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {});
      lastError = error as Error;
      console.error(`Transaction attempt ${i + 1} failed:`, error);
      
      if (isConnectionError(error)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      break;
    } finally {
      client.release();
    }
  }
  
  throw new Error(`Transaction failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// Helper function to check if an error is a connection error
function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  
  const connectionErrors = [
    'ECONNREFUSED',
    'ECONNRESET',
    'ETIMEDOUT',
    'Connection terminated unexpectedly',
    'Connection terminated',
    'Connection error',
    'getaddrinfo ENOTFOUND',
    'Connection terminated due to connection timeout',
  ];
  
  return connectionErrors.some(err => 
    error.message.includes(err) || 
    (error as any).code === err ||
    (error as any).name === err
  );
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing database connections...');
  await pool.end();
  console.log('Database connections closed.');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing database connections...');
  await pool.end();
  console.log('Database connections closed.');
  process.exit(0);
});

// Initialize the database with schema if it doesn't exist
export async function initDb() {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      throw new Error('Database initialization should only happen on the server');
    }

    // Enable required extensions
    await queryClient`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `;
    
    // Get the directory name of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    try {
      // Path to the schema file
      const schemaPath = join(__dirname, '../../db/schema.sql');
      
      // Import the SQL from schema.sql
      const { readFile } = await import('fs/promises');
      const schemaSql = await readFile(schemaPath, 'utf-8');
      
      // Execute the schema SQL in a transaction
      await queryClient.begin(async (sql) => {
        await sql.unsafe(schemaSql);
      });
      
      console.log('✅ Database schema initialized successfully');
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn('⚠️  No schema.sql file found. Skipping schema initialization.');
        return true;
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}
// This function can be used to run database migrations
export async function runMigrations() {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      throw new Error('Migrations should only be run on the server');
    }

    console.log('🔁 Running database migrations...');
    
    // Add your migration logic here
    // Example:
    // await queryClient`
    //   -- Your migration SQL here
    // `;
    
    console.log('✅ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to run database migrations:', error);
    throw error;
  }
}

// Client-side database access
export function getClient() {
  if (typeof window === 'undefined') {
    throw new Error('getClient should only be used on the client side');
  }
  
  // This would be replaced with your client-side database access logic
  // For example, using Supabase client directly in the browser
  return {
    query: async (sql: string, params: any[] = []) => {
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
      });
      
      if (!response.ok) {
        throw new Error('Database query failed');
      }
      
      return response.json();
    }
  };
}

export default db;
