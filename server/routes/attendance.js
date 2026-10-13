const express = require('express');
const { db } = require('../db');
const { validateKioskToken } = require('./kiosk');

const router = express.Router();

function getPolicy() {
  return db.prepare('SELECT * FROM policies WHERE id = 1').get();
}

function parseTimeMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatMinutesToHours(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// POST /api/attendance/scan - Scan QR Code for Check-in / Check-out
router.post('/scan', (req, res) => {
  try {
    const { employee_id, qr_payload, simulated_time } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(employee_id.trim().toUpperCase());
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found in records' });
    }

    if (!employee.verified) {
      return res.status(403).json({
        error: 'Employee account is not verified yet. Please complete verification using simulated OTP first.'
      });
    }

    // Validate QR Token
    const validation = validateKioskToken(qr_payload);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid or expired dynamic QR token. Please scan the current QR code rotating on the Office Display.'
      });
    }

    const policy = getPolicy();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Current time or simulated test time (HH:MM:SS)
    let timeStr = now.toTimeString().split(' ')[0];
    if (simulated_time && /^\d{2}:\d{2}(:\d{2})?$/.test(simulated_time)) {
      timeStr = simulated_time.length === 5 ? `${simulated_time}:00` : simulated_time;
    }

    // Check existing record for today
    const existing = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(employee.id, todayStr);

    if (!existing) {
      // PERFORM CHECK-IN
      const checkInMinutes = parseTimeMinutes(timeStr);
      const policyStartMinutes = parseTimeMinutes(policy.work_start_time);
      const graceThresholdMinutes = policyStartMinutes + policy.grace_period_minutes;

      let status = 'Present';
      let lateByMinutes = 0;

      if (checkInMinutes > graceThresholdMinutes) {
        status = 'Late';
        lateByMinutes = checkInMinutes - graceThresholdMinutes;
      }

      db.prepare(`
        INSERT INTO attendance (
          employee_id, date, check_in, status, mode, kiosk_id, late_by_minutes, remarks
        ) VALUES (
          ?, ?, ?, ?, 'QR_SCAN', ?, ?, ?
        )
      `).run(
        employee.id,
        todayStr,
        timeStr,
        status,
        validation.kioskId || 'KIOSK-LKO-HQ-01',
        lateByMinutes,
        status === 'Late'
          ? `Late check-in by ${lateByMinutes} mins past grace period (${policy.grace_period_minutes}m)`
          : 'On-time office check-in via QR'
      );

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (actor, action, details)
        VALUES (?, 'ATTENDANCE_CHECKIN', ?)
      `).run(
        employee.id,
        `${employee.name} (${employee.id}) checked in at ${timeStr} with status "${status}"`
      );

      return res.json({
        success: true,
        action: 'CHECK_IN',
        status,
        check_in_time: timeStr,
        late_by_minutes: lateByMinutes,
        employee_name: employee.name,
        message: status === 'Late'
          ? `Checked In at ${timeStr}. Note: Arrival was ${lateByMinutes} minutes past grace period.`
          : `Welcome, ${employee.name}! Successfully checked in at ${timeStr}. Have a productive day!`
      });

    } else if (!existing.check_out) {
      // PERFORM CHECK-OUT
      const checkInMinutes = parseTimeMinutes(existing.check_in);
      const checkOutMinutes = parseTimeMinutes(timeStr);
      const duration = Math.max(0, checkOutMinutes - checkInMinutes);

      let status = existing.status;
      const halfDayMinutes = Math.round(policy.half_day_threshold_hours * 60);

      if (duration < halfDayMinutes && status !== 'Late') {
        status = 'Half Day';
      }

      db.prepare(`
        UPDATE attendance
        SET check_out = ?, duration_minutes = ?, status = ?
        WHERE id = ?
      `).run(timeStr, duration, status, existing.id);

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (actor, action, details)
        VALUES (?, 'ATTENDANCE_CHECKOUT', ?)
      `).run(
        employee.id,
        `${employee.name} (${employee.id}) checked out at ${timeStr}. Total duration: ${formatMinutesToHours(duration)}`
      );

      return res.json({
        success: true,
        action: 'CHECK_OUT',
        status,
        check_in_time: existing.check_in,
        check_out_time: timeStr,
        duration_minutes: duration,
        duration_formatted: formatMinutesToHours(duration),
        employee_name: employee.name,
        message: `Good evening, ${employee.name}! Checked out at ${timeStr}. Total shift duration: ${formatMinutesToHours(duration)}.`
      });

    } else {
      // ALREADY CHECKED IN AND CHECKED OUT
      return res.json({
        success: true,
        action: 'ALREADY_COMPLETED',
        status: existing.status,
        check_in_time: existing.check_in,
        check_out_time: existing.check_out,
        duration_formatted: formatMinutesToHours(existing.duration_minutes),
        message: `Attendance already recorded for today! Check-in: ${existing.check_in}, Check-out: ${existing.check_out}.`
      });
    }

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to record attendance scan' });
  }
});

// GET /api/attendance/today/:employee_id
router.get('/today/:employee_id', (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const record = db.prepare(`
      SELECT * FROM attendance
      WHERE employee_id = ? AND date = ?
    `).get(req.params.employee_id.toUpperCase(), todayStr);

    res.json(record || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve today attendance' });
  }
});

// GET /api/attendance/history/:employee_id
router.get('/history/:employee_id', (req, res) => {
  try {
    const empId = req.params.employee_id.toUpperCase();
    const records = db.prepare(`
      SELECT * FROM attendance
      WHERE employee_id = ?
      ORDER BY date DESC
    `).all(empId);

    // Compute stats
    let presentCount = 0;
    let lateCount = 0;
    let wfhCount = 0;
    let halfDayCount = 0;

    records.forEach(r => {
      if (r.status === 'Present') presentCount++;
      else if (r.status === 'Late') lateCount++;
      else if (r.status === 'WFH') wfhCount++;
      else if (r.status === 'Half Day') halfDayCount++;
    });

    const totalDays = records.length;
    const effectiveAttended = presentCount + lateCount + wfhCount + (halfDayCount * 0.5);
    const attendancePercentage = totalDays > 0
      ? Math.min(100, Math.round((effectiveAttended / totalDays) * 100))
      : 100;

    res.json({
      records,
      stats: {
        present_days: presentCount,
        late_days: lateCount,
        wfh_days: wfhCount,
        half_days: halfDayCount,
        total_recorded_days: totalDays,
        attendance_percentage: attendancePercentage
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

// GET /api/attendance/all (HR / Admin view with filters)
router.get('/all', (req, res) => {
  try {
    const { search, status, department, date } = req.query;

    let query = `
      SELECT a.*, e.name as employee_name, e.department, e.designation, e.avatar
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (e.name LIKE ? OR e.id LIKE ? OR e.department LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (status && status !== 'All') {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    if (department && department !== 'All') {
      query += ` AND e.department = ?`;
      params.push(department);
    }

    if (date) {
      query += ` AND a.date = ?`;
      params.push(date);
    }

    query += ` ORDER BY a.date DESC, a.check_in DESC LIMIT 100`;

    const records = db.prepare(query).all(...params);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// PUT /api/attendance/regularize/:id (HR manual correction / regularization)
router.post('/regularize/:id', (req, res) => {
  try {
    const { status, check_in, check_out, remarks, regularized_by } = req.body;
    const recordId = req.params.id;

    const existing = db.prepare('SELECT * FROM attendance WHERE id = ?').get(recordId);
    if (!existing) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    let duration = existing.duration_minutes;
    if (check_in && check_out) {
      const inMins = parseTimeMinutes(check_in);
      const outMins = parseTimeMinutes(check_out);
      duration = Math.max(0, outMins - inMins);
    }

    db.prepare(`
      UPDATE attendance
      SET status = ?,
          check_in = ?,
          check_out = ?,
          duration_minutes = ?,
          remarks = ?,
          regularized_by = ?,
          regularized_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      status || existing.status,
      check_in || existing.check_in,
      check_out || existing.check_out,
      duration,
      remarks || existing.remarks,
      regularized_by || 'HR Admin',
      recordId
    );

    // Audit Log
    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'ATTENDANCE_REGULARIZE', ?)
    `).run(
      regularized_by || 'HR_ADMIN',
      `Corrected attendance #${recordId} for ${existing.employee_id} to status "${status}" with reason: "${remarks || 'Regularization'}"`
    );

    res.json({ success: true, message: 'Attendance record regularized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to regularize attendance record' });
  }
});

module.exports = router;
