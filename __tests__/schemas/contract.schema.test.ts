import { insertContractSchema, CONTRACT_STATUSES, PaymentStatus } from '../../lib/schema';

describe('Contract Schema Validation', () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const validContract = {
    job_id: 1,
    talent_id: 2,
    company_id: 3,
    status: 'ACTIVE',
    payment_status: 'PENDING',
    total_amount: 1000,
    amount_paid: 0,
    start_date: now.toISOString(),
    end_date: nextWeek.toISOString(),
    terms: 'Sample contract terms'
  };

  it('should validate a valid contract', () => {
    const result = insertContractSchema.safeParse(validContract);
    expect(result.success).toBe(true);
  });

  it('should validate that end_date is after start_date', () => {
    const contract = {
      ...validContract,
      start_date: nextWeek.toISOString(),
      end_date: tomorrow.toISOString(), // End date before start date
    };
    
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'end_date' && 
        issue.message === 'End date must be after start date'
      )).toBe(true);
    }
  });

  it('should validate that amount_paid does not exceed total_amount', () => {
    const contract = {
      ...validContract,
      total_amount: 1000,
      amount_paid: 1500, // Exceeds total_amount
    };
    
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'amount_paid' && 
        issue.message === 'Amount paid cannot exceed total amount'
      )).toBe(true);
    }
  });

  it('should require job_id to be a number', () => {
    const contract = { ...validContract, job_id: 'not-a-number' } as any;
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'job_id');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('expected number, received string');
    }
  });

  it('should validate contract status enum', () => {
    const contract = {
      ...validContract,
      status: 'INVALID_STATUS',
    };
    
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'status');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid option: expected one of');
    }
  });

  it('should validate payment status enum', () => {
    const contract = {
      ...validContract,
      payment_status: 'INVALID_STATUS',
    };
    
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'payment_status');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid option: expected one of');
    }
  });

  it('should handle terms field', () => {
    const contract = { 
      ...validContract, 
      terms: 'Sample contract terms' 
    };
    
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(true);
  });

  it('should handle missing optional fields', () => {
    const { terms, amount_paid, ...contract } = validContract;
    const result = insertContractSchema.safeParse(contract);
    expect(result.success).toBe(true);
  });
});
