import { sql } from '@vercel/postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { drizzle } from 'drizzle-orm/vercel-postgres';

// Run migrations
const runMigrations = async () => {
  const db = drizzle(sql);
  
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        email_verified BOOLEAN DEFAULT false,
        image VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create jobs table
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        company_id UUID REFERENCES users(id) ON DELETE CASCADE,
        location VARCHAR(255),
        salary INTEGER,
        type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create applications table
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        cover_letter TEXT,
        resume_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(job_id, user_id)
      );
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id)`;

    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations();
