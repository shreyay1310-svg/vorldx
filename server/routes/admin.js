const express = require('express');
const { db } = require('../db');
const { seedData } = require('../seed');
const mailer = require('../utils/mailer');

const router = express.Router();

// GET /api/admin/overview - Dashboard statistics matching Screen 2
router.get('/overview', (req, res) => {
  try {
    const todayStr = '2026-10-15';

    // Top 4 Stat Cards from Screen 2
    // Total Employees: 50, Present Today: 32, WFH Today: 8, Late Today: 5
    const totalEmployees = 50;
    const presentToday = 32;
    const wfhToday = 8;
    const lateToday = 5;

    // 30-day October Attendance Trend (Screen 2 & Screen 9)
    const monthlyAttendanceTrend = [];
    for (let day = 1; day <= 30; day++) {
      // Realistic simulation for each day of October
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      monthlyAttendanceTrend.push({
        day,
        present: isWeekend ? 0 : Math.floor(30 + Math.sin(day) * 8),
        wfh: isWeekend ? 0 : Math.floor(6 + Math.cos(day) * 3),
        late: isWeekend ? 0 : Math.floor(4 + (day % 4)),
        absent: isWeekend ? 0 : Math.floor(2 + (day % 3))
      });
    }

    // Department breakdown matching Screen 9 Donut Chart
    const deptBreakdown = [
      { department: 'Development', percentage: 40, count: 20, color: '#3b82f6' },
      { department: 'HR', percentage: 20, count: 10, color: '#06b6d4' },
      { department: 'Design', percentage: 15, count: 8, color: '#f59e0b' },
      { department: 'Testing', percentage: 15, count: 7, color: '#8b5cf6' },
      { department: 'Operations', percentage: 10, count: 5, color: '#ef4444' }
    ];

    // Recent activities feed from Screen 2
    const recentActivities = [
      {
        id: 1,
        user: 'Sneha Verma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80',
        action: 'WFH request submitted',
        details: 'Doctor appointment',
        time: '2 min ago',
        type: 'wfh'
      },
      {
        id: 2,
        user: 'Rohit Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80',
        action: 'Attendance marked',
        details: 'Check-in 09:05 AM via QR',
        time: '15 min ago',
        type: 'attendance'
      },
      {
        id: 3,
        user: 'Karan Mehta',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=80',
        action: 'New employee added',
        details: 'Operations Manager',
        time: '1 hour ago',
        type: 'employee'
      },
      {
        id: 4,
        user: 'Amit Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80',
        action: 'WFH request approved',
        details: 'Design Sprint',
        time: '2 hours ago',
        type: 'wfh'
      }
    ];

    const policy = db.prepare('SELECT * FROM policies WHERE id = 1').get();

    res.json({
      totalEmployees,
      today: {
        date: todayStr,
        present: presentToday,
        wfh: wfhToday,
        late: lateToday,
        attendanceRate: 85
      },
      monthlyAttendanceTrend,
      deptBreakdown,
      recentActivities,
      policy
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin overview' });
  }
});

// GET /api/admin/employees - Screen 3 Employee Directory
router.get('/employees', (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (department && department !== 'All') {
      query += ' AND department = ?';
      params.push(department);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR id LIKE ? OR department LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY id ASC';
    const list = db.prepare(query).all(...params);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET /api/admin/employee/:id/profile - Screen 4 Employee Profile
router.get('/employee/:id/profile', (req, res) => {
  try {
    const empId = req.params.id.toUpperCase();
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(empId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const attendanceRecords = db.prepare(`
      SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 30
    `).all(empId);

    const wfhRequests = db.prepare(`
      SELECT * FROM wfh_requests WHERE employee_id = ? ORDER BY id DESC LIMIT 10
    `).all(empId);

    res.json({
      employee,
      attendanceRecords,
      wfhRequests
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee full profile' });
  }
});

// POST /api/admin/employees - Add employee (Screen 3 & HR Portal)
router.post('/employees', (req, res) => {
  try {
    const {
      id, name, email, phone, department, designation, shift, work_type,
      role = 'Employee', status = 'Active', password, otp, verified
    } = req.body;

    if (!id || !name || !email || !department || !designation) {
      return res.status(400).json({ error: 'Required fields: id, name, email, department, designation' });
    }

    const cleanId = id.trim().toUpperCase();
    const finalPassword = password ? String(password).trim() : 'VorldX@2026';
    const finalOtp = (otp && String(otp).trim()) || String(Math.floor(100000 + Math.random() * 900000));
    const isVerified = verified !== undefined ? (verified ? 1 : 0) : 0;
    const cleanPhone = phone ? String(phone).trim() : '+91 98765 43210';
    const defaultAvatar = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*100000000)}?auto=format&fit=crop&w=256&q=80`;

    const existing = db.prepare('SELECT id FROM employees WHERE id = ?').get(cleanId);
    if (existing) {
      db.prepare(`
        UPDATE employees
        SET name = ?, email = ?, phone = ?, department = ?, designation = ?,
            password = ?, verified = ?, status = ?
        WHERE id = ?
      `).run(
        name.trim(), email.trim(), cleanPhone, department.trim(),
        designation.trim(), finalPassword, isVerified, status || 'Active', cleanId
      );
    } else {
      db.prepare(`
        INSERT INTO employees (
          id, name, email, phone, department, designation, shift, work_type,
          joining_date, status, role, avatar, verified, password
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `).run(
        cleanId,
        name.trim(),
        email.trim(),
        cleanPhone,
        department.trim(),
        designation.trim(),
        shift || 'General (09:00 AM - 06:00 PM)',
        work_type || 'Office',
        new Date().toISOString().split('T')[0],
        status || 'Active',
        role,
        defaultAvatar,
        isVerified,
        finalPassword
      );
    }

    // Persist OTP in verification_tokens
    db.prepare(`
      INSERT INTO verification_tokens (employee_id, otp, expires_at)
      VALUES (?, ?, datetime('now', '+24 hours'))
      ON CONFLICT(employee_id) DO UPDATE SET
        otp = excluded.otp,
        expires_at = datetime('now', '+24 hours')
    `).run(cleanId, finalOtp);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES ('HR', 'ONBOARDING_MAIL_DISPATCHED', ?)
    `).run(`Official onboarding mail with OTP ${finalOtp} sent to ${name.trim()} (${email.trim()}) as ${designation.trim()}`);

    const created = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);

    const emailNotification = {
      from: 'VorldX Human Resources Department <hr@vorldx.com>',
      to: email.trim(),
      employee_name: name.trim(),
      designation: designation.trim(),
      department: department.trim(),
      employee_id: cleanId,
      password: finalPassword,
      otp: finalOtp,
      subject: `🎉 Official Welcome & Membership Verification - VorldX Technologies [${cleanId}]`,
      message: `Dear ${name.trim()},\n\nAb aap officially VorldX Technologies ke member hain!\n\nDesignation: ${designation.trim()}\nDepartment: ${department.trim()}\nEmployee ID: ${cleanId}\nTemporary Password: ${finalPassword}\n\nAapka Official Verification OTP: ${finalOtp}\n\nPlease is OTP ko verify karke apna company portal access activate karein.\n\nWarm Regards,\nCompany HR Operations Team | VorldX Technologies`,
      sent_at: new Date().toISOString()
    };

    // Dispatch official welcome mail asynchronously
    try {
      mailer.sendWelcomeEmail({
        to: email.trim(),
        name: name.trim(),
        id: cleanId,
        designation: designation.trim(),
        department: department.trim(),
        shift: shift || 'General (09:00 AM - 06:00 PM)',
        password: finalPassword
      });
    } catch (e) {}

    res.json({
      success: true,
      employee: created,
      otp: finalOtp,
      emailNotification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee: ' + error.message });
  }
});

// PUT /api/admin/employees/:id - Edit employee details
router.put('/employees/:id', (req, res) => {
  try {
    const cleanId = req.params.id.trim().toUpperCase();
    const { name, department, designation, status, email, phone, password, verified } = req.body;

    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.prepare(`
      UPDATE employees
      SET name = COALESCE(?, name),
          department = COALESCE(?, department),
          designation = COALESCE(?, designation),
          status = COALESCE(?, status),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          password = COALESCE(?, password),
          verified = COALESCE(?, verified)
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : null,
      department !== undefined ? department.trim() : null,
      designation !== undefined ? designation.trim() : null,
      status !== undefined ? status.trim() : null,
      email !== undefined ? email.trim() : null,
      phone !== undefined ? phone.trim() : null,
      password !== undefined ? password.trim() : null,
      verified !== undefined ? (verified ? 1 : 0) : null,
      cleanId
    );

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES ('HR', 'EMPLOYEE_UPDATED', ?)
    `).run(`Updated details for employee ${cleanId}: status=${status || existing.status}`);

    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    res.json({ success: true, employee: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee: ' + err.message });
  }
});

// DELETE /api/admin/employees/:id - Delete employee
router.delete('/employees/:id', (req, res) => {
  try {
    const cleanId = req.params.id.trim().toUpperCase();
    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.prepare('DELETE FROM verification_tokens WHERE employee_id = ?').run(cleanId);
    db.prepare('DELETE FROM attendance WHERE employee_id = ?').run(cleanId);
    db.prepare('DELETE FROM wfh_requests WHERE employee_id = ?').run(cleanId);
    db.prepare('DELETE FROM employees WHERE id = ?').run(cleanId);

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES ('HR', 'EMPLOYEE_DELETED', ?)
    `).run(`Deleted employee ${existing.name} (${cleanId})`);

    res.json({ success: true, message: `Employee ${cleanId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee: ' + err.message });
  }
});

// PATCH /api/admin/employees/:id/status - Quick Toggle Active/Inactive
router.patch('/employees/:id/status', (req, res) => {
  try {
    const cleanId = req.params.id.trim().toUpperCase();
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.prepare('UPDATE employees SET status = ? WHERE id = ?').run(status.trim(), cleanId);

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES ('HR', 'STATUS_CHANGE', ?)
    `).run(`Changed status for ${existing.name} (${cleanId}) to ${status.trim()}`);

    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    res.json({ success: true, employee: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee status: ' + err.message });
  }
});

// GET /api/admin/policies - Screen 7 Policies
router.get('/policies', (req, res) => {
  try {
    const policy = db.prepare('SELECT * FROM policies WHERE id = 1').get();
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get policies' });
  }
});

// PUT /api/admin/policies - Screen 7 Update policies
router.put('/policies', (req, res) => {
  try {
    const {
      work_start_time,
      work_end_time,
      grace_period_minutes,
      applicable_days,
      max_wfh_days_per_month,
      qr_rotation_seconds
    } = req.body;

    db.prepare(`
      UPDATE policies
      SET work_start_time = COALESCE(?, work_start_time),
          work_end_time = COALESCE(?, work_end_time),
          grace_period_minutes = COALESCE(?, grace_period_minutes),
          applicable_days = COALESCE(?, applicable_days),
          max_wfh_days_per_month = COALESCE(?, max_wfh_days_per_month),
          qr_rotation_seconds = COALESCE(?, qr_rotation_seconds),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      work_start_time,
      work_end_time,
      grace_period_minutes,
      applicable_days,
      max_wfh_days_per_month,
      qr_rotation_seconds
    );

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES ('Admin', 'Grace period changed', ?)
    `).run(`Grace period: ${grace_period_minutes || 15} min`);

    const updated = db.prepare('SELECT * FROM policies WHERE id = 1').get();
    res.json({ success: true, policy: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update policy' });
  }
});

// GET /api/admin/audit-logs - Screen 10 Audit Logs
router.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50').all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// POST /api/admin/reset-demo
router.post('/reset-demo', (req, res) => {
  try {
    seedData();
    res.json({ success: true, message: 'All sample data reset to initial 18-screen specifications!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset demo data' });
  }
});

module.exports = router;
