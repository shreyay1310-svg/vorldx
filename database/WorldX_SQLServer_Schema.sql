-- ============================================================================
-- WorldX Attendance 360 (VorldX Industries Pvt Ltd)
-- DATABASE CREATION & SCHEMA DEFINITION SCRIPT FOR MICROSOFT SQL SERVER (T-SQL)
-- Compatibility: Microsoft SQL Server 2016, 2017, 2019, 2022, Azure SQL DB
-- ============================================================================

-- 1. Create Database if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'WorldX_Attendance360')
BEGIN
    CREATE DATABASE [WorldX_Attendance360];
    PRINT '>> Database [WorldX_Attendance360] created successfully.';
END
GO

USE [WorldX_Attendance360];
GO

-- Set ANSI defaults
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- ============================================================================
-- DROP EXISTING CONSTRAINTS & TABLES IN REVERSE DEPENDENCY ORDER (IDEMPOTENT)
-- ============================================================================
IF OBJECT_ID(N'dbo.sp_MarkAttendance', N'P') IS NOT NULL DROP PROCEDURE dbo.sp_MarkAttendance;
IF OBJECT_ID(N'dbo.sp_ApproveWFHRequest', N'P') IS NOT NULL DROP PROCEDURE dbo.sp_ApproveWFHRequest;
IF OBJECT_ID(N'dbo.sp_ApproveLeaveRequest', N'P') IS NOT NULL DROP PROCEDURE dbo.sp_ApproveLeaveRequest;
IF OBJECT_ID(N'dbo.sp_GetAdminDashboardKPIs', N'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetAdminDashboardKPIs;
IF OBJECT_ID(N'dbo.vw_AdminDashboardKPIs', N'V') IS NOT NULL DROP VIEW dbo.vw_AdminDashboardKPIs;
IF OBJECT_ID(N'dbo.vw_DepartmentWiseAttendance', N'V') IS NOT NULL DROP VIEW dbo.vw_DepartmentWiseAttendance;
IF OBJECT_ID(N'dbo.vw_RecentActivities', N'V') IS NOT NULL DROP VIEW dbo.vw_RecentActivities;
IF OBJECT_ID(N'dbo.vw_EmployeeMonthlyAttendanceSummary', N'V') IS NOT NULL DROP VIEW dbo.vw_EmployeeMonthlyAttendanceSummary;
IF OBJECT_ID(N'dbo.vw_PresentEmployees', N'V') IS NOT NULL DROP VIEW dbo.vw_PresentEmployees;
IF OBJECT_ID(N'dbo.vw_DailyAttendanceRegister', N'V') IS NOT NULL DROP VIEW dbo.vw_DailyAttendanceRegister;

IF OBJECT_ID(N'dbo.Audit_Logs', N'U') IS NOT NULL DROP TABLE dbo.Audit_Logs;
IF OBJECT_ID(N'dbo.Verification_Tokens', N'U') IS NOT NULL DROP TABLE dbo.Verification_Tokens;
IF OBJECT_ID(N'dbo.Announcements', N'U') IS NOT NULL DROP TABLE dbo.Announcements;
IF OBJECT_ID(N'dbo.Attendance', N'U') IS NOT NULL DROP TABLE dbo.Attendance;
IF OBJECT_ID(N'dbo.WFH_Requests', N'U') IS NOT NULL DROP TABLE dbo.WFH_Requests;
IF OBJECT_ID(N'dbo.Leave_Requests', N'U') IS NOT NULL DROP TABLE dbo.Leave_Requests;
IF OBJECT_ID(N'dbo.HR_Members', N'U') IS NOT NULL DROP TABLE dbo.HR_Members;
IF OBJECT_ID(N'dbo.Kiosk_Displays', N'U') IS NOT NULL DROP TABLE dbo.Kiosk_Displays;
IF OBJECT_ID(N'dbo.Company_Policies', N'U') IS NOT NULL DROP TABLE dbo.Company_Policies;
IF OBJECT_ID(N'dbo.Employees', N'U') IS NOT NULL DROP TABLE dbo.Employees;
IF OBJECT_ID(N'dbo.Designations', N'U') IS NOT NULL DROP TABLE dbo.Designations;
IF OBJECT_ID(N'dbo.Departments', N'U') IS NOT NULL DROP TABLE dbo.Departments;
GO

-- ============================================================================
-- TABLE 1: Departments (Lookup & Organizational Hierarchy)
-- ============================================================================
CREATE TABLE dbo.Departments (
    DepartmentID INT IDENTITY(1,1) NOT NULL,
    DepartmentCode NVARCHAR(20) NOT NULL,
    DepartmentName NVARCHAR(100) NOT NULL,
    HeadOfDepartment NVARCHAR(100) NULL,
    Location NVARCHAR(100) DEFAULT N'Lucknow HQ',
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Departments PRIMARY KEY CLUSTERED (DepartmentID),
    CONSTRAINT UQ_Departments_Name UNIQUE (DepartmentName),
    CONSTRAINT UQ_Departments_Code UNIQUE (DepartmentCode)
);
GO

-- ============================================================================
-- TABLE 2: Designations (Job Roles & Standard Hierarchies)
-- ============================================================================
CREATE TABLE dbo.Designations (
    DesignationID INT IDENTITY(1,1) NOT NULL,
    DesignationTitle NVARCHAR(100) NOT NULL,
    StandardRole NVARCHAR(50) NOT NULL DEFAULT N'Employee', -- 'Admin', 'HR', 'Employee', 'Manager'
    HierarchyLevel INT DEFAULT 1 NOT NULL, -- 1: Employee, 2: Lead, 3: HR, 4: Admin
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Designations PRIMARY KEY CLUSTERED (DesignationID),
    CONSTRAINT UQ_Designations_Title UNIQUE (DesignationTitle)
);
GO

-- ============================================================================
-- TABLE 3: Employees (Master Employee Directory)
-- ============================================================================
CREATE TABLE dbo.Employees (
    EmployeeID NVARCHAR(50) NOT NULL, -- 'EMP001', 'EMP005', etc.
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    PhoneNumber NVARCHAR(25) NULL,
    Department NVARCHAR(100) NOT NULL,
    Designation NVARCHAR(100) NOT NULL,
    Shift NVARCHAR(100) DEFAULT N'General (09:00 AM - 06:00 PM)' NOT NULL,
    WorkType NVARCHAR(50) DEFAULT N'Office' NOT NULL, -- 'Office', 'Remote', 'Hybrid'
    JoiningDate DATE NOT NULL,
    ReportingManager NVARCHAR(150) DEFAULT N'Amit Kumar' NULL,
    Status NVARCHAR(20) DEFAULT N'Active' NOT NULL, -- 'Active', 'Inactive', 'Suspended'
    Role NVARCHAR(20) DEFAULT N'Employee' NOT NULL, -- 'Admin', 'HR', 'Employee'
    AvatarUrl NVARCHAR(500) NULL,
    PasswordHash NVARCHAR(255) DEFAULT N'password123' NOT NULL,
    IsVerified BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED (EmployeeID),
    CONSTRAINT UQ_Employees_Email UNIQUE (Email),
    CONSTRAINT CK_Employees_Status CHECK (Status IN (N'Active', N'Inactive', N'Suspended')),
    CONSTRAINT CK_Employees_Role CHECK (Role IN (N'Admin', N'HR', N'Employee', N'Manager'))
);
GO

CREATE NONCLUSTERED INDEX IX_Employees_Department ON dbo.Employees (Department);
CREATE NONCLUSTERED INDEX IX_Employees_Role ON dbo.Employees (Role);
CREATE NONCLUSTERED INDEX IX_Employees_Status ON dbo.Employees (Status);
GO

-- ============================================================================
-- TABLE 4: HR_Members (HR Access & Management Roster)
-- ============================================================================
CREATE TABLE dbo.HR_Members (
    HRMemberID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Role NVARCHAR(100) DEFAULT N'HR Executive' NOT NULL, -- 'HR Executive', 'HR Manager', 'HR Lead'
    Department NVARCHAR(100) DEFAULT N'Human Resources' NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Status NVARCHAR(20) DEFAULT N'Active' NOT NULL, -- 'Active', 'Inactive'
    AssignedPermissions NVARCHAR(MAX) DEFAULT N'["attendance_review", "wfh_approval", "leave_approval", "reports_export"]',
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_HR_Members PRIMARY KEY CLUSTERED (HRMemberID),
    CONSTRAINT FK_HR_Members_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE
);
GO

-- ============================================================================
-- TABLE 5: Attendance (Daily Punch, Check-in/out, GPS & Regularization)
-- ============================================================================
CREATE TABLE dbo.Attendance (
    AttendanceID BIGINT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    AttendanceDate DATE NOT NULL,
    CheckInTime TIME(0) NULL,
    CheckOutTime TIME(0) NULL,
    DurationMinutes INT DEFAULT 0 NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- 'Present', 'WFH', 'Leave', 'Absent', 'Late', 'Half Day'
    Mode NVARCHAR(50) DEFAULT N'QR_SCAN' NOT NULL, -- 'QR_SCAN', 'MANUAL_PUNCH', 'BIOMETRIC', 'REGULARIZED'
    KioskID NVARCHAR(50) DEFAULT N'QR001' NULL,
    Location NVARCHAR(150) DEFAULT N'Office (via QR)' NULL,
    GPSLatitude DECIMAL(9,6) NULL,
    GPSLongitude DECIMAL(9,6) NULL,
    LateByMinutes INT DEFAULT 0 NOT NULL,
    Remarks NVARCHAR(500) NULL,
    RegularizedBy NVARCHAR(150) NULL,
    RegularizedAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Attendance PRIMARY KEY CLUSTERED (AttendanceID),
    CONSTRAINT UQ_Attendance_Emp_Date UNIQUE (EmployeeID, AttendanceDate),
    CONSTRAINT FK_Attendance_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT CK_Attendance_Status CHECK (Status IN (N'Present', N'WFH', N'Leave', N'Absent', N'Late', N'Half Day'))
);
GO

CREATE NONCLUSTERED INDEX IX_Attendance_Date ON dbo.Attendance (AttendanceDate);
CREATE NONCLUSTERED INDEX IX_Attendance_Status ON dbo.Attendance (Status);
CREATE NONCLUSTERED INDEX IX_Attendance_Employee_Date ON dbo.Attendance (EmployeeID, AttendanceDate) INCLUDE (Status, DurationMinutes);
GO

-- ============================================================================
-- TABLE 6: WFH_Requests (Work From Home Requests & Approval Pipeline)
-- ============================================================================
CREATE TABLE dbo.WFH_Requests (
    RequestID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    EmployeeName NVARCHAR(150) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    RequestDate DATE NOT NULL,
    FromDate DATE NULL,
    ToDate DATE NULL,
    TotalDays INT DEFAULT 1 NOT NULL,
    Reason NVARCHAR(1000) NOT NULL,
    Status NVARCHAR(20) DEFAULT N'Pending' NOT NULL, -- 'Pending', 'Approved', 'Rejected'
    RequesterRole NVARCHAR(50) DEFAULT N'Employee' NOT NULL,
    ApproverRole NVARCHAR(50) DEFAULT N'HR' NOT NULL,
    ReviewedBy NVARCHAR(150) NULL,
    ReviewedAt DATETIME2 NULL,
    ReviewerComment NVARCHAR(1000) NULL,
    AppliedOn DATE DEFAULT CAST(SYSDATETIME() AS DATE) NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_WFH_Requests PRIMARY KEY CLUSTERED (RequestID),
    CONSTRAINT FK_WFH_Requests_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT CK_WFH_Requests_Status CHECK (Status IN (N'Pending', N'Approved', N'Rejected'))
);
GO

CREATE NONCLUSTERED INDEX IX_WFH_Status ON dbo.WFH_Requests (Status);
CREATE NONCLUSTERED INDEX IX_WFH_Employee ON dbo.WFH_Requests (EmployeeID);
GO

-- ============================================================================
-- TABLE 7: Leave_Requests (Casual, Sick, Earned Leave & Admin Workflow)
-- ============================================================================
CREATE TABLE dbo.Leave_Requests (
    LeaveID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    EmployeeName NVARCHAR(150) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    LeaveType NVARCHAR(50) DEFAULT N'Casual Leave' NOT NULL, -- 'Casual Leave', 'Sick Leave', 'Earned Leave'
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    TotalDays INT DEFAULT 1 NOT NULL,
    Reason NVARCHAR(1000) NOT NULL,
    Status NVARCHAR(20) DEFAULT N'Pending' NOT NULL, -- 'Pending', 'Approved', 'Rejected'
    RequesterRole NVARCHAR(50) DEFAULT N'Employee' NOT NULL,
    ApproverRole NVARCHAR(50) DEFAULT N'HR' NOT NULL,
    ReviewedBy NVARCHAR(150) NULL,
    ReviewedAt DATETIME2 NULL,
    ReviewerComment NVARCHAR(1000) NULL,
    AppliedOn DATE DEFAULT CAST(SYSDATETIME() AS DATE) NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Leave_Requests PRIMARY KEY CLUSTERED (LeaveID),
    CONSTRAINT FK_Leave_Requests_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT CK_Leave_Requests_Status CHECK (Status IN (N'Pending', N'Approved', N'Rejected')),
    CONSTRAINT CK_Leave_Requests_Type CHECK (LeaveType IN (N'Casual Leave', N'Sick Leave', N'Earned Leave', N'Maternity Leave', N'Paternity Leave'))
);
GO

CREATE NONCLUSTERED INDEX IX_Leave_Status ON dbo.Leave_Requests (Status);
CREATE NONCLUSTERED INDEX IX_Leave_Employee ON dbo.Leave_Requests (EmployeeID);
GO

-- ============================================================================
-- TABLE 8: Company_Policies (Policy Parameters, Timings & Feature Switches)
-- ============================================================================
CREATE TABLE dbo.Company_Policies (
    PolicyID INT IDENTITY(1,1) NOT NULL,
    CompanyName NVARCHAR(150) DEFAULT N'VorldX Industries Private Limited' NOT NULL,
    CIN NVARCHAR(50) DEFAULT N'U62099UP2026PTC245598' NOT NULL,
    Headquarters NVARCHAR(150) DEFAULT N'Lucknow, U.P., India' NOT NULL,
    OfficeStartTime TIME(0) DEFAULT '09:00:00' NOT NULL,
    OfficeEndTime TIME(0) DEFAULT '18:00:00' NOT NULL,
    HalfDayThresholdHours DECIMAL(3,1) DEFAULT 4.0 NOT NULL,
    LateMarkAfter TIME(0) DEFAULT '09:15:00' NOT NULL,
    GracePeriodMinutes INT DEFAULT 15 NOT NULL,
    WorkingDays NVARCHAR(100) DEFAULT N'Mon - Fri' NOT NULL,
    MaxWFHDaysPerMonth INT DEFAULT 4 NOT NULL,
    QRRotationSeconds INT DEFAULT 45 NOT NULL,
    EnableQRAttendance BIT DEFAULT 1 NOT NULL,
    AllowAttendanceCorrection BIT DEFAULT 1 NOT NULL,
    AutoMarkAbsentIfNotCheckedIn BIT DEFAULT 1 NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Company_Policies PRIMARY KEY CLUSTERED (PolicyID)
);
GO

-- ============================================================================
-- TABLE 9: Announcements (Notices & Broadcasts by HR / Admin)
-- ============================================================================
CREATE TABLE dbo.Announcements (
    AnnouncementID INT IDENTITY(1,1) NOT NULL,
    Title NVARCHAR(250) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(50) DEFAULT N'General' NOT NULL, -- 'High Priority', 'Policy Update', 'General'
    Tag NVARCHAR(50) DEFAULT N'HR Notice' NOT NULL,
    AuthorName NVARCHAR(150) DEFAULT N'Amit Singh (Admin)' NOT NULL,
    AuthorRole NVARCHAR(50) DEFAULT N'Admin' NOT NULL,
    PublishedDate DATE DEFAULT CAST(SYSDATETIME() AS DATE) NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Announcements PRIMARY KEY CLUSTERED (AnnouncementID)
);
GO

-- ============================================================================
-- TABLE 10: Audit_Logs (Chronological Security & Administrative Audit Trail)
-- ============================================================================
CREATE TABLE dbo.Audit_Logs (
    LogID BIGINT IDENTITY(1,1) NOT NULL,
    Actor NVARCHAR(150) NOT NULL,
    Action NVARCHAR(100) NOT NULL, -- 'POLICY_UPDATE', 'WFH_APPROVED', 'LEAVE_REJECT', etc.
    Details NVARCHAR(MAX) NOT NULL,
    IPAddress NVARCHAR(50) DEFAULT N'127.0.0.1' NULL,
    LoggedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Audit_Logs PRIMARY KEY CLUSTERED (LogID)
);
GO

CREATE NONCLUSTERED INDEX IX_Audit_Logs_LoggedAt ON dbo.Audit_Logs (LoggedAt DESC);
GO

-- ============================================================================
-- TABLE 11: Kiosk_Displays (Dynamic QR Display Stations)
-- ============================================================================
CREATE TABLE dbo.Kiosk_Displays (
    KioskID NVARCHAR(50) NOT NULL,
    KioskName NVARCHAR(150) NOT NULL,
    Location NVARCHAR(150) NOT NULL,
    Status NVARCHAR(50) DEFAULT N'Online' NOT NULL,
    CurrentToken NVARCHAR(255) NULL,
    TokenGeneratedAt DATETIME2 NULL,
    TokenExpiresAt DATETIME2 NULL,
    PairedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Kiosk_Displays PRIMARY KEY CLUSTERED (KioskID)
);
GO

-- ============================================================================
-- TABLE 12: Verification_Tokens (OTPs & WebAuthn Session Tokens)
-- ============================================================================
CREATE TABLE dbo.Verification_Tokens (
    TokenID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    OTP NVARCHAR(10) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Verification_Tokens PRIMARY KEY CLUSTERED (TokenID),
    CONSTRAINT FK_Verification_Tokens_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE
);
GO

-- ============================================================================
-- VIEWS: Optimized SQL Server Views for Admin & Employee Dashboards
-- ============================================================================

-- View 1: Admin Dashboard Real-Time Attendance KPIs
CREATE VIEW dbo.vw_AdminDashboardKPIs
AS
SELECT 
    (SELECT COUNT(*) FROM dbo.Employees WHERE Status = N'Active') AS TotalEmployees,
    (SELECT COUNT(*) FROM dbo.Attendance WHERE AttendanceDate = CAST(SYSDATETIME() AS DATE) AND Status = N'Present') AS PresentToday,
    (SELECT COUNT(*) FROM dbo.Attendance WHERE AttendanceDate = CAST(SYSDATETIME() AS DATE) AND Status = N'WFH') AS WFHToday,
    (SELECT COUNT(*) FROM dbo.Attendance WHERE AttendanceDate = CAST(SYSDATETIME() AS DATE) AND Status = N'Leave') AS OnLeaveToday,
    (SELECT COUNT(*) FROM dbo.WFH_Requests WHERE Status = N'Pending') AS PendingWFHRequests,
    (SELECT COUNT(*) FROM dbo.Leave_Requests WHERE Status = N'Pending') AS PendingLeaveRequests;
GO

-- View 2: Department-wise Attendance Summary
CREATE VIEW dbo.vw_DepartmentWiseAttendance
AS
SELECT 
    e.Department,
    COUNT(CASE WHEN a.Status = N'Present' THEN 1 END) AS PresentCount,
    COUNT(CASE WHEN a.Status = N'WFH' THEN 1 END) AS WFHCount,
    COUNT(CASE WHEN a.Status = N'Leave' THEN 1 END) AS LeaveCount,
    COUNT(CASE WHEN a.Status = N'Absent' OR a.AttendanceID IS NULL THEN 1 END) AS AbsentCount,
    COUNT(*) AS TotalStaff
FROM dbo.Employees e
LEFT JOIN dbo.Attendance a 
    ON e.EmployeeID = a.EmployeeID 
    AND a.AttendanceDate = CAST(SYSDATETIME() AS DATE)
WHERE e.Status = N'Active'
GROUP BY e.Department;
GO

-- View 3: Recent Administrative & Attendance Activities
CREATE VIEW dbo.vw_RecentActivities
AS
SELECT TOP 20
    'ACTIVITY' AS SourceType,
    LogID AS RecordID,
    Actor AS Title,
    Action AS Subtitle,
    Details AS Description,
    LoggedAt AS ActivityTime
FROM dbo.Audit_Logs
ORDER BY LoggedAt DESC;
GO

-- View 4: Employee Monthly Attendance Summary (For Screen 2 of Employee Portal)
CREATE VIEW dbo.vw_EmployeeMonthlyAttendanceSummary
AS
SELECT 
    EmployeeID,
    YEAR(AttendanceDate) AS AttendanceYear,
    MONTH(AttendanceDate) AS AttendanceMonth,
    COUNT(CASE WHEN Status = N'Present' THEN 1 END) AS TotalPresent,
    COUNT(CASE WHEN Status = N'WFH' THEN 1 END) AS TotalWFH,
    COUNT(CASE WHEN Status = N'Leave' THEN 1 END) AS TotalLeave,
    COUNT(CASE WHEN Status = N'Absent' THEN 1 END) AS TotalAbsent,
    COUNT(CASE WHEN Status = N'Late' THEN 1 END) AS TotalLate,
    SUM(DurationMinutes) / 60.0 AS TotalWorkingHours
FROM dbo.Attendance
GROUP BY EmployeeID, YEAR(AttendanceDate), MONTH(AttendanceDate);
GO

-- View 5: Present Employees Register (Employee Name, ID, Arrival, Departure, Date, Total Hours, Status)
CREATE VIEW dbo.vw_PresentEmployees
AS
SELECT 
    a.AttendanceID,
    e.EmployeeID AS [EmployeeID],
    e.FullName AS [EmployeeName],
    a.AttendanceDate AS [Date],
    a.PunchInTime AS [ArrivalTime],
    a.PunchOutTime AS [DepartureTime],
    CASE 
        WHEN a.DurationMinutes > 0 
        THEN CAST(a.DurationMinutes / 60 AS NVARCHAR(10)) + N'h ' + RIGHT(N'0' + CAST(a.DurationMinutes % 60 AS NVARCHAR(2)), 2) + N'm'
        ELSE N'In Progress' 
    END AS [TotalHours],
    a.DurationMinutes,
    a.Status AS [Status],
    e.Department AS [Department],
    e.Designation AS [Designation],
    a.Mode AS [Mode],
    a.Location AS [Location],
    CASE 
        WHEN a.LateMinutes > 0 THEN N'Late by ' + CAST(a.LateMinutes AS NVARCHAR(10)) + N' mins' 
        ELSE N'On Time' 
    END AS [ArrivalStatus]
FROM dbo.Attendance a
INNER JOIN dbo.Employees e ON a.EmployeeID = e.EmployeeID
WHERE a.Status = N'Present';
GO

-- View 6: Daily Comprehensive Attendance Register (All Employees)
CREATE VIEW dbo.vw_DailyAttendanceRegister
AS
SELECT 
    a.AttendanceID,
    e.EmployeeID AS [EmployeeID],
    e.FullName AS [EmployeeName],
    a.AttendanceDate AS [Date],
    ISNULL(CAST(a.PunchInTime AS NVARCHAR(10)), N'--:--') AS [ArrivalTime],
    ISNULL(CAST(a.PunchOutTime AS NVARCHAR(10)), N'--:--') AS [DepartureTime],
    CASE 
        WHEN a.DurationMinutes > 0 
        THEN CAST(a.DurationMinutes / 60 AS NVARCHAR(10)) + N'h ' + RIGHT(N'0' + CAST(a.DurationMinutes % 60 AS NVARCHAR(2)), 2) + N'm'
        WHEN a.Status = N'Present' THEN N'In Progress'
        ELSE N'--' 
    END AS [TotalHours],
    a.Status AS [Status],
    e.Department AS [Department],
    e.Designation AS [Designation],
    a.Mode AS [Mode],
    a.Location AS [Location]
FROM dbo.Attendance a
INNER JOIN dbo.Employees e ON a.EmployeeID = e.EmployeeID;
GO

-- ============================================================================
-- STORED PROCEDURES: Core Business Logic & Safe Operations
-- ============================================================================

-- Procedure 1: Mark Attendance (QR Punch / In-Out Toggle)
CREATE PROCEDURE dbo.sp_MarkAttendance
    @EmployeeID NVARCHAR(50),
    @PunchType NVARCHAR(20) = N'AUTO', -- 'CheckIn', 'CheckOut', 'AUTO'
    @Mode NVARCHAR(50) = N'QR_SCAN',
    @KioskID NVARCHAR(50) = N'QR001',
    @Latitude DECIMAL(9,6) = NULL,
    @Longitude DECIMAL(9,6) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Today DATE = CAST(SYSDATETIME() AS DATE);
    DECLARE @NowTime TIME(0) = CAST(SYSDATETIME() AS TIME(0));
    DECLARE @OfficeStartTime TIME(0);
    DECLARE @LateMarkTime TIME(0);
    DECLARE @LateMinutes INT = 0;
    DECLARE @Status NVARCHAR(20) = N'Present';

    -- Fetch policy timings
    SELECT TOP 1 
        @OfficeStartTime = OfficeStartTime,
        @LateMarkTime = LateMarkAfter
    FROM dbo.Company_Policies
    WHERE IsActive = 1;

    IF @NowTime > @LateMarkTime
    BEGIN
        SET @LateMinutes = DATEDIFF(MINUTE, @OfficeStartTime, @NowTime);
    END

    -- Check if record exists for today
    IF EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today)
    BEGIN
        -- Update Check-out
        UPDATE dbo.Attendance
        SET 
            CheckOutTime = @NowTime,
            DurationMinutes = DATEDIFF(MINUTE, CheckInTime, @NowTime),
            UpdatedAt = SYSDATETIME()
        WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today;

        -- Log Audit
        INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
        VALUES (@EmployeeID, N'ATTENDANCE_CHECKOUT', N'Employee logged check-out at ' + CAST(@NowTime AS NVARCHAR(20)));

        SELECT 
            @EmployeeID AS EmployeeID,
            @Today AS AttendanceDate,
            'CheckOut' AS PunchRecorded,
            @NowTime AS CheckOutTime,
            N'Attendance check-out recorded successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Insert new Check-in
        INSERT INTO dbo.Attendance (
            EmployeeID,
            AttendanceDate,
            CheckInTime,
            CheckOutTime,
            DurationMinutes,
            Status,
            Mode,
            KioskID,
            Location,
            GPSLatitude,
            GPSLongitude,
            LateByMinutes
        )
        VALUES (
            @EmployeeID,
            @Today,
            @NowTime,
            NULL,
            0,
            @Status,
            @Mode,
            @KioskID,
            N'Office (via QR)',
            @Latitude,
            @Longitude,
            @LateMinutes
        );

        -- Log Audit
        INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
        VALUES (@EmployeeID, N'ATTENDANCE_CHECKIN', N'Employee logged check-in at ' + CAST(@NowTime AS NVARCHAR(20)) + N' via ' + @Mode);

        SELECT 
            @EmployeeID AS EmployeeID,
            @Today AS AttendanceDate,
            'CheckIn' AS PunchRecorded,
            @NowTime AS CheckInTime,
            N'Attendance check-in recorded successfully' AS Message;
    END
END;
GO

-- Procedure 2: Approve or Reject WFH Request
CREATE PROCEDURE dbo.sp_ApproveWFHRequest
    @RequestID INT,
    @NewStatus NVARCHAR(20), -- 'Approved' or 'Rejected'
    @ReviewerName NVARCHAR(150),
    @Comment NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @NewStatus NOT IN (N'Approved', N'Rejected')
    BEGIN
        RAISERROR(N'Invalid status. Allowed values: Approved, Rejected', 16, 1);
        RETURN;
    END

    UPDATE dbo.WFH_Requests
    SET 
        Status = @NewStatus,
        ReviewedBy = @ReviewerName,
        ReviewedAt = SYSDATETIME(),
        ReviewerComment = @Comment
    WHERE RequestID = @RequestID;

    -- If approved, insert corresponding record in Attendance table
    IF @NewStatus = N'Approved'
    BEGIN
        DECLARE @EmpID NVARCHAR(50), @ReqDate DATE;
        SELECT @EmpID = EmployeeID, @ReqDate = RequestDate FROM dbo.WFH_Requests WHERE RequestID = @RequestID;

        IF NOT EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeID = @EmpID AND AttendanceDate = @ReqDate)
        BEGIN
            INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, Status, Mode, Location)
            VALUES (@EmpID, @ReqDate, N'WFH', N'REMOTE_APPROVAL', N'Remote (WFH)');
        END
        ELSE
        BEGIN
            UPDATE dbo.Attendance 
            SET Status = N'WFH', Location = N'Remote (WFH)' 
            WHERE EmployeeID = @EmpID AND AttendanceDate = @ReqDate;
        END
    END

    -- Log audit
    INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
    VALUES (@ReviewerName, N'WFH_' + UPPER(@NewStatus), N'WFH Request #' + CAST(@RequestID AS NVARCHAR(20)) + N' was ' + @NewStatus);

    SELECT RequestID, Status, ReviewedBy, ReviewedAt FROM dbo.WFH_Requests WHERE RequestID = @RequestID;
END;
GO

-- Procedure 3: Approve or Reject Leave Request
CREATE PROCEDURE dbo.sp_ApproveLeaveRequest
    @LeaveID INT,
    @NewStatus NVARCHAR(20), -- 'Approved' or 'Rejected'
    @ReviewerName NVARCHAR(150),
    @Comment NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @NewStatus NOT IN (N'Approved', N'Rejected')
    BEGIN
        RAISERROR(N'Invalid status. Allowed values: Approved, Rejected', 16, 1);
        RETURN;
    END

    UPDATE dbo.Leave_Requests
    SET 
        Status = @NewStatus,
        ReviewedBy = @ReviewerName,
        ReviewedAt = SYSDATETIME(),
        ReviewerComment = @Comment
    WHERE LeaveID = @LeaveID;

    -- If approved, mark Attendance for the leave range
    IF @NewStatus = N'Approved'
    BEGIN
        DECLARE @EmpID NVARCHAR(50), @FromDate DATE, @ToDate DATE, @CurDate DATE;
        SELECT @EmpID = EmployeeID, @FromDate = FromDate, @ToDate = ToDate FROM dbo.Leave_Requests WHERE LeaveID = @LeaveID;
        
        SET @CurDate = @FromDate;
        WHILE @CurDate <= @ToDate
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeID = @EmpID AND AttendanceDate = @CurDate)
            BEGIN
                INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, Status, Mode, Location)
                VALUES (@EmpID, @CurDate, N'Leave', N'LEAVE_APPROVAL', N'On Leave');
            END
            ELSE
            BEGIN
                UPDATE dbo.Attendance 
                SET Status = N'Leave', Location = N'On Leave' 
                WHERE EmployeeID = @EmpID AND AttendanceDate = @CurDate;
            END
            SET @CurDate = DATEADD(DAY, 1, @CurDate);
        END
    END

    -- Log audit
    INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
    VALUES (@ReviewerName, N'LEAVE_' + UPPER(@NewStatus), N'Leave Request #' + CAST(@LeaveID AS NVARCHAR(20)) + N' was ' + @NewStatus);

    SELECT LeaveID, Status, ReviewedBy, ReviewedAt FROM dbo.Leave_Requests WHERE LeaveID = @LeaveID;
END;
GO

PRINT '>> WorldX Attendance 360 database schema and stored procedures created successfully!';
GO
