import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';

export async function GET() {
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageInMB = {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB',
    };

    // Get uptime
    const uptime = process.uptime();
    
    // Format uptime
    const formatUptime = (seconds: number): string => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      
      return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
    };

    // Prepare response
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(uptime),
      database: dbHealth,
      memory: memoryUsageInMB,
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json(healthCheck);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// Set revalidation to 0 to always fetch fresh data
// This is a private endpoint, so it's fine to disable caching
export const revalidate = 0;
