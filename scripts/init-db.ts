import { db } from '../lib/db';
import { hashPassword } from '../lib/auth';
import { faker } from '@faker-js/faker/locale/en_IN';
import { 
  users, jobs, applications, contracts, reviews, tickets,
  jobCategories, jobStatuses, applicationStatuses, contractStatuses, paymentStatuses, ticketStatuses, payTypes,
  type Job, type NewJob, type User, type NewUser, type Application, type NewApplication,
  type Contract, type NewContract, type Review, type NewReview, type Ticket, type NewTicket
} from '../lib/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type UserRole = 'TALENT' | 'COMPANY' | 'ADMIN';
type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
type PaymentStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type PayType = 'HOURLY' | 'DAILY' | 'FIXED';

const JOB_CATEGORIES = [
  'Event Management',
  'Hospitality',
  'Photography',
  'Catering',
  'Security',
  'Cleaning',
  'Technical Support',
  'Customer Service',
] as const;

async function seed() {
  console.log('🌱 Seeding database...');
  
  // Clear existing data (in reverse order of foreign key dependencies)
  console.log('Clearing existing data...');
  await db.delete(tickets).run();
  await db.delete(reviews).run();
  await db.delete(contracts).run();
  await db.delete(applications).run();
  await db.delete(jobs).run();
  await db.delete(users).run();

  console.log('✅ Database cleared');

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await hashPassword('admin123');
  const adminUser: NewUser = {
    email: 'admin@opskill.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'ADMIN',
    phone: `91${faker.string.numeric(10)}`, // Generate 10 random digits for Indian phone number
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    pincode: faker.location.zipCode('######'),
    aadhaar_verified: true,
    gst_verified: true,
  };
  
  const [admin] = await db
    .insert(users)
    .values(adminUser)
    .returning({ id: users.id });

  console.log('👨‍💼 Admin user created');

  // Create companies
  console.log('Creating companies...');
  const companies = Array(5).fill(null).map((): Omit<NewUser, 'password'> => ({
    email: faker.internet.email(),
    name: faker.company.name(),
    role: 'COMPANY',
    phone: `91${faker.string.numeric(10)}`, // Generate 10 random digits for Indian phone number
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    pincode: faker.location.zipCode('######'),
    gst_number: `22${faker.string.numeric(10)}1Z5`,
    gst_verified: faker.datatype.boolean(0.8), // 80% chance of being verified
  }));

  const companyIds = [];
  for (const company of companies) {
    const hashedPassword = await hashPassword('password');
    const newCompany: NewUser = {
      ...company,
      password: hashedPassword,
    };
    const [result] = await db
      .insert(users)
      .values(newCompany)
      .returning({ id: users.id });
    companyIds.push(result.id);
  }
  console.log(`🏢 Created ${companies.length} companies`);

  // Create talents
  console.log('Creating talents...');
  const talents = Array(20).fill(null).map((): Omit<NewUser, 'password'> => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: 'TALENT',
    phone: `91${faker.string.numeric(10)}`, // Generate 10 random digits for Indian phone number
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    pincode: faker.location.zipCode('######'),
    aadhaar_number: faker.number.int({ min: 100000000000, max: 999999999999 }).toString(),
    aadhaar_verified: faker.datatype.boolean(0.7), // 70% chance of being verified
    skills: Array(faker.number.int({ min: 3, max: 8 }))
      .fill(null)
      .map(() => faker.person.jobType())
      .join(','),
    bio: faker.person.bio(),
    experience_years: faker.number.int({ min: 0, max: 20 }),
    hourly_rate: faker.number.int({ min: 100, max: 2000 }),
    rating: Number(faker.number.float({ min: 1, max: 5 }).toFixed(1)),
    jobs_completed: faker.number.int({ min: 0, max: 50 }),
  }));

  const talentIds = [];
  for (const talent of talents) {
    const hashedPassword = await hashPassword('password');
    const newTalent: NewUser = {
      ...talent,
      password: hashedPassword,
    };
    const [result] = await db
      .insert(users)
      .values(newTalent)
      .returning({ id: users.id });
    talentIds.push(result.id);
  }

  console.log(`👥 Created ${talents.length} talents`);

  // Create jobs
  console.log('Creating jobs...');
  const jobIds = [];
  for (let i = 0; i < 30; i++) {
    const companyId = faker.helpers.arrayElement(companyIds);
    const category = faker.helpers.arrayElement(JOB_CATEGORIES);
    const payType = faker.helpers.arrayElement<PayType>(['HOURLY', 'DAILY', 'FIXED']);
    const startDate = faker.date.soon({ days: 7 });
    const endDate = faker.date.soon({ days: 30, refDate: startDate });

    const newJob: NewJob = {
      company_id: companyId,
      title: `${category} ${faker.person.jobTitle()}`,
      description: faker.lorem.paragraphs(3),
      category: category as any, // Type assertion to handle the enum type
      location: `${faker.location.city()}, ${faker.location.state()}`,
      pay_type: payType,
      pay_amount: payType === 'HOURLY' 
        ? faker.number.int({ min: 100, max: 1000 }) 
        : payType === 'DAILY' 
          ? faker.number.int({ min: 800, max: 5000 }) 
          : faker.number.int({ min: 5000, max: 50000 }),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: faker.helpers.arrayElement<JobStatus>(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
      // Removed experience_required as it's not in the schema
    };

    const [result] = await db
      .insert(jobs)
      .values(newJob)
      .returning({ id: jobs.id });
    jobIds.push(result.id);
  }
  console.log(`💼 Created ${jobIds.length} jobs`);

  // Create applications
  console.log('Creating applications...');
  
  for (const jobId of jobIds) {
    // Each job gets 1-5 applications
    const numApplications = faker.number.int({ min: 1, max: 5 });
    const jobApplicants = faker.helpers.arrayElements(talentIds, Math.min(numApplications, talentIds.length));
    
    for (const talentId of jobApplicants) {
      const newApp: NewApplication = {
        job_id: jobId,
        talent_id: talentId,
        status: faker.helpers.arrayElement(applicationStatuses),
        cover_letter: faker.lorem.paragraphs(2),
      };
      
      await db.insert(applications).values(newApp);
    }
  }

  console.log(`📝 Created ${jobIds.length * 3} applications`);

  // Create contracts for some hired applications
  console.log('Creating contracts...');
  const hiredApplications = await db
    .select()
    .from(applications)
    .where(eq(applications.status, 'HIRED'))
    .all();

  for (const app of hiredApplications) {
    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, app.job_id))
      .get();
    
    if (!job) continue;
    const companyId = job.company_id;

    const newContract: NewContract = {
      job_id: app.job_id,
      talent_id: app.talent_id,
      company_id: companyId,
      status: faker.helpers.arrayElement<ContractStatus>(['ACTIVE', 'COMPLETED', 'TERMINATED']),
      payment_status: faker.helpers.arrayElement<PaymentStatus>(['PENDING', 'PARTIALLY_PAID', 'PAID']),
      total_amount: faker.number.int({ min: 5000, max: 50000 }),
      amount_paid: faker.number.int({ min: 0, max: 50000 }),
      start_date: faker.date.recent().toISOString(),
      end_date: faker.date.soon({ days: 30 }).toISOString(),
    };

    await db.insert(contracts).values(newContract);
  }

  console.log(`📄 Created ${hiredApplications.length} contracts`);

  // Create reviews for completed contracts
  console.log('Creating reviews...');
  const completedContracts = await db
    .select()
    .from(contracts)
    .where(eq(contracts.status, 'COMPLETED'))
    .all();

  for (const contract of completedContracts) {
    // Company reviews talent
    const companyReview: NewReview = {
      contract_id: contract.id,
      reviewer_id: contract.company_id,
      reviewee_id: contract.talent_id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(2),
    };
    
    await db.insert(reviews).values(companyReview);

    // Talent reviews company
    const talentReview: NewReview = {
      contract_id: contract.id,
      reviewer_id: contract.talent_id,
      reviewee_id: contract.company_id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(2),
    };
    
    await db.insert(reviews).values(talentReview);
  }

  console.log(`⭐ Created ${completedContracts.length * 2} reviews`);

  // Create support tickets
  console.log('Creating support tickets...');
  const allUsers = await db.select().from(users).all();
  const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
  
  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(allUsers);
    const createdAt = faker.date.recent({ days: 30 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    
    const newTicket: NewTicket = {
      user_id: user.id,
      subject: faker.lorem.words(5),
      description: faker.lorem.paragraphs(2),
      status: faker.helpers.arrayElement(ticketStatuses),
      priority: faker.helpers.arrayElement(ticketPriorities),
    };
    
    await db.insert(tickets).values(newTicket);
  }

  console.log(`🎫 Created ${15} support tickets`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\n🔑 Admin login:');
  console.log('   Email: admin@opskill.com');
  console.log('   Password: admin123');
  
  // Get sample company and talent for login
  const sampleCompany = await db
    .select()
    .from(users)
    .where(eq(users.role, 'COMPANY'))
    .limit(1)
    .get();
    
  const sampleTalent = await db
    .select()
    .from(users)
    .where(eq(users.role, 'TALENT'))
    .limit(1)
    .get();
    
  if (sampleCompany) {
    console.log('\n🏢 Sample Company login:');
    console.log(`   Email: ${sampleCompany.email}`);
    console.log('   Password: password');
  }
  
  if (sampleTalent) {
    console.log('\n👤 Sample Talent login:');
    console.log(`   Email: ${sampleTalent.email}`);
    console.log('   Password: password');
  }
  
  console.log('\nYou can now start the development server with: npm run dev');
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Database seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding database:', error);
      process.exit(1);
    });
}
