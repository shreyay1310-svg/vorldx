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

  // 5. Seed WFH Requests matching Screen 6 (with RBAC requester & approver queues)
  const insertWfh = db.prepare(`
    INSERT INTO wfh_requests (
      employee_id, request_date, reason, status, requester_role, approver_role, reviewed_by, reviewed_at, admin_comment
    ) VALUES (
      @employee_id, @request_date, @reason, @status, @requester_role, @approver_role, @reviewed_by, @reviewed_at, @admin_comment
    )
  `);

  // HR Requester -> Admin Approver
  insertWfh.run({
    employee_id: 'VX002', // Sneha Verma (HR)
    request_date: '15 Oct 2026',
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
    request_date: '14 Oct 2026',
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
    request_date: '13 Oct 2026',
    reason: 'Internet issue',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR)',
    reviewed_at: '12 Oct 2026',
    admin_comment: 'Approved'
  });

  insertWfh.run({
    employee_id: 'VX005', // Karan Mehta (Employee)
    request_date: '12 Oct 2026',
    reason: 'Family function',
    status: 'Rejected',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR)',
    reviewed_at: '11 Oct 2026',
    admin_comment: 'Important client meeting on-site'
  });

  insertWfh.run({
    employee_id: 'VX006', // Neha Gupta (Employee)
    request_date: '12 Oct 2026',
    reason: 'Personal reason',
    status: 'Approved',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: 'Sneha Verma (HR)',
    reviewed_at: '11 Oct 2026',
    admin_comment: 'Approved'
  });

  insertWfh.run({
    employee_id: 'VX001', // Rohit Sharma (Employee)
    request_date: '11 Oct 2026',
    reason: 'Home maintenance',
    status: 'Pending',
    requester_role: 'Employee',
    approver_role: 'HR',
    reviewed_by: null,
    reviewed_at: null,
    admin_comment: null
  });

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
