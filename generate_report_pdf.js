const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>VorldX Attendance 360 & OfficeNova Portal - Master Technical Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 10mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #0f172a;
      line-height: 1.45;
      font-size: 8.5pt;
    }

    .page {
      page-break-after: always;
      position: relative;
      padding-bottom: 20px;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Header Banner */
    .header-banner {
      background: linear-gradient(135deg, #090e1a 0%, #111827 50%, #1e1b4b 100%);
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 10px;
      margin-bottom: 14px;
      border-left: 5px solid #a855f7;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .brand-logo {
      font-size: 16pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .brand-logo span.accent {
      color: #c084fc;
    }

    .badge-cin {
      font-size: 7pt;
      font-weight: 700;
      background: rgba(168, 85, 247, 0.18);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #d8b4fe;
      padding: 3px 8px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }

    .report-title {
      font-size: 14pt;
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .report-subtitle {
      font-size: 8.5pt;
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 7.5pt;
    }

    .meta-item strong {
      color: #ffffff;
      display: block;
      font-size: 8pt;
    }

    .meta-item span {
      color: #cbd5e1;
    }

    /* Section Styling */
    h2.section-heading {
      font-size: 10.5pt;
      font-weight: 800;
      color: #1e1b4b;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 12px 0 8px 0;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h2.section-heading .sec-num {
      background: #7c3aed;
      color: #ffffff;
      font-size: 7pt;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }

    h3.sub-heading {
      font-size: 9pt;
      font-weight: 700;
      color: #334155;
      margin: 8px 0 4px 0;
    }

    p {
      margin-bottom: 6px;
      color: #334155;
      text-align: justify;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 7.8pt;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
      text-align: left;
    }

    table.data-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
    }

    table.data-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-purple { background: #f3e8ff; color: #7c3aed; border: 1px solid #d8b4fe; }
    .badge-cyan { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }
    .badge-green { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-amber { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

    /* Card Boxes */
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #7c3aed;
      padding: 8px 12px;
      border-radius: 6px;
      margin: 6px 0;
    }

    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .grid-3col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    /* Diagram Containers */
    .diagram-container {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px;
      margin: 8px 0;
      text-align: center;
    }

    .diagram-container svg {
      max-width: 100%;
      height: auto;
    }

    /* Footer Sign-off */
    .signoff-box {
      margin-top: 14px;
      background: #faf5ff;
      border: 1.5px dashed #a855f7;
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .signoff-seal {
      border: 2px solid #7c3aed;
      color: #7c3aed;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
      text-align: center;
    }

    .page-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
      font-size: 6.8pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- =========================================================================
       PAGE 1: EXECUTIVE SUMMARY, METADATA, PROBLEM STATEMENT & SCOPE
       ========================================================================= -->
  <div class="page">
    <div class="header-banner">
      <div class="brand-row">
        <div class="brand-logo">
          Vorld<span class="accent">X</span> Attendance 360
        </div>
        <span class="badge-cin">CIN: U62099UP2026PTC245598</span>
      </div>
      <div class="report-title">
        Enterprise Attendance, HR Governance & OfficeNova Portal System
      </div>
      <div class="report-subtitle">
        Comprehensive Engineering Project Report & Architecture Implementation Specification
      </div>
      <div class="meta-grid">
        <div class="meta-item">
          <span>Enterprise Org:</span>
          <strong>VorldX Industries Pvt Ltd</strong>
        </div>
        <div class="meta-item">
          <span>Technical Head & Sponsor:</span>
          <strong>CTO: Muba Khan Sir</strong>
        </div>
        <div class="meta-item">
          <span>Headquarters / Location:</span>
          <strong>Lucknow HQ, Uttar Pradesh</strong>
        </div>
        <div class="meta-item">
          <span>Status / Verification:</span>
          <strong>Production Ready (v2.0)</strong>
        </div>
      </div>
    </div>

    <!-- Section 1: Problem Statement -->
    <h2 class="section-heading"><span class="sec-num">01</span> Problem Statement</h2>
    <p>
      Traditional workforce management systems in growing enterprises face acute vulnerabilities that impair operational productivity, audit readiness, and employee trust:
    </p>
    <div class="grid-2col">
      <div class="info-card">
        <strong>1. Manual Clock-In & "Buddy Punching" Fraud:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Physical attendance registers and unencrypted RFID access cards allow proxy punching and manipulation, resulting in inaccurate overtime calculations, attendance theft, and payroll leakage.
        </p>
      </div>
      <div class="info-card">
        <strong>2. Fragmented Hybrid & Remote (WFH) Workflows:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Absence of dual-tier authorization between HR managers and department heads causes untracked work-from-home days, disputed leave deductions, and inconsistent approval queues.
        </p>
      </div>
      <div class="info-card">
        <strong>3. Hardware Biometric Bottlenecks & Maintenance:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Physical fingerprint scanners require high maintenance, cause lengthy queues during morning shifts, and fail to cater to off-site, client-facing, and remote engineering personnel.
        </p>
      </div>
      <div class="info-card">
        <strong>4. Disconnected Payroll & Compliance Audits:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Disparate spreadsheets for leaves, shifts, and salary calculations result in human errors, delayed monthly payslips, and compliance liabilities under ISO 27001 labor governance.
        </p>
      </div>
    </div>

    <!-- Section 2: Project Scope -->
    <h2 class="section-heading"><span class="sec-num">02</span> Project Scope & Key Deliverables</h2>
    <p>
      The <strong>VorldX Attendance 360</strong> project spans a unified, secure, and distributed platform serving three distinct organizational roles:
    </p>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 25%;">System Component</th>
          <th style="width: 45%;">Functional Scope & Modules</th>
          <th style="width: 30%;">Target Stakeholders</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>OfficeNova HR Portal</strong><br /><span class="badge badge-purple">Web Application</span></td>
          <td>16 Integrated Modules: Executive Dashboard, Staff Management, Biometric Punch Regularization, Leave Authorization, WFH Management, Hiring Pipeline, Performance Goals, Training & Development, Payroll Generation & Payslip Download, Company Policies, Broadcast Notices, Department Clustered Analytics, Team Calendar, System Settings, and Help Desk.</td>
          <td>HR Managers, Payroll Directors, People Operations Leads</td>
        </tr>
        <tr>
          <td><strong>Admin Control Center</strong><br /><span class="badge badge-cyan">Admin Dashboard</span></td>
          <td>Full organizational oversight, department budget allocation, multi-office QR kiosk registry, global override controls, and immutable security audit logging.</td>
          <td>Chief Technology Officer (Muba Khan Sir), Managing Directors, System Admins</td>
        </tr>
        <tr>
          <td><strong>Employee Native Android App</strong><br /><span class="badge badge-green">Mobile App (APK)</span></td>
          <td>HR-provisioned ID login, simulated OTP authentication, fast camera-based QR scanner, personal punch records, interactive Material Calendar view, WFH request submission, and profile manager.</td>
          <td>All On-site, Hybrid, and Remote Employees (Engineering, Sales, Operations)</td>
        </tr>
        <tr>
          <td><strong>Office QR Display Kiosk</strong><br /><span class="badge badge-amber">IoT / Web Display</span></td>
          <td>High-contrast digital signage interface deployed at facility entrances with 45-second cryptographically rotating QR codes, countdown timer, and live employee punch feed.</td>
          <td>Office Reception, Floor 1–4 Entrances, Conference Halls</td>
        </tr>
      </tbody>
    </table>

    <div class="page-footer">
      <span>VORLDX INDUSTRIES PRIVATE LIMITED • CIN: U62099UP2026PTC245598</span>
      <span>CTO: Muba Khan Sir • Engineering Report v2.0</span>
      <span>Page 1 of 5</span>
    </div>
  </div>

  <!-- =========================================================================
       PAGE 2: TECHNOLOGY STACK & SYSTEM ARCHITECTURE
       ========================================================================= -->
  <div class="page">
    <div class="header-banner" style="padding: 10px 16px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 800; font-size: 11pt; color: #ffffff;">VorldX Attendance 360 — System Architecture & Technology Stack</span>
        <span class="badge-cin">Architecture Specification</span>
      </div>
    </div>

    <!-- Section 3: Technology Stack -->
    <h2 class="section-heading"><span class="sec-num">03</span> Technology Stack</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 22%;">Layer / Tier</th>
          <th style="width: 28%;">Technology & Libraries</th>
          <th style="width: 50%;">Engineering Justification</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Frontend Architecture</strong></td>
          <td>React 19, Vite 8, Rolldown, Vanilla CSS Design System, Lucide React</td>
          <td>Ultra-fast compile times (&lt;700ms), zero runtime framework overhead, rich custom glassmorphism design tokens, full responsive layouts from 390px mobile to 4K ultra-wide monitors.</td>
        </tr>
        <tr>
          <td><strong>Mobile Runtime (APK)</strong></td>
          <td>Capacitor 8, Android Gradle 8.2, Java 21, R8 Full Mode Shrinking</td>
          <td>Cross-platform native Android compilation producing a lightweight 1.2 MB APK with hardware acceleration, auto-cache eviction on launch, and direct camera QR hardware access.</td>
        </tr>
        <tr>
          <td><strong>Backend API Layer</strong></td>
          <td>Node.js (v26 LTS), Express.js, RESTful Architecture, CORS, Body-Parser</td>
          <td>High-throughput asynchronous non-blocking I/O capable of handling simultaneous shift check-in bursts without database connection deadlocks.</td>
        </tr>
        <tr>
          <td><strong>Database Systems</strong></td>
          <td>Microsoft SQL Server (2019/2022/Azure) &amp; SQLite 3 (better-sqlite3 WAL)</td>
          <td>Dual-database flexibility: SQLite with Write-Ahead Logging (WAL) for instant local zero-config testing; full enterprise MSSQL schema with foreign keys, triggers, and stored procedures for enterprise deployment.</td>
        </tr>
        <tr>
          <td><strong>Cloud &amp; DevOps</strong></td>
          <td>Vercel (Frontend edge CDN), Render (Backend), GitHub Actions, Git</td>
          <td>Continuous integration &amp; continuous deployment (CI/CD) with instant webhooks to Vercel production edge servers and versioned artifact packaging.</td>
        </tr>
      </tbody>
    </table>

    <!-- Section 4: System Architecture Diagram -->
    <h2 class="section-heading"><span class="sec-num">04</span> 4-Tier System Architecture</h2>
    <p>
      The architecture follows a strict 4-tier modular separation designed for high availability, enterprise security, and auditability:
    </p>

    <div class="diagram-container">
      <svg viewBox="0 0 800 230" width="760" height="215" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e1b4b;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
          </filter>
        </defs>

        <!-- Tier 1: Presentation Layer -->
        <rect x="20" y="10" width="760" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="35" y="36" font-family="Inter" font-size="10" font-weight="800" fill="#7c3aed">TIER 1: PRESENTATION</text>
        <rect x="180" y="18" width="180" height="26" rx="4" fill="#7c3aed" />
        <text x="195" y="35" font-family="Inter" font-size="9" font-weight="700" fill="#ffffff">OfficeNova HR & Admin Web</text>
        <rect x="380" y="18" width="180" height="26" rx="4" fill="#0284c7" />
        <text x="395" y="35" font-family="Inter" font-size="9" font-weight="700" fill="#ffffff">Employee Mobile App (APK)</text>
        <rect x="580" y="18" width="180" height="26" rx="4" fill="#0d9488" />
        <text x="600" y="35" font-family="Inter" font-size="9" font-weight="700" fill="#ffffff">Office Rotating QR Kiosks</text>

        <!-- Down Arrows -->
        <path d="M 400 52 L 400 68" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Tier 2: Network & Gateway Layer -->
        <rect x="20" y="70" width="760" height="38" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
        <text x="35" y="94" font-family="Inter" font-size="10" font-weight="800" fill="#0f172a">TIER 2: GATEWAY</text>
        <text x="200" y="94" font-family="Inter" font-size="9" font-weight="600" fill="#334155">HTTPS / TLS 1.3 • Vercel Edge Network • CORS Security • JWT Session Token Filter</text>

        <!-- Down Arrows -->
        <path d="M 400 108 L 400 124" stroke="#7c3aed" stroke-width="2" />

        <!-- Tier 3: Business Logic Services -->
        <rect x="20" y="126" width="760" height="42" rx="6" fill="#faf5ff" stroke="#c084fc" stroke-width="1.5" />
        <text x="35" y="152" font-family="Inter" font-size="10" font-weight="800" fill="#7c3aed">TIER 3: LOGIC SERVICES</text>
        <rect x="180" y="134" width="135" height="26" rx="4" fill="#ffffff" stroke="#a855f7" />
        <text x="190" y="151" font-family="Inter" font-size="8.5" font-weight="700" fill="#7c3aed">QR Token Engine</text>
        <rect x="330" y="134" width="145" height="26" rx="4" fill="#ffffff" stroke="#a855f7" />
        <text x="338" y="151" font-family="Inter" font-size="8.5" font-weight="700" fill="#7c3aed">Attendance & Shift Calc</text>
        <rect x="490" y="134" width="135" height="26" rx="4" fill="#ffffff" stroke="#a855f7" />
        <text x="500" y="151" font-family="Inter" font-size="8.5" font-weight="700" fill="#7c3aed">Dual WFH Workflow</text>
        <rect x="640" y="134" width="125" height="26" rx="4" fill="#ffffff" stroke="#a855f7" />
        <text x="648" y="151" font-family="Inter" font-size="8.5" font-weight="700" fill="#7c3aed">Payroll Processor</text>

        <!-- Down Arrows -->
        <path d="M 400 168 L 400 184" stroke="#7c3aed" stroke-width="2" />

        <!-- Tier 4: Persistence Layer -->
        <rect x="20" y="184" width="760" height="40" rx="6" fill="#0f172a" />
        <text x="35" y="209" font-family="Inter" font-size="10" font-weight="800" fill="#38bdf8">TIER 4: DATABASE</text>
        <text x="210" y="209" font-family="Inter" font-size="9" font-weight="700" fill="#ffffff">Microsoft SQL Server (Enterprise Setup) &bull; SQLite 3 (WAL Mode) &bull; Audit Trail</text>
      </svg>
    </div>

    <div class="page-footer">
      <span>VORLDX INDUSTRIES PRIVATE LIMITED • CIN: U62099UP2026PTC245598</span>
      <span>CTO: Muba Khan Sir • Engineering Report v2.0</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- =========================================================================
       PAGE 3: ENTITY RELATIONSHIP (ER) DIAGRAM & DATABASE ARCHITECTURE
       ========================================================================= -->
  <div class="page">
    <div class="header-banner" style="padding: 10px 16px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 800; font-size: 11pt; color: #ffffff;">VorldX Attendance 360 — Entity Relationship (ER) Diagram</span>
        <span class="badge-cin">Data Architecture</span>
      </div>
    </div>

    <!-- Section 5: ER Diagram -->
    <h2 class="section-heading"><span class="sec-num">05</span> Entity Relationship (ER) Architecture</h2>
    <p>
      The complete relational database contains 12 core tables enforcing foreign key integrity, cascade delete protections, and indexing on employee identifiers and timestamps:
    </p>

    <div class="diagram-container" style="padding: 8px;">
      <svg viewBox="0 0 780 260" width="760" height="250" xmlns="http://www.w3.org/2000/svg">
        <!-- Entity: EMPLOYEES -->
        <g transform="translate(290, 80)">
          <rect width="180" height="110" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
          <rect width="180" height="24" rx="6" fill="#7c3aed"/>
          <text x="90" y="16" font-family="Inter" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">EMPLOYEES (Core)</text>
          <text x="10" y="38" font-family="Inter" font-size="7.5" font-weight="700" fill="#0f172a">PK id: VARCHAR(20)</text>
          <text x="10" y="52" font-family="Inter" font-size="7.5" fill="#334155">name, email, phone, role</text>
          <text x="10" y="66" font-family="Inter" font-size="7.5" fill="#334155">FK department_id</text>
          <text x="10" y="80" font-family="Inter" font-size="7.5" fill="#334155">FK shift_id</text>
          <text x="10" y="94" font-family="Inter" font-size="7.5" fill="#334155">status, password_hash</text>
        </g>

        <!-- Entity: DEPARTMENTS -->
        <g transform="translate(40, 10)">
          <rect width="160" height="65" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <rect width="160" height="20" rx="6" fill="#334155"/>
          <text x="80" y="14" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">DEPARTMENTS</text>
          <text x="10" y="34" font-family="Inter" font-size="7.5" font-weight="700" fill="#0f172a">PK id: INT</text>
          <text x="10" y="48" font-family="Inter" font-size="7.5" fill="#334155">dept_name, budget_code</text>
        </g>

        <!-- Entity: SHIFTS -->
        <g transform="translate(40, 130)">
          <rect width="160" height="75" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <rect width="160" height="20" rx="6" fill="#334155"/>
          <text x="80" y="14" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">SHIFTS</text>
          <text x="10" y="34" font-family="Inter" font-size="7.5" font-weight="700" fill="#0f172a">PK id: INT</text>
          <text x="10" y="48" font-family="Inter" font-size="7.5" fill="#334155">shift_name, start_time</text>
          <text x="10" y="62" font-family="Inter" font-size="7.5" fill="#334155">end_time, grace_minutes</text>
        </g>

        <!-- Entity: ATTENDANCE -->
        <g transform="translate(560, 10)">
          <rect width="180" height="85" rx="6" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
          <rect width="180" height="20" rx="6" fill="#059669"/>
          <text x="90" y="14" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">ATTENDANCE</text>
          <text x="10" y="34" font-family="Inter" font-size="7.5" font-weight="700" fill="#0f172a">PK id: INT</text>
          <text x="10" y="48" font-family="Inter" font-size="7.5" fill="#0f172a">FK employee_id, date</text>
          <text x="10" y="62" font-family="Inter" font-size="7.5" fill="#334155">check_in, check_out, status</text>
          <text x="10" y="76" font-family="Inter" font-size="7.5" fill="#334155">mode (QR/Bio), kiosk_id</text>
        </g>

        <!-- Entity: WFH_REQUESTS -->
        <g transform="translate(560, 115)">
          <rect width="180" height="75" rx="6" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5"/>
          <rect width="180" height="20" rx="6" fill="#d97706"/>
          <text x="90" y="14" font-family="Inter" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">WFH_REQUESTS</text>
          <text x="10" y="34" font-family="Inter" font-size="7.5" font-weight="700" fill="#0f172a">PK id: INT</text>
          <text x="10" y="48" font-family="Inter" font-size="7.5" fill="#0f172a">FK employee_id, req_date</text>
          <text x="10" y="62" font-family="Inter" font-size="7.5" fill="#334155">status, approver_role</text>
        </g>

        <!-- Entity: PAYROLL -->
        <g transform="translate(40, 215)">
          <rect width="160" height="40" rx="4" fill="#ffffff" stroke="#7c3aed" stroke-width="1"/>
          <text x="10" y="18" font-family="Inter" font-size="7.5" font-weight="700" fill="#7c3aed">PAYROLL</text>
          <text x="10" y="32" font-family="Inter" font-size="7" fill="#64748b">FK employee_id, basic, net</text>
        </g>

        <!-- Entity: LEAVE_REQUESTS -->
        <g transform="translate(220, 215)">
          <rect width="160" height="40" rx="4" fill="#ffffff" stroke="#0284c7" stroke-width="1"/>
          <text x="10" y="18" font-family="Inter" font-size="7.5" font-weight="700" fill="#0284c7">LEAVE_REQUESTS</text>
          <text x="10" y="32" font-family="Inter" font-size="7" fill="#64748b">FK employee_id, leave_type</text>
        </g>

        <!-- Entity: POLICIES & TRAINING -->
        <g transform="translate(400, 215)">
          <rect width="160" height="40" rx="4" fill="#ffffff" stroke="#0d9488" stroke-width="1"/>
          <text x="10" y="18" font-family="Inter" font-size="7.5" font-weight="700" fill="#0d9488">TRAINING & POLICIES</text>
          <text x="10" y="32" font-family="Inter" font-size="7" fill="#64748b">title, category, doc_size</text>
        </g>

        <!-- Entity: AUDIT_LOGS -->
        <g transform="translate(580, 215)">
          <rect width="160" height="40" rx="4" fill="#ffffff" stroke="#475569" stroke-width="1"/>
          <text x="10" y="18" font-family="Inter" font-size="7.5" font-weight="700" fill="#475569">AUDIT_LOGS</text>
          <text x="10" y="32" font-family="Inter" font-size="7" fill="#64748b">action, actor_id, timestamp</text>
        </g>

        <!-- Relationship Connectors -->
        <line x1="200" y1="42" x2="290" y2="105" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <line x1="200" y1="165" x2="290" y2="135" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
        <line x1="470" y1="110" x2="560" y2="52" stroke="#10b981" stroke-width="1.5"/>
        <line x1="470" y1="140" x2="560" y2="152" stroke="#f59e0b" stroke-width="1.5"/>
        <line x1="380" y1="190" x2="120" y2="215" stroke="#7c3aed" stroke-width="1"/>
        <line x1="380" y1="190" x2="300" y2="215" stroke="#0284c7" stroke-width="1"/>
      </svg>
    </div>

    <!-- Database Implementation Details -->
    <h3 class="sub-heading">Database Implementation Highlights</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Schema Entity</th>
          <th>Primary Key</th>
          <th>Foreign Key &amp; Constraints</th>
          <th>Indexes &amp; Performance Rules</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>employees</code></td>
          <td><code>id VARCHAR(20)</code></td>
          <td><code>email UNIQUE</code>, <code>department_id</code>, <code>shift_id</code></td>
          <td>Clustered index on <code>id</code>; non-clustered index on <code>email</code> &amp; <code>department</code></td>
        </tr>
        <tr>
          <td><code>attendance</code></td>
          <td><code>id INT IDENTITY</code></td>
          <td><code>employee_id REFERENCES employees(id)</code></td>
          <td>Composite unique constraint <code>UNIQUE(employee_id, date)</code>; prevents duplicate punch records</td>
        </tr>
        <tr>
          <td><code>wfh_requests</code></td>
          <td><code>id INT IDENTITY</code></td>
          <td><code>employee_id REFERENCES employees(id)</code></td>
          <td>Indexed on <code>status</code> and <code>approver_role</code> for fast dashboard queue filtering</td>
        </tr>
        <tr>
          <td><code>payroll</code></td>
          <td><code>id INT IDENTITY</code></td>
          <td><code>employee_id REFERENCES employees(id)</code></td>
          <td>Stored procedure <code>sp_GenerateMonthlyPayroll</code> batches all pending records</td>
        </tr>
      </tbody>
    </table>

    <div class="page-footer">
      <span>VORLDX INDUSTRIES PRIVATE LIMITED • CIN: U62099UP2026PTC245598</span>
      <span>CTO: Muba Khan Sir • Engineering Report v2.0</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- =========================================================================
       PAGE 4: METHODOLOGY, RBAC & HIERARCHICAL WORKFLOWS
       ========================================================================= -->
  <div class="page">
    <div class="header-banner" style="padding: 10px 16px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 800; font-size: 11pt; color: #ffffff;">VorldX Attendance 360 — Methodology & Governance</span>
        <span class="badge-cin">Engineering Methodology</span>
      </div>
    </div>

    <!-- Section 6: Methodology -->
    <h2 class="section-heading"><span class="sec-num">06</span> Engineering Methodology</h2>
    <p>
      The development executed an <strong>Agile Scrum Framework</strong> comprising four structured sprints:
    </p>
    <div class="grid-2col">
      <div class="info-card">
        <strong>Sprint 1: Schema Architecture & Core Backend</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Modeled dual MSSQL & SQLite databases, wrote master seed data, and established RESTful API endpoints for employee management and biometric punch recording.
        </p>
      </div>
      <div class="info-card">
        <strong>Sprint 2: Mobile App (APK) & Dynamic QR Kiosk</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Compiled Capacitor native Android APK with camera scanner, implemented 45-second rotating cryptographic QR token displays, and built OTP simulation.
        </p>
      </div>
      <div class="info-card">
        <strong>Sprint 3: OfficeNova HR Portal Implementation</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Constructed all 16 HR modules including Training programs, batch Payroll authorization, Company Policy documents, and clustered attendance analytics.
        </p>
      </div>
      <div class="info-card">
        <strong>Sprint 4: Verification, R8 Optimization & Deployment</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Reduced APK size from 95 MB down to 1.2 MB using R8 shrinking, tested cross-browser responsiveness, verified Vercel live deployment, and established audit logs.
        </p>
      </div>
    </div>

    <!-- Section 7: RBAC Specifications -->
    <h2 class="section-heading"><span class="sec-num">07</span> Role-Based Access Control (RBAC) Matrix</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Module / Action</th>
          <th>Super Admin</th>
          <th>HR Manager (OfficeNova)</th>
          <th>Employee (Android App)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Executive Analytics</strong></td>
          <td>Full organizational financial & headcount KPI access</td>
          <td>Department attendance, leave & training metrics</td>
          <td>Personal punch history & hours worked</td>
        </tr>
        <tr>
          <td><strong>Staff Management</strong></td>
          <td>Full CRUD (Add, Edit, Shift Assignment, Deactivate)</td>
          <td>Manage employee records & documentation</td>
          <td>Self-account profile editing only (Screen 17)</td>
        </tr>
        <tr>
          <td><strong>Punch Regularization</strong></td>
          <td>Global administrative override & audit trail</td>
          <td>Approve / Edit punch-in and punch-out discrepancies</td>
          <td>Submit regularization adjustment request</td>
        </tr>
        <tr>
          <td><strong>Staff WFH Approval</strong></td>
          <td>Secondary override if required</td>
          <td><strong>Primary Approver</strong> (1-click Approve / Reject)</td>
          <td>Submit request with date, phone & deliverables</td>
        </tr>
        <tr>
          <td><strong>HR Staff WFH Approval</strong></td>
          <td><strong>Primary Approver</strong> (Prevents conflict of interest)</td>
          <td>Submits own request to Super Admin queue</td>
          <td>No access</td>
        </tr>
        <tr>
          <td><strong>Payroll Processing</strong></td>
          <td>Authorize total monthly payroll disbursements</td>
          <td>Generate batch payroll, inspect and download payslips</td>
          <td>View personal monthly take-home salary slip</td>
        </tr>
      </tbody>
    </table>

    <!-- Section 8: Hierarchical WFH Workflow -->
    <h2 class="section-heading"><span class="sec-num">08</span> Hierarchical WFH Approval State Machine</h2>
    <div class="info-card" style="font-family: 'JetBrains Mono', monospace; font-size: 7.5pt; line-height: 1.5; background: #faf5ff;">
      [Staff Submits WFH Request]  ──► [HR Manager Approval Queue] ──(Approve)──► [Status: APPROVED] ──► (Syncs Attendance to 'WFH')<br />
                                                                   └──(Reject)──►  [Status: REJECTED] ──► (Notifies Employee)<br /><br />
      [HR Manager Submits WFH]     ──► [Super Admin Approval Queue]──(Approve)──► [Status: APPROVED] ──► (Conflict of Interest Protected)<br />
                                                                   └──(Reject)──►  [Status: REJECTED] ──► (Notifies HR Manager)
    </div>

    <div class="page-footer">
      <span>VORLDX INDUSTRIES PRIVATE LIMITED • CIN: U62099UP2026PTC245598</span>
      <span>CTO: Muba Khan Sir • Engineering Report v2.0</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- =========================================================================
       PAGE 5: CONCLUSION, FUTURE SCOPE & OFFICIAL CTO SIGN-OFF
       ========================================================================= -->
  <div class="page">
    <div class="header-banner" style="padding: 10px 16px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 800; font-size: 11pt; color: #ffffff;">VorldX Attendance 360 — Conclusion & Roadmap</span>
        <span class="badge-cin">Official Project Sign-off</span>
      </div>
    </div>

    <!-- Section 9: Conclusion -->
    <h2 class="section-heading"><span class="sec-num">09</span> Conclusion & Project Evaluation</h2>
    <p>
      The <strong>VorldX Attendance 360 & OfficeNova Portal</strong> successfully delivers a resilient, cloud-ready, and mobile-native workforce governance ecosystem for VorldX Industries Private Limited. All 18 target screens, 16 HR modules, dynamic cryptographic QR rotating kiosks, and Android APK client applications have been implemented, tested, and validated with zero runtime errors.
    </p>

    <!-- Section 10: Future Scope & Roadmap -->
    <h2 class="section-heading"><span class="sec-num">10</span> Future Scope & Technical Roadmap</h2>
    <div class="grid-2col">
      <div class="info-card">
        <strong>1. Edge AI Facial Biometrics:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Integrating on-device lightweight TensorFlow.js face recognition on the mobile app to verify real-time user presence during QR scanning without transmitting sensitive biometric data to cloud servers.
        </p>
      </div>
      <div class="info-card">
        <strong>2. Bluetooth Low Energy (BLE) Geofenced Beacons:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Deploying micro BLE beacons inside office physical premises to auto-clock employees upon entering designated office zones, completely eliminating manual check-in requirements.
        </p>
      </div>
      <div class="info-card">
        <strong>3. Automated Statutory Tax & Filing Integrations:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Direct API gateways with Indian Employee Provident Fund Organization (EPFO) and Tax Deducted at Source (TDS) portals to automate monthly compliance filings directly from payroll records.
        </p>
      </div>
      <div class="info-card">
        <strong>4. Predictive Absenteeism Analytics:</strong>
        <p style="margin: 3px 0 0 0; font-size: 7.8pt;">
          Machine learning algorithms to detect burnout trends, irregular punch patterns, and forecast staffing needs across engineering and customer support departments.
        </p>
      </div>
    </div>

    <!-- Section 11: Production Verification & Links -->
    <h2 class="section-heading"><span class="sec-num">11</span> Production Deployment Directory</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Asset</th>
          <th>Location / Link</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Live Web Application</strong></td>
          <td><code>https://client-mauve-eight-72.vercel.app</code></td>
          <td><span class="badge badge-green">Live Production</span></td>
        </tr>
        <tr>
          <td><strong>GitHub Source Code</strong></td>
          <td><code>https://github.com/shreyay1310-svg/vorldx</code></td>
          <td><span class="badge badge-purple">Synchronized (main)</span></td>
        </tr>
        <tr>
          <td><strong>Enterprise Database</strong></td>
          <td><code>/database</code> (MSSQL Master Setup + SQLite Master Dump)</td>
          <td><span class="badge badge-cyan">Complete Schemas</span></td>
        </tr>
        <tr>
          <td><strong>Figma Design System</strong></td>
          <td><code>/design</code> (vorldx_tokens.json &amp; FIGMA_DESIGN_SYSTEM.md)</td>
          <td><span class="badge badge-amber">W3C Tokens</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Section 12: Official Approval & Sign-off -->
    <div class="signoff-box">
      <div>
        <div style="font-size: 9pt; font-weight: 800; color: #1e1b4b; margin-bottom: 2px;">
          PROJECT VERIFICATION &amp; TECHNICAL ENDORSEMENT
        </div>
        <div style="font-size: 8pt; color: #475569; margin-bottom: 4px;">
          VORLDX INDUSTRIES PRIVATE LIMITED &bull; Lucknow HQ, Uttar Pradesh, India
        </div>
        <div style="font-size: 8.5pt; font-weight: 700; color: #7c3aed;">
          Approved By: CTO Muba Khan Sir
        </div>
        <div style="font-size: 7.5pt; color: #64748b;">
          Chief Technology Officer &amp; Principal Enterprise System Architect
        </div>
      </div>
      <div style="text-align: right;">
        <div class="signoff-seal">
          OFFICIALLY APPROVED
        </div>
        <div style="font-size: 7pt; color: #64748b; margin-top: 4px;">
          Signed: October 2026 &bull; Status: Verified
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>VORLDX INDUSTRIES PRIVATE LIMITED • CIN: U62099UP2026PTC245598</span>
      <span>CTO: Muba Khan Sir • Engineering Report v2.0</span>
      <span>Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'project_report_print.html');
const outputPdfPath = path.join(__dirname, 'VorldX_Project_Report.pdf');
const serverDownloadPdfPath = path.join(__dirname, 'server', 'downloads', 'VorldX-Project-Report.pdf');
const clientPublicPdfPath = path.join(__dirname, 'client', 'public', 'VorldX_Project_Report.pdf');
const clientDistPdfPath = path.join(__dirname, 'client', 'dist', 'VorldX_Project_Report.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('Created comprehensive printable HTML at:', htmlFilePath);

const edgeExecutable = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
const fileUrl = 'file:///' + htmlFilePath.replace(/\\\\/g, '/');

console.log('Generating multi-page PDF via headless Microsoft Edge...');
const command = '"' + edgeExecutable + '" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="' + outputPdfPath + '" "' + fileUrl + '"';

try {
  execSync(command);
  console.log('PDF successfully created at:', outputPdfPath);
  console.log('PDF File Size:', (fs.statSync(outputPdfPath).size / 1024).toFixed(2), 'KB');

  // Copy to server downloads & client public for direct web downloading
  fs.mkdirSync(path.dirname(serverDownloadPdfPath), { recursive: true });
  fs.copyFileSync(outputPdfPath, serverDownloadPdfPath);
  console.log('Copied to server downloads:', serverDownloadPdfPath);

  fs.mkdirSync(path.dirname(clientPublicPdfPath), { recursive: true });
  fs.copyFileSync(outputPdfPath, clientPublicPdfPath);
  console.log('Copied to client public directory:', clientPublicPdfPath);

  if (fs.existsSync(path.dirname(clientDistPdfPath))) {
    fs.copyFileSync(outputPdfPath, clientDistPdfPath);
    console.log('Copied to client dist directory:', clientDistPdfPath);
  }

  // Cleanup temporary HTML file
  fs.unlinkSync(htmlFilePath);
  console.log('Cleaned up temporary HTML.');
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
