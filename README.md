# VorldX Employee Attendance System
**Full-Stack Solution for VORLDX INDUSTRIES PRIVATE LIMITED**  
*CIN: U62099UP2026PTC245598 | Lucknow, U.P., India*

---

## 🌟 Quick Start Guide

### 1. Start Both Backend & Frontend in One Command
Run the following command in the project root:
```bash
npm run dev
```

This will concurrently launch:
- 🚀 **Express Backend API Server**: `http://localhost:5000`
- 💻 **Vite React Frontend**: `http://localhost:5173`

Open your browser to: **`http://localhost:5173`**

---

## 📱 Features Included

1. **Interactive Demo (Split View)**:
   - Live **Office Dynamic QR Display Kiosk** on the left screen with real-time rotating QR codes and countdown timer.
   - **VorldX Employee Mobile App** on the right screen with instant QR check-in/out, time simulation selector, and audio/confetti celebration!
2. **HR / Admin Website (`/admin`)**:
   - Executive metrics & department attendance breakdown.
   - Attendance records table with search, status filters, and date filters.
   - **Attendance Regularization**: HR can correct times and statuses with auditable reasons.
   - **WFH Approvals**: Review, approve, or reject employee Work From Home requests.
   - **Policy Engine**: Configure work start time (09:30 AM), grace period (15m), WFH monthly quotas, and QR rotation intervals.
   - **Audit Logs**: Immutable system history log.
   - **CSV Export**: One-click download of attendance logs.
3. **VorldX Employee App (`/employee`)**:
   - Employee account switcher (test as Aarav, Priya, Rohan, or unverified Sanya).
   - **Simulated OTP Verification**: Test new employee registration without real SMS/email credentials.
   - Today's attendance status card (Present, Late, WFH, Not Checked In).
   - Dynamic QR scanner (scan camera or 1-click kiosk simulator).
   - WFH requests submission with quota tracking.
   - Personal attendance statistics and history logs.
4. **Office QR Display Kiosk (`/kiosk`)**:
   - Dedicated kiosk screen with live Lucknow HQ clock and rotating cryptographic tokens every 20 seconds.
   - Real-time attendance ticker showing incoming check-ins.
5. **Project Report (`/report` & `PROJECT_REPORT.md`)**:
   - Full documentation adhering to Section 7 of the project brief, with print/PDF support.

---

## 🛠️ Individual Commands

- `npm run server` — Start Express API server only (`http://localhost:5000`)
- `npm run client` — Start Vite React client only (`http://localhost:5173`)
- `npm run seed` — Reset and seed the SQLite database with realistic sample data
- `npm run build` — Build production bundle for the client

---

*VORLDX INDUSTRIES PRIVATE LIMITED*  
*Building Virtual World with Simplicity*
