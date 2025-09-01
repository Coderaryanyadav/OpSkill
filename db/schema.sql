-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('TALENT', 'COMPANY', 'ADMIN')),
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  profile_photo TEXT,
  aadhaar_number TEXT,
  aadhaar_verified BOOLEAN DEFAULT 0,
  gst_number TEXT,
  gst_verified BOOLEAN DEFAULT 0,
  is_banned BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN (
    'Event Management',
    'Hospitality',
    'Photography',
    'Catering',
    'Security',
    'Cleaning',
    'Technical Support',
    'Customer Service'
  )),
  location TEXT NOT NULL,
  pay_type TEXT NOT NULL CHECK(pay_type IN ('HOURLY', 'DAILY', 'FIXED')),
  pay_amount DECIMAL(10, 2) NOT NULL,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  talent_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED')),
  cover_letter TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(job_id, talent_id)
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  talent_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'COMPLETED', 'TERMINATED')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(payment_status IN ('PENDING', 'PARTIALLY_PAID', 'PAID')),
  total_amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  start_date TEXT NOT NULL,
  end_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (talent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  reviewee_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(contract_id, reviewer_id)
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_talent_id ON applications(talent_id);
CREATE INDEX IF NOT EXISTS idx_contracts_job_id ON contracts(job_id);
CREATE INDEX IF NOT EXISTS idx_contracts_talent_id ON contracts(talent_id);
CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);

-- Create views
CREATE VIEW IF NOT EXISTS job_cards AS
SELECT 
  j.id,
  j.title,
  j.description,
  j.category,
  j.location,
  j.pay_type,
  j.pay_amount,
  j.start_date,
  j.end_date,
  j.status,
  j.created_at,
  u.id as company_id,
  u.name as company_name,
  u.profile_photo as company_logo
FROM jobs j
JOIN users u ON j.company_id = u.id
WHERE j.status = 'OPEN';

CREATE VIEW IF NOT EXISTS talent_cards AS
SELECT 
  u.id,
  u.name,
  u.profile_photo,
  u.city,
  u.state,
  u.aadhaar_verified,
  COALESCE(AVG(r.rating), 0) as rating,
  COUNT(DISTINCT c.id) as jobs_completed
FROM users u
LEFT JOIN contracts c ON u.id = c.talent_id AND c.status = 'COMPLETED'
LEFT JOIN reviews r ON c.id = r.contract_id AND r.reviewee_id = u.id
WHERE u.role = 'TALENT' AND u.is_banned = 0
GROUP BY u.id;

-- Create triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_users_updated_at
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_jobs_updated_at
AFTER UPDATE ON jobs
BEGIN
  UPDATE jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_applications_updated_at
AFTER UPDATE ON applications
BEGIN
  UPDATE applications SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_contracts_updated_at
AFTER UPDATE ON contracts
BEGIN
  UPDATE contracts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_tickets_updated_at
AFTER UPDATE ON tickets
BEGIN
  UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
