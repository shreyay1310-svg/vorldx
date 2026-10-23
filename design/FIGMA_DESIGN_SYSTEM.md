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

## 📐 Layout Grids & Screen Specifications

### Desktop Web Layout (HR & Admin Portals)
* **Canvas Frame:** `1440px` (or `1920px`) × `1024px` auto-height
* **Sidebar Navigation:** Fixed width `240px`, height `100vh`, padding `16px 12px`
* **Topbar:** Fixed height `60px`, fluid width
* **Main Content Viewport:** Fluid width (`calc(100vw - 240px)`), padding `24px`
* **Grid System:** 12-column grid, `24px` gutter, `24px` margin

### Mobile Layout (Employee Native App)
* **Canvas Frame:** `390px × 844px` (iPhone 14/15 & Android standard viewport)
* **Touch Targets:** Minimum `44px × 44px` for buttons, tabs, and interactive rows
* **Bottom Navigation Bar:** Height `68px`, 4 tabs (Dashboard, Punch, Calendar, Profile)

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
