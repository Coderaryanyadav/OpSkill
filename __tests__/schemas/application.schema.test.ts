import { insertApplicationSchema, APPLICATION_STATUSES } from '../../lib/schema';

describe('Application Schema Validation', () => {
  const validApplication = {
    job_id: 1,
    user_id: 2,
    cover_letter: 'I am very interested in this job opportunity...',
    proposed_rate: 50,
    estimated_days: 14,
    status: 'PENDING'
  };

  it('should validate a valid application', () => {
    const result = insertApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it('should require job_id', () => {
    const { job_id, ...application } = validApplication;
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(false);
  });

  it('should require user_id', () => {
    const { user_id, ...application } = validApplication;
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(false);
  });

  it('should require job_id to be a number', () => {
    const application = { ...validApplication, job_id: 'not-a-number' } as any;
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'job_id');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid input: expected number, received string');
    }
  });

  it('should require user_id to be a number', () => {
    const application = { ...validApplication, user_id: 'not-a-number' } as any;
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'user_id');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid input: expected number, received string');
    }
  });

  it('should handle empty cover_letter', () => {
    const application = { ...validApplication, cover_letter: '' };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cover_letter).toBe('');
    }
  });

  it('should validate cover_letter length', () => {
    const longString = 'a'.repeat(10000); // Max allowed length
    const application = { 
      ...validApplication, 
      cover_letter: longString
    };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cover_letter).toBe(longString);
    }
  });

  it('should validate cover_letter max length', () => {
    const tooLongString = 'a'.repeat(10001); // Exceeds max length
    const application = { 
      ...validApplication, 
      cover_letter: tooLongString
    };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'cover_letter');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Cover letter cannot exceed 10000 characters');
    }
  });

  it('should handle proposed_rate validation', () => {
    const application = { ...validApplication, proposed_rate: 10 };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(true);
  });

  it('should handle estimated_days validation', () => {
    const application = { ...validApplication, estimated_days: 1 };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(true);
  });

  it('should validate status enum', () => {
    const application = { ...validApplication, status: 'INVALID_STATUS' };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'status');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid option');
    }
  });

  it('should trim whitespace from cover_letter', () => {
    const application = { 
      ...validApplication, 
      cover_letter: '  I am very interested in this job opportunity...  ' 
    };
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cover_letter).toBe('I am very interested in this job opportunity...');
    }
  });

  it('should handle missing status field', () => {
    const { status, ...application } = validApplication;
    const result = insertApplicationSchema.safeParse(application);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('PENDING');
    }
  });
});
