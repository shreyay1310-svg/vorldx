const { db, initializeDatabase } = require('./db');

function seedData() {
  db.exec(`
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS wfh_requests;
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS verification_tokens;
    DROP TABLE IF EXISTS kiosk_displays;
    DROP TABLE IF EXISTS policies;
    DROP TABLE IF EXISTS employees;
  `);

  initializeDatabase();

  // 1. Seed Policies (Screen 7)
  db.prepare(`
    INSERT INTO policies (
      id, company_name, cin, headquarters, work_start_time, work_end_time,
      grace_period_minutes, half_day_threshold_hours, full_day_threshold_hours,
      max_wfh_days_per_month, qr_rotation_seconds, applicable_days
    ) VALUES (
      1, 'VORLDX INDUSTRIES PRIVATE LIMITED', 'CIN: U62099UP2026PTC245598',
      'Headquartered in Lucknow, U.P., India', '09:00', '18:00',
      15, 4.0, 8.0, 4, 45, 'Monday,Tuesday,Wednesday,Thursday,Friday'
    )
  `).run();

  // 2. Seed Displays (Screen 8)
  const insertKiosk = db.prepare(`
    INSERT INTO kiosk_displays (id, name, location, status, paired_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  insertKiosk.run('QR001', 'Office Reception Display', 'Main Office - Lucknow', 'Online');
  insertKiosk.run('QR002', 'Floor 2 Display', '2nd Floor', 'Online');
  insertKiosk.run('QR003', 'Floor 3 Display', '3rd Floor', 'Offline');
  insertKiosk.run('QR004', 'Meeting Room Display', 'Meeting Room A', 'Online');

  // 3. Seed Employees (Screen 3 & RBAC)
  const insertEmployee = db.prepare(`
    INSERT INTO employees (
      id, name, email, phone, department, designation, shift, work_type,
      joining_date, status, role, avatar, verified, password
    ) VALUES (
      @id, @name, @email, @phone, @department, @designation, @shift, @work_type,
      @joining_date, @status, @role, @avatar, @verified, @password
    )
  `);

  const sampleEmployees = [
    {
      id: 'VX001',
      name: 'Rohit Sharma',
      email: 'rohit.sharma@vorldx.com',
      phone: '9876543210',
      department: 'Development',
      designation: 'SDE',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Office',
      joining_date: '01 Jan 2026',
      status: 'Active',
      role: 'Employee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      verified: 1,
      password: 'password123'
    },
    {
      id: 'VX002',
      name: 'Sneha Verma',
      email: 'sneha.verma@vorldx.com',
      phone: '9811122334',
      department: 'HR',
      designation: 'Executive',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Office',
      joining_date: '15 Feb 2026',
      status: 'Active',
      role: 'HR', // Can approve Employee WFH requests!
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      verified: 1,
      password: 'password123'
    },
    {
      id: 'VX003',
      name: 'Amit Kumar',
      email: 'amit.kumar@vorldx.com',
      phone: '9723456789',
      department: 'Design',
      designation: 'UI/UX',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Hybrid',
      joining_date: '01 Mar 2026',
      status: 'Active',
      role: 'Employee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      verified: 1,
      password: 'password123'
    },
    {
      id: 'VX004',
      name: 'Pooja Singh',
      email: 'pooja.singh@vorldx.com',
      phone: '9654321876',
      department: 'Testing',
      designation: 'QA',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Office',
      joining_date: '10 Mar 2026',
      status: 'Active',
      role: 'Employee',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      verified: 1,
      password: 'password123'
    },
    {
      id: 'VX005',
      name: 'Karan Mehta',
      email: 'karan.mehta@vorldx.com',
      phone: '9543219870',
      department: 'Operations',
      designation: 'Manager',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Office',
      joining_date: '01 Apr 2026',
      status: 'Active',
      role: 'Employee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      verified: 1,
      password: 'password123'
    },
    {
      id: 'VX006',
      name: 'Neha Gupta',
      email: 'neha.gupta@vorldx.com',
      phone: '9432109876',
      department: 'Marketing',
      designation: 'Executive',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Office',
      joining_date: '12 May 2026',
      status: 'Inactive',
      role: 'Employee',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      verified: 0, // Unverified for testing simulated OTP flow!
      password: 'password123'
    },
    {
      id: 'ADMIN01',
      name: 'Vikram Singhania',
      email: 'admin@vorldx.com',
      phone: '9321098765',
      department: 'Management',
      designation: 'Managing Director & Admin',
      shift: 'General (9:00 AM - 6:00 PM)',
      work_type: 'Office',
      joining_date: '01 Jan 2025',
      status: 'Active',
      role: 'Admin', // Super Admin
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      verified: 1,
      password: 'adminpassword'
    }
  ];

  sampleEmployees.forEach(emp => insertEmployee.run(emp));

  // Seed demo OTP for unverified employee Neha Gupta (VX006)
  db.prepare(`
    INSERT INTO verification_tokens (employee_id, otp, expires_at)
    VALUES ('VX006', '123456', datetime('now', '+60 minutes'))
  `).run();

  // 4. Seed Attendance Records matching Screen 5 (15 Oct 2026)
  const insertAttendance = db.prepare(`
    INSERT INTO attendance (
      employee_id, date, check_in, check_out, duration_minutes, status, mode, kiosk_id, late_by_minutes, remarks
    ) VALUES (
      @employee_id, @date, @check_in, @check_out, @duration_minutes, @status, @mode, @kiosk_id, @late_by_minutes, @remarks
    )
  `);

  const todayStr = '2026-10-15';

  // 15 Oct records (Screen 5 exact values)
  insertAttendance.run({
    employee_id: 'VX001',
    date: todayStr,
    check_in: '09:05 AM',
    check_out: '06:02 PM',
    duration_minutes: 537, // 8h 57m
    status: 'Present',
    mode: 'QR_SCAN',
    kiosk_id: 'QR001',
    late_by_minutes: 0,
    remarks: 'On-time check in via Office Reception Display'
  });

  insertAttendance.run({
    employee_id: 'VX002',
    date: todayStr,
    check_in: '09:35 AM',
    check_out: '06:10 PM',
    duration_minutes: 515, // 8h 35m
    status: 'Late',
    mode: 'QR_SCAN',
    kiosk_id: 'QR001',
    late_by_minutes: 20,
    remarks: 'Late arrival past grace period (15m)'
  });

  insertAttendance.run({
    employee_id: 'VX003',
    date: todayStr,
    check_in: '09:10 AM',
    check_out: '06:05 PM',
    duration_minutes: 535, // 8h 55m
    status: 'Present',
    mode: 'QR_SCAN',
    kiosk_id: 'QR002',
    late_by_minutes: 0,
    remarks: 'Floor 2 Display check-in'
  });

  insertAttendance.run({
    employee_id: 'VX004',
    date: todayStr,
    check_in: '09:00 AM',
    check_out: '06:00 PM',
    duration_minutes: 540,
    status: 'WFH',
    mode: 'WFH_APPROVED',
    kiosk_id: 'REMOTE',
    late_by_minutes: 0,
    remarks: 'Approved Work From Home'
  });

  insertAttendance.run({
    employee_id: 'VX005',
    date: todayStr,
    check_in: '09:00 AM',
    check_out: '06:00 PM',
    duration_minutes: 540, // 9h 00m
    status: 'Present',
    mode: 'QR_SCAN',
    kiosk_id: 'QR001',
    late_by_minutes: 0,
    remarks: 'On-time arrival'
  });

  insertAttendance.run({
    employee_id: 'VX006',
    date: todayStr,
    check_in: null,
    check_out: null,
    duration_minutes: 0,
    status: 'Absent',
    mode: 'ABSENT',
    kiosk_id: null,
    late_by_minutes: 0,
    remarks: 'No check-in recorded'
  });

  // Seed past 14 days of October 2026 for rich chart graphs (Screen 2 & Screen 9)
  const activeIds = ['VX001', 'VX002', 'VX003', 'VX004', 'VX005'];
  for (let d = 1; d <= 14; d++) {
    const dayStr = `2026-10-${String(d).padStart(2, '0')}`;
    activeIds.forEach((empId, idx) => {
      const hash = (d * 5 + idx * 7) % 10;
      let status = 'Present';
      let cin = '09:04 AM';
      let cout = '06:01 PM';
      let dur = 537;
      let lateMins = 0;

      if (hash === 2) {
        status = 'Late';
        cin = '09:32 AM';
        lateMins = 17;
      } else if (hash === 7) {
        status = 'WFH';
        cin = '09:00 AM';
        cout = '06:00 PM';
      } else if (hash === 9) {
        status = 'Absent';
        cin = null;
        cout = null;
        dur = 0;
      }

      insertAttendance.run({
        employee_id: empId,
        date: dayStr,
        check_in: cin,
        check_out: cout,
        duration_minutes: dur,
        status,
        mode: status === 'WFH' ? 'WFH_APPROVED' : 'QR_SCAN',
        kiosk_id: 'QR001',
        late_by_minutes: lateMins,
        remarks: `Attendance for ${dayStr}`
      });
    });
  }

  // 5. Seed WFH Requests matching Screen 6 (with RBAC requester & approver queues and Date Ranges)
  const insertWfh = db.prepare(`
    INSERT INTO wfh_requests (
      employee_id, request_date, from_date, to_date, total_days, reason, status, requester_role, approver_role, reviewed_by, reviewed_at, admin_comment
    ) VALUES (
      @employee_id, @request_date, @from_date, @to_date, @total_days, @reason, @status, @requester_role, @approver_role, @reviewed_by, @reviewed_at, @admin_comment
    )
  `);

  // Rohit Sharma (VX001) - Sample WFH requests with Approved / Rejected / Pending
  insertWfh.run({
    employee_id: 'VX001',
    request_date: '2026-10-15 to 2026-10-16',
    from_date: '2026-10-15',
    to_date: '2026-10-16',
    total_days: 2,
    reason: 'High-focus backend API development & offline sync verification',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '14 Oct 2026, 04:30 PM',
    admin_comment: 'Approved for 2 days. Ensure daily sprint commits are pushed to GitHub.'
  });

  insertWfh.run({
    employee_id: 'VX001',
    request_date: '2026-10-09 to 2026-10-09',
    from_date: '2026-10-09',
    to_date: '2026-10-09',
    total_days: 1,
    reason: 'Personal work & residential fiber maintenance',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '08 Oct 2026, 05:00 PM',
    admin_comment: 'Approved. Fiber technician visit confirmed.'
  });

  insertWfh.run({
    employee_id: 'VX001',
    request_date: '2026-10-02 to 2026-10-02',
    from_date: '2026-10-02',
    to_date: '2026-10-02',
    total_days: 1,
    reason: 'Family event out of town',
    status: 'Rejected',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '01 Oct 2026, 02:15 PM',
    admin_comment: 'Rejected. All-hands sprint planning was mandatory on-site in office.'
  });

  insertWfh.run({
    employee_id: 'VX001',
    request_date: '2026-10-23 to 2026-10-24',
    from_date: '2026-10-23',
    to_date: '2026-10-24',
    total_days: 2,
    reason: 'Deep architectural refactoring for client release module',
    status: 'Pending',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: null,
    reviewed_at: null,
    admin_comment: null
  });

  // HR Requester -> Admin Approver
  insertWfh.run({
    employee_id: 'VX002', // Sneha Verma (HR)
    request_date: '2026-10-15 to 2026-10-15',
    from_date: '2026-10-15',
    to_date: '2026-10-15',
    total_days: 1,
    reason: 'Doctor appointment',
    status: 'Pending',
    requester_role: 'HR',
    approver_role: 'Admin',
    reviewed_by: null,
    reviewed_at: null,
    admin_comment: null
  });

  // Employee Requester -> HR Approver
  insertWfh.run({
    employee_id: 'VX003', // Amit Kumar (Employee)
    request_date: '2026-10-14 to 2026-10-14',
    from_date: '2026-10-14',
    to_date: '2026-10-14',
    total_days: 1,
    reason: 'Personal work',
    status: 'Pending',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: null,
    reviewed_at: null,
    admin_comment: null
  });

  insertWfh.run({
    employee_id: 'VX004', // Pooja Singh (Employee)
    request_date: '2026-10-13 to 2026-10-13',
    from_date: '2026-10-13',
    to_date: '2026-10-13',
    total_days: 1,
    reason: 'Internet issue',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '12 Oct 2026, 06:10 PM',
    admin_comment: 'Approved by HR'
  });

  insertWfh.run({
    employee_id: 'VX005', // Karan Mehta (Employee)
    request_date: '2026-10-12 to 2026-10-12',
    from_date: '2026-10-12',
    to_date: '2026-10-12',
    total_days: 1,
    reason: 'Family function',
    status: 'Rejected',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '11 Oct 2026, 03:00 PM',
    admin_comment: 'Important client meeting on-site'
  });

  // 5b. Seed Leave Requests
  const insertLeave = db.prepare(`
    INSERT INTO leave_requests (
      employee_id, leave_type, from_date, to_date, total_days, reason, status, requester_role, approver_role, reviewed_by, reviewed_at, hr_comment
    ) VALUES (
      @employee_id, @leave_type, @from_date, @to_date, @total_days, @reason, @status, @requester_role, @approver_role, @reviewed_by, @reviewed_at, @hr_comment
    )
  `);

  insertLeave.run({
    employee_id: 'VX001',
    leave_type: 'Casual Leave',
    from_date: '2026-10-18',
    to_date: '2026-10-20',
    total_days: 3,
    reason: 'Family cousin wedding ceremony out of station',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '12 Oct 2026, 11:30 AM',
    hr_comment: 'Approved. Have a great time at the wedding! Ensure sprint tasks are updated.'
  });

  insertLeave.run({
    employee_id: 'VX001',
    leave_type: 'Sick Leave',
    from_date: '2026-10-12',
    to_date: '2026-10-12',
    total_days: 1,
    reason: 'Viral illness & doctor advised rest',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '12 Oct 2026, 09:30 AM',
    hr_comment: 'Regularized medical leave. Take care and get well soon.'
  });

  insertLeave.run({
    employee_id: 'VX001',
    leave_type: 'Paid Leave',
    from_date: '2026-10-27',
    to_date: '2026-10-28',
    total_days: 2,
    reason: 'Personal bank work and family documentation',
    status: 'Pending',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: null,
    reviewed_at: null,
    hr_comment: null
  });

  insertLeave.run({
    employee_id: 'VX003',
    leave_type: 'Casual Leave',
    from_date: '2026-10-22',
    to_date: '2026-10-23',
    total_days: 2,
    reason: 'Hometown visit',
    status: 'Pending',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: null,
    reviewed_at: null,
    hr_comment: null
  });

  insertLeave.run({
    employee_id: 'VX005',
    leave_type: 'Paid Leave',
    from_date: '2026-10-14',
    to_date: '2026-10-16',
    total_days: 3,
    reason: 'Vacation travel',
    status: 'Rejected',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR Lead)',
    reviewed_at: '10 Oct 2026, 04:45 PM',
    hr_comment: 'Rejected due to milestone release deadlines.'
  });

  // 5c. Seed Announcements by HR
  const insertAnnouncement = db.prepare(`
    INSERT INTO announcements (
      title, content, priority, tag, author_name, author_role, published_date, is_active
    ) VALUES (
      @title, @content, @priority, @tag, @author_name, @author_role, @published_date, 1
    )
  `);

  insertAnnouncement.run({
    title: '🪔 Diwali Festive Bonus & Extended Office Holidays',
    content: 'Management is thrilled to announce Diwali festival bonuses for all employees! Office will observe official holidays from 31st Oct to 3rd Nov 2026. Sweet distribution will take place in the cafeteria on 29th Oct at 4:30 PM.',
    priority: 'Celebration',
    tag: 'Festive Notice',
    author_name: 'Sneha Verma (HR Lead)',
    author_role: 'HR Executive',
    published_date: '14 Oct 2026'
  });

  insertAnnouncement.run({
    title: '📢 Q4 Company Town Hall & Product Showcase',
    content: 'All employees are cordially invited to the Q4 Town Hall on Friday, 24th Oct 2026 at 3:00 PM (Hybrid: Lucknow HQ Auditorium & Meet). Leadership will share corporate milestones and live enterprise client achievements.',
    priority: 'Urgent',
    tag: 'All Hands',
    author_name: 'Sneha Verma (HR Lead)',
    author_role: 'HR Executive',
    published_date: '13 Oct 2026'
  });

  insertAnnouncement.run({
    title: '📋 Updated WFH & Leave Regularization Policy Guidelines',
    content: 'Effective immediately: All WFH and Leave applications must be submitted with From & To calendar dates in advance via the VorldX Employee App. HR approval decisions can now be tracked live with reviewer remarks.',
    priority: 'Policy',
    tag: 'HR Policy',
    author_name: 'Sneha Verma (HR Lead)',
    author_role: 'HR Executive',
    published_date: '11 Oct 2026'
  });

  // 5d. Seed Client Projects & Requirements through Admin
  const sampleProjectRequirements = [
    {
      id: 'REQ-101',
      title: 'Multi-Day Leave Application with Calendar Date Selection',
      desc: 'Employee can select From Date and To Date using native calendar pickers, specify leave type (Casual, Sick, Paid), and submit reasons.',
      status: 'Completed',
      priority: 'High 🔥',
      client_note: 'Verified - user can pick date ranges easily on mobile.'
    },
    {
      id: 'REQ-102',
      title: 'Multi-Day WFH Request with Calendar Range Pickers',
      desc: 'Work From Home form must accept From Date & To Date calendar pickers with auto-calculated working day counts and remote reasons.',
      status: 'Completed',
      priority: 'High 🔥',
      client_note: 'Verified - matches company remote work policy.'
    },
    {
      id: 'REQ-103',
      title: 'Real-time HR Approval Status Tracking Receipt',
      desc: 'Clear visual status (🟢 Approved, 🔴 Rejected, 🟡 Pending) displaying HR Reviewer name, review timestamp, and HR remarks.',
      status: 'Completed',
      priority: 'High 🔥',
      client_note: 'Critical for compliance - transparency on who approved each request.'
    },
    {
      id: 'REQ-104',
      title: 'HR Broadcast Announcements Feed on Employee Dashboard',
      desc: 'Direct announcements channel from HR to employees for urgent notices, festive bonus updates, and holiday circulars.',
      status: 'Completed',
      priority: 'Medium ⚡',
      client_note: 'Improves internal team engagement.'
    },
    {
      id: 'REQ-105',
      title: 'Offline-First APK Support & Zero-Latency Sync',
      desc: 'Seamless mobile execution when away from office network with fast local caching and automatic sync.',
      status: 'Completed',
      priority: 'High 🔥',
      client_note: 'Approved for Android APK distribution.'
    },
    {
      id: 'REQ-106',
      title: 'Final Client Demo & Production Sign-off Meeting',
      desc: 'Live interactive presentation with Alpha Corp leadership on 28th October 2026.',
      status: 'In Progress',
      priority: 'High 🔥',
      client_note: 'Scheduled for 28 Oct 2026 11:00 AM.'
    }
  ];

  db.prepare(`
    INSERT INTO client_projects (
      project_name, client_name, assigned_to, assigned_by, priority, deadline, status, progress_percent, description, requirements_json, admin_notes
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `).run(
    'VorldX Attendance AI & Biometric QR Terminal',
    'Alpha Corp Global (Enterprise Client)',
    'All',
    'Admin (Vikram Singhania)',
    'High Priority 🔥',
    '28 Oct 2026',
    'Sprint 4 (In Progress)',
    85,
    'Enterprise-grade employee attendance tracking system with rotating QR biometrics, mobile Android APK, multi-day WFH/Leave management, and real-time HR approval tracking.',
    JSON.stringify(sampleProjectRequirements),
    'Admin Vikram Singhania: "Alpha Corp client has requested strict compliance on real-time HR approval tracking and HR announcements directly in the employee mobile app. Great progress so far!"'
  );

  // 6. Seed Audit Logs matching Screen 10
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (actor, action, details, timestamp)
    VALUES (@actor, @action, @details, @timestamp)
  `);

  insertAudit.run({
    actor: 'Admin',
    action: 'Approved WFH',
    details: 'Sneha Verma - 15 Oct',
    timestamp: '15 Oct 10:30 AM'
  });

  insertAudit.run({
    actor: 'HR',
    action: 'Added new employee',
    details: 'Karan Mehta',
    timestamp: '15 Oct 10:00 AM'
  });

  insertAudit.run({
    actor: 'Rohit Sharma',
    action: 'Check-in recorded',
    details: 'Office QR - Reception',
    timestamp: '15 Oct 09:05 AM'
  });

  insertAudit.run({
    actor: 'Sneha Verma',
    action: 'Check-out updated',
    details: 'Manually regularized',
    timestamp: '14 Oct 06:10 PM'
  });

  insertAudit.run({
    actor: 'Admin',
    action: 'Grace period changed',
    details: 'Grace period: 15 min',
    timestamp: '13 Oct 11:20 AM'
  });

  insertAudit.run({
    actor: 'Pooja Singh',
    action: 'Submitted WFH request',
    details: '13 Oct - Internet issue',
    timestamp: '11 Oct 01:20 PM'
  });

  console.log('✅ VorldX Database seeded with exact 18-screen specification sample data!');
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData };
