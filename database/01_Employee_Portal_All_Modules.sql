-- ============================================================================
-- VorldX Attendance 360 - COMPLETE EMPLOYEE PORTAL ALL-MODULES DATABASE
-- Target: Microsoft SQL Server (SSMS) 2016, 2019, 2022 & Azure SQL
-- Modules Covered:
--   1. Employee Profile & Master Data (Personal & Professional)
--   2. Attendance & Daily Punch Logs (QR, Biometric, Geo, Web)
--   3. Leave Applications & Annual Leave Quota Balances
--   4. Work From Home (WFH) Requests & Approvals
--   5. Client Projects & Task Assignments
--   6. Monthly Payroll, Salary Slips & Deductions
--   7. Company Announcements & Notice Board
--   8. QR Attendance Kiosks & Mobile Pairing
--   9. 6-Digit Verification Tokens (Onboarding & Mobile Login)
--  10. System Audit Trail & Activity Logs
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

-- 2. Clean Slate Re-run (Drop Tables in Reverse Dependency Order)
IF OBJECT_ID(N'dbo.Audit_Logs', N'U') IS NOT NULL DROP TABLE dbo.Audit_Logs;
IF OBJECT_ID(N'dbo.Verification_Tokens', N'U') IS NOT NULL DROP TABLE dbo.Verification_Tokens;
IF OBJECT_ID(N'dbo.Employee_Payslips', N'U') IS NOT NULL DROP TABLE dbo.Employee_Payslips;
IF OBJECT_ID(N'dbo.Employee_Project_Tasks', N'U') IS NOT NULL DROP TABLE dbo.Employee_Project_Tasks;
IF OBJECT_ID(N'dbo.Client_Projects', N'U') IS NOT NULL DROP TABLE dbo.Client_Projects;
IF OBJECT_ID(N'dbo.Announcements', N'U') IS NOT NULL DROP TABLE dbo.Announcements;
IF OBJECT_ID(N'dbo.WFH_Requests', N'U') IS NOT NULL DROP TABLE dbo.WFH_Requests;
IF OBJECT_ID(N'dbo.Leave_Requests', N'U') IS NOT NULL DROP TABLE dbo.Leave_Requests;
IF OBJECT_ID(N'dbo.Leave_Balances', N'U') IS NOT NULL DROP TABLE dbo.Leave_Balances;
IF OBJECT_ID(N'dbo.Attendance', N'U') IS NOT NULL DROP TABLE dbo.Attendance;
IF OBJECT_ID(N'dbo.Kiosk_Displays', N'U') IS NOT NULL DROP TABLE dbo.Kiosk_Displays;
IF OBJECT_ID(N'dbo.Company_Policies', N'U') IS NOT NULL DROP TABLE dbo.Company_Policies;
IF OBJECT_ID(N'dbo.Employees', N'U') IS NOT NULL DROP TABLE dbo.Employees;
IF OBJECT_ID(N'dbo.Departments', N'U') IS NOT NULL DROP TABLE dbo.Departments;
GO

PRINT '============================================================================';
PRINT 'STEP 1: CREATING ALL EMPLOYEE MODULE TABLES';
PRINT '============================================================================';

-- ----------------------------------------------------------------------------
-- MODULE 1: Departments
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Departments (
    DepartmentID INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentCode NVARCHAR(20) NOT NULL UNIQUE,
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
    HeadOfDepartment NVARCHAR(100) NULL,
    Location NVARCHAR(100) DEFAULT N'Lucknow HQ',
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 2: Employee Profile & Master Data (Personal, Job & Security)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Employees (
    EmployeeID NVARCHAR(50) PRIMARY KEY,                    -- e.g. EMP005, EMP042
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NULL,
    Department NVARCHAR(100) NOT NULL,
    Designation NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) DEFAULT N'Employee' NOT NULL,         -- 'Admin', 'HR', 'Employee'
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,          -- 'Active', 'Inactive', 'On Leave'
    Shift NVARCHAR(50) DEFAULT N'General (09:00 AM - 06:00 PM)' NOT NULL,
    WorkType NVARCHAR(50) DEFAULT N'On-site' NOT NULL,      -- 'On-site', 'Remote', 'Hybrid'
    JoiningDate DATE NOT NULL,
    ReportingManager NVARCHAR(100) DEFAULT N'Amit Kumar' NULL,
    Location NVARCHAR(100) DEFAULT N'Lucknow HQ, Uttar Pradesh' NULL,
    AvatarUrl NVARCHAR(500) NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(20) NULL,
    BloodGroup NVARCHAR(10) DEFAULT N'O+' NULL,
    AddressLine NVARCHAR(255) DEFAULT N'Lucknow, UP' NULL,
    EmergencyContact NVARCHAR(50) DEFAULT N'+91 98765 00000' NULL,
    PasswordHash NVARCHAR(255) DEFAULT N'Password@123' NOT NULL,
    Verified BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 3: Attendance & Punch Log (Daily In/Out, Biometric, QR & Geofence)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    [Date] DATE DEFAULT CAST(GETDATE() AS DATE) NOT NULL,
    CheckIn NVARCHAR(20) NULL,                             -- e.g. '09:05 AM'
    CheckOut NVARCHAR(20) NULL,                            -- e.g. '06:12 PM'
    DurationMinutes INT DEFAULT 0,
    Status NVARCHAR(30) DEFAULT N'Present' NOT NULL,       -- 'Present', 'WFH', 'Half Day', 'Absent', 'Late'
    Mode NVARCHAR(50) DEFAULT N'QR Code Kiosk' NOT NULL,   -- 'QR Code Kiosk', 'Biometric Face ID', 'Mobile Geo-Punch', 'Web Portal'
    Location NVARCHAR(100) DEFAULT N'HQ - Lucknow' NOT NULL,
    IPAddress NVARCHAR(50) DEFAULT N'192.168.1.77' NULL,
    Latitude DECIMAL(10, 7) NULL,
    Longitude DECIMAL(10, 7) NULL,
    Notes NVARCHAR(255) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Attendance_Employee FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
CREATE NONCLUSTERED INDEX IX_Attendance_EmpDate ON dbo.Attendance (EmployeeID, [Date]);
GO

-- ----------------------------------------------------------------------------
-- MODULE 4: Leave Balances & Annual Quotas
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Leave_Balances (
    BalanceID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    Year INT DEFAULT YEAR(GETDATE()) NOT NULL,
    CasualLeaveTotal DECIMAL(4,1) DEFAULT 12.0 NOT NULL,
    CasualLeaveUsed DECIMAL(4,1) DEFAULT 0.0 NOT NULL,
    SickLeaveTotal DECIMAL(4,1) DEFAULT 10.0 NOT NULL,
    SickLeaveUsed DECIMAL(4,1) DEFAULT 0.0 NOT NULL,
    EarnedLeaveTotal DECIMAL(4,1) DEFAULT 15.0 NOT NULL,
    EarnedLeaveUsed DECIMAL(4,1) DEFAULT 0.0 NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_LeaveBal_Employee FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 5: Leave Applications & Approval Workflow
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Leave_Requests (
    LeaveID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    LeaveType NVARCHAR(50) DEFAULT N'Casual Leave' NOT NULL, -- 'Casual Leave', 'Sick Leave', 'Earned Leave'
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    TotalDays DECIMAL(4,1) DEFAULT 1.0 NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Pending' NOT NULL,          -- 'Pending', 'Approved', 'Rejected'
    RequesterRole NVARCHAR(50) DEFAULT N'Employee' NOT NULL,
    ApproverRole NVARCHAR(50) DEFAULT N'HR' NOT NULL,
    ReviewedBy NVARCHAR(100) NULL,
    ReviewedAt NVARCHAR(50) NULL,
    HRComment NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Leaves_Employee FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 6: Work From Home (WFH) Requests
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.WFH_Requests (
    RequestID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    TotalDays INT DEFAULT 1 NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    PlannedTasks NVARCHAR(MAX) NULL,
    Status NVARCHAR(30) DEFAULT N'Pending' NOT NULL,          -- 'Pending', 'Approved', 'Rejected'
    ReviewedBy NVARCHAR(100) NULL,
    AdminComment NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_WFH_Employee FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 7: Client Projects & Assigned Requirements
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Client_Projects (
    ProjectID INT IDENTITY(1,1) PRIMARY KEY,
    ProjectName NVARCHAR(150) NOT NULL,
    ClientName NVARCHAR(150) NOT NULL,
    AssignedToEmployeeID NVARCHAR(50) DEFAULT N'All' NOT NULL,
    Priority NVARCHAR(50) DEFAULT N'High Priority' NOT NULL, -- 'High Priority', 'Medium', 'Critical'
    Deadline DATE NOT NULL,
    Status NVARCHAR(50) DEFAULT N'In Progress' NOT NULL,     -- 'In Progress', 'Completed', 'Review'
    ProgressPercent INT DEFAULT 0 NOT NULL,
    Description NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.Employee_Project_Tasks (
    TaskID INT IDENTITY(1,1) PRIMARY KEY,
    ProjectID INT NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    TaskTitle NVARCHAR(200) NOT NULL,
    IsCompleted BIT DEFAULT 0 NOT NULL,
    DueDate DATE NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Tasks_Project FOREIGN KEY (ProjectID) REFERENCES dbo.Client_Projects (ProjectID) ON DELETE CASCADE,
    CONSTRAINT FK_Tasks_Employee FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 8: Payroll & Monthly Salary Slips
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Employee_Payslips (
    SlipID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    PayMonth NVARCHAR(30) NOT NULL,                         -- e.g. 'October 2026'
    BasicSalary DECIMAL(12, 2) NOT NULL,
    HRA DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    SpecialAllowance DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    GrossSalary DECIMAL(12, 2) NOT NULL,
    PFDeduction DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    TaxDeduction DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    NetSalary DECIMAL(12, 2) NOT NULL,
    DisbursementStatus NVARCHAR(30) DEFAULT N'Paid' NOT NULL,
    PaidOnDate DATE NULL,
    SlipDownloadUrl NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Payslip_Employee FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 9: Announcements & Corporate Notice Board
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Announcements (
    AnnouncementID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(50) DEFAULT N'General' NOT NULL,
    Tag NVARCHAR(50) DEFAULT N'HR Notice' NOT NULL,
    AuthorName NVARCHAR(100) DEFAULT N'Priya Sharma (HR Manager)' NOT NULL,
    AuthorRole NVARCHAR(50) DEFAULT N'HR' NOT NULL,
    PublishedDate DATE DEFAULT CAST(GETDATE() AS DATE) NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 10: QR Kiosks & Mobile Authentication Tokens
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Kiosk_Displays (
    DisplayID NVARCHAR(50) PRIMARY KEY,
    DisplayName NVARCHAR(150) NOT NULL,
    Location NVARCHAR(200) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Online' NOT NULL,
    CurrentToken NVARCHAR(100) NULL,
    TokenGeneratedAt DATETIME2 DEFAULT SYSDATETIME(),
    PairedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

CREATE TABLE dbo.Verification_Tokens (
    EmployeeID NVARCHAR(50) PRIMARY KEY,
    OTP NVARCHAR(10) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Tokens_Emp FOREIGN KEY (EmployeeID) 
        REFERENCES dbo.Employees (EmployeeID) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Audit_Logs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    Actor NVARCHAR(100) NOT NULL,
    Action NVARCHAR(100) NOT NULL,
    Details NVARCHAR(MAX) NOT NULL,
    Timestamp DATETIME2 DEFAULT SYSDATETIME()
);
GO

PRINT '============================================================================';
PRINT 'STEP 2: SEEDING REAL DATA ACROSS ALL EMPLOYEE MODULES';
PRINT '============================================================================';

-- 1. Departments
INSERT INTO dbo.Departments (DepartmentCode, DepartmentName, HeadOfDepartment) VALUES
(N'ENG', N'Engineering', N'Rahul Verma'),
(N'HR', N'Human Resources', N'Priya Sharma'),
(N'MKT', N'Marketing', N'Amit Kumar'),
(N'FIN', N'Finance', N'Neha Gupta');
GO

-- 2. Employees (Admin, HR Manager & Core Staff)
INSERT INTO dbo.Employees (EmployeeID, FullName, Email, PhoneNumber, Department, Designation, Role, Shift, JoiningDate, Status, PasswordHash) VALUES
(N'ADM001', N'Vikram Singhania', N'admin@vorldx.com', N'+91 99999 00001', N'Engineering', N'Managing Director', N'Admin', N'General (09:00 AM - 06:00 PM)', '2022-01-01', N'Active', N'Admin@123'),
(N'EMP002', N'Priya Sharma', N'priya.sharma@vorldx.com', N'+91 98765 43211', N'Human Resources', N'HR Manager', N'HR', N'General (09:00 AM - 06:00 PM)', '2023-03-01', N'Active', N'Priya@123'),
(N'EMP001', N'Rahul Verma', N'rahul.verma@vorldx.com', N'+91 98765 43210', N'Engineering', N'Senior Developer', N'Employee', N'General (09:00 AM - 06:00 PM)', '2024-01-12', N'Active', N'Rahul@123'),
(N'EMP005', N'Rohit S.', N'rohit.s@vorldx.com', N'+91 98765 43214', N'Engineering', N'Senior Software Engineer', N'Employee', N'General (09:00 AM - 06:00 PM)', '2024-02-05', N'Active', N'Rohit@123'),
(N'EMP042', N'SHREYA YADAV', N'shreyay1310@gmail.com', N'+918528910171', N'Engineering', N'Software Developer', N'Employee', N'General (09:00 AM - 06:00 PM)', '2026-10-24', N'Active', N'Shreya@123');
GO

-- 3. Leave Quota Balances for Employees
INSERT INTO dbo.Leave_Balances (EmployeeID, CasualLeaveTotal, CasualLeaveUsed, SickLeaveTotal, SickLeaveUsed, EarnedLeaveTotal, EarnedLeaveUsed) VALUES
(N'EMP005', 12.0, 2.0, 10.0, 1.0, 15.0, 3.0),
(N'EMP042', 12.0, 0.0, 10.0, 0.0, 15.0, 0.0),
(N'EMP001', 12.0, 3.0, 10.0, 2.0, 15.0, 5.0);
GO

-- 4. Attendance Records (Rohit EMP005 & Shreya EMP042)
INSERT INTO dbo.Attendance (EmployeeID, [Date], CheckIn, CheckOut, DurationMinutes, Status, Mode, Location) VALUES
(N'EMP005', CAST(GETDATE() AS DATE), N'09:02 AM', NULL, 0, N'Present', N'QR Code Kiosk', N'HQ - Lucknow'),
(N'EMP005', CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), N'08:58 AM', N'06:15 PM', 557, N'Present', N'Biometric Face ID', N'HQ - Floor 2'),
(N'EMP005', CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), N'09:15 AM', N'05:30 PM', 495, N'WFH', N'Mobile Geo-Punch', N'Remote (Lucknow)'),
(N'EMP042', CAST(GETDATE() AS DATE), N'09:00 AM', NULL, 0, N'Present', N'Web Portal', N'HQ - Main Office');
GO

-- 5. Leave Applications
INSERT INTO dbo.Leave_Requests (EmployeeID, LeaveType, FromDate, ToDate, TotalDays, Reason, Status, ReviewedBy, HRComment) VALUES
(N'EMP005', N'Casual Leave', CAST(DATEADD(DAY, 4, GETDATE()) AS DATE), CAST(DATEADD(DAY, 5, GETDATE()) AS DATE), 2.0, N'Attending family wedding ceremony', N'Approved', N'Priya Sharma (HR Manager)', N'Approved. Please coordinate handover with Rahul.'),
(N'EMP005', N'Sick Leave', CAST(DATEADD(DAY, -10, GETDATE()) AS DATE), CAST(DATEADD(DAY, -10, GETDATE()) AS DATE), 1.0, N'Viral fever checkup', N'Approved', N'Priya Sharma (HR Manager)', N'Approved with medical receipt.'),
(N'EMP042', N'Casual Leave', CAST(DATEADD(DAY, 10, GETDATE()) AS DATE), CAST(DATEADD(DAY, 11, GETDATE()) AS DATE), 2.0, N'Personal work', N'Pending', NULL, NULL);
GO

-- 6. Work From Home (WFH) Requests
INSERT INTO dbo.WFH_Requests (EmployeeID, FromDate, ToDate, TotalDays, Reason, PlannedTasks, Status, ReviewedBy, AdminComment) VALUES
(N'EMP005', CAST(DATEADD(DAY, 2, GETDATE()) AS DATE), CAST(DATEADD(DAY, 2, GETDATE()) AS DATE), 1, N'Home internet line upgrade & parcel delivery', N'Complete attendance sync module and bug fixes.', N'Approved', N'Vikram Singhania (Admin)', N'Approved for 1 day.'),
(N'EMP042', CAST(DATEADD(DAY, 7, GETDATE()) AS DATE), CAST(DATEADD(DAY, 7, GETDATE()) AS DATE), 1, N'Personal equipment maintenance', N'Vite frontend UI test cases.', N'Pending', NULL, NULL);
GO

-- 7. Client Projects & Tasks
INSERT INTO dbo.Client_Projects (ProjectName, ClientName, AssignedToEmployeeID, Priority, Deadline, Status, ProgressPercent, Description) VALUES
(N'Enterprise Attendance 360', N'VorldX Industries', N'EMP005', N'Critical', CAST(DATEADD(DAY, 15, GETDATE()) AS DATE), N'In Progress', 85, N'Full-stack enterprise biometric & QR attendance sync.'),
(N'Mobile Personal Geo-QR App', N'Alpha Global Tech', N'EMP042', N'High Priority', CAST(DATEADD(DAY, 30, GETDATE()) AS DATE), N'In Progress', 60, N'React Capacitor Android mobile punch application.');
GO

INSERT INTO dbo.Employee_Project_Tasks (ProjectID, EmployeeID, TaskTitle, IsCompleted, DueDate) VALUES
(1, N'EMP005', N'Implement Real-Time QR Scanner and Audio Chime', 1, CAST(GETDATE() AS DATE)),
(1, N'EMP005', N'Sync SQLite offline logs with SQL Server Master', 1, CAST(DATEADD(DAY, 2, GETDATE()) AS DATE)),
(2, N'EMP042', N'Design 2-Step OTP Verification Modal in HR Portal', 1, CAST(GETDATE() AS DATE));
GO

-- 8. Salary Payslips
INSERT INTO dbo.Employee_Payslips (EmployeeID, PayMonth, BasicSalary, HRA, SpecialAllowance, GrossSalary, PFDeduction, TaxDeduction, NetSalary, DisbursementStatus, PaidOnDate) VALUES
(N'EMP005', N'September 2026', 45000.00, 18000.00, 12000.00, 75000.00, 5400.00, 4600.00, 65000.00, N'Paid', '2026-10-01'),
(N'EMP005', N'August 2026', 45000.00, 18000.00, 12000.00, 75000.00, 5400.00, 4600.00, 65000.00, N'Paid', '2026-09-01'),
(N'EMP042', N'September 2026', 35000.00, 14000.00, 9000.00, 58000.00, 4200.00, 3800.00, 50000.00, N'Paid', '2026-10-01');
GO

-- 9. Announcements
INSERT INTO dbo.Announcements (Title, Content, Priority, Tag, AuthorName, AuthorRole, PublishedDate, IsActive) VALUES
(N'🪔 Diwali Festive Bonus & Extended Office Holidays', N'Management is thrilled to announce Diwali festival bonuses for all employees! Office will observe official holidays from 31st Oct to 3rd Nov 2026.', N'Celebration', N'Festive Notice', N'Priya Sharma (HR Manager)', N'HR', CAST(GETDATE() AS DATE), 1),
(N'📢 Q4 Company Town Hall & Employee Awards', N'All employees are cordially invited to the Q4 Town Hall this Friday at 3:00 PM in the Lucknow HQ Auditorium.', N'Urgent', N'All Hands', N'Priya Sharma (HR Manager)', N'HR', CAST(GETDATE() AS DATE), 1);
GO

-- 10. QR Attendance Kiosks
INSERT INTO dbo.Kiosk_Displays (DisplayID, DisplayName, Location, Status, CurrentToken) VALUES
(N'QR001', N'HQ Main Entrance Kiosk', N'Ground Floor Reception - Lucknow HQ', N'Online', N'WORLDXZ026'),
(N'QR002', N'Engineering Wing 2nd Floor', N'2nd Floor North Wing', N'Online', N'WORLDXZ027');
GO

-- 11. Verification Tokens (Active OTP for testing)
INSERT INTO dbo.Verification_Tokens (EmployeeID, OTP, ExpiresAt) VALUES
(N'EMP042', N'467256', DATEADD(HOUR, 24, SYSDATETIME()));
GO

PRINT '============================================================================';
PRINT 'STEP 3: SUMMARY OF ALL CREATED MODULES & ROW COUNTS';
PRINT '============================================================================';

SELECT '1. Employees (Profiles)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Employees
UNION ALL
SELECT '2. Attendance (Punch Records)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Attendance
UNION ALL
SELECT '3. Leave_Balances (Quotas)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Leave_Balances
UNION ALL
SELECT '4. Leave_Requests (Applications)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Leave_Requests
UNION ALL
SELECT '5. WFH_Requests (Remote Logs)' AS Module, COUNT(*) AS TotalRecords FROM dbo.WFH_Requests
UNION ALL
SELECT '6. Client_Projects & Tasks' AS Module, COUNT(*) AS TotalRecords FROM dbo.Client_Projects
UNION ALL
SELECT '7. Employee_Payslips (Salary)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Employee_Payslips
UNION ALL
SELECT '8. Announcements (Notice Board)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Announcements
UNION ALL
SELECT '9. Kiosk_Displays (QR Terminals)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Kiosk_Displays
UNION ALL
SELECT '10. Verification_Tokens (OTPs)' AS Module, COUNT(*) AS TotalRecords FROM dbo.Verification_Tokens;
GO