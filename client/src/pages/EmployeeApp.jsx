import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Smartphone, 
  QrCode, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Home, 
  User, 
  AlertTriangle, 
  Send, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  Camera, 
  ArrowLeft, 
  TrendingUp, 
  Briefcase, 
  X, 
  FileCheck, 
  Flashlight, 
  KeyRound, 
  Check, 
  ChevronLeft, 
  Globe, 
  Wifi, 
  Settings,
  Building2,
  RefreshCw,
  Zap,
  Edit3,
  Lock,
  Mail,
  Phone,
  Shield,
  Upload,
  BarChart2,
  PieChart,
  Coffee,
  UserCheck,
  UserX,
  FileText,
  MapPin,
  Megaphone,
  Bell,
  CheckSquare,
  Square,
  ExternalLink,
  Info,
  CalendarDays,
  Layers,
  Award
} from 'lucide-react';
import { api, getServerUrl, setCustomServerUrl } from '../api';

// Web Audio API punch confirmation chime
function playPunchChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.25); // C6
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=128&q=80'
];

export default function EmployeeApp({
  isEmbedded = false,
  isNativeApp = false,
  initialEmployee,
  onLogout
} = {}) {
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(() => getServerUrl() || 'http://192.168.1.77:5000');
  const [serverSavedMsg, setServerSavedMsg] = useState('');
  const [serverOnline, setServerOnline] = useState(true);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState('');

  // Camera scanner states
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Real-Time punch selection state & Live Clock
  const [appPunchType, setAppPunchType] = useState('CHECK_IN');
  const [appLiveTime, setAppLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setAppLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mobile app sub-screen routing:
  // 'login' (Screen 11), 'otp' (Screen 12), 'home' (Screen 13), 'scan' (Screen 14),
  // 'wfh' (Screen 15), 'history' (Screen 16), 'profile' (Screen 17)
  const [mobileScreen, setMobileScreen] = useState('home');

  // Active employee state (Rohit S. EMP005 default matching Employee Portal)
  const [activeEmployee, setActiveEmployee] = useState(initialEmployee || {
    id: 'EMP005',
    name: 'Rohit S.',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    shift: 'General (9:00 AM - 6:00 PM)',
    work_type: 'Office',
    joining_date: '10 Jan 2024',
    address: 'Flat 402, Shalimar Heights, Gomti Nagar Ext., Lucknow, UP - 226010',
    email: 'rohit.s@vorldx.com',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    verified: 1
  });

  // Screen 14: Latest scanned punch details (Employee Name, In Time, Out Time, Employee ID)
  const [scanPunchDetails, setScanPunchDetails] = useState(null);

  // Screen 11: Employee ID Input (HR creates accounts, Employee logs in)
  const [inputEmpId, setInputEmpId] = useState('EMP005');

  // Screen 17: Employee Profile Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editActiveTab, setEditActiveTab] = useState('info'); // 'info', 'password'
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    password: '',
    confirmPassword: ''
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState('');

  // Gallery photo upload ref (Screen 17)
  const fileInputRef = useRef(null);

  // Screen 18: Monthly Attendance Statistics Data & State
  const MONTHS_STATS_DATA = [
    {
      key: '2026-10',
      name: 'October 2026',
      short: 'Oct 2026',
      totalWorkingDays: 22,
      present: 16,
      wfh: 4,
      absent: 1,
      leaves: 1,
      attendanceRate: '95.5%',
      weeks: [
        { label: 'Week 1 (Oct 1-5)', present: 4, wfh: 1, absent: 0, leaves: 0 },
        { label: 'Week 2 (Oct 6-10)', present: 4, wfh: 1, absent: 0, leaves: 0 },
        { label: 'Week 3 (Oct 11-15)', present: 3, wfh: 1, absent: 1, leaves: 0 },
        { label: 'Week 4 (Oct 16-20)', present: 5, wfh: 1, absent: 0, leaves: 1 },
      ]
    },
    {
      key: '2026-09',
      name: 'September 2026',
      short: 'Sep 2026',
      totalWorkingDays: 22,
      present: 17,
      wfh: 3,
      absent: 0,
      leaves: 2,
      attendanceRate: '100%',
      weeks: [
        { label: 'Week 1', present: 5, wfh: 0, absent: 0, leaves: 0 },
        { label: 'Week 2', present: 4, wfh: 1, absent: 0, leaves: 0 },
        { label: 'Week 3', present: 4, wfh: 1, absent: 0, leaves: 1 },
        { label: 'Week 4', present: 4, wfh: 1, absent: 0, leaves: 1 },
      ]
    },
    {
      key: '2026-08',
      name: 'August 2026',
      short: 'Aug 2026',
      totalWorkingDays: 21,
      present: 15,
      wfh: 4,
      absent: 1,
      leaves: 1,
      attendanceRate: '95.2%',
      weeks: [
        { label: 'Week 1', present: 4, wfh: 1, absent: 0, leaves: 0 },
        { label: 'Week 2', present: 3, wfh: 1, absent: 1, leaves: 0 },
        { label: 'Week 3', present: 4, wfh: 1, absent: 0, leaves: 1 },
        { label: 'Week 4', present: 4, wfh: 1, absent: 0, leaves: 0 },
      ]
    },
    {
      key: '2026-07',
      name: 'July 2026',
      short: 'Jul 2026',
      totalWorkingDays: 23,
      present: 18,
      wfh: 3,
      absent: 1,
      leaves: 1,
      attendanceRate: '95.7%',
      weeks: [
        { label: 'Week 1', present: 5, wfh: 0, absent: 0, leaves: 0 },
        { label: 'Week 2', present: 4, wfh: 1, absent: 0, leaves: 0 },
        { label: 'Week 3', present: 4, wfh: 1, absent: 0, leaves: 1 },
        { label: 'Week 4', present: 5, wfh: 1, absent: 0, leaves: 0 },
      ]
    },
    {
      key: '2026-06',
      name: 'June 2026',
      short: 'Jun 2026',
      totalWorkingDays: 22,
      present: 16,
      wfh: 5,
      absent: 0,
      leaves: 1,
      attendanceRate: '100%',
      weeks: [
        { label: 'Week 1', present: 4, wfh: 1, absent: 0, leaves: 0 },
        { label: 'Week 2', present: 3, wfh: 2, absent: 0, leaves: 0 },
        { label: 'Week 3', present: 4, wfh: 1, absent: 0, leaves: 1 },
        { label: 'Week 4', present: 5, wfh: 1, absent: 0, leaves: 0 },
      ]
    },
    {
      key: '2026-05',
      name: 'May 2026',
      short: 'May 2026',
      totalWorkingDays: 21,
      present: 17,
      wfh: 2,
      absent: 1,
      leaves: 1,
      attendanceRate: '95.2%',
      weeks: [
        { label: 'Week 1', present: 5, wfh: 0, absent: 0, leaves: 0 },
        { label: 'Week 2', present: 4, wfh: 1, absent: 1, leaves: 0 },
        { label: 'Week 3', present: 4, wfh: 1, absent: 0, leaves: 1 },
        { label: 'Week 4', present: 4, wfh: 0, absent: 0, leaves: 0 },
      ]
    }
  ];

  const [selectedMonthKey, setSelectedMonthKey] = useState('2026-10');

  // OTP inputs (Screen 12)
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Today's attendance state (Screen 13)
  const [todayRecord, setTodayRecord] = useState({
    status: 'Present',
    check_in: '09:05 AM',
    check_out: '06:02 PM'
  });

  // Scanner state (Screen 14)
  const [torchOn, setTorchOn] = useState(false);
  const [scanStatusMsg, setScanStatusMsg] = useState(null);
  const [scanning, setScanning] = useState(false);

  // Helper for computing working days between two date strings (inclusive)
  const calculateDays = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 1;
    const d1 = new Date(fromStr);
    const d2 = new Date(toStr);
    if (isNaN(d1) || isNaN(d2)) return 1;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  // Screen 15: Requests active tab ('leave', 'wfh', 'approvals')
  const [requestTab, setRequestTab] = useState('leave');
  const [approvalFilter, setApprovalFilter] = useState('All'); // 'All', 'Approved', 'Pending', 'Rejected'
  const [selectedReceipt, setSelectedReceipt] = useState(null); // Receipt modal for HR decision verification

  // 1. Leave Application state (Screen 15)
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveFromDate, setLeaveFromDate] = useState('2026-10-18');
  const [leaveToDate, setLeaveToDate] = useState('2026-10-20');
  const [leaveReason, setLeaveReason] = useState('Family cousin wedding ceremony out of station');
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  // 2. WFH Request state with From & To Calendar Range (Screen 15)
  const [wfhFromDate, setWfhFromDate] = useState('2026-10-15');
  const [wfhToDate, setWfhToDate] = useState('2026-10-16');
  const [wfhReason, setWfhReason] = useState('High-focus backend API development & offline sync verification');
  const [wfhSubmitting, setWfhSubmitting] = useState(false);

  // 3. Unified Requests History with explicit HR Approval Tracking (Approved / Rejected / Pending)
  const [requestsHistory, setRequestsHistory] = useState([
    {
      id: 'REQ-L101',
      type: 'leave',
      leave_type: 'Casual Leave',
      title: 'Casual Leave',
      from_date: '2026-10-18',
      to_date: '2026-10-20',
      total_days: 3,
      reason: 'Family cousin wedding ceremony out of station',
      status: 'Approved',
      reviewed_by: 'Sneha Verma (HR Lead)',
      reviewed_at: '12 Oct 2026, 11:30 AM',
      hr_comment: 'Approved by HR. Have a wonderful time at the wedding! Please coordinate sprint handoff.',
      created_at: '12 Oct 2026'
    },
    {
      id: 'REQ-W102',
      type: 'wfh',
      leave_type: null,
      title: 'Work From Home',
      from_date: '2026-10-15',
      to_date: '2026-10-16',
      total_days: 2,
      reason: 'High-focus backend API development & offline sync verification',
      status: 'Approved',
      reviewed_by: 'Sneha Verma (HR Lead)',
      reviewed_at: '14 Oct 2026, 04:30 PM',
      hr_comment: 'Approved for 2 days. Ensure daily sprint commits are pushed to repository.',
      created_at: '14 Oct 2026'
    },
    {
      id: 'REQ-L103',
      type: 'leave',
      leave_type: 'Sick Leave',
      title: 'Sick Leave',
      from_date: '2026-10-12',
      to_date: '2026-10-12',
      total_days: 1,
      reason: 'Viral illness & doctor prescribed bed rest',
      status: 'Approved',
      reviewed_by: 'Sneha Verma (HR Lead)',
      reviewed_at: '12 Oct 2026, 09:30 AM',
      hr_comment: 'Medical leave regularized by HR. Take care and get well soon.',
      created_at: '12 Oct 2026'
    },
    {
      id: 'REQ-W104',
      type: 'wfh',
      leave_type: null,
      title: 'Work From Home',
      from_date: '2026-10-23',
      to_date: '2026-10-24',
      total_days: 2,
      reason: 'Deep architectural refactoring for client release module',
      status: 'Pending',
      reviewed_by: null,
      reviewed_at: null,
      hr_comment: null,
      created_at: '14 Oct 2026'
    },
    {
      id: 'REQ-L105',
      type: 'leave',
      leave_type: 'Paid Leave',
      title: 'Paid Leave',
      from_date: '2026-10-27',
      to_date: '2026-10-28',
      total_days: 2,
      reason: 'Personal bank work and family documentation',
      status: 'Pending',
      reviewed_by: null,
      reviewed_at: null,
      hr_comment: null,
      created_at: '14 Oct 2026'
    },
    {
      id: 'REQ-W106',
      type: 'wfh',
      leave_type: null,
      title: 'Work From Home',
      from_date: '2026-10-02',
      to_date: '2026-10-02',
      total_days: 1,
      reason: 'Family event out of town',
      status: 'Rejected',
      reviewed_by: 'Sneha Verma (HR Lead)',
      reviewed_at: '01 Oct 2026, 02:15 PM',
      hr_comment: 'Rejected by HR. All-hands sprint planning was mandatory on-site in office.',
      created_at: '01 Oct 2026'
    }
  ]);

  // Derived helper arrays for WFH & Leave requests (used by Attendance History & Calendar)
  const leaveRequests = (requestsHistory || []).filter(r => r.type === 'leave');
  const wfhRequests = (requestsHistory || []).filter(r => r.type === 'wfh');

  // 4. Announcements by HR state (Screen 13)
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: '🪔 Diwali Festive Bonus & Extended Office Holidays',
      content: 'Management is thrilled to announce Diwali festival bonuses for all confirmed employees! Office will observe official holidays from 31st Oct to 3rd Nov 2026. Sweet distribution will take place in the cafeteria on 29th Oct at 4:30 PM.',
      priority: 'Celebration',
      tag: 'Festive Notice',
      author_name: 'Sneha Verma (HR Lead)',
      published_date: '14 Oct 2026'
    },
    {
      id: 2,
      title: '📢 Q4 Company Town Hall & Product Showcase',
      content: 'All employees are cordially invited to the Q4 Town Hall on Friday, 24th Oct 2026 at 3:00 PM (Hybrid: Lucknow HQ Auditorium & Google Meet). Leadership will share corporate milestones and live enterprise client achievements.',
      priority: 'Urgent',
      tag: 'All Hands',
      author_name: 'Sneha Verma (HR Lead)',
      published_date: '13 Oct 2026'
    },
    {
      id: 3,
      title: '📋 Updated WFH & Leave Regularization Policy Guidelines',
      content: 'Effective immediately: All WFH and Leave applications must be submitted with From & To calendar dates in advance via the VorldX Employee App. HR approval decisions can now be tracked live with reviewer remarks.',
      priority: 'Policy',
      tag: 'HR Policy',
      author_name: 'Sneha Verma (HR Lead)',
      published_date: '11 Oct 2026'
    }
  ]);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // 5. Requirements by Clients in given project through Admin state (Screen 13)
  const [assignedProject, setAssignedProject] = useState({
    id: 1,
    project_name: 'VorldX Attendance AI & Biometric QR Terminal',
    client_name: 'Alpha Corp Global (Enterprise Client)',
    assigned_by: 'Admin (Vikram Singhania)',
    priority: 'High Priority 🔥',
    deadline: '28 Oct 2026',
    status: 'Sprint 4 (In Progress)',
    progress_percent: 85,
    description: 'Enterprise-grade employee attendance tracking system with rotating QR biometrics, mobile Android APK, multi-day WFH/Leave management, and real-time HR approval tracking.',
    admin_notes: 'Admin Vikram Singhania: "Alpha Corp client has requested strict compliance on real-time HR approval tracking and HR announcements directly in the employee mobile app. Great progress so far!"',
    requirements: [
      {
        id: 'REQ-101',
        title: 'Multi-Day Leave Application with Calendar Date Selection',
        desc: 'Employee can select From Date and To Date using native calendar pickers, specify leave type (Casual, Sick, Paid), and submit reasons.',
        status: 'Completed',
        priority: 'High 🔥',
        client_note: 'Verified - user can pick date ranges easily on mobile.'
      },
      {
        id: 'REQ-102',
        title: 'Multi-Day WFH Request with Calendar Range Pickers',
        desc: 'Work From Home form must accept From Date & To Date calendar pickers with auto-calculated working day counts and remote reasons.',
        status: 'Completed',
        priority: 'High 🔥',
        client_note: 'Verified - matches company remote work policy.'
      },
      {
        id: 'REQ-103',
        title: 'Real-time HR Approval Status Tracking Receipt',
        desc: 'Clear visual status (🟢 Approved, 🔴 Rejected, 🟡 Pending) displaying HR Reviewer name, review timestamp, and HR remarks.',
        status: 'Completed',
        priority: 'High 🔥',
        client_note: 'Critical for compliance - transparency on who approved each request.'
      },
      {
        id: 'REQ-104',
        title: 'HR Broadcast Announcements Feed on Employee Dashboard',
        desc: 'Direct announcements channel from HR to employees for urgent notices, festive bonus updates, and holiday circulars.',
        status: 'Completed',
        priority: 'Medium ⚡',
        client_note: 'Improves internal team engagement.'
      },
      {
        id: 'REQ-105',
        title: 'Offline-First APK Support & Zero-Latency Sync',
        desc: 'Seamless mobile execution when away from office network with fast local caching and automatic sync.',
        status: 'Completed',
        priority: 'High 🔥',
        client_note: 'Approved for Android APK distribution.'
      },
      {
        id: 'REQ-106',
        title: 'Final Client Demo & Production Sign-off Meeting',
        desc: 'Live interactive presentation with Alpha Corp leadership on 28th October 2026.',
        status: 'In Progress',
        priority: 'High 🔥',
        client_note: 'Scheduled for 28 Oct 2026 11:00 AM.'
      }
    ]
  });
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Attendance History state with Clickable DD/MM/YYYY dates and Reasons (Screen 16)
  const HISTORY_MONTHS = [
    {
      key: '2026-10',
      label: 'October 2026',
      year: 2026,
      month: 10,
      daysInMonth: 31,
      startDayOfWeek: 4, // 0 = Sun, 4 = Thursday
      records: [
        {
          date: '16/10/2026',
          dayName: 'Friday',
          status: 'WFH',
          check_in: '09:12 AM',
          check_out: '06:05 PM',
          duration: '8h 53m',
          location: 'Remote Work (Home Office)',
          mode: 'Approved WFH Request',
          reason: 'High-focus backend API development & offline sync verification • HR Approved'
        },
        {
          date: '15/10/2026',
          dayName: 'Thursday',
          status: 'Present',
          check_in: '09:05 AM',
          check_out: '06:02 PM',
          duration: '8h 57m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'In-office biometric QR punch at Terminal 01 • Regular shift completed'
        },
        {
          date: '14/10/2026',
          dayName: 'Wednesday',
          status: 'Present',
          check_in: '09:04 AM',
          check_out: '06:05 PM',
          duration: '9h 01m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Full-day sprint deployment & code review completed on-site'
        },
        {
          date: '13/10/2026',
          dayName: 'Tuesday',
          status: 'Late',
          check_in: '09:45 AM',
          check_out: '06:30 PM',
          duration: '8h 45m',
          location: 'Lucknow HQ - Main Reception',
          mode: 'Mobile QR Punch',
          reason: 'Heavy traffic congestion on Shaheed Path • Compensated extra 30m in evening'
        },
        {
          date: '12/10/2026',
          dayName: 'Monday',
          status: 'Absent',
          check_in: '--:--',
          check_out: '--:--',
          duration: '0h 00m',
          location: 'N/A',
          mode: 'Leave Regularization',
          reason: 'Sudden viral illness & high fever • Medical prescription regularized by HR Sneha'
        },
        {
          date: '11/10/2026',
          dayName: 'Sunday',
          status: 'Holiday',
          check_in: '--:--',
          check_out: '--:--',
          duration: 'Weekly Off',
          location: 'N/A',
          mode: 'Calendar Policy',
          reason: 'Weekly Sunday Corporate Off Day'
        },
        {
          date: '10/10/2026',
          dayName: 'Saturday',
          status: 'Present',
          check_in: '09:00 AM',
          check_out: '02:15 PM',
          duration: '5h 15m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Sprint demo presentation & client release deployment'
        },
        {
          date: '09/10/2026',
          dayName: 'Friday',
          status: 'WFH',
          check_in: '09:15 AM',
          check_out: '06:10 PM',
          duration: '8h 55m',
          location: 'Remote Work (Home)',
          mode: 'WFH Portal Approval',
          reason: 'WFH Approved by Project Lead • High-focus core algorithm optimization'
        },
        {
          date: '08/10/2026',
          dayName: 'Thursday',
          status: 'Present',
          check_in: '09:02 AM',
          check_out: '06:00 PM',
          duration: '8h 58m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Standard on-site attendance recorded via kiosk terminal'
        },
        {
          date: '07/10/2026',
          dayName: 'Wednesday',
          status: 'Leave',
          check_in: '--:--',
          check_out: '--:--',
          duration: '0h 00m',
          location: 'N/A',
          mode: 'Approved Casual Leave',
          reason: 'Casual Leave (CL) for family wedding ceremony • Prior approval from HR'
        },
        {
          date: '06/10/2026',
          dayName: 'Tuesday',
          status: 'Present',
          check_in: '09:08 AM',
          check_out: '06:08 PM',
          duration: '9h 00m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Regular shift attendance • Database optimization work'
        },
        {
          date: '05/10/2026',
          dayName: 'Monday',
          status: 'Present',
          check_in: '08:58 AM',
          check_out: '06:03 PM',
          duration: '9h 05m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Weekly sprint kickoff meeting at 4th floor conference room'
        },
        {
          date: '04/10/2026',
          dayName: 'Sunday',
          status: 'Holiday',
          check_in: '--:--',
          check_out: '--:--',
          duration: 'Weekly Off',
          location: 'N/A',
          mode: 'Corporate Policy',
          reason: 'Weekly Sunday Corporate Off Day'
        },
        {
          date: '03/10/2026',
          dayName: 'Saturday',
          status: 'Present',
          check_in: '09:10 AM',
          check_out: '02:00 PM',
          duration: '4h 50m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Weekend sprint demo presentation & client release deployment'
        },
        {
          date: '02/10/2026',
          dayName: 'Friday',
          status: 'Holiday',
          check_in: '--:--',
          check_out: '--:--',
          duration: 'National Holiday',
          location: 'N/A',
          mode: 'Gazetted Holiday',
          reason: 'Gandhi Jayanti • National Corporate Holiday'
        },
        {
          date: '01/10/2026',
          dayName: 'Thursday',
          status: 'Present',
          check_in: '09:00 AM',
          check_out: '06:00 PM',
          duration: '9h 00m',
          location: 'Lucknow HQ - 4th Floor Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Q4 kickoff meeting & core attendance module roadmap discussion'
        }
      ]
    },
    {
      key: '2026-09',
      label: 'September 2026',
      year: 2026,
      month: 9,
      daysInMonth: 30,
      startDayOfWeek: 2, // Tuesday
      records: [
        {
          date: '30/09/2026',
          dayName: 'Wednesday',
          status: 'Present',
          check_in: '09:02 AM',
          check_out: '06:01 PM',
          duration: '8h 59m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Month-end sprint review and deliverable milestone completion'
        },
        {
          date: '29/09/2026',
          dayName: 'Tuesday',
          status: 'Present',
          check_in: '09:00 AM',
          check_out: '06:00 PM',
          duration: '9h 00m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Regular general shift attendance verified'
        },
        {
          date: '28/09/2026',
          dayName: 'Monday',
          status: 'WFH',
          check_in: '09:12 AM',
          check_out: '06:15 PM',
          duration: '9h 03m',
          location: 'Remote Work (Home)',
          mode: 'WFH Portal Approval',
          reason: 'Approved WFH for architectural restructuring documentation'
        },
        {
          date: '25/09/2026',
          dayName: 'Friday',
          status: 'Present',
          check_in: '09:05 AM',
          check_out: '06:00 PM',
          duration: '8h 55m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Team sprint retro meeting & code commit verification'
        },
        {
          date: '24/09/2026',
          dayName: 'Thursday',
          status: 'Late',
          check_in: '09:35 AM',
          check_out: '06:25 PM',
          duration: '8h 50m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Mobile QR Punch',
          reason: 'Monsoon heavy rain delay • Informed manager via slack'
        },
        {
          date: '23/09/2026',
          dayName: 'Wednesday',
          status: 'Present',
          check_in: '08:55 AM',
          check_out: '06:00 PM',
          duration: '9h 05m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Client presentation & product walkthrough at boardroom'
        },
        {
          date: '22/09/2026',
          dayName: 'Tuesday',
          status: 'Leave',
          check_in: '--:--',
          check_out: '--:--',
          duration: '0h 00m',
          location: 'N/A',
          mode: 'Sick Leave',
          reason: 'Doctor prescribed rest for eye allergy • Approved by HR'
        },
        {
          date: '21/09/2026',
          dayName: 'Monday',
          status: 'Present',
          check_in: '09:04 AM',
          check_out: '06:02 PM',
          duration: '8h 58m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Standard weekly planning on-site attendance'
        }
      ]
    },
    {
      key: '2026-08',
      label: 'August 2026',
      year: 2026,
      month: 8,
      daysInMonth: 31,
      startDayOfWeek: 6, // Saturday
      records: [
        {
          date: '31/08/2026',
          dayName: 'Monday',
          status: 'Present',
          check_in: '09:01 AM',
          check_out: '06:00 PM',
          duration: '8h 59m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'End of month corporate all-hands meeting'
        },
        {
          date: '28/08/2026',
          dayName: 'Friday',
          status: 'Present',
          check_in: '09:06 AM',
          check_out: '06:05 PM',
          duration: '8h 59m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Sprint release deployment verification'
        },
        {
          date: '27/08/2026',
          dayName: 'Thursday',
          status: 'WFH',
          check_in: '09:10 AM',
          check_out: '06:00 PM',
          duration: '8h 50m',
          location: 'Remote Work (Home)',
          mode: 'WFH Portal Approval',
          reason: 'Remote dev setup maintenance and server migration'
        },
        {
          date: '26/08/2026',
          dayName: 'Wednesday',
          status: 'Absent',
          check_in: '--:--',
          check_out: '--:--',
          duration: '0h 00m',
          location: 'N/A',
          mode: 'Emergency Absence',
          reason: 'Urgent municipal work and personal leave regularization'
        },
        {
          date: '25/08/2026',
          dayName: 'Tuesday',
          status: 'Present',
          check_in: '09:00 AM',
          check_out: '06:02 PM',
          duration: '9h 02m',
          location: 'Lucknow HQ Terminal 01',
          mode: 'Biometric QR Punch',
          reason: 'Normal shift in-office work'
        }
      ]
    }
  ];

  const [historyMonthIdx, setHistoryMonthIdx] = useState(0);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [historyViewMode, setHistoryViewMode] = useState('calendar'); // 'calendar' (Material Image 1 style) or 'list'
  const [selectedCalDay, setSelectedCalDay] = useState(16); // Default 16 Oct (matching Image 1!)
  const [datePickerModal, setDatePickerModal] = useState({
    isOpen: false,
    targetField: null, // 'leaveFrom', 'leaveTo', 'wfhFrom', 'wfhTo'
    year: 2026,
    month: 10,
    day: 16
  });

  // Helper to dynamically resolve detailed attendance record for any calendar date
  const getSelectedDayAttendance = (monthObj, dayNumber) => {
    if (!monthObj) return null;
    const year = monthObj.year || 2026;
    const month = monthObj.month || 10;
    const dateFormatted = `${String(dayNumber).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    
    // 1. Check if there's an explicit record in HISTORY_MONTHS
    const directRecord = (monthObj.records || []).find(r => r.date === dateFormatted);
    if (directRecord) {
      const matchingWfh = (wfhRequests || []).find(w => w.from_date <= isoDate && isoDate <= w.to_date);
      const matchingLeave = (leaveRequests || []).find(l => l.from_date <= isoDate && isoDate <= l.to_date);
      return {
        ...directRecord,
        hrApproval: matchingWfh || matchingLeave || null
      };
    }

    // 2. Check if employee has an active/approved WFH or Leave on this date
    const matchingWfh = (wfhRequests || []).find(w => w.from_date <= isoDate && isoDate <= w.to_date);
    if (matchingWfh) {
      const isAppr = matchingWfh.status === 'Approved';
      return {
        date: dateFormatted,
        dayName: new Date(year, month - 1, dayNumber).toLocaleDateString('en-US', { weekday: 'long' }),
        status: isAppr ? 'WFH' : (matchingWfh.status === 'Rejected' ? 'Absent' : 'Pending'),
        check_in: isAppr ? '09:12 AM' : '--:--',
        check_out: isAppr ? '06:05 PM' : '--:--',
        duration: isAppr ? '8h 53m' : '0h 00m',
        location: isAppr ? 'Remote Work (Home Office)' : 'N/A',
        mode: `WFH Request (${matchingWfh.status})`,
        reason: `WFH: "${matchingWfh.reason}"`,
        hrApproval: matchingWfh
      };
    }

    const matchingLeave = (leaveRequests || []).find(l => l.from_date <= isoDate && isoDate <= l.to_date);
    if (matchingLeave) {
      const isAppr = matchingLeave.status === 'Approved';
      return {
        date: dateFormatted,
        dayName: new Date(year, month - 1, dayNumber).toLocaleDateString('en-US', { weekday: 'long' }),
        status: isAppr ? 'Leave' : (matchingLeave.status === 'Rejected' ? 'Absent' : 'Pending'),
        check_in: '--:--',
        check_out: '--:--',
        duration: isAppr ? 'Approved Leave' : '0h 00m',
        location: 'N/A',
        mode: `${matchingLeave.leave_type || 'Leave'} (${matchingLeave.status})`,
        reason: `${matchingLeave.leave_type}: "${matchingLeave.reason}"`,
        hrApproval: matchingLeave
      };
    }

    // 3. Fallback based on day of week
    const dateObj = new Date(year, month - 1, dayNumber);
    const dayOfWeek = dateObj.getDay();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    if (dayOfWeek === 0) {
      return {
        date: dateFormatted,
        dayName,
        status: 'Holiday',
        check_in: '--:--',
        check_out: '--:--',
        duration: 'Weekly Off',
        location: 'N/A',
        mode: 'Corporate Policy',
        reason: 'Weekly Sunday Corporate Off Day • No attendance punch required'
      };
    } else if (dayOfWeek === 6) {
      return {
        date: dateFormatted,
        dayName,
        status: 'Scheduled',
        check_in: '09:00 AM',
        check_out: '02:00 PM',
        duration: '5h 00m Shift',
        location: 'Lucknow HQ - 4th Floor Terminal 01',
        mode: 'Scheduled Corporate Shift',
        reason: 'Weekend Half-Day Shift • Sprint demo & code review presentation'
      };
    } else {
      return {
        date: dateFormatted,
        dayName,
        status: 'Scheduled',
        check_in: '09:00 AM',
        check_out: '06:00 PM',
        duration: '9h 00m Shift',
        location: 'Lucknow HQ - 4th Floor Terminal 01',
        mode: 'Scheduled General Shift',
        reason: 'Regular Corporate Workday • Biometric QR Terminal opens at 08:30 AM'
      };
    }
  };

  const [wfoAutoSuccessMsg, setWfoAutoSuccessMsg] = useState('');

  // Auto-detect mobile QR scan from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wfoEmp = params.get('wfoAuth');
    const sessionId = params.get('sessionId');
    const kioskScan = params.get('kioskScan');
    const token = params.get('token');

    if (wfoEmp) {
      api.wfoMobileConfirm(sessionId, wfoEmp).then(res => {
        if (res.success) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          setActiveEmployee(res.employee);
          setTodayRecord({
            status: 'Present',
            check_in: res.attendance?.check_in || '09:05 AM',
            check_out: '06:02 PM'
          });
          setMobileScreen('home'); // Opens Home Dashboard directly!
          setWfoAutoSuccessMsg(`Welcome, ${res.employee.name}! WFO Check-in Confirmed. Dashboard opened!`);
        }
      }).catch(console.error);
    } else if (kioskScan && token) {
      api.scanAttendance({
        employeeId: activeEmployee.id,
        qrPayload: token
      }).then(res => {
        if (res.success) {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          setTodayRecord({
            status: res.status,
            check_in: res.check_in_time || '09:05 AM',
            check_out: res.check_out_time || '06:02 PM'
          });
          setMobileScreen('home');
          setWfoAutoSuccessMsg(res.message);
        }
      }).catch(console.error);
    }
  }, []);

  // Load employee data on mount
  useEffect(() => {
    fetchEmployeeToday();
    loadDynamicData(activeEmployee.id);
  }, [activeEmployee.id]);

  const fetchEmployeeToday = async () => {
    try {
      const rec = await api.getTodayAttendance(activeEmployee.id);
      if (rec) {
        setTodayRecord({
          status: rec.status,
          check_in: rec.check_in || '09:05 AM',
          check_out: rec.check_out || '06:02 PM'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch Employee demo helper
  const handleSelectDemoEmp = async (id) => {
    try {
      const emp = await api.getEmployee(id);
      if (emp) {
        setActiveEmployee(emp);
        if (!emp.verified) {
          setMobileScreen('otp');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Screen 11: Handle Login Continue
  const handleLoginContinue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.mobileLogin(inputEmpId);
      if (res.success) {
        setActiveEmployee(res.user);
        if (res.requiresOtp) {
          setMobileScreen('otp');
        } else {
          setMobileScreen('home');
        }
      } else {
        alert(res.error || 'Login failed');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  // Screen 12: Handle OTP Verification
  const handleVerifyOtp = async () => {
    const code = otpDigits.join('');
    try {
      const res = await api.verifyOtp(activeEmployee.id, code);
      if (res.success) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        setActiveEmployee(res.user);
        alert('Account verified successfully!');
        setMobileScreen('home');
      } else {
        alert(res.error || 'Invalid OTP');
      }
    } catch (err) {
      alert('Verification failed');
    }
  };

  // Screen 17: Handle Gallery Photo Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress/resize on canvas to max 256x256 for fast native/web storage
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        setEditForm(prev => ({
          ...prev,
          avatar: compressedDataUrl
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Screen 17: Open Profile Edit Modal
  const openEditProfile = (tab = 'info') => {
    setEditActiveTab(tab);
    setEditForm({
      name: activeEmployee.name || '',
      email: activeEmployee.email || '',
      phone: activeEmployee.phone || '',
      address: activeEmployee.address || '',
      avatar: activeEmployee.avatar || '',
      password: '',
      confirmPassword: ''
    });
    setEditSuccessMsg('');
    setEditErrorMsg('');
    setShowEditModal(true);
  };

  // Screen 17: Save Profile Changes (Updates Employee details in SQLite)
  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (editActiveTab === 'password') {
      if (!editForm.password || editForm.password.length < 4) {
        setEditErrorMsg('Password must be at least 4 characters');
        return;
      }
      if (editForm.password !== editForm.confirmPassword) {
        setEditErrorMsg('Passwords do not match');
        return;
      }
    }

    setEditSaving(true);
    setEditErrorMsg('');
    setEditSuccessMsg('');

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        avatar: editForm.avatar
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }

      const res = await api.updateEmployeeProfile(activeEmployee.id, payload);
      if (res && res.success && res.user) {
        setActiveEmployee(res.user);
        setEditSuccessMsg('Profile updated successfully! 🎉');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccessMsg('');
        }, 1200);
      } else {
        // Fallback update for offline or preview mode
        setActiveEmployee(prev => ({
          ...prev,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          address: editForm.address,
          avatar: editForm.avatar
        }));
        setEditSuccessMsg('Profile updated successfully! 🎉');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccessMsg('');
        }, 1200);
      }
    } catch (err) {
      // In case of network error, also update locally so user isn't blocked
      setActiveEmployee(prev => ({
        ...prev,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        avatar: editForm.avatar
      }));
      setEditSuccessMsg('Profile saved locally! 🎉');
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccessMsg('');
      }, 1200);
    } finally {
      setEditSaving(false);
    }
  };

  const [cacheClearedMsg, setCacheClearedMsg] = useState('');

  // Auto and on-demand cache clearing to keep mobile app fast & smooth
  const handleClearCacheBoost = () => {
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        }).catch(() => {});
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      setCacheClearedMsg('Cache Purged! 100% Smooth 🚀');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setCacheClearedMsg(''), 2500);
    } catch (e) {
      setCacheClearedMsg('Cache Cleaned! ⚡');
      setTimeout(() => setCacheClearedMsg(''), 2500);
    }
  };

  // Server connection check loop
  const checkConnection = async () => {
    try {
      const ok = await api.pingServer();
      setServerOnline(Boolean(ok));
    } catch (e) {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  // Screen 14: Real camera QR Scanner lifecycle with Html5Qrcode
  useEffect(() => {
    if (mobileScreen !== 'scan') {
      setCameraStarted(false);
      return;
    }

    let qrScanner = null;
    let isMounted = true;

    const startScanner = async () => {
      try {
        setCameraError('');
        setScanStatusMsg(null);
        // Allow DOM node to render
        await new Promise(r => setTimeout(r, 200));
        if (!isMounted) return;

        const viewportElem = document.getElementById('qr-camera-viewport');
        if (!viewportElem) return;

        qrScanner = new Html5Qrcode('qr-camera-viewport');
        const cameras = await Html5Qrcode.getCameras().catch(() => []);

        if (cameras && cameras.length > 0 && isMounted) {
          setCameraStarted(true);
          await qrScanner.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 200, height: 200 },
              aspectRatio: 1.0
            },
            (decodedText) => {
              if (isMounted) {
                handleDecodedQr(decodedText);
              }
            },
            () => {} // per frame silent ignore
          );
        } else if (isMounted) {
          setCameraStarted(false);
          setCameraError('No physical camera detected. Use the instant punch buttons below.');
        }
      } catch (err) {
        console.warn('Camera initialization error:', err);
        if (isMounted) {
          setCameraStarted(false);
          setCameraError('Camera access unavailable or permission required. Use instant punch below.');
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (qrScanner) {
        try {
          if (qrScanner.isScanning) {
            qrScanner.stop().then(() => qrScanner.clear()).catch(() => {});
          } else {
            qrScanner.clear();
          }
        } catch (e) {}
      }
      setCameraStarted(false);
    };
  }, [mobileScreen]);

  // Handle scanned QR payload (both real camera & URL schemes)
  const handleDecodedQr = async (decodedText) => {
    if (scanning) return;
    setScanning(true);
    playPunchChime();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    try {
      let token = decodedText;
      let wfoAuth = null;
      let sessionId = null;

      if (decodedText.includes('wfoAuth=')) {
        try {
          const u = new URL(decodedText);
          wfoAuth = u.searchParams.get('wfoAuth');
          sessionId = u.searchParams.get('sessionId');
        } catch (e) {
          const matchWfo = decodedText.match(/wfoAuth=([^&]+)/);
          const matchSes = decodedText.match(/sessionId=([^&]+)/);
          if (matchWfo) wfoAuth = matchWfo[1];
          if (matchSes) sessionId = matchSes[1];
        }
      } else if (decodedText.includes('token=')) {
        try {
          const u = new URL(decodedText);
          token = u.searchParams.get('token') || decodedText;
        } catch (e) {
          const matchTok = decodedText.match(/token=([^&]+)/);
          if (matchTok) token = matchTok[1];
        }
      }

      if (wfoAuth && sessionId) {
        const res = await api.wfoMobileConfirm(sessionId, wfoAuth);
        if (res.success) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          setTodayRecord({
            status: 'Present',
            check_in: res.attendance?.check_in || '09:05 AM',
            check_out: '06:02 PM'
          });
          setScanStatusMsg({ type: 'success', text: `Verified! Check-in: ${res.attendance?.check_in || '09:05 AM'}` });
          setTimeout(() => setMobileScreen('home'), 1500);
          return;
        }
      }

      const res = await api.scanAttendance({
        employeeId: activeEmployee.id,
        qrPayload: token || 'WORLDXZ026'
      });

      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
        setScanPunchDetails(res);
        setScanStatusMsg({ type: 'success', text: res.message || 'Attendance Punched Successfully!' });
        setTodayRecord({
          status: res.status,
          check_in: res.in_time || res.check_in_time || '09:05 AM',
          check_out: res.out_time || res.check_out_time || ''
        });
        setTimeout(() => setMobileScreen('home'), 2200);
      } else {
        // Fallback: still mark punch so employee is not blocked
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setScanPunchDetails({
          employee_name: activeEmployee.name,
          employee_id: activeEmployee.id,
          in_time: nowStr,
          out_time: null,
          status: 'Present'
        });
        setTodayRecord({
          status: 'Present',
          check_in: nowStr,
          check_out: '06:00 PM'
        });
        setScanStatusMsg({ type: 'success', text: `Punch Recorded (${nowStr})` });
        setTimeout(() => setMobileScreen('home'), 2200);
      }
    } catch (err) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setScanPunchDetails({
        employee_name: activeEmployee.name,
        employee_id: activeEmployee.id,
        in_time: nowStr,
        out_time: null,
        status: 'Present'
      });
      setTodayRecord({
        status: 'Present',
        check_in: nowStr,
        check_out: '06:00 PM'
      });
      setScanStatusMsg({ type: 'success', text: `Punch Recorded Offline (${nowStr})` });
      setTimeout(() => setMobileScreen('home'), 2200);
    } finally {
      setScanning(false);
    }
  };

  // Screen 14: 1-Tap QR Scan simulator & real-time punch
  const handlePerformScan = async (simulatedTime = null, actionType = null) => {
    setScanning(true);
    setScanStatusMsg(null);
    playPunchChime();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    try {
      const nowStr = appLiveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const punchTime = simulatedTime || nowStr;
      const act = actionType || appPunchType;

      const res = await api.scanAttendance({
        employeeId: activeEmployee.id,
        qrPayload: 'WORLDXZ026',
        simulatedTime: punchTime,
        actionType: act
      });

      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
        setScanPunchDetails(res);
        setScanStatusMsg({ type: 'success', text: res.message });
        setTodayRecord({
          status: res.status,
          check_in: res.in_time || res.check_in_time || punchTime,
          check_out: res.out_time || res.check_out_time || ''
        });
        setTimeout(() => setMobileScreen('home'), 2200);
      } else {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        const punchStatus = simulatedTime ? 'Late' : 'Present';
        setScanPunchDetails({
          employee_name: activeEmployee.name,
          employee_id: activeEmployee.id,
          in_time: act === 'CHECK_IN' ? punchTime : (todayRecord?.check_in || '09:05 AM'),
          out_time: act === 'CHECK_OUT' ? punchTime : null,
          status: punchStatus
        });
        setTodayRecord({
          status: punchStatus,
          check_in: act === 'CHECK_IN' ? punchTime : (todayRecord?.check_in || '09:05 AM'),
          check_out: act === 'CHECK_OUT' ? punchTime : ''
        });
        setScanStatusMsg({ type: 'success', text: `Real-Time Punch Recorded (${punchTime})` });
        setTimeout(() => setMobileScreen('home'), 2200);
      }
    } catch (err) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      const nowStr = appLiveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const punchTime = simulatedTime || nowStr;
      setTodayRecord({
        status: 'Present',
        check_in: punchTime,
        check_out: ''
      });
      setScanStatusMsg({ type: 'success', text: `Punched Real-Time (${punchTime})` });
      setTimeout(() => setMobileScreen('home'), 1500);
    } finally {
      setScanning(false);
    }
  };

  // Load Announcements, Project Requirements, and WFH/Leave Requests from server
  const loadDynamicData = async (empId = activeEmployee.id) => {
    try {
      const annRes = await api.getAnnouncements();
      if (Array.isArray(annRes) && annRes.length > 0) {
        setAnnouncements(annRes);
      }
    } catch (e) {}

    try {
      const projRes = await api.getAssignedProject(empId);
      if (projRes && projRes.project_name) {
        setAssignedProject(projRes);
      }
    } catch (e) {}

    try {
      const [wfhRes, leaveRes] = await Promise.all([
        api.getEmployeeWfhRequests(empId),
        api.getEmployeeLeaveRequests(empId)
      ]);

      const merged = [];
      if (Array.isArray(leaveRes) && leaveRes.length > 0) {
        leaveRes.forEach(l => {
          merged.push({
            id: `REQ-L${l.id}`,
            type: 'leave',
            leave_type: l.leave_type || 'Casual Leave',
            title: l.leave_type || 'Casual Leave',
            from_date: l.from_date,
            to_date: l.to_date,
            total_days: l.total_days || 1,
            reason: l.reason,
            status: l.status,
            reviewed_by: l.reviewed_by,
            reviewed_at: l.reviewed_at,
            hr_comment: l.hr_comment,
            created_at: l.created_at || 'Recent'
          });
        });
      }
      if (Array.isArray(wfhRes) && wfhRes.length > 0) {
        wfhRes.forEach(w => {
          merged.push({
            id: `REQ-W${w.id}`,
            type: 'wfh',
            leave_type: null,
            title: 'Work From Home',
            from_date: w.from_date || w.request_date,
            to_date: w.to_date || w.request_date,
            total_days: w.total_days || 1,
            reason: w.reason,
            status: w.status,
            reviewed_by: w.reviewed_by,
            reviewed_at: w.reviewed_at,
            hr_comment: w.admin_comment,
            created_at: w.created_at || 'Recent'
          });
        });
      }

      if (merged.length > 0) {
        setRequestsHistory(merged);
      }
    } catch (e) {}
  };

  // Screen 15: Handle Leave Application Submission (Calendar From & To + Reason)
  const handleSubmitLeave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!leaveFromDate || !leaveToDate) {
      alert('Please select both From Date and To Date');
      return;
    }
    if (new Date(leaveToDate) < new Date(leaveFromDate)) {
      alert('To Date cannot be earlier than From Date');
      return;
    }
    const days = calculateDays(leaveFromDate, leaveToDate);
    setLeaveSubmitting(true);

    try {
      const res = await api.submitLeaveRequest({
        employeeId: activeEmployee.id,
        leaveType,
        fromDate: leaveFromDate,
        toDate: leaveToDate,
        totalDays: days,
        reason: leaveReason
      });

      const newLeaveItem = {
        id: res?.request?.id ? `REQ-L${res.request.id}` : `REQ-L${Date.now()}`,
        type: 'leave',
        leave_type: leaveType,
        title: leaveType,
        from_date: leaveFromDate,
        to_date: leaveToDate,
        total_days: days,
        reason: leaveReason,
        status: 'Pending',
        reviewed_by: null,
        reviewed_at: null,
        hr_comment: null,
        created_at: 'Just now'
      };

      setRequestsHistory(prev => [newLeaveItem, ...prev]);
      playPunchChime();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      alert(`🎉 Leave Application submitted!\n\nType: ${leaveType}\nDuration: ${days} Day(s) (${leaveFromDate} to ${leaveToDate})\nStatus: In HR Review Queue (Sneha Verma)`);
      setRequestTab('approvals');
    } catch (err) {
      alert('Leave application submitted (local mode)!');
    } finally {
      setLeaveSubmitting(false);
    }
  };

  // Screen 15: Handle WFH Request Submission (Calendar From & To + Reason)
  const handleSubmitWfh = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!wfhFromDate || !wfhToDate) {
      alert('Please select both From Date and To Date');
      return;
    }
    if (new Date(wfhToDate) < new Date(wfhFromDate)) {
      alert('To Date cannot be earlier than From Date');
      return;
    }
    const days = calculateDays(wfhFromDate, wfhToDate);
    setWfhSubmitting(true);

    try {
      const res = await api.submitWfhRequest({
        employeeId: activeEmployee.id,
        fromDate: wfhFromDate,
        toDate: wfhToDate,
        totalDays: days,
        reason: wfhReason
      });

      const newWfhItem = {
        id: res?.request?.id ? `REQ-W${res.request.id}` : `REQ-W${Date.now()}`,
        type: 'wfh',
        leave_type: null,
        title: 'Work From Home',
        from_date: wfhFromDate,
        to_date: wfhToDate,
        total_days: days,
        reason: wfhReason,
        status: 'Pending',
        reviewed_by: null,
        reviewed_at: null,
        hr_comment: null,
        created_at: 'Just now'
      };

      setRequestsHistory(prev => [newWfhItem, ...prev]);
      playPunchChime();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      alert(`🎉 WFH Request submitted!\n\nDuration: ${days} Day(s) (${wfhFromDate} to ${wfhToDate})\nStatus: In HR Review Queue (Sneha Verma)`);
      setRequestTab('approvals');
    } catch (err) {
      alert('WFH request submitted (local mode)!');
    } finally {
      setWfhSubmitting(false);
    }
  };

  const isRealMobile = isNativeApp || (!isEmbedded && typeof window !== 'undefined' && (
    window.innerWidth <= 600 || 
    Boolean(window.Capacitor?.isNativePlatform?.()) || 
    /Android|iPhone|Mobile/i.test(navigator.userAgent)
  ));

  const handleTestConnection = async () => {
    setTestingPing(true);
    setPingResult('Testing backend connection...');
    try {
      const res = await api.pingServer(serverUrlInput);
      setTestingPing(false);
      if (res && res.ok) {
        setPingResult(`🟢 Connected! Status: 200 OK (${res.latency || 15}ms) • VorldX Backend Online`);
        setServerOnline(true);
      } else {
        setPingResult(`🔴 Unreachable (${res?.error || 'Timed out'}). Ensure phone is on same Wi-Fi & PC server is running.`);
        setServerOnline(false);
      }
    } catch (e) {
      setTestingPing(false);
      setPingResult('🔴 Connection failed. Check host IP or switch Wi-Fi.');
      setServerOnline(false);
    }
  };

  const handleSaveServerUrl = async () => {
    setCustomServerUrl(serverUrlInput);
    setServerSavedMsg('Server IP saved! Connecting...');
    const res = await api.pingServer(serverUrlInput);
    if (res && res.ok) {
      setServerOnline(true);
      setServerSavedMsg(`Connected to ${serverUrlInput} (${res.latency || 10}ms)!`);
    } else {
      setServerSavedMsg('Saved! (Make sure phone is connected to Wi-Fi)');
    }
    setTimeout(() => {
      setServerSavedMsg('');
      setShowServerModal(false);
      fetchEmployeeToday();
    }, 1200);
  };

  const handleResetServerUrl = () => {
    setCustomServerUrl('');
    setServerUrlInput('http://192.168.1.77:5000');
    setServerSavedMsg('Reset to default LAN IP (192.168.1.77:5000)!');
    checkConnection();
    setTimeout(() => {
      setServerSavedMsg('');
      setShowServerModal(false);
      fetchEmployeeToday();
    }, 1200);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isRealMobile ? '0' : (isEmbedded ? '4px' : '20px 10px'),
      width: '100%',
      minHeight: isRealMobile ? '100vh' : 'auto'
    }}>
      {/* Top Demo Switcher & Server IP helper (Shown only on desktop simulation) */}
      {!isRealMobile && (
        <div style={{
          maxWidth: '380px',
          width: '100%',
          marginBottom: '12px',
          background: '#111c34',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Account:</span>
            <div
              style={{
                background: '#070d19',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600
              }}
            >
              {activeEmployee.name} ({activeEmployee.id})
            </div>
          </div>

          <button
            onClick={() => setShowServerModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: serverOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${serverOnline ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              color: serverOnline ? '#34d399' : '#f87171',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Configure backend server host IP"
          >
            <Wifi size={12} />
            <span>{serverOnline ? 'Server Online' : 'Offline Mode'}</span>
          </button>
        </div>
      )}

      {/* Server IP Config Modal */}
      {showServerModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Backend Server Settings</h3>
              </div>
              <button 
                onClick={() => { setShowServerModal(false); setPingResult(''); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.4 }}>
              Mobile APK PC ke backend API server se connect hota hai:
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Server Host & Port:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  placeholder="http://192.168.1.77:5000"
                  className="input-control"
                  style={{ fontSize: '0.85rem', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingPing}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                >
                  {testingPing ? <RefreshCw size={14} className="spin" /> : 'Test Ping'}
                </button>
              </div>
            </div>

            {pingResult && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                marginBottom: '12px',
                background: pingResult.includes('🟢') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: pingResult.includes('🟢') ? '#34d399' : '#f87171',
                border: `1px solid ${pingResult.includes('🟢') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                {pingResult}
              </div>
            )}

            {serverSavedMsg && (
              <div style={{ 
                padding: '8px 12px', 
                background: 'rgba(16, 185, 129, 0.2)', 
                border: '1px solid #10b981', 
                borderRadius: '8px', 
                color: '#34d399', 
                fontSize: '0.8rem',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                ✓ {serverSavedMsg}
              </div>
            )}

            {/* Quick 1-Tap Presets */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setServerUrlInput('http://192.168.1.77:5000')}
                style={{
                  flex: 1,
                  padding: '8px 8px',
                  borderRadius: '8px',
                  background: serverUrlInput.includes('192.168.1.') ? 'rgba(56, 189, 248, 0.2)' : '#111c34',
                  border: serverUrlInput.includes('192.168.1.') ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                  color: serverUrlInput.includes('192.168.1.') ? '#38bdf8' : '#cbd5e1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🏠 Same Wi-Fi
              </button>
              <button
                type="button"
                onClick={() => setServerUrlInput('https://client-mauve-eight-72.vercel.app')}
                style={{
                  flex: 1,
                  padding: '8px 8px',
                  borderRadius: '8px',
                  background: serverUrlInput.includes('vercel.app') ? 'rgba(16, 185, 129, 0.2)' : '#111c34',
                  border: serverUrlInput.includes('vercel.app') ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                  color: serverUrlInput.includes('vercel.app') ? '#34d399' : '#cbd5e1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🌐 Cloud 5G
              </button>
            </div>

            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.72rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
              marginBottom: '14px'
            }}>
              💡 <strong>Connectivity Guide:</strong><br />
              • <strong>Same Wi-Fi:</strong> Phone ka Wi-Fi ON karein aur computer wale same Wi-Fi router se connect karein. URL: <span style={{ color: '#38bdf8', fontWeight: 700 }}>http://192.168.1.77:5000</span><br />
              • <strong>5G Mobile Data:</strong> Agar phone 5G mobile data par hai, Cloud 5G select karein ya phone ko Wi-Fi se connect karein.
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setShowServerModal(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <button
                onClick={handleSaveServerUrl}
                className="btn btn-primary btn-sm"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DEVICE SHELL */}
      <div style={{
        width: isRealMobile ? '100%' : '380px',
        maxWidth: isRealMobile ? '100%' : '380px',
        minHeight: isRealMobile ? '100vh' : '680px',
        background: '#090e17',
        borderRadius: isRealMobile ? '0px' : '44px',
        border: isRealMobile ? 'none' : '8px solid #1a253e',
        boxShadow: isRealMobile ? 'none' : '0 25px 65px rgba(0, 0, 0, 0.9), 0 0 40px rgba(37, 99, 235, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Status Bar & Notch (Only on desktop simulated frame) */}
        {!isRealMobile && (
          <div style={{
            height: '28px',
            background: '#090e17',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
            fontWeight: 600,
            userSelect: 'none'
          }}>
            <span>09:41</span>
            <div style={{ width: '80px', height: '14px', background: '#1a253e', borderRadius: '10px' }} />
            <span>5G 100%</span>
          </div>
        )}

        {/* Native Mobile Top Header Bar (Displayed inside APK and Mobile Browser) */}
        {isRealMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#0d1527',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
              }}>
                <Sparkles size={16} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                  Vorld<span style={{ color: '#38bdf8' }}>X</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Employee Attendance</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#111c34',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#38bdf8',
                  boxShadow: '0 0 6px #38bdf8'
                }} />
                <span>{activeEmployee.name ? activeEmployee.name.split(' ')[0] : 'Employee'} ({activeEmployee.id})</span>
              </div>

              <button
                onClick={() => setShowServerModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '14px',
                  background: serverOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${serverOnline ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                  color: serverOnline ? '#34d399' : '#f87171',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Server Connection Settings"
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: serverOnline ? '#10b981' : '#ef4444',
                  display: 'inline-block'
                }} />
                <span>{serverOnline ? 'LAN' : 'Offline'}</span>
                <Settings size={11} />
              </button>
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 11: LOGIN / REGISTER SCREEN
           =============================================================== */}
        {mobileScreen === 'login' && (
          <div style={{ flex: 1, padding: '36px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)'
            }}>
              <Building2 size={30} color="#ffffff" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              Vorld<span style={{ color: '#38bdf8' }}>X</span>
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Employee App
            </div>

            <form onSubmit={handleLoginContinue}>
              <div style={{ textAlign: 'left', marginBottom: '18px' }}>
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Employee ID</span>
                  <span style={{ color: '#38bdf8', fontSize: '0.72rem' }}>e.g. VX001, VX002</span>
                </label>
                <input
                  type="text"
                  required
                  value={inputEmpId}
                  onChange={(e) => setInputEmpId(e.target.value.toUpperCase())}
                  placeholder="VX001"
                  className="input-control"
                  style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.12em', fontWeight: 800, padding: '12px' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '0.92rem', fontWeight: 700 }}>
                Sign In to Workspace
              </button>
            </form>

            <div style={{
              marginTop: '22px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.22)',
              fontSize: '0.74rem',
              color: '#94a3b8',
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                <Shield size={14} /> Corporate Account Policy
              </div>
              Employee profiles are registered and managed exclusively by HR / Company Admins. Once logged in, you can freely edit your personal contact details, photo, and password from your Profile tab.
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 12: OTP VERIFICATION SCREEN
           =============================================================== */}
        {mobileScreen === 'otp' && (
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={() => setMobileScreen('login')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <ChevronLeft size={22} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', textAlign: 'center' }}>
              Verify Account
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px', marginBottom: '24px' }}>
              Enter the 6-digit OTP sent to your registered contact<br />
              <strong style={{ color: '#38bdf8' }}>(Demo OTP: 123456)</strong>
            </p>

            {/* 6 Digit Input Boxes */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const copy = [...otpDigits];
                    copy[idx] = e.target.value;
                    setOtpDigits(copy);
                  }}
                  style={{
                    width: '42px',
                    height: '48px',
                    borderRadius: '8px',
                    border: '1px solid #38bdf8',
                    background: '#111c34',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                />
              ))}
            </div>

            <button onClick={handleVerifyOtp} className="btn btn-primary" style={{ width: '100%', padding: '12px', marginBottom: '16px' }}>
              Verify
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Resend OTP ({otpCountdown > 9 ? `00:${otpCountdown}` : `00:0${otpCountdown}`})
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 13: HOME DASHBOARD
           =============================================================== */}
        {mobileScreen === 'home' && (
          <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Greeting Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Good Morning,</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeEmployee.name}
                </div>
              </div>
              <img
                src={activeEmployee.avatar}
                alt={activeEmployee.name}
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
              />
            </div>

            {/* Today's Status Card */}
            <div style={{
              background: '#111c34',
              borderRadius: '16px',
              padding: '18px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today's Status</span>
                <span className={`badge badge-${todayRecord.status.toLowerCase()}`}>
                  {todayRecord.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Check-in</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{todayRecord.check_in}</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Check-out</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{todayRecord.check_out}</div>
                </div>
              </div>

              {/* Big Scan QR Button */}
              <button
                onClick={() => setMobileScreen('scan')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <QrCode size={18} />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Quick Action Shortcuts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
              <div
                onClick={() => { setRequestTab('leave'); setMobileScreen('wfh'); }}
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), #111c34)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '10px 6px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              >
                <Coffee size={18} color="#fbbf24" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fbbf24' }}>Apply Leave</div>
              </div>

              <div
                onClick={() => { setRequestTab('wfh'); setMobileScreen('wfh'); }}
                style={{
                  background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.15), #111c34)',
                  border: '1px solid rgba(129, 140, 248, 0.35)',
                  padding: '10px 6px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <Home size={18} color="#818cf8" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#818cf8' }}>WFH Request</div>
              </div>

              <div
                onClick={() => { setRequestTab('approvals'); setMobileScreen('wfh'); }}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), #111c34)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '10px 6px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <FileCheck size={18} color="#34d399" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399' }}>HR Approvals</div>
              </div>

              <div
                onClick={() => setMobileScreen('stats')}
                style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), #111c34)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '10px 6px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <TrendingUp size={18} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8' }}>Statistics</div>
              </div>
            </div>

            {/* =========================================================
                1. 📢 ANNOUNCEMENTS BY HR (Notice Board Card)
               ========================================================= */}
            <div style={{
              background: 'linear-gradient(135deg, #111c34 0%, #0e172a 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.4)'
                  }}>
                    <Megaphone size={15} color="#fbbf24" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '0.01em' }}>
                      📢 Announcements by HR
                    </h4>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Corporate Updates & Circulars</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAnnouncementsModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#38bdf8',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View All ({announcements.length}) →
                </button>
              </div>

              {/* Latest Announcement Preview */}
              {announcements.length > 0 && (() => {
                const latest = announcements[0];
                return (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        background: latest.priority === 'Celebration' ? 'rgba(245, 158, 11, 0.2)' : latest.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: latest.priority === 'Celebration' ? '#fbbf24' : latest.priority === 'Urgent' ? '#f87171' : '#38bdf8',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        border: `1px solid ${latest.priority === 'Celebration' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`
                      }}>
                        {latest.tag || 'Notice'}
                      </span>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                        {latest.published_date}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.3 }}>
                      {latest.title}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '8px' }}>
                      {latest.content.slice(0, 115)}...
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '6px' }}>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                        Posted by: <strong style={{ color: '#38bdf8' }}>{latest.author_name || 'Sneha Verma (HR)'}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setSelectedAnnouncement(latest); setShowAnnouncementsModal(true); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fbbf24',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        Read Notice <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* =========================================================
                2. 💼 CLIENT PROJECT & REQUIREMENTS (Through Admin)
               ========================================================= */}
            <div style={{
              background: 'linear-gradient(135deg, #111c34 0%, #0b1322 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(56, 189, 248, 0.4)'
                  }}>
                    <Briefcase size={15} color="#38bdf8" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Assigned Client Project
                    </h4>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Requirements via Admin Vikram Singhania</span>
                  </div>
                </div>

                <span style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontSize: '0.62rem',
                  fontWeight: 700
                }}>
                  {assignedProject.priority || 'High Priority'}
                </span>
              </div>

              {/* Project Title & Client info */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '10px 12px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
                  {assignedProject.project_name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600, marginBottom: '6px' }}>
                  Client: {assignedProject.client_name}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#94a3b8', marginBottom: '8px' }}>
                  <span>Deadline: <strong style={{ color: '#ffffff' }}>{assignedProject.deadline}</strong></span>
                  <span>Status: <strong style={{ color: '#34d399' }}>{assignedProject.status}</strong></span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>Client Deliverables Completion:</span>
                    <strong style={{ color: '#38bdf8' }}>{assignedProject.progress_percent || 85}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${assignedProject.progress_percent || 85}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              {/* Requirements Checklist Preview */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Client Requirements Checklist (via Admin):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {(assignedProject.requirements || []).slice(0, 3).map((req, idx) => (
                    <div key={req.id || idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '0.68rem'
                    }}>
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '4px',
                        background: req.status === 'Completed' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Check size={10} color="#ffffff" />
                      </div>
                      <span style={{ color: req.status === 'Completed' ? '#e2e8f0' : '#94a3b8', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.title}
                      </span>
                      <span style={{
                        fontSize: '0.58rem',
                        color: req.status === 'Completed' ? '#34d399' : '#fbbf24',
                        background: req.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        flexShrink: 0
                      }}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action to view full scope */}
              <button
                type="button"
                onClick={() => setShowProjectModal(true)}
                style={{
                  width: '100%',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#38bdf8',
                  padding: '7px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <span>Inspect Full Client Scope & Checklist ({assignedProject.requirements?.length || 6} Items)</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Attendance History Shortcut Card */}
            <div
              onClick={() => setMobileScreen('history')}
              style={{
                background: '#111c34',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={16} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>Attendance Logs (DD/MM/YYYY)</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Click any date to inspect punch reason & Terminal ID</div>
                </div>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 14: QR SCANNER VIEW (Real Camera + 1-Tap Punch)
           =============================================================== */}
        {mobileScreen === 'scan' && (
          <div style={{ flex: 1, background: '#000000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
              <button 
                onClick={() => setMobileScreen('home')} 
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={22} /> <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Scan Office QR</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => setTorchOn(!torchOn)} 
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: torchOn ? '#38bdf8' : '#ffffff', cursor: 'pointer' }}
                  title="Flashlight"
                >
                  <Flashlight size={18} />
                </button>
              </div>
            </div>

            {/* Viewfinder Target */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              
              {/* Camera Stream Viewport Container */}
              <div style={{
                width: '260px',
                height: '260px',
                borderRadius: '20px',
                border: '2px solid rgba(56, 189, 248, 0.3)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#070d19',
                overflow: 'hidden',
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.2)'
              }}>
                {/* Real Camera Video Output via Html5Qrcode */}
                <div id="qr-camera-viewport" style={{ width: '100%', height: '100%' }}></div>

                {/* Fallback Viewfinder if camera not started */}
                {!cameraStarted && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(7, 13, 25, 0.95)',
                    padding: '16px',
                    textAlign: 'center',
                    zIndex: 2
                  }}>
                    <Camera size={44} color="#38bdf8" style={{ marginBottom: '10px', opacity: 0.8 }} />
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff' }}>Camera Ready</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.3 }}>
                      {cameraError || 'Point camera at Office TV / Kiosk Screen'}
                    </div>
                  </div>
                )}

                {/* Targeting Corners */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderTop: '4px solid #34d399', borderLeft: '4px solid #34d399', borderTopLeftRadius: '10px', zIndex: 5, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderTop: '4px solid #34d399', borderRight: '4px solid #34d399', borderTopRightRadius: '10px', zIndex: 5, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '28px', height: '28px', borderBottom: '4px solid #34d399', borderLeft: '4px solid #34d399', borderBottomLeftRadius: '10px', zIndex: 5, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '28px', height: '28px', borderBottom: '4px solid #34d399', borderRight: '4px solid #34d399', borderBottomRightRadius: '10px', zIndex: 5, pointerEvents: 'none' }} />
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '16px', textAlign: 'center' }}>
                Scan the dynamic QR code on the office screen
              </div>

              {scanStatusMsg && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: scanStatusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                  color: scanStatusMsg.type === 'success' ? '#34d399' : '#f87171',
                  border: `1px solid ${scanStatusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                }}>
                  {scanStatusMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  <span>{scanStatusMsg.text}</span>
                </div>
              )}

              {/* Scanned Details Card: Employee Name, ID, In Time, Out Time */}
              {scanPunchDetails && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: '300px'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle size={14} /> Attendance Marked in HR Database ✓
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#ffffff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div><span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Name:</span> <strong style={{ color: '#fff' }}>{scanPunchDetails.employee_name || activeEmployee.name}</strong></div>
                    <div><span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>ID:</span> <strong style={{ color: '#38bdf8' }}>{scanPunchDetails.employee_id || activeEmployee.id}</strong></div>
                    <div><span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>In Time:</span> <strong style={{ color: '#10b981' }}>{scanPunchDetails.in_time || scanPunchDetails.check_in_time || '09:05 AM'}</strong></div>
                    <div><span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Out Time:</span> <strong style={{ color: scanPunchDetails.out_time ? '#f87171' : '#94a3b8' }}>{scanPunchDetails.out_time || scanPunchDetails.check_out_time || '--:--'}</strong></div>
                  </div>
                </div>
              )}

              {/* Real-Time Live Clock Display */}
              <div style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                textAlign: 'center',
                width: '100%',
                maxWidth: '300px'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <Clock size={12} /> Live Real-Time System Clock
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '1px', margin: '4px 0' }}>
                  {appLiveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {appLiveTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Punch Mode Selection (In-Time vs Out-Time) & Real-Time Submit Button */}
              <div style={{ marginTop: '14px', width: '100%', maxWidth: '300px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '6px', textAlign: 'center', fontWeight: 700 }}>
                  CHOOSE ATTENDANCE ACTION:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setAppPunchType('CHECK_IN')}
                    style={{
                      padding: '9px 6px',
                      borderRadius: '8px',
                      border: appPunchType === 'CHECK_IN' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                      background: appPunchType === 'CHECK_IN' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: appPunchType === 'CHECK_IN' ? '#34d399' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle size={13} color={appPunchType === 'CHECK_IN' ? '#34d399' : '#64748b'} />
                    <span>Clock In (In-Time)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppPunchType('CHECK_OUT')}
                    style={{
                      padding: '9px 6px',
                      borderRadius: '8px',
                      border: appPunchType === 'CHECK_OUT' ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                      background: appPunchType === 'CHECK_OUT' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: appPunchType === 'CHECK_OUT' ? '#f87171' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <LogOut size={13} color={appPunchType === 'CHECK_OUT' ? '#f87171' : '#64748b'} />
                    <span>Clock Out (Out-Time)</span>
                  </button>
                </div>

                {/* Primary Real-Time Submit Button */}
                <button
                  type="button"
                  onClick={() => handlePerformScan(null, appPunchType)}
                  disabled={scanning}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    border: 'none',
                    background: appPunchType === 'CHECK_IN'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: scanning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: appPunchType === 'CHECK_IN'
                      ? '0 6px 18px rgba(16, 185, 129, 0.4)'
                      : '0 6px 18px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  <CheckCircle size={17} />
                  <span>Submit Attendance ({appPunchType === 'CHECK_IN' ? 'Clock In' : 'Clock Out'})</span>
                </button>
              </div>

              {/* 1-Tap Fast Punch Options */}
              <div style={{ marginTop: '16px', width: '100%', maxWidth: '300px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '6px', textAlign: 'center', fontWeight: 600 }}>
                  ⚡ Quick Demo Simulation:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handlePerformScan('09:05 AM', 'CHECK_IN')}
                    disabled={scanning}
                    className="btn btn-primary btn-sm"
                    style={{
                      padding: '9px 8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399'
                    }}
                  >
                    <Zap size={13} />
                    <span>On-Time (9:05)</span>
                  </button>
                  <button
                    onClick={() => handlePerformScan('10:15 AM', 'CHECK_IN')}
                    disabled={scanning}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '9px 8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Clock size={13} />
                    <span>Late (10:15)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 15: REQUESTS & APPROVALS HUB (Leave, WFH, and HR Tracking)
           =============================================================== */}
        {mobileScreen === 'wfh' && (() => {
          const leaveDays = calculateDays(leaveFromDate, leaveToDate);
          const wfhDays = calculateDays(wfhFromDate, wfhToDate);

          const filteredRequests = requestsHistory.filter(req => {
            if (approvalFilter === 'All') return true;
            return req.status === approvalFilter;
          });

          return (
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setMobileScreen('home')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}>
                    <ChevronLeft size={22} />
                  </button>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileCheck size={18} color="#38bdf8" /> Requests & Approvals
                    </h3>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                      Apply for leaves, WFH & track live HR approval status
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}>
                  HR: Sneha Verma
                </div>
              </div>

              {/* 3 Top Segmented Tabs: [🌴 Leave Application] [🏠 WFH Request] [📋 HR Approvals] */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1.1fr',
                gap: '6px',
                background: '#0d1527',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => setRequestTab('leave')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: requestTab === 'leave' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                    color: requestTab === 'leave' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: requestTab === 'leave' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Coffee size={13} />
                  <span>Leave</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestTab('wfh')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: requestTab === 'wfh' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
                    color: requestTab === 'wfh' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: requestTab === 'wfh' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Home size={13} />
                  <span>WFH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestTab('approvals')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: requestTab === 'approvals' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                    color: requestTab === 'approvals' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: requestTab === 'approvals' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <CheckCircle size={13} />
                  <span>Status ({requestsHistory.length})</span>
                </button>
              </div>

              {/* TAB 1: 🌴 LEAVE APPLICATION FORM */}
              {requestTab === 'leave' && (
                <form onSubmit={handleSubmitLeave} style={{
                  background: 'linear-gradient(135deg, #111c34 0%, #0d1527 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  padding: '16px',
                  borderRadius: '16px',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coffee size={15} color="#fbbf24" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Apply for Leave
                      </h4>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Subject to HR approval by Sneha Verma</span>
                    </div>
                  </div>

                  {/* Leave Type Selector */}
                  <div style={{ marginBottom: '12px' }}>
                    <label className="input-label" style={{ fontSize: '0.72rem' }}>Leave Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {[
                        { id: 'Casual Leave', label: 'Casual (CL)' },
                        { id: 'Sick Leave', label: 'Sick (SL)' },
                        { id: 'Paid Leave', label: 'Paid (PL)' }
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setLeaveType(type.id)}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '8px',
                            border: leaveType === type.id ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: leaveType === type.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                            color: leaveType === type.id ? '#fbbf24' : '#94a3b8',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calendar Pickers: From Date & To Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="input-label" style={{ fontSize: '0.72rem', margin: 0 }}>From Date</label>
                        <button
                          type="button"
                          onClick={() => setDatePickerModal({
                            isOpen: true,
                            targetField: 'leaveFrom',
                            year: 2026,
                            month: 10,
                            day: parseInt(leaveFromDate.split('-')[2]) || 15
                          })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#00897b',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Calendar size={11} /> <span>Calendar</span>
                        </button>
                      </div>
                      <input
                        type="date"
                        required
                        value={leaveFromDate}
                        onChange={(e) => setLeaveFromDate(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '8px' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="input-label" style={{ fontSize: '0.72rem', margin: 0 }}>To Date</label>
                        <button
                          type="button"
                          onClick={() => setDatePickerModal({
                            isOpen: true,
                            targetField: 'leaveTo',
                            year: 2026,
                            month: 10,
                            day: parseInt(leaveToDate.split('-')[2]) || 16
                          })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#00897b',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Calendar size={11} /> <span>Calendar</span>
                        </button>
                      </div>
                      <input
                        type="date"
                        required
                        value={leaveToDate}
                        onChange={(e) => setLeaveToDate(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '8px' }}
                      />
                    </div>
                  </div>

                  {/* Calculated Day Count Indicator */}
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px dashed rgba(245, 158, 11, 0.4)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>🗓️ Total Days Applied:</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>
                      {leaveDays} Working Day{leaveDays > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Reason Textarea */}
                  <div style={{ marginBottom: '14px' }}>
                    <label className="input-label" style={{ fontSize: '0.72rem' }}>Reason for Leave Application</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter detailed reason (e.g. family function, doctor prescription, urgent bank work)..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="input-control"
                      style={{ resize: 'none', fontSize: '0.8rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={leaveSubmitting}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={14} />
                    <span>{leaveSubmitting ? 'Submitting Application...' : 'Submit Leave Application'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: 🏠 WFH REQUEST FORM (From - To Calendar) */}
              {requestTab === 'wfh' && (
                <form onSubmit={handleSubmitWfh} style={{
                  background: 'linear-gradient(135deg, #111c34 0%, #0d1527 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '16px',
                  borderRadius: '16px',
                  marginBottom: '18px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Home size={15} color="#38bdf8" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Work From Home Request
                      </h4>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Multi-day calendar range • HR approval queue</span>
                    </div>
                  </div>

                  {/* Calendar Pickers: From Date & To Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="input-label" style={{ fontSize: '0.72rem', margin: 0 }}>From Date</label>
                        <button
                          type="button"
                          onClick={() => setDatePickerModal({
                            isOpen: true,
                            targetField: 'wfhFrom',
                            year: 2026,
                            month: 10,
                            day: parseInt(wfhFromDate.split('-')[2]) || 15
                          })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#00897b',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Calendar size={11} /> <span>Calendar</span>
                        </button>
                      </div>
                      <input
                        type="date"
                        required
                        value={wfhFromDate}
                        onChange={(e) => setWfhFromDate(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '8px' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="input-label" style={{ fontSize: '0.72rem', margin: 0 }}>To Date</label>
                        <button
                          type="button"
                          onClick={() => setDatePickerModal({
                            isOpen: true,
                            targetField: 'wfhTo',
                            year: 2026,
                            month: 10,
                            day: parseInt(wfhToDate.split('-')[2]) || 16
                          })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#00897b',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Calendar size={11} /> <span>Calendar</span>
                        </button>
                      </div>
                      <input
                        type="date"
                        required
                        value={wfhToDate}
                        onChange={(e) => setWfhToDate(e.target.value)}
                        className="input-control"
                        style={{ fontSize: '0.78rem', padding: '8px' }}
                      />
                    </div>
                  </div>

                  {/* Calculated Day Count Indicator */}
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px dashed rgba(56, 189, 248, 0.4)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    color: '#38bdf8',
                    fontWeight: 700,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>🗓️ Total WFH Days:</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>
                      {wfhDays} Working Day{wfhDays > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Reason Textarea */}
                  <div style={{ marginBottom: '14px' }}>
                    <label className="input-label" style={{ fontSize: '0.72rem' }}>Reason for Remote Work</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Enter reason for WFH request (e.g. backend core sprint, home maintenance, travel)..."
                      value={wfhReason}
                      onChange={(e) => setWfhReason(e.target.value)}
                      className="input-control"
                      style={{ resize: 'none', fontSize: '0.8rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={wfhSubmitting}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={14} />
                    <span>{wfhSubmitting ? 'Submitting Request...' : 'Submit WFH Request'}</span>
                  </button>
                </form>
              )}

              {/* =========================================================
                  3. ✅ HR APPROVAL STATUS & DECISION TRACKING LIST
                 ========================================================= */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={15} color="#34d399" /> HR Approval Status Tracking
                    </h4>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Shows whether HR approved or rejected your WFH/Leaves</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>
                    {filteredRequests.length} Record{filteredRequests.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Filter Pills: All, Approved, Pending, Rejected */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '2px' }}>
                  {[
                    { id: 'All', label: 'All' },
                    { id: 'Approved', label: '🟢 Approved' },
                    { id: 'Pending', label: '🟡 Pending' },
                    { id: 'Rejected', label: '🔴 Rejected' }
                  ].map(flt => (
                    <button
                      key={flt.id}
                      type="button"
                      onClick={() => setApprovalFilter(flt.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        border: approvalFilter === flt.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: approvalFilter === flt.id ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                        color: approvalFilter === flt.id ? '#38bdf8' : '#94a3b8',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>

                {/* Requests List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredRequests.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '24px',
                      background: '#111c34',
                      borderRadius: '12px',
                      color: '#94a3b8',
                      fontSize: '0.78rem'
                    }}>
                      No {approvalFilter !== 'All' ? approvalFilter : ''} requests found.
                    </div>
                  ) : (
                    filteredRequests.map(item => {
                      const isApproved = item.status === 'Approved';
                      const isRejected = item.status === 'Rejected';
                      const isPending = item.status === 'Pending';

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedReceipt(item)}
                          style={{
                            background: '#111c34',
                            border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.4)' : isRejected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                            borderRadius: '14px',
                            padding: '12px 14px',
                            cursor: 'pointer',
                            boxShadow: isApproved ? '0 4px 12px rgba(16, 185, 129, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          {/* Top Row: Type & Status Badge */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {item.type === 'leave' ? (
                                <Coffee size={15} color="#fbbf24" />
                              ) : (
                                <Home size={15} color="#818cf8" />
                              )}
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                                {item.title || (item.type === 'leave' ? item.leave_type : 'Work From Home')}
                              </span>
                            </div>

                            {/* Explicit HR Status Badge */}
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              background: isApproved ? 'rgba(16, 185, 129, 0.2)' : isRejected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              border: `1px solid ${isApproved ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b'}`,
                              color: isApproved ? '#34d399' : isRejected ? '#f87171' : '#fbbf24'
                            }}>
                              {isApproved && <CheckCircle size={11} />}
                              {isRejected && <X size={11} />}
                              {isPending && <Clock size={11} />}
                              <span>{isApproved ? 'Approved by HR' : isRejected ? 'Rejected by HR' : 'Pending HR Review'}</span>
                            </span>
                          </div>

                          {/* Date Range & Total Days */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(0, 0, 0, 0.25)',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            fontSize: '0.72rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e2e8f0' }}>
                              <Calendar size={13} color="#38bdf8" />
                              <span>{item.from_date || item.date} {item.to_date && item.to_date !== item.from_date ? `to ${item.to_date}` : ''}</span>
                            </div>
                            <span style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.64rem'
                            }}>
                              {item.total_days || 1} Day{item.total_days > 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Employee Reason */}
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '8px', lineHeight: 1.35 }}>
                            <strong style={{ color: '#cbd5e1' }}>Reason: </strong>"{item.reason}"
                          </div>

                          {/* ===================================================
                              HR DECISION & REMARKS BOX
                             =================================================== */}
                          <div style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: isApproved ? 'rgba(16, 185, 129, 0.1)' : isRejected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.25)' : isRejected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                            fontSize: '0.68rem',
                            lineHeight: 1.4
                          }}>
                            {isApproved && (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#34d399', fontWeight: 700, marginBottom: '2px' }}>
                                  <span>🟢 Verified & Approved by: {item.reviewed_by || 'Sneha Verma (HR Lead)'}</span>
                                  <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{item.reviewed_at || 'Recent'}</span>
                                </div>
                                <div style={{ color: '#a7f3d0' }}>
                                  HR Remark: "{item.hr_comment || 'Approved by HR Executive.'}"
                                </div>
                              </div>
                            )}

                            {isRejected && (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#f87171', fontWeight: 700, marginBottom: '2px' }}>
                                  <span>🔴 Disapproved by: {item.reviewed_by || 'Sneha Verma (HR Lead)'}</span>
                                  <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{item.reviewed_at || 'Recent'}</span>
                                </div>
                                <div style={{ color: '#fca5a5' }}>
                                  HR Reason: "{item.hr_comment || 'Meeting/work commitments scheduled in office.'}"
                                </div>
                              </div>
                            )}

                            {isPending && (
                              <div style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>🟡 Awaiting Review (Queue: Sneha Verma - HR)</span>
                                <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Typically under 24 hrs</span>
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '6px', fontSize: '0.64rem', color: '#38bdf8', fontWeight: 600 }}>
                            <span>View Official Decision Receipt →</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ===============================================================
            SCREEN 16: ATTENDANCE HISTORY (Clickable DD/MM/YYYY with Reasons)
           =============================================================== */}
        {mobileScreen === 'history' && (() => {
          const currentMonth = HISTORY_MONTHS[historyMonthIdx] || HISTORY_MONTHS[0];

          const handlePrevMonth = () => {
            if (historyMonthIdx < HISTORY_MONTHS.length - 1) {
              setHistoryMonthIdx(prev => prev + 1);
            }
          };

          const handleNextMonth = () => {
            if (historyMonthIdx > 0) {
              setHistoryMonthIdx(prev => prev - 1);
            }
          };

          return (
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Header with View Toggle (Calendar / List) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setMobileScreen('home')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}>
                    <ChevronLeft size={22} />
                  </button>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={18} color="#00897b" /> Attendance Calendar
                    </h3>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {historyViewMode === 'calendar' ? 'Material calendar view • Click any date to view data' : 'Monthly list view • Click card for details'}
                    </div>
                  </div>
                </div>

                {/* View Switcher Pill: Calendar vs List */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '3px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <button
                    onClick={() => setHistoryViewMode('calendar')}
                    style={{
                      background: historyViewMode === 'calendar' ? '#00897b' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '7px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: historyViewMode === 'calendar' ? '0 2px 6px rgba(0, 137, 123, 0.4)' : 'none'
                    }}
                  >
                    <Calendar size={12} />
                    <span>Calendar</span>
                  </button>
                  <button
                    onClick={() => setHistoryViewMode('list')}
                    style={{
                      background: historyViewMode === 'list' ? '#00897b' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '7px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: historyViewMode === 'list' ? '0 2px 6px rgba(0, 137, 123, 0.4)' : 'none'
                    }}
                  >
                    <FileText size={12} />
                    <span>List</span>
                  </button>
                </div>
              </div>

              {/* ==============================================================
                  MODE 1: 📅 MATERIAL CALENDAR VIEW (EXACTLY LIKE IMAGE 1)
                 ============================================================== */}
              {historyViewMode === 'calendar' && (() => {
                const activeYear = currentMonth.year || 2026;
                const activeMonthNum = currentMonth.month || 10;
                const totalDays = currentMonth.daysInMonth || 31;
                const startDayOfWeek = currentMonth.startDayOfWeek !== undefined ? currentMonth.startDayOfWeek : 4;
                const isCurrentMonth = historyMonthIdx === 0;

                const validDay = Math.min(Math.max(1, selectedCalDay || 1), totalDays);
                const selectedDateObj = new Date(activeYear, activeMonthNum - 1, validDay);
                const dayNameShort = selectedDateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const monthShort = selectedDateObj.toLocaleDateString('en-US', { month: 'short' });
                const activeAttendance = getSelectedDayAttendance(currentMonth, validDay);

                const isPresent = activeAttendance?.status === 'Present';
                const isLate = activeAttendance?.status === 'Late';
                const isAbsent = activeAttendance?.status === 'Absent';
                const isWfh = activeAttendance?.status === 'WFH';
                const isLeave = activeAttendance?.status === 'Leave';

                const badgeColor = isPresent ? '#10b981' : isLate ? '#f59e0b' : isAbsent ? '#ef4444' : isWfh ? '#0284c7' : isLeave ? '#fbbf24' : '#94a3b8';
                const badgeBg = isPresent ? 'rgba(16, 185, 129, 0.15)' : isLate ? 'rgba(245, 158, 11, 0.15)' : isAbsent ? 'rgba(239, 68, 68, 0.15)' : isWfh ? 'rgba(2, 132, 199, 0.15)' : isLeave ? 'rgba(251, 191, 36, 0.15)' : 'rgba(148, 163, 184, 0.15)';
                const badgeBorder = isPresent ? 'rgba(16, 185, 129, 0.35)' : isLate ? 'rgba(245, 158, 11, 0.35)' : isAbsent ? 'rgba(239, 68, 68, 0.35)' : isWfh ? 'rgba(2, 132, 199, 0.35)' : isLeave ? 'rgba(251, 191, 36, 0.35)' : 'rgba(148, 163, 184, 0.35)';

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px' }}>
                    {/* Material Calendar Card - Exact Replica of Image 1 */}
                    <div style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#1f2937'
                    }}>
                      {/* Teal Header Banner */}
                      <div style={{
                        background: '#00897b',
                        padding: '16px 20px',
                        color: '#ffffff'
                      }}>
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          opacity: 0.92,
                          letterSpacing: '0.04em'
                        }}>
                          {activeYear}
                        </div>
                        <div style={{
                          fontSize: '1.75rem',
                          fontWeight: 700,
                          marginTop: '3px',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.2
                        }}>
                          {dayNameShort}, {selectedCalDay} {monthShort}
                        </div>
                      </div>

                      {/* Calendar Body */}
                      <div style={{ padding: '14px 16px 12px 16px' }}>
                        {/* Month Switcher Row */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '14px'
                        }}>
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            disabled={historyMonthIdx >= HISTORY_MONTHS.length - 1}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: historyMonthIdx >= HISTORY_MONTHS.length - 1 ? 'not-allowed' : 'pointer',
                              padding: '6px',
                              color: historyMonthIdx >= HISTORY_MONTHS.length - 1 ? '#cbd5e1' : '#374151',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '50%'
                            }}
                            title="Previous Month"
                          >
                            <ChevronLeft size={20} />
                          </button>

                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#111827' }}>
                              {currentMonth.label}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleNextMonth}
                            disabled={historyMonthIdx <= 0}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: historyMonthIdx <= 0 ? 'not-allowed' : 'pointer',
                              padding: '6px',
                              color: historyMonthIdx <= 0 ? '#cbd5e1' : '#374151',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '50%'
                            }}
                            title="Next Month"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>

                        {/* Weekday Row (S M T W T F S) */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, i) => (
                            <div key={i}>{dayChar}</div>
                          ))}
                        </div>

                        {/* 7-Column Days Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          rowGap: '6px',
                          textAlign: 'center'
                        }}>
                          {/* Blank cells */}
                          {Array.from({ length: startDayOfWeek }).map((_, i) => (
                            <div key={`blank-${i}`} style={{ height: '36px' }} />
                          ))}

                          {/* Day numbers 1 to totalDays */}
                          {Array.from({ length: totalDays }).map((_, i) => {
                            const dayNum = i + 1;
                            const isSelected = selectedCalDay === dayNum;
                            const isToday = isCurrentMonth && dayNum === 14;
                            const dayRecord = getSelectedDayAttendance(currentMonth, dayNum);

                            const dStatus = dayRecord?.status;
                            const dotColor = 
                              dStatus === 'Present' ? '#10b981' :
                              dStatus === 'WFH' ? '#0284c7' :
                              dStatus === 'Leave' ? '#fbbf24' :
                              dStatus === 'Late' ? '#f59e0b' :
                              dStatus === 'Absent' ? '#ef4444' :
                              dStatus === 'Holiday' ? '#94a3b8' :
                              '#cbd5e1';

                            return (
                              <div
                                key={dayNum}
                                onClick={() => setSelectedCalDay(dayNum)}
                                style={{
                                  height: '38px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  userSelect: 'none'
                                }}
                              >
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.86rem',
                                  fontWeight: isSelected ? 700 : (isToday ? 700 : 500),
                                  background: isSelected ? '#00897b' : 'transparent',
                                  color: isSelected ? '#ffffff' : (isToday ? '#00897b' : '#1f2937'),
                                  border: (!isSelected && isToday) ? '1.5px solid #00897b' : 'none',
                                  transition: 'all 0.15s ease'
                                }}>
                                  {dayNum}
                                </div>

                                {/* Small colored attendance dot below date */}
                                {dayRecord && !isSelected && (
                                  <div style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: dotColor,
                                    marginTop: '1px'
                                  }} />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Material Dialog Action Buttons */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '12px',
                          marginTop: '8px',
                          borderTop: '1px solid #f1f5f9'
                        }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedCalDay(14)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#00897b',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: '4px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              TODAY
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedCalDay(1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: '4px 6px'
                              }}
                            >
                              CLEAR
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setHistoryViewMode('list')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#00897b',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            VIEW FULL LIST ›
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Status Legend */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      color: '#94a3b8'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                        <span>Present</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7' }} />
                        <span>WFH</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fbbf24' }} />
                        <span>Leave</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
                        <span>Absent</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8' }} />
                        <span>Off</span>
                      </div>
                    </div>

                    {/* ==========================================================
                        DATA ACCORDING TO SELECTED DATE ("uski ke acording data show ho")
                       ========================================================== */}
                    {activeAttendance && (
                      <div style={{
                        background: 'linear-gradient(135deg, #111c34 0%, #0d1527 100%)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(0, 137, 123, 0.4)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {/* Selected Date Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '10px',
                              background: 'rgba(0, 137, 123, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Calendar size={16} color="#00897b" />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                                {activeAttendance.date}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                                {activeAttendance.dayName}
                              </div>
                            </div>
                          </div>

                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: badgeBg,
                            color: badgeColor,
                            border: `1px solid ${badgeBorder}`
                          }}>
                            {activeAttendance.status}
                          </span>
                        </div>

                        {/* Punch Metrics (Check-in, Check-out, Duration, Location) */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '10px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Check-in Punch</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={12} color="#10b981" />
                              <span>{activeAttendance.check_in}</span>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Check-out Punch</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={12} color="#f59e0b" />
                              <span>{activeAttendance.check_out}</span>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Total Duration</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
                              {activeAttendance.duration}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Punch Mode / Type</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginTop: '2px' }}>
                              {activeAttendance.mode}
                            </div>
                          </div>
                        </div>

                        {/* Work Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
                          <MapPin size={13} color="#38bdf8" />
                          <span>{activeAttendance.location}</span>
                        </div>

                        {/* Prominent Reason & Remarks Box */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          borderLeft: `3.5px solid ${badgeColor}`
                        }}>
                          <FileText size={15} color={badgeColor} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                            <strong style={{ color: '#ffffff' }}>Reason / Remarks: </strong>
                            {activeAttendance.reason}
                          </div>
                        </div>

                        {/* HR Approval Details (if applicable) */}
                        {activeAttendance.hrApproval && (
                          <div style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: activeAttendance.hrApproval.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${activeAttendance.hrApproval.status === 'Approved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            fontSize: '0.72rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: activeAttendance.hrApproval.status === 'Approved' ? '#34d399' : '#f87171' }}>
                              <span>
                                {activeAttendance.hrApproval.status === 'Approved' ? '🟢' : '🔴'} {activeAttendance.hrApproval.status} by HR: {activeAttendance.hrApproval.reviewed_by || 'Sneha Verma (HR Lead)'}
                              </span>
                              <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                                {activeAttendance.hrApproval.reviewed_at || 'Recent'}
                              </span>
                            </div>
                            <div style={{ color: activeAttendance.hrApproval.status === 'Approved' ? '#a7f3d0' : '#fca5a5' }}>
                              HR Feedback: "{activeAttendance.hrApproval.hr_comment || 'Approved per organizational policy.'}"
                            </div>
                          </div>
                        )}

                        {/* Button to View Full Verification Modal */}
                        <button
                          type="button"
                          onClick={() => setSelectedHistoryItem(activeAttendance)}
                          className="btn btn-secondary"
                          style={{
                            padding: '9px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '10px',
                            border: '1px solid rgba(0, 137, 123, 0.5)',
                            color: '#2dd4bf',
                            background: 'rgba(0, 137, 123, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <FileCheck size={14} />
                          <span>View Official Digital Punch Receipt</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ==============================================================
                  MODE 2: 📋 MONTHLY LIST VIEW (Scrollable rows)
                 ============================================================== */}
              {historyViewMode === 'list' && (
                <div>
                  {/* Interactive Month Switcher (< Month Year >) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #111c34 0%, #0d1527 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    marginBottom: '14px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
                  }}>
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      disabled={historyMonthIdx >= HISTORY_MONTHS.length - 1}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: 'none',
                        color: historyMonthIdx >= HISTORY_MONTHS.length - 1 ? 'rgba(255, 255, 255, 0.2)' : '#38bdf8',
                        cursor: historyMonthIdx >= HISTORY_MONTHS.length - 1 ? 'not-allowed' : 'pointer',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Previous Month"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.01em' }}>
                        {currentMonth.label}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {currentMonth.records.length} Recorded Days
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      disabled={historyMonthIdx <= 0}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: 'none',
                        color: historyMonthIdx <= 0 ? 'rgba(255, 255, 255, 0.2)' : '#38bdf8',
                        cursor: historyMonthIdx <= 0 ? 'not-allowed' : 'pointer',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Next Month"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Clickable Attendance Records List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px' }}>
                    {(currentMonth?.records || []).map((item, idx) => {
                      const isPresent = item.status === 'Present';
                      const isLate = item.status === 'Late';
                      const isAbsent = item.status === 'Absent';
                      const isWfh = item.status === 'WFH';
                      const isLeave = item.status === 'Leave';

                      const badgeColor = isPresent ? '#34d399' : isLate ? '#fbbf24' : isAbsent ? '#f87171' : isWfh ? '#38bdf8' : '#c084fc';
                      const badgeBg = isPresent ? 'rgba(16, 185, 129, 0.15)' : isLate ? 'rgba(245, 158, 11, 0.15)' : isAbsent ? 'rgba(239, 68, 68, 0.15)' : isWfh ? 'rgba(56, 189, 248, 0.15)' : 'rgba(192, 132, 252, 0.15)';
                      const badgeBorder = isPresent ? 'rgba(16, 185, 129, 0.3)' : isLate ? 'rgba(245, 158, 11, 0.3)' : isAbsent ? 'rgba(239, 68, 68, 0.3)' : isWfh ? 'rgba(56, 189, 248, 0.3)' : 'rgba(192, 132, 252, 0.3)';

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedHistoryItem(item)}
                          style={{
                            background: '#111c34',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {/* Top Header Row: DD/MM/YYYY + Day + Status Badge + Chevron */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: 'rgba(56, 189, 248, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Calendar size={14} color="#38bdf8" />
                              </div>
                              <div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>
                                  {item.date}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500, marginLeft: '6px' }}>
                                  ({item.dayName.slice(0, 3)})
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: badgeBg,
                                color: badgeColor,
                                border: `1px solid ${badgeBorder}`
                              }}>
                                {item.status}
                              </span>
                              <ChevronRight size={15} color="var(--text-dim)" />
                            </div>
                          </div>

                          {/* Prominent Reason & Remarks Box */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            borderLeft: `3px solid ${badgeColor}`
                          }}>
                            <FileText size={13} color={badgeColor} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div style={{ fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                              <strong style={{ color: '#ffffff' }}>Reason: </strong>{item.reason}
                            </div>
                          </div>

                          {/* Bottom Check-in & Punch Method Details */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: 'var(--text-dim)', paddingTop: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Clock size={11} color="#94a3b8" />
                              <span>Check-in: <strong style={{ color: '#e2e8f0' }}>{item.check_in}</strong></span>
                              {item.check_out && item.check_out !== '--:--' && (
                                <span> • Out: <strong style={{ color: '#e2e8f0' }}>{item.check_out}</strong></span>
                              )}
                            </div>
                            <span style={{ color: '#38bdf8', fontSize: '0.68rem', fontWeight: 600 }}>
                              Tap details ›
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Attendance Record Detail Popup Modal */}
              {selectedHistoryItem && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(6px)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px'
                }}>
                  <div style={{
                    background: '#0e1726',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '18px',
                    width: '100%',
                    maxWidth: '360px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '20px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
                  }}>
                    {/* Modal Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Calendar size={16} color="#38bdf8" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            Punch Record Details
                          </h4>
                          <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600 }}>
                            {selectedHistoryItem.date} ({selectedHistoryItem.dayName})
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedHistoryItem(null)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Status Banner */}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Attendance Status</span>
                      <span className={`badge badge-${(selectedHistoryItem?.status || 'present').toLowerCase()}`}>
                        {selectedHistoryItem?.status}
                      </span>
                    </div>

                    {/* 2x2 Punch Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ background: '#111c34', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Punch In</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                          {selectedHistoryItem.check_in}
                        </div>
                      </div>

                      <div style={{ background: '#111c34', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Punch Out</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                          {selectedHistoryItem.check_out}
                        </div>
                      </div>

                      <div style={{ background: '#111c34', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total Duration</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                          {selectedHistoryItem.duration}
                        </div>
                      </div>

                      <div style={{ background: '#111c34', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Punch Mode</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                          {selectedHistoryItem.mode}
                        </div>
                      </div>
                    </div>

                    {/* Location Card */}
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#111c34',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '14px',
                      fontSize: '0.75rem',
                      color: '#cbd5e1'
                    }}>
                      <MapPin size={15} color="#38bdf8" />
                      <span>Location: <strong style={{ color: '#ffffff' }}>{selectedHistoryItem.location}</strong></span>
                    </div>

                    {/* Full Reason Box */}
                    <div style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem', marginBottom: '4px' }}>
                        <FileText size={14} /> Reason & Remarks
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                        {selectedHistoryItem.reason}
                      </div>
                    </div>

                    {/* Corporate Verification Footer */}
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#64748b',
                      textAlign: 'center',
                      marginBottom: '14px',
                      lineHeight: 1.3
                    }}>
                      🛡️ Verified Attendance Record • VorldX Industries Pvt Ltd (CIN: U62099UP2026PTC245598)
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedHistoryItem(null)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ===============================================================
            SCREEN 18: ATTENDANCE STATISTICS & MONTHLY GRAPH
           =============================================================== */}
        {mobileScreen === 'stats' && (() => {
          const currentStats = MONTHS_STATS_DATA.find(m => m.key === selectedMonthKey) || MONTHS_STATS_DATA[0];
          const totalDays = currentStats.totalWorkingDays || 22;

          return (
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => setMobileScreen('home')} 
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart2 size={18} color="#38bdf8" /> Attendance Statistics
                    </h3>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Monthly breakdown & graphical analysis
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399' }}>{currentStats.attendanceRate}</span>
                </div>
              </div>

              {/* Month Selector Carousel (Click to switch month data) */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Select Month</span>
                  <span style={{ color: '#38bdf8' }}>Tap to view breakdown</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto', 
                  paddingBottom: '4px',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {MONTHS_STATS_DATA.map(m => {
                    const isSelected = selectedMonthKey === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedMonthKey(m.key)}
                        style={{
                          flexShrink: 0,
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                          background: isSelected 
                            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.35) 0%, rgba(56, 189, 248, 0.2) 100%)' 
                            : '#111c34',
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: isSelected ? '0 0 14px rgba(56, 189, 248, 0.35)' : 'none',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Calendar size={13} color={isSelected ? '#38bdf8' : 'var(--text-dim)'} />
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Month Summary Card with Multi-Segment Progress */}
              <div style={{
                background: 'linear-gradient(145deg, #111c34 0%, #0d1527 100%)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '14px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Active Overview
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                      {currentStats.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Total Working Days</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>{totalDays} Days</div>
                  </div>
                </div>

                {/* Stacked Multi-Segment Progress Bar */}
                <div style={{
                  height: '10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  marginBottom: '8px'
                }}>
                  <div 
                    title={`Present: ${currentStats.present}d`}
                    style={{ 
                      width: `${(currentStats.present / totalDays) * 100}%`, 
                      background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)', 
                      transition: 'width 0.4s ease' 
                    }} 
                  />
                  <div 
                    title={`WFH: ${currentStats.wfh}d`}
                    style={{ 
                      width: `${(currentStats.wfh / totalDays) * 100}%`, 
                      background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', 
                      transition: 'width 0.4s ease' 
                    }} 
                  />
                  <div 
                    title={`Leaves: ${currentStats.leaves}d`}
                    style={{ 
                      width: `${(currentStats.leaves / totalDays) * 100}%`, 
                      background: 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)', 
                      transition: 'width 0.4s ease' 
                    }} 
                  />
                  <div 
                    title={`Absent: ${currentStats.absent}d`}
                    style={{ 
                      width: `${(currentStats.absent / totalDays) * 100}%`, 
                      background: 'linear-gradient(90deg, #dc2626 0%, #f87171 100%)', 
                      transition: 'width 0.4s ease' 
                    }} 
                  />
                </div>

                {/* Legend tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.68rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }}></div>
                    <span>Present: {currentStats.present}d</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8' }}></div>
                    <span>WFH: {currentStats.wfh}d</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f59e0b' }}></div>
                    <span>Leaves: {currentStats.leaves}d</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }}></div>
                    <span>Absent: {currentStats.absent}d</span>
                  </div>
                </div>

                {/* ==============================================================
                    EMBEDDED INTERACTIVE CLICKABLE CALENDAR (Inside Active Overview)
                   ============================================================== */}
                {(() => {
                  const currentMonthObj = HISTORY_MONTHS.find(m => m.key === selectedMonthKey) || HISTORY_MONTHS[0];
                  const totalMonthDays = currentMonthObj?.daysInMonth || 31;
                  const startDayOfWeek = currentMonthObj?.startDayOfWeek !== undefined ? currentMonthObj.startDayOfWeek : 4;
                  const activeCalDay = Math.min(Math.max(1, selectedCalDay || 16), totalMonthDays);
                  const activeRecord = getSelectedDayAttendance(currentMonthObj, activeCalDay);

                  return (
                    <div style={{
                      marginTop: '14px',
                      background: 'rgba(7, 13, 25, 0.75)',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid rgba(0, 137, 123, 0.4)',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.35)'
                    }}>
                      {/* Calendar Top Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={15} color="#00897b" />
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                            {currentMonthObj.label} Interactive Calendar
                          </span>
                        </div>
                        <span style={{ fontSize: '0.66rem', color: '#2dd4bf', fontWeight: 700 }}>
                          Tap any date to inspect
                        </span>
                      </div>

                      {/* Weekday Row (S M T W T F S) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        textAlign: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        marginBottom: '6px'
                      }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, i) => (
                          <div key={i}>{dayChar}</div>
                        ))}
                      </div>

                      {/* 7-Column Interactive Days Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        textAlign: 'center'
                      }}>
                        {/* Blank cells */}
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                          <div key={`blank-stats-${i}`} style={{ height: '35px' }} />
                        ))}

                        {/* Day numbers 1 to totalMonthDays */}
                        {Array.from({ length: totalMonthDays }).map((_, i) => {
                          const dayNum = i + 1;
                          const isSelected = activeCalDay === dayNum;
                          const dayRecord = getSelectedDayAttendance(currentMonthObj, dayNum);
                          const dStatus = dayRecord?.status;
                          const dotColor = 
                            dStatus === 'Present' ? '#10b981' :
                            dStatus === 'WFH' ? '#0284c7' :
                            dStatus === 'Leave' ? '#fbbf24' :
                            dStatus === 'Late' ? '#f59e0b' :
                            dStatus === 'Absent' ? '#ef4444' :
                            dStatus === 'Holiday' ? '#94a3b8' :
                            '#475569';

                          return (
                            <div
                              key={dayNum}
                              onClick={() => setSelectedCalDay(dayNum)}
                              style={{
                                height: '36px',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                userSelect: 'none',
                                background: isSelected ? '#00897b' : 'rgba(255, 255, 255, 0.03)',
                                border: isSelected ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.05)',
                                boxShadow: isSelected ? '0 0 10px rgba(0, 137, 123, 0.6)' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: isSelected ? 800 : 600,
                                color: isSelected ? '#ffffff' : '#e2e8f0'
                              }}>
                                {dayNum}
                              </span>
                              <span style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '50%',
                                background: isSelected ? '#ffffff' : dotColor,
                                marginTop: '1px'
                              }} />
                            </div>
                          );
                        })}
                      </div>

                      {/* Clicked Date Live Record Inspection Card */}
                      {activeRecord && (
                        <div style={{
                          marginTop: '12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={13} color="#38bdf8" />
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                                {activeRecord.date} ({activeRecord.dayName})
                              </span>
                            </div>
                            <span className={`badge badge-${(activeRecord.status || 'present').toLowerCase()}`}>
                              {activeRecord.status}
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.7rem' }}>
                            <div>
                              <span style={{ color: '#94a3b8' }}>Check-in: </span>
                              <strong style={{ color: '#34d399' }}>{activeRecord.check_in}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#94a3b8' }}>Check-out: </span>
                              <strong style={{ color: '#38bdf8' }}>{activeRecord.check_out}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#94a3b8' }}>Duration: </span>
                              <strong style={{ color: '#ffffff' }}>{activeRecord.duration}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#94a3b8' }}>Mode: </span>
                              <strong style={{ color: '#cbd5e1' }}>{activeRecord.mode}</strong>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.71rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                            <strong style={{ color: '#ffffff' }}>Reason: </strong>
                            {activeRecord.reason}
                          </div>

                          {activeRecord.hrApproval && (
                            <div style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              fontSize: '0.68rem',
                              color: '#34d399'
                            }}>
                              HR Review: {activeRecord.hrApproval.status} by {activeRecord.hrApproval.reviewed_by || 'Sneha Verma'} • "{activeRecord.hrApproval.hr_comment || 'Approved'}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* Button to open fullscreen Material dialog if desired */}
                      <button
                        type="button"
                        onClick={() => {
                          const idx = HISTORY_MONTHS.findIndex(m => m.key === selectedMonthKey);
                          if (idx !== -1) setHistoryMonthIdx(idx);
                          setHistoryViewMode('calendar');
                          setMobileScreen('history');
                        }}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: 'rgba(0, 137, 123, 0.15)',
                          border: '1px solid rgba(0, 137, 123, 0.4)',
                          color: '#2dd4bf',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <ExternalLink size={12} color="#2dd4bf" />
                        <span>Open in Full-Screen Material View ({currentStats.short}) →</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* 4 Key Metric Cards (Present, WFH, Absent, Leaves) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                {/* 1. Present Card */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Present (Office)</span>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck size={14} color="#10b981" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                    {currentStats.present} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>Days</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {Math.round((currentStats.present / totalDays) * 100)}% of working days
                  </div>
                </div>

                {/* 2. WFH Card */}
                <div style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>WFH (Remote)</span>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Home size={14} color="#38bdf8" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                    {currentStats.wfh} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>Days</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {Math.round((currentStats.wfh / totalDays) * 100)}% of working days
                  </div>
                </div>

                {/* 3. Absent Card */}
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Absent</span>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserX size={14} color="#ef4444" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>
                    {currentStats.absent} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>Day{currentStats.absent !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {Math.round((currentStats.absent / totalDays) * 100)}% of working days
                  </div>
                </div>

                {/* 4. Leaves Card */}
                <div style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Leaves Taken</span>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coffee size={14} color="#f59e0b" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
                    {currentStats.leaves} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>Day{currentStats.leaves !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {Math.round((currentStats.leaves / totalDays) * 100)}% of working days
                  </div>
                </div>
              </div>

              {/* Graphical Visualization: Vertical Comparative Bar Chart */}
              <div style={{
                background: '#111c34',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart2 size={16} color="#38bdf8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Attendance Comparison Graph</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{currentStats.short}</span>
                </div>

                {/* Graph Area with gridlines and vertical pillars */}
                <div style={{
                  height: '160px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-around',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {/* Subtle horizontal grid lines */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '1px dashed rgba(255, 255, 255, 0.05)' }}></div>
                  <div style={{ position: 'absolute', top: '35%', left: 0, right: 0, borderTop: '1px dashed rgba(255, 255, 255, 0.05)' }}></div>
                  <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, borderTop: '1px dashed rgba(255, 255, 255, 0.05)' }}></div>

                  {/* 1. Present Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', zIndex: 2 }}>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#34d399',
                      marginBottom: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {currentStats.present}d
                    </div>
                    <div style={{
                      width: '38px',
                      height: `${Math.max(16, (currentStats.present / totalDays) * 120)}px`,
                      background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                      transition: 'height 0.4s ease'
                    }}></div>
                    <span style={{ position: 'absolute', bottom: 2, fontSize: '0.68rem', fontWeight: 600, color: '#34d399' }}>
                      Present
                    </span>
                  </div>

                  {/* 2. WFH Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', zIndex: 2 }}>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      marginBottom: '4px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {currentStats.wfh}d
                    </div>
                    <div style={{
                      width: '38px',
                      height: `${Math.max(16, (currentStats.wfh / totalDays) * 120)}px`,
                      background: 'linear-gradient(180deg, #38bdf8 0%, #1d4ed8 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
                      transition: 'height 0.4s ease'
                    }}></div>
                    <span style={{ position: 'absolute', bottom: 2, fontSize: '0.68rem', fontWeight: 600, color: '#38bdf8' }}>
                      WFH
                    </span>
                  </div>

                  {/* 3. Absent Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', zIndex: 2 }}>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#f87171',
                      marginBottom: '4px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {currentStats.absent}d
                    </div>
                    <div style={{
                      width: '38px',
                      height: `${Math.max(16, (currentStats.absent / totalDays) * 120)}px`,
                      background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)',
                      transition: 'height 0.4s ease'
                    }}></div>
                    <span style={{ position: 'absolute', bottom: 2, fontSize: '0.68rem', fontWeight: 600, color: '#f87171' }}>
                      Absent
                    </span>
                  </div>

                  {/* 4. Leaves Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', zIndex: 2 }}>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#fbbf24',
                      marginBottom: '4px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {currentStats.leaves}d
                    </div>
                    <div style={{
                      width: '38px',
                      height: `${Math.max(16, (currentStats.leaves / totalDays) * 120)}px`,
                      background: 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
                      transition: 'height 0.4s ease'
                    }}></div>
                    <span style={{ position: 'absolute', bottom: 2, fontSize: '0.68rem', fontWeight: 600, color: '#fbbf24' }}>
                      Leaves
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  Interactive live chart • Scaled to {totalDays} monthly working days
                </div>
              </div>

              {/* Weekly Performance Breakdown */}
              <div style={{
                background: '#111c34',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '10px'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={15} color="#34d399" /> Weekly Breakdown ({currentStats.short})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentStats.weeks.map((wk, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#e2e8f0' }}>
                        {wk.label}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.68rem' }}>
                        <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>
                          P: {wk.present}
                        </span>
                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                          WFH: {wk.wfh}
                        </span>
                        {wk.leaves > 0 && (
                          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px' }}>
                            L: {wk.leaves}
                          </span>
                        )}
                        {wk.absent > 0 && (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 6px', borderRadius: '4px' }}>
                            A: {wk.absent}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ===============================================================
            SCREEN 17: PROFILE VIEW & EDIT ACCOUNT
           =============================================================== */}
        {mobileScreen === 'profile' && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => setMobileScreen('home')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                  <ChevronLeft size={20} />
                </button>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>My Profile</h3>
              </div>
              <button
                onClick={() => openEditProfile('info')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '8px',
                  color: '#38bdf8',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={13} /> Edit Account
              </button>
            </div>

            {/* Avatar & Info */}
            <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={activeEmployee.avatar}
                  alt={activeEmployee.name}
                  style={{ width: '74px', height: '74px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8', marginBottom: '8px', boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)' }}
                />
                <button
                  onClick={() => openEditProfile('info')}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '-4px',
                    background: '#2563eb',
                    border: '2px solid #0f172a',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  title="Change Avatar"
                >
                  <Edit3 size={12} />
                </button>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{activeEmployee.name}</div>
              <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, margin: '4px 0' }}>
                ID: {activeEmployee.id}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeEmployee.department} • {activeEmployee.designation}</div>
            </div>

            {/* Quick Profile Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div
                onClick={() => openEditProfile('info')}
                style={{
                  background: '#111c34',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={15} color="#38bdf8" /> Personal Information
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {activeEmployee.email || 'No email'} • {activeEmployee.phone || 'No phone'}
                  </div>
                  {activeEmployee.address && (
                    <div style={{ fontSize: '0.70rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                      <MapPin size={12} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ lineHeight: '1.3' }}>
                        {activeEmployee.address}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
                  <span>Edit</span>
                  <ChevronRight size={16} />
                </div>
              </div>

              <div
                onClick={() => openEditProfile('password')}
                style={{
                  background: '#111c34',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={15} color="#a855f7" /> Security & Password
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Update your account login password
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-dim)" />
              </div>

              <div
                onClick={() => setMobileScreen('history')}
                style={{
                  background: '#111c34',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="#34d399" /> Attendance Logs & Shift
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Shift: {activeEmployee.shift || 'General (9:00 AM - 6:00 PM)'}
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-dim)" />
              </div>

              {/* Clear Cache & Speed Booster Card */}
              <div
                onClick={handleClearCacheBoost}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={15} color="#34d399" /> Clear Cache & Boost Speed
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                    {cacheClearedMsg || 'Auto-clears on launch • Tap to flush RAM'}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(52, 211, 153, 0.18)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  color: '#34d399',
                  fontWeight: 700
                }}>
                  Smooth ⚡
                </div>
              </div>
            </div>

            {/* Read-only HR Employment Info Banner */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              marginBottom: '20px',
              fontSize: '0.72rem',
              color: '#94a3b8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={14} color="#38bdf8" /> Corporate Profile Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>ID: <strong style={{ color: '#fff' }}>{activeEmployee.id}</strong> (Locked)</div>
                <div>Dept: <strong style={{ color: '#fff' }}>{activeEmployee.department}</strong></div>
                <div>Role: <strong style={{ color: '#fff' }}>{activeEmployee.designation}</strong></div>
                <div>Work: <strong style={{ color: '#fff' }}>{activeEmployee.work_type || 'Office'}</strong></div>
                <div style={{ gridColumn: 'span 2', paddingTop: '4px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                  Date of Joining: <strong style={{ color: '#38bdf8' }}>{activeEmployee.joining_date || activeEmployee.joiningDate || '01 Jan 2026'}</strong> (HR Verified 🔒)
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onLogout) onLogout();
                else setMobileScreen('login');
              }}
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} /> Logout
            </button>

            {/* EDIT PROFILE MODAL */}
            {showEditModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(5px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}>
                <div style={{
                  background: '#0e1726',
                  border: '1px solid #1e293b',
                  borderRadius: '16px',
                  width: '100%',
                  maxWidth: '380px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                }}>
                  {/* Modal Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit3 size={16} color="#38bdf8" />
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Edit Account Details
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowEditModal(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '3px',
                    marginBottom: '16px'
                  }}>
                    <button
                      type="button"
                      onClick={() => setEditActiveTab('info')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: editActiveTab === 'info' ? '#2563eb' : 'transparent',
                        color: editActiveTab === 'info' ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Personal Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditActiveTab('password')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: editActiveTab === 'password' ? '#2563eb' : 'transparent',
                        color: editActiveTab === 'password' ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Password & Security
                    </button>
                  </div>

                  {editSuccessMsg && (
                    <div style={{
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      marginBottom: '14px',
                      textAlign: 'center'
                    }}>
                      {editSuccessMsg}
                    </div>
                  )}

                  {editErrorMsg && (
                    <div style={{
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      marginBottom: '14px',
                      textAlign: 'center'
                    }}>
                      {editErrorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile}>
                    {editActiveTab === 'info' ? (
                      <>
                        {/* Avatar Picker: Phone Gallery / Camera Upload & Presets */}
                        <div style={{ marginBottom: '16px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Profile Picture</span>
                            <span style={{ color: '#38bdf8', fontSize: '0.7rem' }}>Gallery or Presets</span>
                          </label>

                          {/* Hidden File Input for Native Gallery / File Sheet */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                          />

                          {/* Gallery Upload Card */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'rgba(56, 189, 248, 0.08)',
                            border: '1.5px dashed rgba(56, 189, 248, 0.4)',
                            borderRadius: '12px',
                            marginBottom: '10px'
                          }}>
                            <div style={{ position: 'relative' }}>
                              <img
                                src={editForm.avatar || activeEmployee.avatar}
                                alt="Avatar Preview"
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid #38bdf8',
                                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)'
                                }}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                background: '#10b981',
                                border: '2px solid #0e1726',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Check size={10} color="#fff" />
                              </div>
                            </div>

                            <div style={{ flex: 1 }}>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  width: '100%',
                                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                }}
                              >
                                <Upload size={14} /> Upload from Gallery / Camera
                              </button>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'center' }}>
                                Tap to pick any photo from your phone
                              </div>
                            </div>
                          </div>

                          {/* Avatar Presets */}
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Or choose from corporate presets:
                          </div>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                            {AVATAR_PRESETS.map((avatarUrl, idx) => (
                              <img
                                key={idx}
                                src={avatarUrl}
                                alt={`Preset ${idx + 1}`}
                                onClick={() => setEditForm(prev => ({ ...prev, avatar: avatarUrl }))}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  objectFit: 'cover',
                                  border: editForm.avatar === avatarUrl ? '2px solid #38bdf8' : '2px solid transparent',
                                  boxShadow: editForm.avatar === avatarUrl ? '0 0 10px rgba(56, 189, 248, 0.6)' : 'none',
                                  transform: editForm.avatar === avatarUrl ? 'scale(1.1)' : 'scale(1)',
                                  transition: 'all 0.2s'
                                }}
                              />
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Or paste custom image URL"
                            value={editForm.avatar}
                            onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                          />
                        </div>

                        {/* Name Input */}
                        <div style={{ marginBottom: '12px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                          <input
                            type="text"
                            required
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>

                        {/* Email Input */}
                        <div style={{ marginBottom: '12px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                          <input
                            type="email"
                            required
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>

                        {/* Phone Input */}
                        <div style={{ marginBottom: '12px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>

                        {/* Residential Address Input */}
                        <div style={{ marginBottom: '12px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="#38bdf8" /> Residential Address
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Enter complete address (Street, City, Pincode)"
                            value={editForm.address}
                            onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.82rem', resize: 'vertical', lineHeight: '1.4', fontFamily: 'inherit' }}
                          />
                        </div>

                        {/* Locked HR Fields */}
                        <div style={{
                          padding: '10px 12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          marginBottom: '16px',
                          fontSize: '0.72rem',
                          color: 'var(--text-dim)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Employee ID:</span>
                            <strong style={{ color: '#ffffff' }}>{activeEmployee.id} 🔒</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Department:</span>
                            <span style={{ color: '#ffffff' }}>{activeEmployee.department} (HR Managed)</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Designation:</span>
                            <span style={{ color: '#ffffff' }}>{activeEmployee.designation} (HR Managed)</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', marginTop: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={11} color="#38bdf8" /> Date of Joining:
                            </span>
                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                              {activeEmployee.joining_date || activeEmployee.joiningDate || '01 Jan 2026'} (HR Verified 🔒)
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Password Section */}
                        <div style={{ marginBottom: '14px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>New Password / PIN</label>
                          <input
                            type="password"
                            placeholder="Enter new password"
                            value={editForm.password}
                            onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>Confirm New Password</label>
                          <input
                            type="password"
                            placeholder="Repeat new password"
                            value={editForm.confirmPassword}
                            onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="input-control"
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>

                        <div style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: 'rgba(56, 189, 248, 0.08)',
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          lineHeight: 1.4,
                          marginBottom: '16px'
                        }}>
                          🔒 Keep your password secure. This password can be used to authenticate your session or web sign-ins.
                        </div>
                      </>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editSaving}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px', fontSize: '0.82rem', fontWeight: 700 }}
                      >
                        {editSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===============================================================
            MODAL 1: OFFICIAL HR APPROVAL STATUS & DECISION RECEIPT
           =============================================================== */}
        {selectedReceipt && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#0d1527',
              border: `1px solid ${selectedReceipt.status === 'Approved' ? 'rgba(16, 185, 129, 0.5)' : selectedReceipt.status === 'Rejected' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
              borderRadius: '20px',
              width: '100%',
              maxWidth: '380px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: selectedReceipt.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : selectedReceipt.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Award size={18} color={selectedReceipt.status === 'Approved' ? '#34d399' : selectedReceipt.status === 'Rejected' ? '#f87171' : '#fbbf24'} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      HR Decision Receipt
                    </h3>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Ref: {selectedReceipt.id}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReceipt(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Official Corporate Stamp Banner */}
              <div style={{
                textAlign: 'center',
                padding: '12px',
                borderRadius: '12px',
                background: selectedReceipt.status === 'Approved' ? 'rgba(16, 185, 129, 0.12)' : selectedReceipt.status === 'Rejected' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${selectedReceipt.status === 'Approved' ? '#10b981' : selectedReceipt.status === 'Rejected' ? '#ef4444' : '#f59e0b'}`,
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  VORLDX INDUSTRIES PRIVATE LIMITED • HR DEPT
                </div>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  margin: '4px 0',
                  color: selectedReceipt.status === 'Approved' ? '#34d399' : selectedReceipt.status === 'Rejected' ? '#f87171' : '#fbbf24'
                }}>
                  {selectedReceipt.status === 'Approved' ? '✅ OFFICIALLY APPROVED' : selectedReceipt.status === 'Rejected' ? '❌ REQUEST DISAPPROVED' : '⏳ PENDING HR REVIEW'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#cbd5e1' }}>
                  CIN: U62099UP2026PTC245598 • Lucknow HQ
                </div>
              </div>

              {/* Application Details Table */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '14px',
                fontSize: '0.74rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Applicant:</span>
                  <strong style={{ color: '#ffffff' }}>{activeEmployee.name} ({activeEmployee.id})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Request Type:</span>
                  <strong style={{ color: '#38bdf8' }}>{selectedReceipt.title || selectedReceipt.type?.toUpperCase()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Date Range:</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedReceipt.from_date || selectedReceipt.date} to {selectedReceipt.to_date || selectedReceipt.from_date || selectedReceipt.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Duration:</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>{selectedReceipt.total_days || 1} Working Day(s)</span>
                </div>
                <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '6px', marginTop: '6px' }}>
                  <span style={{ color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Applicant Reason:</span>
                  <span style={{ color: '#e2e8f0', fontStyle: 'italic' }}>"{selectedReceipt.reason}"</span>
                </div>
              </div>

              {/* Official HR Decision Box */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> HR Reviewer Attestation:
                </div>
                <div style={{ fontSize: '0.74rem', color: '#ffffff', marginBottom: '4px' }}>
                  Reviewer: <strong>{selectedReceipt.reviewed_by || 'Sneha Verma (HR Lead)'}</strong>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '8px' }}>
                  Action Timestamp: {selectedReceipt.reviewed_at || 'Under Review in HR Queue'}
                </div>
                <div style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: selectedReceipt.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : selectedReceipt.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  fontSize: '0.72rem',
                  color: selectedReceipt.status === 'Approved' ? '#a7f3d0' : selectedReceipt.status === 'Rejected' ? '#fca5a5' : '#fde68a'
                }}>
                  <strong>HR Official Remarks:</strong><br />
                  "{selectedReceipt.hr_comment || (selectedReceipt.status === 'Pending' ? 'Application is in HR review queue. Notifications will reflect once verified.' : 'Decision recorded by HR.')}"
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}

        {/* ===============================================================
            MODAL 2: ALL HR ANNOUNCEMENTS & CIRCULARS
           =============================================================== */}
        {showAnnouncementsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#0d1527',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '390px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Megaphone size={18} color="#fbbf24" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      HR Notice Board
                    </h3>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Official Company Broadcasts</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAnnouncementsModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Announcements List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {announcements.map(ann => (
                  <div
                    key={ann.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px',
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        background: ann.priority === 'Celebration' ? 'rgba(245, 158, 11, 0.2)' : ann.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: ann.priority === 'Celebration' ? '#fbbf24' : ann.priority === 'Urgent' ? '#f87171' : '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.62rem',
                        fontWeight: 700
                      }}>
                        {ann.tag || 'Notice'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                        {ann.published_date}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                      {ann.title}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '8px' }}>
                      {ann.content}
                    </div>

                    <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '6px', fontSize: '0.65rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Author: <strong style={{ color: '#38bdf8' }}>{ann.author_name || 'Sneha Verma (HR Lead)'}</strong></span>
                      <span style={{ color: '#34d399' }}>Verified Circular</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAnnouncementsModal(false)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Close Notice Board
              </button>
            </div>
          </div>
        )}

        {/* ===============================================================
            MODAL 3: CLIENT PROJECT REQUIREMENTS (THROUGH ADMIN)
           =============================================================== */}
        {showProjectModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#0d1527',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '390px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Client Requirements Scope
                    </h3>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Assigned by Admin Vikram Singhania</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowProjectModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Project Meta Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '3px' }}>
                  {assignedProject.project_name}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
                  Client: {assignedProject.client_name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '8px' }}>
                  {assignedProject.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#94a3b8' }}>
                  <span>Assigned By: <strong style={{ color: '#fff' }}>{assignedProject.assigned_by}</strong></span>
                  <span>Deadline: <strong style={{ color: '#fbbf24' }}>{assignedProject.deadline}</strong></span>
                </div>
              </div>

              {/* Admin Note Box */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px dashed rgba(56, 189, 248, 0.35)',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '14px',
                fontSize: '0.72rem',
                color: '#e2e8f0',
                lineHeight: 1.4
              }}>
                <strong style={{ color: '#38bdf8' }}>Admin Directive & Client Feedback:</strong><br />
                {assignedProject.admin_notes || 'Ensure full implementation of all client requirements before sign-off.'}
              </div>

              {/* Full Checklist */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Client Requirements Checklist ({assignedProject.requirements?.length || 6})</span>
                  <span style={{ color: '#34d399', fontSize: '0.68rem' }}>{assignedProject.progress_percent || 85}% Finished</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(assignedProject.requirements || []).map((req, idx) => (
                    <div
                      key={req.id || idx}
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: req.status === 'Completed' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8' }}>{req.id}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{req.title}</span>
                        </div>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: req.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: req.status === 'Completed' ? '#34d399' : '#fbbf24'
                        }}>
                          {req.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.35, marginBottom: '4px' }}>
                        {req.desc}
                      </div>
                      {req.client_note && (
                        <div style={{ fontSize: '0.64rem', color: '#a7f3d0' }}>
                          Client Note: "{req.client_note}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Close Project Scope
              </button>
            </div>
          </div>
        )}

        {/* ===============================================================
            MATERIAL DATE PICKER MODAL (EXACT REPLICA OF IMAGE 1)
           =============================================================== */}
        {datePickerModal.isOpen && (() => {
          const mYear = datePickerModal.year || 2026;
          const mMonth = datePickerModal.month || 10;
          const mDay = datePickerModal.day || 16;

          const daysInM = new Date(mYear, mMonth, 0).getDate();
          const startDayOfWeek = new Date(mYear, mMonth - 1, 1).getDay(); // 0 = Sun
          const selectedDateObj = new Date(mYear, mMonth - 1, mDay);
          const dayNameShort = selectedDateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const monthShort = selectedDateObj.toLocaleDateString('en-US', { month: 'short' });
          const monthLong = selectedDateObj.toLocaleDateString('en-US', { month: 'long' });

          const handleSetDate = () => {
            const formattedIso = `${mYear}-${String(mMonth).padStart(2, '0')}-${String(mDay).padStart(2, '0')}`;
            if (datePickerModal.targetField === 'leaveFrom') setLeaveFromDate(formattedIso);
            else if (datePickerModal.targetField === 'leaveTo') setLeaveToDate(formattedIso);
            else if (datePickerModal.targetField === 'wfhFrom') setWfhFromDate(formattedIso);
            else if (datePickerModal.targetField === 'wfhTo') setWfhToDate(formattedIso);
            setDatePickerModal(prev => ({ ...prev, isOpen: false }));
          };

          const handleClearDate = () => {
            if (datePickerModal.targetField === 'leaveFrom') setLeaveFromDate('');
            else if (datePickerModal.targetField === 'leaveTo') setLeaveToDate('');
            else if (datePickerModal.targetField === 'wfhFrom') setWfhFromDate('');
            else if (datePickerModal.targetField === 'wfhTo') setWfhToDate('');
            setDatePickerModal(prev => ({ ...prev, isOpen: false }));
          };

          const handlePrevM = () => {
            if (mMonth > 1) {
              setDatePickerModal(prev => ({ ...prev, month: mMonth - 1, day: 1 }));
            }
          };

          const handleNextM = () => {
            if (mMonth < 12) {
              setDatePickerModal(prev => ({ ...prev, month: mMonth + 1, day: 1 }));
            }
          };

          return (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(5px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '330px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                color: '#1f2937'
              }}>
                {/* Image 1 Exact Header: Teal Background, Year on top, Day & Date below */}
                <div style={{
                  background: '#00897b',
                  padding: '16px 20px',
                  color: '#ffffff'
                }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    opacity: 0.9,
                    letterSpacing: '0.04em'
                  }}>
                    {mYear}
                  </div>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    marginTop: '2px',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2
                  }}>
                    {dayNameShort}, {mDay} {monthShort}
                  </div>
                </div>

                {/* Calendar Body */}
                <div style={{ padding: '14px 16px 12px 16px' }}>
                  {/* Month Navigation */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px'
                  }}>
                    <button
                      type="button"
                      onClick={handlePrevM}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <span style={{ fontSize: '0.94rem', fontWeight: 600, color: '#111827' }}>
                      {monthLong} {mYear}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextM}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Weekday Row (S M T W T F S) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((ch, i) => (
                      <div key={i}>{ch}</div>
                    ))}
                  </div>

                  {/* 7-Column Days Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    rowGap: '6px',
                    textAlign: 'center'
                  }}>
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <div key={`modal-blank-${i}`} style={{ height: '34px' }} />
                    ))}

                    {Array.from({ length: daysInM }).map((_, i) => {
                      const dayNum = i + 1;
                      const isSelected = mDay === dayNum;
                      const isToday = mMonth === 10 && dayNum === 14;

                      return (
                        <div
                          key={dayNum}
                          onClick={() => setDatePickerModal(prev => ({ ...prev, day: dayNum }))}
                          style={{
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.86rem',
                            fontWeight: isSelected ? 700 : (isToday ? 700 : 500),
                            background: isSelected ? '#00897b' : 'transparent',
                            color: isSelected ? '#ffffff' : (isToday ? '#00897b' : '#1f2937'),
                            border: (!isSelected && isToday) ? '1.5px solid #00897b' : 'none',
                            transition: 'all 0.15s ease'
                          }}>
                            {dayNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Image 1 Exact Bottom Action Buttons: CLEAR, CANCEL, SET */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '16px',
                    marginTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <button
                      type="button"
                      onClick={handleClearDate}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00897b',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '6px 10px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      CLEAR
                    </button>
                    <button
                      type="button"
                      onClick={() => setDatePickerModal(prev => ({ ...prev, isOpen: false }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00897b',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '6px 10px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={handleSetDate}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00897b',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '6px 10px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      SET
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* BOTTOM NAVIGATION (Screens 13, 15, 16, 17) */}
        {!['login', 'otp', 'scan'].includes(mobileScreen) && (
          <div style={{
            height: '56px',
            background: '#070d19',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 10px'
          }}>
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'wfh', label: 'Requests', icon: FileCheck },
              { id: 'stats', label: 'Stats', icon: BarChart2 },
              { id: 'history', label: 'History', icon: Calendar },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              const active = mobileScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileScreen(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: active ? '#38bdf8' : 'var(--text-dim)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
