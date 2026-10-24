-- ============================================================================
-- VorldX Attendance 360 - COMPLETE ADMIN PORTAL ALL-MODULES DATABASE SCRIPT
-- Target: Microsoft SQL Server (SSMS) 2016, 2019, 2022 & Azure SQL
-- Admin Modules Covered:
--   1. Executive KPI Summary & Live Attendance Aggregates
--   2. Employee Lifecycle & Directory Control (Active, Inactive, Terminated)
--   3. WFH Approvals & Monthly Remote Work Quota Governance
--   4. Leave Requests Escalation & Admin Override Engine
--   5. HR Management & Delegation (HR Lead, Executives & Recruiter Teams)
--   6. Company Policies Engine (Work Hours, Grace Period, Biometrics & CIN)
--   7. Full Attendance Register & Manual Punch Corrections
--   8. Role-Based Access Control (RBAC) & System Permissions Matrix
--   9. Hardware Kiosk Displays & QR Terminal Pairing
--  10. Client Projects & Enterprise Deliverables Assignment
--  11. Forensic Audit Logs & Security Breach Trail
--  12. System Settings & Geofence Network Parameters
-- ============================================================================

USE [master];
GO

-- 1. Ensure Database Exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'WorldX_Attendance360')
BEGIN
    CREATE DATABASE [WorldX_Attendance360];
END
GO

USE [WorldX_Attendance360];
GO

-- 2. Drop existing Admin objects if re-running (Clean Slate)
IF OBJECT_ID(N'dbo.vw_AdminExecutiveKPIs', N'V') IS NOT NULL DROP VIEW dbo.vw_AdminExecutiveKPIs;
IF OBJECT_ID(N'dbo.vw_AdminPresentRegister', N'V') IS NOT NULL DROP VIEW dbo.vw_AdminPresentRegister;

IF OBJECT_ID(N'dbo.Admin_Audit_Logs', N'U') IS NOT NULL DROP TABLE dbo.Admin_Audit_Logs;
IF OBJECT_ID(N'dbo.Admin_Client_Projects', N'U') IS NOT NULL DROP TABLE dbo.Admin_Client_Projects;
IF OBJECT_ID(N'dbo.Admin_Kiosk_Hardware', N'U') IS NOT NULL DROP TABLE dbo.Admin_Kiosk_Hardware;
IF OBJECT_ID(N'dbo.Admin_Role_Permissions', N'U') IS NOT NULL DROP TABLE dbo.Admin_Role_Permissions;
IF OBJECT_ID(N'dbo.Admin_System_Settings', N'U') IS NOT NULL DROP TABLE dbo.Admin_System_Settings;
IF OBJECT_ID(N'dbo.Admin_Company_Policies', N'U') IS NOT NULL DROP TABLE dbo.Admin_Company_Policies;
IF OBJECT_ID(N'dbo.Admin_HR_Members', N'U') IS NOT NULL DROP TABLE dbo.Admin_HR_Members;
IF OBJECT_ID(N'dbo.Admin_Leave_Approvals', N'U') IS NOT NULL DROP TABLE dbo.Admin_Leave_Approvals;
IF OBJECT_ID(N'dbo.Admin_WFH_Approvals', N'U') IS NOT NULL DROP TABLE dbo.Admin_WFH_Approvals;
IF OBJECT_ID(N'dbo.Admin_Attendance_Register', N'U') IS NOT NULL DROP TABLE dbo.Admin_Attendance_Register;
IF OBJECT_ID(N'dbo.Admin_Employees', N'U') IS NOT NULL DROP TABLE dbo.Admin_Employees;
GO

PRINT '============================================================================';
PRINT 'STEP 1: CREATING ALL ADMIN PORTAL MODULE TABLES';
PRINT '============================================================================';

-- ----------------------------------------------------------------------------
-- MODULE 1: Admin Employee Master & Status Lifecycle
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Employees (
    EmployeeID NVARCHAR(50) PRIMARY KEY,                    -- EMP001, EMP005, etc.
    FullName NVARCHAR(150) NOT NULL,
    Department NVARCHAR(100) NOT NULL,                      -- Software Development, Product Design, Operations, etc.
    Designation NVARCHAR(100) NOT NULL,                     -- Developer, Designer, Manager, etc.
    JoiningDate DATE NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,          -- 'Active', 'Inactive', 'On Notice', 'Terminated'
    Role NVARCHAR(50) DEFAULT N'Employee' NOT NULL,         -- 'Admin', 'HR', 'Employee', 'Manager'
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NULL,
    AvatarUrl NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 2: Full Attendance Register & Arrival Status Analytics
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Attendance_Register (
    RecordID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    AttendanceDate DATE DEFAULT CAST(GETDATE() AS DATE) NOT NULL,
    ArrivalTime NVARCHAR(20) NOT NULL,                      -- '08:52 AM'
    DepartureTime NVARCHAR(20) NULL,                        -- '06:02 PM'
    TotalHours NVARCHAR(20) DEFAULT N'9h 00m' NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Present' NOT NULL,       -- 'Present', 'WFH', 'Absent', 'Half Day'
    ArrivalStatus NVARCHAR(50) DEFAULT N'On Time' NOT NULL, -- 'On Time', 'Late by 7m', etc.
    PunchMode NVARCHAR(50) DEFAULT N'Biometric Face ID' NOT NULL,
    Location NVARCHAR(100) DEFAULT N'HQ - Lucknow' NOT NULL,
    IPAddress NVARCHAR(50) DEFAULT N'192.168.1.45' NULL,
    AdminModified BIT DEFAULT 0 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AdminAtt_Emp FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Admin_Employees (EmployeeID) ON DELETE CASCADE
);
CREATE NONCLUSTERED INDEX IX_AdminAtt_Date ON dbo.Admin_Attendance_Register (AttendanceDate, Status);
GO

-- ----------------------------------------------------------------------------
-- MODULE 3: WFH Approval Governance & Quota Control
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_WFH_Approvals (
    WFHRequestID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    TotalDays INT DEFAULT 1 NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Pending' NOT NULL,         -- 'Pending', 'Approved', 'Rejected'
    AdminReviewer NVARCHAR(100) DEFAULT N'Vikram Singhania' NULL,
    AdminRemarks NVARCHAR(500) NULL,
    ReviewedAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AdminWFH_Emp FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Admin_Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 4: Leave Approvals & Admin Escalation Engine
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Leave_Approvals (
    LeaveRequestID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    LeaveType NVARCHAR(50) NOT NULL,                        -- 'Casual Leave', 'Sick Leave', 'Earned Leave'
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    TotalDays DECIMAL(4,1) DEFAULT 1.0 NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Pending' NOT NULL,         -- 'Pending', 'Approved', 'Rejected'
    ReviewedBy NVARCHAR(100) DEFAULT N'Priya Sharma (HR)' NULL,
    HRComments NVARCHAR(500) NULL,
    ReviewedAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AdminLeave_Emp FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Admin_Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 5: HR Team Delegation & Department Ownership
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_HR_Members (
    HRMemberID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    HRRole NVARCHAR(100) NOT NULL,                          -- 'HR Lead', 'HR Executive', 'Recruiter'
    AssignedDepartment NVARCHAR(100) DEFAULT N'Human Resources' NOT NULL,
    ActivePermissionsCount INT DEFAULT 8 NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AdminHR_Emp FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Admin_Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 6: Company-Wide Policies & Operational Constraints
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Company_Policies (
    PolicyID INT PRIMARY KEY CHECK (PolicyID = 1),          -- Singleton master policy record
    CompanyName NVARCHAR(200) DEFAULT N'VORLDX INDUSTRIES PRIVATE LIMITED' NOT NULL,
    CIN NVARCHAR(50) DEFAULT N'U62099UP2026PTC245598' NOT NULL,
    Headquarters NVARCHAR(200) DEFAULT N'Lucknow, Uttar Pradesh, India' NOT NULL,
    WorkStartTime NVARCHAR(20) DEFAULT N'09:00 AM' NOT NULL,
    WorkEndTime NVARCHAR(20) DEFAULT N'06:00 PM' NOT NULL,
    GracePeriodMinutes INT DEFAULT 15 NOT NULL,
    HalfDayThresholdHours REAL DEFAULT 4.0 NOT NULL,
    FullDayThresholdHours REAL DEFAULT 8.0 NOT NULL,
    MaxWFHDaysPerMonth INT DEFAULT 4 NOT NULL,
    QRRotationSeconds INT DEFAULT 45 NOT NULL,
    BiometricEnforcement BIT DEFAULT 1 NOT NULL,
    ApplicableWorkDays NVARCHAR(100) DEFAULT N'Monday,Tuesday,Wednesday,Thursday,Friday' NOT NULL,
    LastUpdatedBy NVARCHAR(100) DEFAULT N'Vikram Singhania (Admin)' NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 7: Hardware Kiosks & Dynamic QR Terminal Registration
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Kiosk_Hardware (
    KioskID NVARCHAR(50) PRIMARY KEY,                       -- QR001, QR002, etc.
    KioskName NVARCHAR(150) NOT NULL,
    PhysicalLocation NVARCHAR(200) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Online' NOT NULL,         -- 'Online', 'Offline', 'Maintenance'
    CurrentDynamicToken NVARCHAR(100) NOT NULL,
    TokenGeneratedAt DATETIME2 DEFAULT SYSDATETIME(),
    TokenExpiresAt DATETIME2 NOT NULL,
    IPAddress NVARCHAR(50) DEFAULT N'192.168.1.100' NULL,
    PairedDate DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 8: Role-Based Access Control (RBAC) Permissions Matrix
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Role_Permissions (
    PermissionID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL,                         -- 'Admin', 'HR', 'Employee', 'Manager'
    ModuleName NVARCHAR(50) NOT NULL,                       -- 'Employees', 'Attendance', 'Leaves', 'WFH', 'Policies', 'Audit'
    CanView BIT DEFAULT 1 NOT NULL,
    CanCreate BIT DEFAULT 0 NOT NULL,
    CanEdit BIT DEFAULT 0 NOT NULL,
    CanDelete BIT DEFAULT 0 NOT NULL,
    CanApprove BIT DEFAULT 0 NOT NULL,
    CanExport BIT DEFAULT 1 NOT NULL,
    CONSTRAINT UQ_Role_Module UNIQUE (RoleName, ModuleName)
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 9: Client Projects & Enterprise Deliverable Contracts
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Client_Projects (
    ProjectID INT IDENTITY(1,1) PRIMARY KEY,
    ProjectName NVARCHAR(150) NOT NULL,
    ClientName NVARCHAR(150) NOT NULL,
    AssignedLead NVARCHAR(100) NOT NULL,
    Priority NVARCHAR(50) DEFAULT N'High Priority' NOT NULL, -- 'Critical', 'High Priority', 'Medium'
    Deadline DATE NOT NULL,
    Status NVARCHAR(50) DEFAULT N'In Progress' NOT NULL,
    ProgressPercent INT DEFAULT 85 NOT NULL,
    ContractValueINR DECIMAL(14,2) DEFAULT 2500000.00 NOT NULL,
    Description NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 10: Security Audit Trail & Forensics
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_Audit_Logs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    Actor NVARCHAR(100) NOT NULL,                          -- 'Admin', 'HR', 'System'
    Action NVARCHAR(100) NOT NULL,                         -- 'POLICY_UPDATE', 'PUNCH_OVERRIDE', 'WFH_APPROVE', 'LOGIN'
    TargetEntity NVARCHAR(100) NOT NULL,
    Details NVARCHAR(MAX) NOT NULL,
    IPAddress NVARCHAR(50) DEFAULT N'192.168.1.77' NOT NULL,
    Timestamp DATETIME2 DEFAULT SYSDATETIME() NOT NULL
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 11: General System Settings
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Admin_System_Settings (
    SettingKey NVARCHAR(100) PRIMARY KEY,
    SettingValue NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(50) DEFAULT N'General' NOT NULL,
    Description NVARCHAR(255) NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

PRINT '============================================================================';
PRINT 'STEP 2: CREATING LIVE REPORTING VIEWS FOR ADMIN DASHBOARD';
PRINT '============================================================================';

-- View 1: Real-time Admin Dashboard KPIs
CREATE VIEW dbo.vw_AdminExecutiveKPIs AS
SELECT 
    (SELECT COUNT(*) FROM dbo.Admin_Employees WHERE Status = 'Active') AS TotalActiveEmployees,
    (SELECT COUNT(*) FROM dbo.Admin_Attendance_Register WHERE AttendanceDate = CAST(GETDATE() AS DATE) AND Status = 'Present') AS PresentToday,
    (SELECT COUNT(*) FROM dbo.Admin_Attendance_Register WHERE AttendanceDate = CAST(GETDATE() AS DATE) AND Status = 'WFH') AS WFHToday,
    (SELECT COUNT(*) FROM dbo.Admin_Leave_Approvals WHERE Status = 'Approved' AND CAST(GETDATE() AS DATE) BETWEEN FromDate AND ToDate) AS OnLeaveToday,
    (SELECT COUNT(*) FROM dbo.Admin_WFH_Approvals WHERE Status = 'Pending') AS PendingWFHApprovals,
    (SELECT COUNT(*) FROM dbo.Admin_Leave_Approvals WHERE Status = 'Pending') AS PendingLeaveApprovals,
    (SELECT COUNT(*) FROM dbo.Admin_Kiosk_Hardware WHERE Status = 'Online') AS ActiveKiosksCount,
    (SELECT CIN FROM dbo.Admin_Company_Policies WHERE PolicyID = 1) AS CorporateCIN;
GO

-- View 2: Live Present Employees Register (Exact Grid View)
CREATE VIEW dbo.vw_AdminPresentRegister AS
SELECT 
    e.EmployeeID,
    e.FullName,
    e.Department,
    a.AttendanceDate,
    a.ArrivalTime,
    a.DepartureTime,
    a.TotalHours,
    a.Status,
    a.ArrivalStatus,
    a.PunchMode,
    a.Location
FROM dbo.Admin_Attendance_Register a
JOIN dbo.Admin_Employees e ON a.EmployeeID = e.EmployeeID;
GO

PRINT '============================================================================';
PRINT 'STEP 3: SEEDING REAL VERIFIED DATA ACROSS ALL ADMIN MODULES';
PRINT '============================================================================';

-- 1. Seed Core Employees (Full 8 Roster from Screen 2 + Admin)
INSERT INTO dbo.Admin_Employees (EmployeeID, FullName, Department, Designation, JoiningDate, Status, Role, Email, PhoneNumber) VALUES
(N'ADM001', N'Vikram Singhania', N'Management', N'Managing Director', '2022-01-01', N'Active', N'Admin', N'admin@vorldx.com', N'+91 99999 00001'),
(N'EMP000', N'Rahul Verma', N'Software Development', N'Admin • Lead Architect', '2023-01-15', N'Active', N'Admin', N'rahul.verma@worldx.com', N'+91 98765 43210'),
(N'EMP001', N'Neha Singh', N'Software Development', N'Developer', '2024-01-10', N'Active', N'Employee', N'neha.s@worldx.com', N'+91 98765 00001'),
(N'EMP005', N'Rohit Sharma', N'Product Design', N'Designer', '2024-02-12', N'Active', N'Employee', N'rohit.sharma@worldx.com', N'+91 98765 00005'),
(N'EMP012', N'Pooja Yadav', N'Human Resources', N'Executive', '2024-03-01', N'Active', N'HR', N'pooja.y@worldx.com', N'+91 98765 00012'),
(N'EMP018', N'Amit Kumar', N'Operations', N'Manager', '2024-04-15', N'Active', N'Employee', N'amit.k@worldx.com', N'+91 98765 00018'),
(N'EMP020', N'Karan Mehta', N'Marketing', N'Associate', '2024-05-01', N'Active', N'Employee', N'karan.m@worldx.com', N'+91 98765 00020'),
(N'EMP022', N'Sneha Verma', N'Quality Assurance', N'QA Engineer', '2024-05-20', N'Active', N'Employee', N'sneha.v@worldx.com', N'+91 98765 00022'),
(N'EMP028', N'Vikram Singh', N'Finance', N'Analyst', '2024-06-11', N'Inactive', N'Employee', N'vikram.s@worldx.com', N'+91 98765 00028'),
(N'EMP030', N'Anjali Gupta', N'IT Support', N'Support Engineer', '2024-07-25', N'Active', N'Employee', N'anjali.g@worldx.com', N'+91 98765 00030'),
(N'EMP042', N'SHREYA YADAV', N'Software Development', N'Software Developer', '2026-10-24', N'Active', N'Employee', N'shreyay1310@gmail.com', N'+91 85289 10171');
GO

-- 2. Seed Present Employees Register (Real Times & On-Time Status)
INSERT INTO dbo.Admin_Attendance_Register (EmployeeID, AttendanceDate, ArrivalTime, DepartureTime, TotalHours, Status, ArrivalStatus, PunchMode, Location) VALUES
(N'EMP000', CAST(GETDATE() AS DATE), N'08:52 AM', N'06:02 PM', N'9h 10m', N'Present', N'On Time', N'Biometric Face ID', N'HQ - Floor 3'),
(N'EMP001', CAST(GETDATE() AS DATE), N'09:02 AM', N'06:05 PM', N'9h 03m', N'Present', N'On Time', N'QR Code Kiosk', N'HQ - Floor 2'),
(N'EMP005', CAST(GETDATE() AS DATE), N'09:22 AM', N'06:25 PM', N'9h 03m', N'Present', N'Late by 7m', N'Biometric Face ID', N'HQ - Floor 1'),
(N'EMP012', CAST(GETDATE() AS DATE), N'08:45 AM', N'05:55 PM', N'9h 10m', N'Present', N'On Time', N'QR Code Kiosk', N'HQ - Reception'),
(N'EMP018', CAST(GETDATE() AS DATE), N'09:00 AM', N'06:10 PM', N'9h 10m', N'Present', N'On Time', N'Mobile Geo-Punch', N'HQ - Floor 4'),
(N'EMP020', CAST(GETDATE() AS DATE), N'09:14 AM', N'06:20 PM', N'9h 06m', N'Present', N'On Time', N'Web Portal', N'HQ - Floor 2'),
(N'EMP022', CAST(GETDATE() AS DATE), N'08:57 AM', N'06:02 PM', N'9h 05m', N'Present', N'On Time', N'Biometric Face ID', N'HQ - Floor 3'),
(N'EMP030', CAST(GETDATE() AS DATE), N'08:49 AM', N'05:59 PM', N'9h 10m', N'Present', N'On Time', N'Biometric Face ID', N'HQ - Ground Floor'),
(N'EMP042', CAST(GETDATE() AS DATE), N'09:00 AM', N'06:00 PM', N'9h 00m', N'Present', N'On Time', N'Web Portal', N'HQ - Tech Hub');
GO

-- 3. Seed Company Policies Engine
INSERT INTO dbo.Admin_Company_Policies (PolicyID, CompanyName, CIN, Headquarters, WorkStartTime, WorkEndTime, GracePeriodMinutes, HalfDayThresholdHours, FullDayThresholdHours, MaxWFHDaysPerMonth, QRRotationSeconds, BiometricEnforcement, ApplicableWorkDays, LastUpdatedBy)
VALUES (1, N'VORLDX INDUSTRIES PRIVATE LIMITED', N'U62099UP2026PTC245598', N'Lucknow, Uttar Pradesh, India', N'09:00 AM', N'06:00 PM', 15, 4.0, 8.0, 4, 45, 1, N'Monday,Tuesday,Wednesday,Thursday,Friday', N'Vikram Singhania (Admin)');
GO

-- 4. Seed HR Members Management
INSERT INTO dbo.Admin_HR_Members (EmployeeID, FullName, Email, HRRole, AssignedDepartment, ActivePermissionsCount, Status) VALUES
(N'EMP012', N'Pooja Yadav', N'pooja.y@worldx.com', N'HR Lead', N'Human Resources', 12, N'Active'),
(N'EMP000', N'Arun Mishra', N'arun.m@worldx.com', N'HR Executive', N'Human Resources', 8, N'Active'),
(N'EMP018', N'Ritika Sharma', N'ritika.s@worldx.com', N'Technical Recruiter', N'Human Resources', 6, N'Active');
GO

-- 5. Seed Hardware Kiosks
INSERT INTO dbo.Admin_Kiosk_Hardware (KioskID, KioskName, PhysicalLocation, Status, CurrentDynamicToken, TokenExpiresAt) VALUES
(N'QR001', N'HQ Main Entrance Kiosk', N'Ground Floor Reception - Lucknow HQ', N'Online', N'WORLDXZ026', DATEADD(MINUTE, 45, SYSDATETIME())),
(N'QR002', N'Engineering Wing Kiosk', N'2nd Floor North Wing - Lucknow HQ', N'Online', N'WORLDXZ027', DATEADD(MINUTE, 45, SYSDATETIME()));
GO

-- 6. Seed WFH & Leave Approvals
INSERT INTO dbo.Admin_WFH_Approvals (EmployeeID, FromDate, ToDate, TotalDays, Reason, Status, AdminReviewer, AdminRemarks) VALUES
(N'EMP005', CAST(DATEADD(DAY, 1, GETDATE()) AS DATE), CAST(DATEADD(DAY, 1, GETDATE()) AS DATE), 1, N'Home broadband line replacement', N'Approved', N'Vikram Singhania', N'Approved for 1 day.'),
(N'EMP020', CAST(DATEADD(DAY, 3, GETDATE()) AS DATE), CAST(DATEADD(DAY, 4, GETDATE()) AS DATE), 2, N'Attending family function outstation', N'Pending', NULL, NULL);
GO

INSERT INTO dbo.Admin_Leave_Approvals (EmployeeID, LeaveType, FromDate, ToDate, TotalDays, Reason, Status, ReviewedBy, HRComments) VALUES
(N'EMP022', N'Casual Leave', CAST(DATEADD(DAY, 5, GETDATE()) AS DATE), CAST(DATEADD(DAY, 6, GETDATE()) AS DATE), 2.0, N'Personal travel', N'Approved', N'Pooja Yadav (HR Lead)', N'Approved with advance notification.'),
(N'EMP042', N'Sick Leave', CAST(DATEADD(DAY, 8, GETDATE()) AS DATE), CAST(DATEADD(DAY, 8, GETDATE()) AS DATE), 1.0, N'Doctor checkup appointment', N'Pending', NULL, NULL);
GO

-- 7. Seed RBAC Permissions Matrix
INSERT INTO dbo.Admin_Role_Permissions (RoleName, ModuleName, CanView, CanCreate, CanEdit, CanDelete, CanApprove, CanExport) VALUES
(N'Admin', N'Employees', 1, 1, 1, 1, 1, 1),
(N'Admin', N'Attendance', 1, 1, 1, 1, 1, 1),
(N'Admin', N'Policies', 1, 1, 1, 1, 1, 1),
(N'Admin', N'Audit_Logs', 1, 0, 0, 0, 0, 1),
(N'HR', N'Employees', 1, 1, 1, 0, 1, 1),
(N'HR', N'Attendance', 1, 0, 1, 0, 1, 1),
(N'HR', N'Leaves', 1, 0, 1, 0, 1, 1),
(N'Employee', N'Attendance', 1, 1, 0, 0, 0, 1),
(N'Employee', N'Leaves', 1, 1, 0, 0, 0, 0);
GO

-- 8. Seed Client Projects
INSERT INTO dbo.Admin_Client_Projects (ProjectName, ClientName, AssignedLead, Priority, Deadline, Status, ProgressPercent, ContractValueINR, Description) VALUES
(N'Enterprise Attendance 360', N'VorldX Industries', N'Rahul Verma (EMP000)', N'Critical', CAST(DATEADD(DAY, 30, GETDATE()) AS DATE), N'In Progress', 90, 4500000.00, N'Central real-time employee attendance tracking with QR, geofencing & biometrics.'),
(N'Cloud Payroll Regularization', N'Tata Capital Partners', N'Amit Kumar (EMP018)', N'High Priority', CAST(DATEADD(DAY, 45, GETDATE()) AS DATE), N'In Progress', 75, 3200000.00, N'Automated PF, TDS and salary disbursement batch engine.');
GO

-- 9. Seed Audit Logs
INSERT INTO dbo.Admin_Audit_Logs (Actor, Action, TargetEntity, Details) VALUES
(N'System', N'SYSTEM_INIT', N'Database', N'WorldX Attendance 360 Admin Schema successfully initialized.'),
(N'Vikram Singhania (Admin)', N'POLICY_UPDATE', N'Admin_Company_Policies', N'Configured 09:00 AM - 06:00 PM shift with 15m grace period and biometrics enforced.'),
(N'Vikram Singhania (Admin)', N'WFH_APPROVE', N'Admin_WFH_Approvals', N'Approved WFH request #1 for Rohit Sharma (EMP005).'),
(N'Pooja Yadav (HR Lead)', N'LEAVE_APPROVE', N'Admin_Leave_Approvals', N'Approved 2 days casual leave for Sneha Verma (EMP022).');
GO

-- 10. Seed System Settings
INSERT INTO dbo.Admin_System_Settings (SettingKey, SettingValue, Category, Description) VALUES
(N'DEFAULT_SMTP_HOST', N'smtp.gmail.com', N'Email', N'Primary outbound Google SMTP relay'),
(N'DEFAULT_SMTP_PORT', N'465', N'Email', N'Secure SSL SMTP port'),
(N'HQ_WIFI_SSID', N'VorldX_HQ_Enterprise_5G', N'Network', N'Authorized corporate Wi-Fi SSID for mobile punch'),
(N'GEOFENCE_RADIUS_METERS', N'150', N'Location', N'Allowed attendance punch radius around Lucknow HQ');
GO

PRINT '============================================================================';
PRINT 'STEP 4: VERIFICATION SUMMARY OF ALL ADMIN MODULES & LIVE VIEW';
PRINT '============================================================================';

-- Summary View Test
SELECT * FROM dbo.vw_AdminExecutiveKPIs;
GO

-- Table Row Counts
SELECT '1. Admin Employees' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Employees
UNION ALL
SELECT '2. Attendance Register' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Attendance_Register
UNION ALL
SELECT '3. WFH Approvals' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_WFH_Approvals
UNION ALL
SELECT '4. Leave Approvals' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Leave_Approvals
UNION ALL
SELECT '5. HR Members' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_HR_Members
UNION ALL
SELECT '6. Company Policies' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Company_Policies
UNION ALL
SELECT '7. Kiosk Hardware' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Kiosk_Hardware
UNION ALL
SELECT '8. RBAC Permissions' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Role_Permissions
UNION ALL
SELECT '9. Client Projects' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Client_Projects
UNION ALL
SELECT '10. Security Audit Logs' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_Audit_Logs
UNION ALL
SELECT '11. System Settings' AS Module, COUNT(*) AS TotalRecords FROM dbo.Admin_System_Settings;
GO