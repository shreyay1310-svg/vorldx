const express = require('express');
const { db } = require('../db');

const router = express.Router();

// GET /api/auth/employees - List all employees
router.get('/employees', (req, res) => {
  try {
    const employees = db.prepare(`
      SELECT id, name, email, phone, department, designation, shift, work_type,
             joining_date, status, role, avatar, verified
      FROM employees
      ORDER BY id ASC
    `).all();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

// GET /api/auth/employee/:id - Single employee profile
router.get('/employee/:id', (req, res) => {
  try {
    const emp = db.prepare(`
      SELECT id, name, email, phone, department, designation, shift, work_type,
             joining_date, status, role, avatar, verified
      FROM employees
      WHERE id = ?
    `).get(req.params.id.toUpperCase());

    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(emp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employee profile' });
  }
});

// POST /api/auth/login - Role-aware login (Admin, HR, Employee)
router.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (email) {
      user = db.prepare('SELECT * FROM employees WHERE LOWER(email) = LOWER(?)').get(email.trim());
    } else if (role) {
      // Demo quick login by role
      user = db.prepare('SELECT * FROM employees WHERE role = ? LIMIT 1').get(role);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Try admin@vorldx.com or sneha.verma@vorldx.com' });
    }

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: `demo-jwt-token-${user.id}-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/mobile-login - Login via Employee ID (Screen 11)
router.post('/mobile-login', (req, res) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const cleanId = employee_id.trim().toUpperCase();
    const user = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);

    if (!user) {
      return res.status(404).json({
        error: `Employee ID "${cleanId}" not found. Sample IDs: VX001 (Rohit Sharma), VX002 (Sneha Verma), VX006 (Neha Gupta).`
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      requiresOtp: !user.verified
    });
  } catch (error) {
    res.status(500).json({ error: 'Mobile login failed' });
  }
});

// POST /api/auth/register-request - Screen 11/12 OTP generation
router.post('/register-request', (req, res) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required (e.g. VX001 to VX006)' });
    }

    const cleanId = employee_id.trim().toUpperCase();
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!emp) {
      return res.status(404).json({
        error: `Employee ID "${cleanId}" not found in company records.`
      });
    }

    // Fixed or generated demo OTP (Screen 12 specifies Demo OTP: 123456)
    const generatedOtp = '123456';

    db.prepare(`
      INSERT INTO verification_tokens (employee_id, otp, expires_at)
      VALUES (?, ?, datetime('now', '+30 minutes'))
      ON CONFLICT(employee_id) DO UPDATE SET
        otp = excluded.otp,
        expires_at = datetime('now', '+30 minutes')
    `).run(emp.id, generatedOtp);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'OTP_GENERATED', ?)
    `).run(emp.name, `Verification OTP generated for ${emp.id}`);

    res.json({
      success: true,
      employee_id: emp.id,
      name: emp.name,
      email: emp.email,
      already_verified: Boolean(emp.verified),
      demo_otp: generatedOtp,
      message: `Demo OTP: ${generatedOtp}. Enter this 6-digit code to complete verification.`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate verification' });
  }
});

// POST /api/auth/verify-otp - Screen 12 OTP submission
router.post('/verify-otp', (req, res) => {
  try {
    const { employee_id, otp } = req.body;
    if (!employee_id || !otp) {
      return res.status(400).json({ error: 'Employee ID and OTP are required' });
    }

    const cleanId = employee_id.trim().toUpperCase();
    const cleanOtp = otp.trim();

    const tokenRecord = db.prepare(`
      SELECT * FROM verification_tokens
      WHERE employee_id = ? AND datetime('now') <= datetime(expires_at)
    `).get(cleanId);

    // Allow demo OTP 123456 or stored OTP
    if ((!tokenRecord || tokenRecord.otp !== cleanOtp) && cleanOtp !== '123456') {
      return res.status(400).json({
        error: 'Invalid or expired OTP. Use demo OTP: 123456'
      });
    }

    // Mark employee verified & Active
    db.prepare('UPDATE employees SET verified = 1, status = "Active" WHERE id = ?').run(cleanId);
    db.prepare('DELETE FROM verification_tokens WHERE employee_id = ?').run(cleanId);

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'ACCOUNT_VERIFIED', ?)
    `).run(cleanId, `Employee account ${cleanId} verified via OTP`);

    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    const { password: _, ...userClean } = updated;

    res.json({
      success: true,
      message: 'Account successfully verified!',
      user: userClean
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
