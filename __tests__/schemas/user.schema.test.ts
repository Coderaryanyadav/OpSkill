import { insertUserSchema, UserRole } from '../../lib/schema';

describe('User Schema Validation', () => {
  const validUser = {
    email: 'test@example.com',
    password: 'Test@1234',
    name: 'Test User',
    role: UserRole.TALENT,
  };

  it('should validate a valid user', () => {
    const result = insertUserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should require email', () => {
    const user = { ...validUser, email: '' };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'email' && issue.message === 'Email is required'
      )).toBe(true);
    }
  });

  it('should validate email format', () => {
    const user = { ...validUser, email: 'invalid-email' };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'email' && issue.message === 'Invalid email format'
      )).toBe(true);
    }
  });

  it('should require password with minimum 8 characters', () => {
    const user = { ...validUser, password: 'short' };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'password' && 
        issue.message === 'Password must be at least 8 characters'
      )).toBe(true);
    }
  });

  it('should validate password complexity', () => {
    const user = { ...validUser, password: 'simplepassword' }; // Missing uppercase, number, special char
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'password' && 
        issue.message.includes('Password must contain at least one uppercase')
      )).toBe(true);
    }
  });

  it('should validate phone number format', () => {
    const user = { ...validUser, phone: 'invalid-phone' };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'phone' && 
        issue.message === 'Invalid phone number format. Use +[country code][number] or local format.'
      )).toBe(true);
    }
  });

  it('should validate Aadhaar number format', () => {
    const user = { 
      ...validUser, 
      aadhaar_number: '123456789012' // Starts with 1 which is invalid
    };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => 
        issue.path[0] === 'aadhaar_number' && 
        issue.message.includes('Invalid Aadhaar number')
      )).toBe(true);
    }
  });

  it('should validate GST number format', () => {
    const user = { 
      ...validUser, 
      gst_number: '12AAAAA0000A1Z5' // Invalid format (should be 15 characters)
    };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(true); // Should be valid as it's optional and format is correct
    
    // Test with invalid format (missing last character)
    const invalidUser = {
      ...validUser,
      gst_number: '12AAAAA0000A1Z' // Invalid format (too short)
    };
    const invalidResult = insertUserSchema.safeParse(invalidUser);
    expect(invalidResult.success).toBe(false);
    if (!invalidResult.success) {
      const issue = invalidResult.error.issues.find(issue => 
        issue.path[0] === 'gst_number'
      );
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid GST number format');
    }
  });

  it('should validate role enum', () => {
    const user = { ...validUser, role: 'INVALID_ROLE' };
    const result = insertUserSchema.safeParse(user);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(issue => issue.path[0] === 'role');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('Invalid option');
    }
  });

  it('should trim whitespace from name and email', () => {
    const user = { 
      ...validUser, 
      name: '  Test User  ', 
      email: '  test@example.com  ' 
    };
    const result = insertUserSchema.parse(user);
    expect(result.name).toBe('Test User');
    expect(result.email).toBe('test@example.com');
  });
});
