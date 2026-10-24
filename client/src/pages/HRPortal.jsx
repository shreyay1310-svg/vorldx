import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Activity,
  Users,
  Calendar,
  Home,
  FileText,
  ShieldAlert,
  Briefcase,
  TrendingUp,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Moon,
  Sparkles,
  LogOut,
  Plus,
  UserPlus,
  Download,
  Filter,
  Check,
  X,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Edit3,
  DollarSign,
  Award,
  BookOpen,
  UserCheck,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  Key,
  CheckCheck,
  Send,
  ExternalLink,
  MapPin,
  Building,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Menu
} from 'lucide-react';
import { api } from '../api';
import './HRPortal.css';

function playPunchChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

export default function HRPortal({ onLogout, onSwitchToAdmin, onSwitchToEmployee }) {
  // Current user: Priya Sharma (HR Manager) matching Image
  const [currentUser, setCurrentUser] = useState({
    id: 'EMP002',
    name: 'Priya Sharma',
    role: 'HR Manager',
    email: 'priya.sharma@vorldx.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128'
  });

  // Active module matching the 16 screens
  const [activeModule, setActiveModule] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Trigger brief alert toast
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 16 Screens Switcher List matching Image
  const hrScreens = [
    { id: 'dashboard', label: '1. HR Dashboard (Admin)' },
    { id: 'employees', label: '2. Employee Management' },
    { id: 'attendance', label: '3. Attendance Management' },
    { id: 'leaves', label: '4. Leave Requests' },
    { id: 'wfh', label: '5. WFH Requests' },
    { id: 'hr_management', label: '6. HR Management' },
    { id: 'recruitment', label: '7. Recruitment (Hiring)' },
    { id: 'performance', label: '8. Performance Management' },
    { id: 'training', label: '9. Training & Development' },
    { id: 'payroll', label: '10. Payroll Management' },
    { id: 'policies', label: '11. Company Policies' },
    { id: 'notices', label: '12. Notices & Announcements' },
    { id: 'reports', label: '13. Reports & Analytics' },
    { id: 'calendar', label: '14. Team Calendar' },
    { id: 'settings', label: '15. General Settings' },
    { id: 'help', label: '16. Help & Support' }
  ];

  // =========================================================================
  // STATE: Recent Activities (Screen 1)
  // =========================================================================
  const [showRecentActivitiesModal, setShowRecentActivitiesModal] = useState(false);
  const [recentActivitiesFilter, setRecentActivitiesFilter] = useState('All');
  const [recentActivitiesList, setRecentActivitiesList] = useState([
    { id: 1, type: 'Leave', text: 'Sakshi Verma leave request approved', time: '15 min ago', color: '#10b981', user: 'Priya Sharma (HR)' },
    { id: 2, type: 'Employee', text: 'New employee added - Neha Singh (Engineering)', time: '25 min ago', color: '#38bdf8', user: 'Admin' },
    { id: 3, type: 'WFH', text: 'WFH request pending review for Amit Kumar', time: '1 hour ago', color: '#f59e0b', user: 'System' },
    { id: 4, type: 'Policy', text: 'Company WFH policy guidelines v2.0 updated', time: '2 hours ago', color: '#a855f7', user: 'HR Team' },
    { id: 5, type: 'Attendance', text: 'Biometric device sync completed for Bangalore Hub', time: '3 hours ago', color: '#10b981', user: 'System' },
    { id: 6, type: 'Payroll', text: 'Monthly payroll batch October 2026 pre-processed', time: '4 hours ago', color: '#38bdf8', user: 'Finance' },
    { id: 7, type: 'Leave', text: 'Rohit Singh sick leave request rejected', time: '5 hours ago', color: '#ef4444', user: 'Priya Sharma (HR)' },
    { id: 8, type: 'Training', text: 'New mandatory Cybersecurity Compliance course published', time: 'Yesterday', color: '#a855f7', user: 'L&D Dept' }
  ]);

  const logActivity = (type, text, color = '#38bdf8', user = 'Priya Sharma') => {
    setRecentActivitiesList(prev => [
      { id: Date.now(), type, text, time: 'Just now', color, user },
      ...prev
    ]);
  };

  // =========================================================================
  // STATE: Employees List (Screen 2)
  // =========================================================================
  const [empDeptFilter, setEmpDeptFilter] = useState('All Departments');
  const [empStatusFilter, setEmpStatusFilter] = useState('All Status');
  const [empSearchQuery, setEmpSearchQuery] = useState('');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [selectedEmployeeModal, setSelectedEmployeeModal] = useState(null);
  const [editEmployeeStatus, setEditEmployeeStatus] = useState('');

  // 2-Step Employee Onboarding & Mail OTP States
  const [addEmpStep, setAddEmpStep] = useState(1); // 1: Details & Send OTP, 2: Enter OTP & Verify
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtpCode, setGeneratedOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [dispatchedMailPreviewUrl, setDispatchedMailPreviewUrl] = useState(null);
  const [showGmailSetupModal, setShowGmailSetupModal] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState({ isConfigured: false, user: null, mode: 'ETHEREAL_TEST' });
  const [smtpForm, setSmtpForm] = useState({ user: 'shreyay1310@gmail.com', pass: '' });
  const [smtpSaving, setSmtpSaving] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [dispatchedMailMode, setDispatchedMailMode] = useState(null);
  const [showNewEmpPassword, setShowNewEmpPassword] = useState(false);
  const [congratsWelcomeMailModal, setCongratsWelcomeMailModal] = useState(null);

  React.useEffect(() => {
    api.getSmtpStatus().then(st => {
      if (st) setSmtpStatus(st);
    }).catch(() => {});
  }, []);

  const handleSaveSmtp = async (e) => {
    e.preventDefault();
    if (!smtpForm.user.trim() || !smtpForm.pass.trim()) {
      triggerToast('⚠️ Please enter both Gmail ID and Google App Password');
      return;
    }
    setSmtpSaving(true);
    try {
      const res = await api.saveSmtpConfig(smtpForm);
      if (res && res.success) {
        setSmtpStatus({ isConfigured: true, user: res.user, mode: 'GMAIL_LIVE' });
        setShowGmailSetupModal(false);
        playPunchChime();
        try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch(e){}
        triggerToast('✅ Google SMTP Connected! Verification OTPs will now deliver straight to Gmail inboxes!');
      } else {
        triggerToast('❌ ' + (res?.error || 'Authentication Failed'));
      }
    } catch (err) {
      triggerToast('❌ ' + (err.message || 'Connection failed'));
    } finally {
      setSmtpSaving(false);
    }
  };

  const [newEmp, setNewEmp] = useState({
    name: 'SHREYA YADAV',
    id: 'EMP042',
    department: 'Engineering',
    designation: 'Software Developer',
    status: 'Present',
    email: 'shreyay1310@gmail.com',
    phone: '+91 85289 10171',
    password: 'Password@123',
    shift: 'General (09:00 AM - 06:00 PM)'
  });

  const [employeesList, setEmployeesList] = useState([
    { id: 'EMP001', name: 'Rahul Verma', department: 'Engineering', designation: 'Software Developer', status: 'Present', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128', email: 'rahul.verma@vorldx.com', phone: '+91 98765 43210', joinDate: '12 Jan 2024' },
    { id: 'EMP002', name: 'Priya Sharma', department: 'HR', designation: 'HR Manager', status: 'Present', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128', email: 'priya.sharma@vorldx.com', phone: '+91 98765 43211', joinDate: '01 Mar 2023' },
    { id: 'EMP003', name: 'Amit Kumar', department: 'Marketing', designation: 'Marketing Executive', status: 'WFH', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128', email: 'amit.kumar@vorldx.com', phone: '+91 98765 43212', joinDate: '15 Aug 2024' },
    { id: 'EMP004', name: 'Neha Gupta', department: 'Sales', designation: 'Sales Executive', status: 'On Leave', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128', email: 'neha.gupta@vorldx.com', phone: '+91 98765 43213', joinDate: '10 Nov 2023' },
    { id: 'EMP005', name: 'Rohit Singh', department: 'Finance', designation: 'Accountant', status: 'Present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128', email: 'rohit.singh@vorldx.com', phone: '+91 98765 43214', joinDate: '05 Feb 2024' },
    { id: 'EMP006', name: 'Sneha Yadav', department: 'Engineering', designation: 'DevOps Engineer', status: 'Absent', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128', email: 'sneha.yadav@vorldx.com', phone: '+91 98765 43215', joinDate: '20 Jul 2024' },
    { id: 'EMP007', name: 'Karan Patel', department: 'HR', designation: 'Recruiter', status: 'WFH', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128', email: 'karan.patel@vorldx.com', phone: '+91 98765 43216', joinDate: '01 Jun 2024' },
    { id: 'EMP008', name: 'Anjali Verma', department: 'Marketing', designation: 'Content Writer', status: 'Present', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128', email: 'anjali.verma@vorldx.com', phone: '+91 98765 43217', joinDate: '18 Sep 2024' }
  ]);

  const filteredEmployees = employeesList.filter(emp => {
    const q = empSearchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q);
    const matchesDept = empDeptFilter === 'All Departments' || emp.department.toLowerCase() === empDeptFilter.toLowerCase();
    const matchesStatus = empStatusFilter === 'All Status' || emp.status.toLowerCase() === empStatusFilter.toLowerCase();
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Step 1: Send OTP to Employee's Mail
  const handleSendOtpToEmployeeMail = async (e) => {
    e.preventDefault();
    if (!newEmp.name.trim() || !newEmp.email.trim()) {
      triggerToast('⚠️ Please enter employee Name and Email');
      return;
    }
    setOtpSending(true);
    try {
      const resp = await api.sendOnboardingOtp({
        email: newEmp.email.trim(),
        name: newEmp.name.trim(),
        id: newEmp.id || `EMP${Math.floor(100 + Math.random() * 900)}`,
        designation: newEmp.designation,
        department: newEmp.department
      });

      if (resp && resp.success) {
        setGeneratedOtpCode(resp.otp);
        setDispatchedMailPreviewUrl(resp.previewUrl || null);
        setDispatchedMailMode(resp.mode || 'ETHEREAL_TEST');
        setAddEmpStep(2);
        playPunchChime();
        triggerToast(`📬 Verification OTP dispatched to ${newEmp.email}!`);
      } else {
        triggerToast('⚠️ ' + (resp?.error || 'Failed to dispatch OTP mail'));
      }
    } catch (err) {
      console.error('Error dispatching OTP:', err);
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtpCode(mockOtp);
      setAddEmpStep(2);
      triggerToast(`📬 Verification OTP dispatched to ${newEmp.email}!`);
    } finally {
      setOtpSending(false);
    }
  };

  // Step 2: Verify OTP and Save Employee into SQLite DB & Trigger Welcome Email
  const handleVerifyAndSaveEmployee = async (e) => {
    if (e) e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      triggerToast('⚠️ Please enter the full 6-digit OTP code');
      return;
    }

    if (generatedOtpCode && enteredOtp.trim() !== generatedOtpCode.trim()) {
      triggerToast('❌ Invalid OTP! Code does not match the OTP sent to mail');
      return;
    }

    setSavingEmployee(true);
    const finalId = newEmp.id || `EMP${Math.floor(100 + Math.random() * 900)}`;

    try {
      // 1. Create in backend SQLite DB (triggers mailer.sendWelcomeEmail)
      const res = await api.createEmployee({
        id: finalId,
        name: newEmp.name,
        email: newEmp.email,
        phone: newEmp.phone,
        department: newEmp.department,
        designation: newEmp.designation,
        status: newEmp.status || 'Active',
        shift: newEmp.shift || 'General (09:00 AM - 06:00 PM)',
        password: newEmp.password || 'Welcome@123',
        joining_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      });

      const addedEmployee = {
        id: finalId,
        name: newEmp.name,
        department: newEmp.department,
        designation: newEmp.designation,
        status: 'Present',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128',
        email: newEmp.email,
        phone: newEmp.phone,
        joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      setEmployeesList([addedEmployee, ...employeesList]);
      setAttendanceRecordsList(prev => [
        {
          id: Date.now(),
          empId: finalId,
          name: newEmp.name,
          in: '09:00 AM',
          out: '--',
          hrs: 'Present',
          status: 'Present',
          ip: '192.168.1.100',
          mode: 'Biometric Face ID',
          location: 'HQ - Main Office'
        },
        ...prev
      ]);

      logActivity('Employee', `New employee onboarded & verified: ${newEmp.name} (${finalId})`, '#10b981');
      playPunchChime();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Open Congratulations Welcome Mail modal
      setCongratsWelcomeMailModal({
        name: newEmp.name,
        id: finalId,
        email: newEmp.email,
        department: newEmp.department,
        designation: newEmp.designation,
        shift: newEmp.shift || 'General (09:00 AM - 06:00 PM)',
        password: newEmp.password || 'Welcome@123',
        welcomePreviewUrl: res?.emailNotification ? (res.emailNotification.previewUrl || dispatchedMailPreviewUrl) : dispatchedMailPreviewUrl
      });

      setShowAddEmpModal(false);
      setAddEmpStep(1);
      setEnteredOtp('');
      triggerToast(`🎉 Congratulations! ${newEmp.name} successfully registered & welcome mail sent!`);
    } catch (err) {
      console.error('Error saving employee:', err);
      triggerToast('⚠️ ' + (err.message || 'Failed to save employee'));
    } finally {
      setSavingEmployee(false);
    }
  };

  const handleUpdateEmployeeStatus = (empId, newStatus) => {
    setEmployeesList(prev => prev.map(e => e.id === empId ? { ...e, status: newStatus } : e));
    setAttendanceRecordsList(prev => prev.map(a => a.empId === empId ? { ...a, status: newStatus } : a));
    if (selectedEmployeeModal && selectedEmployeeModal.id === empId) {
      setSelectedEmployeeModal(prev => ({ ...prev, status: newStatus }));
    }
    logActivity('Employee', `Status updated for ${selectedEmployeeModal?.name || empId} to ${newStatus}`, '#10b981');
    triggerToast(`✓ Employee status updated to ${newStatus}`);
  };

  // =========================================================================
  // STATE: Attendance Management (Screen 3)
  // =========================================================================
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('All');
  const [showAttendanceReportModal, setShowAttendanceReportModal] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [editPunchIn, setEditPunchIn] = useState('');
  const [editPunchOut, setEditPunchOut] = useState('');
  const [reportDateRange, setReportDateRange] = useState('Today (22 Oct 2026)');
  const [reportFormat, setReportFormat] = useState('CSV');

  const [attendanceRecordsList, setAttendanceRecordsList] = useState([
    { id: 1, empId: 'EMP001', name: 'Rahul Verma', in: '09:00 AM', out: '06:12 PM', hrs: '9h 12m', status: 'Present', ip: '192.168.1.45', mode: 'Biometric Face ID', location: 'HQ - Floor 3' },
    { id: 2, empId: 'EMP002', name: 'Priya Sharma', in: '09:05 AM', out: '06:00 PM', hrs: '8h 55m', status: 'Present', ip: '192.168.1.12', mode: 'Biometric Fingerprint', location: 'HQ - Floor 2' },
    { id: 3, empId: 'EMP003', name: 'Amit Kumar', in: '09:15 AM', out: '05:15 PM', hrs: '8h 00m', status: 'WFH', ip: '122.161.44.89', mode: 'Web Portal Punch', location: 'Remote (Bengaluru)' },
    { id: 4, empId: 'EMP004', name: 'Neha Gupta', in: '--', out: '--', hrs: '0h 00m', status: 'On Leave', ip: '--', mode: 'Approved Sick Leave', location: '--' },
    { id: 5, empId: 'EMP005', name: 'Rohit Singh', in: '08:50 AM', out: '06:20 PM', hrs: '9h 30m', status: 'Present', ip: '192.168.1.78', mode: 'Biometric Face ID', location: 'HQ - Floor 1' },
    { id: 6, empId: 'EMP006', name: 'Sneha Yadav', in: '--', out: '--', hrs: '0h 00m', status: 'Absent', ip: '--', mode: 'Unexcused Absence', location: '--' },
    { id: 7, empId: 'EMP007', name: 'Karan Patel', in: '09:30 AM', out: '05:30 PM', hrs: '8h 00m', status: 'WFH', ip: '115.240.18.52', mode: 'Mobile App Geo-Punch', location: 'Remote (Pune)' },
    { id: 8, empId: 'EMP008', name: 'Anjali Verma', in: '09:10 AM', out: '06:15 PM', hrs: '9h 05m', status: 'Present', ip: '192.168.1.91', mode: 'Biometric Face ID', location: 'HQ - Floor 4' }
  ]);

  const filteredAttendanceRecords = attendanceRecordsList.filter(row => {
    if (attendanceStatusFilter === 'All') return true;
    return row.status.toLowerCase().replace(/\s+/g, '') === attendanceStatusFilter.toLowerCase().replace(/\s+/g, '');
  });

  const handleUpdatePunchRecord = (e) => {
    e.preventDefault();
    if (!selectedAttendanceRecord) return;
    setAttendanceRecordsList(prev => prev.map(rec => {
      if (rec.id === selectedAttendanceRecord.id) {
        return {
          ...rec,
          in: editPunchIn || rec.in,
          out: editPunchOut || rec.out,
          hrs: editPunchIn && editPunchOut ? 'Adjusted' : rec.hrs
        };
      }
      return rec;
    }));
    logActivity('Attendance', `Punch corrected for ${selectedAttendanceRecord.name} (In: ${editPunchIn}, Out: ${editPunchOut})`, '#10b981');
    triggerToast(`✓ Punch records updated for ${selectedAttendanceRecord.name}`);
    setSelectedAttendanceRecord(null);
  };

  const handleDownloadAttendanceCSV = () => {
    const headers = ['#', 'Employee ID', 'Name', 'Check In', 'Check Out', 'Duration', 'Status', 'Mode', 'Location', 'IP'];
    const rows = attendanceRecordsList.map((r, i) => [
      i + 1,
      r.empId,
      `"${r.name}"`,
      r.in,
      r.out,
      r.hrs,
      r.status,
      `"${r.mode}"`,
      `"${r.location}"`,
      r.ip
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WorldX_Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowAttendanceReportModal(false);
    logActivity('Attendance', 'Attendance CSV report downloaded by HR', '#38bdf8');
    triggerToast('✓ Attendance report CSV downloaded successfully!');
  };

  // =========================================================================
  // STATE: Leave Requests (Screen 4)
  // =========================================================================
  const [leaveTab, setLeaveTab] = useState('All');
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [selectedLeaveModal, setSelectedLeaveModal] = useState(null);
  const [newLeaveForm, setNewLeaveForm] = useState({
    emp: 'Rahul Verma',
    type: 'Sick Leave',
    from: '2026-10-24',
    to: '2026-10-25',
    days: 2,
    reason: 'Medical checkup and recovery'
  });
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, emp: 'Neha Gupta', type: 'Sick Leave', from: '14 Oct 2026', to: '15 Oct 2026', days: 2, status: 'Pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128', reason: 'High viral fever and rest prescribed by doctor' },
    { id: 2, emp: 'Amit Kumar', type: 'Casual Leave', from: '16 Oct 2026', to: '17 Oct 2026', days: 2, status: 'Approved', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128', reason: 'Family engagement ceremony out of town' },
    { id: 3, emp: 'Priya Sharma', type: 'Earned Leave', from: '20 Oct 2026', to: '24 Oct 2026', days: 5, status: 'Pending', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128', reason: 'Annual planned family vacation' },
    { id: 4, emp: 'Rohit Singh', type: 'Sick Leave', from: '10 Oct 2026', to: '10 Oct 2026', days: 1, status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128', reason: 'Emergency dental extraction' },
    { id: 5, emp: 'Sneha Yadav', type: 'Casual Leave', from: '28 Sep 2026', to: '29 Sep 2026', days: 2, status: 'Approved', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128', reason: 'Relocating to new apartment in Bengaluru' },
    { id: 6, emp: 'Rahul Verma', type: 'Casual Leave', from: '22 Oct 2026', to: '22 Oct 2026', days: 1, status: 'Pending', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128', reason: 'Personal documentation and RTO appointment' },
    { id: 7, emp: 'Karan Patel', type: 'Sick Leave', from: '18 Oct 2026', to: '19 Oct 2026', days: 2, status: 'Approved', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128', reason: 'Severe migraine recovery' },
    { id: 8, emp: 'Anjali Verma', type: 'Earned Leave', from: '05 Nov 2026', to: '08 Nov 2026', days: 4, status: 'Pending', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128', reason: 'Attending brother wedding celebrations' },
    { id: 9, emp: 'Vikas Rai', type: 'Casual Leave', from: '12 Oct 2026', to: '13 Oct 2026', days: 2, status: 'Approved', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128', reason: 'Bank documentation & legal work' },
    { id: 10, emp: 'Sakshi Verma', type: 'Sick Leave', from: '01 Oct 2026', to: '02 Oct 2026', days: 2, status: 'Approved', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128', reason: 'Eye surgery follow-up checkup' },
    { id: 11, emp: 'Anjan Patel', type: 'Casual Leave', from: '15 Sep 2026', to: '16 Sep 2026', days: 2, status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128', reason: 'Short notice personal travel' },
    { id: 12, emp: 'Neha Singh', type: 'Earned Leave', from: '25 Oct 2026', to: '27 Oct 2026', days: 3, status: 'Pending', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128', reason: 'Diwali festive extension leave' }
  ]);

  const handleLeaveAction = (id, newStatus) => {
    const item = leaveRequests.find(l => l.id === id);
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (newStatus === 'Approved' && item) {
      setEmployeesList(prev => prev.map(e => e.name === item.emp ? { ...e, status: 'On Leave' } : e));
      setAttendanceRecordsList(prev => prev.map(a => a.name === item.emp ? { ...a, status: 'On Leave' } : a));
    }
    logActivity('Leave', `Leave request for ${item?.emp || 'Employee'} marked as ${newStatus}`, newStatus === 'Approved' ? '#10b981' : '#ef4444');
    triggerToast(`✓ Leave request marked as ${newStatus}`);
    if (selectedLeaveModal && selectedLeaveModal.id === id) {
      setSelectedLeaveModal(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleCreateLeaveRequest = (e) => {
    e.preventDefault();
    const matched = employeesList.find(emp => emp.name === newLeaveForm.emp);
    const newReq = {
      id: Date.now(),
      emp: newLeaveForm.emp,
      type: newLeaveForm.type,
      from: newLeaveForm.from,
      to: newLeaveForm.to,
      days: Number(newLeaveForm.days) || 1,
      reason: newLeaveForm.reason || 'Personal necessity',
      status: 'Pending',
      avatar: matched?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128'
    };
    setLeaveRequests([newReq, ...leaveRequests]);
    logActivity('Leave', `New ${newLeaveForm.type} submitted for ${newLeaveForm.emp} (${newReq.days} days)`, '#f59e0b');
    setShowNewLeaveModal(false);
    triggerToast(`✓ Leave request submitted for ${newLeaveForm.emp}`);
  };

  // =========================================================================
  // STATE: WFH Requests (Screen 5)
  // =========================================================================
  const [wfhTab, setWfhTab] = useState('All');
  const [showNewWfhModal, setShowNewWfhModal] = useState(false);
  const [selectedWfhModal, setSelectedWfhModal] = useState(null);
  const [newWfhForm, setNewWfhForm] = useState({
    emp: 'Rahul Verma',
    from: '2026-10-23',
    to: '2026-10-24',
    days: 2,
    reason: 'Broadband technician visit and setup'
  });
  const [wfhRequests, setWfhRequests] = useState([
    { id: 1, emp: 'Rahul Verma', from: '14 Oct 2026', to: '14 Oct 2026', days: 1, reason: 'Personal work', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128' },
    { id: 2, emp: 'Neha Gupta', from: '15 Oct 2026', to: '16 Oct 2026', days: 2, reason: 'Health issue', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 3, emp: 'Amit Kumar', from: '12 Oct 2026', to: '12 Oct 2026', days: 1, reason: 'Internet issue', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 4, emp: 'Priya Sharma', from: '01 Oct 2026', to: '02 Oct 2026', days: 2, reason: 'Family function', status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 5, emp: 'Karan Patel', from: '28 Sep 2026', to: '29 Sep 2026', days: 2, reason: 'Official work', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128' }
  ]);

  const handleWfhAction = (id, newStatus) => {
    const item = wfhRequests.find(w => w.id === id);
    setWfhRequests(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
    if (newStatus === 'Approved' && item) {
      setEmployeesList(prev => prev.map(e => e.name === item.emp ? { ...e, status: 'WFH' } : e));
      setAttendanceRecordsList(prev => prev.map(a => a.name === item.emp ? { ...a, status: 'WFH' } : a));
    }
    logActivity('WFH', `WFH request for ${item?.emp || 'Employee'} marked as ${newStatus}`, newStatus === 'Approved' ? '#10b981' : '#ef4444');
    triggerToast(`✓ WFH request marked as ${newStatus}`);
    if (selectedWfhModal && selectedWfhModal.id === id) {
      setSelectedWfhModal(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleCreateWfhRequest = (e) => {
    e.preventDefault();
    const matched = employeesList.find(emp => emp.name === newWfhForm.emp);
    const newReq = {
      id: Date.now(),
      emp: newWfhForm.emp,
      from: newWfhForm.from,
      to: newWfhForm.to,
      days: Number(newWfhForm.days) || 1,
      reason: newWfhForm.reason || 'Remote work requirement',
      status: 'Pending',
      avatar: matched?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128'
    };
    setWfhRequests([newReq, ...wfhRequests]);
    logActivity('WFH', `New WFH request submitted for ${newWfhForm.emp} (${newReq.days} days)`, '#f59e0b');
    setShowNewWfhModal(false);
    triggerToast(`✓ WFH request for ${newWfhForm.emp} submitted successfully!`);
  };

  // Dynamic counts for tabs & badges
  const pendingWfhCount = wfhRequests.filter(r => r.status === 'Pending').length;
  const approvedWfhCount = wfhRequests.filter(r => r.status === 'Approved').length;
  const rejectedWfhCount = wfhRequests.filter(r => r.status === 'Rejected').length;

  const pendingLeaveCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const approvedLeaveCount = leaveRequests.filter(r => r.status === 'Approved').length;
  const rejectedLeaveCount = leaveRequests.filter(r => r.status === 'Rejected').length;

  // 13 Sidebar Items matching Image with dynamic badges
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'wfh', label: 'WFH Requests', icon: Home, badge: pendingWfhCount },
    { id: 'leaves', label: 'Leave Requests', icon: FileText, badge: pendingLeaveCount },
    { id: 'hr_management', label: 'HR Management', icon: ShieldAlert },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'training', label: 'Training & Development', icon: GraduationCap },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'policies', label: 'Policies', icon: ShieldCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // =========================================================================
  // STATE: HR Management Tabs (Screen 6)
  // =========================================================================
  const [hrMgmtTab, setHrMgmtTab] = useState('Departments');
  const [showAddHrModal, setShowAddHrModal] = useState(false);
  const [editingHrItem, setEditingHrItem] = useState(null);
  const [newHrForm, setNewHrForm] = useState({
    name: '',
    head: '',
    count: 10,
    dept: 'Engineering',
    date: '2026-11-01',
    day: 'Sunday',
    type: 'Gazetted Holiday',
    address: '',
    staff: 25,
    timings: '09:00 AM - 06:00 PM',
    duration: '9 Hours',
    pay: '₹40,000 - ₹80,000'
  });

  const [departmentsList, setDepartmentsList] = useState([
    { id: 1, dept: 'Engineering', head: 'Ankit Kumar', count: 50, status: 'Active' },
    { id: 2, dept: 'Human Resources', head: 'Neha Gupta', count: 12, status: 'Active' },
    { id: 3, dept: 'Marketing', head: 'Priya Sharma', count: 20, status: 'Active' },
    { id: 4, dept: 'Sales', head: 'Anjan Patel', count: 35, status: 'Active' },
    { id: 5, dept: 'Finance', head: 'Vikas Rai', count: 15, status: 'Active' },
    { id: 6, dept: 'Support', head: 'Sneha Singh', count: 24, status: 'Active' }
  ]);

  const [designationsList, setDesignationsList] = useState([
    { id: 1, title: 'Software Developer', dept: 'Engineering', count: 35, pay: '₹40,000 - ₹80,000', status: 'Active' },
    { id: 2, title: 'HR Manager', dept: 'Human Resources', count: 4, pay: '₹50,000 - ₹90,000', status: 'Active' },
    { id: 3, title: 'Marketing Specialist', dept: 'Marketing', count: 12, pay: '₹35,000 - ₹65,000', status: 'Active' },
    { id: 4, title: 'Sales Executive', dept: 'Sales', count: 25, pay: '₹30,000 - ₹60,000', status: 'Active' },
    { id: 5, title: 'Accountant', dept: 'Finance', count: 8, pay: '₹35,000 - ₹70,000', status: 'Active' },
    { id: 6, title: 'DevOps Engineer', dept: 'Engineering', count: 10, pay: '₹50,000 - ₹1,00,000', status: 'Active' }
  ]);

  const [holidaysList, setHolidaysList] = useState([
    { id: 1, name: 'Diwali', date: '24 Oct 2026', day: 'Saturday', type: 'Gazetted Holiday', status: 'Upcoming' },
    { id: 2, name: 'Eid-ul-Fitr', date: '11 Apr 2026', day: 'Saturday', type: 'Gazetted Holiday', status: 'Passed' },
    { id: 3, name: 'Christmas Day', date: '25 Dec 2026', day: 'Friday', type: 'Gazetted Holiday', status: 'Upcoming' },
    { id: 4, name: 'Republic Day', date: '26 Jan 2026', day: 'Monday', type: 'National Holiday', status: 'Passed' },
    { id: 5, name: 'Independence Day', date: '15 Aug 2026', day: 'Saturday', type: 'National Holiday', status: 'Passed' },
    { id: 6, name: 'Gandhi Jayanti', date: '02 Oct 2026', day: 'Friday', type: 'National Holiday', status: 'Passed' },
    { id: 7, name: 'Holi', date: '04 Mar 2026', day: 'Wednesday', type: 'Gazetted Holiday', status: 'Passed' }
  ]);

  const [workLocationsList, setWorkLocationsList] = useState([
    { id: 1, name: 'Bangalore HQ', address: 'Koramangala 4th Block, Bengaluru', staff: 140, type: 'Primary Office', status: 'Active' },
    { id: 2, name: 'Lucknow Delivery Center', address: 'Gomti Nagar Phase 2, Lucknow', staff: 65, type: 'Regional Hub', status: 'Active' },
    { id: 3, name: 'Pune Tech Center', address: 'Hinjewadi IT Park, Pune', staff: 35, type: 'Development Hub', status: 'Active' },
    { id: 4, name: 'Remote Workspaces', address: 'Pan-India Remote WFH Network', staff: 20, type: 'Virtual Workspace', status: 'Active' }
  ]);

  const [shiftsList, setShiftsList] = useState([
    { id: 1, name: 'General Shift', timings: '09:00 AM - 06:00 PM', duration: '9 Hours', lunch: '60 Min', grace: '15 Min', status: 'Active' },
    { id: 2, name: 'Morning Shift', timings: '06:00 AM - 03:00 PM', duration: '9 Hours', lunch: '45 Min', grace: '10 Min', status: 'Active' },
    { id: 3, name: 'Evening Shift', timings: '02:00 PM - 11:00 PM', duration: '9 Hours', lunch: '45 Min', grace: '10 Min', status: 'Active' },
    { id: 4, name: 'Night Shift', timings: '10:00 PM - 07:00 AM', duration: '9 Hours', lunch: '60 Min', grace: '15 Min', status: 'Active' }
  ]);

  const handleSaveHrItem = (e) => {
    e.preventDefault();
    if (editingHrItem) {
      if (hrMgmtTab === 'Departments') {
        setDepartmentsList(prev => prev.map(d => d.id === editingHrItem.id ? { ...d, dept: newHrForm.name || d.dept, head: newHrForm.head || d.head, count: Number(newHrForm.count) || d.count } : d));
      } else if (hrMgmtTab === 'Designations') {
        setDesignationsList(prev => prev.map(d => d.id === editingHrItem.id ? { ...d, title: newHrForm.name || d.title, dept: newHrForm.dept || d.dept, pay: newHrForm.pay || d.pay } : d));
      } else if (hrMgmtTab === 'Holidays') {
        setHolidaysList(prev => prev.map(h => h.id === editingHrItem.id ? { ...h, name: newHrForm.name || h.name, date: newHrForm.date || h.date, type: newHrForm.type || h.type } : h));
      } else if (hrMgmtTab === 'Work Locations') {
        setWorkLocationsList(prev => prev.map(l => l.id === editingHrItem.id ? { ...l, name: newHrForm.name || l.name, address: newHrForm.address || l.address, staff: Number(newHrForm.staff) || l.staff } : l));
      } else if (hrMgmtTab === 'Shifts') {
        setShiftsList(prev => prev.map(s => s.id === editingHrItem.id ? { ...s, name: newHrForm.name || s.name, timings: newHrForm.timings || s.timings, duration: newHrForm.duration || s.duration } : s));
      }
      triggerToast(`✓ ${editingHrItem.name || 'Item'} updated successfully!`);
      setEditingHrItem(null);
    } else {
      const newId = Date.now();
      if (hrMgmtTab === 'Departments') {
        setDepartmentsList(prev => [...prev, { id: newId, dept: newHrForm.name || 'New Dept', head: newHrForm.head || 'TBD', count: Number(newHrForm.count) || 1, status: 'Active' }]);
      } else if (hrMgmtTab === 'Designations') {
        setDesignationsList(prev => [...prev, { id: newId, title: newHrForm.name || 'New Role', dept: newHrForm.dept || 'Engineering', count: 1, pay: newHrForm.pay || '₹30,000 - ₹50,000', status: 'Active' }]);
      } else if (hrMgmtTab === 'Holidays') {
        setHolidaysList(prev => [...prev, { id: newId, name: newHrForm.name || 'New Holiday', date: newHrForm.date || '2026-11-15', day: newHrForm.day || 'Sunday', type: newHrForm.type || 'Gazetted Holiday', status: 'Upcoming' }]);
      } else if (hrMgmtTab === 'Work Locations') {
        setWorkLocationsList(prev => [...prev, { id: newId, name: newHrForm.name || 'New Office', address: newHrForm.address || 'India', staff: Number(newHrForm.staff) || 10, type: 'Regional Hub', status: 'Active' }]);
      } else if (hrMgmtTab === 'Shifts') {
        setShiftsList(prev => [...prev, { id: newId, name: newHrForm.name || 'Custom Shift', timings: newHrForm.timings || '10:00 AM - 07:00 PM', duration: '9 Hours', lunch: '45 Min', grace: '15 Min', status: 'Active' }]);
      }
      logActivity('Policy', `Added new ${hrMgmtTab.slice(0, -1)}: ${newHrForm.name}`, '#a855f7');
      triggerToast(`✓ New ${hrMgmtTab.slice(0, -1)} added successfully!`);
      setShowAddHrModal(false);
    }
  };

  // =========================================================================
  // STATE: Recruitment (Screen 7)
  // =========================================================================
  const [recruitmentTab, setRecruitmentTab] = useState('All Openings');
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    dept: 'Engineering',
    exp: '2-4 Years',
    type: 'Full-time',
    location: 'Bangalore / Hybrid',
    openings: 2
  });

  const [jobOpeningsList, setJobOpeningsList] = useState([
    { id: 1, title: 'Software Developer', dept: 'Engineering', apps: 120, status: 'open', exp: '2-4 Years', type: 'Full-time', location: 'Bangalore / Hybrid' },
    { id: 2, title: 'HR Executive', dept: 'Human Resources', apps: 45, status: 'screening', exp: '1-3 Years', type: 'Full-time', location: 'Lucknow Center' },
    { id: 3, title: 'Marketing Specialist', dept: 'Marketing', apps: 60, status: 'interview', exp: '3-5 Years', type: 'Full-time', location: 'Bangalore HQ' },
    { id: 4, title: 'Sales Executive', dept: 'Sales', apps: 28, status: 'open', exp: '2-5 Years', type: 'Full-time', location: 'Pune / Remote' },
    { id: 5, title: 'Accountant', dept: 'Finance', apps: 18, status: 'closed', exp: '4-6 Years', type: 'Full-time', location: 'Bangalore HQ' }
  ]);

  const [jobApplicants, setJobApplicants] = useState([
    { id: 101, name: 'Ananya Roy', email: 'ananya.roy@example.com', exp: '4 Years', score: '94%', stage: 'Shortlisted', role: 'Software Developer' },
    { id: 102, name: 'Manav Sharma', email: 'manav.s@example.com', exp: '3 Years', score: '88%', stage: 'Interview', role: 'Software Developer' },
    { id: 103, name: 'Ritu Sen', email: 'ritu.sen@example.com', exp: '2 Years', score: '82%', stage: 'Screening', role: 'HR Executive' },
    { id: 104, name: 'Deepak Joshi', email: 'deepak.j@example.com', exp: '5 Years', score: '96%', stage: 'Hired', role: 'Marketing Specialist' },
    { id: 105, name: 'Sana Malik', email: 'sana.m@example.com', exp: '3 Years', score: '90%', stage: 'Shortlisted', role: 'Sales Executive' }
  ]);

  const handleApplicantStageChange = (appId, newStage) => {
    setJobApplicants(prev => prev.map(a => a.id === appId ? { ...a, stage: newStage } : a));
    logActivity('Recruitment', `Applicant candidate moved to ${newStage}`, '#38bdf8');
    triggerToast(`✓ Candidate status moved to ${newStage}`);
  };

  const handleCreateJobOpening = (e) => {
    e.preventDefault();
    const newOpening = {
      id: Date.now(),
      title: newJobForm.title || 'New Position',
      dept: newJobForm.dept,
      apps: 0,
      status: 'open',
      exp: newJobForm.exp,
      type: newJobForm.type,
      location: newJobForm.location
    };
    setJobOpeningsList([newOpening, ...jobOpeningsList]);
    logActivity('Recruitment', `New job opening published - ${newOpening.title} (${newOpening.dept})`, '#10b981');
    setShowCreateJobModal(false);
    setNewJobForm({ title: '', dept: 'Engineering', exp: '2-4 Years', type: 'Full-time', location: 'Bangalore / Hybrid', openings: 2 });
    triggerToast(`✓ Job opening "${newOpening.title}" created successfully!`);
  };

  // Filtered jobs
  const filteredJobOpenings = jobOpeningsList.filter(job => {
    if (recruitmentTab === 'All Openings') return true;
    if (recruitmentTab === 'Ongoing') return job.status === 'open' || job.status === 'screening' || job.status === 'interview';
    if (recruitmentTab === 'Closed') return job.status === 'closed';
    return true;
  });

  // =========================================================================
  // STATE: Performance (Screen 8)
  // =========================================================================
  const [perfTab, setPerfTab] = useState('Overview');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [selectedGoalModal, setSelectedGoalModal] = useState(null);
  const [selectedPerformerModal, setSelectedPerformerModal] = useState(null);
  const [newGoalForm, setNewGoalForm] = useState({
    emp: 'Rahul Verma',
    title: '',
    dept: 'Engineering',
    date: '2026-12-15',
    metric: 'Deliver Sprint Objectives with 95% pass rate'
  });

  const [goalsList, setGoalsList] = useState([
    { id: 1, emp: 'Rahul Verma', title: 'Complete Cloud Migration Phase 2', dept: 'Engineering', date: '15 Nov 2026', progress: 85, status: 'In Progress' },
    { id: 2, emp: 'Neha Gupta', title: 'Close 15 Enterprise Deals in Q4', dept: 'Sales', date: '30 Dec 2026', progress: 92, status: 'In Progress' },
    { id: 3, emp: 'Priya Sharma', title: 'Revamp Employee Onboarding Portal', dept: 'HR', date: '31 Oct 2026', progress: 95, status: 'Near Completion' },
    { id: 4, emp: 'Rohit Singh', title: 'Finalize Annual Audit & Balance Sheets', dept: 'Finance', date: '10 Nov 2026', progress: 70, status: 'In Progress' },
    { id: 5, emp: 'Sneha Yadav', title: 'Automate CI/CD Deployment Pipelines', dept: 'Engineering', date: '05 Dec 2026', progress: 60, status: 'In Progress' }
  ]);

  const [reviewsList, setReviewsList] = useState([
    { id: 1, emp: 'Rahul Verma', period: 'Q3 2026', reviewer: 'Ankit Kumar', selfScore: '4.8 / 5.0', mgrScore: '4.7 / 5.0', rating: 'Excellent (4.75)', status: 'Completed' },
    { id: 2, emp: 'Priya Sharma', period: 'Q3 2026', reviewer: 'Director HR', selfScore: '4.5 / 5.0', mgrScore: '4.6 / 5.0', rating: 'Excellent (4.55)', status: 'Completed' },
    { id: 3, emp: 'Amit Kumar', period: 'Q3 2026', reviewer: 'Priya Sharma', selfScore: '4.0 / 5.0', mgrScore: '4.2 / 5.0', rating: 'Good (4.10)', status: 'Completed' },
    { id: 4, emp: 'Rohit Singh', period: 'Q3 2026', reviewer: 'Vikas Rai', selfScore: '3.8 / 5.0', mgrScore: '3.9 / 5.0', rating: 'Good (3.85)', status: 'Completed' },
    { id: 5, emp: 'Neha Gupta', period: 'Q3 2026', reviewer: 'Anjan Patel', selfScore: '4.6 / 5.0', mgrScore: '4.5 / 5.0', rating: 'Excellent (4.55)', status: 'Completed' }
  ]);

  const [appraisalsList, setAppraisalsList] = useState([
    { id: 1, emp: 'Rahul Verma', dept: 'Engineering', current: '₹8,50,000', hike: '15%', revised: '₹9,77,500', rating: 'Excellent', status: 'Pending Approval' },
    { id: 2, emp: 'Priya Sharma', dept: 'HR', current: '₹10,20,000', hike: '12%', revised: '₹11,42,400', rating: 'Excellent', status: 'Approved' },
    { id: 3, emp: 'Amit Kumar', dept: 'Marketing', current: '₹6,50,000', hike: '10%', revised: '₹7,15,000', rating: 'Good', status: 'Pending Approval' },
    { id: 4, emp: 'Rohit Singh', dept: 'Finance', current: '₹7,20,000', hike: '11%', revised: '₹7,99,200', rating: 'Good', status: 'Pending Approval' },
    { id: 5, emp: 'Neha Gupta', dept: 'Sales', current: '₹7,80,000', hike: '14%', revised: '₹8,89,200', rating: 'Excellent', status: 'Approved' }
  ]);

  const handleApproveAppraisal = (id) => {
    setAppraisalsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    logActivity('Payroll', 'Annual appraisal hike approved by HR Management', '#10b981');
    triggerToast('✓ Salary hike appraisal approved successfully!');
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      emp: newGoalForm.emp,
      title: newGoalForm.title || 'New Performance Goal',
      dept: newGoalForm.dept,
      date: newGoalForm.date,
      progress: 0,
      status: 'In Progress'
    };
    setGoalsList([newGoal, ...goalsList]);
    logActivity('Performance', `New goal assigned to ${newGoal.emp}: "${newGoal.title}"`, '#c084fc');
    setShowNewGoalModal(false);
    setNewGoalForm({ emp: 'Rahul Verma', title: '', dept: 'Engineering', date: '2026-12-15', metric: '' });
    triggerToast(`✓ Performance goal assigned to ${newGoal.emp}`);
  };

  const handleUpdateGoalProgress = (goalId, newProgress, newStatus) => {
    setGoalsList(prev => prev.map(g => g.id === goalId ? { ...g, progress: newProgress, status: newStatus || g.status } : g));
    logActivity('Performance', `Goal progress updated to ${newProgress}%`, '#10b981');
    triggerToast(`✓ Goal progress updated to ${newProgress}%`);
    setSelectedGoalModal(null);
  };

  // =========================================================================
  // STATE: Training (Screen 9)
  // =========================================================================
  const [trainingTab, setTrainingTab] = useState('All Trainings');
  const [showCreateTrainingModal, setShowCreateTrainingModal] = useState(false);
  const [selectedTrainingModal, setSelectedTrainingModal] = useState(null);
  const [newTrainingForm, setNewTrainingForm] = useState({
    title: '',
    cat: 'Soft Skills',
    date: '2026-11-05',
    parts: 25,
    trainer: 'Vikram Mehra',
    duration: '2 Days (Workshop)',
    desc: 'Interactive workshop on modern organizational skills.'
  });

  const [trainingsList, setTrainingsList] = useState([
    { id: 1, title: 'Leadership Skills', cat: 'Soft Skills', date: '16 Oct 2026', parts: 25, status: 'Upcoming', trainer: 'Dr. Ramesh Gupta', duration: '3 Days (Executive)', desc: 'Cultivating leadership, cross-team coordination and strategic management competencies.' },
    { id: 2, title: 'Cyber Security', cat: 'Technical', date: '20 Oct 2026', parts: 40, status: 'Upcoming', trainer: 'Vikram Mehra (Infosec Lead)', duration: '2 Days (Hands-on Lab)', desc: 'Zero-trust architecture, threat hunting, secure code practices and data loss prevention.' },
    { id: 3, title: 'Communication', cat: 'Soft Skills', date: '28 Sep 2026', parts: 30, status: 'Completed', trainer: 'Priya Sharma (HR Head)', duration: '1 Day (Interactive)', desc: 'Assertive corporate communication, stakeholder management, and presentation craftsmanship.' },
    { id: 4, title: 'Project Management', cat: 'Technical', date: '20 Sep 2026', parts: 35, status: 'Completed', trainer: 'Ankit Kumar (VP Eng)', duration: '4 Days (Agile PMP)', desc: 'Scrum frameworks, sprint capacity planning, risk mitigation and continuous integration delivery.' },
    { id: 5, title: 'Time Management', cat: 'Soft Skills', date: '15 Sep 2026', parts: 28, status: 'Completed', trainer: 'Sneha Singh', duration: '1 Day', desc: 'Pomodoro frameworks, Eisenhower matrix prioritization, and meeting fatigue reduction.' }
  ]);

  const handleCreateTraining = (e) => {
    e.preventDefault();
    const newTraining = {
      id: Date.now(),
      title: newTrainingForm.title || 'New Training Program',
      cat: newTrainingForm.cat,
      date: newTrainingForm.date,
      parts: Number(newTrainingForm.parts) || 20,
      status: 'Upcoming',
      trainer: newTrainingForm.trainer || 'External Specialist',
      duration: newTrainingForm.duration || '2 Days',
      desc: newTrainingForm.desc || 'Comprehensive organizational training workshop.'
    };
    setTrainingsList([newTraining, ...trainingsList]);
    logActivity('Training', `New training program created: ${newTraining.title} (${newTraining.cat})`, '#a855f7');
    setShowCreateTrainingModal(false);
    setNewTrainingForm({ title: '', cat: 'Soft Skills', date: '2026-11-05', parts: 25, trainer: 'Vikram Mehra', duration: '2 Days', desc: '' });
    triggerToast(`✓ Training program "${newTraining.title}" created successfully!`);
  };

  const handleToggleTrainingStatus = (id) => {
    setTrainingsList(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Upcoming' ? 'Completed' : 'Upcoming';
        if (selectedTrainingModal && selectedTrainingModal.id === id) {
          setSelectedTrainingModal({ ...selectedTrainingModal, status: nextStatus });
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    triggerToast('✓ Training program status updated!');
  };

  const filteredTrainings = trainingsList.filter(t => {
    if (trainingTab === 'All Trainings') return true;
    if (trainingTab === 'Upcoming') return t.status === 'Upcoming';
    if (trainingTab === 'Completed') return t.status === 'Completed';
    return true;
  });

  // =========================================================================
  // STATE: Payroll Management (Screen 10)
  // =========================================================================
  const [selectedPayrollModal, setSelectedPayrollModal] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([
    { id: 'EMP001', name: 'Rahul Verma', basic: '₹40,000', allow: '₹5,000', ded: '₹2,000', net: '₹43,000', status: 'Processed', hra: '₹16,000', special: '₹9,000', pf: '₹1,800', tax: '₹200', bank: 'HDFC Bank •••• 4892' },
    { id: 'EMP002', name: 'Priya Sharma', basic: '₹50,000', allow: '₹6,000', ded: '₹2,500', net: '₹53,500', status: 'Processed', hra: '₹20,000', special: '₹12,000', pf: '₹1,800', tax: '₹700', bank: 'ICICI Bank •••• 1042' },
    { id: 'EMP003', name: 'Amit Kumar', basic: '₹35,000', allow: '₹4,000', ded: '₹1,800', net: '₹37,200', status: 'Processed', hra: '₹14,000', special: '₹7,000', pf: '₹1,800', tax: '₹0', bank: 'SBI Bank •••• 7719' },
    { id: 'EMP004', name: 'Neha Gupta', basic: '₹45,000', allow: '₹5,500', ded: '₹2,200', net: '₹48,300', status: 'Pending', hra: '₹18,000', special: '₹9,500', pf: '₹1,800', tax: '₹400', bank: 'Axis Bank •••• 8933' },
    { id: 'EMP005', name: 'Rohit Singh', basic: '₹38,000', allow: '₹4,500', ded: '₹1,900', net: '₹40,600', status: 'Processed', hra: '₹15,200', special: '₹8,000', pf: '₹1,800', tax: '₹100', bank: 'Kotak Bank •••• 5521' }
  ]);

  const payrollProcessedCount = payrollRecords.filter(p => p.status === 'Processed').length + 241;
  const payrollPendingCount = payrollRecords.filter(p => p.status === 'Pending').length;

  const handleProcessPayroll = (empId) => {
    setPayrollRecords(prev => prev.map(p => p.id === empId ? { ...p, status: 'Processed' } : p));
    if (selectedPayrollModal && selectedPayrollModal.id === empId) {
      setSelectedPayrollModal(prev => ({ ...prev, status: 'Processed' }));
    }
    logActivity('Payroll', `Monthly salary disbursement processed for ${empId}`, '#10b981');
    triggerToast(`✓ Payroll marked as Processed for ${empId}`);
  };

  const handleGenerateAllPayroll = () => {
    setPayrollRecords(prev => prev.map(p => ({ ...p, status: 'Processed' })));
    logActivity('Payroll', 'Batch monthly payroll generated and verified by HR Finance', '#10b981');
    triggerToast('✓ Batch payroll generated for all 250 employees! Bank files ready.');
  };

  const handleDownloadPayslip = (p) => {
    const slipText = `========================================================\n` +
      `                   VorldX Industries Pvt Ltd\n` +
      `                EMPLOYEE SALARY PAYSLIP - OCT 2026\n` +
      `========================================================\n` +
      `Employee ID   : ${p.id}\n` +
      `Employee Name : ${p.name}\n` +
      `Bank Account  : ${p.bank || 'HDFC Bank •••• 4892'}\n` +
      `Status        : ${p.status}\n` +
      `--------------------------------------------------------\n` +
      `EARNINGS                                  AMOUNT\n` +
      `Basic Salary                              ${p.basic}\n` +
      `House Rent Allowance (HRA)                ${p.hra || '₹16,000'}\n` +
      `Special Allowances                        ${p.allow}\n` +
      `--------------------------------------------------------\n` +
      `DEDUCTIONS                                AMOUNT\n` +
      `Provident Fund (PF)                       ${p.pf || '₹1,800'}\n` +
      `TDS / Professional Tax                    ${p.ded}\n` +
      `--------------------------------------------------------\n` +
      `NET TAKE-HOME SALARY                      ${p.net}\n` +
      `========================================================\n` +
      `This is a system-generated payslip authorized by WorldX HR.`;
    const blob = new Blob([slipText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payslip_${p.id}_Oct2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`✓ Payslip downloaded for ${p.name} (${p.id})`);
  };

  // =========================================================================
  // STATE: Company Policies (Screen 11)
  // =========================================================================
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [selectedPolicyModal, setSelectedPolicyModal] = useState(null);
  const [newPolicyForm, setNewPolicyForm] = useState({
    name: '',
    cat: 'HR',
    size: '2.0 MB',
    desc: ''
  });

  const [policiesList, setPoliciesList] = useState([
    { id: 1, name: 'Work From Home Policy', cat: 'WFH', size: '2.4 MB', date: '10 Sep 2026', desc: 'Standard operating procedures for remote employees, hardware asset care, core availability hours (10 AM - 5 PM), and weekly sync attendance requirements.' },
    { id: 2, name: 'Leave & Attendance Policy', cat: 'Leave', size: '1.8 MB', date: '05 Aug 2026', desc: 'Comprehensive leave entitlement manual detailing 12 casual leaves, 10 sick leaves, 15 earned leaves, maternity/paternity policy, and punch-in regularization norms.' },
    { id: 3, name: 'Code of Conduct', cat: 'HR', size: '2.1 MB', date: '01 Aug 2026', desc: 'Zero tolerance toward workplace harassment, professional ethics, POSH compliance, conflict of interest disclosures, and corporate integrity standards.' },
    { id: 4, name: 'Information Security Policy', cat: 'Security', size: '3.2 MB', date: '25 Jul 2026', desc: 'ISO 27001 data protection standards, strict VPN requirements, password rotation intervals, clean desk guidelines, and proprietary intellectual property security.' },
    { id: 5, name: 'Equal Opportunity Policy', cat: 'HR', size: '1.5 MB', date: '20 Jul 2026', desc: 'Commitment to meritocratic hiring, non-discrimination across gender, ethnicity, or background, wage parity guidelines, and accessibility support.' }
  ]);

  const handleAddPolicy = (e) => {
    e.preventDefault();
    const newPolicy = {
      id: Date.now(),
      name: newPolicyForm.name || 'New Company Policy',
      cat: newPolicyForm.cat,
      size: newPolicyForm.size || '1.8 MB',
      date: '23 Oct 2026',
      desc: newPolicyForm.desc || 'Internal policy documentation approved by WorldX Legal & HR.'
    };
    setPoliciesList([newPolicy, ...policiesList]);
    logActivity('Policy', `New policy uploaded: ${newPolicy.name} (${newPolicy.cat})`, '#38bdf8');
    setShowAddPolicyModal(false);
    setNewPolicyForm({ name: '', cat: 'HR', size: '2.0 MB', desc: '' });
    triggerToast(`✓ Company policy "${newPolicy.name}" uploaded successfully!`);
  };

  const handleDownloadPolicy = (policy) => {
    const content = `========================================================\n` +
      `                   VorldX Industries Pvt Ltd\n` +
      `            OFFICIAL POLICY DOCUMENT: ${policy.name.toUpperCase()}\n` +
      `========================================================\n` +
      `Category     : ${policy.cat}\n` +
      `Updated Date : ${policy.date}\n` +
      `Version      : 2026.4 (Approved by HR Legal)\n` +
      `--------------------------------------------------------\n` +
      `SUMMARY & SCOPE:\n` +
      `${policy.desc}\n\n` +
      `GUIDELINES:\n` +
      `1. All permanent, probation, and contractual staff are bound by this policy.\n` +
      `2. Non-compliance may result in formal disciplinary action under HR Bylaws.\n` +
      `3. For queries or clarifications, contact hr-compliance@worldx.com.\n` +
      `========================================================\n` +
      `Certified by WorldX Corporate Compliance & Governance.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${policy.name.replace(/\\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`✓ Downloaded ${policy.name}`);
  };

  // =========================================================================
  // STATE: Reports & Analytics (Screen 13 / Screen 12)
  // =========================================================================
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [selectedDeptReport, setSelectedDeptReport] = useState(null);
  const [reportConfig, setReportConfig] = useState({
    dept: 'All Departments',
    month: 'October 2026',
    format: 'CSV'
  });

  const departmentBreakdown = [
    { name: 'Engineering', present: 88, wfh: 38, count: 50, avgHrs: '8h 45m', color: '#10b981' },
    { name: 'HR', present: 72, wfh: 20, count: 12, avgHrs: '8h 30m', color: '#10b981' },
    { name: 'Marketing', present: 80, wfh: 22, count: 20, avgHrs: '8h 15m', color: '#10b981' },
    { name: 'Sales', present: 86, wfh: 12, count: 35, avgHrs: '8h 50m', color: '#10b981' },
    { name: 'Finance', present: 84, wfh: 10, count: 15, avgHrs: '8h 20m', color: '#10b981' },
    { name: 'Support', present: 78, wfh: 18, count: 24, avgHrs: '8h 40m', color: '#10b981' }
  ];

  const handleDownloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Department,Total Staff,Present %,WFH %,Avg Daily Hours,Monthly Status\n" +
      departmentBreakdown.map(d => `${d.name},${d.count},${d.present}%,${d.wfh}%,${d.avgHrs},Active Compliant`).join("\n") +
      "\n\nTotal Days,28\nPresent Total,186\nWFH Total,32\nLeave Total,18\nAbsent Total,14\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WorldX_HR_Analytics_Report_${reportConfig.month.replace(/\\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowGenerateReportModal(false);
    logActivity('Analytics', `Monthly HR Analytics Report downloaded for ${reportConfig.month}`, '#38bdf8');
    triggerToast('✓ HR Analytics CSV report downloaded successfully!');
  };

  // =========================================================================
  // STATE: General Settings Form & Toggles (Screen 15)

  // =========================================================================
  const [settingsForm, setSettingsForm] = useState(() => {
    try {
      const saved = localStorage.getItem('worldx_hr_settings_form');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      companyName: 'WorldX Technologies',
      timeZone: '(UTC+5:30) Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      workingDays: 'Mon - Fri',
      workingHours: '09:00 AM - 06:00 PM'
    };
  });

  const [settingsToggles, setSettingsToggles] = useState(() => {
    try {
      const saved = localStorage.getItem('worldx_hr_settings_toggles');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      emailNotif: true,
      autoApprove: true,
      wfhRequests: true,
      allowCorrection: true,
      holidayCalendar: true
    };
  });

  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('worldx_hr_settings_form', JSON.stringify(settingsForm));
      localStorage.setItem('worldx_hr_settings_toggles', JSON.stringify(settingsToggles));
    } catch (e) {}
    setSettingsSavedFeedback(true);
    setTimeout(() => setSettingsSavedFeedback(false), 2200);
    logActivity('Settings', `Company parameters updated (${settingsForm.companyName})`, '#a855f7');
    triggerToast('✓ HR Settings saved successfully!');
  };

  const handleTogglePreference = (key) => {
    setSettingsToggles(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('worldx_hr_settings_toggles', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <div className="hr-portal-root">
      {/* =====================================================================
          SIDEBAR: WorldX ATTENDANCE 360 | HR PORTAL (13 ITEMS)
         ===================================================================== */}
      {mobileSidebarOpen && (
        <div
          className="hr-sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside className={`hr-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* Logo Header */}
          <div className="hr-sidebar-logo">
            <div className="hr-logo-row">
              <div className="hr-logo-icon">
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div className="hr-brand-title">
                World<span>X</span>
              </div>
              <span className="hr-badge-360">ATTENDANCE 360</span>
            </div>
            <div className="hr-portal-sublabel">HR PORTAL</div>
          </div>

          {/* Navigation Items */}
          <nav className="hr-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`hr-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="hr-nav-left">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="hr-badge-pill">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="hr-sidebar-footer">
          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="hr-logout-btn"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MAIN CONTENT AREA & TOPBAR
         ===================================================================== */}
      <div className="hr-main-wrap">
        {/* Topbar */}
        <header className="hr-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="hr-mobile-toggle-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              title="Toggle Menu"
            >
              <Menu size={18} />
            </button>
            <div className="hr-search-wrapper">
              <Search size={15} className="hr-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="hr-search-input"
              />
            </div>
          </div>

          <div className="hr-topbar-right">
            {/* Date Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.04)', padding: '5px 12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Calendar size={13} color="#a855f7" />
              <span>Tue, 14 Oct 2026</span>
            </div>

            {/* Notification Bell */}
            <button className="hr-btn-action" title="Notifications" onClick={() => setActiveModule('notices')} style={{ position: 'relative', padding: '6px 10px' }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: '3px', right: '3px', width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                3
              </span>
            </button>

            {/* Moon Theme Toggle */}
            <button className="hr-btn-action" title="Toggle Theme" style={{ padding: '6px 10px' }}>
              <Moon size={16} />
            </button>

            {/* User Profile Pill: Priya Sharma (HR Manager) */}
            <div className="hr-user-pill" onClick={() => triggerToast('Viewing HR Manager profile')}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="hr-user-avatar"
              />
              <div className="hr-user-info">
                <span className="hr-user-name">{currentUser.name}</span>
                <span className="hr-user-role">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 16-SCREEN QUICK SWITCHER CHIP STRIP */}
        <div className="hr-screens-strip">
          <span className="hr-screens-title">HR MODULES:</span>
          {hrScreens.map(scr => (
            <button
              key={scr.id}
              onClick={() => setActiveModule(scr.id)}
              className={`hr-screen-chip ${activeModule === scr.id ? 'active' : ''}`}
            >
              {scr.label}
            </button>
          ))}
        </div>

        {/* SCROLLABLE VIEWPORT */}
        <div className="hr-content-scroll">
          {/* =================================================================
              SCREEN 1: HR DASHBOARD (ADMIN)
             ================================================================= */}
          {activeModule === 'dashboard' && (
            <div>
              {/* Hero Banner */}
              <div className="hr-hero-banner">
                <div>
                  <div className="hr-hero-tag">👋 Welcome to HR Portal</div>
                  <h1 className="hr-hero-title">Good Morning, Priya!</h1>
                  <p className="hr-hero-desc">Here's an overview of your HR operations today.</p>
                  <div className="hr-hero-date">Tue, 14 Oct 2026</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="hr-btn-purple" onClick={() => setShowAddEmpModal(true)}>
                    <Plus size={14} />
                    <span>Add Employee</span>
                  </button>
                  <button className="hr-btn-action" onClick={() => triggerToast('✓ HR roster summary exported')}>
                    <Download size={14} />
                    <span>Print Roster</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards matching Image 1 */}
              <div className="hr-4kpi-grid">
                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Total Employees</div>
                    <div className="hr-kpi-val">250</div>
                    <div className="hr-kpi-sub" style={{ color: '#10b981' }}>↑ +12% from last month</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    <Users size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Present Today</div>
                    <div className="hr-kpi-val" style={{ color: '#10b981' }}>186</div>
                    <div className="hr-kpi-sub" style={{ color: '#10b981' }}>74% attendance rate</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    <Check size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">On Leave</div>
                    <div className="hr-kpi-val" style={{ color: '#f59e0b' }}>18</div>
                    <div className="hr-kpi-sub" style={{ color: '#f59e0b' }}>7% of total staff</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                    <Calendar size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">WFH Today</div>
                    <div className="hr-kpi-val" style={{ color: '#a855f7' }}>32</div>
                    <div className="hr-kpi-sub" style={{ color: '#a855f7' }}>13% remote employees</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
                    <Home size={22} />
                  </div>
                </div>
              </div>

              {/* 2-Column Charts Row: Attendance Trend + Department Wise Donut */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.85fr', gap: '20px', marginBottom: '22px' }}>
                {/* Left: Attendance Trend (This Month) */}
                <div className="hr-table-card" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Attendance Trend (This Month)</h3>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>Daily tracking across Lucknow HQ & remote teams</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', fontWeight: 600 }}>
                      <span style={{ color: '#10b981' }}>● Present</span>
                      <span style={{ color: '#a855f7' }}>● WFH</span>
                      <span style={{ color: '#f59e0b' }}>● Leave</span>
                      <span style={{ color: '#ef4444' }}>● Absent</span>
                    </div>
                  </div>

                  {/* SVG Multi-Line Chart */}
                  <div style={{ height: '170px', width: '100%' }}>
                    <svg viewBox="0 0 500 170" width="100%" height="100%">
                      <line x1="30" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <line x1="30" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <line x1="30" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <line x1="30" y1="150" x2="480" y2="150" stroke="rgba(255,255,255,0.1)" />

                      {/* Present line (Green) */}
                      <path d="M 40 45 Q 120 40, 200 50 T 360 42 T 470 40" fill="none" stroke="#10b981" strokeWidth="3" />
                      {/* WFH line (Purple) */}
                      <path d="M 40 95 Q 120 85, 200 90 T 360 88 T 470 92" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                      {/* Leave line (Amber) */}
                      <path d="M 40 125 Q 120 130, 200 120 T 360 128 T 470 122" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      {/* Absent line (Red) */}
                      <path d="M 40 140 Q 120 142, 200 138 T 360 145 T 470 140" fill="none" stroke="#ef4444" strokeWidth="1.5" />

                      {/* Dates */}
                      <text x="40" y="165" fill="#64748b" fontSize="9" textAnchor="middle">1 Oct</text>
                      <text x="120" y="165" fill="#64748b" fontSize="9" textAnchor="middle">7 Oct</text>
                      <text x="200" y="165" fill="#64748b" fontSize="9" textAnchor="middle">14 Oct</text>
                      <text x="280" y="165" fill="#64748b" fontSize="9" textAnchor="middle">21 Oct</text>
                      <text x="360" y="165" fill="#64748b" fontSize="9" textAnchor="middle">28 Oct</text>
                      <text x="440" y="165" fill="#64748b" fontSize="9" textAnchor="middle">30 Oct</text>
                    </svg>
                  </div>
                </div>

                {/* Right: Department Wise Employees Donut */}
                <div className="hr-table-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0', alignSelf: 'flex-start' }}>Department Wise Employees</h3>

                  <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="12" />
                      {/* Engineering: 50/250 = 20% */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="48 238" strokeDashoffset="0" />
                      {/* HR: 30/250 = 12% */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" strokeWidth="12" strokeDasharray="29 238" strokeDashoffset="-48" />
                      {/* Marketing: 20/250 = 8% */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="19 238" strokeDashoffset="-77" />
                      {/* Sales: 15/250 = 6% */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="15 238" strokeDashoffset="-96" />
                      {/* Finance: 22/250 = 8.8% */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="21 238" strokeDashoffset="-111" />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>250</div>
                      <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Employees</div>
                    </div>
                  </div>

                  {/* Legend Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', width: '100%', marginTop: '16px', fontSize: '0.72rem' }}>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#3b82f6' }}>●</strong> Engineering: 50</span>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#a855f7' }}>●</strong> HR: 30</span>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#10b981' }}>●</strong> Marketing: 20</span>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#f59e0b' }}>●</strong> Sales: 15</span>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#06b6d4' }}>●</strong> Finance: 22</span>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#64748b' }}>●</strong> Others: 13</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar matching Image 1 */}
              <div className="hr-table-card" style={{ padding: '16px 20px', marginBottom: '22px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Quick Actions</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="hr-btn-action" onClick={() => setShowAddEmpModal(true)}>
                    <Users size={14} color="#38bdf8" />
                    <span>Add Employee</span>
                  </button>
                  <button className="hr-btn-action" onClick={() => setActiveModule('leaves')}>
                    <FileText size={14} color="#10b981" />
                    <span>Approve Leave</span>
                  </button>
                  <button className="hr-btn-action" onClick={() => setActiveModule('wfh')}>
                    <Home size={14} color="#a855f7" />
                    <span>Approve WFH</span>
                  </button>
                  <button className="hr-btn-action" onClick={() => setActiveModule('reports')}>
                    <BarChart3 size={14} color="#f59e0b" />
                    <span>View Reports</span>
                  </button>
                  <button className="hr-btn-action" onClick={() => triggerToast('✓ Printing roster for today')}>
                    <Download size={14} color="#06b6d4" />
                    <span>Print Roster</span>
                  </button>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="hr-table-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Recent Activities</h3>
                  <button
                    onClick={() => setShowRecentActivitiesModal(true)}
                    style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View All →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentActivitiesList.slice(0, 4).map((act, i) => (
                    <div key={act.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.color }} />
                        <span>{act.text}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 2: EMPLOYEE MANAGEMENT
             ================================================================= */}
          {activeModule === 'employees' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Employees</h1>
                  <p className="hr-header-desc">Manage all employees, add new employees, and update details.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="hr-btn-purple" onClick={() => setShowAddEmpModal(true)}>
                    <Plus size={14} />
                    <span>Add Employee</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="hr-filters-bar">
                <input
                  type="text"
                  placeholder="Search by name, employee ID..."
                  value={empSearchQuery}
                  onChange={(e) => setEmpSearchQuery(e.target.value)}
                  className="hr-filter-input"
                  style={{ width: '280px' }}
                />
                <select value={empDeptFilter} onChange={(e) => setEmpDeptFilter(e.target.value)} className="hr-filter-select">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Finance</option>
                </select>
                <select value={empStatusFilter} onChange={(e) => setEmpStatusFilter(e.target.value)} className="hr-filter-select">
                  <option>All Status</option>
                  <option>Present</option>
                  <option>WFH</option>
                  <option>On Leave</option>
                  <option>Absent</option>
                </select>
                {empSearchQuery && (
                  <button
                    onClick={() => setEmpSearchQuery('')}
                    style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '6px 12px', fontSize: '0.76rem', cursor: 'pointer' }}
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Employees Table matching Screen 2 */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          No employees found matching your search or filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp, idx) => (
                        <tr key={emp.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <img src={emp.avatar} alt={emp.name} className="hr-employee-avatar" />
                          </td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{emp.name}</td>
                          <td style={{ color: '#38bdf8', fontWeight: 600 }}>{emp.id}</td>
                          <td>{emp.department}</td>
                          <td>{emp.designation}</td>
                          <td>
                            <span className={`hr-pill ${emp.status.toLowerCase().replace(/\s+/g, '')}`}>
                              {emp.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setSelectedEmployeeModal(emp);
                                setEditEmployeeStatus(emp.status);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 3: ATTENDANCE MANAGEMENT
             ================================================================= */}
          {activeModule === 'attendance' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Attendance</h1>
                  <p className="hr-header-desc">View and manage employee attendance records.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="hr-btn-primary" onClick={() => setShowAttendanceReportModal(true)}>
                    <Download size={14} />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>

              {/* 4 Stats Pills matching Screen 3 with interactive filter toggle */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div
                  onClick={() => setAttendanceStatusFilter(prev => prev === 'Present' ? 'All' : 'Present')}
                  style={{
                    padding: '8px 16px',
                    background: attendanceStatusFilter === 'Present' ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.1)',
                    border: `1px solid ${attendanceStatusFilter === 'Present' ? '#10b981' : 'rgba(16,185,129,0.3)'}`,
                    boxShadow: attendanceStatusFilter === 'Present' ? '0 0 14px rgba(16,185,129,0.35)' : 'none',
                    borderRadius: '10px',
                    color: '#10b981',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to filter Present employees"
                >
                  Present: 186 (74%)
                </div>
                <div
                  onClick={() => setAttendanceStatusFilter(prev => prev === 'WFH' ? 'All' : 'WFH')}
                  style={{
                    padding: '8px 16px',
                    background: attendanceStatusFilter === 'WFH' ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.1)',
                    border: `1px solid ${attendanceStatusFilter === 'WFH' ? '#a855f7' : 'rgba(168,85,247,0.3)'}`,
                    boxShadow: attendanceStatusFilter === 'WFH' ? '0 0 14px rgba(168,85,247,0.35)' : 'none',
                    borderRadius: '10px',
                    color: '#c084fc',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to filter WFH employees"
                >
                  WFH: 32 (13%)
                </div>
                <div
                  onClick={() => setAttendanceStatusFilter(prev => prev === 'On Leave' ? 'All' : 'On Leave')}
                  style={{
                    padding: '8px 16px',
                    background: attendanceStatusFilter === 'On Leave' ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.1)',
                    border: `1px solid ${attendanceStatusFilter === 'On Leave' ? '#f59e0b' : 'rgba(245,158,11,0.3)'}`,
                    boxShadow: attendanceStatusFilter === 'On Leave' ? '0 0 14px rgba(245,158,11,0.35)' : 'none',
                    borderRadius: '10px',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to filter On Leave employees"
                >
                  On Leave: 18 (7%)
                </div>
                <div
                  onClick={() => setAttendanceStatusFilter(prev => prev === 'Absent' ? 'All' : 'Absent')}
                  style={{
                    padding: '8px 16px',
                    background: attendanceStatusFilter === 'Absent' ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${attendanceStatusFilter === 'Absent' ? '#ef4444' : 'rgba(239,68,68,0.3)'}`,
                    boxShadow: attendanceStatusFilter === 'Absent' ? '0 0 14px rgba(239,68,68,0.35)' : 'none',
                    borderRadius: '10px',
                    color: '#f87171',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to filter Absent employees"
                >
                  Absent: 14 (6%)
                </div>

                {attendanceStatusFilter !== 'All' && (
                  <button
                    onClick={() => setAttendanceStatusFilter('All')}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#cbd5e1',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filter (Show All)
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          No records found for status "{attendanceStatusFilter}".
                        </td>
                      </tr>
                    ) : (
                      filteredAttendanceRecords.map((row, idx) => (
                        <tr key={row.id}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.name}</td>
                          <td style={{ color: row.in !== '--' ? '#10b981' : '#64748b' }}>{row.in}</td>
                          <td style={{ color: row.out !== '--' ? '#f59e0b' : '#64748b' }}>{row.out}</td>
                          <td style={{ fontWeight: 600 }}>{row.hrs}</td>
                          <td>
                            <span className={`hr-pill ${row.status.toLowerCase().replace(/\s+/g, '')}`}>
                              {row.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setSelectedAttendanceRecord(row);
                                setEditPunchIn(row.in === '--' ? '09:00 AM' : row.in);
                                setEditPunchOut(row.out === '--' ? '06:00 PM' : row.out);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 4: LEAVE REQUESTS
             ================================================================= */}
          {activeModule === 'leaves' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Leave Requests</h1>
                  <p className="hr-header-desc">View and manage employee leave requests.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowNewLeaveModal(true)}>
                  <Plus size={14} />
                  <span>New Leave Request</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="hr-tabs-row">
                {[
                  `All (${leaveRequests.length})`,
                  `Pending (${pendingLeaveCount})`,
                  `Approved (${approvedLeaveCount})`,
                  `Rejected (${rejectedLeaveCount})`
                ].map(tab => {
                  const key = tab.split(' ')[0];
                  return (
                    <button
                      key={tab}
                      onClick={() => setLeaveTab(key)}
                      className={`hr-tab-btn ${leaveTab === key ? 'active' : ''}`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests
                      .filter(r => {
                        if (leaveTab === 'Pending') return r.status === 'Pending';
                        if (leaveTab === 'Approved') return r.status === 'Approved';
                        if (leaveTab === 'Rejected') return r.status === 'Rejected';
                        return true;
                      })
                      .map((r, idx) => (
                        <tr key={r.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="hr-employee-cell" style={{ cursor: 'pointer' }} onClick={() => setSelectedLeaveModal(r)} title="Click to view full leave details">
                              <img src={r.avatar} alt={r.emp} className="hr-employee-avatar" />
                              <span className="hr-employee-name">{r.emp}</span>
                            </div>
                          </td>
                          <td style={{ color: '#c084fc', fontWeight: 600 }}>{r.type}</td>
                          <td>{r.from}</td>
                          <td>{r.to}</td>
                          <td style={{ fontWeight: 700 }}>{r.days}</td>
                          <td>
                            <span className={`hr-pill ${r.status.toLowerCase()}`}>{r.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {r.status === 'Pending' ? (
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button className="hr-action-btn approve" onClick={() => handleLeaveAction(r.id, 'Approved')}>
                                  Approve
                                </button>
                                <button className="hr-action-btn reject" onClick={() => handleLeaveAction(r.id, 'Rejected')}>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 5: WFH REQUESTS
             ================================================================= */}
          {activeModule === 'wfh' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">WFH Requests</h1>
                  <p className="hr-header-desc">Manage work from home requests.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowNewWfhModal(true)}>
                  <Plus size={14} />
                  <span>New WFH Request</span>
                </button>
              </div>

              {/* Tabs with dynamic counts */}
              <div className="hr-tabs-row">
                {[
                  `All (${wfhRequests.length})`,
                  `Pending (${pendingWfhCount})`,
                  `Approved (${approvedWfhCount})`,
                  `Rejected (${rejectedWfhCount})`
                ].map(tab => {
                  const key = tab.split(' ')[0];
                  return (
                    <button
                      key={tab}
                      onClick={() => setWfhTab(key)}
                      className={`hr-tab-btn ${wfhTab === key ? 'active' : ''}`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wfhRequests
                      .filter(r => {
                        if (wfhTab === 'Pending') return r.status === 'Pending';
                        if (wfhTab === 'Approved') return r.status === 'Approved';
                        if (wfhTab === 'Rejected') return r.status === 'Rejected';
                        return true;
                      })
                      .map((r, idx) => (
                        <tr key={r.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <div className="hr-employee-cell">
                              <img src={r.avatar} alt={r.emp} className="hr-employee-avatar" />
                              <span className="hr-employee-name">{r.emp}</span>
                            </div>
                          </td>
                          <td>{r.from}</td>
                          <td>{r.to}</td>
                          <td style={{ fontWeight: 700 }}>{r.days}</td>
                          <td style={{ color: '#cbd5e1' }}>{r.reason}</td>
                          <td>
                            <span className={`hr-pill ${r.status.toLowerCase()}`}>{r.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {r.status === 'Pending' ? (
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button className="hr-action-btn approve" onClick={() => handleWfhAction(r.id, 'Approved')}>
                                  Approve
                                </button>
                                <button className="hr-action-btn reject" onClick={() => handleWfhAction(r.id, 'Rejected')}>
                                  Reject
                                </button>
                                <button className="hr-action-btn" onClick={() => setSelectedWfhModal(r)}>
                                  View
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Processed</span>
                                <button className="hr-action-btn" onClick={() => setSelectedWfhModal(r)}>
                                  View
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 6: HR MANAGEMENT
             ================================================================= */}
          {activeModule === 'hr_management' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">HR Management</h1>
                  <p className="hr-header-desc">Departments, Designations, Holidays, Work Locations, Shifts</p>
                </div>
                <button
                  className="hr-btn-purple"
                  onClick={() => {
                    setEditingHrItem(null);
                    setNewHrForm({
                      name: '',
                      head: '',
                      count: 10,
                      dept: 'Engineering',
                      date: '2026-11-01',
                      day: 'Sunday',
                      type: 'Gazetted Holiday',
                      address: '',
                      staff: 25,
                      timings: '09:00 AM - 06:00 PM',
                      duration: '9 Hours',
                      pay: '₹40,000 - ₹80,000'
                    });
                    setShowAddHrModal(true);
                  }}
                >
                  <Plus size={14} />
                  <span>Add {hrMgmtTab === 'Work Locations' ? 'Location' : hrMgmtTab === 'Holidays' ? 'Holiday' : hrMgmtTab.slice(0, -1)}</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="hr-tabs-row">
                {['Departments', 'Designations', 'Holidays', 'Work Locations', 'Shifts'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHrMgmtTab(tab)}
                    className={`hr-tab-btn ${hrMgmtTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table Card Dynamic to Selected Tab */}
              <div className="hr-table-card">
                {hrMgmtTab === 'Departments' && (
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Department</th>
                        <th>Head</th>
                        <th>Employee Count</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentsList.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.dept}</td>
                          <td style={{ color: '#38bdf8' }}>{row.head}</td>
                          <td style={{ fontWeight: 700 }}>{row.count}</td>
                          <td><span className="hr-pill approved">{row.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setEditingHrItem(row);
                                setNewHrForm({ name: row.dept, head: row.head, count: row.count });
                                setShowAddHrModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {hrMgmtTab === 'Designations' && (
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Positions</th>
                        <th>Pay Band</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {designationsList.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.title}</td>
                          <td style={{ color: '#c084fc' }}>{row.dept}</td>
                          <td style={{ fontWeight: 700 }}>{row.count}</td>
                          <td style={{ color: '#34d399' }}>{row.pay}</td>
                          <td><span className="hr-pill approved">{row.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setEditingHrItem(row);
                                setNewHrForm({ name: row.title, dept: row.dept, pay: row.pay, count: row.count });
                                setShowAddHrModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {hrMgmtTab === 'Holidays' && (
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Holiday Name</th>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidaysList.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.name}</td>
                          <td style={{ color: '#38bdf8' }}>{row.date}</td>
                          <td>{row.day}</td>
                          <td><span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{row.type}</span></td>
                          <td>
                            <span className={`hr-pill ${row.status === 'Upcoming' ? 'approved' : 'neutral'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setEditingHrItem(row);
                                setNewHrForm({ name: row.name, date: row.date, day: row.day, type: row.type });
                                setShowAddHrModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {hrMgmtTab === 'Work Locations' && (
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Location Name</th>
                        <th>Address / City</th>
                        <th>Total Staff</th>
                        <th>Facility Type</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workLocationsList.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.name}</td>
                          <td style={{ color: '#94a3b8' }}>{row.address}</td>
                          <td style={{ fontWeight: 700, color: '#38bdf8' }}>{row.staff}</td>
                          <td><span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{row.type}</span></td>
                          <td><span className="hr-pill approved">{row.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setEditingHrItem(row);
                                setNewHrForm({ name: row.name, address: row.address, staff: row.staff });
                                setShowAddHrModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {hrMgmtTab === 'Shifts' && (
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Shift Name</th>
                        <th>Timings</th>
                        <th>Duration</th>
                        <th>Break / Grace</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftsList.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.name}</td>
                          <td style={{ color: '#38bdf8' }}>{row.timings}</td>
                          <td style={{ fontWeight: 700 }}>{row.duration}</td>
                          <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.lunch} lunch · {row.grace} grace</td>
                          <td><span className="hr-pill approved">{row.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="hr-action-btn"
                              onClick={() => {
                                setEditingHrItem(row);
                                setNewHrForm({ name: row.name, timings: row.timings, duration: row.duration });
                                setShowAddHrModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 7: RECRUITMENT (HIRING)
             ================================================================= */}
          {activeModule === 'recruitment' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Recruitment</h1>
                  <p className="hr-header-desc">Manage job openings, applicants and hiring process.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowCreateJobModal(true)}>
                  <Plus size={14} />
                  <span>Create Job Opening</span>
                </button>
              </div>

              {/* 4 Stats Cards matching Screen 7 */}
              <div className="hr-4kpi-grid">
                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Open Positions</div>
                    <div className="hr-kpi-val" style={{ color: '#10b981' }}>
                      {jobOpeningsList.filter(j => j.status !== 'closed').length}
                    </div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    <Briefcase size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Total Applicants</div>
                    <div className="hr-kpi-val" style={{ color: '#38bdf8' }}>
                      {jobOpeningsList.reduce((acc, j) => acc + (j.apps || 0), 0) || 48}
                    </div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    <Users size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Shortlisted</div>
                    <div className="hr-kpi-val" style={{ color: '#f59e0b' }}>
                      {jobApplicants.filter(a => a.stage === 'Shortlisted').length + 10}
                    </div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                    <UserCheck size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Hired</div>
                    <div className="hr-kpi-val" style={{ color: '#a855f7' }}>
                      {jobApplicants.filter(a => a.stage === 'Hired').length + 3}
                    </div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
                    <Check size={22} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="hr-tabs-row">
                {['All Openings', 'Ongoing', 'Closed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRecruitmentTab(tab)}
                    className={`hr-tab-btn ${recruitmentTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Job Title</th>
                      <th>Department</th>
                      <th>Applicants</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobOpenings.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.title}</td>
                        <td>{row.dept}</td>
                        <td style={{ fontWeight: 700, color: '#38bdf8' }}>{row.apps}</td>
                        <td>
                          <span className={`hr-pill ${row.status}`}>{row.status.toUpperCase()}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="hr-action-btn" onClick={() => setSelectedJobModal(row)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 8: PERFORMANCE MANAGEMENT
             ================================================================= */}
          {activeModule === 'performance' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Performance</h1>
                  <p className="hr-header-desc">Track employee performance and set goals.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowNewGoalModal(true)}>
                  <Plus size={14} />
                  <span>Set New Goal</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="hr-tabs-row">
                {['Overview', 'Goals', 'Reviews', 'Appraisals'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPerfTab(tab)}
                    className={`hr-tab-btn ${perfTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Conditional Tab Rendering */}
              {perfTab === 'Overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
                  {/* Left: Overall Performance Gauge */}
                  <div className="hr-table-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0', alignSelf: 'flex-start' }}>Overall Organization Rating</h3>

                    <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="10" strokeDasharray="196 251" strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute' }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>78%</div>
                        <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Overall</div>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px', width: '100%', marginTop: '20px', fontSize: '0.78rem' }}>
                      <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#10b981' }}>●</strong> Excellent (40)</span>
                      <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#38bdf8' }}>●</strong> Good (30)</span>
                      <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#f59e0b' }}>●</strong> Average (15)</span>
                      <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#ef4444' }}>●</strong> Needs Improvement (10)</span>
                    </div>
                  </div>

                  {/* Right: Top Performers */}
                  <div className="hr-table-card" style={{ padding: '22px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Top Performers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { id: 1, name: 'Rahul Verma', score: '92%', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128', dept: 'Engineering', role: 'Full Stack Engineer' },
                        { id: 2, name: 'Neha Gupta', score: '88%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128', dept: 'Human Resources', role: 'HR Manager' },
                        { id: 3, name: 'Amit Kumar', score: '85%', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128', dept: 'Marketing', role: 'Growth Specialist' },
                        { id: 4, name: 'Priya Sharma', score: '82%', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128', dept: 'Operations', role: 'Lead Coordinator' },
                        { id: 5, name: 'Rohit Singh', score: '80%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128', dept: 'Finance', role: 'Financial Analyst' }
                      ].map((p, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedPerformerModal(p)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          title="Click to view performer details"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#a855f7' }}>#{i + 1}</span>
                            <img src={p.avatar} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{p.name}</span>
                          </div>
                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#10b981' }}>{p.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {perfTab === 'Goals' && (
                <div className="hr-table-card">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Employee</th>
                        <th>Goal Objective</th>
                        <th>Department</th>
                        <th>Target Date</th>
                        <th style={{ width: '160px' }}>Progress</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {goalsList.map((g, idx) => (
                        <tr key={g.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{g.emp}</td>
                          <td style={{ color: '#cbd5e1' }}>{g.title}</td>
                          <td><span className="hr-pill neutral">{g.dept}</span></td>
                          <td>{g.date}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ flex: 1, height: '6px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ width: `${g.progress}%`, height: '100%', background: g.progress >= 90 ? '#10b981' : g.progress >= 70 ? '#38bdf8' : '#f59e0b' }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', minWidth: '32px' }}>{g.progress}%</span>
                            </div>
                          </td>
                          <td><span className={`hr-pill ${g.progress >= 90 ? 'approved' : 'pending'}`}>{g.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="hr-action-btn" onClick={() => setSelectedGoalModal(g)}>
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {perfTab === 'Reviews' && (
                <div className="hr-table-card">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Employee</th>
                        <th>Review Cycle</th>
                        <th>Reviewer</th>
                        <th>Self Score</th>
                        <th>Manager Score</th>
                        <th>Final Rating</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewsList.map((r, idx) => (
                        <tr key={r.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{r.emp}</td>
                          <td style={{ color: '#38bdf8' }}>{r.period}</td>
                          <td>{r.reviewer}</td>
                          <td style={{ color: '#a855f7' }}>{r.selfScore}</td>
                          <td style={{ color: '#10b981' }}>{r.mgrScore}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{r.rating}</td>
                          <td><span className="hr-pill approved">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {perfTab === 'Appraisals' && (
                <div className="hr-table-card">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Current CTC</th>
                        <th>Hike %</th>
                        <th>Revised CTC</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appraisalsList.map((a, idx) => (
                        <tr key={a.id || idx}>
                          <td>{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{a.emp}</td>
                          <td>{a.dept}</td>
                          <td style={{ color: '#94a3b8' }}>{a.current}</td>
                          <td style={{ fontWeight: 700, color: '#10b981' }}>+{a.hike}</td>
                          <td style={{ fontWeight: 800, color: '#38bdf8' }}>{a.revised}</td>
                          <td><span className="hr-pill approved">{a.rating}</span></td>
                          <td>
                            <span className={`hr-pill ${a.status === 'Approved' ? 'approved' : 'pending'}`}>
                              {a.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {a.status === 'Approved' ? (
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Processed</span>
                            ) : (
                              <button className="hr-action-btn approve" onClick={() => handleApproveAppraisal(a.id)}>
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 9: TRAINING & DEVELOPMENT
             ================================================================= */}
          {activeModule === 'training' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Training & Development</h1>
                  <p className="hr-header-desc">Manage training programs and employee learning.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowCreateTrainingModal(true)}>
                  <Plus size={14} />
                  <span>Create Training</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="hr-tabs-row">
                {['All Trainings', 'Upcoming', 'Completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTrainingTab(tab)}
                    className={`hr-tab-btn ${trainingTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Training Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrainings.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 700, color: '#ffffff', cursor: 'pointer' }} onClick={() => setSelectedTrainingModal(row)} title="Click to view details">
                          {row.title}
                        </td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: row.cat === 'Technical' ? 'rgba(168,85,247,0.15)' : 'rgba(192,132,252,0.15)', color: '#c084fc', fontSize: '0.72rem' }}>
                            {row.cat}
                          </span>
                        </td>
                        <td>{row.date}</td>
                        <td style={{ fontWeight: 700, color: '#38bdf8' }}>{row.parts}</td>
                        <td>
                          <span className={`hr-pill ${row.status === 'Upcoming' ? 'screening' : 'approved'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="hr-action-btn" onClick={() => setSelectedTrainingModal(row)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* =================================================================
              SCREEN 10: PAYROLL MANAGEMENT
             ================================================================= */}
          {activeModule === 'payroll' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Payroll</h1>
                  <p className="hr-header-desc">Manage payroll, salary structure and allowances.</p>
                </div>
                <button className="hr-btn-purple" onClick={handleGenerateAllPayroll} title="Generate batch payroll for all pending employees">
                  <Download size={14} />
                  <span>Generate Payroll</span>
                </button>
              </div>

              {/* 4 Stats Cards matching Screen 10 */}
              <div className="hr-4kpi-grid">
                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Total Employees</div>
                    <div className="hr-kpi-val">250</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    <Users size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Total Payroll</div>
                    <div className="hr-kpi-val" style={{ color: '#10b981' }}>₹ 45,00,000</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    <DollarSign size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Processed</div>
                    <div className="hr-kpi-val" style={{ color: '#a855f7' }}>{payrollProcessedCount}</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
                    <Check size={22} />
                  </div>
                </div>

                <div className="hr-kpi-card">
                  <div>
                    <div className="hr-kpi-label">Pending</div>
                    <div className="hr-kpi-val" style={{ color: '#f59e0b' }}>{payrollPendingCount}</div>
                  </div>
                  <div className="hr-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                    <Clock size={22} />
                  </div>
                </div>
              </div>

              {/* Payroll Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Basic Salary</th>
                      <th>Allowances</th>
                      <th>Deductions</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollRecords.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td>{idx + 1}</td>
                        <td style={{ color: '#38bdf8', fontWeight: 600 }}>{row.id}</td>
                        <td style={{ fontWeight: 700, color: '#ffffff', cursor: 'pointer' }} onClick={() => setSelectedPayrollModal(row)} title="Click to view detailed payslip">
                          {row.name}
                        </td>
                        <td>{row.basic}</td>
                        <td style={{ color: '#10b981' }}>{row.allow}</td>
                        <td style={{ color: '#ef4444' }}>{row.ded}</td>
                        <td style={{ fontWeight: 800, color: '#ffffff' }}>{row.net}</td>
                        <td>
                          <span
                            className={`hr-pill ${row.status === 'Processed' ? 'approved' : 'pending'}`}
                            style={{ cursor: row.status === 'Pending' ? 'pointer' : 'default' }}
                            onClick={() => {
                              if (row.status === 'Pending') handleProcessPayroll(row.id);
                            }}
                            title={row.status === 'Pending' ? 'Click to process this salary' : 'Processed'}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="hr-action-btn"
                            style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                            onClick={() => setSelectedPayrollModal(row)}
                          >
                            Payslip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 11: COMPANY POLICIES
             ================================================================= */}
          {activeModule === 'policies' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Company Policies</h1>
                  <p className="hr-header-desc">View and manage company policies and guidelines.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowAddPolicyModal(true)}>
                  <Plus size={14} />
                  <span>Add Policy</span>
                </button>
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Policy Name</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Updated On</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policiesList.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td>{idx + 1}</td>
                        <td
                          style={{ fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                          onClick={() => setSelectedPolicyModal(row)}
                          title="Click to read policy document"
                        >
                          {row.name}
                        </td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: row.cat === 'Leave' ? 'rgba(168,85,247,0.15)' : 'rgba(56,189,248,0.1)', color: row.cat === 'Leave' ? '#c084fc' : '#38bdf8', fontSize: '0.72rem' }}>
                            {row.cat}
                          </span>
                        </td>
                        <td>{row.size}</td>
                        <td>{row.date}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="hr-action-btn" onClick={() => handleDownloadPolicy(row)}>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 12: NOTICES & ANNOUNCEMENTS
             ================================================================= */}
          {activeModule === 'notices' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Notices & Announcements</h1>
                  <p className="hr-header-desc">Create and manage company announcements.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => triggerToast('✓ Open modal to broadcast new announcement')}>
                  <Plus size={14} />
                  <span>New Announcement</span>
                </button>
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: 'Diwali Holiday Announcement', type: 'Holiday', date: '12 Oct 2026', status: 'Active' },
                      { title: 'New IT Security Policy', type: 'Policy', date: '08 Oct 2026', status: 'Active' },
                      { title: 'Quarterly Review Meeting', type: 'General', date: '05 Oct 2026', status: 'Scheduled' },
                      { title: 'Work From Home Guidelines', type: 'General', date: '01 Oct 2026', status: 'Active' },
                      { title: 'Office will remain closed', type: 'Public Holiday', date: '30 Sep 2026', status: 'Closed' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.title}</td>
                        <td><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', fontSize: '0.72rem' }}>{row.type}</span></td>
                        <td>{row.date}</td>
                        <td><span className={`hr-pill ${row.status === 'Active' ? 'approved' : 'pending'}`}>{row.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="hr-action-btn" onClick={() => triggerToast(`Viewing notice: ${row.title}`)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 13: REPORTS & ANALYTICS
             ================================================================= */}
          {activeModule === 'reports' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Reports & Analytics</h1>
                  <p className="hr-header-desc">Detailed attendance, leave and organizational insights.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => setShowGenerateReportModal(true)}>
                  <Download size={14} />
                  <span>Generate Report</span>
                </button>
              </div>

              {/* 5 Stats Pills exactly matching Screenshot 4 */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontSize: '0.78rem' }}>Total Days: <strong>28</strong></span>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.78rem' }}>Present: <strong>186</strong></span>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(168,85,247,0.1)', color: '#c084fc', fontSize: '0.78rem' }}>WFH: <strong>32</strong></span>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#fbbf24', fontSize: '0.78rem' }}>Leave: <strong>18</strong></span>
                <span style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.78rem' }}>Absent: <strong>14</strong></span>
              </div>

              {/* Clustered Columns */}
              <div className="hr-table-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Department-wise Attendance Breakdown</h3>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem' }}>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#10b981' }}>■</strong> On-site / Present</span>
                    <span style={{ color: '#cbd5e1' }}><strong style={{ color: '#a855f7' }}>■</strong> Remote / WFH</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingTop: '20px' }}>
                  {departmentBreakdown.map((d, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      onClick={() => setSelectedDeptReport(d)}
                      title={`Click to view ${d.name} attendance breakdown`}
                    >
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '120px' }}>
                        <div style={{ width: '18px', height: `${d.present}%`, background: '#10b981', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={`Present: ${d.present}%`} />
                        <div style={{ width: '18px', height: `${d.wfh}%`, background: '#a855f7', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={`WFH: ${d.wfh}%`} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 14: TEAM CALENDAR
             ================================================================= */}
          {activeModule === 'calendar' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Team Calendar</h1>
                  <p className="hr-header-desc">View team schedules, holidays and important events.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => triggerToast('✓ Open modal to add calendar event')}>
                  <Plus size={14} />
                  <span>Add Event</span>
                </button>
              </div>

              {/* Calendar Grid + Upcoming Events */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '22px' }}>
                <div className="hr-table-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 3;
                      const isCurrent = day >= 1 && day <= 31;
                      const hasEvent = day === 14 || day === 16 || day === 24;
                      return (
                        <div key={i} style={{ minHeight: '62px', padding: '6px', borderRadius: '8px', background: isCurrent ? 'rgba(255,255,255,0.03)' : 'transparent', border: '1px solid rgba(255,255,255,0.05)', color: isCurrent ? '#ffffff' : '#475569', fontSize: '0.76rem', fontWeight: 700 }}>
                          {isCurrent ? day : ''}
                          {hasEvent && (
                            <span style={{ display: 'block', fontSize: '0.58rem', padding: '2px 4px', borderRadius: '4px', background: day === 24 ? 'rgba(245,158,11,0.2)' : 'rgba(168,85,247,0.2)', color: day === 24 ? '#fbbf24' : '#c084fc', marginTop: '4px' }}>
                              {day === 24 ? 'Diwali' : 'Team Meet'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="hr-table-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>Upcoming Events</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { day: '16', mon: 'OCT', title: 'Team Meeting', time: '10:00 AM - 11:00 AM' },
                      { day: '18', mon: 'OCT', title: 'Training Session', time: '02:00 PM - 03:30 PM' },
                      { day: '24', mon: 'OCT', title: 'Diwali Holiday', time: 'All Day' },
                      { day: '28', mon: 'OCT', title: 'Policy Review', time: '04:00 PM - 05:00 PM' }
                    ].map((ev, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          <span style={{ fontSize: '0.86rem' }}>{ev.day}</span>
                          <span style={{ fontSize: '0.55rem' }}>{ev.mon}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{ev.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ev.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 15: GENERAL SETTINGS
             ================================================================= */}
          {activeModule === 'settings' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">General Settings</h1>
                  <p className="hr-header-desc">Organizational parameters and HR portal rules.</p>
                </div>
                <button
                  className="hr-btn-purple"
                  style={{
                    padding: '9px 22px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    background: settingsSavedFeedback ? '#10b981' : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    boxShadow: settingsSavedFeedback ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 4px 14px rgba(124, 58, 237, 0.4)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={handleSaveSettings}
                >
                  {settingsSavedFeedback ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: '24px' }}>
                {/* Left Card: Company Parameters */}
                <div className="hr-table-card" style={{ padding: '26px', background: '#0b1324', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', margin: '0 0 20px 0' }}>Company Parameters</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Company Name</label>
                      <input
                        type="text"
                        value={settingsForm.companyName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                        className="hr-filter-input"
                        style={{
                          width: '100%',
                          height: '42px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.84rem',
                          padding: '0 14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Time Zone</label>
                      <input
                        type="text"
                        value={settingsForm.timeZone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, timeZone: e.target.value })}
                        className="hr-filter-input"
                        style={{
                          width: '100%',
                          height: '42px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.84rem',
                          padding: '0 14px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Date Format</label>
                        <input
                          type="text"
                          value={settingsForm.dateFormat}
                          onChange={(e) => setSettingsForm({ ...settingsForm, dateFormat: e.target.value })}
                          className="hr-filter-input"
                          style={{
                            width: '100%',
                            height: '42px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.84rem',
                            padding: '0 14px'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Working Days</label>
                        <input
                          type="text"
                          value={settingsForm.workingDays}
                          onChange={(e) => setSettingsForm({ ...settingsForm, workingDays: e.target.value })}
                          className="hr-filter-input"
                          style={{
                            width: '100%',
                            height: '42px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '0.84rem',
                            padding: '0 14px'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Default Working Hours</label>
                      <input
                        type="text"
                        value={settingsForm.workingHours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                        className="hr-filter-input"
                        style={{
                          width: '100%',
                          height: '42px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.84rem',
                          padding: '0 14px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: HR Preferences */}
                <div className="hr-table-card" style={{ padding: '26px', background: '#0b1324', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', margin: '0 0 22px 0' }}>HR Preferences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {[
                      { key: 'emailNotif', label: 'Enable Email Notifications' },
                      { key: 'autoApprove', label: 'Auto Approve (Manager)' },
                      { key: 'wfhRequests', label: 'Enable WFH Requests' },
                      { key: 'allowCorrection', label: 'Allow Attendance Correction' },
                      { key: 'holidayCalendar', label: 'Enable Holiday Calendar' }
                    ].map(pref => {
                      const isChecked = !!settingsToggles[pref.key];
                      return (
                        <div
                          key={pref.key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                          onClick={() => handleTogglePreference(pref.key)}
                        >
                          <span style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: 500 }}>{pref.label}</span>
                          <div
                            role="checkbox"
                            aria-checked={isChecked}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: isChecked ? '#a855f7' : 'rgba(255, 255, 255, 0.04)',
                              border: isChecked ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                              boxShadow: isChecked ? '0 0 8px rgba(168, 85, 247, 0.4)' : 'none',
                              flexShrink: 0
                            }}
                          >
                            {isChecked && (
                              <Check size={13} color="#ffffff" strokeWidth={3.5} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 16: HELP & SUPPORT
             ================================================================= */}
          {activeModule === 'help' && (
            <div>
              <div className="hr-header">
                <div>
                  <h1 className="hr-header-title">Help & Support</h1>
                  <p className="hr-header-desc">Get help, raise a ticket or browse FAQs.</p>
                </div>
                <button className="hr-btn-purple" onClick={() => triggerToast('✓ Open modal to raise a support ticket')}>
                  <Plus size={14} />
                  <span>Raise Ticket</span>
                </button>
              </div>

              {/* Table */}
              <div className="hr-table-card">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sub: 'Unable to mark attendance', cat: 'Attendance', status: 'Open', prio: 'High', date: '14 Oct 2026' },
                      { sub: 'WFH policy clarification', cat: 'HR', status: 'Resolved', prio: 'Medium', date: '12 Oct 2026' },
                      { sub: 'Leave balance issue', cat: 'Leave', status: 'Closed', prio: 'Low', date: '10 Oct 2026' },
                      { sub: 'Payroll discrepancy', cat: 'Payroll', status: 'Open', prio: 'Medium', date: '06 Oct 2026' },
                      { sub: 'System login problem', cat: 'Technical', status: 'Resolved', prio: 'High', date: '01 Oct 2026' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.sub}</td>
                        <td><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontSize: '0.72rem' }}>{row.cat}</span></td>
                        <td><span className={`hr-pill ${row.status === 'Open' ? 'screening' : 'approved'}`}>{row.status}</span></td>
                        <td style={{ color: row.prio === 'High' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>{row.prio}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          MODAL: ALL RECENT ACTIVITIES
         ===================================================================== */}
      {showRecentActivitiesModal && (
        <div className="hr-modal-overlay" onClick={() => setShowRecentActivitiesModal(false)}>
          <div className="hr-modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Recent Activity Logs</h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Comprehensive audit trail of recent actions across HR Portal.</p>
              </div>
              <button onClick={() => setShowRecentActivitiesModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {['All', 'Leave', 'Employee', 'WFH', 'Policy', 'Attendance', 'Payroll'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setRecentActivitiesFilter(tag)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: recentActivitiesFilter === tag ? '#a855f7' : 'rgba(255,255,255,0.1)',
                    background: recentActivitiesFilter === tag ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.03)',
                    color: recentActivitiesFilter === tag ? '#c084fc' : '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Activities list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {recentActivitiesList
                .filter(act => recentActivitiesFilter === 'All' || act.type === recentActivitiesFilter)
                .map((act) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: act.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>{act.text}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                          Actor: <span style={{ color: '#38bdf8' }}>{act.user}</span> • Category: <span style={{ color: '#c084fc' }}>{act.type}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap' }}>{act.time}</span>
                  </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Showing {recentActivitiesList.length} total logged events</span>
              <button
                type="button"
                onClick={() => {
                  triggerToast('✓ Activity audit logs exported to JSON');
                  setShowRecentActivitiesModal(false);
                }}
                className="hr-btn-action"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={13} />
                <span>Export Logs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: EMPLOYEE DETAILS (VIEW & UPDATE)
         ===================================================================== */}
      {selectedEmployeeModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedEmployeeModal(null)}>
          <div className="hr-modal-content" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={selectedEmployeeModal.avatar}
                  alt={selectedEmployeeModal.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #a855f7', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{selectedEmployeeModal.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}>{selectedEmployeeModal.id}</span>
                    <span style={{ color: '#64748b' }}>•</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{selectedEmployeeModal.designation}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedEmployeeModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {/* Status Changer Bar */}
            <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>Current Attendance Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className={`hr-pill ${selectedEmployeeModal.status.toLowerCase().replace(/\s+/g, '')}`}>
                    {selectedEmployeeModal.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={editEmployeeStatus}
                  onChange={(e) => setEditEmployeeStatus(e.target.value)}
                  className="hr-filter-select"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <option value="Present">Present</option>
                  <option value="WFH">WFH</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Absent">Absent</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleUpdateEmployeeStatus(selectedEmployeeModal.id, editEmployeeStatus)}
                  className="hr-btn-purple"
                  style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                >
                  Update
                </button>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>DEPARTMENT</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedEmployeeModal.department}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>JOINING DATE</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedEmployeeModal.joinDate || '15 Jan 2024'}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>WORK EMAIL</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>{selectedEmployeeModal.email || `${selectedEmployeeModal.name.toLowerCase().replace(' ', '.')}@vorldx.com`}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>CONTACT PHONE</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{selectedEmployeeModal.phone || '+91 98765 43210'}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>WORKING SHIFT</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>General (09:00 AM - 06:00 PM)</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>REPORTING MANAGER</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a855f7', marginTop: '2px' }}>Priya Sharma (HR)</div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981' }}>96.2%</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Attendance Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>14 Days</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Leave Balance</div>
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#a855f7' }}>4.8 / 5.0</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Rating</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setSelectedEmployeeModal(null)} className="hr-btn-action">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: GENERATE ATTENDANCE REPORT
         ===================================================================== */}
      {showAttendanceReportModal && (
        <div className="hr-modal-overlay" onClick={() => setShowAttendanceReportModal(false)}>
          <div className="hr-modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Generate Attendance Report</h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Export detailed punch & biometric records for payroll and audit.</p>
              </div>
              <button onClick={() => setShowAttendanceReportModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Date Range</label>
                <select
                  value={reportDateRange}
                  onChange={(e) => setReportDateRange(e.target.value)}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  <option>Today (22 Oct 2026)</option>
                  <option>Yesterday (21 Oct 2026)</option>
                  <option>This Week (16 - 22 Oct 2026)</option>
                  <option>This Month (October 2026)</option>
                  <option>Previous Month (September 2026)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Department Filter</label>
                <select className="hr-filter-select" style={{ width: '100%' }}>
                  <option>All Departments (Engineering, HR, Marketing, Sales, Finance)</option>
                  <option>Engineering Department Only</option>
                  <option>HR & Recruitment Only</option>
                  <option>Marketing & Sales Only</option>
                  <option>Finance & Operations Only</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Report Export Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {['CSV', 'Excel', 'PDF'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setReportFormat(fmt)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: reportFormat === fmt ? '#a855f7' : 'rgba(255,255,255,0.08)',
                        background: reportFormat === fmt ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.02)',
                        color: reportFormat === fmt ? '#ffffff' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>Summary:</span> {attendanceRecordsList.length} employee punch records will be prepared for download.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setShowAttendanceReportModal(false)} className="hr-btn-action">Cancel</button>
              <button
                type="button"
                onClick={handleDownloadAttendanceCSV}
                className="hr-btn-purple"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} />
                <span>Download Report ({reportFormat})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ATTENDANCE PUNCH DETAILS & CORRECTION
         ===================================================================== */}
      {selectedAttendanceRecord && (
        <div className="hr-modal-overlay" onClick={() => setSelectedAttendanceRecord(null)}>
          <div className="hr-modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Punch Record Details</h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Review punch log & perform manual supervisor time correction.</p>
              </div>
              <button onClick={() => setSelectedAttendanceRecord(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdatePunchRecord} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>EMPLOYEE</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedAttendanceRecord.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>{selectedAttendanceRecord.empId}</div>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>VERIFICATION METHOD</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#10b981', marginTop: '2px' }}>{selectedAttendanceRecord.mode}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>IP: {selectedAttendanceRecord.ip}</div>
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>PUNCH LOCATION</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>{selectedAttendanceRecord.location}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Check In Time</label>
                  <input
                    type="text"
                    value={editPunchIn}
                    onChange={(e) => setEditPunchIn(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Check Out Time</label>
                  <input
                    type="text"
                    value={editPunchOut}
                    onChange={(e) => setEditPunchOut(e.target.value)}
                    placeholder="e.g. 06:00 PM"
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setSelectedAttendanceRecord(null)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Save Punch Corrections</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: APPLY NEW WFH REQUEST
         ===================================================================== */}
      {showNewWfhModal && (
        <div className="hr-modal-overlay" onClick={() => setShowNewWfhModal(false)}>
          <div className="hr-modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>New Work From Home Request</h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Submit a remote work request for employee approval.</p>
              </div>
              <button onClick={() => setShowNewWfhModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateWfhRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Select Employee</label>
                <select
                  value={newWfhForm.emp}
                  onChange={(e) => setNewWfhForm({ ...newWfhForm, emp: e.target.value })}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.id} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>From Date</label>
                  <input
                    type="date"
                    required
                    value={newWfhForm.from}
                    onChange={(e) => setNewWfhForm({ ...newWfhForm, from: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>To Date</label>
                  <input
                    type="date"
                    required
                    value={newWfhForm.to}
                    onChange={(e) => setNewWfhForm({ ...newWfhForm, to: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newWfhForm.days}
                    onChange={(e) => setNewWfhForm({ ...newWfhForm, days: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Reason</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Internet installation / Personal work"
                    value={newWfhForm.reason}
                    onChange={(e) => setNewWfhForm({ ...newWfhForm, reason: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewWfhModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Submit WFH Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: WFH REQUEST DETAILS & DECISION
         ===================================================================== */}
      {selectedWfhModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedWfhModal(null)}>
          <div className="hr-modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>WFH Request Details</h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Review employee remote work application & history.</p>
              </div>
              <button onClick={() => setSelectedWfhModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <img src={selectedWfhModal.avatar} alt={selectedWfhModal.emp} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #a855f7' }} />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{selectedWfhModal.emp}</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>Request ID: #WFH-2026-{selectedWfhModal.id}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>FROM</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedWfhModal.from}</div>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>TO</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{selectedWfhModal.to}</div>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>TOTAL DAYS</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>{selectedWfhModal.days} Day(s)</div>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Stated Reason</div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.4 }}>{selectedWfhModal.reason}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
              <span className={`hr-pill ${selectedWfhModal.status.toLowerCase()}`}>
                Status: {selectedWfhModal.status}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedWfhModal.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleWfhAction(selectedWfhModal.id, 'Approved')}
                      className="hr-action-btn approve"
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Approve Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWfhAction(selectedWfhModal.id, 'Rejected')}
                      className="hr-action-btn reject"
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Reject Request
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setSelectedWfhModal(null)} className="hr-btn-action">Close</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: APPLY NEW LEAVE REQUEST
         ===================================================================== */}
      {showNewLeaveModal && (
        <div className="hr-modal-overlay" onClick={() => setShowNewLeaveModal(false)}>
          <div className="hr-modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>New Leave Request</h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Submit a leave request for employee approval.</p>
              </div>
              <button onClick={() => setShowNewLeaveModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateLeaveRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Select Employee</label>
                <select
                  value={newLeaveForm.emp}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, emp: e.target.value })}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.id} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Leave Type</label>
                <select
                  value={newLeaveForm.type}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, type: e.target.value })}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Earned Leave</option>
                  <option>Maternity / Paternity Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>From Date</label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.from}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, from: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>To Date</label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.to}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, to: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={newLeaveForm.days}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, days: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Reason</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doctor appointment / Family event"
                    value={newLeaveForm.reason}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, reason: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewLeaveModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Submit Leave Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD EMPLOYEE (2-STEP ONBOARDING: FILL DETAILS -> SEND OTP -> ENTER OTP -> SAVE & CONGRATS MAIL)
         ===================================================================== */}
      {showAddEmpModal && (
        <div className="hr-modal-overlay" onClick={() => { setShowAddEmpModal(false); setAddEmpStep(1); }}>
          <div className="hr-modal-content" style={{ maxWidth: '620px', background: '#0c1424', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.85)' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={22} color="#c084fc" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Add New Employee</h3>
                  <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                    {addEmpStep === 1
                      ? 'Step 1 of 2: Fill employee details to send verification OTP to mail'
                      : 'Step 2 of 2: Enter employee OTP to save details & send Congratulations welcome email'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowAddEmpModal(false); setAddEmpStep(1); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Real Gmail Delivery Status / Setup Banner */}
            <div style={{ background: smtpStatus.isConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)', border: smtpStatus.isConfigured ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color={smtpStatus.isConfigured ? '#34d399' : '#facc15'} />
                <span style={{ fontSize: '0.74rem', color: '#f8fafc', fontWeight: 600 }}>
                  {smtpStatus.isConfigured 
                    ? `🟢 Real Gmail Inbox Delivery Active (${smtpStatus.user})`
                    : '🟡 Live Test Preview Mode Active (OTP will open in browser preview until Gmail App Password is connected)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGmailSetupModal(true)}
                style={{ background: smtpStatus.isConfigured ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <Settings size={13} />
                <span>{smtpStatus.isConfigured ? 'Change Gmail Config' : '⚡ Connect Real Gmail Inbox'}</span>
              </button>
            </div>

            {/* STEP 1: FILL DETAILS & SEND OTP */}
            {addEmpStep === 1 && (
              <form onSubmit={handleSendOtpToEmployeeMail} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Row 1: Full Name & Employee ID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shreya Yadav"
                      value={newEmp.name}
                      onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={newEmp.id}
                      onChange={(e) => setNewEmp({ ...newEmp, id: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Employee Gmail / Email (For OTP) *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="shreyay1310@gmail.com"
                        value={newEmp.email}
                        onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%', paddingLeft: '32px' }}
                      />
                      <Mail size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Phone Number *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        placeholder="+91 85289 10171"
                        value={newEmp.phone}
                        onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%', paddingLeft: '32px' }}
                      />
                      <Phone size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a855f7' }} />
                    </div>
                  </div>
                </div>

                {/* Row 3: Department & Designation */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Department</label>
                    <select
                      value={newEmp.department}
                      onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                      className="hr-filter-select"
                      style={{ width: '100%' }}
                    >
                      <option>Engineering</option>
                      <option>Human Resources</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Finance</option>
                      <option>Operations</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Software Developer"
                      value={newEmp.designation}
                      onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Row 4: Shift & Temporary Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Shift Timing</label>
                    <select
                      value={newEmp.shift || 'General (09:00 AM - 06:00 PM)'}
                      onChange={(e) => setNewEmp({ ...newEmp, shift: e.target.value })}
                      className="hr-filter-select"
                      style={{ width: '100%' }}
                    >
                      <option>General (09:00 AM - 06:00 PM)</option>
                      <option>Morning (08:00 AM - 05:00 PM)</option>
                      <option>Evening (01:00 PM - 10:00 PM)</option>
                      <option>Night (09:00 PM - 06:00 AM)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Temporary Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewEmpPassword ? 'text' : 'password'}
                        required
                        value={newEmp.password || 'Password@123'}
                        onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%', paddingRight: '36px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewEmpPassword(!showNewEmpPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                      >
                        {showNewEmpPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Lock size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    <strong>Step 1 Security Protocol:</strong> Clicking below generates a 6-digit cryptographic verification OTP and immediately sends it to <strong style={{ color: '#38bdf8' }}>{newEmp.email || 'employee mail'}</strong>.
                  </span>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button type="button" onClick={() => setShowAddEmpModal(false)} className="hr-btn-action">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={otpSending}
                    className="hr-btn-purple"
                    style={{ minWidth: '220px', justifyContent: 'center', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: 'none', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.35)' }}
                  >
                    {otpSending ? (
                      <>
                        <RefreshCw size={16} className="spin" />
                        <span>Sending OTP to Mail...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send OTP to Employee Mail 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER OTP & SAVE EMPLOYEE */}
            {addEmpStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Dispatched Success Card matching screenshot */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.92rem' }}>
                      <CheckCheck size={18} />
                      <span>OTP Sent to Employee Mail Successfully!</span>
                    </div>
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                      DISPATCHED ✓
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '4px' }}>
                    Recipient: <strong style={{ color: '#38bdf8' }}>{newEmp.email}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Employee: <strong style={{ color: '#ffffff' }}>{newEmp.name}</strong> ({newEmp.id}) &bull; {newEmp.designation}
                  </div>

                  {/* Direct Live Mail Preview Link */}
                  {dispatchedMailPreviewUrl && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
                        🌐 Live Ethereal Mail Server Delivery:
                      </span>
                      <a
                        href={dispatchedMailPreviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '5px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)' }}
                      >
                        <ExternalLink size={13} />
                        <span>📬 Open Dispatched Mail (Live Email Preview)</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 6-Digit OTP Input Card */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#ffffff', fontWeight: 700 }}>
                      <Key size={15} color="#c084fc" />
                      <span>Enter 6-Digit OTP Received on Mail *</span>
                    </label>

                    {generatedOtpCode && (
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtpCode)}
                        style={{ background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.35)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        ⚡ Auto-fill Received OTP ({generatedOtpCode})
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 12px 0' }}>
                    Employee se pooch kar unke Gmail par receive hua 6-digit verification code yahan enter karein:
                  </p>

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="hr-filter-input"
                    style={{ width: '100%', fontSize: '1.8rem', textAlign: 'center', letterSpacing: '14px', fontFamily: 'monospace', fontWeight: 900, color: '#38bdf8', height: '56px', background: 'rgba(15, 23, 42, 0.8)', border: enteredOtp.length === 6 ? '2px solid #10b981' : '1px solid #334155' }}
                  />
                </div>

                {/* Automatic Welcome Mail Guarantee Box */}
                <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Award size={20} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e9d5ff', marginBottom: '3px' }}>
                      Automatic Welcome Mail Guarantee:
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      Jaise hi OTP fill karke aap submit karenge, saari details SQLite database mein save ho jayengi aur employee ke mail par <strong style={{ color: '#38bdf8' }}>"Congratulations! You are officially part of the company"</strong> welcome mail dispatch ho jayega with full details.
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setAddEmpStep(1)}
                    className="hr-btn-action"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    &larr; Edit Details
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => { setShowAddEmpModal(false); setAddEmpStep(1); }}
                      className="hr-btn-action"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingEmployee || enteredOtp.length !== 6}
                      onClick={handleVerifyAndSaveEmployee}
                      className="hr-btn-purple"
                      style={{
                        padding: '10px 22px',
                        background: enteredOtp.length === 6 ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#334155',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 800,
                        boxShadow: enteredOtp.length === 6 ? '0 4px 18px rgba(139, 92, 246, 0.4)' : 'none',
                        cursor: enteredOtp.length === 6 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {savingEmployee ? (
                        <>
                          <RefreshCw size={16} className="spin" />
                          <span>Saving & Dispatching Welcome Mail...</span>
                        </>
                      ) : (
                        <>
                          <CheckCheck size={16} />
                          <span>Verify OTP & Save Employee 🚀</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CONGRATULATIONS WELCOME EMAIL DISPATCHED
         ===================================================================== */}
      {congratsWelcomeMailModal && (
        <div className="hr-modal-overlay" onClick={() => setCongratsWelcomeMailModal(null)}>
          <div className="hr-modal-content" style={{ maxWidth: '540px', background: '#0b1120', border: '1px solid #334155', borderRadius: '18px', textAlign: 'center', padding: '28px', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(14, 165, 233, 0.2))', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)' }}>
              <Award size={32} color="#10b981" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0' }}>
              🎉 Employee Successfully Registered!
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              <strong style={{ color: '#38bdf8' }}>{congratsWelcomeMailModal.name}</strong> ({congratsWelcomeMailModal.id}) is now officially a member of <strong style={{ color: '#ffffff' }}>VorldX Technologies Pvt Ltd</strong>!
            </p>

            {/* Card of Details */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Designation:</span>
                  <strong style={{ color: '#ffffff' }}>{congratsWelcomeMailModal.designation}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Department:</span>
                  <strong style={{ color: '#ffffff' }}>{congratsWelcomeMailModal.department}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Registered Email:</span>
                  <strong style={{ color: '#38bdf8' }}>{congratsWelcomeMailModal.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Portal Password:</span>
                  <strong style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{congratsWelcomeMailModal.password}</strong>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.76rem', fontWeight: 700 }}>
                <CheckCheck size={16} />
                <span>"Congratulations Welcome Email" has been automatically dispatched to their inbox!</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {congratsWelcomeMailModal.welcomePreviewUrl && (
                <a
                  href={congratsWelcomeMailModal.welcomePreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid rgba(14, 165, 233, 0.4)', color: '#38bdf8', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  <ExternalLink size={14} />
                  <span>View Dispatched Email Preview</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setCongratsWelcomeMailModal(null)}
                className="hr-btn-purple"
                style={{ minWidth: '120px' }}
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: REAL GMAIL / SMTP CONFIGURATION
         ===================================================================== */}
      {showGmailSetupModal && (
        <div className="hr-modal-overlay" onClick={() => setShowGmailSetupModal(false)}>
          <div className="hr-modal-content" style={{ maxWidth: '520px', background: '#0c1424', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.85)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} color="#facc15" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Google Gmail SMTP Setup</h3>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Connect your Google App Password for direct inbox delivery</p>
                </div>
              </div>
              <button onClick={() => setShowGmailSetupModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Instruction Card */}
            <div style={{ background: 'rgba(14, 165, 233, 0.06)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                📌 30 Seconds Mein Google App Password Kaise Banayein:
              </div>
              <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                <li>Apne Google Account me jayein: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>myaccount.google.com/apppasswords</a></li>
                <li>App name me <strong>VorldX</strong> likhein aur <strong>Create</strong> dabayein.</li>
                <li>Google aapko <strong>16-digit password</strong> dega (Jaise: <code style={{ color: '#facc15', background: 'rgba(0,0,0,0.4)', padding: '1px 5px', borderRadius: '4px' }}>abcd efgh ijkl mnop</code>).</li>
                <li>Wo 16-letter code neeche daal kar <strong>Connect & Save</strong> dabayein!</li>
              </ol>
            </div>

            <form onSubmit={handleSaveSmtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Sender Gmail Address *</label>
                <input
                  type="email"
                  required
                  placeholder="shreyay1310@gmail.com"
                  value={smtpForm.user}
                  onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '5px' }}>Google 16-Digit App Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    required
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={smtpForm.pass}
                    onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%', paddingRight: '36px', fontFamily: 'monospace' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  >
                    {showSmtpPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowGmailSetupModal(false)} className="hr-btn-action">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={smtpSaving}
                  className="hr-btn-purple"
                  style={{ minWidth: '180px', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                >
                  {smtpSaving ? (
                    <>
                      <RefreshCw size={15} className="spin" />
                      <span>Verifying with Google...</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck size={15} />
                      <span>Verify & Connect SMTP 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: LEAVE REQUEST DETAILS
         ===================================================================== */}
      {selectedLeaveModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedLeaveModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Leave Request Details</h3>
              <button onClick={() => setSelectedLeaveModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', marginBottom: '16px' }}>
              <img src={selectedLeaveModal.avatar} alt={selectedLeaveModal.emp} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(168, 85, 247, 0.4)' }} />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{selectedLeaveModal.emp}</div>
                <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>{selectedLeaveModal.type}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className={`hr-pill ${selectedLeaveModal.status.toLowerCase()}`}>{selectedLeaveModal.status}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>From Date</span>
                <strong style={{ color: '#ffffff' }}>{selectedLeaveModal.from}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>To Date</span>
                <strong style={{ color: '#ffffff' }}>{selectedLeaveModal.to}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>Duration</span>
                <strong style={{ color: '#ffffff' }}>{selectedLeaveModal.days} Days</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem' }}>Status</span>
                <strong style={{ color: selectedLeaveModal.status === 'Approved' ? '#10b981' : selectedLeaveModal.status === 'Rejected' ? '#ef4444' : '#f59e0b' }}>
                  {selectedLeaveModal.status}
                </strong>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.72rem', marginBottom: '4px' }}>Employee Reason / Justification</span>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {selectedLeaveModal.reason || 'Personal leave request.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {selectedLeaveModal.status === 'Pending' ? (
                <>
                  <button
                    type="button"
                    className="hr-action-btn reject"
                    style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    onClick={() => {
                      handleLeaveAction(selectedLeaveModal.id, 'Rejected');
                      setSelectedLeaveModal(null);
                    }}
                  >
                    Reject Leave
                  </button>
                  <button
                    type="button"
                    className="hr-action-btn approve"
                    style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    onClick={() => {
                      handleLeaveAction(selectedLeaveModal.id, 'Approved');
                      setSelectedLeaveModal(null);
                    }}
                  >
                    Approve Leave
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="hr-btn-action"
                  onClick={() => setSelectedLeaveModal(null)}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD / EDIT HR MANAGEMENT ITEM
         ===================================================================== */}
      {showAddHrModal && (
        <div className="hr-modal-overlay" onClick={() => setShowAddHrModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {editingHrItem ? 'Edit ' : 'Add New '}
                {hrMgmtTab === 'Work Locations' ? 'Location' : hrMgmtTab === 'Holidays' ? 'Holiday' : hrMgmtTab.slice(0, -1)}
              </h3>
              <button onClick={() => setShowAddHrModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHrItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {hrMgmtTab === 'Departments' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Department Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artificial Intelligence"
                      value={newHrForm.name}
                      onChange={(e) => setNewHrForm({ ...newHrForm, name: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Head of Department</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ramesh Gupta"
                      value={newHrForm.head}
                      onChange={(e) => setNewHrForm({ ...newHrForm, head: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Employee Count</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newHrForm.count}
                      onChange={(e) => setNewHrForm({ ...newHrForm, count: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              )}

              {hrMgmtTab === 'Designations' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Designation Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Architect"
                      value={newHrForm.name}
                      onChange={(e) => setNewHrForm({ ...newHrForm, name: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                      <select
                        value={newHrForm.dept}
                        onChange={(e) => setNewHrForm({ ...newHrForm, dept: e.target.value })}
                        className="hr-filter-select"
                        style={{ width: '100%' }}
                      >
                        <option>Engineering</option>
                        <option>Human Resources</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                        <option>Finance</option>
                        <option>Support</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Positions</label>
                      <input
                        type="number"
                        min="1"
                        value={newHrForm.count}
                        onChange={(e) => setNewHrForm({ ...newHrForm, count: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Pay Band (CTC Range)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹50,000 - ₹90,000"
                      value={newHrForm.pay}
                      onChange={(e) => setNewHrForm({ ...newHrForm, pay: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              )}

              {hrMgmtTab === 'Holidays' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Holiday Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Year Day"
                      value={newHrForm.name}
                      onChange={(e) => setNewHrForm({ ...newHrForm, name: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Date</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 01 Jan 2027"
                        value={newHrForm.date}
                        onChange={(e) => setNewHrForm({ ...newHrForm, date: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Day of Week</label>
                      <input
                        type="text"
                        placeholder="e.g. Friday"
                        value={newHrForm.day}
                        onChange={(e) => setNewHrForm({ ...newHrForm, day: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Holiday Type</label>
                    <select
                      value={newHrForm.type}
                      onChange={(e) => setNewHrForm({ ...newHrForm, type: e.target.value })}
                      className="hr-filter-select"
                      style={{ width: '100%' }}
                    >
                      <option>Gazetted Holiday</option>
                      <option>National Holiday</option>
                      <option>Restricted Holiday</option>
                    </select>
                  </div>
                </>
              )}

              {hrMgmtTab === 'Work Locations' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Location Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chennai Development Hub"
                      value={newHrForm.name}
                      onChange={(e) => setNewHrForm({ ...newHrForm, name: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Address / City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OMR IT Corridor, Chennai"
                      value={newHrForm.address}
                      onChange={(e) => setNewHrForm({ ...newHrForm, address: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Staff Capacity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newHrForm.staff}
                      onChange={(e) => setNewHrForm({ ...newHrForm, staff: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              )}

              {hrMgmtTab === 'Shifts' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Shift Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Early Morning Shift"
                      value={newHrForm.name}
                      onChange={(e) => setNewHrForm({ ...newHrForm, name: e.target.value })}
                      className="hr-filter-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Timings</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 07:00 AM - 04:00 PM"
                        value={newHrForm.timings}
                        onChange={(e) => setNewHrForm({ ...newHrForm, timings: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 9 Hours"
                        value={newHrForm.duration}
                        onChange={(e) => setNewHrForm({ ...newHrForm, duration: e.target.value })}
                        className="hr-filter-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddHrModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">
                  {editingHrItem ? 'Save Changes' : `Add ${hrMgmtTab === 'Work Locations' ? 'Location' : hrMgmtTab === 'Holidays' ? 'Holiday' : hrMgmtTab.slice(0, -1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE JOB OPENING
         ===================================================================== */}
      {showCreateJobModal && (
        <div className="hr-modal-overlay" onClick={() => setShowCreateJobModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Create Job Opening</h3>
              <button onClick={() => setShowCreateJobModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateJobOpening} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                  <select
                    value={newJobForm.dept}
                    onChange={(e) => setNewJobForm({ ...newJobForm, dept: e.target.value })}
                    className="hr-filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Finance</option>
                    <option>Support</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Experience</label>
                  <select
                    value={newJobForm.exp}
                    onChange={(e) => setNewJobForm({ ...newJobForm, exp: e.target.value })}
                    className="hr-filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>0-1 Years (Fresher)</option>
                    <option>1-3 Years</option>
                    <option>2-4 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Employment Type</label>
                  <select
                    value={newJobForm.type}
                    onChange={(e) => setNewJobForm({ ...newJobForm, type: e.target.value })}
                    className="hr-filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contractual</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Location</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateJobModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Publish Job Opening</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW JOB OPENING & APPLICANTS PIPELINE
         ===================================================================== */}
      {selectedJobModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedJobModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>{selectedJobModal.title}</h3>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{selectedJobModal.dept} · {selectedJobModal.location || 'Bangalore HQ'} · {selectedJobModal.apps || 0} applicants</span>
              </div>
              <button onClick={() => setSelectedJobModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span className={`hr-pill ${selectedJobModal.status}`}>{selectedJobModal.status?.toUpperCase()}</span>
              <span className="hr-pill neutral">{selectedJobModal.exp || '2-4 Years'}</span>
              <span className="hr-pill neutral">{selectedJobModal.type || 'Full-time'}</span>
            </div>

            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0' }}>Applicant Pipeline & Screening</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
              {jobApplicants.map(app => (
                <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{app.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{app.email} · {app.exp} exp</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981' }}>{app.score} match</span>
                      <div style={{ fontSize: '0.72rem', color: '#c084fc' }}>{app.stage}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="hr-action-btn"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        onClick={() => handleApplicantStageChange(app.id, 'Shortlisted')}
                        title="Shortlist candidate"
                      >
                        Shortlist
                      </button>
                      <button
                        className="hr-action-btn"
                        style={{ fontSize: '0.7rem', padding: '4px 8px', color: '#38bdf8' }}
                        onClick={() => handleApplicantStageChange(app.id, 'Interview')}
                        title="Schedule Interview"
                      >
                        Interview
                      </button>
                      <button
                        className="hr-action-btn approve"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        onClick={() => handleApplicantStageChange(app.id, 'Hired')}
                        title="Offer & Hire"
                      >
                        Hire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" onClick={() => setSelectedJobModal(null)} className="hr-btn-action">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: SET NEW PERFORMANCE GOAL
         ===================================================================== */}
      {showNewGoalModal && (
        <div className="hr-modal-overlay" onClick={() => setShowNewGoalModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Set New Performance Goal</h3>
              <button onClick={() => setShowNewGoalModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Select Employee</label>
                <select
                  value={newGoalForm.emp}
                  onChange={(e) => {
                    const emp = employeesList.find(x => x.name === e.target.value);
                    setNewGoalForm({ ...newGoalForm, emp: e.target.value, dept: emp?.department || newGoalForm.dept });
                  }}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Goal Title / Key Result</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead migration of billing module with zero downtime"
                  value={newGoalForm.title}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, title: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                  <input
                    type="text"
                    value={newGoalForm.dept}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, dept: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Date</label>
                  <input
                    type="date"
                    required
                    value={newGoalForm.date}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, date: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewGoalModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Set Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: UPDATE GOAL PROGRESS
         ===================================================================== */}
      {selectedGoalModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedGoalModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Update Goal Progress</h3>
              <button onClick={() => setSelectedGoalModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{selectedGoalModal.title}</div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Assigned to: <strong style={{ color: '#38bdf8' }}>{selectedGoalModal.emp}</strong> ({selectedGoalModal.dept})</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
                <span style={{ color: '#94a3b8' }}>Progress Completed</span>
                <strong style={{ color: '#10b981', fontSize: '1rem' }}>{selectedGoalModal.progress}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedGoalModal.progress}
                onChange={(e) => setSelectedGoalModal({ ...selectedGoalModal, progress: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setSelectedGoalModal(null)} className="hr-btn-action">Cancel</button>
              <button
                type="button"
                className="hr-btn-purple"
                onClick={() => handleUpdateGoalProgress(selectedGoalModal.id, selectedGoalModal.progress, selectedGoalModal.progress >= 100 ? 'Completed' : 'In Progress')}
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: PERFORMER PROFILE
         ===================================================================== */}
      {selectedPerformerModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedPerformerModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Performer Profile</h3>
              <button onClick={() => setSelectedPerformerModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <img src={selectedPerformerModal.avatar} alt={selectedPerformerModal.name} style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #a855f7' }} />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{selectedPerformerModal.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{selectedPerformerModal.role || 'Senior Associate'} · {selectedPerformerModal.dept || 'Engineering'}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981' }}>{selectedPerformerModal.score}</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Score</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Core Strengths</span>
                <span style={{ color: '#cbd5e1' }}>Leadership, High velocity sprint delivery, Zero defect releases</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Q3 Review Rating</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>4.8 / 5.0 (Exceeds Expectations)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setSelectedPerformerModal(null)} className="hr-btn-action">Close</button>
            </div>
          </div>
        </div>
      )}
      {/* =====================================================================
          MODAL: CREATE TRAINING PROGRAM
         ===================================================================== */}
      {showCreateTrainingModal && (
        <div className="hr-modal-overlay" onClick={() => setShowCreateTrainingModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Create Training Program</h3>
              <button onClick={() => setShowCreateTrainingModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTraining} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Training Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced System Architecture & Design"
                  value={newTrainingForm.title}
                  onChange={(e) => setNewTrainingForm({ ...newTrainingForm, title: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newTrainingForm.cat}
                    onChange={(e) => setNewTrainingForm({ ...newTrainingForm, cat: e.target.value })}
                    className="hr-filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>Soft Skills</option>
                    <option>Technical</option>
                    <option>Leadership</option>
                    <option>Compliance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={newTrainingForm.date}
                    onChange={(e) => setNewTrainingForm({ ...newTrainingForm, date: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Max Participants</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newTrainingForm.parts}
                    onChange={(e) => setNewTrainingForm({ ...newTrainingForm, parts: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Duration</label>
                  <input
                    type="text"
                    value={newTrainingForm.duration}
                    onChange={(e) => setNewTrainingForm({ ...newTrainingForm, duration: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Lead Instructor / Trainer</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={newTrainingForm.trainer}
                  onChange={(e) => setNewTrainingForm({ ...newTrainingForm, trainer: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Program Description</label>
                <textarea
                  rows="2"
                  value={newTrainingForm.desc}
                  onChange={(e) => setNewTrainingForm({ ...newTrainingForm, desc: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowCreateTrainingModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Publish Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW TRAINING DETAILS
         ===================================================================== */}
      {selectedTrainingModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedTrainingModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>{selectedTrainingModal.title}</h3>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Instructor: <strong style={{ color: '#38bdf8' }}>{selectedTrainingModal.trainer || 'Senior Specialist'}</strong></span>
              </div>
              <button onClick={() => setSelectedTrainingModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px', fontSize: '0.8rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block' }}>Category</span>
                <span style={{ color: '#c084fc', fontWeight: 700 }}>{selectedTrainingModal.cat}</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block' }}>Date</span>
                <strong style={{ color: '#ffffff' }}>{selectedTrainingModal.date}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block' }}>Enrolled</span>
                <strong style={{ color: '#10b981' }}>{selectedTrainingModal.parts} Participants</strong>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', marginBottom: '4px' }}>Course Overview</span>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {selectedTrainingModal.desc || 'Comprehensive professional training curriculum focusing on practical industry methodologies.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="hr-action-btn"
                style={{ fontSize: '0.78rem' }}
                onClick={() => handleToggleTrainingStatus(selectedTrainingModal.id)}
              >
                Mark as {selectedTrainingModal.status === 'Upcoming' ? 'Completed' : 'Upcoming'}
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedTrainingModal(null)} className="hr-btn-action">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW SALARY PAYSLIP
         ===================================================================== */}
      {selectedPayrollModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedPayrollModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Employee Salary Payslip</h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Pay Period: October 2026 · VorldX Industries Pvt Ltd</span>
              </div>
              <button onClick={() => setSelectedPayrollModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{selectedPayrollModal.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{selectedPayrollModal.id} · {selectedPayrollModal.bank || 'HDFC Bank •••• 4892'}</div>
              </div>
              <span className={`hr-pill ${selectedPayrollModal.status === 'Processed' ? 'approved' : 'pending'}`}>
                {selectedPayrollModal.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              {/* Earnings */}
              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', marginBottom: '8px' }}>EARNINGS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: '#cbd5e1' }}>
                  <span>Basic Salary</span>
                  <strong style={{ color: '#ffffff' }}>{selectedPayrollModal.basic}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: '#cbd5e1' }}>
                  <span>HRA Allowance</span>
                  <strong style={{ color: '#ffffff' }}>{selectedPayrollModal.hra || '₹16,000'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  <span>Special Allowance</span>
                  <strong style={{ color: '#10b981' }}>{selectedPayrollModal.allow}</strong>
                </div>
              </div>

              {/* Deductions */}
              <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>DEDUCTIONS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: '#cbd5e1' }}>
                  <span>Provident Fund (PF)</span>
                  <strong style={{ color: '#ffffff' }}>{selectedPayrollModal.pf || '₹1,800'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: '#cbd5e1' }}>
                  <span>TDS / Taxes</span>
                  <strong style={{ color: '#ef4444' }}>{selectedPayrollModal.ded}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  <span>Insurance</span>
                  <strong style={{ color: '#ffffff' }}>₹0</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Net Take-Home Pay</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>{selectedPayrollModal.net}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedPayrollModal.status === 'Pending' ? (
                <button
                  type="button"
                  className="hr-action-btn approve"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={() => handleProcessPayroll(selectedPayrollModal.id)}
                >
                  Authorize & Process Salary
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="hr-btn-purple"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => handleDownloadPayslip(selectedPayrollModal)}
                >
                  <Download size={14} />
                  <span>Download Payslip</span>
                </button>
                <button type="button" onClick={() => setSelectedPayrollModal(null)} className="hr-btn-action">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: ADD COMPANY POLICY
         ===================================================================== */}
      {showAddPolicyModal && (
        <div className="hr-modal-overlay" onClick={() => setShowAddPolicyModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Add Company Policy</h3>
              <button onClick={() => setShowAddPolicyModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPolicy} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Policy Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote Work Asset & Security Policy"
                  value={newPolicyForm.name}
                  onChange={(e) => setNewPolicyForm({ ...newPolicyForm, name: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newPolicyForm.cat}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, cat: e.target.value })}
                    className="hr-filter-select"
                    style={{ width: '100%' }}
                  >
                    <option>HR</option>
                    <option>WFH</option>
                    <option>Leave</option>
                    <option>Security</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Document Size</label>
                  <input
                    type="text"
                    value={newPolicyForm.size}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, size: e.target.value })}
                    className="hr-filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Policy Description / Scope</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Summary of regulations, compliance clauses, and expectations..."
                  value={newPolicyForm.desc}
                  onChange={(e) => setNewPolicyForm({ ...newPolicyForm, desc: e.target.value })}
                  className="hr-filter-input"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddPolicyModal(false)} className="hr-btn-action">Cancel</button>
                <button type="submit" className="hr-btn-purple">Upload Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIEW POLICY DETAILS
         ===================================================================== */}
      {selectedPolicyModal && (
        <div className="hr-modal-overlay" onClick={() => setSelectedPolicyModal(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>{selectedPolicyModal.name}</h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Category: <strong style={{ color: '#38bdf8' }}>{selectedPolicyModal.cat}</strong> · Updated: {selectedPolicyModal.date}</span>
              </div>
              <button onClick={() => setSelectedPolicyModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', marginBottom: '20px', maxHeight: '240px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#a855f7', marginBottom: '6px' }}>EXECUTIVE SUMMARY</div>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                {selectedPolicyModal.desc}
              </p>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>KEY COMPLIANCE PRINCIPLES</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
                <li>Mandatory acknowledgment required by all onboarded personnel.</li>
                <li>Monitored quarterly by the Internal Ethics & Compliance Board.</li>
                <li>Audited annually in conformance with ISO standards.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="hr-btn-purple"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleDownloadPolicy(selectedPolicyModal)}
              >
                <Download size={14} />
                <span>Download Document ({selectedPolicyModal.size})</span>
              </button>
              <button type="button" onClick={() => setSelectedPolicyModal(null)} className="hr-btn-action">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: GENERATE & EXPORT REPORT
         ===================================================================== */}
      {showGenerateReportModal && (
        <div className="hr-modal-overlay" onClick={() => setShowGenerateReportModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Generate Analytics Report</h3>
              <button onClick={() => setShowGenerateReportModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Department Scope</label>
                <select
                  value={reportConfig.dept}
                  onChange={(e) => setReportConfig({ ...reportConfig, dept: e.target.value })}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Finance</option>
                  <option>Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Report Timeframe</label>
                <select
                  value={reportConfig.month}
                  onChange={(e) => setReportConfig({ ...reportConfig, month: e.target.value })}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  <option>October 2026</option>
                  <option>September 2026</option>
                  <option>Q3 2026 (Quarterly)</option>
                  <option>Year-To-Date (2026)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Export Format</label>
                <select
                  value={reportConfig.format}
                  onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                  className="hr-filter-select"
                  style={{ width: '100%' }}
                >
                  <option>CSV (Excel Compatible)</option>
                  <option>JSON (Data Feed)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setShowGenerateReportModal(false)} className="hr-btn-action">Cancel</button>
              <button type="button" onClick={handleDownloadReport} className="hr-btn-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14} />
                <span>Export & Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: DEPARTMENT DRILLDOWN REPORT
         ===================================================================== */}
      {selectedDeptReport && (
        <div className="hr-modal-overlay" onClick={() => setSelectedDeptReport(null)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{selectedDeptReport.name} Department</h3>
              <button onClick={() => setSelectedDeptReport(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Headcount</span>
                <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>{selectedDeptReport.count} Staff</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Average Hours</span>
                <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{selectedDeptReport.avgHrs}</strong>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Present On-site</span>
                <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{selectedDeptReport.present}%</strong>
              </div>
              <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block' }}>Remote / WFH</span>
                <strong style={{ color: '#c084fc', fontSize: '1.1rem' }}>{selectedDeptReport.wfh}%</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setSelectedDeptReport(null)} className="hr-btn-action">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div className="hr-toast">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
