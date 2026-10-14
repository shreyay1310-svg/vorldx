const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'vorldx_attendance.sqlite');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance & reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  // 1. Employees table with role for RBAC
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      department TEXT NOT NULL,
      designation TEXT NOT NULL,
      shift TEXT DEFAULT 'General (09:00 AM - 06:00 PM)',
      work_type TEXT DEFAULT 'Office',
      joining_date TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      role TEXT DEFAULT 'Employee',
      avatar TEXT,
      verified INTEGER DEFAULT 1,
      password TEXT DEFAULT 'password123',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Demo Verification OTPs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      employee_id TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);

  // 3. Attendance records table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL,
      date TEXT NOT NULL,
      check_in TEXT,
      check_out TEXT,
      duration_minutes INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      mode TEXT DEFAULT 'QR_SCAN',
      kiosk_id TEXT DEFAULT 'QR001',
      late_by_minutes INTEGER DEFAULT 0,
      remarks TEXT,
      regularized_by TEXT,
      regularized_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(employee_id, date),
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);

  // 4. WFH Requests table with hierarchical workflow (Employee -> HR, HR -> Admin)
  db.exec(`
    CREATE TABLE IF NOT EXISTS wfh_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL,
      request_date TEXT NOT NULL,
      from_date TEXT,
      to_date TEXT,
      total_days INTEGER DEFAULT 1,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      requester_role TEXT DEFAULT 'Employee',
      approver_role TEXT DEFAULT 'HR',
      reviewed_by TEXT,
      reviewed_at TEXT,
      admin_comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);

  // Ensure columns exist if table was already created
  try {
    const cols = db.pragma('table_info(wfh_requests)').map(c => c.name);
    if (!cols.includes('from_date')) db.exec('ALTER TABLE wfh_requests ADD COLUMN from_date TEXT;');
    if (!cols.includes('to_date')) db.exec('ALTER TABLE wfh_requests ADD COLUMN to_date TEXT;');
    if (!cols.includes('total_days')) db.exec('ALTER TABLE wfh_requests ADD COLUMN total_days INTEGER DEFAULT 1;');
  } catch (e) {}

  // 4b. Leave Requests table with HR Approval workflow
  db.exec(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT NOT NULL,
      leave_type TEXT DEFAULT 'Casual Leave',
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      total_days INTEGER DEFAULT 1,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      requester_role TEXT DEFAULT 'Employee',
      approver_role TEXT DEFAULT 'HR',
      reviewed_by TEXT,
      reviewed_at TEXT,
      hr_comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);

  // 4c. Announcements by HR
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      priority TEXT DEFAULT 'General',
      tag TEXT DEFAULT 'HR Notice',
      author_name TEXT DEFAULT 'Sneha Verma (HR Lead)',
      author_role TEXT DEFAULT 'HR Executive',
      published_date TEXT DEFAULT CURRENT_DATE,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4d. Client Projects & Requirements assigned via Admin
  db.exec(`
    CREATE TABLE IF NOT EXISTS client_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_name TEXT NOT NULL,
      client_name TEXT NOT NULL,
      assigned_to TEXT NOT NULL DEFAULT 'All',
      assigned_by TEXT DEFAULT 'Admin (Vikram Singhania)',
      priority TEXT DEFAULT 'High Priority',
      deadline TEXT NOT NULL,
      status TEXT DEFAULT 'In Progress',
      progress_percent INTEGER DEFAULT 85,
      description TEXT,
      requirements_json TEXT,
      admin_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Policies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      company_name TEXT DEFAULT 'VORLDX INDUSTRIES PRIVATE LIMITED',
      cin TEXT DEFAULT 'U62099UP2026PTC245598',
      headquarters TEXT DEFAULT 'Lucknow, U.P., India',
      work_start_time TEXT DEFAULT '09:00',
      work_end_time TEXT DEFAULT '18:00',
      grace_period_minutes INTEGER DEFAULT 15,
      half_day_threshold_hours REAL DEFAULT 4.0,
      full_day_threshold_hours REAL DEFAULT 8.0,
      max_wfh_days_per_month INTEGER DEFAULT 4,
      qr_rotation_seconds INTEGER DEFAULT 45,
      applicable_days TEXT DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Multi-display Kiosk Displays table (Screen 8)
  db.exec(`
    CREATE TABLE IF NOT EXISTS kiosk_displays (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'Online',
      current_token TEXT,
      token_generated_at TEXT,
      token_expires_at TEXT,
      paired_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Audit Logs table (Screen 10)
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initializeDatabase();

module.exports = {
  db,
  initializeDatabase
};
