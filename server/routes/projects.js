const express = require('express');
const { db } = require('../db');

const router = express.Router();

// GET /api/projects/assigned/:employee_id - Get client project and requirements assigned by Admin
router.get('/assigned/:employee_id', (req, res) => {
  try {
    const empId = req.params.employee_id.toUpperCase();
    
    // Find project assigned specifically to this employee, or 'All', or by department
    let project = db.prepare(`
      SELECT * FROM client_projects
      WHERE assigned_to = ? OR assigned_to = 'All' OR assigned_to LIKE ?
      ORDER BY id DESC
      LIMIT 1
    `).get(empId, `%${empId}%`);

    if (!project) {
      // Fallback to latest active project
      project = db.prepare('SELECT * FROM client_projects ORDER BY id DESC LIMIT 1').get();
    }

    if (project && project.requirements_json) {
      try {
        project.requirements = JSON.parse(project.requirements_json);
      } catch (e) {
        project.requirements = [];
      }
    }

    res.json(project || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assigned project requirements' });
  }
});

// GET /api/projects/all - List all client projects
router.get('/all', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM client_projects ORDER BY id DESC').all();
    const formatted = list.map(p => {
      try {
        return { ...p, requirements: JSON.parse(p.requirements_json || '[]') };
      } catch (e) {
        return { ...p, requirements: [] };
      }
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// POST /api/projects/:id/requirement-toggle - Update requirement checklist status
router.post('/:id/requirement-toggle', (req, res) => {
  try {
    const projectId = req.params.id;
    const { requirement_id, status } = req.body;

    const project = db.prepare('SELECT * FROM client_projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let reqs = [];
    try {
      reqs = JSON.parse(project.requirements_json || '[]');
    } catch (e) {
      reqs = [];
    }

    reqs = reqs.map(item => {
      if (item.id === requirement_id) {
        return { ...item, status: status || (item.status === 'Completed' ? 'In Progress' : 'Completed') };
      }
      return item;
    });

    const completedCount = reqs.filter(r => r.status === 'Completed').length;
    const progress = reqs.length > 0 ? Math.round((completedCount / reqs.length) * 100) : project.progress_percent;

    db.prepare(`
      UPDATE client_projects
      SET requirements_json = ?,
          progress_percent = ?
      WHERE id = ?
    `).run(JSON.stringify(reqs), progress, projectId);

    res.json({ success: true, requirements: reqs, progress_percent: progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update requirement status' });
  }
});

module.exports = router;
