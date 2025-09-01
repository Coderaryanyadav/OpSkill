import { db } from './db';
import { and, eq, sql } from 'drizzle-orm';
import {
  users,
  jobs,
  applications,
  contracts,
  reviews,
  tickets,
  type User,
  type Job,
  type Application,
  type Contract,
  type Review,
  type Ticket,
} from './schema';

// User related queries
export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function updateUser(
  id: number,
  data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
): Promise<User> {
  const [user] = await db
    .update(users)
    .set({ ...data, updated_at: new Date().toISOString() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

// Job related queries
export async function createJob(data: {
  company_id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  pay_type: 'HOURLY' | 'DAILY' | 'FIXED';
  pay_amount: number;
  start_date?: string;
  end_date?: string;
}): Promise<Job> {
  const [job] = await db.insert(jobs).values(data).returning();
  return job;
}

export async function getJobById(id: number): Promise<Job | undefined> {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
  return job;
}

export async function getJobsByCompany(companyId: number): Promise<Job[]> {
  return db.select().from(jobs).where(eq(jobs.company_id, companyId));
}

export async function getJobWithCompany(id: number) {
  const [job] = await db
    .select({
      job: jobs,
      company: {
        id: users.id,
        name: users.name,
        profile_photo: users.profile_photo,
      },
    })
    .from(jobs)
    .where(eq(jobs.id, id))
    .leftJoin(users, eq(jobs.company_id, users.id));
  
  return job;
}

// Application related queries
export async function createApplication(data: {
  job_id: number;
  talent_id: number;
  cover_letter?: string;
}): Promise<Application> {
  const [application] = await db.insert(applications).values(data).returning();
  return application;
}

export async function getApplicationById(id: number): Promise<Application | undefined> {
  const [application] = await db.select().from(applications).where(eq(applications.id, id));
  return application;
}

export async function getApplicationsByJob(jobId: number): Promise<Application[]> {
  return db
    .select()
    .from(applications)
    .where(eq(applications.job_id, jobId));
}

export async function getApplicationsByTalent(talentId: number): Promise<Application[]> {
  return db
    .select()
    .from(applications)
    .where(eq(applications.talent_id, talentId));
}

// Contract related queries
export async function createContract(data: {
  job_id: number;
  talent_id: number;
  company_id: number;
  total_amount: number;
  start_date: string;
  end_date?: string;
}): Promise<Contract> {
  const [contract] = await db.insert(contracts).values({
    ...data,
    status: 'ACTIVE',
    payment_status: 'PENDING',
    amount_paid: 0,
  }).returning();
  
  return contract;
}

export async function getContractById(id: number): Promise<Contract | undefined> {
  const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
  return contract;
}

export async function getContractsByTalent(talentId: number): Promise<Contract[]> {
  return db
    .select()
    .from(contracts)
    .where(eq(contracts.talent_id, talentId));
}

export async function getContractsByCompany(companyId: number): Promise<Contract[]> {
  return db
    .select()
    .from(contracts)
    .where(eq(contracts.company_id, companyId));
}

// Review related queries
export async function createReview(data: {
  contract_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment?: string;
}): Promise<Review> {
  const [review] = await db.insert(reviews).values(data).returning();
  return review;
}

export async function getReviewsByUser(userId: number): Promise<Review[]> {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.reviewee_id, userId));
}

// Ticket related queries
export async function createTicket(data: {
  user_id: number;
  subject: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}): Promise<Ticket> {
  const [ticket] = await db.insert(tickets).values({
    ...data,
    status: 'OPEN',
    priority: data.priority || 'MEDIUM',
  }).returning();
  
  return ticket;
}

export async function getTicketsByUser(userId: number): Promise<Ticket[]> {
  return db
    .select()
    .from(tickets)
    .where(eq(tickets.user_id, userId));
}

export async function getAllTickets(): Promise<Ticket[]> {
  return db.select().from(tickets);
}

// Search functions
export async function searchJobs(filters: {
  category?: string;
  location?: string;
  minPay?: number;
  payType?: 'HOURLY' | 'DAILY' | 'FIXED';
  limit?: number;
  offset?: number;
}) {
  const { category, location, minPay, payType, limit = 20, offset = 0 } = filters;
  
  let query = db
    .select()
    .from(jobs)
    .where(eq(jobs.status, 'OPEN'))
    .orderBy(jobs.created_at)
    .limit(limit)
    .offset(offset);
    
  if (category) {
    query = query.where(and(eq(jobs.category, category), eq(jobs.status, 'OPEN')));
  }
  
  if (location) {
    query = query.where(
      and(
        sql`LOWER(${jobs.location}) LIKE ${'%' + location.toLowerCase() + '%'}`,
        eq(jobs.status, 'OPEN')
      )
    );
  }
  
  if (minPay !== undefined) {
    query = query.where(and(sql`${jobs.pay_amount} >= ${minPay}`, eq(jobs.status, 'OPEN')));
  }
  
  if (payType) {
    query = query.where(and(eq(jobs.pay_type, payType), eq(jobs.status, 'OPEN')));
  }
  
  return query;
}

export async function searchTalents(filters: {
  skills?: string[];
  location?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
}) {
  const { skills, location, minRating, limit = 20, offset = 0 } = filters;
  
  let query = db
    .select({
      id: users.id,
      name: users.name,
      profile_photo: users.profile_photo,
      city: users.city,
      state: users.state,
      aadhaar_verified: users.aadhaar_verified,
      rating: sql<number>`COALESCE(AVG(reviews.rating), 0)`,
      jobs_completed: sql<number>`COUNT(DISTINCT contracts.id)`,
    })
    .from(users)
    .leftJoin(contracts, and(
      eq(contracts.talent_id, users.id),
      eq(contracts.status, 'COMPLETED')
    ))
    .leftJoin(reviews, and(
      eq(reviews.reviewee_id, users.id)
    ))
    .where(and(
      eq(users.role, 'TALENT'),
      eq(users.is_banned, false)
    ))
    .groupBy(users.id)
    .orderBy(users.created_at)
    .limit(limit)
    .offset(offset);
    
  if (location) {
    query = query.where(
      sql`LOWER(CONCAT(${users.city}, ', ', ${users.state})) LIKE ${
        '%' + location.toLowerCase() + '%'
      }`
    );
  }
  
  if (minRating !== undefined) {
    query = query.having(sql`COALESCE(AVG(reviews.rating), 0) >= ${minRating}`);
  }
  
  const results = await query;
  
  // Filter by skills if provided
  if (skills && skills.length > 0) {
    // This is a simplified implementation
    // In a real app, you'd want to join with a skills table
    return results.filter(user => 
      skills.every(skill => 
        user.name.toLowerCase().includes(skill.toLowerCase()) ||
        user.city?.toLowerCase().includes(skill.toLowerCase()) ||
        user.state?.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }
  
  return results;
}
