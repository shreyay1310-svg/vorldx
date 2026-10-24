-- ============================================================================
-- VorldX Attendance 360 - COMPLETE HR PORTAL ALL-MODULES DATABASE SCRIPT
-- Target: Microsoft SQL Server (SSMS) 2016, 2019, 2022 & Azure SQL
-- HR Modules Covered:
--   1. HR Core Master: Departments (Engineering, HR, Marketing, Sales, Finance, Support)
--   2. HR Core Master: Designations & Pay Scales
--   3. HR Core Master: Corporate Work Locations & Delivery Centers
--   4. HR Core Master: Work Shifts, Durations & Grace Timings
--   5. HR Calendar: Gazetted & National Company Holidays
--   6. Recruitment Module: Job Vacancies & Openings
--   7. Recruitment Module: Candidate Applicants, Resume Scoring & Hiring Stages
--   8. Performance Module: Employee OKRs & Goals Tracking
--   9. Performance Module: Quarterly Performance Reviews & Manager Ratings
--  10. Performance Module: Annual Appraisals & Salary Hike Approvals
--  11. L&D Module: Training & Development Programs
--  12. Payroll Module: Monthly Salary Disbursals, HRA, PF & Deductions
--  13. Policy Governance: Corporate HR Policies & Compliance
--  14. HR Activity Logs: Live Audit Trail of HR Actions
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

-- 2. Drop existing tables if re-running
IF OBJECT_ID(N'dbo.HR_Activity_Logs', N'U') IS NOT NULL DROP TABLE dbo.HR_Activity_Logs;
IF OBJECT_ID(N'dbo.HR_Payroll_Batches', N'U') IS NOT NULL DROP TABLE dbo.HR_Payroll_Batches;
IF OBJECT_ID(N'dbo.HR_Training_Programs', N'U') IS NOT NULL DROP TABLE dbo.HR_Training_Programs;
IF OBJECT_ID(N'dbo.HR_Appraisals', N'U') IS NOT NULL DROP TABLE dbo.HR_Appraisals;
IF OBJECT_ID(N'dbo.HR_Performance_Reviews', N'U') IS NOT NULL DROP TABLE dbo.HR_Performance_Reviews;
IF OBJECT_ID(N'dbo.HR_Performance_Goals', N'U') IS NOT NULL DROP TABLE dbo.HR_Performance_Goals;
IF OBJECT_ID(N'dbo.HR_Job_Applicants', N'U') IS NOT NULL DROP TABLE dbo.HR_Job_Applicants;
IF OBJECT_ID(N'dbo.HR_Job_Openings', N'U') IS NOT NULL DROP TABLE dbo.HR_Job_Openings;
IF OBJECT_ID(N'dbo.HR_Company_Policies', N'U') IS NOT NULL DROP TABLE dbo.HR_Company_Policies;
IF OBJECT_ID(N'dbo.HR_Company_Holidays', N'U') IS NOT NULL DROP TABLE dbo.HR_Company_Holidays;
IF OBJECT_ID(N'dbo.HR_Shifts', N'U') IS NOT NULL DROP TABLE dbo.HR_Shifts;
IF OBJECT_ID(N'dbo.HR_Work_Locations', N'U') IS NOT NULL DROP TABLE dbo.HR_Work_Locations;
IF OBJECT_ID(N'dbo.HR_Designations', N'U') IS NOT NULL DROP TABLE dbo.HR_Designations;
IF OBJECT_ID(N'dbo.HR_Departments', N'U') IS NOT NULL DROP TABLE dbo.HR_Departments;
GO

PRINT '============================================================================';
PRINT 'STEP 1: CREATING ALL HR PORTAL MODULE TABLES';
PRINT '============================================================================';

-- ----------------------------------------------------------------------------
-- MODULE 1: HR Departments
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Departments (
    DepartmentID INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
    HeadOfDepartment NVARCHAR(100) NOT NULL,
    StaffCount INT DEFAULT 0 NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 2: HR Designations & Standard Pay Scales
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Designations (
    DesignationID INT IDENTITY(1,1) PRIMARY KEY,
    DesignationTitle NVARCHAR(100) NOT NULL UNIQUE,
    Department NVARCHAR(100) NOT NULL,
    StaffCount INT DEFAULT 1 NOT NULL,
    PayScaleRange NVARCHAR(100) DEFAULT N'₹40,000 - ₹80,000' NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 3: Work Locations & Regional Delivery Hubs
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Work_Locations (
    LocationID INT IDENTITY(1,1) PRIMARY KEY,
    LocationName NVARCHAR(150) NOT NULL UNIQUE,
    AddressLine NVARCHAR(255) NOT NULL,
    StaffCount INT DEFAULT 10 NOT NULL,
    LocationType NVARCHAR(50) DEFAULT N'Regional Hub' NOT NULL, -- 'Primary Office', 'Regional Hub', 'Development Hub', 'Virtual'
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 4: Work Shifts, Durations & Grace Periods
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Shifts (
    ShiftID INT IDENTITY(1,1) PRIMARY KEY,
    ShiftName NVARCHAR(100) NOT NULL UNIQUE,
    Timings NVARCHAR(50) NOT NULL,                           -- e.g. '09:00 AM - 06:00 PM'
    DurationHours NVARCHAR(30) DEFAULT N'9 Hours' NOT NULL,
    LunchBreakMinutes NVARCHAR(30) DEFAULT N'60 Min' NOT NULL,
    GracePeriodMinutes NVARCHAR(30) DEFAULT N'15 Min' NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 5: Company Holidays (Gazetted & National)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Company_Holidays (
    HolidayID INT IDENTITY(1,1) PRIMARY KEY,
    HolidayName NVARCHAR(150) NOT NULL,
    HolidayDate DATE NOT NULL,
    DayOfWeek NVARCHAR(30) NOT NULL,
    HolidayType NVARCHAR(50) DEFAULT N'Gazetted Holiday' NOT NULL, -- 'Gazetted Holiday', 'National Holiday', 'Restricted'
    Status NVARCHAR(30) DEFAULT N'Upcoming' NOT NULL,             -- 'Upcoming', 'Passed'
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 6: Recruitment - Job Openings
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Job_Openings (
    JobID INT IDENTITY(1,1) PRIMARY KEY,
    JobTitle NVARCHAR(150) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    ExperienceRequired NVARCHAR(50) DEFAULT N'2-4 Years' NOT NULL,
    JobType NVARCHAR(50) DEFAULT N'Full-time' NOT NULL,
    Location NVARCHAR(150) DEFAULT N'Bangalore / Hybrid' NOT NULL,
    OpeningsCount INT DEFAULT 1 NOT NULL,
    ApplicationsCount INT DEFAULT 0 NOT NULL,
    Status NVARCHAR(30) DEFAULT N'open' NOT NULL,               -- 'open', 'screening', 'interview', 'closed'
    PublishedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 7: Recruitment - Candidate Applicants & Pipeline
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Job_Applicants (
    ApplicantID INT IDENTITY(1,1) PRIMARY KEY,
    JobID INT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Experience NVARCHAR(50) NOT NULL,
    AssessmentScore NVARCHAR(20) DEFAULT N'85%' NOT NULL,
    HiringStage NVARCHAR(50) DEFAULT N'Screening' NOT NULL,    -- 'Screening', 'Shortlisted', 'Interview', 'Hired', 'Rejected'
    AppliedForRole NVARCHAR(150) NOT NULL,
    AppliedDate DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Applicants_Job FOREIGN KEY (JobID) 
        REFERENCES dbo.HR_Job_Openings (JobID) ON DELETE SET NULL
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 8: Performance - Goals & Objectives (OKRs)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Performance_Goals (
    GoalID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeName NVARCHAR(150) NOT NULL,
    EmployeeID NVARCHAR(50) NULL,
    GoalTitle NVARCHAR(255) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    TargetDate DATE NOT NULL,
    TargetMetric NVARCHAR(MAX) NULL,
    ProgressPercent INT DEFAULT 0 NOT NULL,
    Status NVARCHAR(50) DEFAULT N'In Progress' NOT NULL        -- 'In Progress', 'Near Completion', 'Completed'
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 9: Performance - Quarterly Reviews & Appraisals
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Performance_Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeName NVARCHAR(150) NOT NULL,
    ReviewPeriod NVARCHAR(50) NOT NULL,                        -- e.g. 'Q3 2026'
    ReviewerName NVARCHAR(100) NOT NULL,
    SelfScore NVARCHAR(30) DEFAULT N'4.5 / 5.0' NOT NULL,
    ManagerScore NVARCHAR(30) DEFAULT N'4.5 / 5.0' NOT NULL,
    FinalRating NVARCHAR(50) DEFAULT N'Excellent (4.55)' NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Completed' NOT NULL
);
GO

CREATE TABLE dbo.HR_Appraisals (
    AppraisalID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeName NVARCHAR(150) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    CurrentSalary NVARCHAR(50) NOT NULL,                       -- e.g. '₹8,50,000'
    HikePercent NVARCHAR(20) NOT NULL,                         -- e.g. '15%'
    RevisedSalary NVARCHAR(50) NOT NULL,                       -- e.g. '₹9,77,500'
    Rating NVARCHAR(50) NOT NULL,                              -- 'Excellent', 'Good', 'Needs Improvement'
    Status NVARCHAR(50) DEFAULT N'Pending Approval' NOT NULL   -- 'Pending Approval', 'Approved'
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 10: Training & Development Programs (L&D)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Training_Programs (
    TrainingID INT IDENTITY(1,1) PRIMARY KEY,
    ProgramTitle NVARCHAR(200) NOT NULL,
    Category NVARCHAR(50) DEFAULT N'Soft Skills' NOT NULL,      -- 'Soft Skills', 'Technical', 'Compliance'
    ScheduledDate NVARCHAR(50) NOT NULL,
    ParticipantsCount INT DEFAULT 25 NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Upcoming' NOT NULL,           -- 'Upcoming', 'Completed'
    TrainerName NVARCHAR(100) NOT NULL,
    Duration NVARCHAR(50) DEFAULT N'2 Days' NOT NULL,
    Description NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 11: Payroll Management (Monthly Salary Batches)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Payroll_Batches (
    PayrollID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID NVARCHAR(50) NOT NULL,
    EmployeeName NVARCHAR(150) NOT NULL,
    BasicSalary NVARCHAR(50) NOT NULL,                         -- e.g. '₹40,000'
    Allowances NVARCHAR(50) NOT NULL,                          -- e.g. '₹5,000'
    Deductions NVARCHAR(50) NOT NULL,                          -- e.g. '₹2,000'
    NetSalary NVARCHAR(50) NOT NULL,                           -- e.g. '₹43,000'
    HRA NVARCHAR(50) DEFAULT N'₹16,000' NOT NULL,
    SpecialAllowance NVARCHAR(50) DEFAULT N'₹9,000' NOT NULL,
    PF NVARCHAR(50) DEFAULT N'₹1,800' NOT NULL,
    Tax NVARCHAR(50) DEFAULT N'₹200' NOT NULL,
    BankAccount NVARCHAR(100) DEFAULT N'HDFC Bank •••• 4892' NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Processed' NOT NULL          -- 'Processed', 'Pending'
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 12: Company Policies & Governance
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Company_Policies (
    PolicyID INT IDENTITY(1,1) PRIMARY KEY,
    PolicyTitle NVARCHAR(200) NOT NULL,
    Category NVARCHAR(100) DEFAULT N'General HR' NOT NULL,
    VersionNumber NVARCHAR(20) DEFAULT N'v2.0' NOT NULL,
    EffectiveDate DATE NOT NULL,
    SummaryText NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(30) DEFAULT N'Active' NOT NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- ----------------------------------------------------------------------------
-- MODULE 13: Live HR Activity Logs & Audit Trail
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.HR_Activity_Logs (
    ActivityID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityType NVARCHAR(50) NOT NULL,                        -- 'Leave', 'Employee', 'WFH', 'Policy', 'Attendance', 'Payroll', 'Training'
    DescriptionText NVARCHAR(MAX) NOT NULL,
    ColorHex NVARCHAR(20) DEFAULT N'#38bdf8' NOT NULL,
    ActorName NVARCHAR(100) DEFAULT N'Priya Sharma (HR)' NOT NULL,
    LoggedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

PRINT '============================================================================';
PRINT 'STEP 2: SEEDING REAL VERIFIED DATA ACROSS ALL HR MODULES';
PRINT '============================================================================';

-- 1. Seed Departments
INSERT INTO dbo.HR_Departments (DepartmentName, HeadOfDepartment, StaffCount, Status) VALUES
(N'Engineering', N'Ankit Kumar', 50, N'Active'),
(N'Human Resources', N'Neha Gupta', 12, N'Active'),
(N'Marketing', N'Priya Sharma', 20, N'Active'),
(N'Sales', N'Anjan Patel', 35, N'Active'),
(N'Finance', N'Vikas Rai', 15, N'Active'),
(N'Support', N'Sneha Singh', 24, N'Active');
GO

-- 2. Seed Designations
INSERT INTO dbo.HR_Designations (DesignationTitle, Department, StaffCount, PayScaleRange, Status) VALUES
(N'Software Developer', N'Engineering', 35, N'₹40,000 - ₹80,000', N'Active'),
(N'HR Manager', N'Human Resources', 4, N'₹50,000 - ₹90,000', N'Active'),
(N'Marketing Specialist', N'Marketing', 12, N'₹35,000 - ₹65,000', N'Active'),
(N'Sales Executive', N'Sales', 25, N'₹30,000 - ₹60,000', N'Active'),
(N'Accountant', N'Finance', 8, N'₹35,000 - ₹70,000', N'Active'),
(N'DevOps Engineer', N'Engineering', 10, N'₹50,000 - ₹1,00,000', N'Active');
GO

-- 3. Seed Work Locations
INSERT INTO dbo.HR_Work_Locations (LocationName, AddressLine, StaffCount, LocationType, Status) VALUES
(N'Bangalore HQ', N'Koramangala 4th Block, Bengaluru', 140, N'Primary Office', N'Active'),
(N'Lucknow Delivery Center', N'Gomti Nagar Phase 2, Lucknow', 65, N'Regional Hub', N'Active'),
(N'Pune Tech Center', N'Hinjewadi IT Park, Pune', 35, N'Development Hub', N'Active'),
(N'Remote Workspaces', N'Pan-India Remote WFH Network', 20, N'Virtual Workspace', N'Active');
GO

-- 4. Seed Shifts
INSERT INTO dbo.HR_Shifts (ShiftName, Timings, DurationHours, LunchBreakMinutes, GracePeriodMinutes, Status) VALUES
(N'General Shift', N'09:00 AM - 06:00 PM', N'9 Hours', N'60 Min', N'15 Min', N'Active'),
(N'Morning Shift', N'06:00 AM - 03:00 PM', N'9 Hours', N'45 Min', N'10 Min', N'Active'),
(N'Evening Shift', N'02:00 PM - 11:00 PM', N'9 Hours', N'45 Min', N'10 Min', N'Active'),
(N'Night Shift', N'10:00 PM - 07:00 AM', N'9 Hours', N'60 Min', N'15 Min', N'Active');
GO

-- 5. Seed Holidays
INSERT INTO dbo.HR_Company_Holidays (HolidayName, HolidayDate, DayOfWeek, HolidayType, Status) VALUES
(N'Diwali', '2026-10-24', N'Saturday', N'Gazetted Holiday', N'Upcoming'),
(N'Eid-ul-Fitr', '2026-04-11', N'Saturday', N'Gazetted Holiday', N'Passed'),
(N'Christmas Day', '2026-12-25', N'Friday', N'Gazetted Holiday', N'Upcoming'),
(N'Republic Day', '2026-01-26', N'Monday', N'National Holiday', N'Passed'),
(N'Independence Day', '2026-08-15', N'Saturday', N'National Holiday', N'Passed'),
(N'Gandhi Jayanti', '2026-10-02', N'Friday', N'National Holiday', N'Passed'),
(N'Holi', '2026-03-04', N'Wednesday', N'Gazetted Holiday', N'Passed');
GO

-- 6. Seed Job Openings
INSERT INTO dbo.HR_Job_Openings (JobTitle, Department, ExperienceRequired, JobType, Location, OpeningsCount, ApplicationsCount, Status) VALUES
(N'Software Developer', N'Engineering', N'2-4 Years', N'Full-time', N'Bangalore / Hybrid', 4, 120, N'open'),
(N'HR Executive', N'Human Resources', N'1-3 Years', N'Full-time', N'Lucknow Center', 2, 45, N'screening'),
(N'Marketing Specialist', N'Marketing', N'3-5 Years', N'Full-time', N'Bangalore HQ', 2, 60, N'interview'),
(N'Sales Executive', N'Sales', N'2-5 Years', N'Full-time', N'Pune / Remote', 5, 28, N'open'),
(N'Accountant', N'Finance', N'4-6 Years', N'Full-time', N'Bangalore HQ', 1, 18, N'closed');
GO

-- 7. Seed Job Applicants
INSERT INTO dbo.HR_Job_Applicants (JobID, FullName, Email, Experience, AssessmentScore, HiringStage, AppliedForRole) VALUES
(1, N'Ananya Roy', N'ananya.roy@example.com', N'4 Years', N'94%', N'Shortlisted', N'Software Developer'),
(1, N'Manav Sharma', N'manav.s@example.com', N'3 Years', N'88%', N'Interview', N'Software Developer'),
(2, N'Ritu Sen', N'ritu.sen@example.com', N'2 Years', N'82%', N'Screening', N'HR Executive'),
(3, N'Deepak Joshi', N'deepak.j@example.com', N'5 Years', N'96%', N'Hired', N'Marketing Specialist'),
(4, N'Sana Malik', N'sana.m@example.com', N'3 Years', N'90%', N'Shortlisted', N'Sales Executive');
GO

-- 8. Seed Performance Goals
INSERT INTO dbo.HR_Performance_Goals (EmployeeName, GoalTitle, Department, TargetDate, ProgressPercent, Status) VALUES
(N'Rahul Verma', N'Complete Cloud Migration Phase 2', N'Engineering', '2026-11-15', 85, N'In Progress'),
(N'Neha Gupta', N'Close 15 Enterprise Deals in Q4', N'Sales', '2026-12-30', 92, N'In Progress'),
(N'Priya Sharma', N'Revamp Employee Onboarding Portal', N'HR', '2026-10-31', 95, N'Near Completion'),
(N'Rohit Singh', N'Finalize Annual Audit & Balance Sheets', N'Finance', '2026-11-10', 70, N'In Progress'),
(N'Sneha Yadav', N'Automate CI/CD Deployment Pipelines', N'Engineering', '2026-12-05', 60, N'In Progress');
GO

-- 9. Seed Performance Reviews & Appraisals
INSERT INTO dbo.HR_Performance_Reviews (EmployeeName, ReviewPeriod, ReviewerName, SelfScore, ManagerScore, FinalRating, Status) VALUES
(N'Rahul Verma', N'Q3 2026', N'Ankit Kumar', N'4.8 / 5.0', N'4.7 / 5.0', N'Excellent (4.75)', N'Completed'),
(N'Priya Sharma', N'Q3 2026', N'Director HR', N'4.5 / 5.0', N'4.6 / 5.0', N'Excellent (4.55)', N'Completed'),
(N'Amit Kumar', N'Q3 2026', N'Priya Sharma', N'4.0 / 5.0', N'4.2 / 5.0', N'Good (4.10)', N'Completed'),
(N'Rohit Singh', N'Q3 2026', N'Vikas Rai', N'3.8 / 5.0', N'3.9 / 5.0', N'Good (3.85)', N'Completed'),
(N'Neha Gupta', N'Q3 2026', N'Anjan Patel', N'4.6 / 5.0', N'4.5 / 5.0', N'Excellent (4.55)', N'Completed');
GO

INSERT INTO dbo.HR_Appraisals (EmployeeName, Department, CurrentSalary, HikePercent, RevisedSalary, Rating, Status) VALUES
(N'Rahul Verma', N'Engineering', N'₹8,50,000', N'15%', N'₹9,77,500', N'Excellent', N'Pending Approval'),
(N'Priya Sharma', N'HR', N'₹10,20,000', N'12%', N'₹11,42,400', N'Excellent', N'Approved'),
(N'Amit Kumar', N'Marketing', N'₹6,50,000', N'10%', N'₹7,15,000', N'Good', N'Pending Approval'),
(N'Rohit Singh', N'Finance', N'₹7,20,000', N'11%', N'₹7,99,200', N'Good', N'Pending Approval'),
(N'Neha Gupta', N'Sales', N'₹7,80,000', N'14%', N'₹8,89,200', N'Excellent', N'Approved');
GO

-- 10. Seed Training Programs
INSERT INTO dbo.HR_Training_Programs (ProgramTitle, Category, ScheduledDate, ParticipantsCount, Status, TrainerName, Duration, Description) VALUES
(N'Leadership Skills', N'Soft Skills', N'16 Oct 2026', 25, N'Upcoming', N'Dr. Ramesh Gupta', N'3 Days (Executive)', N'Cultivating leadership, cross-team coordination and strategic management competencies.'),
(N'Cyber Security', N'Technical', N'20 Oct 2026', 40, N'Upcoming', N'Vikram Mehra (Infosec Lead)', N'2 Days (Hands-on Lab)', N'Zero-trust architecture, threat hunting, secure code practices and data loss prevention.'),
(N'Communication Mastery', N'Soft Skills', N'28 Sep 2026', 30, N'Completed', N'Priya Sharma (HR Head)', N'1 Day (Interactive)', N'Assertive corporate communication, stakeholder management, and presentation craftsmanship.'),
(N'Project Management PMP', N'Technical', N'20 Sep 2026', 35, N'Completed', N'Ankit Kumar (VP Eng)', N'4 Days (Agile PMP)', N'Scrum frameworks, sprint capacity planning, risk mitigation and continuous integration delivery.'),
(N'Time Management Frameworks', N'Soft Skills', N'15 Sep 2026', 28, N'Completed', N'Sneha Singh', N'1 Day', N'Pomodoro frameworks, Eisenhower matrix prioritization, and meeting fatigue reduction.');
GO

-- 11. Seed Payroll Records
INSERT INTO dbo.HR_Payroll_Batches (EmployeeID, EmployeeName, BasicSalary, Allowances, Deductions, NetSalary, HRA, SpecialAllowance, PF, Tax, BankAccount, Status) VALUES
(N'EMP001', N'Rahul Verma', N'₹40,000', N'₹5,000', N'₹2,000', N'₹43,000', N'₹16,000', N'₹9,000', N'₹1,800', N'₹200', N'HDFC Bank •••• 4892', N'Processed'),
(N'EMP002', N'Priya Sharma', N'₹50,000', N'₹6,000', N'₹2,500', N'₹53,500', N'₹20,000', N'₹12,000', N'₹1,800', N'₹700', N'ICICI Bank •••• 1042', N'Processed'),
(N'EMP003', N'Amit Kumar', N'₹35,000', N'₹4,000', N'₹1,800', N'₹37,200', N'₹14,000', N'₹7,000', N'₹1,800', N'₹0', N'SBI Bank •••• 7719', N'Processed'),
(N'EMP004', N'Neha Gupta', N'₹45,000', N'₹5,500', N'₹2,200', N'₹48,300', N'₹18,000', N'₹9,500', N'₹1,800', N'₹400', N'Axis Bank •••• 8933', N'Pending'),
(N'EMP005', N'Rohit Singh', N'₹38,000', N'₹4,500', N'₹1,900', N'₹40,600', N'₹15,200', N'₹8,000', N'₹1,800', N'₹100', N'Kotak Bank •••• 5521', N'Processed');
GO

-- 12. Seed Policies
INSERT INTO dbo.HR_Company_Policies (PolicyTitle, Category, VersionNumber, EffectiveDate, SummaryText, Status) VALUES
(N'Work From Home (WFH) Guidelines', N'Workplace Flexibility', N'v2.4', '2026-01-01', N'Employees can avail up to 4 days WFH monthly with prior advance notification and manager approval.', N'Active'),
(N'Code of Conduct & Anti-Harassment', N'Compliance', N'v3.1', '2026-01-01', N'Zero tolerance policy for discriminatory behavior, maintaining an inclusive workspace.', N'Active'),
(N'Attendance & Biometric Protocol', N'Operations', N'v2.0', '2026-03-01', N'Office work timings 09:00 AM - 06:00 PM with mandatory check-in via QR kiosk or biometric terminals.', N'Active'),
(N'Annual Leave & Casual Leave Policy', N'Leave Management', N'v1.8', '2026-01-01', N'12 Casual, 10 Sick, and 15 Earned leaves credited on calendar year commencement.', N'Active');
GO

-- 13. Seed Activity Logs
INSERT INTO dbo.HR_Activity_Logs (ActivityType, DescriptionText, ColorHex, ActorName) VALUES
(N'Leave', N'Sakshi Verma leave request approved', N'#10b981', N'Priya Sharma (HR)'),
(N'Employee', N'New employee added - SHREYA YADAV (Engineering)', N'#38bdf8', N'Priya Sharma (HR)'),
(N'WFH', N'WFH request pending review for Amit Kumar', N'#f59e0b', N'System'),
(N'Policy', N'Company WFH policy guidelines v2.0 updated', N'#a855f7', N'HR Team'),
(N'Attendance', N'Biometric device sync completed for Bangalore Hub', N'#10b981', N'System'),
(N'Payroll', N'Monthly payroll batch October 2026 pre-processed', N'#38bdf8', N'Finance'),
(N'Leave', N'Rohit Singh sick leave request rejected', N'#ef4444', N'Priya Sharma (HR)'),
(N'Training', N'New mandatory Cybersecurity Compliance course published', N'#a855f7', N'L&D Dept');
GO

PRINT '============================================================================';
PRINT 'STEP 3: VERIFICATION SUMMARY OF ALL HR MODULES CREATED';
PRINT '============================================================================';

SELECT '1. HR Departments' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Departments
UNION ALL
SELECT '2. HR Designations' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Designations
UNION ALL
SELECT '3. HR Work Locations' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Work_Locations
UNION ALL
SELECT '4. HR Shifts' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Shifts
UNION ALL
SELECT '5. Company Holidays' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Company_Holidays
UNION ALL
SELECT '6. Recruitment Job Openings' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Job_Openings
UNION ALL
SELECT '7. Job Applicants' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Job_Applicants
UNION ALL
SELECT '8. Performance Goals' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Performance_Goals
UNION ALL
SELECT '9. Performance Reviews' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Performance_Reviews
UNION ALL
SELECT '10. Salary Appraisals' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Appraisals
UNION ALL
SELECT '11. Training Programs' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Training_Programs
UNION ALL
SELECT '12. Payroll Batches' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Payroll_Batches
UNION ALL
SELECT '13. Company Policies' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Company_Policies
UNION ALL
SELECT '14. HR Activity Logs' AS ModuleName, COUNT(*) AS TotalRecords FROM dbo.HR_Activity_Logs;
GO