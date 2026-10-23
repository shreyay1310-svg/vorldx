# 🎨 VorldX Attendance 360 — Figma Design System & UI Specifications

This document defines the complete UI design system, color hierarchy, typography styles, component architecture, and wireframe specifications for **VorldX Attendance 360**.

---

## 🎨 Design Tokens & Color Palette

### 1. Canvas & Surface Layers
* **Background Root:** `#090e1a` (Deep obsidian dark space)
* **Surface Card:** `#0d1527` (Elevation 1 / Table & Card containers)
* **Surface Light / Modals:** `#162035` / `#0b1324` (Elevation 2)
* **Sidebar Base:** `#070c16` (Deep charcoal nav strip)
* **Topbar Blur:** `rgba(11, 19, 36, 0.95)` with `backdrop-filter: blur(10px)`

### 2. Functional & Status Accents
* **Primary Purple (Buttons & Active Tabs):** `linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)`
  - Solid HEX: `#7c3aed` / Glow: `0 4px 14px rgba(124, 58, 237, 0.4)`
* **Cyan (Emp IDs & Info):** `#38bdf8` (Pill fill: `rgba(56, 189, 248, 0.12)`)
* **Emerald (Present / Approved / Processed):** `#10b981` (Pill fill: `rgba(16, 185, 129, 0.12)`)
* **Amber (Pending / WFH / Warning):** `#f59e0b` (Pill fill: `rgba(245, 158, 11, 0.12)`)
* **Rose (Absent / Rejected / Urgent):** `#ef4444` (Pill fill: `rgba(239, 68, 68, 0.12)`)

---

## 📐 Core Portal Layouts & Figma Frame Architecture

### 🏢 Layout 1: OfficeNova HR Portal (`Frame: 1440 × 900 px`)
Designed for HR Managers, Payroll Officers, and Department Leads.
* **Navigation Sidebar (`200px` fixed width):**
  - Brand header: OfficeNova HR with purple lightning logo.
  - 8 Direct Navigation Items: Real-Time Attendance (Active), Employee Directory (24 staff), WFH Approvals (4 pending), Leave Ledger, Geofence Zones, Compliance & Audit, Payroll Management, HR Settings.
* **Header / Topbar (`60px` height):**
  - Section title: "Attendance & Roster Center" + Real-Time Sync Indicator (`● Cloud Sync Active`).
  - Search Bar: Global employee name & ID search filter (`Ctrl + K`).
* **KPI Metrics Row (Auto-Layout Horizontal Stack, 4 Cards):**
  - Total Workforce (`24` / Neutral)
  - Present Today (`18` / Emerald `#10b981`)
  - Remote / WFH (`4` / Amber `#f59e0b`)
  - Absent / Leave (`2` / Rose `#ef4444`)
* **Live Roster Data Table:**
  - 5-Column Grid: Employee ID, Full Name, Status Pill (Present / WFH / Leave), Punch In Time, Verification Terminal (Dynamic QR Kiosk / Geofence GPS).

---

### 👤 Layout 2: Employee Portal (`Desktop Frame: 1440 × 900 px` & `Mobile App: 390 × 844 px`)
Self-service workforce hub tailored for individual employees (e.g., Rohit Sharma `VX001`).
* **Desktop Employee Viewport:**
  - **Hero Welcome Banner:** Personalized greeting (`"Hello, Rohit Sharma! 👋"`), motivational quote, and checked-in timestamp pill (`✓ Checked In Today at 09:05 AM`).
  - **4 Employee KPI Cards:** Today's Status (`Present ✓`), Working Hours (`6h 25m`), Monthly Attendance Rate (`18 / 26 days • 69%`), Leave Balance (`12 days available`).
  - **Quick Action Matrix (3 Cards):**
    1. Mark Attendance (Camera QR scanner trigger)
    2. Apply WFH Request (GPS Geofenced workflow)
    3. Apply Leave Request (Casual, Sick, Earned Leave)
  - **Attendance Overview Chart:** Dynamic monthly trend line with punctuality ratings (`92% Top Performer`).
  - **Side Deck:** Upcoming Corporate Holidays, Team Meetings, and Company Announcements.
* **Mobile Employee Viewport (`390 × 844 px` iPhone 15 / Android):**
  - CameraX Barcode Scanner card with animated scanning target.
  - Large Touch Punch Button (`height: 52px`, `border-radius: 12px`, purple gradient).
  - Bottom Navigation Bar (`56px` height): Home, Requests, Stats, History, Profile.

---

### 🛡️ Layout 3: Admin Management & Control Center (`Frame: 1440 × 900 px`)
Executive administration console for System Administrators and CTO Muba Khan Sir.
* **Admin Navigation Sidebar (`200px` fixed width):**
  - Brand header: Admin Center with blue shield badge (`#0284c7`).
  - Navigation Items: Control Center (Active), Role & RBAC (3-Tier), MSSQL 2022 DB Sync, Shift Schedules, Department Hierarchy, Security & Audit Logs.
* **Database & Engine Status Banner:**
  - Dual Persistence Indicator: `Microsoft SQL Server 2022 Enterprise + Local SQLite Dual Sync`.
  - Replication Status: `● Replication In-Sync (Latency: 4ms)`.
* **System Health KPI Cards (4 Cards):**
  - Active Users: `24 Active`
  - Server CPU: `12% Normal`
  - RAM Heap: `256 MB`
  - Security Audit Logs: `1,420 Entries`
* **3-Tier RBAC Management Table:**
  - Super Admin (`EMP000` Rahul Verma - Full Module Authority, 2FA Enabled)
  - HR Manager (`HR001` Pooja Saxena - Approvals, Payroll & Directory)
  - Employee (`VX001` Rohit Sharma - Self-Service Punch)

---

### 📱 Layout 4: Dynamic QR Kiosk Terminal (`Frame: 1080 × 1920 px` Portrait)
Public check-in kiosk terminal stationed at company physical entrances.
* High-contrast OLED dark background (`#050811`).
* Rotating 45-second HMAC-SHA256 encrypted QR Code with circular progress countdown.
* Real-time synchronized digital clock (`HH:MM:SS AM/PM`).
* Instant punch confirmation chime with audio-visual feedback wave.

---

## 🧩 Core Component Libraries

### 1. Stat Cards (KPI Card)
* **Dimensions:** Fluid width, height `92px`
* **Styling:** `background: #0d1527`, `border: 1px solid rgba(255, 255, 255, 0.08)`, `border-radius: 12px`, padding `18px 20px`
* **Hierarchy:**
  - Label: `#94a3b8`, `12px` (Medium 500)
  - Metric Value: `#ffffff` or Accent, `24px` (Extrabold 800)
  - Icon Badge: `42px × 42px`, `border-radius: 10px`, accent background

### 2. Enterprise Data Tables
* **Table Card Container:** `border-radius: 12px`, `border: 1px solid rgba(255, 255, 255, 0.06)`
* **Table Header Row (`<thead>`):** Height `44px`, background `rgba(255, 255, 255, 0.02)`, text `11px` uppercase, color `#94a3b8`, font-weight `700`
* **Table Row (`<tbody> <tr>`):** Height `52px`, border-bottom `1px solid rgba(255, 255, 255, 0.05)`, hover background `rgba(255, 255, 255, 0.03)`
* **Status Badges (`.hr-pill`):**
  - Height `24px`, padding `2px 10px`, border-radius `12px`, font-size `11px`, font-weight `700`

### 3. Glassmorphism Modals
* **Overlay:** `background: rgba(0, 0, 0, 0.75)`, `backdrop-filter: blur(6px)`
* **Modal Frame:** Max-width `520px` to `680px`, `background: #0d1527`, `border: 1px solid rgba(168, 85, 247, 0.25)`, `border-radius: 16px`, padding `26px`
* **Shadow:** `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.15)`

---

## 📱 16 Documented Screens in Architecture

1. **Screen 1:** HR & Executive Dashboard (KPIs, Weekly Pulse, Quick Actions)
2. **Screen 2:** Employee Directory & Management (Search, Filters, Add Employee)
3. **Screen 3:** Real-Time Attendance Management (Punch In/Out, Biometrics, Correction)
4. **Screen 4:** Leave Requests & Entitlements (Approve / Reject, Leave balances)
5. **Screen 5:** WFH Requests & Approvals (Date, deliverables, one-click authorization)
6. **Screen 6:** HR Management (Staff hierarchy, department leads)
7. **Screen 7:** Recruitment & Applicant Pipeline (Job postings, applicant stages)
8. **Screen 8:** Performance & Goal Management (Quarterly KPIs, Top performers)
9. **Screen 9:** Training & Development (All / Upcoming / Completed, Publish course)
10. **Screen 10:** Payroll Management (Salary breakdown, Payslip download, Process batch)
11. **Screen 11:** Company Policies (PDF/Text document view, download, upload policy)
12. **Screen 12:** Notices & Announcements (Broadcast company bulletins)
13. **Screen 13:** Reports & Analytics (Department clustered column chart, CSV export)
14. **Screen 14:** Team Calendar & Holidays (Schedules and corporate events)
15. **Screen 15:** General Settings (Company parameters, HR preference checkmarks)
16. **Screen 16:** Help, Support & Ticket Desk (Raise ticket, audit status)

---

## 📥 How to Import into Figma
1. Open Figma and create a new project.
2. Install the **Tokens Studio for Figma** plugin.
3. Open the plugin, click **Settings > Load from File**, and select [`vorldx_tokens.json`](./vorldx_tokens.json).
4. All styles, colors, typography, and elevations will be auto-generated as native Figma Styles and Variables!
