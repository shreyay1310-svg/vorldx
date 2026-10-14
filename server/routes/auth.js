const express = require('express');
const { db } = require('../db');

const router = express.Router();

// GET /api/auth/employees - List all employees
router.get('/employees', (req, res) => {
  try {
    const employees = db.prepare(`
      SELECT id, name, email, phone, address, department, designation, shift, work_type,
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
      SELECT id, name, email, phone, address, department, designation, shift, work_type,
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

// POST /api/auth/login - Role-aware login:
// 1) HR Login: email + employee_id
// 2) Admin Login: email + password
router.post('/login', (req, res) => {
  try {
    const { login_type, email, employee_id, password, role } = req.body;

    let user;

    // A) HR Login Flow (Email + Employee ID)
    if (login_type === 'hr' || (employee_id && !password)) {
      if (!email || !employee_id) {
        return res.status(400).json({ error: 'HR Email and Employee ID are required for HR login' });
      }
      user = db.prepare(`
        SELECT * FROM employees 
        WHERE LOWER(email) = LOWER(?) AND UPPER(id) = UPPER(?)
      `).get(email.trim(), employee_id.trim());

      if (!user) {
        return res.status(401).json({ 
          error: `No employee record found matching Email "${email}" and ID "${employee_id}". Try sneha.verma@vorldx.com with ID VX002.` 
        });
      }

      if (user.role !== 'HR' && user.role !== 'Admin') {
        return res.status(403).json({
          error: `Access Denied: ${user.name} (${user.id}) is registered as "${user.role}". Only HR personnel can access the HR Portal.`
        });
      }
    }
    // B) Admin Login Flow (Email + Password)
    else if (login_type === 'admin' || password) {
      if (!email || !password) {
        return res.status(400).json({ error: 'Admin Email and Password are required' });
      }
      user = db.prepare('SELECT * FROM employees WHERE LOWER(email) = LOWER(?)').get(email.trim());

      if (!user) {
        return res.status(401).json({ error: `Admin user not found for "${email}". Try admin@vorldx.com with password password123.` });
      }

      if (user.role !== 'Admin') {
        return res.status(403).json({
          error: `Access Denied: User "${user.email}" does not have Administrator privileges. Please use HR login.`
        });
      }

      if (user.password && user.password !== password.trim()) {
        return res.status(401).json({ error: 'Incorrect password for Administrator account.' });
      }
    }
    // C) Quick Role login fallback
    else if (role) {
      user = db.prepare('SELECT * FROM employees WHERE role = ? LIMIT 1').get(role);
    } else if (email) {
      user = db.prepare('SELECT * FROM employees WHERE LOWER(email) = LOWER(?)').get(email.trim());
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Log the successful login
    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'PORTAL_LOGIN', ?)
    `).run(user.name, `${user.role} login via web portal (${user.email})`);

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: `demo-jwt-token-${user.id}-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
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

// PUT /api/auth/employee/:id - Employee updates their own profile details (Screen 17)
router.put('/employee/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, avatar, password } = req.body;
    const cleanId = id.trim().toUpperCase();

    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedName = name && name.trim() ? name.trim() : emp.name;
    const updatedEmail = email && email.trim() ? email.trim() : emp.email;
    const updatedPhone = phone && phone.trim() ? phone.trim() : emp.phone;
    const updatedAddress = address !== undefined ? address.trim() : (emp.address || '');
    const updatedAvatar = avatar && avatar.trim() ? avatar.trim() : emp.avatar;

    if (password && password.trim()) {
      db.prepare(`
        UPDATE employees 
        SET name = ?, email = ?, phone = ?, address = ?, avatar = ?, password = ?
        WHERE id = ?
      `).run(updatedName, updatedEmail, updatedPhone, updatedAddress, updatedAvatar, password.trim(), cleanId);
    } else {
      db.prepare(`
        UPDATE employees 
        SET name = ?, email = ?, phone = ?, address = ?, avatar = ?
        WHERE id = ?
      `).run(updatedName, updatedEmail, updatedPhone, updatedAddress, updatedAvatar, cleanId);
    }

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'PROFILE_UPDATED', ?)
    `).run(updatedName, `Employee ${cleanId} updated personal profile`);

    const updatedUser = db.prepare('SELECT * FROM employees WHERE id = ?').get(cleanId);
    const { password: _, ...userClean } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: userClean
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

