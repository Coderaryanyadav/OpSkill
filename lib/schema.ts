import { sql, relations, eq, and, or, desc, asc } from 'drizzle-orm';
import { pgTable, text, integer, real, serial, timestamp, decimal, boolean, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Re-export for convenience
export { sql, relations, eq, and, or, desc, asc } from 'drizzle-orm';
export { pgTable, text, integer, real, serial, timestamp, decimal, boolean, unique } from 'drizzle-orm/pg-core';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// =============================================
// ENUMS
// =============================================
export const UserRole = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  TALENT: 'TALENT'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const JobCategory = {
  EVENT_MANAGEMENT: 'Event Management',
  HOSPITALITY: 'Hospitality',
  PHOTOGRAPHY: 'Photography',
  CATERING: 'Catering',
  SECURITY: 'Security',
  CLEANING: 'Cleaning',
  TECHNICAL_SUPPORT: 'Technical Support',
  CUSTOMER_SERVICE: 'Customer Service'
} as const;
export type JobCategory = typeof JobCategory[keyof typeof JobCategory];

export const JOB_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type JobStatus = typeof JOB_STATUSES[number];

export const APPLICATION_STATUSES = ['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED'] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export const CONTRACT_STATUSES = ['ACTIVE', 'COMPLETED', 'TERMINATED'] as const;
export type ContractStatus = typeof CONTRACT_STATUSES[number];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED'
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
} as const;
export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;
export type TicketPriority = typeof TicketPriority[keyof typeof TicketPriority];

export const PayType = {
  HOURLY: 'HOURLY',
  DAILY: 'DAILY',
  FIXED: 'FIXED'
} as const;
export type PayType = typeof PayType[keyof typeof PayType];

// =============================================
// TABLES
// =============================================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('TALENT'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  profile_photo: text('profile_photo'),
  aadhaar_number: text('aadhaar_number'),
  aadhaar_verified: boolean('aadhaar_verified').default(false),
  gst_number: text('gst_number'),
  gst_verified: boolean('gst_verified').default(false),
  is_banned: boolean('is_banned').default(false),
  skills: text('skills'),
  bio: text('bio'),
  experience_years: integer('experience_years'),
  hourly_rate: integer('hourly_rate'),
  rating: real('rating').default(0),
  jobs_completed: integer('jobs_completed').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  company_id: integer('company_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  pay_type: text('pay_type').notNull(),
  pay_amount: decimal('pay_amount', { precision: 10, scale: 2 }).notNull(),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  status: text('status').notNull().default('OPEN'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  job_id: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('PENDING'),
  cover_letter: text('cover_letter'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
  applicationJobUserUnique: unique('application_job_user_unique').on(table.job_id, table.user_id)
}));

export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  job_id: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  talent_id: integer('talent_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  company_id: integer('company_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('ACTIVE'),
  payment_status: text('payment_status').notNull().default('PENDING'),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  amount_paid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull().default('0'),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
  contractJobTalentCompanyUnique: unique('contract_job_talent_company_unique').on(table.job_id, table.talent_id, table.company_id)
}));

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  contract_id: integer('contract_id').notNull().references(() => contracts.id, { onDelete: 'cascade' }),
  reviewer_id: integer('reviewer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
  contractReviewerUnique: unique('contract_reviewer_unique').on(table.contract_id, table.reviewer_id)
}));

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('OPEN'),
  priority: text('priority').notNull().default('MEDIUM'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// =============================================
// RELATIONS
// =============================================
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  applications: many(applications),
  contracts_as_talent: many(contracts, { relationName: 'talent_contracts' }),
  contracts_as_company: many(contracts, { relationName: 'company_contracts' }),
  reviews: many(reviews),
  tickets: many(tickets)
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(users, {
    fields: [jobs.company_id],
    references: [users.id]
  }),
  applications: many(applications),
  contracts: many(contracts)
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.job_id],
    references: [jobs.id]
  }),
  user: one(users, {
    fields: [applications.user_id],
    references: [users.id]
  })
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  job: one(jobs, {
    fields: [contracts.job_id],
    references: [jobs.id]
  }),
  talent: one(users, {
    fields: [contracts.talent_id],
    references: [users.id],
    relationName: 'talent_contracts'
  }),
  company: one(users, {
    fields: [contracts.company_id],
    references: [users.id],
    relationName: 'company_contracts'
  }),
  reviews: many(reviews)
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  contract: one(contracts, {
    fields: [reviews.contract_id],
    references: [contracts.id]
  }),
  reviewer: one(users, {
    fields: [reviews.reviewer_id],
    references: [users.id]
  })
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.user_id],
    references: [users.id]
  })
}));

// =============================================
// TYPES
// =============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

// =============================================
// SCHEMA VALIDATION
// =============================================
export const insertUserSchema = createInsertSchema(users, {
  email: () => z.string().email().toLowerCase().trim(),
  password: () => z.string().min(8),
  name: () => z.string().min(2).max(100),
  phone: () => z.string().regex(/^\+?[0-9\s-]{10,}$/).optional(),
  role: () => z.enum(['ADMIN', 'COMPANY', 'TALENT']).default('TALENT'),
  aadhaar_number: () => z.string().regex(/^\d{12}$/).optional(),
  gst_number: () => z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i).optional()
});

export const insertJobSchema = createInsertSchema(jobs, {
  title: () => z.string().min(5).max(200),
  description: () => z.string().min(10).max(10000),
  category: () => z.enum(['Event Management', 'Hospitality', 'Photography', 'Catering', 'Security', 'Cleaning', 'Technical Support', 'Customer Service']),
  pay_type: () => z.enum(['HOURLY', 'DAILY', 'FIXED']),
  pay_amount: () => z.number().positive(),
  status: () => z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('OPEN'),
  location: () => z.string().min(2).max(200)
});

export const insertApplicationSchema = createInsertSchema(applications, {
  status: () => z.enum(['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED']).default('PENDING'),
  cover_letter: () => z.string().max(10000).optional()
});

export const insertContractSchema = createInsertSchema(contracts, {
  status: () => z.enum(['ACTIVE', 'COMPLETED', 'TERMINATED']),
  payment_status: () => z.enum(['PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUNDED']),
  total_amount: () => z.number().positive(),
  amount_paid: () => z.number().min(0).default(0)
}).refine((data) => data.amount_paid <= data.total_amount, {
  message: "Amount paid cannot exceed total amount",
  path: ["amount_paid"]
});

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: () => z.number().min(1).max(5),
  comment: () => z.string().max(1000).optional()
});

export const insertTicketSchema = createInsertSchema(tickets, {
  subject: () => z.string().min(5).max(200),
  description: () => z.string().min(10).max(5000),
  status: () => z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).default('OPEN'),
  priority: () => z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM')
});

// Export enums and types for database initialization
export const jobCategories = Object.values(JobCategory);
export const jobStatuses = JOB_STATUSES;
export const applicationStatuses = APPLICATION_STATUSES;
export const contractStatuses = CONTRACT_STATUSES;
export const paymentStatuses = Object.values(PaymentStatus);
export const ticketStatuses = Object.values(TicketStatus);
export const ticketPriorities = Object.values(TicketPriority);
export const payTypes = Object.values(PayType);
export const userRoles = Object.values(UserRole);
