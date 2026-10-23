# VorldX Enterprise Attendance 360 System
**Corporate Solution for VORLDX INDUSTRIES PRIVATE LIMITED**  
*CIN: U62099UP2026PTC245598 | Lucknow HQ, U.P., India*

---

## 🌐 Live Cloud Deployment & Resource Links

* 🚀 **Live HR & Admin Web Portal (Vercel):**  
  [https://client-mauve-eight-72.vercel.app](https://client-mauve-eight-72.vercel.app)

* 📦 **GitHub Repository:**  
  [https://github.com/shreyay1310-svg/vorldx](https://github.com/shreyay1310-svg/vorldx)

* 🗄️ **Complete Database Setup & Dumps:**  
  [`/database`](./database) — Master SQL Server Setup, SQLite 3 Master Dump, Schema & Seed data.  
  See [`database/README.md`](./database/README.md) for 1-click execution.

* 🎨 **Figma Design System & Tokens:**  
  [`/design`](./design) — Design Tokens (`vorldx_tokens.json`), Design System specs, and Community Figma File.  
  See [`design/FIGMA_FILE_GUIDE.md`](./design/FIGMA_FILE_GUIDE.md) and [`design/FIGMA_DESIGN_SYSTEM.md`](./design/FIGMA_DESIGN_SYSTEM.md).

* ⚡ **1-Click Render Backend Blueprint:**  
  [Deploy to Render Blueprint](https://dashboard.render.com/blueprint/new?repo=https%3A%2F%2Fgithub.com%2Fshreyay1310-svg%2Fvorldx)

* 📱 **Employee Android APK:**  
  Direct APK build: [`VorldX-Attendance.apk`](./VorldX-Attendance.apk) (Ready to install on Android devices)

---

## 🌟 Key Architecture & Scope

1. **HR & Admin Management Website (`client/`):**
   - Clean, dedicated enterprise dashboard without employee app or demo tabs.
   - Comprehensive employee management (add new employees, assign departments, shifts, and credentials).
   - Real-time attendance monitoring, regularization approval, WFH requests manager, policies configuration, payroll management, and reports analytics.
   - 16 fully functional enterprise modules: Dashboard, Employees, Attendance, Leaves, WFH, HR Management, Recruitment, Performance, Training, Payroll, Policies, Notices, Reports, Calendar, Settings, and Help.

2. **Employee Mobile App (Native Android APK):**
   - **No account creation on mobile:** Accounts are provisioned and managed securely by HR administrators.
   - **Direct Employee ID Login:** Fast login using HR-assigned ID (`VX001` - `VX006` or `EMP001` - `EMP020`).
   - **Self-Account Editing (Screen 17 Profile):**
     - Full Name, Email, Phone number editing.
     - 6 stylish preset avatar pickers or custom photo URL.
     - Login password change.
     - Locked organizational badges (Employee ID, Department, Designation, Shift).
   - Real-time QR scanner for office attendance, WFH applications, and attendance calendar logs.

---

## 🛠️ Local Development

### Start Both Backend & Frontend
```bash
npm run dev
```
* **Express Backend:** `http://localhost:5000`
* **Vite React Frontend:** `http://localhost:5173`

### Build Android APK
```bash
npm --prefix client run build
cd client
npx cap sync android
cd android
./gradlew.bat assembleDebug
```

---

*VORLDX INDUSTRIES PRIVATE LIMITED — Lucknow HQ, Uttar Pradesh, India*
