const express = require('express');
const { db } = require('../db');

const router = express.Router();

// GET /api/announcements - Fetch all active HR Announcements
router.get('/', (req, res) => {
  try {
    const list = db.prepare(`
      SELECT * FROM announcements
      WHERE is_active = 1
      ORDER BY id DESC
    `).all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
});

// POST /api/announcements - Create new HR Announcement
router.post('/', (req, res) => {
  try {
    const { 
      title, 
      content, 
      priority = 'General', 
      tag = 'HR Notice',
      author_name = 'Sneha Verma (HR Lead)', 
      author_role = 'HR Executive' 
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Announcement title and content are required' });
    }

    const result = db.prepare(`
      INSERT INTO announcements (
        title, content, priority, tag, author_name, author_role, published_date, is_active
      ) VALUES (
        ?, ?, ?, ?, ?, ?, CURRENT_DATE, 1
      )
    `).run(title.trim(), content.trim(), priority, tag, author_name, author_role);

    db.prepare(`
      INSERT INTO audit_logs (actor, action, details)
      VALUES (?, 'HR_ANNOUNCEMENT_POSTED', ?)
    `).run(author_name, `Broadcast: ${title.trim()}`);

    const created = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
    res.json({
      success: true,
      message: 'Announcement posted successfully!',
      announcement: created
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post announcement' });
  }
});

// DELETE /api/announcements/:id - Archive/Delete Announcement
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.prepare('UPDATE announcements SET is_active = 0 WHERE id = ?').run(id);
    res.json({ success: true, message: 'Announcement archived' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove announcement' });
  }
});

module.exports = router;
