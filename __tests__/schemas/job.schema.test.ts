import { insertJobSchema, JOB_STATUSES, JobCategory, PayType } from '../../lib/schema';

describe('Job Schema Validation', () => {
  const validJob = {
    title: 'Event Manager',
    description: 'We are looking for a skilled event manager...',
    category: 'Event Management',
    pay_type: 'FIXED',
    pay_amount: 5000,
    status: 'OPEN',
    company_id: 1,
    location: 'New York',
    skills_required: ['event planning', 'management']
  };

  it('should validate a valid job', () => {
    const result = insertJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
  });

  it('should require title', () => {
    const job = { ...validJob, title: '' };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'title' && 
        issue.message === 'Title must be at least 5 characters'
      )).toBe(true);
    }
  });

  it('should validate title length', () => {
    const job = { 
      ...validJob, 
      title: 'A'.repeat(201) // Exceeds 200 character limit
    };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'title');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Title cannot exceed 200 characters');
    }
  });

  it('should require description', () => {
    const job = { ...validJob, description: '' };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'description' && 
        issue.message === 'Description must be at least 10 characters'
      )).toBe(true);
    }
  });

  it('should validate pay_amount is positive', () => {
    const job = { ...validJob, pay_amount: -100 };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'pay_amount');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Pay amount must be positive');
    }
  });

  it('should validate category enum', () => {
    const job = { ...validJob, category: 'INVALID_CATEGORY' };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'category');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid option: expected one of');
    }
  });

  it('should validate status enum', () => {
    const job = { ...validJob, status: 'INVALID_STATUS' };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'status');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid option: expected one of');
    }
  });

  it('should require company_id to be a number', () => {
    const job = { ...validJob, company_id: 'not-a-number' } as any;
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'company_id');
      expect(issue).toBeDefined();
      expect(issue?.message).toBe('Company ID must be a number');
    }
  });

  it('should trim whitespace from title and description', () => {
    const job = { 
      ...validJob, 
      title: '  Event Manager  ', 
      description: '  We are looking for a skilled event manager...  ' 
    };
    const result = insertJobSchema.safeParse(job);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Event Manager');
      expect(result.data.description).toBe('We are looking for a skilled event manager...');
    }
  });
});
