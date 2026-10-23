-- ============================================================================
-- WorldX Attendance 360 (VorldX Industries Pvt Ltd)
-- COMPLETE SEED DATA SCRIPT FOR MICROSOFT SQL SERVER (T-SQL)
-- Matches all 7 Admin Portal Screens & 6 Employee Portal Screens
-- ============================================================================

USE [WorldX_Attendance360];
GO

SET NOCOUNT ON;
PRINT '>> Loading Seed Data into [WorldX_Attendance360]...';

-- ============================================================================
-- 1. Seed Departments
-- ============================================================================
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
PRINT '>> [Departments] seeded with 8 departments.';
GO

-- ============================================================================
-- 2. Seed Designations
-- ============================================================================
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
PRINT '>> [Designations] seeded with 10 job roles.';
GO

-- ============================================================================
-- 3. Seed Master Employees (Mockup exact roster + full 50 employee directory)
-- ============================================================================
INSERT INTO dbo.Employees (
    EmployeeID, FullName, Email, PhoneNumber, Department, Designation, 
    Shift, WorkType, JoiningDate, ReportingManager, Status, Role, AvatarUrl
)
VALUES
-- Super Admin
(N'EMP000', N'Amit Singh', N'amit.singh@vorldx.com', N'+91 9876543200', N'Software Development', N'System Administrator', N'General (09:00 AM - 06:00 PM)', N'Office', '2023-01-01', N'Management Board', N'Active', N'Admin', N'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'),

-- Mockup Screen 2 Employees
(N'EMP001', N'Neha Singh', N'neha.singh@vorldx.com', N'+91 9876543201', N'Software Development', N'Developer', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-01-10', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256'),
(N'EMP005', N'Rohit Sharma', N'rohit.sharma@vorldx.com', N'+91 9876543205', N'Product Design', N'Designer', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-02-12', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256'),
(N'EMP012', N'Pooja Yadav', N'pooja.yadav@vorldx.com', N'+91 9876543212', N'Human Resources', N'HR Executive', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-03-01', N'Arun Mishra', N'Active', N'HR', N'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256'),
(N'EMP014', N'Arun Mishra', N'arun.mishra@vorldx.com', N'+91 9876543214', N'Human Resources', N'HR Manager', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-03-15', N'Amit Singh', N'Active', N'HR', N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256'),
(N'EMP016', N'Ritika Sharma', N'ritika.sharma@vorldx.com', N'+91 9876543216', N'Human Resources', N'HR Executive', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-04-01', N'Arun Mishra', N'Inactive', N'HR', N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256'),
(N'EMP018', N'Amit Kumar', N'amit.kumar@vorldx.com', N'+91 9876543218', N'Operations', N'Manager', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-04-15', N'Amit Singh', N'Active', N'Manager', N'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256'),
(N'EMP020', N'Karan Mehta', N'karan.mehta@vorldx.com', N'+91 9876543220', N'Marketing', N'Associate', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-05-01', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256'),
(N'EMP022', N'Sneha Verma', N'sneha.verma@vorldx.com', N'+91 9876543210', N'Quality Assurance', N'QA Engineer', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-05-20', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'),
(N'EMP028', N'Vikram Singh', N'vikram.singh@vorldx.com', N'+91 9876543228', N'Finance', N'Analyst', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-06-11', N'Amit Singh', N'Inactive', N'Employee', N'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256'),
(N'EMP030', N'Anjali Gupta', N'anjali.gupta@vorldx.com', N'+91 9876543230', N'IT Support', N'Support Engineer', N'General (09:00 AM - 06:00 PM)', N'Office', '2024-07-25', N'Amit Kumar', N'Active', N'Employee', N'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256');

-- Insert additional 39 staff members across departments to reach 50 active employees
DECLARE @i INT = 31;
DECLARE @dept NVARCHAR(100), @desig NVARCHAR(100);

WHILE @i <= 69
BEGIN
    SET @dept = CASE @i % 5 
        WHEN 0 THEN N'Software Development'
        WHEN 1 THEN N'Product Design'
        WHEN 2 THEN N'Operations'
        WHEN 3 THEN N'Marketing'
        ELSE N'Quality Assurance'
    END;

    SET @desig = CASE @i % 5 
        WHEN 0 THEN N'Developer'
        WHEN 1 THEN N'Designer'
        WHEN 2 THEN N'Operations Associate'
        WHEN 3 THEN N'Marketing Associate'
        ELSE N'QA Engineer'
    END;

    INSERT INTO dbo.Employees (
        EmployeeID, FullName, Email, PhoneNumber, Department, Designation, 
        Shift, WorkType, JoiningDate, ReportingManager, Status, Role, AvatarUrl
    )
    VALUES (
        N'EMP0' + CAST(@i AS NVARCHAR(10)),
        N'Staff Member ' + CAST(@i AS NVARCHAR(10)),
        N'staff' + CAST(@i AS NVARCHAR(10)) + N'@vorldx.com',
        N'+91 98765432' + CAST(@i AS NVARCHAR(10)),
        @dept,
        @desig,
        N'General (09:00 AM - 06:00 PM)',
        N'Office',
        '2024-08-01',
        N'Amit Kumar',
        N'Active',
        N'Employee',
        N'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256'
    );

    SET @i = @i + 1;
END;

PRINT '>> [Employees] seeded with 50 total records.';
GO

-- ============================================================================
-- 4. Seed HR Members (Screen 5 of Admin Portal)
-- ============================================================================
SET IDENTITY_INSERT dbo.HR_Members ON;

INSERT INTO dbo.HR_Members (HRMemberID, EmployeeID, FullName, Role, Department, Email, Status)
VALUES
(1, N'EMP012', N'Pooja Yadav', N'HR Executive', N'Human Resources', N'pooja@vorldx.com', N'Active'),
(2, N'EMP014', N'Arun Mishra', N'HR Manager', N'Human Resources', N'arun@vorldx.com', N'Active'),
(3, N'EMP016', N'Ritika Sharma', N'HR Executive', N'Human Resources', N'ritika@vorldx.com', N'Inactive');

SET IDENTITY_INSERT dbo.HR_Members OFF;
PRINT '>> [HR_Members] seeded with 3 HR team records.';
GO

-- ============================================================================
-- 5. Seed Company Policies (Screen 6 of Admin Portal)
-- ============================================================================
SET IDENTITY_INSERT dbo.Company_Policies ON;

INSERT INTO dbo.Company_Policies (
    PolicyID, CompanyName, CIN, Headquarters, 
    OfficeStartTime, OfficeEndTime, HalfDayThresholdHours, LateMarkAfter, 
    GracePeriodMinutes, WorkingDays, MaxWFHDaysPerMonth, QRRotationSeconds, 
    EnableQRAttendance, AllowAttendanceCorrection, AutoMarkAbsentIfNotCheckedIn, IsActive
)
VALUES (
    1, 
    N'VorldX Industries Private Limited', 
    N'U62099UP2026PTC245598', 
    N'Lucknow HQ, Uttar Pradesh, India',
    '09:00:00', 
    '18:00:00', 
    4.0, 
    '09:15:00', 
    15, 
    N'Mon - Fri', 
    4, 
    45, 
    1, 
    1, 
    1, 
    1
);

SET IDENTITY_INSERT dbo.Company_Policies OFF;
PRINT '>> [Company_Policies] seeded with Attendance & WFH parameters.';
GO

-- ============================================================================
-- 6. Seed Attendance Records for Today (Matches 32 Present, 8 WFH, 5 Leave, 5 Absent)
-- ============================================================================
DECLARE @Today DATE = CAST(SYSDATETIME() AS DATE);

-- 32 Present Today
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, CheckInTime, CheckOutTime, DurationMinutes, Status, Mode, Location, LateByMinutes)
SELECT TOP 32
    EmployeeID,
    @Today,
    '09:05:00',
    '17:30:00',
    505,
    N'Present',
    N'QR_SCAN',
    N'Office (via QR)',
    0
FROM dbo.Employees
WHERE Status = N'Active' AND Role != N'Admin'
ORDER BY EmployeeID;

-- 8 WFH Today
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, CheckInTime, CheckOutTime, DurationMinutes, Status, Mode, Location)
SELECT 
    EmployeeID,
    @Today,
    '09:00:00',
    '18:00:00',
    540,
    N'WFH',
    N'REMOTE_APPROVAL',
    N'Remote (WFH)'
FROM dbo.Employees
WHERE Status = N'Active' 
  AND EmployeeID NOT IN (SELECT EmployeeID FROM dbo.Attendance WHERE AttendanceDate = @Today)
ORDER BY EmployeeID
OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY;

-- 5 Leave Today
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, CheckInTime, CheckOutTime, DurationMinutes, Status, Mode, Location)
SELECT 
    EmployeeID,
    @Today,
    NULL,
    NULL,
    0,
    N'Leave',
    N'LEAVE_APPROVAL',
    N'On Leave'
FROM dbo.Employees
WHERE Status = N'Active' 
  AND EmployeeID NOT IN (SELECT EmployeeID FROM dbo.Attendance WHERE AttendanceDate = @Today)
ORDER BY EmployeeID
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;

-- 5 Absent Today
INSERT INTO dbo.Attendance (EmployeeID, AttendanceDate, CheckInTime, CheckOutTime, DurationMinutes, Status, Mode, Location)
SELECT 
    EmployeeID,
    @Today,
    NULL,
    NULL,
    0,
    N'Absent',
    N'AUTOMATIC',
    N'N/A'
FROM dbo.Employees
WHERE Status = N'Active' 
  AND EmployeeID NOT IN (SELECT EmployeeID FROM dbo.Attendance WHERE AttendanceDate = @Today)
ORDER BY EmployeeID
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;

-- Ensure Sneha Verma (EMP001/EMP022) has check-in for dashboard:
IF EXISTS (SELECT 1 FROM dbo.Attendance WHERE EmployeeID = N'EMP001' AND AttendanceDate = @Today)
BEGIN
    UPDATE dbo.Attendance 
    SET CheckInTime = '09:05:00', CheckOutTime = '17:30:00', Status = N'Present', Location = N'Office (via QR)'
    WHERE EmployeeID = N'EMP001' AND AttendanceDate = @Today;
END

PRINT '>> [Attendance] seeded for today (32 Present, 8 WFH, 5 Leave, 5 Absent).';
GO

-- ============================================================================
-- 7. Seed WFH Requests (Screen 3 of Admin Portal & Screen 3 of Employee Portal)
-- ============================================================================
SET IDENTITY_INSERT dbo.WFH_Requests ON;

INSERT INTO dbo.WFH_Requests (
    RequestID, EmployeeID, EmployeeName, Department, RequestDate, 
    FromDate, ToDate, TotalDays, Reason, Status, RequesterRole, ApproverRole, 
    ReviewedBy, ReviewedAt, AppliedOn
)
VALUES
(1, N'EMP001', N'Neha Singh', N'Software Dev', '2026-10-14', '2026-10-14', '2026-10-14', 1, N'Family function', N'Pending', N'Employee', N'HR', NULL, NULL, '2026-10-12'),
(2, N'EMP005', N'Rohit Sharma', N'Product Design', '2026-10-13', '2026-10-13', '2026-10-13', 1, N'Personal work', N'Pending', N'Employee', N'HR', NULL, NULL, '2026-10-11'),
(3, N'EMP012', N'Pooja Yadav', N'HR', '2026-10-12', '2026-10-12', '2026-10-12', 1, N'Health issue', N'Pending', N'HR', N'Admin', NULL, NULL, '2026-10-10'),
(4, N'EMP020', N'Karan Mehta', N'Marketing', '2026-10-10', '2026-10-10', '2026-10-10', 1, N'Family commitment', N'Approved', N'Employee', N'HR', N'Amit Singh (Admin)', '2026-10-11', '2026-10-09'),
(5, N'EMP030', N'Anjali Gupta', N'IT Support', '2026-10-08', '2026-10-08', '2026-10-08', 1, N'Official work', N'Rejected', N'Employee', N'HR', N'Amit Singh (Admin)', '2026-10-09', '2026-10-07'),

-- HR's Own Request
(6, N'EMP012', N'Pooja Yadav', N'Human Resources', '2026-10-14', '2026-10-14', '2026-10-14', 1, N'Doctor appointment', N'Pending', N'HR', N'Admin', NULL, NULL, '2026-10-12');

SET IDENTITY_INSERT dbo.WFH_Requests OFF;
PRINT '>> [WFH_Requests] seeded with 6 requests.';
GO

-- ============================================================================
-- 8. Seed Leave Requests (Screen 4 of Admin Portal & Screen 4 of Employee Portal)
-- ============================================================================
SET IDENTITY_INSERT dbo.Leave_Requests ON;

INSERT INTO dbo.Leave_Requests (
    LeaveID, EmployeeID, EmployeeName, Department, LeaveType, 
    FromDate, ToDate, TotalDays, Reason, Status, RequesterRole, ApproverRole, 
    ReviewedBy, ReviewedAt, AppliedOn
)
VALUES
(1, N'EMP005', N'Rohit Sharma', N'Product Design', N'Casual Leave', '2026-10-14', '2026-10-15', 2, N'Personal work', N'Pending', N'Employee', N'HR', NULL, NULL, '2026-10-12'),
(2, N'EMP012', N'Pooja Yadav', N'HR', N'Sick Leave', '2026-10-12', '2026-10-12', 1, N'Fever', N'Pending', N'HR', N'Admin', NULL, NULL, '2026-10-11'),
(3, N'EMP001', N'Neha Singh', N'Software Dev', N'Earned Leave', '2026-10-05', '2026-10-07', 3, N'Family vacation', N'Approved', N'Employee', N'HR', N'Amit Singh (Admin)', '2026-10-04', '2026-10-01'),
(4, N'EMP018', N'Amit Kumar', N'Operations', N'Casual Leave', '2026-09-28', '2026-09-29', 2, N'Personal', N'Approved', N'Manager', N'Admin', N'Amit Singh (Admin)', '2026-09-27', '2026-09-25'),
(5, N'EMP020', N'Karan Mehta', N'Marketing', N'Sick Leave', '2026-09-20', '2026-09-20', 1, N'Health issue', N'Rejected', N'Employee', N'HR', N'Amit Singh (Admin)', '2026-09-21', '2026-09-19'),

-- HR's Own Leave
(6, N'EMP014', N'Arun Mishra', N'Human Resources', N'Casual Leave', '2026-10-10', '2026-10-10', 1, N'Personal', N'Approved', N'HR', N'Admin', N'Amit Singh (Admin)', '2026-10-09', '2026-10-08');

SET IDENTITY_INSERT dbo.Leave_Requests OFF;
PRINT '>> [Leave_Requests] seeded with 6 requests.';
GO

-- ============================================================================
-- 9. Seed Announcements (Screen 9 of Admin Portal)
-- ============================================================================
SET IDENTITY_INSERT dbo.Announcements ON;

INSERT INTO dbo.Announcements (AnnouncementID, Title, Content, Priority, Tag, AuthorName, AuthorRole, PublishedDate, IsActive)
VALUES
(1, N'Diwali Holiday Schedule & Office Closure', N'The corporate office will remain closed from October 31 to November 03, 2026. All critical server maintenance will be handled remotely.', N'High Priority', N'Holiday Notice', N'Amit Singh', N'Admin', '2026-10-16', 1),
(2, N'New WFH Approval Guidelines (Effective Nov 1)', N'Employees can submit WFH requests up to 48 hours in advance through the VorldX mobile app. Urgent sick leaves must be accompanied by manager acknowledgment.', N'Policy Update', N'HR Notice', N'Arun Mishra', N'HR Manager', '2026-10-14', 1);

SET IDENTITY_INSERT dbo.Announcements OFF;
PRINT '>> [Announcements] seeded.';
GO

-- ============================================================================
-- 10. Seed Audit Logs (Recent Activities in Admin Portal)
-- ============================================================================
SET IDENTITY_INSERT dbo.Audit_Logs ON;

INSERT INTO dbo.Audit_Logs (LogID, Actor, Action, Details, LoggedAt)
VALUES
(1, N'Amit Singh (Admin)', N'POLICY_UPDATE', N'Updated attendance grace period to 15 minutes', '2026-10-16 11:42:00'),
(2, N'Amit Singh (Admin)', N'WFH_APPROVED', N'Approved Rohit Sharma (EMP005) WFH request for 13 Oct 2026', '2026-10-16 11:20:00'),
(3, N'Pooja Yadav (HR)', N'LEAVE_REJECT', N'Rejected leave request for Karan Mehta (EMP020) - Personal reason', '2026-10-16 10:45:00'),
(4, N'System AutoMark', N'ABSENT_MARK', N'Marked 5 employees absent due to missed cutoff threshold', '2026-10-16 09:15:00'),
(5, N'Amit Singh (Admin)', N'EMPLOYEE_CREATE', N'Added new employee Neha Singh (EMP001) - Software Developer', '2026-10-16 09:00:00');

SET IDENTITY_INSERT dbo.Audit_Logs OFF;
PRINT '>> [Audit_Logs] seeded.';
GO

-- ============================================================================
-- 11. Seed Kiosk Displays
-- ============================================================================
INSERT INTO dbo.Kiosk_Displays (KioskID, KioskName, Location, Status, CurrentToken, TokenGeneratedAt, TokenExpiresAt)
VALUES
(N'QR001', N'Main Reception Terminal 1', N'Lucknow HQ - Ground Floor Entrance', N'Online', N'VX-TOKEN-948271', SYSDATETIME(), DATEADD(SECOND, 45, SYSDATETIME())),
(N'QR002', N'Floor 2 HR Lobby Terminal', N'Lucknow HQ - 2nd Floor Elevator Lobby', N'Online', N'VX-TOKEN-284719', SYSDATETIME(), DATEADD(SECOND, 45, SYSDATETIME())),
(N'QR003', N'Floor 3 Engineering Terminal', N'Lucknow HQ - 3rd Floor Cafeteria', N'Online', N'VX-TOKEN-739102', SYSDATETIME(), DATEADD(SECOND, 45, SYSDATETIME()));

PRINT '>> [Kiosk_Displays] seeded.';
GO

PRINT '========================================================================';
PRINT '>> SUCCESS: Complete WorldX Attendance 360 database loaded on SQL Server!';
PRINT '========================================================================';
GO
