const express = require('express');
const { db } = require('../db');

const router = express.Router();

function getPolicy() {
  return db.prepare('SELECT * FROM policies WHERE id = 1').get();
}

// GET /api/wfh/eligibility/:employee_id
router.get('/eligibility/:employee_id', (req, res) => {
  try {
    const empId = req.params.employee_id.toUpperCase();
    const policy = getPolicy();
    const maxAllowed = policy?.max_wfh_days_per_month || 4;

    const currentYearMonth = new Date().toISOString().substring(0, 7);

    const usedRecord = db.prepare(`
      SELECT COUNT(*) as count
      FROM attendance
      WHERE employee_id = ? AND status = 'WFH' AND date LIKE ?
    `).get(empId, `${currentYearMonth}%`);

    const pendingRecord = db.prepare(`
      SELECT COUNT(*) as count
      FROM wfh_requests
      WHERE employee_id = ? AND status = 'Pending' AND request_date LIKE ?
    `).get(empId, `${currentYearMonth}%`);

    const usedDays = usedRecord.count;
    const remainingDays = Math.max(0, maxAllowed - usedDays);

    res.json({
      employee_id: empId,
      max_allowed_per_month: maxAllowed,
      used_this_month: usedDays,
      pending_requests: pendingRecord.count,
      remaining_days: remainingDays,
      is_eligible: remainingDays > 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve WFH eligibility' });
  }
});

// POST /api/wfh/request - Screen 15 WFH submission
router.post('/request', (req, res) => {
  try {
    const { employee_id, request_date, from_date, to_date, total_days, reason } = req.body;

    const startDate = from_date || request_date;
    const endDate = to_date || from_date || request_date;

    if (!employee_id || (!request_date && !from_date) || !reason) {
      return res.status(400).json({ error: 'Employee ID, date range, and reason are required' });
    }

    const empId = employee_id.trim().toUpperCase();
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(empId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Determine workflow destination based on role (Section 6 RBAC Workflow):
    // Employee -> HR approver
    // HR -> Admin approver
    const requesterRole = employee.role || 'Employee';
    const approverRole = requesterRole === 'HR' ? 'Admin' : 'HR';

    const reqDateDisplay = startDate === endDate ? startDate : `${startDate} to ${endDate}`;
    const daysCount = parseInt(total_days, 10) || 1;

    const result = db.prepare(`
      INSERT INTO wfh_requests (
        employee_id, request_date, from_date, to_date, total_days, reason, status, requester_role, approver_role
      ) VALUES (
        ?, ?, ?, ?, ?, ?, 'Pending', ?, ?
      )
    `).run(empId, reqDateDisplay, startDate, endDate, daysCount, reason.trim(), requesterRole, approverRole);

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'WFH_REQUEST_CREATED', ?)
    `).run(employee.name, `Submitted WFH request for ${reqDateDisplay} (${daysCount} day${daysCount > 1 ? 's' : ''}) (Approver: ${approverRole})`);

    const created = db.prepare('SELECT * FROM wfh_requests WHERE id = ?').get(result.lastInsertRowid);
    res.json({
      success: true,
      message: `WFH request submitted successfully! Routed to ${approverRole} queue for approval.`,
      request: created
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit WFH request' });
  }
});

// GET /api/wfh/employee/:employee_id - Employee's own requests (Screen 15)
router.get('/employee/:employee_id', (req, res) => {
  try {
    const empId = req.params.employee_id.toUpperCase();
    const requests = db.prepare(`
      SELECT * FROM wfh_requests
      WHERE employee_id = ?
      ORDER BY id DESC
    `).all(empId);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employee WFH requests' });
  }
});

// GET /api/wfh/all - Screen 6 List of WFH requests with RBAC queue filtering
router.get('/all', (req, res) => {
  try {
    const { status, approver_role } = req.query;
    let query = `
      SELECT w.*, e.name as employee_name, e.department, e.designation, e.avatar, e.role as employee_role
      FROM wfh_requests w
      JOIN employees e ON w.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All') {
      query += ` AND w.status = ?`;
      params.push(status);
    }

    if (approver_role && approver_role !== 'All') {
      query += ` AND w.approver_role = ?`;
      params.push(approver_role);
    }

    query += ` ORDER BY w.id DESC`;

    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve WFH requests' });
  }
});

// POST /api/wfh/review/:id - Screen 6 Approve / Reject
router.post('/review/:id', (req, res) => {
  try {
    const { status, admin_comment = '', reviewed_by = 'HR Manager' } = req.body;
    const requestId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "Approved" or "Rejected"' });
    }

    const request = db.prepare(`
      SELECT w.*, e.name as employee_name
      FROM wfh_requests w
      JOIN employees e ON w.employee_id = e.id
      WHERE w.id = ?
    `).get(requestId);

    if (!request) {
      return res.status(404).json({ error: 'WFH request not found' });
    }

    db.prepare(`
      UPDATE wfh_requests
      SET status = ?,
          admin_comment = ?,
          reviewed_by = ?,
          reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, admin_comment, reviewed_by, requestId);

    // If Approved, sync attendance entry
    if (status === 'Approved') {
      const existingAttendance = db.prepare(`
        SELECT * FROM attendance WHERE employee_id = ? AND date = ?
      `).get(request.employee_id, request.request_date);

      if (existingAttendance) {
        db.prepare(`
          UPDATE attendance
          SET status = 'WFH',
              mode = 'WFH_APPROVED',
              remarks = ?
          WHERE id = ?
        `).run(`Approved WFH: ${request.reason}`, existingAttendance.id);
      } else {
        db.prepare(`
          INSERT INTO attendance (
            employee_id, date, check_in, check_out, duration_minutes, status, mode, kiosk_id, late_by_minutes, remarks
          ) VALUES (
            ?, ?, '09:00 AM', '06:00 PM', 540, 'WFH', 'WFH_APPROVED', 'REMOTE', 0, ?
          )
        `).run(request.employee_id, request.request_date, `Approved WFH: ${request.reason}`);
      }
    }

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, ?, ?)
    `).run(
      reviewed_by,
      status === 'Approved' ? 'Approved WFH' : 'Rejected WFH',
      `${request.employee_name} - ${request.request_date}`
    );

    res.json({
      success: true,
      message: `WFH request successfully ${status.toLowerCase()}!`,
      status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to review WFH request' });
  }
});

module.exports = router;
