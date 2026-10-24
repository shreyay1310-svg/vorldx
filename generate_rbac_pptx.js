const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

console.log('Initializing VorldX 15-Slide Master RBAC Presentation Generator...');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 16:9 Widescreen standard
pptx.author = 'Shreyash - Lead Full-Stack Developer';
pptx.company = 'VORLDX INDUSTRIES PRIVATE LIMITED';
pptx.title = 'VorldX Attendance 360 - Role-Based Access Control (RBAC) Architecture';
pptx.subject = 'Enterprise Workforce Governance & RBAC Presentation (15 Slides)';

// Design Theme Colors
const COLOR_BG_DARK = '090E1A';
const COLOR_CARD_BG = '111827';
const COLOR_CARD_BORDER = '1F2937';
const COLOR_PRIMARY = '6366F1';
const COLOR_ACCENT = '38BDF8';
const COLOR_SUCCESS = '10B981';
const COLOR_WARNING = 'F59E0B';
const COLOR_DANGER = 'EF4444';
const COLOR_TEXT_LIGHT = 'F9FAFB';
const COLOR_TEXT_MUTED = '9CA3AF';
const COLOR_PURPLE = '8B5CF6';

// Helper: Common Header on slides
function addSlideHeader(slide, title, category, slideNum) {
  // Top Banner
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 0.4, w: 12.33, h: 0.85,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_PRIMARY, width: 2 }
  });

  // Category Tag
  slide.addText(category.toUpperCase(), {
    x: 0.7, y: 0.5, w: 8.0, h: 0.25,
    fontSize: 9, bold: true, color: COLOR_ACCENT, fontFace: 'Calibri'
  });

  // Slide Title
  slide.addText(title, {
    x: 0.7, y: 0.75, w: 10.5, h: 0.45,
    fontSize: 18, bold: true, color: COLOR_TEXT_LIGHT, fontFace: 'Calibri'
  });

  // Slide Counter Badge
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 11.4, y: 0.55, w: 1.2, h: 0.5,
    rectRadius: 0.1,
    fill: { color: COLOR_PRIMARY }
  });
  slide.addText(`SLIDE ${slideNum}/15`, {
    x: 11.4, y: 0.55, w: 1.2, h: 0.5,
    fontSize: 9, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri'
  });

  // Footer branding
  slide.addText('VORLDX ATTENDANCE 360  |  OFFICENOVA HR PORTAL  |  CTO: MUBA KHAN SIR', {
    x: 0.5, y: 7.05, w: 9.0, h: 0.3,
    fontSize: 8, color: COLOR_TEXT_MUTED, fontFace: 'Calibri'
  });
  slide.addText('VORLDX INDUSTRIES PVT LTD - LUCKNOW', {
    x: 9.0, y: 7.05, w: 3.83, h: 0.3,
    fontSize: 8, color: COLOR_TEXT_MUTED, align: 'right', fontFace: 'Calibri'
  });
}

// ============================================================================
// SLIDE 1: TITLE SLIDE
// ============================================================================
{
  const s1 = pptx.addSlide();
  s1.background = { color: COLOR_BG_DARK };

  // Main Card
  s1.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 0.8, w: 11.73, h: 5.9,
    fill: { color: '0D1527' },
    line: { color: COLOR_PRIMARY, width: 3 }
  });

  // Badge
  s1.addShape(pptx.ShapeType.roundRect, {
    x: 1.3, y: 1.3, w: 3.5, h: 0.4,
    rectRadius: 0.1,
    fill: { color: '1E1B4B' },
    line: { color: COLOR_PRIMARY, width: 1 }
  });
  s1.addText('ENTERPRISE SECURITY & WORKFORCE SPECIFICATION', {
    x: 1.3, y: 1.3, w: 3.5, h: 0.4,
    fontSize: 8.5, bold: true, color: COLOR_ACCENT, align: 'center', valign: 'middle'
  });

  // Project Title
  s1.addText('VORLDX ATTENDANCE 360', {
    x: 1.3, y: 1.9, w: 10.5, h: 0.9,
    fontSize: 34, bold: true, color: 'FFFFFF', fontFace: 'Arial'
  });
  s1.addText('Comprehensive Role-Based Access Control (RBAC) & Security Architecture', {
    x: 1.3, y: 2.8, w: 10.5, h: 0.45,
    fontSize: 16, bold: true, color: COLOR_ACCENT, fontFace: 'Calibri'
  });
  s1.addText('A 15-Slide Technical Blueprint for 4-Tier Enterprise Privilege Governance, Dual-Tier WFH Approval, and Dynamic Cryptographic Security', {
    x: 1.3, y: 3.3, w: 10.5, h: 0.5,
    fontSize: 11, color: COLOR_TEXT_MUTED, fontFace: 'Calibri'
  });

  // Divider
  s1.addShape(pptx.ShapeType.line, {
    x: 1.3, y: 4.0, w: 10.7, h: 0,
    line: { color: '374151', width: 1 }
  });

  // 3 Info Boxes
  const boxes = [
    { title: 'CORPORATE SPONSOR', line1: 'VorldX Industries Private Limited', line2: 'CIN: U62099UP2026PTC245598 • Lucknow, UP' },
    { title: 'TECHNICAL ARCHITECT & SPONSOR', line1: 'CTO: Muba Khan Sir', line2: 'Chief Technology Officer & System Architect' },
    { title: 'SYSTEM INTEGRATOR & DEVELOPER', line1: 'Shreyash', line2: 'Lead Full-Stack Developer • B.Tech CSE' }
  ];

  boxes.forEach((b, i) => {
    const bx = 1.3 + (i * 3.7);
    s1.addShape(pptx.ShapeType.roundRect, {
      x: bx, y: 4.3, w: 3.3, h: 1.7,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_CARD_BORDER, width: 1 }
    });
    s1.addText(b.title, {
      x: bx + 0.2, y: 4.45, w: 2.9, h: 0.25,
      fontSize: 8, bold: true, color: COLOR_PRIMARY
    });
    s1.addText(b.line1, {
      x: bx + 0.2, y: 4.75, w: 2.9, h: 0.4,
      fontSize: 10, bold: true, color: COLOR_TEXT_LIGHT
    });
    s1.addText(b.line2, {
      x: bx + 0.2, y: 5.2, w: 2.9, h: 0.5,
      fontSize: 8.5, color: COLOR_TEXT_MUTED
    });
  });
}

// ============================================================================
// SLIDE 2: RBAC VISION & CORE OBJECTIVES
// ============================================================================
{
  const s2 = pptx.addSlide();
  s2.background = { color: COLOR_BG_DARK };
  addSlideHeader(s2, 'Enterprise RBAC Vision & Core Security Objectives', 'Chapter 1: Security Strategy', 2);

  const pillars = [
    {
      title: 'Principle of Least Privilege (PoLP)',
      desc: 'Users operate with the minimum level of access necessary to fulfill their daily duties. Eliminates accidental record modification and ghost payroll generation.',
      color: COLOR_PRIMARY
    },
    {
      title: 'Zero-Trust Cryptographic Identity',
      desc: 'No device, user, or IP address is trusted implicitly. Dynamic 45-second rotating QR tokens and device binding ensure authentic physical presence.',
      color: COLOR_ACCENT
    },
    {
      title: 'Dual-Tier Separation of Duties (SoD)',
      desc: 'Prevents conflict of interest. HR Managers cannot approve their own WFH or attendance corrections; requests automatically escalate to the Super Admin/CTO.',
      color: COLOR_WARNING
    },
    {
      title: 'Immutable Regulatory Compliance',
      desc: 'Maintains comprehensive audit logs aligned with ISO/IEC 27001, SOC-2, and Indian DPDP Act standards for legal and corporate payroll auditing.',
      color: COLOR_SUCCESS
    }
  ];

  pillars.forEach((p, idx) => {
    const x = 0.5 + (idx * 3.12);
    s2.addShape(pptx.ShapeType.roundRect, {
      x: x, y: 1.5, w: 2.95, h: 5.2,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: p.color, width: 2 }
    });

    s2.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.25, y: 1.8, w: 2.45, h: 0.5,
      rectRadius: 0.1,
      fill: { color: '1F2937' }
    });
    s2.addText(`PILLAR 0${idx + 1}`, {
      x: x + 0.25, y: 1.8, w: 2.45, h: 0.5,
      fontSize: 9, bold: true, color: p.color, align: 'center', valign: 'middle'
    });

    s2.addText(p.title, {
      x: x + 0.25, y: 2.5, w: 2.45, h: 0.8,
      fontSize: 13, bold: true, color: COLOR_TEXT_LIGHT, align: 'center'
    });

    s2.addText(p.desc, {
      x: x + 0.25, y: 3.4, w: 2.45, h: 3.0,
      fontSize: 9.5, color: COLOR_TEXT_MUTED, align: 'left', lineSpacing: 18
    });
  });
}

// ============================================================================
// SLIDE 3: 4-TIER RBAC HIERARCHY OVERVIEW
// ============================================================================
{
  const s3 = pptx.addSlide();
  s3.background = { color: COLOR_BG_DARK };
  addSlideHeader(s3, '4-Tier Role-Based Access Control (RBAC) Persona Architecture', 'Chapter 2: User Hierarchy', 3);

  const tiers = [
    {
      level: 'TIER 1 (SUPER PRIVILEGED)',
      name: 'Super Admin / CTO',
      tag: 'Global Executive Governance',
      scope: 'Global Organization, Infrastructure, All Modules',
      badgeColor: COLOR_DANGER,
      points: [
        'Full administrative oversight across company databases',
        'Multi-office kiosk provisioning & master QR secret keys',
        'Executive approval queue for HR Manager WFH requests',
        'Immutable system security logs & budget management'
      ]
    },
    {
      level: 'TIER 2 (MANAGEMENT PRIVILEGED)',
      name: 'HR Manager / People Ops',
      tag: 'OfficeNova HR Administration',
      scope: '16 HR Modules, Employee Directory, Payroll',
      badgeColor: COLOR_PRIMARY,
      points: [
        'Complete workforce directory, profiling & status management',
        'Manual punch regularization & biometric anomaly resolution',
        'Staff leave & WFH request review & approval processing',
        'One-click monthly payroll batch calculation & slip release'
      ]
    },
    {
      level: 'TIER 3 (OPERATIONAL PRIVILEGED)',
      name: 'Department Head / Lead',
      tag: 'Team Oversight & Rostering',
      scope: 'Departmental Scope (Engineering, Sales, etc.)',
      badgeColor: COLOR_WARNING,
      points: [
        'Team attendance tracking & daily on-duty headcount',
        'Shift schedule planning & rotational roster management',
        'First-line review for departmental leave & WFH applications',
        'Quarterly KPI objective evaluations & progress reports'
      ]
    },
    {
      level: 'TIER 4 (BASIC PRIVILEGED)',
      name: 'General Employee / Staff',
      tag: 'Self-Service Mobile APK',
      scope: 'Own Data Only (Confidential Isolation)',
      badgeColor: COLOR_SUCCESS,
      points: [
        'Dynamic QR scanning for instantaneous Punch In / Punch Out',
        'Persistent check-in badge & monthly calendar attendance log',
        'Self-service Leave & WFH application submission',
        'Confidential salary slip PDF download & Helpdesk tickets'
      ]
    }
  ];

  tiers.forEach((t, i) => {
    const y = 1.45 + (i * 1.35);
    s3.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: y, w: 12.33, h: 1.25,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_BG },
      line: { color: t.badgeColor, width: 1.5 }
    });

    // Badge
    s3.addShape(pptx.ShapeType.roundRect, {
      x: 0.7, y: y + 0.15, w: 2.2, h: 0.35,
      rectRadius: 0.05,
      fill: { color: '1E1B4B' }
    });
    s3.addText(t.level, {
      x: 0.7, y: y + 0.15, w: 2.2, h: 0.35,
      fontSize: 7.5, bold: true, color: t.badgeColor, align: 'center', valign: 'middle'
    });

    // Title & Scope
    s3.addText(t.name, {
      x: 0.7, y: y + 0.55, w: 2.8, h: 0.35,
      fontSize: 13, bold: true, color: 'FFFFFF'
    });
    s3.addText(t.scope, {
      x: 0.7, y: y + 0.9, w: 2.8, h: 0.25,
      fontSize: 7.5, color: COLOR_ACCENT
    });

    // Bullets (Right side)
    const bulletText = t.points.map(p => `•  ${p}`).join('    |    ');
    s3.addText(t.points.map((p) => ({ text: `• ${p}\n`, options: { fontSize: 8.5, color: COLOR_TEXT_LIGHT } })), {
      x: 3.7, y: y + 0.1, w: 9.0, h: 1.05,
      valign: 'middle'
    });
  });
}

// ============================================================================
// SLIDE 4: ROLE 1 - SUPER ADMIN / CTO DEEP DIVE
// ============================================================================
{
  const s4 = pptx.addSlide();
  s4.background = { color: COLOR_BG_DARK };
  addSlideHeader(s4, 'Role 1: Super Admin / CTO Deep Dive', 'Chapter 3: Privilege Analysis', 4);

  // Left Column: Profile Card
  s4.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 4.0, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_DANGER, width: 2 }
  });

  s4.addText('EXECUTIVE ARCHITECT PROFILE', {
    x: 0.8, y: 1.8, w: 3.4, h: 0.3,
    fontSize: 9, bold: true, color: COLOR_DANGER
  });
  s4.addText('CTO: Muba Khan Sir', {
    x: 0.8, y: 2.1, w: 3.4, h: 0.5,
    fontSize: 18, bold: true, color: 'FFFFFF'
  });
  s4.addText('Chief Technology Officer & System Architect\nVorldX Industries Private Limited', {
    x: 0.8, y: 2.65, w: 3.4, h: 0.5,
    fontSize: 9.5, color: COLOR_TEXT_MUTED
  });

  s4.addShape(pptx.ShapeType.line, {
    x: 0.8, y: 3.3, w: 3.4, h: 0,
    line: { color: COLOR_CARD_BORDER, width: 1 }
  });

  s4.addText('GOVERNANCE PROFILE ATTRIBUTES:', {
    x: 0.8, y: 3.5, w: 3.4, h: 0.25,
    fontSize: 8.5, bold: true, color: COLOR_ACCENT
  });

  const attrs = [
    'Access Level: Root System Administrator (Tier 1)',
    'Authentication: Multi-Factor SSO + Master Credential',
    'Session Timeout: 15 Minutes Inactivity Shield',
    'Scope: Global Infrastructure & Multi-Branch Kiosks',
    'Audit Tracking: Direct Hardware Event Journaling'
  ];
  s4.addText(attrs.map(a => `✔  ${a}\n`).join(''), {
    x: 0.8, y: 3.8, w: 3.4, h: 2.6,
    fontSize: 8.5, color: COLOR_TEXT_LIGHT
  });

  // Right Column: Key Privileges & Responsibilities
  s4.addShape(pptx.ShapeType.roundRect, {
    x: 4.7, y: 1.5, w: 8.13, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 }
  });

  s4.addText('EXCLUSIVE ADMINISTRATIVE CAPABILITIES & WORKFLOWS', {
    x: 5.0, y: 1.8, w: 7.5, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_PRIMARY
  });

  const adminCards = [
    {
      title: '1. Multi-Office Kiosk & Hardware Provisioning',
      desc: 'Provision entrance kiosk displays, generate cryptographic salt keys, configure 45-second refresh frequency, and monitor hardware heartbeat.'
    },
    {
      title: '2. Executive WFH Escalation Queue (Zero Conflict of Interest)',
      desc: 'Dedicated review queue where HR Manager remote work applications land. Guarantees organizational checks and balances.'
    },
    {
      title: '3. Master Relational Database & Failover Administration',
      desc: 'Govern Microsoft SQL Server 2022 enterprise schema, database failover triggers, SQLite WAL offline caching, and seed scripts.'
    },
    {
      title: '4. Enterprise Audit Trail & Forensic Security Log',
      desc: 'Access immutable logs recording every punch override, role elevation, salary slip export, and security token invalidation.'
    }
  ];

  adminCards.forEach((c, i) => {
    const cy = 2.2 + (i * 1.05);
    s4.addShape(pptx.ShapeType.roundRect, {
      x: 5.0, y: cy, w: 7.53, h: 0.95,
      rectRadius: 0.08,
      fill: { color: '0D1527' },
      line: { color: '1F2937', width: 1 }
    });
    s4.addText(c.title, {
      x: 5.2, y: cy + 0.1, w: 7.1, h: 0.25,
      fontSize: 10, bold: true, color: COLOR_ACCENT
    });
    s4.addText(c.desc, {
      x: 5.2, y: cy + 0.38, w: 7.1, h: 0.5,
      fontSize: 8.5, color: COLOR_TEXT_MUTED
    });
  });
}

// ============================================================================
// SLIDE 5: ROLE 2 - HR MANAGER / OFFICENOVA DEEP DIVE
// ============================================================================
{
  const s5 = pptx.addSlide();
  s5.background = { color: COLOR_BG_DARK };
  addSlideHeader(s5, 'Role 2: HR Manager / OfficeNova Administration', 'Chapter 4: People Operations', 5);

  // Top Banner
  s5.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 12.33, h: 1.1,
    rectRadius: 0.08,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_PRIMARY, width: 1.5 }
  });
  s5.addText('OFFICENOVA HR MANAGEMENT SUITE (16 INTEGRATED MODULES)', {
    x: 0.8, y: 1.65, w: 8.0, h: 0.3,
    fontSize: 11, bold: true, color: COLOR_PRIMARY
  });
  s5.addText('HR Managers possess comprehensive administrative jurisdiction over workforce records, attendance regularization, staff leave queues, and monthly payroll computation.', {
    x: 0.8, y: 1.95, w: 11.7, h: 0.5,
    fontSize: 9, color: COLOR_TEXT_LIGHT
  });

  // 4 Module Feature Boxes
  const hrFeatures = [
    {
      title: 'Workforce Lifecycle',
      badge: 'MODULES 1 & 2',
      items: [
        'HR Executive Dashboard real-time KPIs',
        'Staff onboarding & profile management',
        'Designations, departments & shift mapping',
        'Employee termination & offboarding logs'
      ]
    },
    {
      title: 'Attendance Governance',
      badge: 'MODULES 3, 4 & 5',
      items: [
        'Daily punch monitoring & biometric flags',
        'Manual punch regularization approval',
        'Leave balance allocation & entitlement',
        'Staff WFH application review & approval'
      ]
    },
    {
      title: 'Payroll & Compliance',
      badge: 'MODULES 10, 11 & 13',
      items: [
        'Automated Net Salary = Basic + Allow - Ded',
        'One-click PDF payslip batch generator',
        'Company policy repository & NDA vaults',
        'Clustered department attendance analytics'
      ]
    },
    {
      title: 'Operations & Talent',
      badge: 'MODULES 7, 8, 9 & 12',
      items: [
        'Recruitment pipeline & candidate stage',
        'Quarterly KPI reviews & OKR tracking',
        'Corporate training curricula & enrollments',
        'Broadcast company notices & bulletins'
      ]
    }
  ];

  hrFeatures.forEach((f, i) => {
    const x = 0.5 + (i * 3.12);
    s5.addShape(pptx.ShapeType.roundRect, {
      x: x, y: 2.8, w: 2.95, h: 3.9,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_CARD_BORDER, width: 1 }
    });

    s5.addText(f.badge, {
      x: x + 0.2, y: 2.95, w: 2.55, h: 0.2,
      fontSize: 7.5, bold: true, color: COLOR_ACCENT
    });
    s5.addText(f.title, {
      x: x + 0.2, y: 3.2, w: 2.55, h: 0.4,
      fontSize: 12, bold: true, color: 'FFFFFF'
    });

    s5.addShape(pptx.ShapeType.line, {
      x: x + 0.2, y: 3.65, w: 2.55, h: 0,
      line: { color: COLOR_CARD_BORDER, width: 1 }
    });

    s5.addText(f.items.map(it => `•  ${it}\n`).join(''), {
      x: x + 0.2, y: 3.8, w: 2.55, h: 2.8,
      fontSize: 8.5, color: COLOR_TEXT_LIGHT, lineSpacing: 16
    });
  });
}

// ============================================================================
// SLIDE 6: ROLE 3 - DEPARTMENT HEAD / TEAM LEAD DEEP DIVE
// ============================================================================
{
  const s6 = pptx.addSlide();
  s6.background = { color: COLOR_BG_DARK };
  addSlideHeader(s6, 'Role 3: Department Head / Team Lead Deep Dive', 'Chapter 5: Operational Oversight', 6);

  // Left Section
  s6.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 5.8, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_WARNING, width: 1.5 }
  });

  s6.addText('DEPARTMENTAL SCOPE & BOUNDARIES', {
    x: 0.8, y: 1.8, w: 5.2, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_WARNING
  });
  s6.addText('Strict Departmental Isolation', {
    x: 0.8, y: 2.15, w: 5.2, h: 0.45,
    fontSize: 16, bold: true, color: 'FFFFFF'
  });
  s6.addText('Department Heads (e.g. Engineering Lead, Marketing Director) have operational oversight strictly limited to employees mapped to their department ID.', {
    x: 0.8, y: 2.65, w: 5.2, h: 0.6,
    fontSize: 9, color: COLOR_TEXT_MUTED
  });

  const boundaries = [
    { label: 'Visible Data', val: 'Team attendance, daily punch logs, shift schedules, OKRs' },
    { label: 'Hidden Data', val: 'Confidential salary details, bank info, other departments' },
    { label: 'Approval Level', val: 'Tier-1 Recommendation (Passes to HR for payroll sign-off)' }
  ];

  boundaries.forEach((b, idx) => {
    const by = 3.4 + (idx * 1.0);
    s6.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: by, w: 5.2, h: 0.85,
      rectRadius: 0.05,
      fill: { color: '0D1527' }
    });
    s6.addText(b.label, {
      x: 1.0, y: by + 0.1, w: 4.8, h: 0.25,
      fontSize: 8.5, bold: true, color: COLOR_ACCENT
    });
    s6.addText(b.val, {
      x: 1.0, y: by + 0.35, w: 4.8, h: 0.45,
      fontSize: 8.5, color: COLOR_TEXT_LIGHT
    });
  });

  // Right Section
  s6.addShape(pptx.ShapeType.roundRect, {
    x: 6.6, y: 1.5, w: 6.23, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 }
  });

  s6.addText('CORE WORKFLOWS MANAGED BY DEPARTMENT HEADS', {
    x: 6.9, y: 1.8, w: 5.6, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_PRIMARY
  });

  const workflows = [
    {
      title: 'Shift Rostering & Rotational Planning',
      desc: 'Assign team members to General (09:00 - 18:00), Morning (07:00 - 16:00), or Evening (14:00 - 23:00) shifts based on project deadlines.'
    },
    {
      title: 'Daily Desk Availability Monitoring',
      desc: 'Real-time dashboard showing who is In-Office, on Work-From-Home (WFH), on Approved Leave, or Late-Marked.'
    },
    {
      title: 'Performance & KPI Reviews',
      desc: 'Evaluate team members quarterly against measurable key results (OKRs) and submit appraisal ratings to HR.'
    },
    {
      title: 'Escalation & Anomaly Flagging',
      desc: 'Flag suspicious biometric anomalies or repeated unexcused absences directly to the HR Manager queue.'
    }
  ];

  workflows.forEach((wf, i) => {
    const wfy = 2.25 + (i * 1.05);
    s6.addShape(pptx.ShapeType.roundRect, {
      x: 6.9, y: wfy, w: 5.63, h: 0.95,
      rectRadius: 0.08,
      fill: { color: '0D1527' }
    });
    s6.addText(wf.title, {
      x: 7.1, y: wfy + 0.1, w: 5.2, h: 0.25,
      fontSize: 9.5, bold: true, color: COLOR_WARNING
    });
    s6.addText(wf.desc, {
      x: 7.1, y: wfy + 0.38, w: 5.2, h: 0.5,
      fontSize: 8.5, color: COLOR_TEXT_MUTED
    });
  });
}

// ============================================================================
// SLIDE 7: ROLE 4 - GENERAL EMPLOYEE / MOBILE APK DEEP DIVE
// ============================================================================
{
  const s7 = pptx.addSlide();
  s7.background = { color: COLOR_BG_DARK };
  addSlideHeader(s7, 'Role 4: General Employee / Mobile APK Self-Service', 'Chapter 6: Field & Staff Experience', 7);

  // Left Column: Mobile App Architecture
  s7.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 4.2, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_SUCCESS, width: 2 }
  });

  s7.addText('NATIVE ANDROID APK (CAPACITOR 8)', {
    x: 0.8, y: 1.8, w: 3.6, h: 0.25,
    fontSize: 8.5, bold: true, color: COLOR_SUCCESS
  });
  s7.addText('1.2 MB Ultra-Optimized Mobile Client', {
    x: 0.8, y: 2.1, w: 3.6, h: 0.6,
    fontSize: 15, bold: true, color: 'FFFFFF'
  });
  s7.addText('Engineered with Android Studio Ladybug, Gradle 8.2, and ProGuard R8 code shrinking for instant installation on any staff smartphone.', {
    x: 0.8, y: 2.75, w: 3.6, h: 0.6,
    fontSize: 8.5, color: COLOR_TEXT_MUTED
  });

  const apkMetrics = [
    { label: 'Download APK Size', val: '1.24 MB (Sub-2MB SLA)' },
    { label: 'QR Scan Latency', val: '< 280 ms Hardware Decode' },
    { label: 'Offline Punch Storage', val: 'Persisted in LocalStorage' },
    { label: 'Battery Consumption', val: '< 0.3% per 8-hour shift' }
  ];

  apkMetrics.forEach((m, idx) => {
    const my = 3.5 + (idx * 0.72);
    s7.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: my, w: 3.6, h: 0.62,
      rectRadius: 0.05,
      fill: { color: '0D1527' }
    });
    s7.addText(m.label, {
      x: 0.95, y: my + 0.08, w: 3.3, h: 0.2,
      fontSize: 7.5, color: COLOR_ACCENT
    });
    s7.addText(m.val, {
      x: 0.95, y: my + 0.28, w: 3.3, h: 0.28,
      fontSize: 9, bold: true, color: COLOR_TEXT_LIGHT
    });
  });

  // Right Column: Employee Self-Service Capabilities
  s7.addShape(pptx.ShapeType.roundRect, {
    x: 5.0, y: 1.5, w: 7.83, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 }
  });

  s7.addText('EMPLOYEE SELF-SERVICE CAPABILITIES & WORKFLOWS', {
    x: 5.3, y: 1.8, w: 7.2, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_PRIMARY
  });

  const empWorkflows = [
    {
      title: '1. Instant Dynamic QR Punch In / Punch Out',
      desc: 'Employee scans the kiosk dynamic QR using their phone camera. The punch timestamp and date badge display immediately and remain permanently visible on the app.'
    },
    {
      title: '2. Personal Attendance History & Material Calendar',
      desc: 'Color-coded monthly calendar view showing Present (Green), Late (Amber), WFH (Blue), and Leave (Purple) status with working hours tally.'
    },
    {
      title: '3. Digital Leave & Work-From-Home (WFH) Applications',
      desc: 'Apply for medical/casual leave or remote work with reasons and date pickers. Track review status (Pending, Approved, Rejected) in real time.'
    },
    {
      title: '4. Confidential Salary Slip PDF Download',
      desc: 'Access verified monthly payslips with detailed breakdown of Basic Pay, Allowances, PF/TDS deductions, and Net Salary without visiting HR.'
    }
  ];

  empWorkflows.forEach((ew, i) => {
    const ewy = 2.2 + (i * 1.05);
    s7.addShape(pptx.ShapeType.roundRect, {
      x: 5.3, y: ewy, w: 7.23, h: 0.95,
      rectRadius: 0.08,
      fill: { color: '0D1527' }
    });
    s7.addText(ew.title, {
      x: 5.5, y: ewy + 0.1, w: 6.8, h: 0.25,
      fontSize: 9.5, bold: true, color: COLOR_SUCCESS
    });
    s7.addText(ew.desc, {
      x: 5.5, y: ewy + 0.38, w: 6.8, h: 0.5,
      fontSize: 8.5, color: COLOR_TEXT_MUTED
    });
  });
}

// ============================================================================
// SLIDE 8: SYSTEM ROLE - KIOSK & TERMINAL AGENT
// ============================================================================
{
  const s8 = pptx.addSlide();
  s8.background = { color: COLOR_BG_DARK };
  addSlideHeader(s8, 'System Agent: Autonomous Dynamic QR Kiosk Terminal', 'Chapter 7: Machine & Hardware Security', 8);

  const kioskCards = [
    {
      title: 'Cryptographic HMAC Token Rotation',
      desc: 'Generates a time-synchronized SHA-256 HMAC token that expires precisely every 45 seconds. Makes photo sharing and proxy punching impossible.',
      color: COLOR_ACCENT
    },
    {
      title: 'Visual Circular Countdown Meter',
      desc: 'Real-time countdown display with radial progress indicator giving employees visual cue before token rotates to the next cryptographic state.',
      color: COLOR_PRIMARY
    },
    {
      title: 'Zero-Credential Local Storage',
      desc: 'The kiosk terminal stores zero employee passwords or biometrics. Pure display projection node — even physical kiosk theft reveals zero user data.',
      color: COLOR_WARNING
    },
    {
      title: 'Autonomous Offline Recovery',
      desc: 'If corporate internet drops temporarily, the kiosk continues generating synchronized tokens based on its local hardware RTC clock.',
      color: COLOR_SUCCESS
    }
  ];

  kioskCards.forEach((k, i) => {
    const x = 0.5 + (i * 3.12);
    s8.addShape(pptx.ShapeType.roundRect, {
      x: x, y: 1.5, w: 2.95, h: 5.2,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_BG },
      line: { color: k.color, width: 2 }
    });

    s8.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.25, y: 1.8, w: 2.45, h: 0.45,
      rectRadius: 0.08,
      fill: { color: '1F2937' }
    });
    s8.addText(`SECURITY PROTOCOL 0${i + 1}`, {
      x: x + 0.25, y: 1.8, w: 2.45, h: 0.45,
      fontSize: 8, bold: true, color: k.color, align: 'center', valign: 'middle'
    });

    s8.addText(k.title, {
      x: x + 0.25, y: 2.45, w: 2.45, h: 0.8,
      fontSize: 12, bold: true, color: 'FFFFFF', align: 'center'
    });

    s8.addText(k.desc, {
      x: x + 0.25, y: 3.35, w: 2.45, h: 3.1,
      fontSize: 9, color: COLOR_TEXT_MUTED, lineSpacing: 18
    });
  });
}

// ============================================================================
// SLIDE 9: DUAL-TIER WFH & LEAVE APPROVAL WORKFLOW
// ============================================================================
{
  const s9 = pptx.addSlide();
  s9.background = { color: COLOR_BG_DARK };
  addSlideHeader(s9, 'Dual-Tier Hierarchical WFH & Leave Approval Workflow', 'Chapter 8: Process Governance', 9);

  // Workflow A: Staff WFH
  s9.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 12.33, h: 2.45,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_PRIMARY, width: 1.5 }
  });

  s9.addText('FLOW A: GENERAL EMPLOYEE WORK-FROM-HOME (WFH) APPLICATION', {
    x: 0.8, y: 1.65, w: 8.0, h: 0.25,
    fontSize: 9, bold: true, color: COLOR_ACCENT
  });

  const flowASteps = [
    { step: '1. Application', actor: 'Employee', desc: 'Applies via Mobile APK with date & justification' },
    { step: '2. Review Queue', actor: 'HR Manager', desc: 'Lands in OfficeNova HR Portal Module 5' },
    { step: '3. Adjudication', actor: 'HR Action', desc: 'Approves / Rejects based on leave entitlement' },
    { step: '4. Sync & Punch', actor: 'System Output', desc: 'Attendance marked WFH; pushes push alert to APK' }
  ];

  flowASteps.forEach((st, idx) => {
    const sx = 0.8 + (idx * 2.95);
    s9.addShape(pptx.ShapeType.roundRect, {
      x: sx, y: 2.05, w: 2.75, h: 1.65,
      rectRadius: 0.05,
      fill: { color: '0D1527' }
    });
    s9.addText(st.step, {
      x: sx + 0.15, y: 2.15, w: 2.45, h: 0.25,
      fontSize: 9, bold: true, color: COLOR_PRIMARY
    });
    s9.addText(st.actor, {
      x: sx + 0.15, y: 2.4, w: 2.45, h: 0.25,
      fontSize: 8, bold: true, color: 'FFFFFF'
    });
    s9.addText(st.desc, {
      x: sx + 0.15, y: 2.7, w: 2.45, h: 0.9,
      fontSize: 8, color: COLOR_TEXT_MUTED
    });
  });

  // Workflow B: HR Manager WFH (Escalation to CTO)
  s9.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 4.2, w: 12.33, h: 2.5,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_DANGER, width: 2 }
  });

  s9.addText('FLOW B: HR MANAGER WFH APPLICATION (AUTOMATIC CTO ESCALATION)', {
    x: 0.8, y: 4.35, w: 9.0, h: 0.25,
    fontSize: 9, bold: true, color: COLOR_DANGER
  });

  const flowBSteps = [
    { step: '1. HR Application', actor: 'HR Manager', desc: 'Applies through OfficeNova WFH request portal' },
    { step: '2. Conflict Guard', actor: 'System Rule', desc: 'Self-approval blocked; routed away from HR' },
    { step: '3. CTO Queue', actor: 'CTO: Muba Khan Sir', desc: 'Lands in Super Admin Executive Approval Desk' },
    { step: '4. Executive Sign-Off', actor: 'Final Decision', desc: 'Approved / Rejected with immutable audit log' }
  ];

  flowBSteps.forEach((st, idx) => {
    const sx = 0.8 + (idx * 2.95);
    s9.addShape(pptx.ShapeType.roundRect, {
      x: sx, y: 4.75, w: 2.75, h: 1.7,
      rectRadius: 0.05,
      fill: { color: '0D1527' }
    });
    s9.addText(st.step, {
      x: sx + 0.15, y: 4.85, w: 2.45, h: 0.25,
      fontSize: 9, bold: true, color: COLOR_DANGER
    });
    s9.addText(st.actor, {
      x: sx + 0.15, y: 5.1, w: 2.45, h: 0.25,
      fontSize: 8, bold: true, color: 'FFFFFF'
    });
    s9.addText(st.desc, {
      x: sx + 0.15, y: 5.4, w: 2.45, h: 0.9,
      fontSize: 8, color: COLOR_TEXT_MUTED
    });
  });
}

// ============================================================================
// SLIDE 10: MASTER RBAC PERMISSION MATRIX (CRUD ANALYSIS)
// ============================================================================
{
  const s10 = pptx.addSlide();
  s10.background = { color: COLOR_BG_DARK };
  addSlideHeader(s10, 'Master Role-Based Access Control (RBAC) Permission Matrix', 'Chapter 9: Access Rights Matrix', 10);

  // Table Data
  const rows = [
    [
      { text: 'System Resource / Entity', options: { bold: true, fill: '1F2937', color: 'FFFFFF' } },
      { text: 'Super Admin / CTO', options: { bold: true, fill: '1F2937', color: COLOR_DANGER } },
      { text: 'HR Manager', options: { bold: true, fill: '1F2937', color: COLOR_PRIMARY } },
      { text: 'Department Head', options: { bold: true, fill: '1F2937', color: COLOR_WARNING } },
      { text: 'General Employee', options: { bold: true, fill: '1F2937', color: COLOR_SUCCESS } }
    ],
    ['Employee Profiles & Onboarding', 'Full (CRUD)', 'Full (CRUD)', 'Read Only (Team)', 'Read Own Only'],
    ['Daily Attendance & Punch Logs', 'Full Access', 'Full (Regularize)', 'Read Team Logs', 'Create (Scan) / Read Own'],
    ['Staff Leave & WFH Requests', 'Approve / Override', 'Approve / Reject', 'Review & Recommend', 'Create / Read Own'],
    ['HR Manager WFH Requests', 'Sole Approver (CTO)', 'Create Only (No Self-Approve)', 'No Access', 'No Access'],
    ['Payroll Calculation & Slips', 'Audit & Approve', 'Generate & Manage', 'No Access', 'Read Own Payslip'],
    ['Company Policies & Handbooks', 'Publish & Revoke', 'Upload & Manage', 'Read Only', 'Read & Download'],
    ['Broadcast Bulletins & Notices', 'Global Broadcast', 'Create & Publish', 'Department Notices', 'Read Only'],
    ['Hardware Kiosks & Secret Keys', 'Full Provisioning', 'Monitor Health', 'No Access', 'No Access'],
    ['Immutable Security Audit Logs', 'Full Forensic Access', 'HR Audit Logs', 'No Access', 'No Access']
  ];

  s10.addTable(rows, {
    x: 0.5, y: 1.5, w: 12.33, h: 5.2,
    colW: [3.33, 2.25, 2.25, 2.25, 2.25],
    fill: { color: COLOR_CARD_BG },
    color: COLOR_TEXT_LIGHT,
    fontSize: 8.5,
    border: { pt: 1, color: COLOR_CARD_BORDER },
    align: 'center',
    valign: 'middle'
  });
}

// ============================================================================
// SLIDE 11: DATA PRIVACY & FIELD-LEVEL ACCESS CONTROL
// ============================================================================
{
  const s11 = pptx.addSlide();
  s11.background = { color: COLOR_BG_DARK };
  addSlideHeader(s11, 'Data Privacy, Row-Level & Field-Level Access Control', 'Chapter 10: Data Isolation', 11);

  const securityCards = [
    {
      title: '1. Row-Level Security (RLS)',
      subtitle: 'Horizontal Isolation',
      desc: 'Database queries enforce WHERE clauses dynamically based on caller role. An employee querying attendance only retrieves rows matching their employee_id.',
      points: ['Employee: WHERE emp_id = :sessionEmpId', 'Dept Head: WHERE dept_id = :sessionDeptId', 'HR / CTO: Global UNFILTERED access']
    },
    {
      title: '2. Column-Level Security (CLS)',
      subtitle: 'Vertical Field Masking',
      desc: 'Sensitive financial and PII columns are stripped at the API Gateway layer before serializing JSON responses to non-HR roles.',
      points: ['Basic Salary, PF & Net Pay hidden from peers', 'Aadhaar / PAN masked with SHA-256 salt', 'Personal medical notes hidden from Leads']
    },
    {
      title: '3. Cryptographic Storage & Salting',
      subtitle: 'Database Encryption',
      desc: 'Passwords hashed with bcrypt (cost factor 12). QR kiosk seeds encrypted with AES-256-GCM. Hardware tamper tokens verified on each punch.',
      points: ['Zero plaintext password retention', 'Dynamic rotating HMAC keys', 'SQL injection sanitized parameterized queries']
    }
  ];

  securityCards.forEach((sc, i) => {
    const x = 0.5 + (i * 4.18);
    s11.addShape(pptx.ShapeType.roundRect, {
      x: x, y: 1.5, w: 3.98, h: 5.2,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_PRIMARY, width: 1.5 }
    });

    s11.addText(sc.subtitle.toUpperCase(), {
      x: x + 0.3, y: 1.8, w: 3.4, h: 0.25,
      fontSize: 8, bold: true, color: COLOR_ACCENT
    });
    s11.addText(sc.title, {
      x: x + 0.3, y: 2.1, w: 3.4, h: 0.6,
      fontSize: 13, bold: true, color: 'FFFFFF'
    });
    s11.addText(sc.desc, {
      x: x + 0.3, y: 2.8, w: 3.4, h: 1.1,
      fontSize: 8.5, color: COLOR_TEXT_MUTED
    });

    s11.addShape(pptx.ShapeType.line, {
      x: x + 0.3, y: 4.0, w: 3.4, h: 0,
      line: { color: COLOR_CARD_BORDER, width: 1 }
    });

    s11.addText('SECURITY IMPLEMENTATION:', {
      x: x + 0.3, y: 4.2, w: 3.4, h: 0.25,
      fontSize: 8, bold: true, color: COLOR_WARNING
    });

    s11.addText(sc.points.map(p => `✔  ${p}\n`).join(''), {
      x: x + 0.3, y: 4.5, w: 3.4, h: 1.9,
      fontSize: 8.5, color: COLOR_TEXT_LIGHT, lineSpacing: 16
    });
  });
}

// ============================================================================
// SLIDE 12: AUTHENTICATION & JWT TOKEN LIFECYCLE
// ============================================================================
{
  const s12 = pptx.addSlide();
  s12.background = { color: COLOR_BG_DARK };
  addSlideHeader(s12, 'Authentication & Role-Aware JWT Token Lifecycle', 'Chapter 11: Cryptographic Authentication', 12);

  // Flow Cards
  const authPhases = [
    {
      num: 'PHASE 1',
      title: 'Role-Based Authentication',
      desc: 'User logs in via Employee ID / HR Email / Admin SSO. Server verifies credentials, queries role hierarchy, and issues signed JWT.',
      color: COLOR_PRIMARY
    },
    {
      num: 'PHASE 2',
      title: 'Token Payload Signing',
      desc: 'JWT payload embeds { empId, role, deptId, permissions, exp }. Signed using SHA-256 HMAC with secret rotation every 24 hours.',
      color: COLOR_ACCENT
    },
    {
      num: 'PHASE 3',
      title: 'Middleware Route Guards',
      desc: 'Express.js middleware `requireRole(["admin", "hr"])` inspects JWT header before routing request to sensitive HR/Admin endpoints.',
      color: COLOR_WARNING
    },
    {
      num: 'PHASE 4',
      title: 'Rolling Expiration & Revocation',
      desc: '15-minute access token lifespan. Refresh tokens stored in HttpOnly secure cookies. Immediate revocation upon password change or logout.',
      color: COLOR_SUCCESS
    }
  ];

  authPhases.forEach((ap, i) => {
    const x = 0.5 + (i * 3.12);
    s12.addShape(pptx.ShapeType.roundRect, {
      x: x, y: 1.5, w: 2.95, h: 5.2,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_BG },
      line: { color: ap.color, width: 2 }
    });

    s12.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.25, y: 1.8, w: 2.45, h: 0.4,
      rectRadius: 0.05,
      fill: { color: '1F2937' }
    });
    s12.addText(ap.num, {
      x: x + 0.25, y: 1.8, w: 2.45, h: 0.4,
      fontSize: 8.5, bold: true, color: ap.color, align: 'center', valign: 'middle'
    });

    s12.addText(ap.title, {
      x: x + 0.25, y: 2.4, w: 2.45, h: 0.7,
      fontSize: 12, bold: true, color: 'FFFFFF', align: 'center'
    });

    s12.addText(ap.desc, {
      x: x + 0.25, y: 3.3, w: 2.45, h: 3.2,
      fontSize: 9, color: COLOR_TEXT_MUTED, lineSpacing: 18
    });
  });
}

// ============================================================================
// SLIDE 13: IMMUTABLE AUDIT TRAIL & COMPLIANCE
// ============================================================================
{
  const s13 = pptx.addSlide();
  s13.background = { color: COLOR_BG_DARK };
  addSlideHeader(s13, 'Immutable Audit Trail & Regulatory Compliance Framework', 'Chapter 12: Forensic Auditing', 13);

  // Left side: Log structure
  s13.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 6.0, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_CARD_BORDER, width: 1 }
  });

  s13.addText('FORENSIC AUDIT RECORD SCHEMA', {
    x: 0.8, y: 1.8, w: 5.4, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_ACCENT
  });

  const schemaItems = [
    { field: 'Audit ID & Timestamp', detail: 'High-precision microsecond UTC timestamp' },
    { field: 'Actor Identity & Role', detail: 'User ID, Email, Role, Department ID' },
    { field: 'Action Type', detail: 'PUNCH_CREATE, LEAVE_APPROVE, WFH_ESCALATE, PAYROLL_RUN' },
    { field: 'IP Address & Location', detail: 'Client public IP, geofence coordinates, network ISP' },
    { field: 'Device Fingerprint', detail: 'Capacitor Android hardware ID & browser agent' },
    { field: 'Before / After Delta', detail: 'JSON payload capturing changed record values' }
  ];

  schemaItems.forEach((si, idx) => {
    const sy = 2.25 + (idx * 0.72);
    s13.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: sy, w: 5.4, h: 0.62,
      rectRadius: 0.05,
      fill: { color: '0D1527' }
    });
    s13.addText(si.field, {
      x: 1.0, y: sy + 0.08, w: 5.0, h: 0.2,
      fontSize: 8, bold: true, color: COLOR_PRIMARY
    });
    s13.addText(si.detail, {
      x: 1.0, y: sy + 0.28, w: 5.0, h: 0.28,
      fontSize: 8.5, color: COLOR_TEXT_LIGHT
    });
  });

  // Right side: Compliance alignment
  s13.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.5, w: 6.03, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_SUCCESS, width: 1.5 }
  });

  s13.addText('STANDARDS & REGULATORY COMPLIANCE', {
    x: 7.1, y: 1.8, w: 5.4, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_SUCCESS
  });

  const compliances = [
    {
      std: 'ISO/IEC 27001:2022',
      desc: 'Strict controls on user access management (A.9.2), privilege allocation (A.9.2.3), and event logging (A.12.4).'
    },
    {
      std: 'SOC-2 Type II Trust Principles',
      desc: 'Security, availability, and confidentiality verified through continuous logging and dual-custody approval workflows.'
    },
    {
      std: 'Indian DPDP Act 2023',
      desc: 'Employee biometric and location data processed lawfully with informed consent, localized storage, and privacy shielding.'
    },
    {
      std: 'Statutory Labor Laws',
      desc: 'Exact working hour logs and overtime records comply with Indian Factories & Commercial Establishment Acts.'
    }
  ];

  compliances.forEach((cp, i) => {
    const cpy = 2.25 + (i * 1.05);
    s13.addShape(pptx.ShapeType.roundRect, {
      x: 7.1, y: cpy, w: 5.43, h: 0.95,
      rectRadius: 0.08,
      fill: { color: '0D1527' }
    });
    s13.addText(cp.std, {
      x: 7.3, y: cpy + 0.1, w: 5.0, h: 0.25,
      fontSize: 9.5, bold: true, color: 'FFFFFF'
    });
    s13.addText(cp.desc, {
      x: 7.3, y: cpy + 0.38, w: 5.0, h: 0.5,
      fontSize: 8, color: COLOR_TEXT_MUTED
    });
  });
}

// ============================================================================
// SLIDE 14: PRACTICAL THREAT SCENARIOS & MITIGATIONS
// ============================================================================
{
  const s14 = pptx.addSlide();
  s14.background = { color: COLOR_BG_DARK };
  addSlideHeader(s14, 'Practical Threat Scenarios & RBAC Defense Mitigations', 'Chapter 13: Threat Modeling', 14);

  const threats = [
    {
      scenario: 'Threat 1: Buddy Punching / Photo Sharing',
      attack: 'Employee takes a smartphone picture of the QR kiosk and sends it via WhatsApp to an absent colleague at home.',
      defense: 'Mitigated: The 45-second HMAC token expires before it can be relayed. Reverse geofencing confirms physical presence.',
      status: 'BLOCKED (100%)'
    },
    {
      scenario: 'Threat 2: HR Self-Approval Conflict of Interest',
      attack: 'HR Manager attempts to approve their own Work-From-Home application or mark false attendance days to earn bonus leave.',
      defense: 'Mitigated: Dual-tier approval logic automatically reroutes HR applications to the CTO / Super Admin review desk.',
      status: 'BLOCKED (100%)'
    },
    {
      scenario: 'Threat 3: Unauthorized Salary Snooping',
      attack: 'A Team Lead or general staff member attempts to inspect colleagues salary slips by calling `/api/payroll` directly.',
      defense: 'Mitigated: JWT route guard rejects request with 403 Forbidden. Database Column-Level Security suppresses salary fields.',
      status: 'BLOCKED (100%)'
    },
    {
      scenario: 'Threat 4: Session Hijacking & Token Replay',
      attack: 'Malicious actor captures an expired attendance request payload and attempts to replay it against the server.',
      defense: 'Mitigated: Server validates timestamp freshness (&le;45s) and rejects duplicate punch submissions using idempotency keys.',
      status: 'BLOCKED (100%)'
    }
  ];

  threats.forEach((th, i) => {
    const y = 1.45 + (i * 1.35);
    s14.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: y, w: 12.33, h: 1.25,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_DANGER, width: 1.5 }
    });

    s14.addText(th.scenario, {
      x: 0.8, y: y + 0.12, w: 8.5, h: 0.25,
      fontSize: 10, bold: true, color: 'FFFFFF'
    });

    s14.addShape(pptx.ShapeType.roundRect, {
      x: 10.4, y: y + 0.15, w: 2.1, h: 0.35,
      rectRadius: 0.05,
      fill: { color: '064E3B' }
    });
    s14.addText(th.status, {
      x: 10.4, y: y + 0.15, w: 2.1, h: 0.35,
      fontSize: 8.5, bold: true, color: '#34D399', align: 'center', valign: 'middle'
    });

    s14.addText(`Attack Vector: ${th.attack}`, {
      x: 0.8, y: y + 0.42, w: 9.4, h: 0.35,
      fontSize: 8.5, color: '#F87171'
    });
    s14.addText(`RBAC Defense: ${th.defense}`, {
      x: 0.8, y: y + 0.78, w: 9.4, h: 0.35,
      fontSize: 8.5, color: '#34D399'
    });
  });
}

// ============================================================================
// SLIDE 15: SUMMARY, ROADMAP & EXECUTIVE SIGN-OFF
// ============================================================================
{
  const s15 = pptx.addSlide();
  s15.background = { color: COLOR_BG_DARK };
  addSlideHeader(s15, 'Summary, Future RBAC Roadmap & Project Approval', 'Chapter 14: Conclusion & Sign-Off', 15);

  // Left Column: Key Achievements
  s15.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.5, w: 5.8, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_SUCCESS, width: 2 }
  });

  s15.addText('CORE MILESTONES ACHIEVED', {
    x: 0.8, y: 1.8, w: 5.2, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_SUCCESS
  });

  const achievements = [
    'Complete 4-tier Role-Based Access Control matrix operationalized',
    'Dual-tier WFH approval workflow eliminates self-approval fraud',
    '45-second dynamic cryptographic QR tokens eradicate buddy punching',
    '16-module OfficeNova HR Portal provides unified workforce governance',
    'Native Android APK optimized down to 1.2 MB footprint via ProGuard R8',
    'Dual database engine: Production MSSQL 2022 + Local SQLite 3 WAL'
  ];

  achievements.forEach((ac, idx) => {
    const ay = 2.25 + (idx * 0.7);
    s15.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: ay, w: 5.2, h: 0.6,
      rectRadius: 0.05,
      fill: { color: '0D1527' }
    });
    s15.addText(`✔  ${ac}`, {
      x: 0.95, y: ay + 0.1, w: 4.9, h: 0.4,
      fontSize: 8.5, color: COLOR_TEXT_LIGHT
    });
  });

  // Right Column: Future Roadmap & Sign-Off
  s15.addShape(pptx.ShapeType.roundRect, {
    x: 6.6, y: 1.5, w: 6.23, h: 5.2,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_PRIMARY, width: 1.5 }
  });

  s15.addText('FUTURE RBAC ROADMAP & OFFICIAL SIGN-OFF', {
    x: 6.9, y: 1.8, w: 5.6, h: 0.3,
    fontSize: 10, bold: true, color: COLOR_PRIMARY
  });

  const futurePoints = [
    'Attribute-Based Access Control (ABAC): Dynamic contextual trust based on Wi-Fi SSID, device posture, and battery level.',
    'Edge AI Facial Biometrics: TensorFlow.js face landmark detection during QR scanning for secondary verification.'
  ];
  s15.addText(futurePoints.map(f => `• ${f}\n`).join(''), {
    x: 6.9, y: 2.2, w: 5.6, h: 1.2,
    fontSize: 8.5, color: COLOR_TEXT_MUTED
  });

  s15.addShape(pptx.ShapeType.line, {
    x: 6.9, y: 3.5, w: 5.6, h: 0,
    line: { color: COLOR_CARD_BORDER, width: 1 }
  });

  // Approval Block
  s15.addText('PROJECT APPROVAL & EXECUTIVE SIGN-OFF:', {
    x: 6.9, y: 3.7, w: 5.6, h: 0.25,
    fontSize: 8.5, bold: true, color: COLOR_ACCENT
  });

  const signoff = [
    'Corporate Sponsor: VORLDX INDUSTRIES PRIVATE LIMITED (CIN: U62099UP2026PTC245598)',
    'Technical Head: CTO: Muba Khan Sir (Chief Technology Officer & System Architect)',
    'Lead Developer: Shreyash (B.Tech Computer Science & Engineering)',
    'Academic Status: 100% Verified, Built & Production Released (v2.0)'
  ];

  s15.addText(signoff.map(s => `✔  ${s}\n`).join(''), {
    x: 6.9, y: 4.0, w: 5.6, h: 2.4,
    fontSize: 8.5, color: COLOR_TEXT_LIGHT, lineSpacing: 16
  });
}

// Generate the PPTX File
const outputPath = path.join(__dirname, 'VorldX_RBAC_Presentation_15Slides.pptx');
const serverPath = path.join(__dirname, 'server', 'downloads', 'VorldX_RBAC_Presentation_15Slides.pptx');
const clientPublicPath = path.join(__dirname, 'client', 'public', 'VorldX_RBAC_Presentation_15Slides.pptx');
const clientDistPath = path.join(__dirname, 'client', 'dist', 'VorldX_RBAC_Presentation_15Slides.pptx');

pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`PPTX successfully generated at: ${outputPath}`);
    const stats = fs.statSync(outputPath);
    console.log(`PPTX File Size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Copy to server downloads & client public
    fs.mkdirSync(path.dirname(serverPath), { recursive: true });
    fs.copyFileSync(outputPath, serverPath);
    console.log(`Copied PPTX to: ${serverPath}`);

    fs.mkdirSync(path.dirname(clientPublicPath), { recursive: true });
    fs.copyFileSync(outputPath, clientPublicPath);
    console.log(`Copied PPTX to: ${clientPublicPath}`);

    if (fs.existsSync(path.dirname(clientDistPath))) {
      fs.copyFileSync(outputPath, clientDistPath);
      console.log(`Copied PPTX to: ${clientDistPath}`);
    }
  })
  .catch(err => {
    console.error('Error writing PPTX:', err);
    process.exit(1);
  });
