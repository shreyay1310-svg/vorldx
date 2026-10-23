const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>VorldX Employee Attendance System - Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
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
      color: #1e293b;
      line-height: 1.5;
      font-size: 10pt;
    }

    .page {
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Cover / Header Header Banner */
    .header-banner {
      background: linear-gradient(135deg, #090e17 0%, #0f172a 50%, #004d40 100%);
      color: #ffffff;
      padding: 24px 28px;
      border-radius: 12px;
      margin-bottom: 20px;
      border-left: 6px solid #00897b;
    }

    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .brand-logo {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-logo span {
      color: #2dd4bf;
    }

    .cin-badge {
      font-size: 7.5pt;
      font-weight: 700;
      background: rgba(45, 212, 191, 0.15);
      border: 1px solid rgba(45, 212, 191, 0.4);
      color: #2dd4bf;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }

    .report-title {
      font-size: 17pt;
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .report-subtitle {
      font-size: 9.5pt;
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 14px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: rgba(255, 255, 255, 0.06);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 8pt;
    }

    .meta-item strong {
      display: block;
      color: #2dd4bf;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    /* Section Styles */
    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 12pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #00897b;
      padding-bottom: 5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-title .num {
      background: #00897b;
      color: #ffffff;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      font-weight: 800;
    }

    /* Feature Cards Grid */
    .card-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      border-top: 3px solid #00897b;
    }

    .feature-card h4 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .feature-card p {
      font-size: 8pt;
      color: #475569;
      line-height: 1.4;
    }

    /* Screen Catalog Table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin-bottom: 14px;
      background: #ffffff;
    }

    th, td {
      padding: 7px 9px;
      border: 1px solid #e2e8f0;
      text-align: left;
    }

    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 8pt;
      letter-spacing: 0.3px;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 12px;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-pass { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-admin { background: #e0e7ff; color: #3730a3; border: 1px solid #a5b4fc; }
    .badge-mobile { background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc; }
    .badge-kiosk { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

    /* ASCII / Workflow Box */
    .flow-box {
      background: #090e17;
      color: #e2e8f0;
      padding: 14px 18px;
      border-radius: 8px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 8pt;
      line-height: 1.4;
      border-left: 4px solid #38bdf8;
      margin-bottom: 14px;
    }

    /* 2-Column Info Grid */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 14px;
    }

    .info-panel {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
    }

    .info-panel h4 {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }

    .info-panel ul {
      list-style-type: none;
      padding-left: 0;
      font-size: 8pt;
    }

    .info-panel li {
      margin-bottom: 4px;
      color: #334155;
    }

    .info-panel li strong {
      color: #0f172a;
    }

    /* Footer Sign-off */
    .footer-signoff {
      margin-top: 20px;
      padding: 14px 18px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid #00897b;
      font-size: 8pt;
      color: #475569;
    }

    .footer-signoff strong {
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- ================= PAGE 1 ================= -->
  <div class="page">
    <div class="header-banner">
      <div class="brand-row">
        <div class="brand-logo">
          VORLD<span>X</span> ATTENDANCE 360
        </div>
        <div class="cin-badge">
          CIN: U62099UP2026PTC245598
        </div>
      </div>
      <h1 class="report-title">Executive Project Report & Technical Specification</h1>
      <div class="report-subtitle">
        Enterprise-Grade Biometric QR Terminal, Native Android APK & Hybrid Attendance Management System
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <strong>Organization</strong>
          VorldX Industries Pvt Ltd
        </div>
        <div class="meta-item">
          <strong>Location</strong>
          Lucknow HQ, Uttar Pradesh
        </div>
        <div class="meta-item">
          <strong>Scope Delivered</strong>
          18 Screens • RBAC • Mobile APK
        </div>
        <div class="meta-item">
          <strong>Release Date</strong>
          October 2026 (Production v2.4)
        </div>
      </div>
    </div>

    <!-- 1. Executive Summary -->
    <div class="section">
      <h2 class="section-title"><span class="num">1</span> Project Overview & Core Architecture</h2>
      <p style="font-size: 8.5pt; color: #334155; margin-bottom: 12px; line-height: 1.45;">
        The <strong>VorldX Employee Attendance System</strong> is an end-to-end enterprise attendance infrastructure built for VorldX Industries Private Limited. The system completely modernizes physical fingerprint scanners and paper logbooks using rotating cryptographic QR biometrics, automated late/grace policy validation, multi-tier Work From Home (WFH) & Leave workflows, and dedicated native Android APK distribution.
      </p>

      <div class="card-grid-3">
        <div class="feature-card">
          <h4>🏢 HR & Admin Portal</h4>
          <p>Full web dashboard with Super Admin & HR Manager roles. Real-time KPIs, staff directories, attendance regularizations, policy rules, and multi-display pairing.</p>
        </div>
        <div class="feature-card">
          <h4>📱 Employee Mobile APK</h4>
          <p>Native Android APK (Capacitor) featuring biometric QR camera scanning, multi-day calendar range pickers for Leaves & WFH, and interactive monthly attendance history.</p>
        </div>
        <div class="feature-card">
          <h4>📺 Office Kiosk Display</h4>
          <p>Wall-mounted full-screen kiosk interface displaying auto-rotating QR tokens (45s validity), animated countdown progress, and live check-in confirmation chime.</p>
        </div>
      </div>
    </div>

    <!-- 2. Technology Stack & Key Highlights -->
    <div class="section">
      <h2 class="section-title"><span class="num">2</span> Technology Architecture & Data Schemas</h2>
      <div class="two-col">
        <div class="info-panel">
          <h4>💻 Technical Stack</h4>
          <ul>
            <li><strong>Frontend Web:</strong> React 19, Vite 8, Vanilla CSS Design System, Lucide Icons</li>
            <li><strong>Mobile APK:</strong> Capacitor Native Android (Java 21, Gradle, MinSDK 22)</li>
            <li><strong>Backend API:</strong> Node.js, Express 5 REST API (Port 5000)</li>
            <li><strong>Database:</strong> SQLite with WAL Mode (Zero-latency offline file storage)</li>
            <li><strong>Security:</strong> Cryptographic Rotating Tokens (45s TTL), RBAC Authorization</li>
          </ul>
        </div>
        <div class="info-panel">
          <h4>🗄️ Relational Data Models</h4>
          <ul>
            <li><code>employees</code>: ID (VX001-VX050), Name, Role, Shift, Dept, Avatar, Phone</li>
            <li><code>attendance</code>: Date, Check-in, Check-out, Duration, Status, Kiosk ID</li>
            <li><code>wfh_requests</code>: Date Range, Reason, Approval Status, Reviewer Note</li>
            <li><code>leave_requests</code>: From/To Date, Type (Casual/Sick), Reason, Status</li>
            <li><code>kiosk_displays</code>: Registry ID, Location, Token, Active Status</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 3. Hierarchical WFH & Leave Workflow -->
    <div class="section">
      <h2 class="section-title"><span class="num">3</span> Hierarchical WFH & Leave Approval Workflow</h2>
      <div class="flow-box">
[Employee Submits Multi-Day WFH / Leave]
         │
         ▼
[HR Manager Queue: Sneha Verma] ───(Approves / Rejects)───► [Employee Sees Live Status & Remarks]
                                                            └──► [Auto-updates Attendance Calendar]

[HR Manager Submits Own WFH Request]
         │
         ▼
[Super Admin Queue: Vikram Singhania] ───(Approves/Rejects)──► [HR Sees Decision & Logged in Audit]
      </div>
    </div>
  </div>

  <!-- ================= PAGE 2 ================= -->
  <div class="page">
    <!-- 4. Complete Screen Catalog -->
    <div class="section">
      <h2 class="section-title"><span class="num">4</span> Catalog of All 18 User Interface Screens Implemented</h2>

      <table>
        <thead>
          <tr>
            <th style="width: 10%;">Screen</th>
            <th style="width: 25%;">Screen Title</th>
            <th style="width: 15%;">Platform</th>
            <th style="width: 35%;">Key Implementation Features</th>
            <th style="width: 15%;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Screen 1</strong></td>
            <td>Admin & HR Login</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Role-aware authentication for Super Admin & HR Manager with 1-click switcher.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 2</strong></td>
            <td>Admin Executive Dashboard</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Month picker (Oct 2026), 4 KPI cards (Total, Present, WFH, Late) & daily bar chart.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 3</strong></td>
            <td>Employee Directory</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Department filter, status badges, staff table pagination & + Add Employee modal.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 4</strong></td>
            <td>Employee Profile (Admin)</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Breadcrumbs, avatar, VX001 badges, tabs: Overview, Attendance, WFH, Personal.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 5</strong></td>
            <td>Attendance Management</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Date range filter, CSV export, manual regularization & audit notes.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 6</strong></td>
            <td>WFH & Leave Approvals</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Queue routing (HR vs Admin), status tabs (All, Pending, Approved), 1-click decision.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 7</strong></td>
            <td>Policy & Shift Settings</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>General shift (09:00 AM - 06:00 PM), 15m grace period, late rules & workdays.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 8</strong></td>
            <td>Office Kiosk Displays</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Registry of 4 displays (Reception, Floor 2, Floor 3, Meeting Room), pairing tokens.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 9</strong></td>
            <td>Reports & Graphical Analysis</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>85% Attendance rate, daily attendance bar chart & department distribution donut chart.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 10</strong></td>
            <td>Compliance Audit Trail</td>
            <td><span class="badge badge-admin">Web Portal</span></td>
            <td>Immutable activity logs tracking actions, timestamps, and actors.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 11</strong></td>
            <td>Mobile App Authentication</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Employee ID login (VX001), corporate branding, fast authorization.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 12</strong></td>
            <td>6-Box OTP Verification</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Auto-focused 6-digit OTP inputs, 30s countdown timer, resend action.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 13</strong></td>
            <td>Mobile Home Dashboard</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Live greetings, Today punch card (In: 09:05 AM, Out: 06:02 PM), Scan QR button.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 14</strong></td>
            <td>Camera QR Scanner</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Real camera viewfinder with Html5Qrcode, target reticle, torch & audio chime.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 15</strong></td>
            <td>WFH & Leave Requests Hub</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Calendar range pickers (From/To), auto day calculation, HR decision tracking.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 16</strong></td>
            <td>Attendance Calendar & Logs</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Material calendar view, clickable DD/MM/YYYY dates, punch reasons & terminal ID.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 17</strong></td>
            <td>Employee Profile Self-Service</td>
            <td><span class="badge badge-mobile">Android APK</span></td>
            <td>Self photo avatar presets, editable contact/email, password change & locked badges.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
          <tr>
            <td><strong>Screen 18</strong></td>
            <td>Rotating Office QR Terminal</td>
            <td><span class="badge badge-kiosk">Kiosk TV</span></td>
            <td>Fullscreen high-contrast display, live clock, 45s dynamic rotating QR biometric.</td>
            <td><span class="badge badge-pass">Verified</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 5. Role-Based Access Control (RBAC) Matrix -->
    <div class="section">
      <h2 class="section-title"><span class="num">5</span> Role-Based Access Control (RBAC) Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Module / Permission</th>
            <th>Super Admin</th>
            <th>HR Manager</th>
            <th>Employee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Executive Dashboard</strong></td>
            <td>Full corporate KPIs & bar charts</td>
            <td>Department KPIs & summaries</td>
            <td>Personal attendance overview</td>
          </tr>
          <tr>
            <td><strong>Employee Records</strong></td>
            <td>Full CRUD & credential management</td>
            <td>Staff records & shift assignments</td>
            <td>View & edit own profile</td>
          </tr>
          <tr>
            <td><strong>Attendance Logs & Edits</strong></td>
            <td>All records & manual regularization</td>
            <td>Staff regularizations with audit note</td>
            <td>View personal logs & reasons</td>
          </tr>
          <tr>
            <td><strong>Staff WFH / Leave Approval</strong></td>
            <td>Override authority if needed</td>
            <td>Primary Reviewer & Approver</td>
            <td>Submit applications & track review</td>
          </tr>
          <tr>
            <td><strong>HR Lead WFH Approval</strong></td>
            <td>Primary Reviewer & Approver</td>
            <td>Submits own requests to Admin</td>
            <td>No access</td>
          </tr>
          <tr>
            <td><strong>Shift Policies & Grace</strong></td>
            <td>Full management & thresholds</td>
            <td>Read-only inspection</td>
            <td>No access</td>
          </tr>
          <tr>
            <td><strong>Kiosk Display Pairing</strong></td>
            <td>Add/Deactivate/Re-token displays</td>
            <td>View display online status</td>
            <td>Scans kiosk with phone camera</td>
          </tr>
          <tr>
            <td><strong>Audit Trail & Reports</strong></td>
            <td>Full immutable compliance export</td>
            <td>Department analytical reports</td>
            <td>View personal attendance report</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 6. Verification Sign-off -->
    <div class="footer-signoff">
      <div>
        <strong>VORLDX INDUSTRIES PRIVATE LIMITED</strong><br />
        Lucknow HQ, Uttar Pradesh, India • CIN: U62099UP2026PTC245598<br />
        Contact: <code>hello@vorldx.com</code> • Web: <code>https://client-mauve-eight-72.vercel.app</code>
      </div>
      <div style="text-align: right;">
        <span class="badge badge-pass" style="font-size: 8pt; padding: 4px 10px;">✅ 18 / 18 Screens Verified</span><br />
        <span style="font-size: 7.5pt; color: #64748b; margin-top: 4px; display: inline-block;">Official Internship Project Sign-off</span>
      </div>
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
console.log('Created temporary printable HTML at:', htmlFilePath);

const edgeExecutable = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
const fileUrl = 'file:///' + htmlFilePath.replace(/\\\\/g, '/');

console.log('Generating PDF via headless Microsoft Edge...');
const command = '"' + edgeExecutable + '" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="' + outputPdfPath + '" "' + fileUrl + '"';

try {
  execSync(command);
  console.log('PDF successfully created at:', outputPdfPath);

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
