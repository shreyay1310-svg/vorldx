-- ========================================================
-- VorldX Attendance 360 - SQLite Complete Database Dump
-- Corporate Solution: VORLDX INDUSTRIES PRIVATE LIMITED
-- Date: October 2026
-- ========================================================

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- --------------------------------------------------------
-- Table structure: leave_requests
-- --------------------------------------------------------
DROP TABLE IF EXISTS "leave_requests";
CREATE TABLE leave_requests (
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

-- Data for table: leave_requests (5 records)
INSERT INTO "leave_requests" ("id", "employee_id", "leave_type", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "hr_comment", "created_at") VALUES (11, 'EMP020', 'Casual Leave', '16 Oct 2026', '17 Oct 2026', 2, 'Family function', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "leave_requests" ("id", "employee_id", "leave_type", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "hr_comment", "created_at") VALUES (12, 'EMP012', 'Sick Leave', '18 Oct 2026', '19 Oct 2026', 2, 'Health issue', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "leave_requests" ("id", "employee_id", "leave_type", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "hr_comment", "created_at") VALUES (13, 'EMP001', 'Earned Leave', '20 Oct 2026', '22 Oct 2026', 3, 'Personal work', 'Approved', 'Employee', 'HR', 'Sneha Verma (HR Lead)', '19 Oct 2026, 11:30 AM', 'Approved by HR', '2026-10-15 08:39:22');
INSERT INTO "leave_requests" ("id", "employee_id", "leave_type", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "hr_comment", "created_at") VALUES (14, 'EMP005', 'Casual Leave', '25 Oct 2026', '25 Oct 2026', 1, 'Family function', 'Rejected', 'Employee', 'HR', 'Sneha Verma (HR Lead)', '24 Oct 2026, 04:45 PM', 'Not approved due to release milestone', '2026-10-15 08:39:22');
INSERT INTO "leave_requests" ("id", "employee_id", "leave_type", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "hr_comment", "created_at") VALUES (15, 'VX002', 'Casual Leave', '10 Oct 2026', '11 Oct 2026', 2, 'Personal work', 'Approved', 'HR', 'Admin', 'Vikram Singhania (Admin)', '09 Oct 2026', 'Approved by Admin', '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: announcements
-- --------------------------------------------------------
DROP TABLE IF EXISTS "announcements";
CREATE TABLE announcements (
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

-- Data for table: announcements (9 records)
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (1, '🪔 Diwali Festive Bonus & Extended Office Holidays', 'Management is thrilled to announce Diwali festival bonuses for all employees! Office will observe official holidays from 31st Oct to 3rd Nov 2026. Sweet distribution will take place in the cafeteria on 29th Oct at 4:30 PM.', 'Celebration', 'Festive Notice', 'Sneha Verma (HR Lead)', 'HR Executive', '14 Oct 2026', 1, '2026-10-14 06:33:08');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (2, '📢 Q4 Company Town Hall & Product Showcase', 'All employees are cordially invited to the Q4 Town Hall on Friday, 24th Oct 2026 at 3:00 PM (Hybrid: Lucknow HQ Auditorium & Meet). Leadership will share corporate milestones and live enterprise client achievements.', 'Urgent', 'All Hands', 'Sneha Verma (HR Lead)', 'HR Executive', '13 Oct 2026', 1, '2026-10-14 06:33:08');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (3, '📋 Updated WFH & Leave Regularization Policy Guidelines', 'Effective immediately: All WFH and Leave applications must be submitted with From & To calendar dates in advance via the VorldX Employee App. HR approval decisions can now be tracked live with reviewer remarks.', 'Policy', 'HR Policy', 'Sneha Verma (HR Lead)', 'HR Executive', '11 Oct 2026', 1, '2026-10-14 06:33:08');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (4, '🪔 Diwali Festive Bonus & Extended Office Holidays', 'Management is thrilled to announce Diwali festival bonuses for all employees! Office will observe official holidays from 31st Oct to 3rd Nov 2026. Sweet distribution will take place in the cafeteria on 29th Oct at 4:30 PM.', 'Celebration', 'Festive Notice', 'Sneha Verma (HR Lead)', 'HR Executive', '14 Oct 2026', 1, '2026-10-14 09:41:29');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (5, '📢 Q4 Company Town Hall & Product Showcase', 'All employees are cordially invited to the Q4 Town Hall on Friday, 24th Oct 2026 at 3:00 PM (Hybrid: Lucknow HQ Auditorium & Meet). Leadership will share corporate milestones and live enterprise client achievements.', 'Urgent', 'All Hands', 'Sneha Verma (HR Lead)', 'HR Executive', '13 Oct 2026', 1, '2026-10-14 09:41:29');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (6, '📋 Updated WFH & Leave Regularization Policy Guidelines', 'Effective immediately: All WFH and Leave applications must be submitted with From & To calendar dates in advance via the VorldX Employee App. HR approval decisions can now be tracked live with reviewer remarks.', 'Policy', 'HR Policy', 'Sneha Verma (HR Lead)', 'HR Executive', '11 Oct 2026', 1, '2026-10-14 09:41:29');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (7, '🪔 Diwali Festive Bonus & Extended Office Holidays', 'Management is thrilled to announce Diwali festival bonuses for all employees! Office will observe official holidays from 31st Oct to 3rd Nov 2026. Sweet distribution will take place in the cafeteria on 29th Oct at 4:30 PM.', 'Celebration', 'Festive Notice', 'Sneha Verma (HR Lead)', 'HR Executive', '14 Oct 2026', 1, '2026-10-15 08:39:22');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (8, '📢 Q4 Company Town Hall & Product Showcase', 'All employees are cordially invited to the Q4 Town Hall on Friday, 24th Oct 2026 at 3:00 PM (Hybrid: Lucknow HQ Auditorium & Meet). Leadership will share corporate milestones and live enterprise client achievements.', 'Urgent', 'All Hands', 'Sneha Verma (HR Lead)', 'HR Executive', '13 Oct 2026', 1, '2026-10-15 08:39:22');
INSERT INTO "announcements" ("id", "title", "content", "priority", "tag", "author_name", "author_role", "published_date", "is_active", "created_at") VALUES (9, '📋 Updated WFH & Leave Regularization Policy Guidelines', 'Effective immediately: All WFH and Leave applications must be submitted with From & To calendar dates in advance via the VorldX Employee App. HR approval decisions can now be tracked live with reviewer remarks.', 'Policy', 'HR Policy', 'Sneha Verma (HR Lead)', 'HR Executive', '11 Oct 2026', 1, '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: client_projects
-- --------------------------------------------------------
DROP TABLE IF EXISTS "client_projects";
CREATE TABLE client_projects (
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

-- Data for table: client_projects (3 records)
INSERT INTO "client_projects" ("id", "project_name", "client_name", "assigned_to", "assigned_by", "priority", "deadline", "status", "progress_percent", "description", "requirements_json", "admin_notes", "created_at") VALUES (1, 'VorldX Attendance AI & Biometric QR Terminal', 'Alpha Corp Global (Enterprise Client)', 'All', 'Admin (Vikram Singhania)', 'High Priority 🔥', '28 Oct 2026', 'Sprint 4 (In Progress)', 85, 'Enterprise-grade employee attendance tracking system with rotating QR biometrics, mobile Android APK, multi-day WFH/Leave management, and real-time HR approval tracking.', '[{"id":"REQ-101","title":"Multi-Day Leave Application with Calendar Date Selection","desc":"Employee can select From Date and To Date using native calendar pickers, specify leave type (Casual, Sick, Paid), and submit reasons.","status":"Completed","priority":"High 🔥","client_note":"Verified - user can pick date ranges easily on mobile."},{"id":"REQ-102","title":"Multi-Day WFH Request with Calendar Range Pickers","desc":"Work From Home form must accept From Date & To Date calendar pickers with auto-calculated working day counts and remote reasons.","status":"Completed","priority":"High 🔥","client_note":"Verified - matches company remote work policy."},{"id":"REQ-103","title":"Real-time HR Approval Status Tracking Receipt","desc":"Clear visual status (🟢 Approved, 🔴 Rejected, 🟡 Pending) displaying HR Reviewer name, review timestamp, and HR remarks.","status":"Completed","priority":"High 🔥","client_note":"Critical for compliance - transparency on who approved each request."},{"id":"REQ-104","title":"HR Broadcast Announcements Feed on Employee Dashboard","desc":"Direct announcements channel from HR to employees for urgent notices, festive bonus updates, and holiday circulars.","status":"Completed","priority":"Medium ⚡","client_note":"Improves internal team engagement."},{"id":"REQ-105","title":"Offline-First APK Support & Zero-Latency Sync","desc":"Seamless mobile execution when away from office network with fast local caching and automatic sync.","status":"Completed","priority":"High 🔥","client_note":"Approved for Android APK distribution."},{"id":"REQ-106","title":"Final Client Demo & Production Sign-off Meeting","desc":"Live interactive presentation with Alpha Corp leadership on 28th October 2026.","status":"In Progress","priority":"High 🔥","client_note":"Scheduled for 28 Oct 2026 11:00 AM."}]', 'Admin Vikram Singhania: "Alpha Corp client has requested strict compliance on real-time HR approval tracking and HR announcements directly in the employee mobile app. Great progress so far!"', '2026-10-14 06:33:08');
INSERT INTO "client_projects" ("id", "project_name", "client_name", "assigned_to", "assigned_by", "priority", "deadline", "status", "progress_percent", "description", "requirements_json", "admin_notes", "created_at") VALUES (2, 'VorldX Attendance AI & Biometric QR Terminal', 'Alpha Corp Global (Enterprise Client)', 'All', 'Admin (Vikram Singhania)', 'High Priority 🔥', '28 Oct 2026', 'Sprint 4 (In Progress)', 85, 'Enterprise-grade employee attendance tracking system with rotating QR biometrics, mobile Android APK, multi-day WFH/Leave management, and real-time HR approval tracking.', '[{"id":"REQ-101","title":"Multi-Day Leave Application with Calendar Date Selection","desc":"Employee can select From Date and To Date using native calendar pickers, specify leave type (Casual, Sick, Paid), and submit reasons.","status":"Completed","priority":"High 🔥","client_note":"Verified - user can pick date ranges easily on mobile."},{"id":"REQ-102","title":"Multi-Day WFH Request with Calendar Range Pickers","desc":"Work From Home form must accept From Date & To Date calendar pickers with auto-calculated working day counts and remote reasons.","status":"Completed","priority":"High 🔥","client_note":"Verified - matches company remote work policy."},{"id":"REQ-103","title":"Real-time HR Approval Status Tracking Receipt","desc":"Clear visual status (🟢 Approved, 🔴 Rejected, 🟡 Pending) displaying HR Reviewer name, review timestamp, and HR remarks.","status":"Completed","priority":"High 🔥","client_note":"Critical for compliance - transparency on who approved each request."},{"id":"REQ-104","title":"HR Broadcast Announcements Feed on Employee Dashboard","desc":"Direct announcements channel from HR to employees for urgent notices, festive bonus updates, and holiday circulars.","status":"Completed","priority":"Medium ⚡","client_note":"Improves internal team engagement."},{"id":"REQ-105","title":"Offline-First APK Support & Zero-Latency Sync","desc":"Seamless mobile execution when away from office network with fast local caching and automatic sync.","status":"Completed","priority":"High 🔥","client_note":"Approved for Android APK distribution."},{"id":"REQ-106","title":"Final Client Demo & Production Sign-off Meeting","desc":"Live interactive presentation with Alpha Corp leadership on 28th October 2026.","status":"In Progress","priority":"High 🔥","client_note":"Scheduled for 28 Oct 2026 11:00 AM."}]', 'Admin Vikram Singhania: "Alpha Corp client has requested strict compliance on real-time HR approval tracking and HR announcements directly in the employee mobile app. Great progress so far!"', '2026-10-14 09:41:29');
INSERT INTO "client_projects" ("id", "project_name", "client_name", "assigned_to", "assigned_by", "priority", "deadline", "status", "progress_percent", "description", "requirements_json", "admin_notes", "created_at") VALUES (3, 'VorldX Attendance AI & Biometric QR Terminal', 'Alpha Corp Global (Enterprise Client)', 'All', 'Admin (Vikram Singhania)', 'High Priority 🔥', '28 Oct 2026', 'Sprint 4 (In Progress)', 85, 'Enterprise-grade employee attendance tracking system with rotating QR biometrics, mobile Android APK, multi-day WFH/Leave management, and real-time HR approval tracking.', '[{"id":"REQ-101","title":"Multi-Day Leave Application with Calendar Date Selection","desc":"Employee can select From Date and To Date using native calendar pickers, specify leave type (Casual, Sick, Paid), and submit reasons.","status":"Completed","priority":"High 🔥","client_note":"Verified - user can pick date ranges easily on mobile."},{"id":"REQ-102","title":"Multi-Day WFH Request with Calendar Range Pickers","desc":"Work From Home form must accept From Date & To Date calendar pickers with auto-calculated working day counts and remote reasons.","status":"Completed","priority":"High 🔥","client_note":"Verified - matches company remote work policy."},{"id":"REQ-103","title":"Real-time HR Approval Status Tracking Receipt","desc":"Clear visual status (🟢 Approved, 🔴 Rejected, 🟡 Pending) displaying HR Reviewer name, review timestamp, and HR remarks.","status":"Completed","priority":"High 🔥","client_note":"Critical for compliance - transparency on who approved each request."},{"id":"REQ-104","title":"HR Broadcast Announcements Feed on Employee Dashboard","desc":"Direct announcements channel from HR to employees for urgent notices, festive bonus updates, and holiday circulars.","status":"Completed","priority":"Medium ⚡","client_note":"Improves internal team engagement."},{"id":"REQ-105","title":"Offline-First APK Support & Zero-Latency Sync","desc":"Seamless mobile execution when away from office network with fast local caching and automatic sync.","status":"Completed","priority":"High 🔥","client_note":"Approved for Android APK distribution."},{"id":"REQ-106","title":"Final Client Demo & Production Sign-off Meeting","desc":"Live interactive presentation with Alpha Corp leadership on 28th October 2026.","status":"In Progress","priority":"High 🔥","client_note":"Scheduled for 28 Oct 2026 11:00 AM."}]', 'Admin Vikram Singhania: "Alpha Corp client has requested strict compliance on real-time HR approval tracking and HR announcements directly in the employee mobile app. Great progress so far!"', '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: employees
-- --------------------------------------------------------
DROP TABLE IF EXISTS "employees";
CREATE TABLE employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
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

-- Data for table: employees (12 records)
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('EMP001', 'Neha Singh', 'neha.singh@vorldx.com', '9876543211', 'Flat 12, Gomti Nagar, Lucknow, UP - 226010', 'Software Development', 'Developer', 'General (9:00 AM - 6:00 PM)', 'Office', '10 Jan 2024', 'Active', 'Employee', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('EMP005', 'Rohit Sharma', 'rohit.sharma@vorldx.com', '9876543210', 'Flat 402, Shalimar Heights, Gomti Nagar Ext., Lucknow, UP - 226010', 'Product Design', 'Designer', 'General (9:00 AM - 6:00 PM)', 'Office', '12 Feb 2024', 'Active', 'Employee', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('EMP012', 'Pooja Yadav', 'pooja.yadav@vorldx.com', '9654321876', 'House No 12/B, Aliganj Main Road, Lucknow, UP - 226024', 'Human Resources', 'Executive', 'General (9:00 AM - 6:00 PM)', 'Office', '01 Mar 2024', 'Active', 'Employee', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('EMP018', 'Amit Kumar', 'amit.kumar@vorldx.com', '9723456789', 'Plot 88, Sector 14, Vikas Nagar, Lucknow, UP - 226022', 'Operations', 'Manager', 'General (9:00 AM - 6:00 PM)', 'Office', '15 Apr 2024', 'Active', 'Employee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('EMP020', 'Karan Mehta', 'karan.mehta@vorldx.com', '9543219870', 'Flat 101, Eldeco Greens, Gomti Nagar, Lucknow, UP - 226010', 'Marketing', 'Associate', 'General (9:00 AM - 6:00 PM)', 'Office', '01 May 2024', 'Active', 'Employee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('VX001', 'Rohit S.', 'rohit.dev@vorldx.com', '9876543219', 'Flat 402, Shalimar Heights, Gomti Nagar Ext., Lucknow, UP - 226010', 'Development', 'SDE', 'General (9:00 AM - 6:00 PM)', 'Office', '01 Jan 2026', 'Active', 'Employee', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('VX002', 'Sneha Verma', 'sneha.verma@vorldx.com', '9811122334', 'B-14, Indira Nagar, Near Wave Mall, Lucknow, UP - 226016', 'HR', 'HR Executive', 'General (9:00 AM - 6:00 PM)', 'Office', '15 Feb 2026', 'Active', 'HR', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('VX003', 'Amit K.', 'amit.design@vorldx.com', '9723456788', 'Plot 88, Sector 14, Vikas Nagar, Lucknow, UP - 226022', 'Design', 'UI/UX', 'General (9:00 AM - 6:00 PM)', 'Hybrid', '01 Mar 2026', 'Active', 'Employee', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('VX004', 'Pooja Singh', 'pooja.singh@vorldx.com', '9654321876', 'House No 12/B, Aliganj Main Road, Lucknow, UP - 226024', 'Testing', 'QA', 'General (9:00 AM - 6:00 PM)', 'Office', '10 Mar 2026', 'Active', 'Employee', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('VX005', 'Karan M.', 'karan.ops@vorldx.com', '9543219871', 'Flat 101, Eldeco Greens, Gomti Nagar, Lucknow, UP - 226010', 'Operations', 'Manager', 'General (9:00 AM - 6:00 PM)', 'Office', '01 Apr 2026', 'Active', 'Employee', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', 1, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('VX006', 'Neha Gupta', 'neha.gupta@vorldx.com', '9432109876', 'C-45, Mahanagar Ext., Lucknow, UP - 226006', 'Marketing', 'Executive', 'General (9:00 AM - 6:00 PM)', 'Office', '12 May 2026', 'Inactive', 'Employee', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80', 0, 'password123', '2026-10-15 08:39:22');
INSERT INTO "employees" ("id", "name", "email", "phone", "address", "department", "designation", "shift", "work_type", "joining_date", "status", "role", "avatar", "verified", "password", "created_at") VALUES ('ADMIN01', 'Vikram Singhania', 'admin@vorldx.com', '9321098765', 'Penthouse 12, Cyber Heights, Vibhuti Khand, Lucknow, UP - 226010', 'Management', 'Managing Director & Admin', 'General (9:00 AM - 6:00 PM)', 'Office', '01 Jan 2025', 'Active', 'Admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', 1, 'adminpassword', '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: verification_tokens
-- --------------------------------------------------------
DROP TABLE IF EXISTS "verification_tokens";
CREATE TABLE verification_tokens (
      employee_id TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );

-- Data for table: verification_tokens (1 records)
INSERT INTO "verification_tokens" ("employee_id", "otp", "expires_at", "created_at") VALUES ('VX006', '123456', '2026-10-15 09:39:22', '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: attendance
-- --------------------------------------------------------
DROP TABLE IF EXISTS "attendance";
CREATE TABLE attendance (
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

-- Data for table: attendance (76 records)
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (1, 'VX001', '2026-10-15', '09:05 AM', '06:02 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'On-time check in via Office Reception Display', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (2, 'VX002', '2026-10-15', '09:35 AM', '06:10 PM', 515, 'Late', 'QR_SCAN', 'QR001', 20, 'Late arrival past grace period (15m)', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (3, 'VX003', '2026-10-15', '09:10 AM', '06:05 PM', 535, 'Present', 'QR_SCAN', 'QR002', 0, 'Floor 2 Display check-in', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (4, 'VX004', '2026-10-15', '09:00 AM', '06:00 PM', 540, 'WFH', 'WFH_APPROVED', 'REMOTE', 0, 'Approved Work From Home', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (5, 'VX005', '2026-10-15', '09:00 AM', '06:00 PM', 540, 'Present', 'QR_SCAN', 'QR001', 0, 'On-time arrival', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (6, 'VX006', '2026-10-15', NULL, NULL, 0, 'Absent', 'ABSENT', NULL, 0, 'No check-in recorded', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (7, 'VX001', '2026-10-01', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-01', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (8, 'VX002', '2026-10-01', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-01', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (9, 'VX003', '2026-10-01', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-01', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (10, 'VX004', '2026-10-01', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-01', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (11, 'VX005', '2026-10-01', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-01', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (12, 'VX001', '2026-10-02', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-02', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (13, 'VX002', '2026-10-02', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-02', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (14, 'VX003', '2026-10-02', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-02', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (15, 'VX004', '2026-10-02', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-02', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (16, 'VX005', '2026-10-02', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-02', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (17, 'VX001', '2026-10-03', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-03', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (18, 'VX002', '2026-10-03', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-03', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (19, 'VX003', '2026-10-03', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-03', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (20, 'VX004', '2026-10-03', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-03', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (21, 'VX005', '2026-10-03', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-03', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (22, 'VX001', '2026-10-04', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-04', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (23, 'VX002', '2026-10-04', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-04', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (24, 'VX003', '2026-10-04', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-04', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (25, 'VX004', '2026-10-04', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-04', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (26, 'VX005', '2026-10-04', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-04', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (27, 'VX001', '2026-10-05', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-05', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (28, 'VX002', '2026-10-05', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-05', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (29, 'VX003', '2026-10-05', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-05', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (30, 'VX004', '2026-10-05', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-05', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (31, 'VX005', '2026-10-05', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-05', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (32, 'VX001', '2026-10-06', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-06', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (33, 'VX002', '2026-10-06', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-06', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (34, 'VX003', '2026-10-06', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-06', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (35, 'VX004', '2026-10-06', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-06', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (36, 'VX005', '2026-10-06', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-06', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (37, 'VX001', '2026-10-07', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-07', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (38, 'VX002', '2026-10-07', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-07', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (39, 'VX003', '2026-10-07', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-07', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (40, 'VX004', '2026-10-07', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-07', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (41, 'VX005', '2026-10-07', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-07', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (42, 'VX001', '2026-10-08', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-08', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (43, 'VX002', '2026-10-08', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-08', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (44, 'VX003', '2026-10-08', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-08', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (45, 'VX004', '2026-10-08', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-08', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (46, 'VX005', '2026-10-08', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-08', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (47, 'VX001', '2026-10-09', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-09', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (48, 'VX002', '2026-10-09', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-09', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (49, 'VX003', '2026-10-09', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-09', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (50, 'VX004', '2026-10-09', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-09', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (51, 'VX005', '2026-10-09', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-09', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (52, 'VX001', '2026-10-10', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-10', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (53, 'VX002', '2026-10-10', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-10', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (54, 'VX003', '2026-10-10', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-10', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (55, 'VX004', '2026-10-10', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-10', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (56, 'VX005', '2026-10-10', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-10', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (57, 'VX001', '2026-10-11', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-11', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (58, 'VX002', '2026-10-11', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-11', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (59, 'VX003', '2026-10-11', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-11', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (60, 'VX004', '2026-10-11', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-11', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (61, 'VX005', '2026-10-11', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-11', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (62, 'VX001', '2026-10-12', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-12', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (63, 'VX002', '2026-10-12', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-12', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (64, 'VX003', '2026-10-12', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-12', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (65, 'VX004', '2026-10-12', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-12', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (66, 'VX005', '2026-10-12', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-12', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (67, 'VX001', '2026-10-13', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-13', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (68, 'VX002', '2026-10-13', '09:32 AM', '06:01 PM', 537, 'Late', 'QR_SCAN', 'QR001', 17, 'Attendance for 2026-10-13', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (69, 'VX003', '2026-10-13', NULL, NULL, 0, 'Absent', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-13', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (70, 'VX004', '2026-10-13', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-13', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (71, 'VX005', '2026-10-13', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-13', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (72, 'VX001', '2026-10-14', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-14', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (73, 'VX002', '2026-10-14', '09:00 AM', '06:00 PM', 537, 'WFH', 'WFH_APPROVED', 'QR001', 0, 'Attendance for 2026-10-14', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (74, 'VX003', '2026-10-14', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-14', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (75, 'VX004', '2026-10-14', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-14', NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "attendance" ("id", "employee_id", "date", "check_in", "check_out", "duration_minutes", "status", "mode", "kiosk_id", "late_by_minutes", "remarks", "regularized_by", "regularized_at", "created_at") VALUES (76, 'VX005', '2026-10-14', '09:04 AM', '06:01 PM', 537, 'Present', 'QR_SCAN', 'QR001', 0, 'Attendance for 2026-10-14', NULL, NULL, '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: wfh_requests
-- --------------------------------------------------------
DROP TABLE IF EXISTS "wfh_requests";
CREATE TABLE wfh_requests (
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

-- Data for table: wfh_requests (10 records)
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (1, 'VX001', '2026-10-15 to 2026-10-16', '2026-10-15', '2026-10-16', 2, 'High-focus backend API development & offline sync verification', 'Approved', 'Employee', 'HR', 'Sneha Verma (HR Lead)', '14 Oct 2026, 04:30 PM', 'Approved for 2 days. Ensure daily sprint commits are pushed to GitHub.', '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (2, 'VX001', '2026-10-09 to 2026-10-09', '2026-10-09', '2026-10-09', 1, 'Personal work & residential fiber maintenance', 'Approved', 'Employee', 'HR', 'Sneha Verma (HR Lead)', '08 Oct 2026, 05:00 PM', 'Approved. Fiber technician visit confirmed.', '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (3, 'VX001', '2026-10-02 to 2026-10-02', '2026-10-02', '2026-10-02', 1, 'Family event out of town', 'Rejected', 'Employee', 'HR', 'Sneha Verma (HR Lead)', '01 Oct 2026, 02:15 PM', 'Rejected. All-hands sprint planning was mandatory on-site in office.', '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (4, 'VX001', '2026-10-23 to 2026-10-24', '2026-10-23', '2026-10-24', 2, 'Deep architectural refactoring for client release module', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (5, 'EMP001', '14 Oct 2026', '2026-10-14', '2026-10-14', 1, 'Family function', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (6, 'EMP005', '14 Oct 2026', '2026-10-14', '2026-10-14', 1, 'Personal work', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (7, 'EMP012', '15 Oct 2026', '2026-10-15', '2026-10-15', 1, 'Health issue', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (8, 'EMP018', '15 Oct 2026', '2026-10-15', '2026-10-15', 1, 'Doctor appointment', 'Pending', 'Employee', 'HR', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (9, 'VX002', '16 Oct 2026', '2026-10-16', '2026-10-16', 1, 'Health issue', 'Pending', 'HR', 'Admin', NULL, NULL, 'Waiting for Admin approval', '2026-10-15 08:39:22');
INSERT INTO "wfh_requests" ("id", "employee_id", "request_date", "from_date", "to_date", "total_days", "reason", "status", "requester_role", "approver_role", "reviewed_by", "reviewed_at", "admin_comment", "created_at") VALUES (10, 'VX002', '05 Oct 2026', '2026-10-05', '2026-10-05', 1, 'Family function', 'Rejected', 'HR', 'Admin', 'Vikram Singhania (Admin)', '04 Oct 2026', 'Not approved', '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: policies
-- --------------------------------------------------------
DROP TABLE IF EXISTS "policies";
CREATE TABLE policies (
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

-- Data for table: policies (1 records)
INSERT INTO "policies" ("id", "company_name", "cin", "headquarters", "work_start_time", "work_end_time", "grace_period_minutes", "half_day_threshold_hours", "full_day_threshold_hours", "max_wfh_days_per_month", "qr_rotation_seconds", "applicable_days", "updated_at") VALUES (1, 'VORLDX INDUSTRIES PRIVATE LIMITED', 'CIN: U62099UP2026PTC245598', 'Headquartered in Lucknow, U.P., India', '09:00', '18:00', 15, 4, 8, 4, 45, 'Monday,Tuesday,Wednesday,Thursday,Friday', '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: kiosk_displays
-- --------------------------------------------------------
DROP TABLE IF EXISTS "kiosk_displays";
CREATE TABLE kiosk_displays (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'Online',
      current_token TEXT,
      token_generated_at TEXT,
      token_expires_at TEXT,
      paired_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

-- Data for table: kiosk_displays (4 records)
INSERT INTO "kiosk_displays" ("id", "name", "location", "status", "current_token", "token_generated_at", "token_expires_at", "paired_at") VALUES ('QR001', 'Office Reception Display', 'Main Office - Lucknow', 'Online', 'VX-QR001-MVAKIV4E-6FE97978', '2026-10-16 06:09:56', '2026-10-16 06:10:41', '2026-10-15 08:39:22');
INSERT INTO "kiosk_displays" ("id", "name", "location", "status", "current_token", "token_generated_at", "token_expires_at", "paired_at") VALUES ('QR002', 'Floor 2 Display', '2nd Floor', 'Online', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "kiosk_displays" ("id", "name", "location", "status", "current_token", "token_generated_at", "token_expires_at", "paired_at") VALUES ('QR003', 'Floor 3 Display', '3rd Floor', 'Offline', NULL, NULL, NULL, '2026-10-15 08:39:22');
INSERT INTO "kiosk_displays" ("id", "name", "location", "status", "current_token", "token_generated_at", "token_expires_at", "paired_at") VALUES ('QR004', 'Meeting Room Display', 'Meeting Room A', 'Online', NULL, NULL, NULL, '2026-10-15 08:39:22');

-- --------------------------------------------------------
-- Table structure: audit_logs
-- --------------------------------------------------------
DROP TABLE IF EXISTS "audit_logs";
CREATE TABLE audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );

-- Data for table: audit_logs (12 records)
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (1, 'Admin', 'Approved WFH', 'Sneha Verma - 15 Oct', '15 Oct 10:30 AM');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (2, 'HR', 'Added new employee', 'Karan Mehta', '15 Oct 10:00 AM');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (3, 'Rohit Sharma', 'Check-in recorded', 'Office QR - Reception', '15 Oct 09:05 AM');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (4, 'Sneha Verma', 'Check-out updated', 'Manually regularized', '14 Oct 06:10 PM');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (5, 'Admin', 'Grace period changed', 'Grace period: 15 min', '13 Oct 11:20 AM');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (6, 'Pooja Singh', 'Submitted WFH request', '13 Oct - Internet issue', '11 Oct 01:20 PM');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (7, 'Sneha Verma', 'PORTAL_LOGIN', 'HR login via web portal (sneha.verma@vorldx.com)', '2026-10-15 08:44:21');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (8, 'Sneha Verma', 'PORTAL_LOGIN', 'HR login via web portal (sneha.verma@vorldx.com)', '2026-10-15 08:51:18');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (9, 'Sneha Verma', 'PORTAL_LOGIN', 'HR login via web portal (sneha.verma@vorldx.com)', '2026-10-16 05:36:26');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (10, 'Sneha Verma', 'PORTAL_LOGIN', 'HR login via web portal (sneha.verma@vorldx.com)', '2026-10-16 06:10:18');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (11, 'Sneha Verma', 'PORTAL_LOGIN', 'HR login via web portal (sneha.verma@vorldx.com)', '2026-10-17 09:42:07');
INSERT INTO "audit_logs" ("id", "actor", "action", "details", "timestamp") VALUES (12, 'Sneha Verma', 'PORTAL_LOGIN', 'HR login via web portal (sneha.verma@vorldx.com)', '2026-10-22 06:30:12');

COMMIT;
PRAGMA foreign_keys = ON;
