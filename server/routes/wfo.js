const express = require('express');
const os = require('os');
const { db } = require('../db');

const router = express.Router();

// Memory store of active WFO session QR codes
const activeWfoSessions = new Map(); // sessionId -> { sessionId, employeeId, employeeName, status, attendance, expiresAt }

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '192.168.1.141';
}

// 1. GET /api/wfo/network-info: returns local IP address
router.get('/network-info', (req, res) => {
  res.json({
    localIp: getLocalIpAddress(),
    clientPort: 5173,
    apiPort: 5000
  });
});

// 2. POST /api/wfo/initiate: employee enters employee_id on desktop
router.post('/initiate', (req, res) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) return res.status(400).json({ error: 'Employee ID is required' });

    const cleanId = employee_id.trim().toUpperCase();
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!emp) {
      return res.status(404).json({
        error: `Employee ID "${cleanId}" not found in database. Try sample ID: VX001, VX002, VX003.`
      });
    }

    const demoOtp = '123456';
    db.prepare(`
      INSERT INTO verification_tokens (employee_id, otp, expires_at)
      VALUES (?, ?, datetime('now', '+30 minutes'))
      ON CONFLICT(employee_id) DO UPDATE SET otp = excluded.otp, expires_at = datetime('now', '+30 minutes')
    `).run(emp.id, demoOtp);

    const { password: _, ...empClean } = emp;
    res.json({
      success: true,
      employee: empClean,
      demo_otp: demoOtp,
      message: `Employee "${emp.name}" found in database! OTP generated: ${demoOtp}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate WFO login' });
  }
});

// 3. POST /api/wfo/verify-otp: employee enters OTP on desktop -> generates personalized Name QR
router.post('/verify-otp', (req, res) => {
  try {
    const { employee_id, otp } = req.body;
    if (!employee_id || !otp) {
      return res.status(400).json({ error: 'Employee ID and OTP are required' });
    }

    const cleanId = employee_id.trim().toUpperCase();
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    // Verify OTP
    if (otp.trim() !== '123456') {
      const rec = db.prepare('SELECT * FROM verification_tokens WHERE employee_id = ?').get(cleanId);
      if (!rec || rec.otp !== otp.trim()) {
        return res.status(400).json({ error: 'Invalid OTP. Demo OTP is 123456.' });
      }
    }

    // Generate unique session token
    const sessionId = `WFO-SESS-${cleanId}-${Date.now()}`;
    const localIp = getLocalIpAddress();

    // Mobile direct URL that opens app and dashboard!
    const mobileDashboardUrl = `http://${localIp}:5173/?wfoAuth=${cleanId}&sessionId=${sessionId}`;

    activeWfoSessions.set(sessionId, {
      sessionId,
      employeeId: cleanId,
      employeeName: emp.name,
      avatar: emp.avatar,
      department: emp.department,
      designation: emp.designation,
      status: 'WAITING_FOR_SCAN',
      createdAt: Date.now(),
      expiresAt: Date.now() + 180000 // 3 minutes validity
    });

    const { password: _, ...empClean } = emp;
    res.json({
      success: true,
      employee: empClean,
      sessionId,
      qrUrl: mobileDashboardUrl,
      localIp,
      message: `OTP verified! Desktop displaying personalized QR code for ${emp.name}.`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// 4. GET /api/wfo/session-status/:sessionId: desktop polls this
router.get('/session-status/:sessionId', (req, res) => {
  const session = activeWfoSessions.get(req.params.sessionId);
  if (!session) {
    return res.json({ status: 'EXPIRED' });
  }
  res.json(session);
});

// 5. POST /api/wfo/mobile-confirm: called by mobile phone when QR URL is opened
router.post('/mobile-confirm', (req, res) => {
  try {
    const { sessionId, employee_id } = req.body;
    if (!employee_id) return res.status(400).json({ error: 'Employee ID required' });

    const cleanId = employee_id.trim().toUpperCase();
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Record Attendance in database
    const existing = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(cleanId, todayStr);
    let attStatus = 'Present';

    if (!existing) {
      db.prepare(`
        INSERT INTO attendance (
          employee_id, date, check_in, status, mode, kiosk_id, late_by_minutes, remarks
        ) VALUES (
          ?, ?, ?, 'Present', 'WFO_DESKTOP_SCAN', 'DESKTOP-TERMINAL', 0, 'Checked in via Desktop WFO QR Scan'
        )
      `).run(cleanId, todayStr, timeStr);
    } else {
      attStatus = existing.status;
    }

    // Update session status so desktop updates live
    if (sessionId && activeWfoSessions.has(sessionId)) {
      const sess = activeWfoSessions.get(sessionId);
      sess.status = 'ATTENDANCE_MARKED';
      sess.attendance = {
        check_in: timeStr,
        status: attStatus,
        date: todayStr
      };
    }

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'WFO_QR_CHECKIN', ?)
    `).run(emp.name, `${emp.name} (${cleanId}) marked WFO attendance via Desktop QR scan at ${timeStr}`);

    const { password: _, ...empClean } = emp;
    res.json({
      success: true,
      employee: empClean,
      attendance: {
        check_in: timeStr,
        status: attStatus,
        date: todayStr
      },
      message: `Welcome, ${emp.name}! WFO Attendance marked successfully. Opening your dashboard...`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm mobile attendance' });
  }
});

module.exports = {
  router,
  getLocalIpAddress
};
