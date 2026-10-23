-- ============================================================================
-- WorldX Attendance 360 (VorldX Industries Pvt Ltd)
-- COMPLETE MASTER SETUP SCRIPT FOR MICROSOFT SQL SERVER (T-SQL)
-- Single Execution File: Creates Database, Schema, Tables, Views, Stored Procedures & Seeds All Data
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

PRINT '============================================================================';
PRINT 'STEP 1: DROPPING EXISTING OBJECTS (IDEMPOTENT CLEAN RE-RUN)';
PRINT '============================================================================';

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

PRINT '============================================================================';
PRINT 'STEP 2: CREATING TABLES AND CONSTRAINTS';
PRINT '============================================================================';

-- TABLE 1: Departments
CREATE TABLE dbo.Departments (
    DepartmentID INT IDENTITY(1,1) NOT NULL,
    DepartmentCode NVARCHAR(20) NOT NULL,
    DepartmentName NVARCHAR(100) NOT NULL,
    HeadOfDepartment NVARCHAR(100) NULL,
    Location NVARCHAR(100) DEFAULT N'Lucknow HQ',
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Departments PRIMARY KEY CLUSTERED (DepartmentID),
    CONSTRAINT UQ_Departments_Code UNIQUE NONCLUSTERED (DepartmentCode),
    CONSTRAINT UQ_Departments_Name UNIQUE NONCLUSTERED (DepartmentName)
);
GO

-- TABLE 2: Designations
CREATE TABLE dbo.Designations (
    DesignationID INT IDENTITY(1,1) NOT NULL,
    DesignationTitle NVARCHAR(100) NOT NULL,
    StandardRole NVARCHAR(50) DEFAULT N'Employee' NOT NULL,
    HierarchyLevel INT DEFAULT 1 NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Designations PRIMARY KEY CLUSTERED (DesignationID),
    CONSTRAINT UQ_Designations_Title UNIQUE NONCLUSTERED (DesignationTitle)
);
GO

-- TABLE 3: Employees
CREATE TABLE dbo.Employees (
    EmployeeID NVARCHAR(50) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    PhoneNumber NVARCHAR(20) NULL,
    Department NVARCHAR(100) NOT NULL,
    Designation NVARCHAR(100) NOT NULL,
    Shift NVARCHAR(50) DEFAULT N'General (9AM - 6PM)' NOT NULL,
    WorkType NVARCHAR(50) DEFAULT N'On-site' NOT NULL,
    JoiningDate DATE DEFAULT '2023-01-15' NOT NULL,
    ReportingManager NVARCHAR(100) DEFAULT N'Amit Singh' NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    Role NVARCHAR(50) DEFAULT N'Employee' NOT NULL,
    AvatarUrl NVARCHAR(500) NULL,
    AddressLine NVARCHAR(255) DEFAULT N'Hazratganj, Lucknow, UP' NULL,
    EmergencyContact NVARCHAR(50) DEFAULT N'+91 98765 00000' NULL,
    BloodGroup NVARCHAR(10) DEFAULT N'O+' NULL,
    TotalLeaveQuota INT DEFAULT 18 NOT NULL,
    AvailableLeaveBalance INT DEFAULT 12 NOT NULL,
    PasswordHash NVARCHAR(255) DEFAULT N'PBKDF2$SHA256$WorldX2026' NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED (EmployeeID),
    CONSTRAINT UQ_Employees_Email UNIQUE NONCLUSTERED (Email),
    CONSTRAINT CK_Employees_Status CHECK (Status IN (N'Active', N'Inactive', N'On Notice', N'Terminated')),
    CONSTRAINT CK_Employees_Role CHECK (Role IN (N'Admin', N'HR', N'Employee', N'Manager')),
    CONSTRAINT CK_Employees_WorkType CHECK (WorkType IN (N'On-site', N'Remote', N'Hybrid'))
);
CREATE NONCLUSTERED INDEX IX_Employees_Department ON dbo.Employees (Department);
CREATE NONCLUSTERED INDEX IX_Employees_Role ON dbo.Employees (Role);
CREATE NONCLUSTERED INDEX IX_Employees_Status ON dbo.Employees (Status);
GO

-- TABLE 4: Company Policies
CREATE TABLE dbo.Company_Policies (
    PolicyID INT IDENTITY(1,1) NOT NULL,
    PolicyKey NVARCHAR(50) NOT NULL,
    PolicyName NVARCHAR(150) NOT NULL,
    Description NVARCHAR(500) NULL,
    WorkStartTime TIME(0) DEFAULT '09:00:00' NOT NULL,
    WorkEndTime TIME(0) DEFAULT '18:00:00' NOT NULL,
    GracePeriodMinutes INT DEFAULT 15 NOT NULL,
    LateMarkThreshold TIME(0) DEFAULT '09:15:00' NOT NULL,
    HalfDayMinimumHours DECIMAL(4,2) DEFAULT 4.00 NOT NULL,
    FullDayMinimumHours DECIMAL(4,2) DEFAULT 8.00 NOT NULL,
    MaxWFHDaysPerMonth INT DEFAULT 4 NOT NULL,
    AllowPastCorrectionDays INT DEFAULT 7 NOT NULL,
    EnforceBiometrics BIT DEFAULT 1 NOT NULL,
    RequireQRLocation BIT DEFAULT 1 NOT NULL,
    AutoAbsentEnabled BIT DEFAULT 1 NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    EffectiveDate DATE DEFAULT '2026-01-01' NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_CompanyPolicies PRIMARY KEY CLUSTERED (PolicyID),
    CONSTRAINT UQ_CompanyPolicies_Key UNIQUE NONCLUSTERED (PolicyKey)
);
GO

-- TABLE 5: Kiosk Displays
CREATE TABLE dbo.Kiosk_Displays (
    KioskID INT IDENTITY(1,1) NOT NULL,
    KioskCode NVARCHAR(50) NOT NULL,
    DeviceName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(150) NOT NULL,
    IpAddress NVARCHAR(50) NULL,
    Status NVARCHAR(30) DEFAULT N'Online' NOT NULL,
    LastPingAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    SecretKey NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_KioskDisplays PRIMARY KEY CLUSTERED (KioskID),
    CONSTRAINT UQ_KioskDisplays_Code UNIQUE NONCLUSTERED (KioskCode),
    CONSTRAINT CK_KioskDisplays_Status CHECK (Status IN (N'Online', N'Offline', N'Maintenance'))
);
GO

-- TABLE 6: HR Members
CREATE TABLE dbo.HR_Members (
    HRID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Designation NVARCHAR(100) NOT NULL,
    AssignedWing NVARCHAR(100) DEFAULT N'All Wings' NOT NULL,
    CanApproveWFH BIT DEFAULT 1 NOT NULL,
    CanApproveLeave BIT DEFAULT 1 NOT NULL,
    CanEditPolicies BIT DEFAULT 0 NOT NULL,
    CanExportReports BIT DEFAULT 1 NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_HRMembers PRIMARY KEY CLUSTERED (HRID),
    CONSTRAINT FK_HRMembers_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT UQ_HRMembers_EmployeeID UNIQUE NONCLUSTERED (EmployeeID)
);
GO

-- TABLE 7: Attendance
CREATE TABLE dbo.Attendance (
    AttendanceID BIGINT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    AttendanceDate DATE NOT NULL,
    PunchInTime TIME(0) NULL,
    PunchOutTime TIME(0) NULL,
    DurationMinutes INT DEFAULT 0 NOT NULL,
    Status NVARCHAR(30) NOT NULL,
    Mode NVARCHAR(50) DEFAULT N'QR Kiosk' NOT NULL,
    Location NVARCHAR(150) DEFAULT N'Lucknow HQ' NOT NULL,
    PunchInKioskCode NVARCHAR(50) NULL,
    PunchOutKioskCode NVARCHAR(50) NULL,
    LateMinutes INT DEFAULT 0 NOT NULL,
    OvertimeMinutes INT DEFAULT 0 NOT NULL,
    VerificationProof NVARCHAR(255) NULL,
    Remarks NVARCHAR(255) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Attendance PRIMARY KEY CLUSTERED (AttendanceID),
    CONSTRAINT FK_Attendance_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT UQ_Attendance_EmpDate UNIQUE NONCLUSTERED (EmployeeID, AttendanceDate),
    CONSTRAINT CK_Attendance_Status CHECK (Status IN (N'Present', N'WFH', N'Leave', N'Absent', N'Half Day', N'Late', N'Holiday', N'Weekend'))
);
CREATE NONCLUSTERED INDEX IX_Attendance_Date_Status ON dbo.Attendance (AttendanceDate, Status) INCLUDE (EmployeeID, DurationMinutes);
CREATE NONCLUSTERED INDEX IX_Attendance_Employee_Date ON dbo.Attendance (EmployeeID, AttendanceDate DESC);
GO

-- TABLE 8: WFH Requests
CREATE TABLE dbo.WFH_Requests (
    WFHID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    RequestDate DATE NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    ContactNumber NVARCHAR(20) NULL,
    WorkDeliverables NVARCHAR(500) NULL,
    Status NVARCHAR(30) DEFAULT N'Pending' NOT NULL,
    ReviewedBy NVARCHAR(100) NULL,
    ReviewedAt DATETIME2 NULL,
    ReviewerComment NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_WFHRequests PRIMARY KEY CLUSTERED (WFHID),
    CONSTRAINT FK_WFHRequests_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT CK_WFHRequests_Status CHECK (Status IN (N'Pending', N'Approved', N'Rejected', N'Cancelled'))
);
CREATE NONCLUSTERED INDEX IX_WFHRequests_Status ON dbo.WFH_Requests (Status);
CREATE NONCLUSTERED INDEX IX_WFHRequests_EmployeeID ON dbo.WFH_Requests (EmployeeID);
GO

-- TABLE 9: Leave Requests
CREATE TABLE dbo.Leave_Requests (
    LeaveID INT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    LeaveType NVARCHAR(50) NOT NULL,
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    TotalDays DECIMAL(4,1) NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Pending' NOT NULL,
    ReviewedBy NVARCHAR(100) NULL,
    ReviewedAt DATETIME2 NULL,
    ReviewerComment NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_LeaveRequests PRIMARY KEY CLUSTERED (LeaveID),
    CONSTRAINT FK_LeaveRequests_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT CK_LeaveRequests_Type CHECK (LeaveType IN (N'Casual', N'Sick', N'Earned', N'Maternity', N'Paternity', N'Compensatory')),
    CONSTRAINT CK_LeaveRequests_Status CHECK (Status IN (N'Pending', N'Approved', N'Rejected', N'Cancelled'))
);
CREATE NONCLUSTERED INDEX IX_LeaveRequests_Status ON dbo.Leave_Requests (Status);
CREATE NONCLUSTERED INDEX IX_LeaveRequests_EmployeeID ON dbo.Leave_Requests (EmployeeID);
GO

-- TABLE 10: Verification Tokens
CREATE TABLE dbo.Verification_Tokens (
    TokenID BIGINT IDENTITY(1,1) NOT NULL,
    EmployeeID NVARCHAR(50) NOT NULL,
    TokenType NVARCHAR(50) NOT NULL,
    TokenHash NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    IsUsed BIT DEFAULT 0 NOT NULL,
    UsedAt DATETIME2 NULL,
    IpAddress NVARCHAR(50) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_VerificationTokens PRIMARY KEY CLUSTERED (TokenID),
    CONSTRAINT FK_VerificationTokens_Employees FOREIGN KEY (EmployeeID) REFERENCES dbo.Employees(EmployeeID) ON DELETE CASCADE,
    CONSTRAINT CK_VerificationTokens_Type CHECK (TokenType IN (N'QR_PASS', N'SSO_OTP', N'BIOMETRIC_CHALLENGE', N'PASSWORD_RESET'))
);
CREATE NONCLUSTERED INDEX IX_VerificationTokens_Lookup ON dbo.Verification_Tokens (TokenHash, IsUsed, ExpiresAt);
GO

-- TABLE 11: Announcements
CREATE TABLE dbo.Announcements (
    AnnouncementID INT IDENTITY(1,1) NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    BodyContent NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(50) DEFAULT N'General' NOT NULL,
    TargetAudience NVARCHAR(50) DEFAULT N'All' NOT NULL,
    CreatedBy NVARCHAR(100) NOT NULL,
    IsPinned BIT DEFAULT 0 NOT NULL,
    IsActive BIT DEFAULT 1 NOT NULL,
    ExpiresAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_Announcements PRIMARY KEY CLUSTERED (AnnouncementID)
);
GO

-- TABLE 12: Audit Logs
CREATE TABLE dbo.Audit_Logs (
    LogID BIGINT IDENTITY(1,1) NOT NULL,
    Actor NVARCHAR(150) NOT NULL,
    Action NVARCHAR(100) NOT NULL,
    TargetEntity NVARCHAR(100) NULL,
    TargetID NVARCHAR(100) NULL,
    Details NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(50) NULL,
    Timestamp DATETIME2 DEFAULT SYSDATETIME() NOT NULL,
    CONSTRAINT PK_AuditLogs PRIMARY KEY CLUSTERED (LogID)
);
CREATE NONCLUSTERED INDEX IX_AuditLogs_Timestamp ON dbo.Audit_Logs (Timestamp DESC);
GO

PRINT '============================================================================';
PRINT 'STEP 3: CREATING VIEWS & STORED PROCEDURES';
PRINT '============================================================================';
GO

-- VIEW 1: Admin Dashboard KPIs
CREATE VIEW dbo.vw_AdminDashboardKPIs
AS
SELECT
    (SELECT COUNT(*) FROM dbo.Employees WHERE Status = N'Active') AS TotalEmployees,
    ISNULL(SUM(CASE WHEN a.Status = N'Present' THEN 1 ELSE 0 END), 0) AS PresentToday,
    ISNULL(SUM(CASE WHEN a.Status = N'WFH' THEN 1 ELSE 0 END), 0) AS WfhToday,
    ISNULL(SUM(CASE WHEN a.Status = N'Leave' THEN 1 ELSE 0 END), 0) AS OnLeaveToday,
    (SELECT COUNT(*) FROM dbo.Employees WHERE Status = N'Active') - 
        (ISNULL(SUM(CASE WHEN a.Status IN (N'Present', N'WFH', N'Leave') THEN 1 ELSE 0 END), 0)) AS AbsentToday,
    (SELECT COUNT(*) FROM dbo.WFH_Requests WHERE Status = N'Pending') AS PendingWFHRequests,
    (SELECT COUNT(*) FROM dbo.Leave_Requests WHERE Status = N'Pending') AS PendingLeaveRequests
FROM dbo.Attendance a
WHERE a.AttendanceDate = CAST(SYSDATETIME() AS DATE);
GO

-- VIEW 2: Department-wise Attendance
CREATE VIEW dbo.vw_DepartmentWiseAttendance
AS
SELECT 
    e.Department,
    COUNT(e.EmployeeID) AS TotalDepartmentEmployees,
    ISNULL(SUM(CASE WHEN a.Status = N'Present' THEN 1 ELSE 0 END), 0) AS PresentCount,
    ISNULL(SUM(CASE WHEN a.Status = N'WFH' THEN 1 ELSE 0 END), 0) AS WfhCount,
    ISNULL(SUM(CASE WHEN a.Status = N'Leave' THEN 1 ELSE 0 END), 0) AS LeaveCount,
    COUNT(e.EmployeeID) - ISNULL(SUM(CASE WHEN a.Status IN (N'Present', N'WFH', N'Leave') THEN 1 ELSE 0 END), 0) AS AbsentCount,
    CAST(
        ROUND(
            (CAST(ISNULL(SUM(CASE WHEN a.Status IN (N'Present', N'WFH') THEN 1 ELSE 0 END), 0) AS FLOAT) / 
             NULLIF(COUNT(e.EmployeeID), 0)) * 100.0, 
        1) 
    AS DECIMAL(5,1)) AS AttendancePercentage
FROM dbo.Employees e
LEFT JOIN dbo.Attendance a 
    ON e.EmployeeID = a.EmployeeID 
    AND a.AttendanceDate = CAST(SYSDATETIME() AS DATE)
WHERE e.Status = N'Active'
GROUP BY e.Department;
GO

-- VIEW 3: Recent Activities
CREATE VIEW dbo.vw_RecentActivities
AS
SELECT TOP 50
    a.AttendanceID AS ActivityID,
    e.EmployeeID,
    e.FullName,
    e.AvatarUrl,
    e.Department,
    a.Status,
    a.Mode,
    a.Location,
    a.PunchInTime,
    a.PunchOutTime,
    a.AttendanceDate,
    a.CreatedAt AS ActivityTimestamp
FROM dbo.Attendance a
INNER JOIN dbo.Employees e ON a.EmployeeID = e.EmployeeID
ORDER BY a.CreatedAt DESC;
GO

-- VIEW 4: Employee Monthly Attendance Summary
CREATE VIEW dbo.vw_EmployeeMonthlyAttendanceSummary
AS
SELECT
    e.EmployeeID,
    e.FullName,
    YEAR(a.AttendanceDate) AS [Year],
    MONTH(a.AttendanceDate) AS [Month],
    COUNT(a.AttendanceID) AS TotalLoggedDays,
    SUM(CASE WHEN a.Status = N'Present' THEN 1 ELSE 0 END) AS PresentDays,
    SUM(CASE WHEN a.Status = N'WFH' THEN 1 ELSE 0 END) AS WfhDays,
    SUM(CASE WHEN a.Status = N'Leave' THEN 1 ELSE 0 END) AS LeaveDays,
    SUM(CASE WHEN a.Status = N'Absent' THEN 1 ELSE 0 END) AS AbsentDays,
    SUM(CASE WHEN a.LateMinutes > 0 THEN 1 ELSE 0 END) AS LateArrivalCount,
    ROUND(AVG(CAST(a.DurationMinutes AS FLOAT) / 60.0), 2) AS AvgWorkingHoursPerDay
FROM dbo.Employees e
INNER JOIN dbo.Attendance a ON e.EmployeeID = a.EmployeeID
GROUP BY e.EmployeeID, e.FullName, YEAR(a.AttendanceDate), MONTH(a.AttendanceDate);
GO

-- VIEW 5: Present Employees Register (Employee Name, ID, Arrival, Departure, Date, Total Hours, Status)
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

-- VIEW 6: Daily Comprehensive Attendance Register (All Employees)
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

-- STORED PROCEDURE 1: Mark Attendance (Punch In / Punch Out)
CREATE PROCEDURE dbo.sp_MarkAttendance
    @EmployeeID NVARCHAR(50),
    @ActionType NVARCHAR(20), -- 'PUNCH_IN' or 'PUNCH_OUT'
    @Mode NVARCHAR(50) = N'QR Kiosk',
    @KioskCode NVARCHAR(50) = N'QR001',
    @Location NVARCHAR(150) = N'Lucknow HQ'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Today DATE = CAST(SYSDATETIME() AS DATE);
    DECLARE @NowTime TIME(0) = CAST(SYSDATETIME() AS TIME(0));
    DECLARE @PolicyWorkStart TIME(0);
    DECLARE @GraceMinutes INT;
    DECLARE @LateMarkThreshold TIME(0);

    SELECT TOP 1 
        @PolicyWorkStart = WorkStartTime,
        @GraceMinutes = GracePeriodMinutes,
        @LateMarkThreshold = LateMarkThreshold
    FROM dbo.Company_Policies 
    WHERE IsActive = 1;

    IF @ActionType = N'PUNCH_IN'
    BEGIN
        IF EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today)
        BEGIN
            SELECT AttendanceID, EmployeeID, AttendanceDate, PunchInTime, PunchOutTime, Status, N'Already Punched In' AS Message
            FROM dbo.Attendance WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today;
            RETURN;
        END

        DECLARE @LateMins INT = 0;
        IF @NowTime > @LateMarkThreshold
        BEGIN
            SET @LateMins = DATEDIFF(MINUTE, @PolicyWorkStart, @NowTime);
        END

        INSERT INTO dbo.Attendance (
            EmployeeID, AttendanceDate, PunchInTime, Status, Mode, Location, PunchInKioskCode, LateMinutes
        )
        VALUES (
            @EmployeeID, @Today, @NowTime, N'Present', @Mode, @Location, @KioskCode, @LateMins
        );

        INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
        VALUES (@EmployeeID, N'PUNCH_IN', N'Punched in via ' + @Mode + N' at ' + CAST(@NowTime AS NVARCHAR(20)));

        SELECT SCOPE_IDENTITY() AS AttendanceID, @EmployeeID AS EmployeeID, @Today AS AttendanceDate, @NowTime AS PunchInTime, N'Success' AS Message;
    END
    ELSE IF @ActionType = N'PUNCH_OUT'
    BEGIN
        DECLARE @ExistingInTime TIME(0);
        SELECT @ExistingInTime = PunchInTime 
        FROM dbo.Attendance 
        WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today;

        IF @ExistingInTime IS NULL
        BEGIN
            RAISERROR(N'Cannot punch out without prior punch in for today.', 16, 1);
            RETURN;
        END

        DECLARE @Duration INT = DATEDIFF(MINUTE, @ExistingInTime, @NowTime);
        IF @Duration < 0 SET @Duration = 0;

        UPDATE dbo.Attendance
        SET 
            PunchOutTime = @NowTime,
            DurationMinutes = @Duration,
            PunchOutKioskCode = @KioskCode,
            UpdatedAt = SYSDATETIME()
        WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today;

        INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
        VALUES (@EmployeeID, N'PUNCH_OUT', N'Punched out via ' + @Mode + N' at ' + CAST(@NowTime AS NVARCHAR(20)) + N', Duration: ' + CAST(@Duration AS NVARCHAR(20)) + N' mins');

        SELECT EmployeeID, AttendanceDate, PunchInTime, @NowTime AS PunchOutTime, @Duration AS DurationMinutes, N'Success' AS Message
        FROM dbo.Attendance WHERE EmployeeID = @EmployeeID AND AttendanceDate = @Today;
    END
END;
GO

-- STORED PROCEDURE 2: Approve WFH Request
CREATE PROCEDURE dbo.sp_ApproveWFHRequest
    @WFHID INT,
    @ReviewerName NVARCHAR(100),
    @NewStatus NVARCHAR(30), -- 'Approved' or 'Rejected'
    @Comment NVARCHAR(500) = NULL
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
    WHERE WFHID = @WFHID;

    IF @NewStatus = N'Approved'
    BEGIN
        DECLARE @EmpID NVARCHAR(50), @ReqDate DATE;
        SELECT @EmpID = EmployeeID, @ReqDate = RequestDate FROM dbo.WFH_Requests WHERE WFHID = @WFHID;

        IF NOT EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeID = @EmpID AND AttendanceDate = @ReqDate)
        BEGIN
            INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, PunchInTime, Status, Mode, Location)
            VALUES (@EmpID, @ReqDate, '09:00:00', N'WFH', N'Remote Mobile Portal', N'Work From Home');
        END
        ELSE
        BEGIN
            UPDATE dbo.Attendance 
            SET Status = N'WFH', Location = N'Work From Home' 
            WHERE EmployeeID = @EmpID AND AttendanceDate = @ReqDate;
        END
    END

    INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
    VALUES (@ReviewerName, N'WFH_' + UPPER(@NewStatus), N'WFH Request #' + CAST(@WFHID AS NVARCHAR(20)) + N' was ' + @NewStatus);

    SELECT WFHID, Status, ReviewedBy, ReviewedAt FROM dbo.WFH_Requests WHERE WFHID = @WFHID;
END;
GO

-- STORED PROCEDURE 3: Approve Leave Request
CREATE PROCEDURE dbo.sp_ApproveLeaveRequest
    @LeaveID INT,
    @ReviewerName NVARCHAR(100),
    @NewStatus NVARCHAR(30),
    @Comment NVARCHAR(500) = NULL
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

    INSERT INTO dbo.Audit_Logs (Actor, Action, Details)
    VALUES (@ReviewerName, N'LEAVE_' + UPPER(@NewStatus), N'Leave Request #' + CAST(@LeaveID AS NVARCHAR(20)) + N' was ' + @NewStatus);

    SELECT LeaveID, Status, ReviewedBy, ReviewedAt FROM dbo.Leave_Requests WHERE LeaveID = @LeaveID;
END;
GO

PRINT '============================================================================';
PRINT 'STEP 4: SEEDING PRODUCTION DATA & MOCKUP DEMO ROSTER';
PRINT '============================================================================';

-- Seed Departments
SET IDENTITY_INSERT dbo.Departments ON;
INSERT INTO dbo.Departments (DepartmentID, DepartmentCode, DepartmentName, HeadOfDepartment, Location, IsActive)
VALUES
(1, N'DEV', N'Software Development', N'Neha Singh', N'Lucknow HQ - 3rd Floor', 1),
(2, N'DES', N'Product Design', N'Rohit Sharma', N'Lucknow HQ - 3rd Floor', 1),
(3, N'HR',  N'Human Resources', N'Arun Mishra', N'Lucknow HQ - 2nd Floor', 1),
(4, N'OPS', N'Operations', N'Amit Kumar', N'Lucknow HQ - 1st Floor', 1),
(5, N'MKT', N'Marketing', N'Karan Mehta', N'Lucknow HQ - 2nd Floor', 1),
(6, N'QA',  N'Quality Assurance', N'Sneha Verma', N'Lucknow HQ - 3rd Floor', 1),
(7, N'FIN', N'Finance', N'Vikram Singh', N'Lucknow HQ - 2nd Floor', 1),
(8, N'IT',  N'IT Support', N'Anjali Gupta', N'Lucknow HQ - Ground Floor', 1);
SET IDENTITY_INSERT dbo.Departments OFF;
PRINT '>> Departments seeded.';
GO

-- Seed Designations
SET IDENTITY_INSERT dbo.Designations ON;
INSERT INTO dbo.Designations (DesignationID, DesignationTitle, StandardRole, HierarchyLevel, IsActive)
VALUES
(1, N'System Administrator', N'Admin', 4, 1),
(2, N'Developer', N'Employee', 1, 1),
(3, N'Designer', N'Employee', 1, 1),
(4, N'HR Executive', N'HR', 3, 1),
(5, N'HR Manager', N'HR', 3, 1),
(6, N'Manager', N'Manager', 2, 1),
(7, N'Associate', N'Employee', 1, 1),
(8, N'QA Engineer', N'Employee', 1, 1),
(9, N'Analyst', N'Employee', 1, 1),
(10, N'Support Engineer', N'Employee', 1, 1);
SET IDENTITY_INSERT dbo.Designations OFF;
PRINT '>> Designations seeded.';
GO

-- Seed 50 Employees
INSERT INTO dbo.Employees (
    EmployeeID, FullName, Email, PhoneNumber, Department, Designation, 
    Shift, WorkType, JoiningDate, ReportingManager, Status, Role, AvatarUrl
)
VALUES
(N'EMP000', N'Amit Singh', N'amit.singh@vorldx.com', N'+91 98765 43200', N'Administration', N'System Administrator', N'General (9AM - 6PM)', N'On-site', '2022-01-10', N'CEO', N'Active', N'Admin', N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(N'EMP001', N'Neha Singh', N'neha.singh@vorldx.com', N'+91 98765 43210', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-01-15', N'Amit Singh', N'Active', N'Employee', N'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
(N'EMP005', N'Rohit Sharma', N'rohit.sharma@vorldx.com', N'+91 98765 43214', N'Design', N'Designer', N'General (9AM - 6PM)', N'On-site', '2023-04-01', N'Neha Singh', N'Active', N'Employee', N'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(N'EMP012', N'Pooja Yadav', N'pooja.yadav@vorldx.com', N'+91 98765 43221', N'HR', N'HR Executive', N'General (9AM - 6PM)', N'On-site', '2023-08-15', N'Arun Mishra', N'Active', N'HR', N'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
(N'EMP014', N'Arun Mishra', N'arun.mishra@vorldx.com', N'+91 98765 43223', N'HR', N'HR Manager', N'General (9AM - 6PM)', N'On-site', '2022-11-01', N'Amit Singh', N'Active', N'HR', N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
(N'EMP016', N'Ritika Sharma', N'ritika.sharma@vorldx.com', N'+91 98765 43225', N'HR', N'HR Executive', N'General (9AM - 6PM)', N'On-site', '2023-10-01', N'Arun Mishra', N'Active', N'HR', N'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
(N'EMP018', N'Amit Kumar', N'amit.kumar@vorldx.com', N'+91 98765 43227', N'Operations', N'Manager', N'General (9AM - 6PM)', N'On-site', '2022-06-15', N'Amit Singh', N'Active', N'Manager', N'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
(N'EMP020', N'Karan Mehta', N'karan.mehta@vorldx.com', N'+91 98765 43229', N'Marketing', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-01-10', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),
(N'EMP022', N'Sneha Verma', N'sneha.verma@vorldx.com', N'+91 98765 43231', N'Development', N'QA Engineer', N'General (9AM - 6PM)', N'On-site', '2023-09-01', N'Neha Singh', N'Active', N'Employee', N'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
(N'EMP028', N'Vikram Singh', N'vikram.singh@vorldx.com', N'+91 98765 43237', N'Finance', N'Analyst', N'General (9AM - 6PM)', N'On-site', '2023-03-20', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
(N'EMP030', N'Anjali Gupta', N'anjali.gupta@vorldx.com', N'+91 98765 43239', N'Support', N'Support Engineer', N'General (9AM - 6PM)', N'On-site', '2024-02-01', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(N'EMP002', N'Aarav Patel', N'aarav.patel@vorldx.com', N'+91 98765 43211', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-02-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP003', N'Priya Nair', N'priya.nair@vorldx.com', N'+91 98765 43212', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-03-10', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP004', N'Rohan Iyer', N'rohan.iyer@vorldx.com', N'+91 98765 43213', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-04-15', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP006', N'Siddharth Joshi', N'siddharth.joshi@vorldx.com', N'+91 98765 43215', N'Design', N'Designer', N'General (9AM - 6PM)', N'On-site', '2023-05-20', N'Rohit Sharma', N'Active', N'Employee', NULL),
(N'EMP007', N'Ananya Rao', N'ananya.rao@vorldx.com', N'+91 98765 43216', N'Design', N'Designer', N'General (9AM - 6PM)', N'On-site', '2023-06-10', N'Rohit Sharma', N'Active', N'Employee', NULL),
(N'EMP008', N'Aditya Chopra', N'aditya.chopra@vorldx.com', N'+91 98765 43217', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-07-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP009', N'Divya Menon', N'divya.menon@vorldx.com', N'+91 98765 43218', N'Development', N'QA Engineer', N'General (9AM - 6PM)', N'On-site', '2023-07-15', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP010', N'Kabir Malhotra', N'kabir.malhotra@vorldx.com', N'+91 98765 43219', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-08-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP011', N'Meera Nambiar', N'meera.nambiar@vorldx.com', N'+91 98765 43220', N'Design', N'Designer', N'General (9AM - 6PM)', N'On-site', '2023-08-10', N'Rohit Sharma', N'Active', N'Employee', NULL),
(N'EMP013', N'Kavita Reddy', N'kavita.reddy@vorldx.com', N'+91 98765 43222', N'HR', N'HR Executive', N'General (9AM - 6PM)', N'On-site', '2023-09-15', N'Arun Mishra', N'Active', N'HR', NULL),
(N'EMP015', N'Manish Tiwari', N'manish.tiwari@vorldx.com', N'+91 98765 43224', N'HR', N'HR Executive', N'General (9AM - 6PM)', N'On-site', '2023-10-15', N'Arun Mishra', N'Active', N'HR', NULL),
(N'EMP017', N'Deepak Bhatt', N'deepak.bhatt@vorldx.com', N'+91 98765 43226', N'Operations', N'Associate', N'General (9AM - 6PM)', N'On-site', '2023-11-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP019', N'Sunil Gavaskar', N'sunil.g@vorldx.com', N'+91 98765 43228', N'Operations', N'Associate', N'General (9AM - 6PM)', N'On-site', '2023-11-20', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP021', N'Tanya Singhal', N'tanya.s@vorldx.com', N'+91 98765 43230', N'Marketing', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-01-20', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP023', N'Rakesh Pandey', N'rakesh.p@vorldx.com', N'+91 98765 43232', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2023-12-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP024', N'Shweta Tiwari', N'shweta.t@vorldx.com', N'+91 98765 43233', N'Development', N'QA Engineer', N'General (9AM - 6PM)', N'On-site', '2023-12-15', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP025', N'Mohit Chauhan', N'mohit.c@vorldx.com', N'+91 98765 43234', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2024-01-05', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP026', N'Varun Dhawan', N'varun.d@vorldx.com', N'+91 98765 43235', N'Marketing', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-02-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP027', N'Preeti Zinta', N'preeti.z@vorldx.com', N'+91 98765 43236', N'Finance', N'Analyst', N'General (9AM - 6PM)', N'On-site', '2024-03-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP029', N'Gaurav Seth', N'gaurav.s@vorldx.com', N'+91 98765 43238', N'Finance', N'Analyst', N'General (9AM - 6PM)', N'On-site', '2024-03-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP031', N'Harsh Vardhan', N'harsh.v@vorldx.com', N'+91 98765 43240', N'Support', N'Support Engineer', N'General (9AM - 6PM)', N'On-site', '2024-04-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP032', N'Bhavna Sen', N'bhavna.s@vorldx.com', N'+91 98765 43241', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2024-04-15', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP033', N'Kunal Roy', N'kunal.r@vorldx.com', N'+91 98765 43242', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2024-05-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP034', N'Pallavi Sen', N'pallavi.s@vorldx.com', N'+91 98765 43243', N'Design', N'Designer', N'General (9AM - 6PM)', N'On-site', '2024-05-15', N'Rohit Sharma', N'Active', N'Employee', NULL),
(N'EMP035', N'Naveen Jindal', N'naveen.j@vorldx.com', N'+91 98765 43244', N'Operations', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-06-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP036', N'Suman Lata', N'suman.l@vorldx.com', N'+91 98765 43245', N'Operations', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-06-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP037', N'Kartik Aryan', N'kartik.a@vorldx.com', N'+91 98765 43246', N'Marketing', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-07-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP038', N'Alia Bhatt', N'alia.b@vorldx.com', N'+91 98765 43247', N'Marketing', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-07-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP039', N'Ranbir Kapoor', N'ranbir.k@vorldx.com', N'+91 98765 43248', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2024-08-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP040', N'Katrina Kaif', N'katrina.k@vorldx.com', N'+91 98765 43249', N'Development', N'QA Engineer', N'General (9AM - 6PM)', N'On-site', '2024-08-15', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP041', N'Vicky Kaushal', N'vicky.k@vorldx.com', N'+91 98765 43250', N'Finance', N'Analyst', N'General (9AM - 6PM)', N'On-site', '2024-09-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP042', N'Sara Ali', N'sara.a@vorldx.com', N'+91 98765 43251', N'Finance', N'Analyst', N'General (9AM - 6PM)', N'On-site', '2024-09-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP043', N'Janhvi Kapoor', N'janhvi.k@vorldx.com', N'+91 98765 43252', N'Support', N'Support Engineer', N'General (9AM - 6PM)', N'On-site', '2024-10-01', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP044', N'Ishaan Khatter', N'ishaan.k@vorldx.com', N'+91 98765 43253', N'Support', N'Support Engineer', N'General (9AM - 6PM)', N'On-site', '2024-10-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP045', N'Ananya Panday', N'ananya.p@vorldx.com', N'+91 98765 43254', N'Design', N'Designer', N'General (9AM - 6PM)', N'On-site', '2024-11-01', N'Rohit Sharma', N'Active', N'Employee', NULL),
(N'EMP046', N'Tara Sutaria', N'tara.s@vorldx.com', N'+91 98765 43255', N'Development', N'Developer', N'General (9AM - 6PM)', N'On-site', '2024-11-15', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP047', N'Kiara Advani', N'kiara.a@vorldx.com', N'+91 98765 43256', N'Development', N'QA Engineer', N'General (9AM - 6PM)', N'On-site', '2024-12-01', N'Neha Singh', N'Active', N'Employee', NULL),
(N'EMP048', N'Sidharth M', N'sidharth.m@vorldx.com', N'+91 98765 43257', N'Operations', N'Associate', N'General (9AM - 6PM)', N'On-site', '2024-12-15', N'Amit Kumar', N'Active', N'Employee', NULL),
(N'EMP049', N'Rashmika M', N'rashmika.m@vorldx.com', N'+91 98765 43258', N'Marketing', N'Associate', N'General (9AM - 6PM)', N'On-site', '2025-01-05', N'Amit Kumar', N'Active', N'Employee', NULL);
PRINT '>> Master Employees (50 total) seeded.';
GO

-- Seed HR Members
INSERT INTO dbo.HR_Members (EmployeeID, FullName, Designation, AssignedWing, CanApproveWFH, CanApproveLeave, CanEditPolicies, CanExportReports)
VALUES
(N'EMP012', N'Pooja Yadav', N'HR Executive', N'Development Wing', 1, 1, 0, 1),
(N'EMP014', N'Arun Mishra', N'HR Manager', N'All Wings (Head HR)', 1, 1, 1, 1),
(N'EMP016', N'Ritika Sharma', N'HR Executive', N'Design & Operations', 1, 1, 0, 1);
PRINT '>> HR Members seeded.';
GO

-- Seed Company Policies
INSERT INTO dbo.Company_Policies (
    PolicyKey, PolicyName, Description, WorkStartTime, WorkEndTime, GracePeriodMinutes, 
    LateMarkThreshold, HalfDayMinimumHours, FullDayMinimumHours, MaxWFHDaysPerMonth, 
    AllowPastCorrectionDays, EnforceBiometrics, RequireQRLocation, AutoAbsentEnabled
)
VALUES (
    N'STANDARD_2026', 
    N'WorldX General Attendance Policy 2026',
    N'Standard corporate shift: 09:00 AM - 06:00 PM with 15 mins grace period, 4 WFH days quota.',
    '09:00:00', '18:00:00', 15, '09:15:00', 4.00, 8.00, 4, 7, 1, 1, 1
);
PRINT '>> Company Policies seeded.';
GO

-- Seed Kiosks
INSERT INTO dbo.Kiosk_Displays (KioskCode, DeviceName, Location, IpAddress, Status, SecretKey)
VALUES
(N'QR001', N'Main Lobby Kiosk A', N'Ground Floor - Main Gate', N'192.168.1.101', N'Online', N'SEC_KIOSK_LOBBY_A99'),
(N'QR002', N'Floor 2 Tech Wing Kiosk', N'2nd Floor - Tech Elevator Lobby', N'192.168.1.102', N'Online', N'SEC_KIOSK_FL2_TECH'),
(N'QR003', N'Floor 3 Executive Kiosk', N'3rd Floor - Boardroom Entrance', N'192.168.1.103', N'Online', N'SEC_KIOSK_FL3_EXEC');
PRINT '>> Kiosk Displays seeded.';
GO

-- Seed Attendance Records matching exact Admin Dashboard KPIs:
-- Total 50 Employees | 32 Present | 8 WFH | 5 Leave | 5 Absent
DECLARE @T DATE = CAST(SYSDATETIME() AS DATE);

-- 32 Present (Arrival, Departure, Duration)
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, PunchInTime, PunchOutTime, DurationMinutes, Status, Mode, Location, LateMinutes)
VALUES
(N'EMP000', @T, '08:52:00', '18:02:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP001', @T, '09:02:00', '18:05:00', 543, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP002', @T, '08:55:00', '18:00:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP003', @T, '08:48:00', '17:58:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP004', @T, '09:10:00', '18:15:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP005', @T, '09:22:00', '18:25:00', 543, N'Present', N'QR Kiosk', N'Lucknow HQ', 7),
(N'EMP006', @T, '09:05:00', '18:10:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP007', @T, '09:00:00', '18:02:00', 542, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP008', @T, '08:50:00', '18:00:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP009', @T, '08:59:00', '18:05:00', 546, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP010', @T, '09:12:00', '18:18:00', 546, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP011', @T, '09:01:00', '18:04:00', 543, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP012', @T, '08:45:00', '17:55:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP014', @T, '08:50:00', '18:05:00', 555, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP016', @T, '08:58:00', '18:08:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP018', @T, '09:00:00', '18:10:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP019', @T, '09:05:00', '18:05:00', 540, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP020', @T, '09:14:00', '18:20:00', 546, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP022', @T, '08:57:00', '18:02:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP023', @T, '09:03:00', '18:08:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP024', @T, '09:08:00', '18:12:00', 544, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP025', @T, '08:56:00', '18:00:00', 544, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP026', @T, '09:11:00', '18:15:00', 544, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP028', @T, '08:51:00', '18:01:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP029', @T, '09:04:00', '18:06:00', 542, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP030', @T, '08:49:00', '17:59:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP031', @T, '08:55:00', '18:05:00', 550, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP032', @T, '09:07:00', '18:10:00', 543, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP033', @T, '09:02:00', '18:07:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP034', @T, '08:58:00', '18:02:00', 544, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP035', @T, '09:00:00', '18:05:00', 545, N'Present', N'QR Kiosk', N'Lucknow HQ', 0),
(N'EMP036', @T, '08:54:00', '18:00:00', 546, N'Present', N'QR Kiosk', N'Lucknow HQ', 0);

-- 8 WFH
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, PunchInTime, PunchOutTime, DurationMinutes, Status, Mode, Location, LateMinutes)
VALUES
(N'EMP013', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP015', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP017', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP021', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP027', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP037', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP038', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0),
(N'EMP039', @T, '09:00:00', '18:00:00', 540, N'WFH', N'Remote Mobile Portal', N'Work From Home - Lucknow', 0);

-- 5 Leave
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, PunchInTime, PunchOutTime, DurationMinutes, Status, Mode, Location, LateMinutes)
VALUES
(N'EMP040', @T, NULL, NULL, 0, N'Leave', N'LEAVE_APPROVAL', N'On Leave', 0),
(N'EMP041', @T, NULL, NULL, 0, N'Leave', N'LEAVE_APPROVAL', N'On Leave', 0),
(N'EMP042', @T, NULL, NULL, 0, N'Leave', N'LEAVE_APPROVAL', N'On Leave', 0),
(N'EMP043', @T, NULL, NULL, 0, N'Leave', N'LEAVE_APPROVAL', N'On Leave', 0),
(N'EMP044', @T, NULL, NULL, 0, N'Leave', N'LEAVE_APPROVAL', N'On Leave', 0);
-- Remaining 5 (EMP045 to EMP049) have no record today => Absent (Calculated = 5)
PRINT '>> Attendance records seeded (32 Present, 8 WFH, 5 Leave, 5 Absent).';
GO

-- Seed WFH Requests
INSERT INTO dbo.WFH_Requests (EmployeeID, RequestDate, Reason, ContactNumber, WorkDeliverables, Status, ReviewedBy, ReviewerComment)
VALUES
(N'EMP001', CAST(DATEADD(DAY, 1, SYSDATETIME()) AS DATE), N'Family function in Varanasi', N'+91 98765 43210', N'Complete Vite frontend integration and PR review', N'Pending', NULL, NULL),
(N'EMP005', CAST(DATEADD(DAY, 2, SYSDATETIME()) AS DATE), N'Home internet line upgrade technician visit', N'+91 98765 43214', N'Finalize Figma mockups for Admin Portal', N'Pending', NULL, NULL),
(N'EMP020', CAST(DATEADD(DAY, 1, SYSDATETIME()) AS DATE), N'Mild viral recovery', N'+91 98765 43229', N'Weekly marketing metrics analysis and slide deck', N'Approved', N'Arun Mishra', N'Take care and stay connected on Slack.'),
(N'EMP028', CAST(DATEADD(DAY, 3, SYSDATETIME()) AS DATE), N'Personal errand morning hours', N'+91 98765 43237', N'GST reconciliation and ledger balancing', N'Rejected', N'Arun Mishra', N'Month-end finance closing requires on-site presence.'),
(N'EMP012', CAST(DATEADD(DAY, 4, SYSDATETIME()) AS DATE), N'HR recruitment drive remote calls', N'+91 98765 43221', N'Conduct 6 candidate phone screens', N'Approved', N'Arun Mishra', N'Approved for virtual hiring rounds.');
PRINT '>> WFH Requests seeded.';
GO

-- Seed Leave Requests
INSERT INTO dbo.Leave_Requests (EmployeeID, LeaveType, FromDate, ToDate, TotalDays, Reason, Status, ReviewedBy, ReviewerComment)
VALUES
(N'EMP001', N'Casual', CAST(DATEADD(DAY, 5, SYSDATETIME()) AS DATE), CAST(DATEADD(DAY, 6, SYSDATETIME()) AS DATE), 2.0, N'Sister wedding ceremonies', N'Pending', NULL, NULL),
(N'EMP022', N'Sick', CAST(SYSDATETIME() AS DATE), CAST(DATEADD(DAY, 1, SYSDATETIME()) AS DATE), 2.0, N'Doctor advised bed rest for severe sprain', N'Approved', N'Pooja Yadav', N'Rest well, medical certificate noted.'),
(N'EMP030', N'Earned', CAST(DATEADD(DAY, 10, SYSDATETIME()) AS DATE), CAST(DATEADD(DAY, 14, SYSDATETIME()) AS DATE), 5.0, N'Annual vacation with family', N'Approved', N'Arun Mishra', N'Approved, handover given to Kunal Roy.'),
(N'EMP014', N'Casual', CAST(DATEADD(DAY, 8, SYSDATETIME()) AS DATE), CAST(DATEADD(DAY, 8, SYSDATETIME()) AS DATE), 1.0, N'Personal work at Lucknow municipal office', N'Approved', N'Amit Singh', N'Approved.');
PRINT '>> Leave Requests seeded.';
GO

-- Seed Announcements
INSERT INTO dbo.Announcements (Title, BodyContent, Category, TargetAudience, CreatedBy, IsPinned)
VALUES
(N'Diwali Holiday Schedule 2026', N'Office will remain closed on 28th and 29th October for Diwali celebrations. Normal work resumes on Monday.', N'Holiday', N'All', N'Arun Mishra', 1),
(N'New Biometric QR Kiosks Deployed', N'New fast QR check-in kiosks QR001 and QR002 are now operational on Ground Floor and 2nd Floor.', N'Operations', N'All', N'Amit Singh', 1),
(N'Q4 Town Hall & Employee Recognition', N'Join us this Friday at 4:30 PM in the 3rd floor cafeteria for quarterly recognition and refreshments.', N'Event', N'All', N'Pooja Yadav', 0);
PRINT '>> Announcements seeded.';
GO

-- Seed Audit Logs
INSERT INTO dbo.Audit_Logs (Actor, Action, TargetEntity, Details)
VALUES
(N'System', N'INITIALIZE', N'Database', N'WorldX Attendance 360 database initialized successfully on Microsoft SQL Server.'),
(N'Amit Singh', N'POLICY_UPDATE', N'Company_Policies', N'Set shift hours 09:00 AM - 06:00 PM with 15m grace period and biometrics enforced.'),
(N'Arun Mishra', N'WFH_APPROVE', N'WFH_Requests', N'Approved WFH Request #3 for Karan Mehta.'),
(N'Pooja Yadav', N'LEAVE_APPROVE', N'Leave_Requests', N'Approved Sick Leave Request #2 for Sneha Verma.');
PRINT '>> Audit Logs seeded.';
GO

PRINT '============================================================================';
PRINT 'STEP 5: VERIFICATION SUMMARY (DASHBOARD KPIs CHECK)';
PRINT '============================================================================';
SELECT * FROM dbo.vw_AdminDashboardKPIs;
GO

PRINT '----------------------------------------------------------------------------';
PRINT 'STEP 5.1: PRESENT EMPLOYEES REGISTER (NAME, ID, DATE, ARRIVAL, DEPARTURE)';
PRINT '----------------------------------------------------------------------------';
SELECT EmployeeName, EmployeeID, [Date], ArrivalTime, DepartureTime, TotalHours, Status, Department 
FROM dbo.vw_PresentEmployees
ORDER BY ArrivalTime ASC;
GO

PRINT '============================================================================';
PRINT '>> [SUCCESS] WorldX Attendance 360 complete SQL Server master setup finished!';
PRINT '============================================================================';
GO
