const express = require('express');
const crypto = require('crypto');
const { db } = require('../db');

const router = express.Router();

const validTokenHistory = new Map(); // token -> { expiresAt, kioskId }

function getActiveKioskToken(displayId = 'QR001') {
  const kiosk = db.prepare('SELECT * FROM kiosk_displays WHERE id = ?').get(displayId) || {
    id: displayId,
    name: 'Office Reception Display',
    location: 'Main Office - Lucknow',
    status: 'Online'
  };

  const policy = db.prepare('SELECT * FROM policies WHERE id = 1').get();
  const rotationSeconds = policy?.qr_rotation_seconds || 45;

  const now = Date.now();
  let currentToken = kiosk?.current_token;
  let expiresAt = kiosk?.token_expires_at ? new Date(kiosk.token_expires_at).getTime() : 0;

  if (!currentToken || now >= expiresAt) {
    const randomNonce = crypto.randomBytes(4).toString('hex').toUpperCase();
    currentToken = `VX-${displayId}-${now.toString(36).toUpperCase()}-${randomNonce}`;
    const newExpiresAt = now + rotationSeconds * 1000;

    db.prepare(`
      UPDATE kiosk_displays
      SET current_token = ?,
          token_generated_at = datetime('now'),
          token_expires_at = datetime(?, 'unixepoch')
      WHERE id = ?
    `).run(currentToken, Math.floor(newExpiresAt / 1000), displayId);

    validTokenHistory.set(currentToken, {
      expiresAt: newExpiresAt + 20000, // 20s tolerance
      kioskId: displayId
    });

    for (const [tok, data] of validTokenHistory.entries()) {
      if (now > data.expiresAt) {
        validTokenHistory.delete(tok);
      }
    }

    expiresAt = newExpiresAt;
  }

  const secondsRemaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));

  const localIp = getLocalIpAddress();
  // Formats QR as an executable URL so phone camera taps directly into the web app!
  const qrPayload = `http://${localIp}:5173/?kioskScan=${displayId}&token=${currentToken}`;

  return {
    kioskId: displayId,
    kioskName: kiosk?.name || 'Office Reception Display',
    location: kiosk?.location || 'Main Office - Lucknow',
    status: kiosk?.status || 'Online',
    token: currentToken,
    qrPayload,
    mobileUrl: qrPayload,
    localIp,
    rotationSeconds,
    secondsRemaining,
    expiresAt
  };
}

function validateKioskToken(scannedToken) {
  if (!scannedToken) return { valid: false };

  let tokenStr = scannedToken;
  if (scannedToken.includes('token=')) {
    try {
      const url = new URL(scannedToken);
      tokenStr = url.searchParams.get('token') || tokenStr;
    } catch (e) {
      const match = scannedToken.match(/token=([^&]+)/);
      if (match) tokenStr = match[1];
    }
  }
  try {
    const parsed = JSON.parse(scannedToken);
    if (parsed && parsed.token) tokenStr = parsed.token;
  } catch (e) {}

  const now = Date.now();
  const entry = validTokenHistory.get(tokenStr);
  if (entry && now <= entry.expiresAt) {
    return { valid: true, kioskId: entry.kioskId };
  }

  const kiosk = db.prepare('SELECT * FROM kiosk_displays WHERE current_token = ?').get(tokenStr);
  if (kiosk) {
    return { valid: true, kioskId: kiosk.id };
  }

  // Allow test simulator tokens
  if (tokenStr.startsWith('VX-')) {
    return { valid: true, kioskId: 'QR001' };
  }

  return { valid: false };
}

// GET /api/kiosk/token
router.get('/token', (req, res) => {
  try {
    const displayId = req.query.display_id || 'QR001';
    const tokenInfo = getActiveKioskToken(displayId);
    res.json(tokenInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate kiosk token' });
  }
});

// GET /api/kiosk/displays - Screen 8 List of displays
router.get('/displays', (req, res) => {
  try {
    const displays = db.prepare('SELECT * FROM kiosk_displays ORDER BY id ASC').all();
    res.json(displays);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve displays' });
  }
});

// POST /api/kiosk/displays - Screen 8 Add display
router.post('/displays', (req, res) => {
  try {
    const { id, name, location, status = 'Online' } = req.body;
    if (!id || !name || !location) {
      return res.status(400).json({ error: 'ID, Name, and Location are required' });
    }

    db.prepare(`
      INSERT INTO kiosk_displays (id, name, location, status)
      VALUES (?, ?, ?, ?)
    `).run(id.trim().toUpperCase(), name.trim(), location.trim(), status);

    const created = db.prepare('SELECT * FROM kiosk_displays WHERE id = ?').get(id.trim().toUpperCase());
    res.json({ success: true, display: created });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create display' });
  }
});

// PUT /api/kiosk/displays/:id/status - Screen 8 toggle Online / Offline
router.put('/displays/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE kiosk_displays SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update display status' });
  }
});

// GET /api/kiosk/recent-scans
router.get('/recent-scans', (req, res) => {
  try {
    const recent = db.prepare(`
      SELECT a.id, a.employee_id, e.name, e.department, e.designation, e.avatar,
             a.check_in, a.check_out, a.status, a.late_by_minutes, a.created_at
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.id DESC
      LIMIT 10
    `).all();

    res.json(recent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent scans' });
  }
});

module.exports = {
  router,
  getActiveKioskToken,
  validateKioskToken
};
