import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Re-export for convenience
export { sql, relations, eq, and, or, desc, asc } from 'drizzle-orm';
export { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
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

// Job Status
export const JOB_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type JobStatus = typeof JOB_STATUSES[number];

// Application Status
export const APPLICATION_STATUSES = ['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED'] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

// Contract Status
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
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: Object.values(UserRole) }).notNull(),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  profile_photo: text('profile_photo'),
  aadhaar_number: text('aadhaar_number'),
  aadhaar_verified: integer('aadhaar_verified', { mode: 'boolean' }).default(false),
  gst_number: text('gst_number'),
  gst_verified: integer('gst_verified', { mode: 'boolean' }).default(false),
  is_banned: integer('is_banned', { mode: 'boolean' }).default(false),
  skills: text('skills'),
  bio: text('bio'),
  experience_years: integer('experience_years'),
  hourly_rate: integer('hourly_rate'),
  rating: real('rating'),
  jobs_completed: integer('jobs_completed').default(0),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  company_id: integer('company_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category', { enum: Object.values(JobCategory) as [string, ...string[]] }).notNull(),
  location: text('location').notNull(),
  pay_type: text('pay_type', { enum: Object.values(PayType) as [string, ...string[]] }).notNull(),
  pay_amount: real('pay_amount').notNull(),
  start_date: text('start_date'),
  end_date: text('end_date'),
  status: text('status', { enum: JOB_STATUSES })
    .notNull()
    .$defaultFn(() => 'OPEN' as const),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  job_id: integer('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: APPLICATION_STATUSES })
    .notNull()
    .default('PENDING'),
  cover_letter: text('cover_letter'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  unq: sql`UNIQUE(${table.job_id}, ${table.user_id})`,
}));

export const contracts = sqliteTable('contracts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  job_id: integer('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  talent_id: integer('talent_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  company_id: integer('company_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: CONTRACT_STATUSES })
    .notNull()
    .$defaultFn(() => 'ACTIVE' as const),
  payment_status: text('payment_status', { enum: Object.values(PaymentStatus) as [string, ...string[]] })
    .notNull()
    .default(PaymentStatus.PENDING),
  total_amount: real('total_amount').notNull(),
  amount_paid: real('amount_paid').default(0),
  start_date: text('start_date').notNull(),
  end_date: text('end_date'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contract_id: integer('contract_id')
    .notNull()
    .references(() => contracts.id, { onDelete: 'cascade' }),
  reviewer_id: integer('reviewer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  reviewee_id: integer('reviewee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  unq: sql`UNIQUE(${table.contract_id}, ${table.reviewer_id})`,
}));

export const tickets = sqliteTable('tickets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: Object.values(TicketStatus) as [string, ...string[]] })
    .notNull()
    .default(TicketStatus.OPEN),
  priority: text('priority', { enum: Object.values(TicketPriority) as [string, ...string[]] })
    .notNull()
    .default(TicketPriority.MEDIUM),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// =============================================
// RELATIONS
// =============================================
export const userRelations = relations(users, ({ many }) => ({
  jobs: many(jobs, { relationName: 'company_jobs' }),
  applications: many(applications, { relationName: 'talent_applications' }),
  contractsAsTalent: many(contracts, { relationName: 'talent_contracts' }),
  contractsAsCompany: many(contracts, { relationName: 'company_contracts' }),
  reviewsAsReviewer: many(reviews, { relationName: 'reviewer_reviews' }),
  reviewsAsReviewee: many(reviews, { relationName: 'reviewee_reviews' }),
  tickets: many(tickets)
}));

export const jobRelations = relations(jobs, ({ one, many }) => ({
  company: one(users, {
    fields: [jobs.company_id],
    references: [users.id],
    relationName: 'company_jobs'
  }),
  applications: many(applications),
  contracts: many(contracts)
}));

export const applicationRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.job_id],
    references: [jobs.id]
  }),
  user: one(users, {
    fields: [applications.user_id],
    references: [users.id],
    relationName: 'user_applications'
  })
}));

export const contractRelations = relations(contracts, ({ one, many }) => ({
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

export const reviewRelations = relations(reviews, ({ one }) => ({
  contract: one(contracts, {
    fields: [reviews.contract_id],
    references: [contracts.id]
  }),
  reviewer: one(users, {
    fields: [reviews.reviewer_id],
    references: [users.id],
    relationName: 'reviewer_reviews'
  }),
  reviewee: one(users, {
    fields: [reviews.reviewee_id],
    references: [users.id],
    relationName: 'reviewee_reviews'
  })
}));

export const ticketRelations = relations(tickets, ({ one }) => ({
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
  email: (schema) => z.string()
    .min(1, 'Email is required')
    .transform((val: string) => val.trim().toLowerCase())
    .pipe(z.string().email('Invalid email format')),
  password: (schema) => z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  name: (schema) => z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .transform((val: string) => val.trim()),
  phone: (schema) => z.string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,15}$/,
      'Invalid phone number format. Use +[country code][number] or local format.'
    )
    .optional(),
  role: (schema) => z.enum([
    UserRole.ADMIN,
    UserRole.COMPANY,
    UserRole.TALENT
  ] as const).default(UserRole.TALENT)
  .refine(
    (val) => Object.values(UserRole).includes(val as UserRole),
    { message: `Role must be one of: ${Object.values(UserRole).join(', ')}` }
  ),
  aadhaar_number: (schema) => z.string()
    .regex(
      /^[2-9]{1}[0-9]{11}$/,
      'Invalid Aadhaar number. Must be 12 digits and not start with 0 or 1.'
    )
    .optional(),
  gst_number: (schema) => z.string()
    .regex(
      /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i,
      'Invalid GST number format. Example: 22AAAAA0000A1Z5'
    )
    .optional()
    .transform(val => val?.toUpperCase())
});

export const insertJobSchema = createInsertSchema(jobs, {
  title: (schema) => z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .transform((val: string) => val.trim()),
  description: (schema) => z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(10000, 'Description cannot exceed 10000 characters')
    .transform((val: string) => val.trim()),
  category: (schema) => z.enum([
    JobCategory.EVENT_MANAGEMENT,
    JobCategory.HOSPITALITY,
    JobCategory.PHOTOGRAPHY,
    JobCategory.CATERING,
    JobCategory.SECURITY,
    JobCategory.CLEANING,
    JobCategory.TECHNICAL_SUPPORT,
    JobCategory.CUSTOMER_SERVICE
  ] as const),
  pay_type: (schema) => z.enum([
    PayType.HOURLY,
    PayType.DAILY,
    PayType.FIXED
  ] as const).default(PayType.FIXED),
  pay_amount: (schema) => z.number()
    .min(0, 'Pay amount must be positive')
    .max(1000000, 'Pay amount is too high'),
  status: (schema) => z.enum([
    'OPEN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
  ] as const).default('OPEN'),
  company_id: (schema) => z.number({
    message: 'Company ID must be a number'
  }).min(1, 'Company ID is required'),
  location: (schema) => z.string()
    .min(1, 'Location is required')
    .max(200, 'Location cannot exceed 200 characters')
    .transform((val: string) => val.trim())
});

export const insertApplicationSchema = createInsertSchema(applications, {
  status: (schema) => z.enum([
    'PENDING',
    'SHORTLISTED',
    'REJECTED',
    'HIRED'
  ] as const).default('PENDING'),
  cover_letter: (schema) => z.string()
    .max(10000, 'Cover letter cannot exceed 10000 characters')
    .optional()
    .transform(val => val?.trim()),
  proposed_rate: (schema) => z.number()
    .min(0, 'Proposed rate must be positive')
    .max(1000000, 'Proposed rate is too high')
    .optional(),
  estimated_days: (schema) => z.number()
    .int()
    .min(1, 'Estimated days must be at least 1')
    .max(365, 'Estimated days cannot exceed 365')
    .optional()
});

// Fixed contract schema with proper cross-field validation
export const insertContractSchema = createInsertSchema(contracts, {
  status: (schema) => z.enum([
    'ACTIVE',
    'COMPLETED',
    'TERMINATED'
  ] as const).default('ACTIVE'),
  payment_status: (schema) => z.enum([
    'PENDING',
    'PARTIALLY_PAID',
    'PAID',
    'REFUNDED'
  ] as const).default('PENDING'),
  total_amount: (schema) => z.number()
    .min(0, 'Total amount must be positive')
    .max(10000000, 'Total amount is too high'),
  amount_paid: (schema) => z.number()
    .min(0, 'Amount paid cannot be negative')
    .max(10000000, 'Amount paid is too high'),
  start_date: (schema) => z.string().datetime('Invalid start date'),
  end_date: (schema) => z.string().datetime('Invalid end date').optional()
}).refine(
  (data) => {
    // Validate amount_paid <= total_amount
    if (data.amount_paid !== undefined && data.total_amount !== undefined) {
      return data.amount_paid <= data.total_amount;
    }
    return true;
  },
  {
    message: 'Amount paid cannot exceed total amount',
    path: ['amount_paid']
  }
).refine(
  (data) => {
    // Validate end_date > start_date
    if (data.end_date && data.start_date) {
      return new Date(data.end_date) > new Date(data.start_date);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['end_date']
  }
);

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: (schema) => z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: (schema) => z.string()
    .max(2000, 'Comment cannot exceed 2000 characters')
    .optional()
    .transform((val: string | undefined) => val?.trim())
});

export const insertTicketSchema = createInsertSchema(tickets, {
  subject: (schema) => z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .transform((val: string) => val.trim()),
  description: (schema) => z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  status: (schema) => z.enum([
    'OPEN',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
  ] as const).default('OPEN'),
  priority: (schema) => z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
  ] as const).default('MEDIUM')
});
