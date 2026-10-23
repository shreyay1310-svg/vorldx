# VorldX Employee Attendance System
## Comprehensive Technical Project Report & Implementation Documentation
**Company:** VORLDX INDUSTRIES PRIVATE LIMITED  
**CIN:** U62099UP2026PTC245598  
**Headquarters:** Lucknow, Uttar Pradesh, India  
**Contact:** hello@vorldx.com  
**Project Brief:** VorldX Internship Team  
**Specification Reference:** 18 UI Screens • Role-Based Access Control (RBAC) • WFH Approval Workflow  
**Date:** October 2026  

---

## 1. Project Overview & System Components

The **VorldX Employee Attendance System** is an enterprise full-stack attendance management solution engineered for VorldX Industries Private Limited. The system completely eliminates physical biometric devices and manual sign-in sheets through dynamic cryptographic QR codes, automated policy validation, and role-based governance.

### Core Applications & Components:
1. **Admin + HR Website (Screens 1 to 10):** A single web application with role-aware access controls for Super Admin and HR Managers, covering live analytics, employee directories, attendance regularizations, hierarchical WFH approvals, policy configurations, multi-display QR management, reports, and audit trails.
2. **Employee Mobile App (Screens 11 to 17):** Mobile-first application for employee ID login/registration, simulated OTP verification, home dashboard with attendance shortcuts, camera-based QR scanning, WFH requests, attendance history logs, and profile management.
3. **Office QR Display (Screen 18):** Supporting full-screen kiosk interface deployed on office screens, displaying dynamic rotating QR codes (45-second validity), real-time countdown progress, and live attendance feeds.

---

## 2. Catalog of All 18 UI Screens Implemented

### A. Admin / HR Website (Screens 1 – 10)
1. **Screen 1 — Admin Login:** Secure role-aware authentication for Admin (`admin@vorldx.com`) and HR Manager (`sneha.verma@vorldx.com`) with credential verification and 1-click demo switcher.
2. **Screen 2 — Admin Dashboard:** Month picker (October 2026), 4 core KPI cards (Total Employees: 50, Present Today: 32, WFH Today: 8, Late Today: 5), daily attendance bar chart (Days 1–30), and recent activity feed.
3. **Screen 3 — Employee Management:** Search/filter by department and status, `+ Add Employee` modal, staff table with pagination (`Showing 1-6 of 50`), and profile navigation.
4. **Screen 4 — Employee Profile (Admin View):** Breadcrumb navigation (`Employees > Rohit Sharma`), avatar, ID `VX001`, status badge, and tabbed inspection (`Overview`, `Attendance`, `WFH Requests`, `Details`).
5. **Screen 5 — Attendance Management:** Date range filter (`01 Oct 2026 - 31 Oct 2026`), department and status filters, CSV export, and manual regularization / correction modal with audit notes.
6. **Screen 6 — WFH Requests Management:** Status tabs (`All [12]`, `Pending [4]`, `Approved [6]`, `Rejected [2]`), approver queue routing, and 1-click Approve / Reject actions.
7. **Screen 7 — Attendance Policy & Shift Settings:** Work schedule configuration (Start: `09:00 AM`, End: `06:00 PM`, Grace: `15 mins`), late rules threshold, and applicable workdays checkboxes.
8. **Screen 8 — Office QR Display Management:** Multi-display registry:
   - `QR001`: Office Reception Display (Main Office - Lucknow) — *Online*
   - `QR002`: Floor 2 Display (2nd Floor) — *Online*
   - `QR003`: Floor 3 Display (3rd Floor) — *Offline*
   - `QR004`: Meeting Room Display (Meeting Room A) — *Online*
9. **Screen 9 — Reports & Analytics:** Attendance rate metric (`85%`), Present (`32`), WFH (`8`), Late (`5`), interactive daily attendance bar chart, and department distribution donut chart (Development 40%, HR 20%, Design 15%, Testing 15%, Operations 10%).
10. **Screen 10 — Audit Logs:** System activity logs tracking actions, timestamps, and actors (e.g. Approved WFH, Marked Attendance, Policy Updates).

### B. Employee Mobile App (Screens 11 – 17)
11. **Screen 11 — Mobile App - Login / Register:** Brand header, tabs (`Login` & `Register`), employee ID input (`VX001`), and Continue action.
12. **Screen 12 — Mobile App - OTP Verification:** 6-digit OTP verification inputs with demo code hint (`123456`) and resend countdown timer.
13. **Screen 13 — Mobile App - Home Dashboard:** Greeting ("Good Morning, Rohit Sharma"), Today's Status card (Check-in: `09:05 AM`, Check-out: `06:02 PM`), big "Scan QR" button, quick shortcuts (WFH Request, My Attendance, Statistics), and 4-tab bottom navigation.
14. **Screen 14 — Mobile App - QR Scan:** Viewfinder camera frame with green target markers, torch toggle, and 1-click scan simulator.
15. **Screen 15 — Mobile App - WFH Request:** Date picker, reason textarea, submission button, and previous requests history list (`Approved`, `Rejected`).
16. **Screen 16 — Mobile App - Attendance History:** Month navigator (`< October 2026 >`), date-by-date list rows with status badges (`Present`, `Late`, `Absent`, `WFH`).
17. **Screen 17 — Mobile App - Profile:** User avatar, personal information, attendance details, change password, and Logout button.

### C. Office QR Display (Screen 18)
18. **Screen 18 — Office QR Display (Full Screen):** High-contrast display with VorldX logo, live timestamp (`15 Oct 2026 10:24:30 AM`), dynamic rotating QR code, `Valid for: 45 seconds` countdown, and company footer.

---

## 3. Role-Based Access Control (RBAC) Specifications

| Feature | Super Admin | HR Manager | Employee |
|---|---|---|---|
| **Dashboard** | Full system overview & KPIs | HR-related overview & metrics | Personal attendance overview |
| **Employee Records** | Full access (CRUD) | Manage staff records | Own profile only |
| **Attendance Records** | All records & permitted regularizations | Employee records & regularizations | Own attendance logs |
| **Employee WFH Approval** | Global override if needed | Primary Approver (Approve/Reject) | Submits requests & views status |
| **HR WFH Approval** | Primary Approver (Approve/Reject) | Submits own WFH to Admin | No access |
| **Policies & Shifts** | Full management & configuration | View / limited management | No access |
| **Displays Management** | Full management (Add/Pair/Toggle) | View status | Scans displays |
| **Reports & Audit Logs** | Full export & compliance access | Department reports access | Own attendance history |

---

## 4. Hierarchical WFH Approval Workflow

```
[Employee Submits WFH Request]
         │
         ▼
[HR Manager Dashboard Queue] ──(Approves/Rejects)──► [Result: Employee sees Approved/Rejected]
                                                      └──► (Auto-syncs Attendance Table to 'WFH')

[HR Manager Submits WFH Request]
         │
         ▼
[Super Admin Dashboard Queue] ──(Approves/Rejects)──► [Result: HR sees Approved/Rejected]
                                                      └──► (Auto-syncs Attendance Table to 'WFH')
```

---

## 5. Technical Architecture & Data Schema

### 5.1 Tech Stack
- **Frontend:** React 19, Vite, Vanilla CSS Design System with Glassmorphism and CSS Custom Properties, Lucide React Icons, Canvas Confetti, and QRCode library.
- **Backend:** Node.js, Express.js REST API server with modular routing (`/api/auth`, `/api/attendance`, `/api/kiosk`, `/api/wfh`, `/api/admin`).
- **Database:** SQLite (`vorldx_attendance.sqlite`) managed with `better-sqlite3`, WAL mode, and relational foreign keys.

### 5.2 Core Entities
- `employees`: `id (PK)`, `name`, `email`, `phone`, `department`, `designation`, `shift`, `work_type`, `status`, `role`, `avatar`, `verified`.
- `attendance`: `id (PK)`, `employee_id (FK)`, `date`, `check_in`, `check_out`, `duration_minutes`, `status`, `mode`, `kiosk_id`, `late_by_minutes`, `remarks`.
- `wfh_requests`: `id (PK)`, `employee_id (FK)`, `request_date`, `reason`, `status`, `requester_role`, `approver_role`, `reviewed_by`, `admin_comment`.
- `verification_tokens`: `employee_id (PK, FK)`, `otp`, `expires_at`.
- `policies`: `work_start_time`, `work_end_time`, `grace_period_minutes`, `applicable_days`, `max_wfh_days_per_month`, `qr_rotation_seconds`.
- `kiosk_displays`: `id (PK)`, `name`, `location`, `status`, `current_token`, `token_expires_at`.
- `audit_logs`: `id (PK)`, `actor`, `action`, `details`, `timestamp`.

---

## 6. Verification & Test Matrix

| ID | Test Scenario | Verified Screen | Status |
|---|---|---|---|
| TC-01 | Admin & HR Role Login | Screen 1 | ✅ PASSED |
| TC-02 | Dashboard Metrics & Bar Chart | Screen 2 | ✅ PASSED |
| TC-03 | Employee Directory & Pagination | Screen 3 | ✅ PASSED |
| TC-04 | Employee Detailed Profile Tabs | Screen 4 | ✅ PASSED |
| TC-05 | Attendance Log & Regularization | Screen 5 | ✅ PASSED |
| TC-06 | Hierarchical WFH Approval Workflow | Screen 6 | ✅ PASSED |
| TC-07 | Attendance Policy & Shift Config | Screen 7 | ✅ PASSED |
| TC-08 | Multi-Kiosk Displays (4 displays) | Screen 8 | ✅ PASSED |
| TC-09 | Reports, Rate & Donut Chart | Screen 9 | ✅ PASSED |
| TC-10 | Compliance Audit Logs | Screen 10 | ✅ PASSED |
| TC-11 | Mobile App Login & Registration | Screen 11 | ✅ PASSED |
| TC-12 | 6-Box OTP Verification Flow | Screen 12 | ✅ PASSED |
| TC-13 | Mobile Dashboard & Status Card | Screen 13 | ✅ PASSED |
| TC-14 | Mobile Camera QR Scanner & Chime | Screen 14 | ✅ PASSED |
| TC-15 | WFH Application & Quota Check | Screen 15 | ✅ PASSED |
| TC-16 | Attendance Month History | Screen 16 | ✅ PASSED |
| TC-17 | Mobile Profile & Logout | Screen 17 | ✅ PASSED |
| TC-18 | Fullscreen Office QR Display | Screen 18 | ✅ PASSED |

---

## 7. Enterprise Database Architecture (Microsoft SQL Server)

To support enterprise-grade high availability, concurrency, and corporate compliance, the entire database schema has been designed and implemented in **Microsoft SQL Server (T-SQL)** with complete parity across all 7 Admin Portal screens and 6 Employee Portal screens:

- **Master Database Name:** `WorldX_Attendance360`
- **One-Click Master Setup Script:** [`WorldX_Complete_Master_Setup.sql`](file:///c:/Users/shrey/OneDrive/Desktop/vorldx/database/WorldX_Complete_Master_Setup.sql)
- **Modular Schema Script:** [`WorldX_SQLServer_Schema.sql`](file:///c:/Users/shrey/OneDrive/Desktop/vorldx/database/WorldX_SQLServer_Schema.sql)
- **Production Seed Data Script:** [`WorldX_SQLServer_SeedData.sql`](file:///c:/Users/shrey/OneDrive/Desktop/vorldx/database/WorldX_SQLServer_SeedData.sql)
- **Node.js Connection Adapter:** [`mssql_adapter.js`](file:///c:/Users/shrey/OneDrive/Desktop/vorldx/database/mssql_adapter.js)
- **Comprehensive Setup Guide:** [`SQL_SERVER_SETUP_GUIDE.md`](file:///c:/Users/shrey/OneDrive/Desktop/vorldx/database/SQL_SERVER_SETUP_GUIDE.md)

### Key SQL Server Database Objects:
1. **12 Enterprise Tables:** `Departments`, `Designations`, `Employees` (50 master roster), `Company_Policies`, `Kiosk_Displays`, `HR_Members`, `Attendance`, `WFH_Requests`, `Leave_Requests`, `Verification_Tokens`, `Announcements`, `Audit_Logs`.
2. **4 Reporting Views:** `vw_AdminDashboardKPIs`, `vw_DepartmentWiseAttendance`, `vw_RecentActivities`, `vw_EmployeeMonthlyAttendanceSummary`.
3. **3 Atomic Stored Procedures:** `sp_MarkAttendance` (late mark calculation & audit log), `sp_ApproveWFHRequest` (automatic attendance sync), `sp_ApproveLeaveRequest` (date-range multi-day attendance sync).

---

## 8. Conclusion

The **VorldX Employee Attendance System** fully implements the 18 user interface screens, role-based access control matrix, hierarchical WFH workflow, Microsoft SQL Server enterprise database, and full-stack integration required by VorldX Industries Private Limited.

**VORLDX INDUSTRIES PRIVATE LIMITED**  
*Building Virtual World with Simplicity*  
Lucknow, U.P., India • CIN: U62099UP2026PTC245598 • `hello@vorldx.com`
