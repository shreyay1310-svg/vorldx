const express = require('express');
const { db } = require('../db');

const router = express.Router();

// POST /api/leaves/request - Submit Leave Application (Screen 15)
router.post('/request', (req, res) => {
  try {
    const { 
      employee_id, 
      leave_type = 'Casual Leave', 
      from_date, 
      to_date, 
      total_days, 
      reason 
    } = req.body;

    if (!employee_id || !from_date || !to_date || !reason) {
      return res.status(400).json({ error: 'Employee ID, from date, to date, and reason are required' });
    }

    const empId = employee_id.trim().toUpperCase();
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(empId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const requesterRole = employee.role || 'Employee';
    const approverRole = requesterRole === 'HR' ? 'Admin' : 'HR';
    const daysCount = parseInt(total_days, 10) || 1;

    const result = db.prepare(`
      INSERT INTO leave_requests (
        employee_id, leave_type, from_date, to_date, total_days, reason, status, requester_role, approver_role
      ) VALUES (
        ?, ?, ?, ?, ?, ?, 'Pending', ?, ?
      )
    `).run(empId, leave_type, from_date, to_date, daysCount, reason.trim(), requesterRole, approverRole);

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'LEAVE_REQUEST_CREATED', ?)
    `).run(employee.name, `Submitted ${leave_type} request for ${from_date} to ${to_date} (${daysCount} day${daysCount > 1 ? 's' : ''}) (Approver: ${approverRole})`);

    const created = db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(result.lastInsertRowid);
    res.json({
      success: true,
      message: `Leave application submitted successfully! Routed to ${approverRole} queue for review.`,
      request: created
    });
  } catch (error) {
    console.error('Failed to submit leave request:', error);
    res.status(500).json({ error: 'Failed to submit leave application' });
  }
});

// GET /api/leaves/employee/:employee_id - Employee's own Leave requests
router.get('/employee/:employee_id', (req, res) => {
  try {
    const empId = req.params.employee_id.toUpperCase();
    const requests = db.prepare(`
      SELECT * FROM leave_requests
      WHERE employee_id = ?
      ORDER BY id DESC
    `).all(empId);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employee leave requests' });
  }
});

// GET /api/leaves/all - HR & Admin Leave review queue
router.get('/all', (req, res) => {
  try {
    const { status, approver_role } = req.query;
    let query = `
      SELECT l.*, e.name as employee_name, e.department, e.designation, e.avatar, e.role as employee_role
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      query += ` AND l.status = ?`;
      params.push(status);
    }

    if (approver_role && approver_role !== 'All') {
      query += ` AND l.approver_role = ?`;
      params.push(approver_role);
    }

    query += ` ORDER BY l.id DESC`;

    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leave requests' });
  }
});

// POST /api/leaves/review/:id - HR/Admin Approve or Reject Leave
router.post('/review/:id', (req, res) => {
  try {
    const { status, hr_comment = '', reviewed_by = 'Sneha Verma (HR)' } = req.body;
    const requestId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "Approved" or "Rejected"' });
    }

    const request = db.prepare(`
      SELECT l.*, e.name as employee_name
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.id
      WHERE l.id = ?
    `).get(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    db.prepare(`
      UPDATE leave_requests
      SET status = ?,
          hr_comment = ?,
          reviewed_by = ?,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, hr_comment, reviewed_by, requestId);

    // If Approved, update or insert attendance as 'Absent' / 'Leave' with remark
    if (status === 'Approved') {
      const existingAttendance = db.prepare(`
        SELECT * FROM attendance WHERE employee_id = ? AND date = ?
      `).get(request.employee_id, request.from_date);

      if (existingAttendance) {
        db.prepare(`
          UPDATE attendance
          SET status = 'Absent',
              mode = 'LEAVE_APPROVED',
              remarks = ?
          WHERE id = ?
        `).run(`Approved ${request.leave_type}: ${request.reason}`, existingAttendance.id);
      } else {
        db.prepare(`
          INSERT INTO attendance (
            employee_id, date, check_in, check_out, duration_minutes, status, mode, kiosk_id, late_by_minutes, remarks
          ) VALUES (
            ?, ?, null, null, 0, 'Absent', 'LEAVE_APPROVED', 'LEAVE', 0, ?
          )
        `).run(request.employee_id, request.from_date, `Approved ${request.leave_type}: ${request.reason}`);
      }
    }

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, ?, ?)
    `).run(
      reviewed_by,
      status === 'Approved' ? `Approved ${request.leave_type}` : `Rejected ${request.leave_type}`,
      `${request.employee_name} - ${request.from_date} to ${request.to_date}`
    );

    res.json({
      success: true,
      message: `Leave application successfully ${status.toLowerCase()}!`,
      status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to review leave application' });
  }
});

module.exports = router;
