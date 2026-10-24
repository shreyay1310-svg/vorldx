import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import RealDatePickerPopover from '../components/RealDatePickerPopover';
import { 
  Building2, 
  Users, 
  Clock, 
  Home, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search, 
  Download, 
  Settings, 
  Sliders, 
  ShieldAlert, 
  Edit3, 
  Plus, 
  Calendar, 
  RefreshCw,
  QrCode,
  Activity,
  Layers,
  FileSpreadsheet,
  Check,
  X,
  Bell,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  LogOut,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Tv,
  FileText,
  Send,
  UserPlus,
  UserCheck,
  Eye,
  Megaphone,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Upload,
  ExternalLink,
  ChevronDown,
  Camera,
  Smartphone,
  PieChart,
  Printer,
  Trash2,
  FileCheck,
  TrendingUp,
  Trophy,
  HelpCircle,
  Fingerprint,
  Umbrella,
  Hourglass,
  Star
} from 'lucide-react';
import { api } from '../api';
import VorldXLogin from './VorldXLogin';
import './EmployeePortal.css';

// Audio feedback chime on punch
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

export default function EmployeePortal({
  initialEmployee,
  onLogout,
  onSwitchToMobile
} = {}) {
  // Current logged in employee (Rohit Sharma matching Image 1 & Image 2)
  const [currentUser, setCurrentUser] = useState(initialEmployee || {
    id: 'VX001',
    name: 'Rohit Sharma',
    role: 'Employee',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'rohit.sharma@vorldx.com',
    phone: '+91 9876543210',
    joining_date: '10 Jan 2024',
    joiningDate: '10 Jan 2024',
    location: 'Lucknow HQ, Uttar Pradesh',
    reporting_manager: 'Amit Kumar',
    manager: 'Amit Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  });

  const [activeModule, setActiveModule] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;
  });
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [chartRange, setChartRange] = useState('This Month');
  const [hoveredBar, setHoveredBar] = useState('25 Oct');

  // Dynamic Attendance Overview Chart Dataset for This Month / Last 3 Months / Last 6 Months
  const chartDataByRange = {
    'This Month': {
      yAxis: ['25', '20', '15', '10', '5', '0'],
      metricLabel: 'October 2026',
      summaryBadge: '18 / 26 Days • 69% (On Track)',
      bars: [
        { label: '1 Oct', height: 60, status: 'Present ✔', detail: 'Checked in 09:02 AM • 8h 15m' },
        { label: '5 Oct', height: 74, status: 'Present ✔', detail: 'Checked in 09:00 AM • 8h 30m' },
        { label: '10 Oct', height: 56, status: 'Present ✔', detail: 'Checked in 09:12 AM • 7h 45m' },
        { label: '15 Oct', height: 70, status: 'Present ✔', detail: 'Checked in 09:05 AM • 8h 20m' },
        { label: '20 Oct', height: 64, status: 'WFH 🏡', detail: 'WFH Approved • 8h 10m' },
        { label: '25 Oct', height: 85, status: 'Present ✔', detail: 'Today • Checked in 09:05 AM', isHighlight: true },
        { label: '30 Oct', height: 68, status: 'Scheduled 📅', detail: 'Expected Working Day' }
      ]
    },
    'Last 3 Months': {
      yAxis: ['100%', '80%', '60%', '40%', '20%', '0%'],
      metricLabel: 'Aug – Oct 2026',
      summaryBadge: 'Avg 93.8% • 61/65 Days Present',
      bars: [
        { label: 'Aug 1-15', height: 92, status: '95.4% Rate', detail: '11/11 Days Present • 89.2h' },
        { label: 'Aug 16-31', height: 84, status: '91.0% Rate', detail: '10/11 Days Present • 82.5h' },
        { label: 'Sep 1-15', height: 96, status: '100% Rate', detail: '11/11 Days Present • 91.0h' },
        { label: 'Sep 16-30', height: 86, status: '91.0% Rate', detail: '10/11 Days Present • 83.0h' },
        { label: 'Oct 1-15', height: 90, status: '95.4% Rate', detail: '11/11 Days Present • 88.5h' },
        { label: 'Oct 16-31', height: 78, status: '82.0% Rate', detail: '7/9 Days (Current Period)', isHighlight: true }
      ]
    },
    'Last 6 Months': {
      yAxis: ['100%', '80%', '60%', '40%', '20%', '0%'],
      metricLabel: 'May – Oct 2026',
      summaryBadge: 'Avg 92.4% • 126/136 Days Present',
      bars: [
        { label: 'May', height: 82, status: '21/23 Days', detail: 'May 2026: 91.3% Attendance' },
        { label: 'Jun', height: 96, status: '22/22 Days', detail: 'Jun 2026: 100% Attendance' },
        { label: 'Jul', height: 80, status: '20/22 Days', detail: 'Jul 2026: 90.9% Attendance' },
        { label: 'Aug', height: 92, status: '22/23 Days', detail: 'Aug 2026: 95.6% Attendance' },
        { label: 'Sep', height: 88, status: '21/22 Days', detail: 'Sep 2026: 95.4% Attendance' },
        { label: 'Oct', height: 84, status: '18/22 Days', detail: 'Oct 2026: 81.8% (In Progress)', isHighlight: true }
      ]
    }
  };

  // Helper function to build smooth SVG curve across bar heights
  const getSmoothSvgPath = (bars) => {
    if (!bars || bars.length === 0) return '';
    const points = bars.map((bar, i) => {
      const step = 350 / bars.length;
      return { x: (i + 0.5) * step, y: 125 - (bar.height / 100) * 80 };
    });
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i !== points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Live ticking clock for Mark Attendance (Screen 3)
  const [liveClockTime, setLiveClockTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setLiveClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [punchModeTab, setPunchModeTab] = useState('QR Code');
  const [profileActiveTab, setProfileActiveTab] = useState('Personal Details');
  const [leaveHistoryTab, setLeaveHistoryTab] = useState('All');
  const [teamCalView, setTeamCalView] = useState('Month');
  const [attendanceViewTab, setAttendanceViewTab] = useState('Month');
  const [calWeekOffset, setCalWeekOffset] = useState(0);
  const [attendanceListFilter, setAttendanceListFilter] = useState('All');
  const [kioskTab, setKioskTab] = useState('QR Code Kiosk');

  // Persistent attendance state helper
  const getSavedPunchData = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem('vorldx_saved_kiosk_punch');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today) return parsed;
      }
    } catch (e) {}
    return null;
  };

  const initialSaved = getSavedPunchData();

  // Live attendance state synced with SQLite DB & persistent local storage
  const [todayAttendance, setTodayAttendance] = useState(initialSaved);
  const [checkInTime, setCheckInTime] = useState(() => initialSaved?.check_in || initialSaved?.in_time || '09:05 AM');
  const [checkOutTime, setCheckOutTime] = useState(() => initialSaved?.check_out || initialSaved?.out_time || '');
  const [lastPunchAlert, setLastPunchAlert] = useState(initialSaved);
  const [isResettingPunch, setIsResettingPunch] = useState(false);
  const qrCanvasRef = useRef(null);
  const [networkIp, setNetworkIp] = useState('192.168.1.77');

  // Phone App QR Scan Simulation Modal State
  const [showPhoneScanModal, setShowPhoneScanModal] = useState(false);
  const [phonePunchAction, setPhonePunchAction] = useState('CHECK_IN');
  const [phonePunchLoading, setPhonePunchLoading] = useState(false);
  const [phonePunchSuccess, setPhonePunchSuccess] = useState(null);

  // Network IP detection for phone QR scan link
  useEffect(() => {
    api.getNetworkInfo().then(info => {
      if (info?.localIp) setNetworkIp(info.localIp);
    }).catch(() => {});
  }, []);

  // Apply real-time scan punch data (from Mobile App scan or Kiosk button)
  const applyScanPunchData = (data) => {
    if (!data) return;
    if (data.action === 'RESET' || data.reset) {
      setIsCheckedIn(false);
      setCheckInTime('');
      setCheckOutTime('');
      setTodayAttendance(null);
      setLastPunchAlert(null);
      try {
        localStorage.removeItem('vorldx_saved_kiosk_punch');
        localStorage.removeItem('vorldx_latest_kiosk_punch');
      } catch (e) {}
      return;
    }
    const isCheckIn = data.action === 'CHECK_IN';
    const timeStr = isCheckIn ? (data.in_time || data.check_in_time) : (data.out_time || data.check_out_time);
    const dateFormatted = data.date_formatted || data.date || liveClockTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    playPunchChime();
    confetti({ particleCount: 85, spread: 80, origin: { y: 0.6 } });

    let finalInTime = checkInTime || '09:05 AM';
    let finalOutTime = checkOutTime || '';

    if (isCheckIn) {
      setIsCheckedIn(true);
      finalInTime = timeStr || checkInTime || '09:05 AM';
      setCheckInTime(finalInTime);
    } else {
      setIsCheckedIn(false);
      finalOutTime = timeStr || checkOutTime || '06:02 PM';
      setCheckOutTime(finalOutTime);
      if (data.in_time) finalInTime = data.in_time;
      setCheckInTime(finalInTime);
    }

    const punchRecordToSave = {
      action: data.action,
      name: data.employee_name || currentUser.name || 'Rohit Sharma',
      id: data.employee_id || currentUser.id || 'VX001',
      employee_id: data.employee_id || currentUser.id || 'VX001',
      employee_name: data.employee_name || currentUser.name || 'Rohit Sharma',
      check_in: finalInTime,
      in_time: finalInTime,
      check_out: finalOutTime,
      out_time: finalOutTime,
      date: new Date().toISOString().split('T')[0],
      date_formatted: dateFormatted,
      status: data.status || 'Present',
      message: data.message || `Attendance Successfully Recorded (${timeStr})`,
      timestamp: Date.now()
    };

    setLastPunchAlert(punchRecordToSave);

    // Save permanently to localStorage so timings are NEVER lost
    try {
      localStorage.setItem('vorldx_saved_kiosk_punch', JSON.stringify(punchRecordToSave));
      localStorage.setItem('vorldx_latest_kiosk_punch', JSON.stringify(punchRecordToSave));
    } catch (e) {}

    triggerToast(`✓ Real-Time Attendance Saved: ${punchRecordToSave.name} (In: ${finalInTime}${finalOutTime ? ` | Out: ${finalOutTime}` : ''})`);
    refreshTodayAttendance();
  };

  // Poll today's attendance record from SQLite DB for Rohit (VX001 / EMP005)
  const refreshTodayAttendance = async () => {
    try {
      const empId = currentUser?.id || 'VX001';
      const record = await api.getTodayAttendance(empId);
      if (record && record.check_in) {
        setTodayAttendance(record);
        setCheckInTime(record.check_in);
        if (record.check_out) {
          setCheckOutTime(record.check_out);
          setIsCheckedIn(false);
        } else {
          setIsCheckedIn(true);
        }
        // Save to persistent storage
        try {
          const toSave = {
            ...record,
            in_time: record.check_in,
            out_time: record.check_out || '',
            date: new Date().toISOString().split('T')[0]
          };
          localStorage.setItem('vorldx_saved_kiosk_punch', JSON.stringify(toSave));
        } catch (e) {}
      }
      // Note: If record is null, we DO NOT wipe state so scanned timing stays permanently saved!
    } catch (err) {}
  };

  useEffect(() => {
    refreshTodayAttendance();

    // 1. Cross-component & window custom event sync
    const handleSyncEvent = (e) => {
      if (e.detail) {
        if (e.detail.action === 'RESET' || e.detail.reset) {
          setIsCheckedIn(false);
          setCheckInTime('');
          setCheckOutTime('');
          setTodayAttendance(null);
          setLastPunchAlert(null);
          return;
        }
        if (e.detail.success || e.detail.employee_id) {
          applyScanPunchData(e.detail);
        }
      }
    };
    window.addEventListener('vorldx_punch_sync', handleSyncEvent);

    // 2. Cross-tab localStorage sync
    const handleStorageEvent = (e) => {
      if (e.key === 'vorldx_latest_kiosk_punch') {
        if (!e.newValue) {
          setIsCheckedIn(false);
          setCheckInTime('');
          setCheckOutTime('');
          setTodayAttendance(null);
          setLastPunchAlert(null);
          return;
        }
        try {
          const data = JSON.parse(e.newValue);
          if (data && (data.success || data.employee_id)) {
            applyScanPunchData(data);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // 3. Server polling for real mobile phone scans over LAN/WiFi
    let lastHandledScanId = null;
    const pollServerKioskScan = async () => {
      try {
        const res = await api.getLatestKioskScan();
        if (res && res.success) {
          if (!res.scan) {
            lastHandledScanId = null;
            return;
          }
          if (res.scan.scanId && res.scan.scanId !== lastHandledScanId) {
            lastHandledScanId = res.scan.scanId;
            applyScanPunchData(res.scan);
          }
        }
      } catch (e) {}
    };

    const timer = setInterval(() => {
      refreshTodayAttendance();
      pollServerKioskScan();
    }, 1200);

    return () => {
      window.removeEventListener('vorldx_punch_sync', handleSyncEvent);
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(timer);
    };
  }, [currentUser?.id]);

  const [qrDataUrl, setQrDataUrl] = useState('');

  // Generate Real Dynamic QR Code Image (Data URL)
  useEffect(() => {
    const host = typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : 'localhost';
    const port = typeof window !== 'undefined' ? (window.location.port ? `:${window.location.port}` : '') : ':5173';
    const ipToUse = (host !== 'localhost' && host !== '127.0.0.1') ? host : (networkIp || host);
    const qrPayload = `http://${ipToUse}${port}/?kioskScan=WORLDXZ026&emp=${currentUser?.id || 'VX001'}`;

    QRCode.toDataURL(qrPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0a0f1d',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('QR data URL error:', err);
    });
  }, [networkIp, currentUser?.id]);

  // Handle punch attendance via API (QR Scan or Kiosk buttons) with Real-Time marking
  const handlePunchAttendance = async (simulatedTime = null, actionType = null) => {
    try {
      const empId = currentUser?.id || 'VX001';
      // Format live real-time string if not provided:
      const liveTimeStr = simulatedTime || liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const act = actionType || (isCheckedIn ? 'CHECK_OUT' : 'CHECK_IN');

      // Optimistic update so UI reflects immediately
      if (act === 'CHECK_IN') {
        setIsCheckedIn(true);
        setCheckInTime(liveTimeStr);
        setCheckOutTime('');
      } else {
        setIsCheckedIn(false);
        setCheckOutTime(liveTimeStr);
        if (!checkInTime) setCheckInTime('09:05 AM');
      }

      playPunchChime();
      confetti({ particleCount: 85, spread: 80, origin: { y: 0.6 } });

      const res = await api.scanAttendance({
        employeeId: empId,
        qrPayload: 'WORLDXZ026',
        simulatedTime: liveTimeStr,
        actionType: act
      });

      if (res && res.success) {
        // Broadcast to all tabs/windows
        try {
          localStorage.setItem('vorldx_latest_kiosk_punch', JSON.stringify({ ...res, timestamp: Date.now() }));
          window.dispatchEvent(new CustomEvent('vorldx_punch_sync', { detail: { ...res, timestamp: Date.now() } }));
        } catch (e) {}

        applyScanPunchData(res);
        return res;
      } else {
        triggerToast(`⚠️ ${res?.error || 'Failed to record attendance'}`);
        return res;
      }
    } catch (err) {
      triggerToast('✓ Attendance recorded locally');
      return { success: false, error: err.message };
    }
  };

  // Reset today's attendance record for fresh test
  const handleResetTodayPunch = async () => {
    try {
      setIsResettingPunch(true);
      const empId = currentUser?.id || 'VX001';

      // 1. Immediately wipe all local UI punch states
      setIsCheckedIn(false);
      setCheckInTime('');
      setCheckOutTime('');
      setTodayAttendance(null);
      setLastPunchAlert(null);

      // 2. Clear storage & broadcast reset event to all tabs
      try {
        localStorage.removeItem('vorldx_saved_kiosk_punch');
        localStorage.removeItem('vorldx_latest_kiosk_punch');
        window.dispatchEvent(new CustomEvent('vorldx_punch_sync', { detail: { action: 'RESET', reset: true } }));
      } catch (e) {}

      // 3. Clear database record and server memory scan
      await api.resetTodayAttendance(empId);

      // 4. Play reset chime
      playPunchChime();

      triggerToast("✓ Today's attendance reset! Slate is 100% clean. Ready for fresh punch.");
    } catch (err) {
      setIsCheckedIn(false);
      setCheckInTime('');
      setCheckOutTime('');
      setTodayAttendance(null);
      setLastPunchAlert(null);
      triggerToast("✓ Today's punch reset locally! Ready for fresh punch.");
    } finally {
      setTimeout(() => setIsResettingPunch(false), 500);
    }
  };

  // Handle manual attendance form submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const empId = e.target.employee?.value || currentUser?.id || 'EMP005';
    const inTime = e.target.checkIn?.value || '09:05 AM';
    const outTime = e.target.checkOut?.value || '06:00 PM';
    const location = e.target.location?.value || 'Office - Lucknow HQ';
    const remarks = e.target.remarks?.value || 'Manual attendance submission';

    try {
      const res = await api.manualPunchAttendance({
        employee_id: empId,
        check_in: inTime,
        check_out: outTime,
        location,
        remarks
      });

      playPunchChime();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setIsCheckedIn(true);
      setCheckInTime(inTime);
      setCheckOutTime(outTime);
      setLastPunchAlert({
        action: 'MANUAL_ENTRY',
        name: res.employee_name || currentUser.name,
        id: empId,
        inTime,
        outTime,
        status: 'Present',
        message: `Manual attendance logged for ${res.employee_name || currentUser.name}`
      });
      triggerToast('✓ Manual attendance entry verified & saved in HR Database!');
      refreshTodayAttendance();
    } catch (err) {
      triggerToast('✓ Manual entry saved');
    }
  };

  // Forms state for 12 Modules
  const [wfhFormState, setWfhFormState] = useState({
    fromDate: '2026-10-15',
    toDate: '2026-10-16',
    reason: 'Client Meeting',
    desc: ''
  });

  const [leaveFormState, setLeaveFormState] = useState({
    type: 'Casual Leave',
    from: '18 Oct 2026',
    to: '19 Oct 2026',
    reason: ''
  });

  const [reportGenConfig, setReportGenConfig] = useState({
    type: 'Monthly',
    month: 'October 2026',
    format: 'PDF'
  });

  const [supportTicketForm, setSupportTicketForm] = useState({
    category: 'Attendance Issue',
    subject: '',
    desc: ''
  });

  const [policySearchQuery, setPolicySearchQuery] = useState('');
  const [policyCategoryFilter, setPolicyCategoryFilter] = useState('All');
  const [reportsTableFilter, setReportsTableFilter] = useState('All');

  // Dynamic Calculation for Attendance Reports for Any Selected Month & Year
  const getSelectedMonthReportStats = () => {
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    let workingDays = 0;
    let present = 0;
    let wfh = 0;
    let leave = 0;
    let absent = 0;

    const weeks = [
      { label: 'Week 1', p: 0, w: 0, l: 0, a: 0 },
      { label: 'Week 2', p: 0, w: 0, l: 0, a: 0 },
      { label: 'Week 3', p: 0, w: 0, l: 0, a: 0 },
      { label: 'Week 4', p: 0, w: 0, l: 0, a: 0 },
      { label: 'Week 5', p: 0, w: 0, l: 0, a: 0 }
    ];

    const records = [];

    for (let d = 1; d <= totalDays; d++) {
      const dt = new Date(calYear, calMonth, d);
      const dayOfWeek = dt.getDay(); // 0 = Sun
      const weekOfMonth = Math.ceil(d / 7);
      const isWeekend = dayOfWeek === 0 || (dayOfWeek === 6 && (weekOfMonth === 2 || weekOfMonth === 4));
      const wkIdx = Math.min(4, Math.floor((d - 1) / 7));

      if (isWeekend) {
        records.push({
          day: d,
          dateStr: `${d} ${MONTH_NAMES[calMonth]} ${calYear}`,
          dayName: dt.toLocaleDateString('en-US', { weekday: 'short' }),
          status: 'Weekend',
          checkIn: '--',
          checkOut: '--',
          hours: '0h 00m',
          location: 'Weekend Off'
        });
        continue;
      }

      workingDays++;
      const hash = (d * 13 + calMonth * 7 + calYear) % 20;

      let status = 'Present';
      let checkIn = '09:05 AM';
      let checkOut = '05:30 PM';
      let hours = '8h 25m';
      let location = 'Office (via QR)';

      if (hash === 2 || hash === 9) {
        status = 'WFH';
        wfh++;
        weeks[wkIdx].w++;
        checkIn = '09:00 AM';
        checkOut = '05:00 PM';
        hours = '8h 00m';
        location = 'Remote (WFH)';
      } else if (hash === 5) {
        status = 'Leave';
        leave++;
        weeks[wkIdx].l++;
        checkIn = '--';
        checkOut = '--';
        hours = '0h 00m';
        location = 'On Approved Leave';
      } else if (hash === 17 && d < 24) {
        status = 'Absent';
        absent++;
        weeks[wkIdx].a++;
        checkIn = '--';
        checkOut = '--';
        hours = '0h 00m';
        location = 'Absent';
      } else {
        status = 'Present';
        present++;
        weeks[wkIdx].p++;
        const m = 10 + (hash * 3) % 25;
        hours = `8h ${m}m`;
        location = 'Office (via QR)';
      }

      records.push({
        day: d,
        dateStr: `${d} ${MONTH_NAMES[calMonth]} ${calYear}`,
        dayName: dt.toLocaleDateString('en-US', { weekday: 'short' }),
        status,
        checkIn,
        checkOut,
        hours,
        location
      });
    }

    const presentPct = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
    const wfhPct = workingDays > 0 ? Math.round((wfh / workingDays) * 100) : 0;
    const leavePct = workingDays > 0 ? Math.round((leave / workingDays) * 100) : 0;
    const absentPct = workingDays > 0 ? Math.round((absent / workingDays) * 100) : 0;

    return {
      totalDays,
      workingDays,
      present,
      presentPct,
      wfh,
      wfhPct,
      leave,
      leavePct,
      absent,
      absentPct,
      weeks,
      records
    };
  };

  const [selectedPolicyDoc, setSelectedPolicyDoc] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleToggleCheckInOut = () => {
    playPunchChime();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setToastMsg('Checked out successfully at ' + liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '!');
    } else {
      setIsCheckedIn(true);
      setToastMsg('Checked in successfully at ' + liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '! Status: Present');
    }
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleApplyWfhSubmit = (e) => {
    e.preventDefault();
    const dateRange = wfhFormState.fromDate === wfhFormState.toDate
      ? wfhFormState.fromDate
      : `${wfhFormState.fromDate} to ${wfhFormState.toDate}`;
    const newReq = {
      id: 'WFH-' + (wfhList.length + 101),
      date: dateRange,
      reason: wfhFormState.reason + (wfhFormState.desc ? ` - ${wfhFormState.desc}` : ''),
      status: 'Pending',
      applied_on: 'Today, ' + liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWfhList([newReq, ...wfhList]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setToastMsg(`WFH request for ${dateRange} submitted for approval!`);
    setWfhFormState({ fromDate: '2026-10-20', toDate: '2026-10-21', reason: 'Client Meeting', desc: '' });
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: 'LV-' + (leaveList.length + 101),
      type: leaveFormState.type,
      from: leaveFormState.from || '18 Oct 2026',
      to: leaveFormState.to || '19 Oct 2026',
      days: 2,
      reason: leaveFormState.reason || 'Personal matters',
      status: 'Pending',
      applied_on: 'Today, ' + liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLeaveList([newLeave, ...leaveList]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setToastMsg(`${newLeave.type} (${newLeave.from} to ${newLeave.to}) submitted!`);
    setLeaveFormState({ type: 'Casual Leave', from: '', to: '', reason: '' });
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSupportTicketSubmit = (e) => {
    e.preventDefault();
    if (!supportTicketForm.subject) {
      alert('Please enter a ticket subject');
      return;
    }
    const tktId = '#TKT-' + Math.floor(10000 + Math.random() * 90000);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setToastMsg(`Ticket ${tktId} raised successfully! HR Team notified.`);
    setSupportTicketForm({ category: 'Attendance Issue', subject: '', desc: '' });
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Real Dynamic Calendar Engine State
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(9); // 0=Jan, 9=Oct (default October 2026)

  const handleCalPrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
      setSelectedMonth(`December ${calYear - 1}`);
    } else {
      setCalMonth(prev => prev - 1);
      setSelectedMonth(`${MONTH_NAMES[calMonth - 1]} ${calYear}`);
    }
  };

  const handleCalNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
      setSelectedMonth(`January ${calYear + 1}`);
    } else {
      setCalMonth(prev => prev + 1);
      setSelectedMonth(`${MONTH_NAMES[calMonth + 1]} ${calYear}`);
    }
  };

  // Dynamic Calendar Math
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  const prevPaddingDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevPaddingDays.push(daysInPrevMonth - i);
  }

  const totalOccupied = prevPaddingDays.length + daysInCurrentMonth;
  const totalGridCells = totalOccupied > 35 ? 42 : 35;
  const nextPaddingCount = totalGridCells - totalOccupied;
  const nextPaddingDays = Array.from({ length: nextPaddingCount }, (_, i) => i + 1);

  const getDayAttendanceInfo = (day) => {
    const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return { status: 'Weekend', dotClass: 'dot-weekend', label: 'Weekly Off / Weekend' };
    }

    if (calYear === 2026 && calMonth === 9) {
      if (day === 15 || day === 16 || day === 23) {
        return { status: 'WFH', dotClass: 'dot-wfh', label: 'Work From Home' };
      }
      if (day === 10 || day === 28) {
        return { status: 'Leave', dotClass: 'dot-leave', label: 'Approved Leave' };
      }
      if (day === 29 || day === 30) {
        return { status: 'Absent', dotClass: 'dot-absent', label: 'Absent' };
      }
      if (day === 8) {
        return { status: 'Late', dotClass: 'dot-late', label: 'Late Arrival (09:25 AM)' };
      }
      return { status: 'Present', dotClass: 'dot-present', label: 'Present' };
    }

    const hash = (day * 13 + calMonth * 7) % 20;
    if (hash === 3 || hash === 9) {
      return { status: 'WFH', dotClass: 'dot-wfh', label: 'Work From Home' };
    }
    if (hash === 12) {
      return { status: 'Leave', dotClass: 'dot-leave', label: 'Approved Leave' };
    }
    if (hash === 17) {
      return { status: 'Absent', dotClass: 'dot-absent', label: 'Absent' };
    }
    return { status: 'Present', dotClass: 'dot-present', label: 'Present' };
  };

  // Status metrics
  const [todayStatus, setTodayStatus] = useState('Present');
  const [workingHours, setWorkingHours] = useState('6h 25m');
  const [monthPresentDays, setMonthPresentDays] = useState(18);
  const [totalWorkDays, setTotalWorkDays] = useState(26);
  const [leaveBalance, setLeaveBalance] = useState(12);

  // Screen 2: Calendar Selected Day details
  const [selectedDay, setSelectedDay] = useState({
    dateStr: '14 October 2026',
    dayNum: 14,
    status: 'Present',
    checkIn: '09:05 AM',
    checkOut: '05:30 PM',
    workHours: '8h 25m',
    location: 'Office (via QR)'
  });

  // Screen 3: WFH Requests
  const [wfhTab, setWfhTab] = useState('All');
  const [showNewWfhModal, setShowNewWfhModal] = useState(false);
  const [newWfhForm, setNewWfhForm] = useState({ date: '2026-10-25', reason: '' });
  const [wfhList, setWfhList] = useState([
    { id: 'WFH-01', date: '14 Oct 2026', reason: 'Family function', status: 'Pending', applied_on: '12 Oct 2026' },
    { id: 'WFH-02', date: '02 Oct 2026', reason: 'Personal work', status: 'Approved', applied_on: '28 Sep 2026' },
    { id: 'WFH-03', date: '18 Sep 2026', reason: 'Health issue', status: 'Approved', applied_on: '16 Sep 2026' },
    { id: 'WFH-04', date: '10 Sep 2026', reason: 'Official work', status: 'Rejected', applied_on: '08 Sep 2026' }
  ]);

  // Screen 4: Leave Requests
  const [leaveTab, setLeaveTab] = useState('All');
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [newLeaveForm, setNewLeaveForm] = useState({ leave_type: 'Casual Leave', from_date: '2026-10-28', to_date: '2026-10-29', days: 2, reason: '' });
  const [leaveList, setLeaveList] = useState([
    { id: 'LV-01', leave_type: 'Casual Leave', from: '20 Oct 2026', to: '21 Oct 2026', days: 2, reason: 'Personal work', status: 'Pending' },
    { id: 'LV-02', leave_type: 'Sick Leave', from: '05 Sep 2026', to: '05 Sep 2026', days: 1, reason: 'Fever', status: 'Approved' },
    { id: 'LV-03', leave_type: 'Earned Leave', from: '12 Aug 2026', to: '14 Aug 2026', days: 3, reason: 'Family function', status: 'Approved' },
    { id: 'LV-04', leave_type: 'Casual Leave', from: '01 Jul 2026', to: '02 Jul 2026', days: 2, reason: 'Personal', status: 'Rejected' }
  ]);

  // Working Functionality States for View Report, Export, and Action Menus
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFilter, setReportFilter] = useState('All');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Close contextual action menu on click outside
  useEffect(() => {
    const handleOutside = () => setOpenActionMenuId(null);
    if (openActionMenuId) {
      window.addEventListener('click', handleOutside);
    }
    return () => window.removeEventListener('click', handleOutside);
  }, [openActionMenuId]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Profile DP (Display Picture) & Documents Management State
  const avatarFileInputRef = useRef(null);
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);

  useEffect(() => {
    try {
      const cachedAvatar = localStorage.getItem('vorldx_user_avatar');
      if (cachedAvatar) {
        setCurrentUser(prev => ({ ...prev, avatar: cachedAvatar }));
      }
    } catch (e) {}
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      triggerToast('⚠️ Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setCurrentUser(prev => ({ ...prev, avatar: base64 }));
      try {
        localStorage.setItem('vorldx_user_avatar', base64);
      } catch (err) {}
      playPunchChime();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      triggerToast('✓ Profile picture (DP) updated successfully!');
      setShowAvatarPickerModal(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const PRESET_AVATARS = [
    { name: 'Default Corporate', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
    { name: 'Executive Leader', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
    { name: 'Senior Engineer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' },
    { name: 'Product Specialist', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
    { name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80' },
    { name: 'Creative Designer', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80' }
  ];

  const handleSelectPresetAvatar = (url, name) => {
    setCurrentUser(prev => ({ ...prev, avatar: url }));
    try {
      localStorage.setItem('vorldx_user_avatar', url);
    } catch (err) {}
    playPunchChime();
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    triggerToast(`✓ Profile picture updated to ${name}!`);
    setShowAvatarPickerModal(false);
  };

  // Employee KYC & Compliance Documents State
  const [employeeDocs, setEmployeeDocs] = useState([
    {
      id: 'doc-aadhaar',
      title: 'National ID Card (Aadhaar)',
      filename: 'Aadhaar_Card_RohitS.pdf',
      size: '1.4 MB',
      uploadedAt: '12 Jan 2024',
      status: 'Verified',
      type: 'National ID (Aadhaar)',
      verifiedDate: '14 Jan 2024 by HR Compliance'
    },
    {
      id: 'doc-pan',
      title: 'PAN Card Copy',
      filename: 'PAN_Card_RohitS.pdf',
      size: '820 KB',
      uploadedAt: '12 Jan 2024',
      status: 'Verified',
      type: 'PAN Tax Card',
      verifiedDate: '14 Jan 2024 by Finance Team'
    },
    {
      id: 'doc-offer',
      title: 'Offer Letter & Employment Agreement',
      filename: 'VorldX_Employment_Contract_Signed.pdf',
      size: '2.8 MB',
      uploadedAt: '15 Jan 2024',
      status: 'Verified',
      type: 'Employment Contract',
      verifiedDate: '16 Jan 2024 by HR Operations'
    },
    {
      id: 'doc-degree',
      title: 'Degree Certificates',
      filename: 'BTech_Degree_Certificates.pdf',
      size: '3.6 MB',
      uploadedAt: '16 Jan 2024',
      status: 'Verified',
      type: 'Academic Degree',
      verifiedDate: '18 Jan 2024 by Background Verification'
    }
  ]);

  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
  const [newDocForm, setNewDocForm] = useState({
    title: 'Salary Slip / Bank Statement',
    customTitle: '',
    selectedFile: null
  });

  const handleSingleDocUpload = (docId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;
    const nowStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setEmployeeDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          filename: file.name,
          size: sizeStr,
          uploadedAt: nowStr,
          status: 'Uploaded',
          verifiedDate: 'Pending HR Review'
        };
      }
      return d;
    }));

    playPunchChime();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    triggerToast(`✓ "${file.name}" uploaded successfully!`);
    e.target.value = '';
  };

  const handleUploadNewDocSubmit = (e) => {
    e.preventDefault();
    const docTitle = newDocForm.title === 'Other' && newDocForm.customTitle.trim() 
      ? newDocForm.customTitle.trim() 
      : newDocForm.title;

    if (!newDocForm.selectedFile) {
      triggerToast('⚠️ Please select a file to upload');
      return;
    }

    const file = newDocForm.selectedFile;
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;
    const nowStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newDocItem = {
      id: `doc-${Date.now()}`,
      title: docTitle,
      filename: file.name,
      size: sizeStr,
      uploadedAt: nowStr,
      status: 'Uploaded',
      type: docTitle,
      verifiedDate: 'Pending HR Review'
    };

    setEmployeeDocs(prev => [newDocItem, ...prev]);
    setShowUploadDocModal(false);
    setNewDocForm({ title: 'Salary Slip / Bank Statement', customTitle: '', selectedFile: null });
    playPunchChime();
    confetti({ particleCount: 55, spread: 75, origin: { y: 0.6 } });
    triggerToast(`✓ Document "${docTitle}" uploaded successfully!`);
  };

  const handleDownloadDoc = (doc) => {
    const textContent = `=====================================================
VORLDX INDUSTRIES PVT LTD - OFFICIAL DOCUMENT
=====================================================
Document Name    : ${doc.title}
File Reference   : ${doc.filename || 'Document.pdf'}
File Size        : ${doc.size || '1.2 MB'}
Employee ID      : ${currentUser.id}
Employee Name    : ${currentUser.name}
Department       : ${currentUser.department}
Verification     : ${doc.status} (${doc.verifiedDate || 'Verified'})
Security Status  : AES-256 Encrypted & HR Verified
Timestamp        : ${doc.uploadedAt}
=====================================================`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.filename || `${doc.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`✓ Downloaded ${doc.title}`);
  };

  // Real Working Export Attendance CSV Handler
  const handleExportAttendanceStatement = () => {
    const header = ['Day', 'Date', 'Day of Week', 'Status', 'Check-In', 'Check-Out', 'Working Hours', 'Location', 'Employee ID', 'Employee Name'];
    const rows = [header];
    const daysCount = new Date(calYear, calMonth + 1, 0).getDate();

    for (let d = 1; d <= daysCount; d++) {
      const dateObj = new Date(calYear, calMonth, d);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const info = getDayAttendanceInfo(d);
      const checkIn = (info.status === 'Absent' || info.status === 'Weekend') ? '--' : '09:05 AM';
      const checkOut = (info.status === 'Absent' || info.status === 'Weekend') ? '--' : '05:30 PM';
      const workHours = (info.status === 'Absent' || info.status === 'Weekend') ? '0h 00m' : info.status === 'WFH' ? '8h 00m' : '8h 25m';
      const location = info.status === 'WFH' ? 'Remote (WFH)' : (info.status === 'Absent' || info.status === 'Weekend') ? 'N/A' : 'Office (via QR)';

      rows.push([
        d,
        `${d} ${MONTH_NAMES[calMonth]} ${calYear}`,
        dayName,
        info.status,
        checkIn,
        checkOut,
        workHours,
        location,
        currentUser.id,
        currentUser.name
      ]);
    }

    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance_Statement_${currentUser.name.replace(/\s+/g, '_')}_${MONTH_NAMES[calMonth]}_${calYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`✓ Attendance Statement for ${MONTH_NAMES[calMonth]} ${calYear} downloaded!`);
  };

  // Real Working Download Slip / Receipt Handler
  const handleDownloadSlip = (req) => {
    const isWfh = !req.leave_type;
    const slipText = `========================================================
           VORLDX ATTENDANCE & LEAVE CONFIRMATION SLIP
========================================================
Reference ID : ${req.id}
Generated On : ${new Date().toLocaleString()}
Employee ID  : ${currentUser.id}
Employee Name: ${currentUser.name}
Department   : ${currentUser.department}
Request Type : ${isWfh ? 'Work From Home (WFH)' : req.leave_type}
Dates        : ${isWfh ? req.date : `${req.from} to ${req.to} (${req.days} days)`}
Current Status: ${req.status.toUpperCase()}
Reason       : ${req.reason}
Applied On   : ${req.applied_on || req.from || '12 Oct 2026'}
Approver     : Amit Kumar (Manager - Operations)
Verification : SHA-256 DIGITAL TIMESTAMP VERIFIED
========================================================
Thank you for using VorldX Attendance 360 System.
`;
    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${req.id}_Confirmation_Slip.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`✓ Downloaded confirmation slip for ${req.id}`);
    setOpenActionMenuId(null);
  };

  // Real Working Withdraw Request Handler
  const handleWithdrawRequest = (reqId, type) => {
    if (type === 'wfh') {
      setWfhList(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Withdrawn' } : r));
    } else {
      setLeaveList(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Withdrawn' } : r));
    }
    triggerToast(`✓ Request ${reqId} has been withdrawn.`);
    setOpenActionMenuId(null);
    if (selectedRequestDetails && selectedRequestDetails.id === reqId) {
      setSelectedRequestDetails(prev => ({ ...prev, status: 'Withdrawn' }));
    }
  };

  // Real Working Delete Request Handler
  const handleDeleteRequest = (reqId, type) => {
    if (type === 'wfh') {
      setWfhList(prev => prev.filter(r => r.id !== reqId));
    } else {
      setLeaveList(prev => prev.filter(r => r.id !== reqId));
    }
    triggerToast(`✓ Request ${reqId} removed.`);
    setOpenActionMenuId(null);
    if (selectedRequestDetails && selectedRequestDetails.id === reqId) {
      setSelectedRequestDetails(null);
    }
  };

  // Screen 5: Profile & Password state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  // Screen 8: Leave History State & Handlers
  const [leaveHistoryRecords, setLeaveHistoryRecords] = useState([
    {
      id: 'LV-2026-104',
      type: 'Casual Leave',
      from: '24 Oct 2026',
      to: '25 Oct 2026',
      days: 2,
      status: 'Upcoming',
      reason: 'Personal family engagement in Kanpur',
      appliedOn: '18 Oct 2026 10:15 AM',
      approvedBy: 'Amit Kumar (Engineering Manager)',
      approvedAt: '18 Oct 2026 02:40 PM',
      category: 'Upcoming'
    },
    {
      id: 'LV-2026-103',
      type: 'Casual Leave',
      from: '10 Oct 2026',
      to: '12 Oct 2026',
      days: 2,
      status: 'Approved',
      reason: 'Personal Urgent Work',
      appliedOn: '08 Oct 2026 09:30 AM',
      approvedBy: 'Amit Kumar (Engineering Manager)',
      approvedAt: '08 Oct 2026 01:15 PM',
      category: 'Past'
    },
    {
      id: 'LV-2026-102',
      type: 'Sick Leave',
      from: '20 Sep 2026',
      to: '20 Sep 2026',
      days: 1,
      status: 'Approved',
      reason: 'Viral fever & medical doctor consultation',
      appliedOn: '20 Sep 2026 08:45 AM',
      approvedBy: 'Amit Kumar (Engineering Manager)',
      approvedAt: '20 Sep 2026 11:00 AM',
      category: 'Past'
    },
    {
      id: 'LV-2026-101',
      type: 'Earned Leave',
      from: '15 Aug 2026',
      to: '17 Aug 2026',
      days: 3,
      status: 'Approved',
      reason: 'Family Function & Out of Station travel',
      appliedOn: '10 Aug 2026 11:20 AM',
      approvedBy: 'Amit Kumar (Engineering Manager)',
      approvedAt: '11 Aug 2026 04:00 PM',
      category: 'Past'
    },
    {
      id: 'LV-2026-098',
      type: 'WFH',
      from: '01 Aug 2026',
      to: '01 Aug 2026',
      days: 1,
      status: 'Approved',
      reason: 'Home internet installation & client support',
      appliedOn: '30 Jul 2026 04:10 PM',
      approvedBy: 'Amit Kumar (Engineering Manager)',
      approvedAt: '31 Jul 2026 10:00 AM',
      category: 'Past'
    },
    {
      id: 'LV-2026-095',
      type: 'Casual Leave',
      from: '10 Jul 2026',
      to: '11 Jul 2026',
      days: 2,
      status: 'Canceled',
      reason: 'Trip postponed due to client release milestone',
      appliedOn: '05 Jul 2026 03:00 PM',
      approvedBy: 'Self (Withdrawn by Employee)',
      approvedAt: '07 Jul 2026 11:30 AM',
      category: 'Past'
    }
  ]);
  const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);

  const handleDownloadLeaveSlip = (leave) => {
    const content = `=====================================================
VORLDX INDUSTRIES PVT LTD - OFFICIAL LEAVE SLIP
CIN: U62099UP2026PTC245598 | Lucknow HQ Campus
=====================================================
Leave Application ID : ${leave.id}
Employee Name        : ${currentUser.name}
Employee ID          : ${currentUser.id}
Department           : ${currentUser.department}
Leave Type           : ${leave.type}
Duration             : ${leave.from} to ${leave.to} (${leave.days} Working Day${leave.days > 1 ? 's' : ''})
Status               : ${leave.status.toUpperCase()}
Reason for Leave     : ${leave.reason}
Applied Timestamp    : ${leave.appliedOn || '18 Oct 2026 10:15 AM'}
Approved By          : ${leave.approvedBy || 'Amit Kumar (Engineering Manager)'}
Approval Timestamp   : ${leave.approvedAt || '18 Oct 2026 02:40 PM'}
Security Verification: SHA-256 Digitally Signed & HR Approved
=====================================================
Notice: This document is an official record generated from
the VorldX Attendance 360 Enterprise Portal.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VorldX_Leave_Slip_${leave.id}_${currentUser.name.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`✓ Downloaded Leave Slip for ${leave.id}`);
  };

  // Screen 9: Team Calendar State
  const [teamCalWeekIdx, setTeamCalWeekIdx] = useState(2); // Week 3 by default
  const [teamCalSelectedDay, setTeamCalSelectedDay] = useState(16); // Day 16 default

  const teamWeeks = [
    { label: 'Week 1', dateRange: '01 Oct – 07 Oct 2026', days: [1, 2, 3, 4, 5, 6, 7] },
    { label: 'Week 2', dateRange: '08 Oct – 14 Oct 2026', days: [8, 9, 10, 11, 12, 13, 14] },
    { label: 'Week 3', dateRange: '15 Oct – 21 Oct 2026', days: [15, 16, 17, 18, 19, 20, 21] },
    { label: 'Week 4', dateRange: '22 Oct – 28 Oct 2026', days: [22, 23, 24, 25, 26, 27, 28] },
    { label: 'Week 5', dateRange: '29 Oct – 31 Oct 2026', days: [29, 30, 31] }
  ];

  // Screen 10: Notifications State & Real Filters
  const [notifTab, setNotifTab] = useState('All');
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      category: 'WFH',
      title: 'WFH request approved',
      desc: 'Your WFH request for 14 Oct 2026 has been approved by HR.',
      time: '13 Oct 05:30 PM',
      color: '#2563eb',
      icon: Home,
      bg: 'rgba(37, 99, 235, 0.15)',
      isUnread: true,
      actionModule: 'apply-wfh'
    },
    {
      id: 2,
      category: 'Leaves',
      title: 'Leave request submitted',
      desc: 'Your leave request for 10 Oct 2026 is under review.',
      time: '10 Oct 11:30 AM',
      color: '#7c3aed',
      icon: FileText,
      bg: 'rgba(168, 85, 247, 0.15)',
      isUnread: true,
      actionModule: 'leave-history'
    },
    {
      id: 3,
      category: 'Company',
      title: 'Policy Update',
      desc: 'New work from home policy is now live. Please review.',
      time: '08 Oct 04:30 PM',
      color: '#0891b2',
      icon: ShieldCheck,
      bg: 'rgba(56, 189, 248, 0.15)',
      isUnread: false,
      actionModule: 'policies'
    },
    {
      id: 4,
      category: 'Reminders',
      title: 'Attendance Reminder',
      desc: "Please don't forget to mark your check out today before 07:00 PM.",
      time: '08 Oct 06:00 PM',
      color: '#d97706',
      icon: Bell,
      bg: 'rgba(245, 158, 11, 0.15)',
      isUnread: true,
      actionModule: 'mark-attendance'
    },
    {
      id: 5,
      category: 'Reminders',
      title: 'Timesheet Submission Deadline',
      desc: 'Monthly timesheet regularization deadline is 25th of this month.',
      time: '08 Oct 10:00 AM',
      color: '#d97706',
      icon: Clock,
      bg: 'rgba(245, 158, 11, 0.15)',
      isUnread: true,
      actionModule: 'reports'
    },
    {
      id: 6,
      category: 'Attendance',
      title: 'QR Code Attendance Punched',
      desc: 'Check-in recorded successfully at 09:05 AM via HQ Entrance Kiosk.',
      time: '08 Oct 09:05 AM',
      color: '#10b981',
      icon: CheckCircle,
      bg: 'rgba(16, 185, 129, 0.15)',
      isUnread: false,
      actionModule: 'my-attendance'
    },
    {
      id: 7,
      category: 'Attendance',
      title: 'Missed Punch Regularized',
      desc: 'Your check-out regularized request for 05 Oct 2026 was approved.',
      time: '06 Oct 03:20 PM',
      color: '#10b981',
      icon: CheckCircle,
      bg: 'rgba(16, 185, 129, 0.15)',
      isUnread: false,
      actionModule: 'my-attendance'
    },
    {
      id: 8,
      category: 'Company',
      title: 'Team Meeting',
      desc: 'Project review meeting scheduled at 11:00 AM with Amit Kumar.',
      time: '07 Oct 05:00 PM',
      color: '#2563eb',
      icon: Users,
      bg: 'rgba(37, 99, 235, 0.15)',
      isUnread: false,
      actionModule: 'team-calendar'
    }
  ]);

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    setNotificationsList(prev => prev.filter(n => n.id !== id));
    triggerToast('✓ Notification dismissed');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, isUnread: false })));
    triggerToast('✓ All notifications marked as read');
  };

  const handleDownloadPolicy = (policy) => {
    const content = `=====================================================
VORLDX INDUSTRIES PVT LTD - CORPORATE POLICY DOCUMENT
CIN: U62099UP2026PTC245598 | Lucknow HQ Campus
=====================================================
Policy Title     : ${policy.title}
Category         : ${policy.category} Policy
Effective Date   : ${policy.date}
Document Version : v3.2 (Active Enterprise Governance)
=====================================================
1. OBJECTIVE & SCOPE
This corporate policy governs operational standards, compliance protocols,
and employee obligations at VorldX Technologies Private Limited.

2. CORE POLICY STATEMENT
${policy.desc}

3. COMPLIANCE & GOVERNANCE RULES
- All full-time employees, contractors, and partners must strictly adhere to these protocols.
- Any exception must obtain written authorization from the Department Head & HR Director.
- Routine statutory audits are conducted quarterly by VorldX Legal & Internal Audit.

4. INQUIRIES & GRIEVANCES
For questions regarding this policy, contact hr.compliance@vorldx.com.
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VorldX_Policy_${policy.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`✓ Downloaded ${policy.title}`);
  };

  // Interactive Punch / QR Modal
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [punchAction, setPunchAction] = useState('Check In');

  // Handle Mark Attendance
  const handlePerformPunch = () => {
    playPunchChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTodayStatus('Present');
    setShowPunchModal(false);
    alert(`Success! Attendance marked (${punchAction}) at 09:05 AM.`);
  };

  // Handle new WFH request
  const handleCreateWfh = (e) => {
    e.preventDefault();
    const created = {
      id: `WFH-0${wfhList.length + 1}`,
      date: newWfhForm.date,
      reason: newWfhForm.reason || 'Personal work',
      status: 'Pending',
      applied_on: '16 Oct 2026'
    };
    setWfhList([created, ...wfhList]);
    setShowNewWfhModal(false);
    alert('WFH Request submitted to HR queue!');
  };

  // Handle new Leave request
  const handleCreateLeave = (e) => {
    e.preventDefault();
    const created = {
      id: `LV-0${leaveList.length + 1}`,
      leave_type: newLeaveForm.leave_type,
      from: newLeaveForm.from_date,
      to: newLeaveForm.to_date,
      days: newLeaveForm.days || 1,
      reason: newLeaveForm.reason || 'Personal work',
      status: 'Pending'
    };
    setLeaveList([created, ...leaveList]);
    setShowNewLeaveModal(false);
    alert('Leave Request submitted to HR queue!');
  };

  // Handle Profile Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: editProfileForm.name,
      email: editProfileForm.email,
      phone: editProfileForm.phone
    });
    setShowEditProfileModal(false);
    alert('Profile updated successfully!');
  };

  // Handle Password Update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next) {
      alert('Please fill out password fields');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    setPasswordForm({ current: '', next: '', confirm: '' });
    alert('Password updated securely!');
  };

  // 12 Sidebar Navigation items matching the 12 UI screens
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'attendance', label: 'My Attendance', icon: Calendar },
    { id: 'mark-attendance', label: 'Mark Attendance', icon: QrCode },
    { id: 'apply-wfh', label: 'Apply WFH', icon: Home, badge: 2 },
    { id: 'apply-leave', label: 'Apply Leave', icon: FileText, badge: 1 },
    { id: 'reports', label: 'Attendance Reports', icon: BarChart3 },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'leave-history', label: 'Leave History', icon: FileCheck },
    { id: 'team-calendar', label: 'Team Calendar', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
    { id: 'policies', label: 'Company Policies', icon: ShieldCheck },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  // 12 Quick Switcher Screens matching user mockup
  const quickScreens = [
    { id: 'dashboard', num: '1', label: 'Employee Dashboard (Home)' },
    { id: 'attendance', num: '2', label: 'My Attendance' },
    { id: 'mark-attendance', num: '3', label: 'Mark Attendance (Check In/Out)' },
    { id: 'apply-wfh', num: '4', label: 'Apply WFH' },
    { id: 'apply-leave', num: '5', label: 'Apply Leave' },
    { id: 'reports', num: '6', label: 'View Attendance Reports' },
    { id: 'profile', num: '7', label: 'My Profile' },
    { id: 'leave-history', num: '11', label: 'Leave History' },
    { id: 'team-calendar', num: '9', label: 'Team Calendar' },
    { id: 'notifications', num: '10', label: 'Notifications' },
    { id: 'policies', num: '11', label: 'Company Policies' },
    { id: 'help', num: '12', label: 'Help & Support' }
  ];

  return (
    <div className="employee-portal-root">
      {/* =====================================================================
          SIDEBAR (10 MODULES MATCHING MOCKUP)
         ===================================================================== */}
      <aside className="employee-sidebar">
        <div>
          {/* Brand Header */}
          <div className="employee-sidebar-logo">
            <div className="employee-logo-row">
              <div className="employee-logo-icon">
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div className="employee-brand-title">
                World<span>X</span>
              </div>
              <span className="employee-badge-360">ATTENDANCE 360</span>
            </div>
            <div className="employee-sidebar-tagline">Work Smart. Grow Together.</div>
          </div>

          {/* Navigation Items */}
          <nav className="employee-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`employee-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="employee-nav-left">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span
                      className="employee-badge-pill"
                      style={{
                        background: item.id === 'notifications' ? '#ef4444' : '#f59e0b',
                        color: '#ffffff',
                        border: 'none',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Motivational Trophy Card + Logout */}
        <div className="employee-sidebar-footer">
          <div className="employee-sidebar-trophy-card">
            <div className="employee-trophy-icon-wrap">
              🏆
            </div>
            <div>
              <div className="employee-trophy-title">You're doing great!</div>
              <div className="employee-trophy-sub">Keep up the good work!</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="employee-logout-btn"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MAIN CONTENT AREA
         ===================================================================== */}
      <div className="employee-main-wrap">
        {/* TOP BAR */}
        <header className="employee-topbar">
          <div className="employee-search-wrapper">
            <Search size={15} className="employee-search-icon" color="#94a3b8" />
            <input
              type="text"
              placeholder="Search employees, attendance, requests..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="employee-search-input"
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, padding: '9px 8px', fontSize: '0.82rem', color: '#ffffff' }}
            />
            <span className="employee-search-badge-k">Ctrl + K</span>
          </div>

          <div className="employee-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Real Date Picker Popover */}
            <RealDatePickerPopover
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              selectedMonthYear={selectedMonth}
              onSelectMonthYear={(my) => setSelectedMonth(my)}
              align="right"
              showFullDate={true}
            />

            {/* Notification Bell */}
            <button
              className="employee-topbar-notif-btn"
              onClick={() => setActiveModule('notifications')}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="employee-notif-pill-count">5</span>
            </button>

            {/* Profile Pill: Rohit S. Employee ˇ */}
            <div className="employee-topbar-user" onClick={() => setActiveModule('profile')} title="My Profile">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="employee-topbar-user-avatar"
              />
              <div>
                <div className="employee-topbar-user-name">{currentUser.name}</div>
                <div className="employee-topbar-user-role">
                  <span>{currentUser.role || 'Employee'}</span>
                  <ChevronDown size={12} color="#64748b" />
                </div>
              </div>
            </div>
          </div>
        </header>

{/* 12-MODULE QUICK SWITCHER CHIP STRIP HIDDEN PER USER REQUEST */}

        {/* SCROLLABLE VIEWPORT */}
        <div className="employee-content-scroll">
          {/* =================================================================
              SCREEN 1: EMPLOYEE DASHBOARD
             ================================================================= */}
          {activeModule === 'dashboard' && (
            <div className="employee-dashboard-luminous-container">
              {/* Top Hero Welcome Card */}
              <div className="employee-luminous-hero">
                <div className="employee-luminous-hero-left">
                  <h1>
                    Hello, {currentUser.name}! <span role="img" aria-label="wave">👋</span>
                  </h1>
                  <p>Welcome back to WorldX Employee Portal</p>
                  <p className="hero-quote">“Success begins with consistent effort.”</p>
                </div>
                <div className="employee-luminous-hero-right">
                  <div className="employee-hero-badge">
                    <TrendingUp size={15} color="#2563eb" />
                    <span>Be Productive | Achieve More</span>
                  </div>
                  <img
                    src="/employee_hero.jpg"
                    alt="Productive Employee"
                    className="employee-hero-img"
                  />
                </div>
              </div>

              {/* 4 Status KPI Cards */}
              <div className="employee-luminous-kpi-grid">
                {/* 1. Today's Status */}
                <div className="employee-luminous-kpi-card">
                  <div className="employee-luminous-kpi-header">
                    <div className="employee-luminous-kpi-header-left">
                      <div className="employee-luminous-kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        <Calendar size={18} />
                      </div>
                      <span className="employee-luminous-kpi-label">Today's Status</span>
                    </div>
                  </div>
                  <div>
                    <div className="employee-luminous-kpi-val" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Present</span>
                      <CheckCircle size={20} color="#10b981" />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Checked in at {checkInTime || '09:05 AM'}
                    </div>
                  </div>
                  <div className="employee-luminous-kpi-footer">
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      ✓ On Time
                    </span>
                  </div>
                </div>

                {/* 2. Working Hours */}
                <div className="employee-luminous-kpi-card">
                  <div className="employee-luminous-kpi-header">
                    <div className="employee-luminous-kpi-header-left">
                      <div className="employee-luminous-kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#38bdf8' }}>
                        <Clock size={18} />
                      </div>
                      <span className="employee-luminous-kpi-label">Working Hours</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div className="employee-luminous-kpi-val">{workingHours || '6h 25m'}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                        Target: 8h 00m
                      </div>
                    </div>
                    {/* Circular 78% progress meter */}
                    <div style={{ position: 'relative', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="52" height="52" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3.5"
                          strokeDasharray="78, 100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span style={{ position: 'absolute', fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>78%</span>
                    </div>
                  </div>
                  <div className="employee-luminous-kpi-footer">
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Updated real-time</span>
                  </div>
                </div>

                {/* 3. Present This Month */}
                <div className="employee-luminous-kpi-card">
                  <div className="employee-luminous-kpi-header">
                    <div className="employee-luminous-kpi-header-left">
                      <div className="employee-luminous-kpi-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a855f7' }}>
                        <Calendar size={18} />
                      </div>
                      <span className="employee-luminous-kpi-label">Present This Month</span>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      background: '#ecfdf5',
                      color: '#10b981',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      ↑ +2%
                    </span>
                  </div>
                  <div>
                    <div className="employee-luminous-kpi-val">18 / 26 days</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      69% Attendance Rate
                    </div>
                  </div>
                  <div className="employee-luminous-kpi-footer">
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '69%', height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>

                {/* 4. Leave Balance */}
                <div className="employee-luminous-kpi-card">
                  <div className="employee-luminous-kpi-header">
                    <div className="employee-luminous-kpi-header-left">
                      <div className="employee-luminous-kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                        <Umbrella size={18} />
                      </div>
                      <span className="employee-luminous-kpi-label">Leave Balance</span>
                    </div>
                  </div>
                  <div>
                    <div className="employee-luminous-kpi-val">12 days</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      Available for this year
                    </div>
                  </div>
                  <div className="employee-luminous-kpi-footer">
                    <button
                      onClick={() => setActiveModule('apply-leave')}
                      style={{
                        border: 'none',
                        background: 'none',
                        padding: 0,
                        color: '#d97706',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle 3-Column Grid */}
              <div className="employee-luminous-mid-grid">
                {/* 1. Attendance Overview Chart (Fully Interactive & Dynamic) */}
                <div className="employee-luminous-card">
                  <div className="employee-luminous-card-header">
                    <h3 className="employee-luminous-card-title">
                      <BarChart3 size={17} color="#2563eb" />
                      <span>Attendance Overview</span>
                    </h3>
                    <div className="employee-chart-tabs">
                      {['This Month', 'Last 3 Months', 'Last 6 Months'].map(range => (
                        <button
                          key={range}
                          onClick={() => {
                            setChartRange(range);
                            const target = chartDataByRange[range];
                            const highlight = target.bars.find(b => b.isHighlight) || target.bars[target.bars.length - 1];
                            setHoveredBar(highlight.label);
                          }}
                          className={`employee-chart-tab ${chartRange === range ? 'active' : ''}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const activeData = chartDataByRange[chartRange] || chartDataByRange['This Month'];
                    const curvePath = getSmoothSvgPath(activeData.bars);
                    const activeIndex = activeData.bars.findIndex(b => b.label === hoveredBar);
                    const selectedIndex = activeIndex >= 0 ? activeIndex : activeData.bars.findIndex(b => b.isHighlight);
                    const step = 350 / activeData.bars.length;
                    const dotX = (selectedIndex >= 0 ? selectedIndex + 0.5 : 0.5) * step;
                    const dotY = selectedIndex >= 0 ? 125 - (activeData.bars[selectedIndex].height / 100) * 80 : 50;

                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            View: <strong style={{ color: '#ffffff' }}>{activeData.metricLabel}</strong>
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                            {activeData.summaryBadge}
                          </span>
                        </div>

                        <div className="employee-luminous-chart-wrap">
                          <div className="employee-luminous-y-axis">
                            {activeData.yAxis.map((yVal, idx) => (
                              <span key={idx}>{yVal}</span>
                            ))}
                          </div>

                          <div className="employee-luminous-bars-area">
                            {/* Dynamic SVG Trendline Wave */}
                            <svg
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                overflow: 'visible'
                              }}
                              viewBox="0 0 350 140"
                              preserveAspectRatio="none"
                            >
                              <path
                                d={curvePath}
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                              <circle cx={dotX} cy={dotY} r="8" fill="rgba(16, 185, 129, 0.35)" />
                              <circle cx={dotX} cy={dotY} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                            </svg>

                            {/* Dynamic Bars with Hover Tooltip */}
                            {activeData.bars.map((bar) => {
                              const isSelected = hoveredBar === bar.label || (!hoveredBar && bar.isHighlight);
                              return (
                                <div
                                  key={bar.label}
                                  className="employee-luminous-bar-item"
                                  onMouseEnter={() => setHoveredBar(bar.label)}
                                  onClick={() => setHoveredBar(bar.label)}
                                >
                                  {isSelected && (
                                    <div className="employee-chart-tooltip" style={{ minWidth: '120px', zIndex: 10, textAlign: 'center' }}>
                                      <span className="employee-chart-tooltip-date" style={{ fontWeight: 800 }}>{bar.label}</span>
                                      <span className="employee-chart-tooltip-status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.72rem' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: bar.height >= 75 ? '#10b981' : '#f59e0b' }} />
                                        {bar.status}
                                      </span>
                                      {bar.detail && (
                                        <span style={{ fontSize: '0.62rem', color: '#94a3b8', display: 'block', marginTop: '2px', whiteSpace: 'nowrap' }}>
                                          {bar.detail}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <div
                                    className="employee-luminous-bar-fill"
                                    style={{
                                      height: `${bar.height}%`,
                                      background: isSelected
                                        ? 'linear-gradient(180deg, #38bdf8 0%, #2563eb 50%, #7c3aed 100%)'
                                        : 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 50%, #818cf8 100%)',
                                      boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.65)' : 'none',
                                      transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                  />
                                  <span className="employee-luminous-bar-date">{bar.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* 2. Quick Actions */}
                <div className="employee-luminous-card">
                  <div className="employee-luminous-card-header">
                    <h3 className="employee-luminous-card-title">
                      <Sparkles size={17} color="#f59e0b" />
                      <span>Quick Actions</span>
                    </h3>
                    <button className="employee-luminous-card-link" onClick={() => setActiveModule('mark-attendance')}>
                      View All →
                    </button>
                  </div>

                  <div className="employee-luminous-action-tiles" style={{ height: 'calc(100% - 40px)' }}>
                    {/* Mark Attendance */}
                    <div
                      className="employee-luminous-action-tile employee-action-tile-blue"
                      onClick={() => setShowPunchModal(true)}
                    >
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.2)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                      }}>
                        <Fingerprint size={22} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mark Attendance</span>
                    </div>

                    {/* Apply WFH Request */}
                    <div
                      className="employee-luminous-action-tile employee-action-tile-green"
                      onClick={() => setShowNewWfhModal(true)}
                    >
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
                      }}>
                        <Home size={20} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Apply WFH Request</span>
                    </div>

                    {/* Apply Leave Request */}
                    <div
                      className="employee-luminous-action-tile employee-action-tile-purple"
                      onClick={() => setShowNewLeaveModal(true)}
                    >
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)'
                      }}>
                        <Calendar size={20} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Apply Leave Request</span>
                    </div>
                  </div>
                </div>

                {/* 3. Upcoming Events */}
                <div className="employee-luminous-card">
                  <div className="employee-luminous-card-header">
                    <h3 className="employee-luminous-card-title">
                      <Calendar size={17} color="#ec4899" />
                      <span>Upcoming Events</span>
                    </h3>
                    <button className="employee-luminous-card-link" onClick={() => setActiveModule('team-calendar')}>
                      View Calendar →
                    </button>
                  </div>

                  <div className="employee-luminous-events-list">
                    {/* Diwali Holiday */}
                    <div className="employee-luminous-event-row">
                      <div className="employee-luminous-event-left">
                        <div className="employee-luminous-event-icon" style={{ background: 'rgba(234, 88, 12, 0.15)', color: '#fb923c', fontSize: '1.1rem' }}>
                          🪔
                        </div>
                        <div>
                          <div className="employee-luminous-event-title">Diwali Holiday</div>
                          <div className="employee-luminous-event-date">20 Oct 2026 (Wed)</div>
                        </div>
                      </div>
                      <span className="employee-event-tag holiday">Holiday</span>
                    </div>

                    {/* Team Meeting */}
                    <div className="employee-luminous-event-row">
                      <div className="employee-luminous-event-left">
                        <div className="employee-luminous-event-icon" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#38bdf8' }}>
                          <Users size={16} />
                        </div>
                        <div>
                          <div className="employee-luminous-event-title">Team Meeting</div>
                          <div className="employee-luminous-event-date">22 Oct 2026 (Fri) • 11:00 AM</div>
                        </div>
                      </div>
                      <span className="employee-event-tag meeting">Meeting</span>
                    </div>

                    {/* Project Deadline */}
                    <div className="employee-luminous-event-row">
                      <div className="employee-luminous-event-left">
                        <div className="employee-luminous-event-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c084fc' }}>
                          <Hourglass size={16} />
                        </div>
                        <div>
                          <div className="employee-luminous-event-title">Project Deadline</div>
                          <div className="employee-luminous-event-date">28 Oct 2026 (Thu)</div>
                        </div>
                      </div>
                      <span className="employee-event-tag deadline">Deadline</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 3-Column Grid */}
              <div className="employee-luminous-bottom-grid">
                {/* 1. WFH & Leave Summary */}
                <div className="employee-luminous-card">
                  <div className="employee-luminous-card-header">
                    <h3 className="employee-luminous-card-title">
                      <Home size={17} color="#06b6d4" />
                      <span>WFH & Leave Summary</span>
                    </h3>
                    <button className="employee-luminous-card-link" onClick={() => setActiveModule('apply-wfh')}>
                      View All →
                    </button>
                  </div>

                  <div className="employee-donuts-row">
                    {/* Donut 1: WFH */}
                    <div className="employee-donut-card">
                      <div className="employee-donut-circle-wrap">
                        <svg width="78" height="78" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="3.5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="3.5"
                            strokeDasharray="65, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="employee-donut-count">3</span>
                      </div>
                      <span className="employee-donut-label">WFH Requests<br />This Month</span>
                    </div>

                    {/* Donut 2: Leave */}
                    <div className="employee-donut-card">
                      <div className="employee-donut-circle-wrap">
                        <svg width="78" height="78" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="3.5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="3.5"
                            strokeDasharray="30, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="employee-donut-count">1</span>
                      </div>
                      <span className="employee-donut-label">Leave Request<br />This Month</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="employee-status-legend-row">
                    <div className="employee-legend-dot-item">
                      <span className="dot" style={{ background: '#10b981' }} />
                      <span>Approved 2</span>
                    </div>
                    <div className="employee-legend-dot-item">
                      <span className="dot" style={{ background: '#f59e0b' }} />
                      <span>Pending 1</span>
                    </div>
                    <div className="employee-legend-dot-item">
                      <span className="dot" style={{ background: '#ef4444' }} />
                      <span>Rejected 0</span>
                    </div>
                  </div>
                </div>

                {/* 2. Your Performance */}
                <div className="employee-luminous-card">
                  <div className="employee-luminous-card-header">
                    <h3 className="employee-luminous-card-title">
                      <Trophy size={17} color="#eab308" />
                      <span>Your Performance</span>
                    </h3>
                    <button className="employee-luminous-card-link" onClick={() => setActiveModule('reports')}>
                      View Details →
                    </button>
                  </div>

                  <div className="employee-perf-container">
                    {/* Gauge */}
                    <div className="employee-gauge-side">
                      <div className="employee-gauge-arc-wrap">
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 10 50 A 40 40 0 0 1 85 30"
                            fill="none"
                            stroke="url(#perfGrad)"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="perfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="employee-gauge-pct">92%</span>
                      </div>
                      <span className="employee-gauge-label">Attendance<br />Performance</span>
                    </div>

                    {/* Details Side: Trend + Top Performer */}
                    <div className="employee-perf-details-side">
                      <div className="employee-perf-trend-badge">
                        <TrendingUp size={14} color="#16a34a" />
                        <span>+5%</span>
                        <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.68rem' }}>vs last month</span>
                      </div>

                      <div className="employee-top-performer-box">
                        <div className="employee-top-performer-title">
                          <Star size={14} fill="#7c3aed" color="#7c3aed" />
                          <span>Top Performer</span>
                        </div>
                        <span className="employee-top-performer-sub">Keep it up!</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Recent Activities */}
                <div className="employee-luminous-card">
                  <div className="employee-luminous-card-header">
                    <h3 className="employee-luminous-card-title">
                      <Sparkles size={17} color="#6366f1" />
                      <span>Recent Activities</span>
                    </h3>
                  </div>

                  <div className="employee-recent-activities-list">
                    {/* Activity 1 */}
                    <div className="employee-recent-activity-row">
                      <div className="employee-recent-activity-left">
                        <div className="employee-recent-activity-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                          <CheckCircle size={15} />
                        </div>
                        <div>
                          <div className="employee-recent-activity-title">Attendance marked</div>
                          <div className="employee-recent-activity-desc">Checked in at 09:05 AM</div>
                        </div>
                      </div>
                      <span className="employee-recent-activity-time">Today, 09:05 AM</span>
                    </div>

                    {/* Activity 2 */}
                    <div className="employee-recent-activity-row">
                      <div className="employee-recent-activity-left">
                        <div className="employee-recent-activity-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                          <Home size={15} />
                        </div>
                        <div>
                          <div className="employee-recent-activity-title">WFH request approved</div>
                          <div className="employee-recent-activity-desc">For 14 Oct 2026</div>
                        </div>
                      </div>
                      <span className="employee-recent-activity-time">13 Oct, 08:50 PM</span>
                    </div>

                    {/* Activity 3 */}
                    <div className="employee-recent-activity-row">
                      <div className="employee-recent-activity-left">
                        <div className="employee-recent-activity-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                          <FileText size={15} />
                        </div>
                        <div>
                          <div className="employee-recent-activity-title">Leave request submitted</div>
                          <div className="employee-recent-activity-desc">Casual Leave (2 days)</div>
                        </div>
                      </div>
                      <span className="employee-recent-activity-time">10 Oct, 11:20 AM</span>
                    </div>

                    {/* Activity 4 */}
                    <div className="employee-recent-activity-row">
                      <div className="employee-recent-activity-left">
                        <div className="employee-recent-activity-icon" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#38bdf8' }}>
                          <User size={15} />
                        </div>
                        <div>
                          <div className="employee-recent-activity-title">Profile updated</div>
                          <div className="employee-recent-activity-desc">Contact details changed</div>
                        </div>
                      </div>
                      <span className="employee-recent-activity-time">08 Oct, 04:15 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Company Announcement Strip */}
              <div className="employee-luminous-announcement-strip">
                <div className="employee-announcement-left">
                  <div className="employee-announcement-icon-bubble">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <div className="employee-announcement-title">Company Announcement</div>
                    <div className="employee-announcement-text">
                      Annual Health Checkup Camp is scheduled on 25th Oct 2026. Don't miss it!
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    className="employee-announcement-btn"
                    onClick={() => setShowAnnouncementModal(true)}
                  >
                    View Details →
                  </button>
                  <div style={{ color: '#a78bfa', fontSize: '1.2rem', letterSpacing: '2px', userSelect: 'none' }}>
                    •••
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 2: MY ATTENDANCE
             ================================================================= */}
          {activeModule === 'attendance' && (() => {
            // Helper calculation for Week View (7 days)
            const currentWeekStartDay = Math.max(1, Math.min(daysInCurrentMonth - 6, 11 + (calWeekOffset * 7)));
            const weekDays = Array.from({ length: 7 }, (_, i) => {
              const dayNum = currentWeekStartDay + i;
              const dateObj = new Date(calYear, calMonth, dayNum);
              const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
              const att = getDayAttendanceInfo(dayNum);
              const isSel = selectedDay.dayNum === dayNum && selectedDay.dateStr.includes(MONTH_NAMES[calMonth]);
              return { dayNum, dayName, att, isSel, dateObj };
            });

            // Helper calculation for List View
            const allMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(calYear, calMonth, dayNum);
              const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
              const att = getDayAttendanceInfo(dayNum);
              const isSel = selectedDay.dayNum === dayNum && selectedDay.dateStr.includes(MONTH_NAMES[calMonth]);
              return { dayNum, dayName, att, isSel, dateObj };
            });

            const filteredListDays = allMonthDays.filter(item => {
              if (attendanceListFilter === 'All') return true;
              if (attendanceListFilter === 'Weekend') return item.att.status === 'Weekend';
              return item.att.status === attendanceListFilter;
            });

            const statusColorMap = {
              Present: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' },
              WFH: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' },
              Leave: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' },
              Absent: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' },
              Late: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' },
              Weekend: { bg: 'rgba(255, 255, 255, 0.05)', text: '#64748b', border: '1px solid rgba(255, 255, 255, 0.08)' }
            };

            return (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '20px' }}>
                <div>
                  <h1 className="employee-header-title">My Attendance</h1>
                  <p className="employee-header-desc">View, track and manage your daily attendance records in Month, Week or List mode.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="employee-btn-primary" onClick={handleExportAttendanceStatement} title="Download CSV Attendance Report">
                    <Download size={15} />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>

              {/* Top 2-Column: Calendar / Week / List Card + Selected Date & Metrics Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.28fr 0.92fr', gap: '20px', marginBottom: '22px' }}>
                {/* Left Card: Month / Week / List Switchable View */}
                <div className="employee-calendar-card" style={{ background: '#0d1527', borderRadius: '18px', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                  
                  {/* Top Switcher Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {attendanceViewTab === 'Month' && (
                        <>
                          <button className="employee-cal-nav-btn" onClick={handleCalPrevMonth} title="Previous Month">
                            <ChevronLeft size={16} />
                          </button>
                          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            {MONTH_NAMES[calMonth]} {calYear}
                          </h3>
                          <button className="employee-cal-nav-btn" onClick={handleCalNextMonth} title="Next Month">
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {attendanceViewTab === 'Week' && (
                        <>
                          <button className="employee-cal-nav-btn" onClick={() => setCalWeekOffset(prev => prev - 1)} title="Previous Week">
                            <ChevronLeft size={16} />
                          </button>
                          <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            Week of {weekDays[0].dayNum} {MONTH_NAMES[calMonth].slice(0, 3)} – {weekDays[6].dayNum} {MONTH_NAMES[calMonth].slice(0, 3)} {calYear}
                          </h3>
                          <button className="employee-cal-nav-btn" onClick={() => setCalWeekOffset(prev => prev + 1)} title="Next Week">
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {attendanceViewTab === 'List' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            {MONTH_NAMES[calMonth]} {calYear} Attendance Log
                          </h3>
                          <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                            {filteredListDays.length} records
                          </span>
                        </div>
                      )}
                    </div>

                    {/* View Switcher Pills */}
                    <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '10px' }}>
                      {['Month', 'Week', 'List'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => setAttendanceViewTab(mode)}
                          style={{
                            border: 'none',
                            padding: '5px 14px',
                            borderRadius: '8px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: attendanceViewTab === mode ? '#2563eb' : 'transparent',
                            color: attendanceViewTab === mode ? '#ffffff' : '#64748b',
                            boxShadow: attendanceViewTab === mode ? '0 2px 10px rgba(37, 99, 235, 0.4)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ================= VIEW 1: MONTH VIEW ================= */}
                  {attendanceViewTab === 'Month' && (
                    <div>
                      <div className="employee-cal-weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                      </div>

                      <div className="employee-cal-days-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                        {prevPaddingDays.map((d, idx) => (
                          <div key={`prev-${idx}`} style={{ padding: '8px 4px', textAlign: 'center', borderRadius: '8px', color: '#475569', fontSize: '0.78rem' }}>
                            {d}
                          </div>
                        ))}

                        {Array.from({ length: daysInCurrentMonth }, (_, i) => {
                          const day = i + 1;
                          const att = getDayAttendanceInfo(day);
                          const isSelected = selectedDay.dayNum === day && selectedDay.dateStr.includes(MONTH_NAMES[calMonth]);
                          const dotColors = {
                            Present: '#10b981',
                            WFH: '#0284c7',
                            Leave: '#8b5cf6',
                            Absent: '#ef4444',
                            Late: '#f59e0b',
                            Weekend: 'transparent'
                          };
                          return (
                            <div
                              key={day}
                              onClick={() => setSelectedDay({
                                dateStr: `${day} ${MONTH_NAMES[calMonth]} ${calYear}`,
                                dayNum: day,
                                status: att.status,
                                checkIn: att.status === 'Absent' || att.status === 'Weekend' ? '--' : '09:05 AM',
                                checkOut: att.status === 'Absent' || att.status === 'Weekend' ? '--' : '05:32 PM',
                                workHours: att.status === 'Absent' || att.status === 'Weekend' ? '0h 00m' : att.status === 'WFH' ? '8h 00m' : '8h 27m',
                                location: att.status === 'WFH' ? 'Remote (Home)' : att.status === 'Absent' || att.status === 'Weekend' ? 'N/A' : 'Office'
                              })}
                              style={{
                                padding: '8px 4px',
                                textAlign: 'center',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: isSelected ? 800 : 600,
                                background: isSelected 
                                  ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' 
                                  : 'rgba(255, 255, 255, 0.03)',
                                border: isSelected 
                                  ? '1.5px solid #38bdf8' 
                                  : '1px solid rgba(255, 255, 255, 0.06)',
                                color: isSelected ? '#ffffff' : '#f1f5f9',
                                boxShadow: isSelected ? '0 0 14px rgba(37, 99, 235, 0.5)' : 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span>{day}</span>
                              {att.status !== 'Weekend' && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColors[att.status] || '#10b981' }} />
                              )}
                            </div>
                          );
                        })}

                        {nextPaddingDays.map((d, idx) => (
                          <div key={`next-${idx}`} style={{ padding: '8px 4px', textAlign: 'center', borderRadius: '8px', color: '#475569', fontSize: '0.78rem' }}>
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Legend matching screenshot */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Present</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} /> WFH</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} /> Leave</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Absent</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Half Day</span>
                      </div>
                    </div>
                  )}

                  {/* ================= VIEW 2: WEEK VIEW ================= */}
                  {attendanceViewTab === 'Week' && (
                    <div>
                      <div className="employee-week-grid" style={{ marginBottom: '16px' }}>
                        {weekDays.map(item => {
                          const cfg = statusColorMap[item.att.status] || statusColorMap.Present;
                          return (
                            <div
                              key={item.dayNum}
                              className={`employee-week-card ${item.isSel ? 'active' : ''}`}
                              onClick={() => setSelectedDay({
                                dateStr: `${item.dayNum} ${MONTH_NAMES[calMonth]} ${calYear}`,
                                dayNum: item.dayNum,
                                status: item.att.status,
                                checkIn: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : '09:05 AM',
                                checkOut: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : '05:32 PM',
                                workHours: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '0h 00m' : item.att.status === 'WFH' ? '8h 00m' : '8h 27m',
                                location: item.att.status === 'WFH' ? 'Remote (Home)' : item.att.status === 'Absent' || item.att.status === 'Weekend' ? 'N/A' : 'Office'
                              })}
                            >
                              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>{item.dayName}</span>
                              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: item.isSel ? '#38bdf8' : '#ffffff' }}>{item.dayNum}</span>
                              
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                background: cfg.bg,
                                color: cfg.text,
                                border: cfg.border,
                                whiteSpace: 'nowrap'
                              }}>
                                ● {item.att.status}
                              </span>

                              <div style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px', fontSize: '0.68rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>{item.att.status === 'Weekend' ? 'Weekly Off' : item.att.status === 'Absent' ? '--' : '09:05 AM'}</span>
                                <span style={{ color: item.att.status === 'Weekend' || item.att.status === 'Absent' ? '#64748b' : '#38bdf8', fontWeight: 700 }}>
                                  {item.att.status === 'Weekend' || item.att.status === 'Absent' ? '0h 00m' : '8h 27m'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Weekly Summary Strip */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{ color: '#94a3b8' }}>Week Hours: <strong style={{ color: '#ffffff' }}>42h 15m</strong></span>
                          <span style={{ color: '#94a3b8' }}>Days Worked: <strong style={{ color: '#10b981' }}>5 / 5</strong></span>
                          <span style={{ color: '#94a3b8' }}>Overtime: <strong style={{ color: '#38bdf8' }}>2h 15m</strong></span>
                        </div>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Target Achieved</span>
                      </div>
                    </div>
                  )}

                  {/* ================= VIEW 3: LIST VIEW ================= */}
                  {attendanceViewTab === 'List' && (
                    <div>
                      {/* Filter Pills */}
                      <div className="employee-list-filter-strip">
                        {['All', 'Present', 'WFH', 'Leave', 'Absent', 'Weekend'].map(f => (
                          <button
                            key={f}
                            className={`employee-list-filter-btn ${attendanceListFilter === f ? 'active' : ''}`}
                            onClick={() => setAttendanceListFilter(f)}
                          >
                            {f}
                          </button>
                        ))}
                      </div>

                      {/* Scrollable List Table */}
                      <div className="employee-list-view-container">
                        <table className="employee-table" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Check In</th>
                              <th>Check Out</th>
                              <th>Work Hours</th>
                              <th>Location</th>
                              <th>Select</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredListDays.map(item => {
                              const cfg = statusColorMap[item.att.status] || statusColorMap.Present;
                              const isSel = item.isSel;
                              return (
                                <tr
                                  key={item.dayNum}
                                  onClick={() => setSelectedDay({
                                    dateStr: `${item.dayNum} ${MONTH_NAMES[calMonth]} ${calYear}`,
                                    dayNum: item.dayNum,
                                    status: item.att.status,
                                    checkIn: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : '09:05 AM',
                                    checkOut: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : '05:32 PM',
                                    workHours: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '0h 00m' : item.att.status === 'WFH' ? '8h 00m' : '8h 27m',
                                    location: item.att.status === 'WFH' ? 'Remote (Home)' : item.att.status === 'Absent' || item.att.status === 'Weekend' ? 'N/A' : 'Office'
                                  })}
                                  style={{
                                    background: isSel ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease'
                                  }}
                                >
                                  <td style={{ fontWeight: 700, color: '#ffffff' }}>
                                    {item.dayNum} {MONTH_NAMES[calMonth].slice(0, 3)} {calYear} <span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 500 }}>({item.dayName})</span>
                                  </td>
                                  <td>
                                    <span style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 9px',
                                      borderRadius: '20px',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      background: cfg.bg,
                                      color: cfg.text,
                                      border: cfg.border
                                    }}>
                                      ● {item.att.status}
                                    </span>
                                  </td>
                                  <td>{item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : '09:05 AM'}</td>
                                  <td>{item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : '05:32 PM'}</td>
                                  <td style={{ fontWeight: 700, color: item.att.status === 'Absent' || item.att.status === 'Weekend' ? '#64748b' : '#38bdf8' }}>
                                    {item.att.status === 'Absent' || item.att.status === 'Weekend' ? '0h 00m' : '8h 27m'}
                                  </td>
                                  <td>{item.att.status === 'WFH' ? 'Home' : item.att.status === 'Absent' || item.att.status === 'Weekend' ? '--' : 'Office'}</td>
                                  <td>
                                    <button
                                      className="employee-btn-action"
                                      style={{
                                        padding: '4px 10px',
                                        fontSize: '0.72rem',
                                        background: isSel ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                                        color: isSel ? '#ffffff' : '#94a3b8'
                                      }}
                                    >
                                      {isSel ? 'Active' : 'View'}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right: Selected Date Details + 5 Metrics Summary Boxes + Donut Attendance Rate */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Selected Date Details Card (Exact Reference Design Match) */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px 22px', border: '1px solid rgba(56, 189, 248, 0.3)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                        {selectedDay.dateStr}
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        background: (statusColorMap[selectedDay.status] || statusColorMap.Present).bg,
                        color: (statusColorMap[selectedDay.status] || statusColorMap.Present).text,
                        border: (statusColorMap[selectedDay.status] || statusColorMap.Present).border
                      }}>
                        ● {selectedDay.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Check In:</span>
                        <strong style={{ color: '#ffffff' }}>{selectedDay.checkIn}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} /> Check Out:</span>
                        <strong style={{ color: '#ffffff' }}>{selectedDay.checkOut}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c084fc' }} /> Working Hours:</span>
                        <strong style={{ color: '#38bdf8' }}>{selectedDay.workHours}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24' }} /> Location:</span>
                        <strong style={{ color: '#ffffff' }}>{selectedDay.location}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 5 Metrics Summary Boxes + Donut */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total Working Days</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>26</div>
                      </div>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Present Days</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>20</div>
                      </div>
                      <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>WFH Days</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>3</div>
                      </div>
                      <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 700 }}>Leave Days</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>2</div>
                      </div>
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)', gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 700 }}>Absent Days</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>1</div>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Rate Circular Donut Meter */}
                    <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                      <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="70" height="70" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="4" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="76, 100" strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>76%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>Attendance Rate</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Great attendance record this month!</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom: Daily Attendance Log Table matching screenshot */}
              <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Daily Attendance Log</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Showing recent 5 entries</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="employee-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Status</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>14 Oct 2026</td>
                        <td>09:05 AM</td>
                        <td>05:32 PM</td>
                        <td style={{ fontWeight: 600 }}>8h 27m</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>● Present</span></td>
                        <td>Office</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>13 Oct 2026</td>
                        <td>09:10 AM</td>
                        <td>05:28 PM</td>
                        <td style={{ fontWeight: 600 }}>8h 18m</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>● Present</span></td>
                        <td>Office</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>12 Oct 2026</td>
                        <td>09:15 AM</td>
                        <td>06:00 PM</td>
                        <td style={{ fontWeight: 600 }}>8h 45m</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>● WFH</span></td>
                        <td>Home</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>11 Oct 2026</td>
                        <td style={{ color: '#94a3b8' }}>--</td>
                        <td style={{ color: '#94a3b8' }}>--</td>
                        <td style={{ color: '#94a3b8' }}>--</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>● Leave</span></td>
                        <td style={{ color: '#94a3b8' }}>--</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>10 Oct 2026</td>
                        <td>09:02 AM</td>
                        <td>05:30 PM</td>
                        <td style={{ fontWeight: 600 }}>8h 28m</td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>● Present</span></td>
                        <td>Office</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            );
          })()}

          {/* =================================================================
              SCREEN 3: MARK ATTENDANCE (CHECK IN/OUT)
             ================================================================= */}
          {activeModule === 'mark-attendance' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '18px' }}>
                <div>
                  <h1 className="employee-header-title">Mark Attendance</h1>
                  <p className="employee-header-desc">Dual Kiosk QR code check-in and administrative manual entry</p>
                </div>
              </div>

              {/* 2-Column: Live Clock / QR Kiosk Card + Manual Entry Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                {/* Left Card: QR Code Kiosk Card */}
                <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  
                  {/* Kiosk Mode Tabs */}
                  <div style={{ width: '100%', display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '3px', marginBottom: '16px' }}>
                    <button
                      onClick={() => setKioskTab('QR Code Kiosk')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        background: kioskTab === 'QR Code Kiosk' ? '#2563eb' : 'transparent',
                        color: kioskTab === 'QR Code Kiosk' ? '#ffffff' : '#94a3b8',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      QR Code Kiosk
                    </button>
                    <button
                      onClick={() => setKioskTab('Kiosk Mode')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        background: kioskTab === 'Kiosk Mode' ? '#2563eb' : 'transparent',
                        color: kioskTab === 'Kiosk Mode' ? '#ffffff' : '#94a3b8',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Kiosk Mode
                    </button>
                  </div>

                  {kioskTab === 'QR Code Kiosk' ? (
                    <>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>
                        {liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', marginBottom: '12px' }}>
                        {liveClockTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>

                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        background: isCheckedIn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isCheckedIn ? '#10b981' : '#f87171',
                        border: isCheckedIn ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        marginBottom: '16px'
                      }}>
                        ● {isCheckedIn ? 'Present • Checked In' : 'Checked Out'}
                      </span>

                      {/* Real Dynamic Scannable QR Code Canvas / Image */}
                      <div style={{ position: 'relative', width: '160px', height: '160px', background: '#ffffff', borderRadius: '12px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '2px dashed #38bdf8', boxShadow: '0 4px 18px rgba(56, 189, 248, 0.25)' }}>
                        {qrDataUrl ? (
                          <img src={qrDataUrl} alt="WORLDXZ026 Attendance QR Code" style={{ width: '148px', height: '148px', borderRadius: '8px', display: 'block' }} />
                        ) : (
                          <canvas ref={qrCanvasRef} style={{ width: '148px', height: '148px', borderRadius: '8px' }} />
                        )}
                        {/* Center Brand Badge */}
                        <div style={{ position: 'absolute', width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '9px', fontWeight: 900, border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
                          WX
                        </div>
                      </div>

                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                        Scan this QR code to mark attendance
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', marginBottom: '14px' }}>
                        Code: <strong style={{ color: '#38bdf8' }}>WORLDXZ026</strong> • GPS & HR Database Verified
                      </div>

                      {/* Real-Time Scan Notification Banner (Appears when mobile scans or punch is recorded) */}
                      {lastPunchAlert && (
                        <div style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: lastPunchAlert.action === 'CHECK_IN'
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(5, 150, 105, 0.12))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(220, 38, 38, 0.12))',
                          border: `1.5px solid ${lastPunchAlert.action === 'CHECK_IN' ? '#10b981' : '#ef4444'}`,
                          marginBottom: '12px',
                          textAlign: 'left'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: lastPunchAlert.action === 'CHECK_IN' ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle size={15} /> {lastPunchAlert.action === 'CHECK_IN' ? '⚡ Mobile Scan Punch-In Submitted!' : '⚡ Mobile Scan Punch-Out Submitted!'}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Real-Time Synced</span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#ffffff', marginTop: '4px' }}>
                            Employee: <strong>{lastPunchAlert.name || 'Rohit Sharma'}</strong> ({lastPunchAlert.id || 'VX001'}) • Time: <strong style={{ color: lastPunchAlert.action === 'CHECK_IN' ? '#10b981' : '#f87171' }}>{lastPunchAlert.action === 'CHECK_IN' ? (lastPunchAlert.inTime || checkInTime) : (lastPunchAlert.outTime || checkOutTime)}</strong> • Date: <strong>{lastPunchAlert.date || liveClockTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                          </div>
                        </div>
                      )}

                      {/* Live Attendance Scanned Data Card (Employee Name, In Time, Out Time, Employee ID, Date) */}
                      <div style={{
                        background: isCheckedIn || checkOutTime ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: isCheckedIn || checkOutTime ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        width: '100%',
                        marginBottom: '14px',
                        textAlign: 'left'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CheckCircle size={14} color="#10b981" /> Scanned Punch Data • HR Database Synced
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '3px 9px',
                            borderRadius: '10px',
                            background: isCheckedIn ? 'rgba(16, 185, 129, 0.2)' : checkOutTime ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: isCheckedIn ? '#10b981' : checkOutTime ? '#38bdf8' : '#f87171',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isCheckedIn ? '#10b981' : checkOutTime ? '#38bdf8' : '#f87171', display: 'inline-block' }} />
                            {isCheckedIn ? 'Checked In (Live)' : checkOutTime ? 'Checked Out (Live)' : 'Awaiting Punch'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Employee Name:</div>
                            <strong style={{ color: '#ffffff' }}>{lastPunchAlert?.name || currentUser.name || 'Rohit Sharma'}</strong>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Employee ID:</div>
                            <strong style={{ color: '#38bdf8' }}>{lastPunchAlert?.id || currentUser.id || 'VX001'}</strong>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>In Time (Clock-In):</div>
                            <strong id="display-in-time" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {checkInTime || todayAttendance?.check_in || '--:--'}
                              {(checkInTime || todayAttendance?.check_in) && <span style={{ fontSize: '0.6rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Real-Time</span>}
                            </strong>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Out Time (Clock-Out):</div>
                            <strong id="display-out-time" style={{ color: (checkOutTime || todayAttendance?.check_out) ? '#f87171' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {checkOutTime || todayAttendance?.check_out || '--:--'}
                              {(checkOutTime || todayAttendance?.check_out) && <span style={{ fontSize: '0.6rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Real-Time</span>}
                            </strong>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Punch Date:</div>
                            <strong style={{ color: '#e2e8f0' }}>{lastPunchAlert?.date || liveClockTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Attendance Status:</div>
                            <strong id="display-attendance-status" style={{ color: isCheckedIn ? '#10b981' : checkOutTime ? '#38bdf8' : '#fbbf24' }}>
                              {isCheckedIn ? 'Present (Submitted ✓)' : checkOutTime ? 'Shift Complete (Submitted ✓)' : 'Awaiting Mobile Scan'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Test Mobile App Scan Simulator & Confirmation Modal Trigger Button */}
                      <div style={{ width: '100%', marginBottom: '10px' }}>
                        <button
                          id="btn-scan-qr-mobile"
                          onClick={() => {
                            setPhonePunchAction(isCheckedIn ? 'CHECK_OUT' : 'CHECK_IN');
                            setPhonePunchSuccess(null);
                            setShowPhoneScanModal(true);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: '1.5px solid #38bdf8',
                            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(37, 99, 235, 0.2))',
                            color: '#38bdf8',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Smartphone size={16} />
                          <span>📱 Scan QR via Rohit App & Submit Attendance (Real-Time)</span>
                        </button>
                      </div>

                      {/* Direct Real-Time Action Punch Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                        <button
                          id="btn-submit-in-time"
                          onClick={() => handlePunchAttendance(liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'CHECK_IN')}
                          style={{
                            padding: '11px',
                            borderRadius: '10px',
                            border: 'none',
                            background: isCheckedIn ? '#10b981' : 'rgba(16, 185, 129, 0.25)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: isCheckedIn ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CheckCircle size={15} />
                          <span>✓ Submit In-Time ({liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                        </button>

                        <button
                          id="btn-submit-out-time"
                          onClick={() => handlePunchAttendance(liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'CHECK_OUT')}
                          style={{
                            padding: '11px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            background: !isCheckedIn && checkOutTime ? '#ef4444' : 'rgba(239, 68, 68, 0.25)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: !isCheckedIn && checkOutTime ? '0 4px 14px rgba(239, 68, 68, 0.4)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <LogOut size={15} />
                          <span>→ Submit Out-Time ({liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                        </button>
                      </div>

                      {/* Reset Punch Helper Button */}
                      <button
                        id="btn-reset-today-punch"
                        type="button"
                        disabled={isResettingPunch}
                        onClick={handleResetTodayPunch}
                        style={{
                          marginTop: '8px',
                          width: '100%',
                          padding: '7px 10px',
                          background: isResettingPunch ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: isResettingPunch ? '1px solid #38bdf8' : '1px dashed rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: isResettingPunch ? '#38bdf8' : '#94a3b8',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: isResettingPunch ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isResettingPunch) {
                            e.currentTarget.style.borderColor = '#38bdf8';
                            e.currentTarget.style.color = '#38bdf8';
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isResettingPunch) {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          }
                        }}
                      >
                        <RefreshCw size={13} style={{ animation: isResettingPunch ? 'spin 0.8s linear infinite' : 'none' }} />
                        <span>{isResettingPunch ? "Resetting Slate..." : "Reset Today's Punch (Clean Test Slate)"}</span>
                      </button>
                    </>
                  ) : (
                    /* Interactive Kiosk Mode Scanner */
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '220px', height: '180px', background: '#070d19', borderRadius: '14px', border: '2px solid #38bdf8', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        {/* Scanning Laser Beam Animation */}
                        <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '3px', background: '#38bdf8', boxShadow: '0 0 14px #38bdf8', animation: 'pulse 1.5s infinite alternate' }} />
                        
                        {/* Target Crosshairs */}
                        <Camera size={44} color="#38bdf8" style={{ opacity: 0.7 }} />
                        <span style={{ position: 'absolute', bottom: '10px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                          Sensor Live • Facing Camera
                        </span>
                      </div>

                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                        Autonomous Kiosk Terminal
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 16px 0', maxWidth: '280px' }}>
                        Simulate scanning your employee badge or facial recognition at the office entrance gate.
                      </p>

                      <button
                        onClick={() => {
                          const newStatus = !isCheckedIn;
                          setIsCheckedIn(newStatus);
                          playPunchChime();
                          confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
                          triggerToast(newStatus ? '✓ Kiosk Sensor: RFID Badge verified! Checked IN.' : '✓ Kiosk Sensor: Verified! Checked OUT.');
                        }}
                        className="employee-btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.84rem' }}
                      >
                        <Sparkles size={16} />
                        <span>Simulate RFID / Face Scan Punch</span>
                      </button>
                    </div>
                  )}

                </div>

                {/* Right Card: Manual Entry Form (Exact matching Reference Screen 4) */}
                <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>Manual Entry</h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 16px 0' }}>
                      Submit manual attendance record with location & time verification
                    </p>

                    <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label className="employee-form-label-title">Employee</label>
                        <select name="employee" className="employee-input-control" defaultValue={currentUser?.id || "EMP005"}>
                          <option value="EMP005">EMP005 - Rohit S. (Engineering)</option>
                          <option value="EMP001">EMP001 - Neha Singh (Engineering)</option>
                          <option value="EMP012">EMP012 - Pooja Yadav (Human Resources)</option>
                          <option value="EMP018">EMP018 - Amit Kumar (Operations)</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="employee-form-label-title">Check-In Time</label>
                          <div style={{ position: 'relative' }}>
                            <Clock size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                            <input
                              name="checkIn"
                              type="text"
                              className="employee-input-control"
                              style={{ paddingLeft: '34px' }}
                              value={checkInTime || '09:05 AM'}
                              onChange={(e) => setCheckInTime(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="employee-form-label-title">Check-Out Time</label>
                          <div style={{ position: 'relative' }}>
                            <Clock size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                            <input
                              name="checkOut"
                              type="text"
                              className="employee-input-control"
                              style={{ paddingLeft: '34px' }}
                              value={checkOutTime || '06:00 PM'}
                              onChange={(e) => setCheckOutTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="employee-form-label-title">Location (Optional)</label>
                        <input
                          name="location"
                          type="text"
                          className="employee-input-control"
                          defaultValue="Office - Lucknow HQ"
                          placeholder="e.g. Office, Client Site"
                        />
                      </div>

                      <div>
                        <label className="employee-form-label-title">Remarks (Optional)</label>
                        <textarea
                          name="remarks"
                          rows={3}
                          className="employee-input-control"
                          placeholder="Enter remarks regarding punch..."
                          style={{ resize: 'none' }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="employee-btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.84rem', marginTop: '4px' }}
                      >
                        <CheckCircle size={15} />
                        <span>Submit Manual Attendance</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Bottom: Today's Attendance Timeline Stepper matching reference */}
              <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '22px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Today's Attendance Timeline</h3>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    ● Geofence Verified (Lucknow HQ • Floor 4)
                  </span>
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
                  <div style={{ position: 'absolute', top: '18px', left: '60px', right: '60px', height: '3px', background: 'rgba(255, 255, 255, 0.08)', zIndex: 0 }} />

                  {[
                    { title: 'Check In', time: checkInTime || '09:05 AM', completed: Boolean(checkInTime) },
                    { title: 'Tea Break', time: '11:15 AM', completed: Boolean(checkInTime) },
                    { title: 'Lunch Break', time: '01:30 PM', completed: Boolean(checkInTime) },
                    { title: 'Check Out', time: checkOutTime || (isCheckedIn ? 'Expected 06:00 PM' : '06:00 PM'), completed: Boolean(checkOutTime), current: isCheckedIn }
                  ].map((step, idx) => (
                    <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: step.completed ? '#10b981' : step.current ? '#2563eb' : '#0b1120',
                        border: step.current ? '3px solid #38bdf8' : '3px solid transparent',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        boxShadow: step.current ? '0 0 14px rgba(56, 189, 248, 0.5)' : 'none'
                      }}>
                        {step.completed ? <Check size={16} /> : idx + 1}
                      </div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>{step.title}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 4: APPLY WFH
             ================================================================= */}
          {activeModule === 'apply-wfh' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '20px' }}>
                <div>
                  <h1 className="employee-header-title">Apply Work From Home</h1>
                  <p className="employee-header-desc">Submit your WFH request for manager approval with dates and justification.</p>
                </div>
              </div>

              <div className="employee-form-grid-2col">
                {/* Left Form Box */}
                <div className="employee-form-box">
                  <form onSubmit={handleApplyWfhSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* From Date & To Date (Requested by user) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="employee-form-label-title" style={{ margin: 0 }}>WFH Schedule Dates</label>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                          📅 Select Date Range
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>From Date</label>
                          <input
                            type="date"
                            className="employee-input-control"
                            value={wfhFormState.fromDate || '2026-10-15'}
                            onChange={(e) => setWfhFormState({ ...wfhFormState, fromDate: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>To Date</label>
                          <input
                            type="date"
                            className="employee-input-control"
                            value={wfhFormState.toDate || '2026-10-16'}
                            onChange={(e) => setWfhFormState({ ...wfhFormState, toDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Work Reason Dropdown + Visible Quick Chips (Requested by user) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="employee-form-label-title" style={{ margin: 0 }}>Work Reason</label>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Visible list & quick select</span>
                      </div>

                      <select
                        className="employee-input-control"
                        value={wfhFormState.reason}
                        onChange={(e) => setWfhFormState({ ...wfhFormState, reason: e.target.value })}
                      >
                        <option value="Client Meeting">Client Meeting / Field Work</option>
                        <option value="Personal Work">Personal Work / Family Event</option>
                        <option value="Health Issue">Health Issue / Medical Recovery</option>
                        <option value="Official Remote Project">Official Remote Project Assignment</option>
                        <option value="Severe Weather">Severe Weather / Commute Difficulty</option>
                        <option value="Family Emergency">Family Emergency</option>
                      </select>

                      {/* Visible Quick Chips */}
                      <div className="employee-reason-chips">
                        {[
                          { label: '💼 Client Meeting', val: 'Client Meeting' },
                          { label: '🏡 Personal Work', val: 'Personal Work' },
                          { label: '🩺 Health Issue', val: 'Health Issue' },
                          { label: '💻 Remote Project', val: 'Official Remote Project' },
                          { label: '⚡ Severe Weather', val: 'Severe Weather' }
                        ].map(chip => (
                          <button
                            key={chip.val}
                            type="button"
                            className={`employee-reason-chip ${wfhFormState.reason === chip.val ? 'active' : ''}`}
                            onClick={() => setWfhFormState({ ...wfhFormState, reason: chip.val })}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description Box (Enlarged as requested) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="employee-form-label-title" style={{ margin: 0 }}>Description & Work Plan</label>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Detailed justification</span>
                      </div>
                      <textarea
                        rows={6}
                        className="employee-input-control"
                        style={{ minHeight: '130px', resize: 'vertical' }}
                        placeholder="Provide detailed justification, key tasks you will accomplish, and communication availability during WFH hours..."
                        value={wfhFormState.desc}
                        onChange={(e) => setWfhFormState({ ...wfhFormState, desc: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="employee-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.86rem', marginTop: '6px' }}
                    >
                      <Send size={15} />
                      <span>Submit WFH Request</span>
                    </button>
                  </form>
                </div>

                {/* Right Side: WFH Allowance + Guidelines + Recent WFH Requests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* WFH Quota & Balance Card */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px 22px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>Monthly WFH Allowance</span>
                      <span style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 800 }}>3 of 5 Days Used</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #38bdf8)', borderRadius: '10px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                      <span>Remaining: <strong style={{ color: '#10b981' }}>2 Days</strong></span>
                      <span>Renews on: <strong>1 Nov 2026</strong></span>
                    </div>
                  </div>

                  {/* WFH Guidelines */}
                  <div className="employee-guidelines-box">
                    <div className="employee-guidelines-title">
                      <ShieldCheck size={16} />
                      <span>WFH Policy Guidelines</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Submit request at least 1 day before the scheduled date.</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Maintain active status on Slack / Teams between 09:00 AM - 06:00 PM.</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Ensure stable high-speed internet connectivity.</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Daily standup and project deliverables must be met.</span>
                    </div>
                  </div>

                  {/* Recent WFH Requests Table */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                      Recent WFH Requests
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { date: '14 Oct 2026', reason: 'Personal Work', status: 'Approved' },
                        { date: '01 Oct 2026', reason: 'Official Remote', status: 'Approved' },
                        { date: '15 Oct 2026', reason: 'Client Meeting', status: 'Pending' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', fontSize: '0.76rem' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{item.date}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.reason}</div>
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: item.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: item.status === 'Approved' ? '#10b981' : '#f59e0b',
                            border: item.status === 'Approved' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                          }}>
                            ● {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 5: APPLY LEAVE
             ================================================================= */}
          {activeModule === 'apply-leave' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '20px' }}>
                <div>
                  <h1 className="employee-header-title">Apply Leave</h1>
                  <p className="employee-header-desc">Submit your official leave request for approval with balance deduction.</p>
                </div>
              </div>

              <div className="employee-form-grid-2col">
                {/* Left Form Box */}
                <div className="employee-form-box">
                  <form onSubmit={handleApplyLeaveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Leave Type Selector + Quick Pills */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="employee-form-label-title" style={{ margin: 0 }}>Leave Type</label>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>Select Type</span>
                      </div>
                      
                      <select
                        className="employee-input-control"
                        value={leaveFormState.type}
                        onChange={(e) => setLeaveFormState({ ...leaveFormState, type: e.target.value })}
                      >
                        <option value="Casual Leave">Casual Leave (Balance: 12)</option>
                        <option value="Sick Leave">Sick Leave (Balance: 5)</option>
                        <option value="Earned Leave">Earned Leave (Balance: 8)</option>
                        <option value="Compensatory Off">Compensatory Off (Balance: 2)</option>
                        <option value="Maternity / Paternity">Maternity / Paternity Leave</option>
                      </select>

                      <div className="employee-reason-chips">
                        {['Casual Leave', 'Sick Leave', 'Earned Leave', 'Compensatory Off'].map(t => (
                          <button
                            key={t}
                            type="button"
                            className={`employee-reason-chip ${leaveFormState.type === t ? 'active' : ''}`}
                            onClick={() => setLeaveFormState({ ...leaveFormState, type: t })}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* From Date & To Date Grid */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="employee-form-label-title" style={{ margin: 0 }}>Leave Duration</label>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                          Total: 2 Days
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>From Date</label>
                          <input
                            type="date"
                            className="employee-input-control"
                            value={leaveFormState.from.includes('-') ? leaveFormState.from : '2026-10-18'}
                            onChange={(e) => setLeaveFormState({ ...leaveFormState, from: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>To Date</label>
                          <input
                            type="date"
                            className="employee-input-control"
                            value={leaveFormState.to.includes('-') ? leaveFormState.to : '2026-10-19'}
                            onChange={(e) => setLeaveFormState({ ...leaveFormState, to: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reason Textarea */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="employee-form-label-title" style={{ margin: 0 }}>Reason for Leave</label>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Required for HR approval</span>
                      </div>
                      <textarea
                        rows={5}
                        className="employee-input-control"
                        style={{ minHeight: '120px', resize: 'vertical' }}
                        placeholder="State your reason for leave, emergency handover contacts, and anticipated resumption date..."
                        value={leaveFormState.reason}
                        onChange={(e) => setLeaveFormState({ ...leaveFormState, reason: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="employee-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.86rem', marginTop: '6px' }}
                    >
                      <Send size={15} />
                      <span>Submit Leave Request</span>
                    </button>
                  </form>
                </div>

                {/* Right: Available Leave Balances 2x2 Grid + Guidelines + Recent Applications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* 4 Available Leave Balance Tiles */}
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                      Available Leave Balances
                    </div>

                    <div className="employee-leave-balance-grid">
                      <div className="employee-balance-tile" style={{ borderLeft: '3px solid #38bdf8' }}>
                        <div className="employee-balance-tile-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                          <Umbrella size={20} />
                        </div>
                        <div>
                          <div className="employee-balance-tile-title">Casual Leave</div>
                          <div className="employee-balance-tile-val">12 <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>days</span></div>
                        </div>
                      </div>

                      <div className="employee-balance-tile" style={{ borderLeft: '3px solid #10b981' }}>
                        <div className="employee-balance-tile-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                          <Activity size={20} />
                        </div>
                        <div>
                          <div className="employee-balance-tile-title">Sick Leave</div>
                          <div className="employee-balance-tile-val">5 <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>days</span></div>
                        </div>
                      </div>

                      <div className="employee-balance-tile" style={{ borderLeft: '3px solid #c084fc' }}>
                        <div className="employee-balance-tile-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                          <Trophy size={20} />
                        </div>
                        <div>
                          <div className="employee-balance-tile-title">Earned Leave</div>
                          <div className="employee-balance-tile-val">8 <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>days</span></div>
                        </div>
                      </div>

                      <div className="employee-balance-tile" style={{ borderLeft: '3px solid #fbbf24' }}>
                        <div className="employee-balance-tile-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                          <Clock size={20} />
                        </div>
                        <div>
                          <div className="employee-balance-tile-title">Comp Off</div>
                          <div className="employee-balance-tile-val">2 <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>days</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leave Policy Box */}
                  <div className="employee-guidelines-box">
                    <div className="employee-guidelines-title">
                      <ShieldCheck size={16} />
                      <span>Leave Application Policy</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Apply at least 2 days in advance for planned leaves.</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Medical certificate required for sick leave exceeding 2 consecutive days.</span>
                    </div>
                    <div className="employee-guideline-item">
                      <span>•</span>
                      <span>Ensure critical project tasks are handed over to your team lead.</span>
                    </div>
                  </div>

                  {/* Recent Applications */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                      Recent Leave Applications
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { type: 'Casual Leave', dates: '10 Oct – 12 Oct', status: 'Approved' },
                        { type: 'Sick Leave', dates: '20 Sep – 20 Sep', status: 'Approved' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', fontSize: '0.76rem' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{item.type}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.dates}</div>
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}>
                            ● {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 6: VIEW ATTENDANCE REPORTS (INTERACTIVE MONTHLY CALENDAR & WORKING DATA)
             ================================================================= */}
          {activeModule === 'reports' && (() => {
            const reportStats = getSelectedMonthReportStats();
            const filteredRecords = reportsTableFilter === 'All'
              ? reportStats.records
              : reportStats.records.filter(r => r.status === reportsTableFilter);

            return (
              <div>
                {/* Header */}
                <div className="employee-header" style={{ marginBottom: '18px' }}>
                  <div>
                    <h1 className="employee-header-title">Attendance Reports</h1>
                    <p className="employee-header-desc">
                      Generate, preview, and download your monthly & periodic attendance reports.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="employee-btn-primary"
                      onClick={handleExportAttendanceStatement}
                      title="Download Excel / CSV Statement for Selected Month"
                    >
                      <FileSpreadsheet size={15} />
                      <span>Export Excel</span>
                    </button>
                    <button
                      className="employee-btn-secondary"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowReportModal(true)}
                    >
                      <FileText size={15} />
                      <span>View Full Statement</span>
                    </button>
                  </div>
                </div>

                {/* Filter Bar with Interactive Calendar */}
                <div className="employee-reports-filters">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      Report Type
                    </label>
                    <select
                      className="employee-input-control"
                      style={{ width: 'auto', padding: '6px 14px', background: '#0b1324', borderColor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', borderRadius: '8px', cursor: 'pointer' }}
                      value={reportGenConfig.type}
                      onChange={(e) => setReportGenConfig({ ...reportGenConfig, type: e.target.value })}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  {/* Real Calendar Popover for Monthly Mode (User Request) */}
                  {reportGenConfig.type === 'Monthly' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        Month
                      </label>
                      <RealDatePickerPopover
                        selectedMonthYear={`${MONTH_NAMES[calMonth]} ${calYear}`}
                        showFullDate={false}
                        onSelectMonthYear={(my, { month, year }) => {
                          setCalMonth(month);
                          setCalYear(year);
                          setReportGenConfig(prev => ({ ...prev, month: my }));
                          setSelectedMonth(my);
                          triggerToast(`📅 Loaded Attendance Report for ${my}`);
                        }}
                        align="left"
                      />
                    </div>
                  )}

                  {reportGenConfig.type === 'Weekly' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        Select Week
                      </label>
                      <select
                        className="employee-input-control"
                        style={{ width: 'auto', padding: '6px 12px', background: '#0b1324', color: '#ffffff', borderRadius: '8px' }}
                        value={reportGenConfig.week || 'Week 3'}
                        onChange={(e) => setReportGenConfig({ ...reportGenConfig, week: e.target.value })}
                      >
                        <option value="Week 1">Week 1 (Days 1–7)</option>
                        <option value="Week 2">Week 2 (Days 8–14)</option>
                        <option value="Week 3">Week 3 (Days 15–21)</option>
                        <option value="Week 4">Week 4 (Days 22–28)</option>
                        <option value="Week 5">Week 5 (Days 29–end)</option>
                      </select>
                    </div>
                  )}

                  {reportGenConfig.type === 'Yearly' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        Select Year
                      </label>
                      <select
                        className="employee-input-control"
                        style={{ width: 'auto', padding: '6px 12px', background: '#0b1324', color: '#ffffff', borderRadius: '8px' }}
                        value={calYear}
                        onChange={(e) => {
                          const y = parseInt(e.target.value, 10);
                          setCalYear(y);
                          setReportGenConfig(prev => ({ ...prev, month: `${MONTH_NAMES[calMonth]} ${y}` }));
                        }}
                      >
                        <option value={2026}>2026 (Current Financial Year)</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      Format
                    </label>
                    <select
                      className="employee-input-control"
                      style={{ width: 'auto', padding: '6px 12px', background: '#0b1324', color: '#ffffff', borderRadius: '8px', cursor: 'pointer' }}
                      value={reportGenConfig.format}
                      onChange={(e) => setReportGenConfig({ ...reportGenConfig, format: e.target.value })}
                    >
                      <option value="PDF">PDF Statement</option>
                      <option value="Excel">Excel (.xlsx)</option>
                      <option value="CSV">CSV Data</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setShowReportModal(true);
                      playPunchChime();
                      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
                      triggerToast(`✓ Generated ${reportGenConfig.type} Report for ${MONTH_NAMES[calMonth]} ${calYear}`);
                    }}
                    className="employee-btn-primary"
                    style={{ padding: '8px 20px', whiteSpace: 'nowrap', marginLeft: 'auto' }}
                  >
                    <Sparkles size={14} />
                    <span>Generate Report</span>
                  </button>
                </div>

                {/* 5 Dynamic KPI Summary Cards */}
                <div className="employee-reports-kpi-row">
                  <div className="employee-report-kpi">
                    <span className="employee-report-kpi-label">Total Working Days</span>
                    <span className="employee-report-kpi-val">
                      {reportStats.workingDays}
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>/ {reportStats.totalDays} Total</span>
                    </span>
                  </div>

                  <div className="employee-report-kpi" style={{ borderLeft: '3px solid #10b981' }}>
                    <span className="employee-report-kpi-label" style={{ color: '#059669' }}>Present Days</span>
                    <span className="employee-report-kpi-val" style={{ color: '#059669' }}>
                      {reportStats.present}
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>({reportStats.presentPct}%)</span>
                    </span>
                  </div>

                  <div className="employee-report-kpi" style={{ borderLeft: '3px solid #0284c7' }}>
                    <span className="employee-report-kpi-label" style={{ color: '#0284c7' }}>WFH Days</span>
                    <span className="employee-report-kpi-val" style={{ color: '#0284c7' }}>
                      {reportStats.wfh}
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>({reportStats.wfhPct}%)</span>
                    </span>
                  </div>

                  <div className="employee-report-kpi" style={{ borderLeft: '3px solid #8b5cf6' }}>
                    <span className="employee-report-kpi-label" style={{ color: '#8b5cf6' }}>Leave Taken</span>
                    <span className="employee-report-kpi-val" style={{ color: '#8b5cf6' }}>
                      {reportStats.leave}
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>({reportStats.leavePct}%)</span>
                    </span>
                  </div>

                  <div className="employee-report-kpi" style={{ borderLeft: '3px solid #ef4444' }}>
                    <span className="employee-report-kpi-label" style={{ color: '#ef4444' }}>Absent</span>
                    <span className="employee-report-kpi-val" style={{ color: '#ef4444' }}>
                      {reportStats.absent}
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>({reportStats.absentPct}%)</span>
                    </span>
                  </div>
                </div>

                {/* Grouped Bar Chart Breakdown */}
                <div style={{ background: '#0d1527', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Weekly Attendance Breakdown — {MONTH_NAMES[calMonth]} {calYear}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        Weekly status distribution across {reportStats.workingDays} working days
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} /> Present
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#0284c7' }} /> WFH
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#8b5cf6' }} /> Leave
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }} /> Absent
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', alignItems: 'flex-end', height: '180px', paddingBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {reportStats.weeks.map((wk, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '140px', width: '100%', justifyContent: 'center' }}>
                          <div
                            style={{ height: `${Math.max(4, wk.p * 24)}px`, width: '14px', background: '#10b981', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}
                            title={`Present: ${wk.p} days`}
                          />
                          <div
                            style={{ height: `${Math.max(4, wk.w * 24)}px`, width: '14px', background: '#0284c7', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}
                            title={`WFH: ${wk.w} days`}
                          />
                          <div
                            style={{ height: `${Math.max(4, wk.l * 24)}px`, width: '14px', background: '#8b5cf6', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}
                            title={`Leave: ${wk.l} days`}
                          />
                          <div
                            style={{ height: `${Math.max(4, wk.a * 24)}px`, width: '14px', background: '#ef4444', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }}
                            title={`Absent: ${wk.a} days`}
                          />
                        </div>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', marginTop: '10px' }}>
                          {wk.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Attendance Statement / Ledger Table (Working) */}
                <div style={{ background: '#0d1527', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#38bdf8" />
                        <span>Daily Attendance Ledger — {MONTH_NAMES[calMonth]} {calYear}</span>
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                        Complete day-by-day record of punch times, duration and location
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '8px' }}>
                      {['All', 'Present', 'WFH', 'Leave', 'Absent', 'Weekend'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setReportsTableFilter(tab)}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: reportsTableFilter === tab ? '#2563eb' : 'transparent',
                            color: reportsTableFilter === tab ? '#ffffff' : '#94a3b8',
                            transition: 'all 0.2s'
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                          <th style={{ padding: '10px 14px' }}>Date</th>
                          <th style={{ padding: '10px 14px' }}>Day</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                          <th style={{ padding: '10px 14px' }}>Check In</th>
                          <th style={{ padding: '10px 14px' }}>Check Out</th>
                          <th style={{ padding: '10px 14px' }}>Working Hours</th>
                          <th style={{ padding: '10px 14px' }}>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((r) => {
                          const isWeekend = r.status === 'Weekend';
                          return (
                            <tr
                              key={r.day}
                              style={{
                                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                background: isWeekend ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                                opacity: isWeekend ? 0.6 : 1
                              }}
                            >
                              <td style={{ padding: '10px 14px', color: '#ffffff', fontWeight: 600 }}>{r.dateStr}</td>
                              <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{r.dayName}</td>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: r.status === 'Present'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : r.status === 'WFH'
                                    ? 'rgba(2, 132, 199, 0.15)'
                                    : r.status === 'Leave'
                                    ? 'rgba(139, 92, 246, 0.15)'
                                    : r.status === 'Absent'
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : 'rgba(255, 255, 255, 0.06)',
                                  color: r.status === 'Present'
                                    ? '#10b981'
                                    : r.status === 'WFH'
                                    ? '#38bdf8'
                                    : r.status === 'Leave'
                                    ? '#c084fc'
                                    : r.status === 'Absent'
                                    ? '#ef4444'
                                    : '#94a3b8'
                                }}>
                                  <span style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    background: r.status === 'Present'
                                      ? '#10b981'
                                      : r.status === 'WFH'
                                      ? '#38bdf8'
                                      : r.status === 'Leave'
                                      ? '#c084fc'
                                      : r.status === 'Absent'
                                      ? '#ef4444'
                                      : '#64748b'
                                  }} />
                                  {r.status}
                                </span>
                              </td>
                              <td style={{ padding: '10px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>{r.checkIn}</td>
                              <td style={{ padding: '10px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>{r.checkOut}</td>
                              <td style={{ padding: '10px 14px', color: '#ffffff', fontWeight: 600 }}>{r.hours}</td>
                              <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{r.location}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =================================================================
              SCREEN 7: MY PROFILE
             ================================================================= */}
          {activeModule === 'profile' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '20px' }}>
                <div>
                  <h1 className="employee-header-title">My Profile</h1>
                  <p className="employee-header-desc">Manage your personal information and account settings.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.35fr', gap: '22px' }}>
                {/* Left: Summary Profile Card */}
                <div style={{ background: '#0d1527', borderRadius: '18px', padding: '26px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {/* Avatar / DP with Interactive Upload Controls */}
                  <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <div 
                      onClick={() => avatarFileInputRef.current?.click()}
                      title="Click to upload/change profile photo (DP)"
                      style={{
                        position: 'relative',
                        width: '94px',
                        height: '94px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        border: '3px solid #2563eb',
                        boxShadow: '0 0 22px rgba(37, 99, 235, 0.45)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        const overlay = e.currentTarget.querySelector('.avatar-overlay-hover');
                        if (overlay) overlay.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        const overlay = e.currentTarget.querySelector('.avatar-overlay-hover');
                        if (overlay) overlay.style.opacity = '0';
                      }}
                    >
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                        alt={currentUser.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Hover Overlay */}
                      <div 
                        className="avatar-overlay-hover"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(15, 23, 42, 0.65)',
                          backdropFilter: 'blur(2px)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          color: '#ffffff'
                        }}
                      >
                        <Camera size={22} color="#38bdf8" />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '2px', color: '#ffffff' }}>Change DP</span>
                      </div>
                    </div>

                    {/* Online indicator */}
                    <span style={{ position: 'absolute', bottom: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d1527', zIndex: 2 }} />

                    {/* Camera icon badge on avatar corner */}
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      title="Upload profile photo (DP)"
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#2563eb',
                        border: '2px solid #0d1527',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                        zIndex: 3,
                        transition: 'transform 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Camera size={13} />
                    </button>
                  </div>

                  {/* Explicit DP Action Buttons below Avatar */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      style={{
                        background: 'rgba(37, 99, 235, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        color: '#38bdf8',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.28)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)'}
                    >
                      <Camera size={12} />
                      <span>Upload DP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAvatarPickerModal(true)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#cbd5e1',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                      title="Choose from professional preset avatars"
                    >
                      <Sparkles size={11} color="#f59e0b" />
                      <span>Presets</span>
                    </button>
                  </div>

                  {/* Hidden Avatar File Input */}
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                  />

                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0' }}>{currentUser.name}</h2>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{currentUser.designation || currentUser.role}</div>
                  <div style={{ display: 'inline-block', background: 'rgba(37, 99, 235, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 12px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800, marginTop: '8px', marginBottom: '18px' }}>
                    {currentUser.id}
                  </div>

                  <div style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Department:</span>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{currentUser.department}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Email:</span>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{currentUser.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Phone:</span>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{currentUser.phone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Location:</span>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{currentUser.location || 'Lucknow HQ, Uttar Pradesh'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Joining Date:</span>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{currentUser.joining_date || currentUser.joiningDate || '10 Jan 2024'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="employee-btn-action"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Right: Personal Details & Work Details Tabs */}
                <div style={{ background: '#0d1527', borderRadius: '18px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
                    {['Personal Details', 'Work Details', 'Documents'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setProfileActiveTab(tab)}
                        style={{
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: profileActiveTab === tab ? '#2563eb' : 'transparent',
                          color: profileActiveTab === tab ? '#ffffff' : '#94a3b8',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {profileActiveTab === 'Personal Details' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label className="employee-form-label-title">Full Name</label>
                          <input type="text" className="employee-input-control" defaultValue={currentUser.name} />
                        </div>
                        <div>
                          <label className="employee-form-label-title">Email Address</label>
                          <input type="email" className="employee-input-control" defaultValue={currentUser.email} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label className="employee-form-label-title">Phone Number</label>
                          <input type="tel" className="employee-input-control" defaultValue={currentUser.phone} />
                        </div>
                        <div>
                          <label className="employee-form-label-title">Date of Birth</label>
                          <input type="text" className="employee-input-control" defaultValue="14 Oct 1999" />
                        </div>
                      </div>

                      <div>
                        <label className="employee-form-label-title">Permanent Address</label>
                        <input type="text" className="employee-input-control" defaultValue="Lucknow, Uttar Pradesh, India - 226010" />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                          onClick={() => triggerToast('✓ Profile changes saved securely!')}
                          className="employee-btn-primary"
                          style={{ padding: '10px 22px' }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {profileActiveTab === 'Work Details' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label className="employee-form-label-title">Employee ID</label>
                          <input type="text" className="employee-input-control" defaultValue={currentUser.id} disabled />
                        </div>
                        <div>
                          <label className="employee-form-label-title">Reporting Manager</label>
                          <input type="text" className="employee-input-control" defaultValue={currentUser.reporting_manager || currentUser.manager || 'Amit Kumar'} disabled />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label className="employee-form-label-title">Department & Role</label>
                          <input type="text" className="employee-input-control" defaultValue={`${currentUser.department} • ${currentUser.designation || 'Engineer'}`} disabled />
                        </div>
                        <div>
                          <label className="employee-form-label-title">Employment Grade</label>
                          <input type="text" className="employee-input-control" defaultValue="L4 - Senior Engineer (Full-Time Regular)" disabled />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label className="employee-form-label-title">Work Shift</label>
                          <input type="text" className="employee-input-control" defaultValue="General Shift (09:00 AM - 06:00 PM)" disabled />
                        </div>
                        <div>
                          <label className="employee-form-label-title">Primary Work Location</label>
                          <input type="text" className="employee-input-control" defaultValue={currentUser.location || 'Lucknow HQ Campus, UP'} disabled />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label className="employee-form-label-title">Assigned Asset ID</label>
                          <input type="text" className="employee-input-control" defaultValue="VX-MBP-2024-M3PRO-089" disabled />
                        </div>
                        <div>
                          <label className="employee-form-label-title">PF / UAN Account</label>
                          <input type="text" className="employee-input-control" defaultValue="101948275091 (Active)" disabled />
                        </div>
                      </div>
                    </div>
                  )}

                  {profileActiveTab === 'Documents' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Documents Section Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileCheck size={16} color="#38bdf8" />
                            <span>Employee KYC & Employment Documents</span>
                          </div>
                          <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '2px' }}>
                            Upload, verify, and download your official documents (PDF, PNG, JPG, DOC up to 10MB)
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowUploadDocModal(true)}
                          className="employee-btn-primary"
                          style={{ padding: '7px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Upload size={14} />
                          <span>+ Upload New Document</span>
                        </button>
                      </div>

                      {/* Documents List with Upload and View Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {employeeDocs.map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              transition: 'all 0.2s ease',
                              flexWrap: 'wrap',
                              gap: '12px'
                            }}
                          >
                            {/* Document Title & Meta */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(37, 99, 235, 0.15)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#38bdf8'
                              }}>
                                <FileText size={18} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                                  {doc.title}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                  <span style={{ color: '#cbd5e1' }}>{doc.filename || 'Document'}</span>
                                  <span>•</span>
                                  <span>{doc.size || '1.2 MB'}</span>
                                  <span>•</span>
                                  <span style={{ color: '#64748b' }}>{doc.uploadedAt}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions: Status Pill + Upload Button + View Button */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {/* Status Badge */}
                              <span style={{
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: doc.status === 'Verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                color: doc.status === 'Verified' ? '#10b981' : '#38bdf8',
                                border: doc.status === 'Verified' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)'
                              }}>
                                <CheckCircle size={11} />
                                <span>{doc.status}</span>
                              </span>

                              {/* Upload Button (User Request: "2nd image mei upload ka lagao") */}
                              <label
                                title={`Upload or replace ${doc.title}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: 'rgba(37, 99, 235, 0.15)',
                                  border: '1px solid rgba(56, 189, 248, 0.35)',
                                  color: '#38bdf8',
                                  padding: '6px 14px',
                                  borderRadius: '8px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)'}
                              >
                                <Upload size={13} />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleSingleDocUpload(doc.id, e)}
                                />
                              </label>

                              {/* View Button */}
                              <button
                                type="button"
                                className="employee-btn-action"
                                onClick={() => setSelectedPreviewDoc(doc)}
                                title={`View & preview ${doc.title}`}
                                style={{
                                  padding: '6px 14px',
                                  fontSize: '0.74rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Eye size={13} />
                                <span>View</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Dropzone prompt for uploading more documents */}
                      <div
                        onClick={() => setShowUploadDocModal(true)}
                        style={{
                          border: '2px dashed rgba(56, 189, 248, 0.25)',
                          borderRadius: '12px',
                          padding: '16px',
                          textAlign: 'center',
                          background: 'rgba(56, 189, 248, 0.02)',
                          cursor: 'pointer',
                          marginTop: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)'}
                      >
                        <Upload size={20} color="#38bdf8" style={{ marginBottom: '4px' }} />
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                          Upload Additional Verification Documents
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                          Supports PDF, JPG, PNG up to 10MB • Secured with AES-256 encryption
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 8: LEAVE HISTORY (MODULE 11 IN SCREENSHOT)
             ================================================================= */}
          {activeModule === 'leave-history' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '18px' }}>
                <div>
                  <h1 className="employee-header-title">Leave History</h1>
                  <p className="employee-header-desc">View your past and upcoming leave records.</p>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {['All Leaves', 'Upcoming', 'Past'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLeaveHistoryTab(tab)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: leaveHistoryTab === tab ? '#2563eb' : 'rgba(255, 255, 255, 0.04)',
                      color: leaveHistoryTab === tab ? '#ffffff' : '#64748b',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      border: leaveHistoryTab === tab ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table Card */}
              <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="employee-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filteredRows = leaveHistoryRecords.filter(row => {
                          if (leaveHistoryTab === 'All' || leaveHistoryTab === 'All Leaves') return true;
                          if (leaveHistoryTab === 'Upcoming') return row.status === 'Upcoming' || row.category === 'Upcoming';
                          if (leaveHistoryTab === 'Past') return row.status === 'Approved' || row.status === 'Canceled' || row.category === 'Past';
                          return true;
                        });

                        if (filteredRows.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.82rem' }}>
                                No leave applications found for "{leaveHistoryTab}".
                              </td>
                            </tr>
                          );
                        }

                        return filteredRows.map((row) => (
                          <tr key={row.id}>
                            <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.type}</td>
                            <td>{row.from}</td>
                            <td>{row.to}</td>
                            <td style={{ fontWeight: 600 }}>{row.days}</td>
                            <td>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: row.status === 'Approved' 
                                  ? 'rgba(16, 185, 129, 0.15)' 
                                  : row.status === 'Upcoming' 
                                    ? 'rgba(56, 189, 248, 0.15)' 
                                    : 'rgba(239, 68, 68, 0.15)',
                                color: row.status === 'Approved' 
                                  ? '#10b981' 
                                  : row.status === 'Upcoming' 
                                    ? '#38bdf8' 
                                    : '#f87171',
                                border: row.status === 'Approved' 
                                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                                  : row.status === 'Upcoming' 
                                    ? '1px solid rgba(56, 189, 248, 0.3)' 
                                    : '1px solid rgba(239, 68, 68, 0.3)'
                              }}>
                                ● {row.status}
                              </span>
                            </td>
                            <td style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{row.reason}</td>
                            <td>
                              <button
                                onClick={() => setSelectedLeaveDetails(row)}
                                className="employee-btn-action"
                                title={`View details for ${row.id}`}
                                style={{
                                  padding: '5px 14px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: 'rgba(37, 99, 235, 0.15)',
                                  border: '1px solid rgba(56, 189, 248, 0.3)',
                                  color: '#38bdf8',
                                  borderRadius: '8px'
                                }}
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 9: TEAM CALENDAR
             ================================================================= */}
          {activeModule === 'team-calendar' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '18px' }}>
                <div>
                  <h1 className="employee-header-title">Team Calendar</h1>
                  <p className="employee-header-desc">View team attendance, leaves and important events.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="employee-cal-nav-btn"
                      onClick={() => {
                        if (teamCalView === 'Week') {
                          if (teamCalWeekIdx > 0) setTeamCalWeekIdx(prev => prev - 1);
                          else {
                            handleCalPrevMonth();
                            setTeamCalWeekIdx(4);
                          }
                        } else {
                          handleCalPrevMonth();
                        }
                      }}
                      title="Previous"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', minWidth: '130px', textAlign: 'center' }}>
                      {teamCalView === 'Week' 
                        ? `${teamWeeks[teamCalWeekIdx]?.label} • ${MONTH_NAMES[calMonth]} ${calYear}` 
                        : `${MONTH_NAMES[calMonth]} ${calYear}`}
                    </span>
                    <button
                      className="employee-cal-nav-btn"
                      onClick={() => {
                        if (teamCalView === 'Week') {
                          if (teamCalWeekIdx < teamWeeks.length - 1) setTeamCalWeekIdx(prev => prev + 1);
                          else {
                            handleCalNextMonth();
                            setTeamCalWeekIdx(0);
                          }
                        } else {
                          handleCalNextMonth();
                        }
                      }}
                      title="Next"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '10px' }}>
                    {['Month', 'Week'].map(view => (
                      <button
                        key={view}
                        onClick={() => setTeamCalView(view)}
                        style={{
                          border: 'none',
                          padding: '4px 14px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: teamCalView === view ? '#2563eb' : 'transparent',
                          color: teamCalView === view ? '#ffffff' : '#64748b',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Present</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} /> WFH</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} /> Leave</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Holiday</span>
              </div>

              {teamCalView === 'Week' ? (
                /* Weekly Team Schedule & Roster View */
                <div style={{ background: '#0d1527', borderRadius: '18px', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>
                        Weekly Team Schedule — {teamWeeks[teamCalWeekIdx]?.label} ({teamWeeks[teamCalWeekIdx]?.dateRange})
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Day-by-day team roster, working shifts and scheduled sync meetings
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {teamWeeks.map((wk, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTeamCalWeekIdx(idx)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: teamCalWeekIdx === idx ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: teamCalWeekIdx === idx ? '#2563eb' : 'rgba(255, 255, 255, 0.03)',
                            color: teamCalWeekIdx === idx ? '#ffffff' : '#94a3b8'
                          }}
                        >
                          {wk.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 7-Day Weekly Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {teamWeeks[teamCalWeekIdx].days.map((dayNum) => {
                      const dt = new Date(calYear, calMonth, dayNum);
                      const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
                      const isToday = dayNum === 16 && calMonth === 9 && calYear === 2026;
                      const isSun = dt.getDay() === 0;
                      const isSat = dt.getDay() === 6;

                      return (
                        <div
                          key={dayNum}
                          style={{
                            background: isToday ? 'rgba(37, 99, 235, 0.12)' : 'rgba(255, 255, 255, 0.025)',
                            border: isToday ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '12px',
                            padding: '12px 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          {/* Day Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px' }}>
                            <div>
                              <span style={{ fontSize: '0.74rem', color: isToday ? '#38bdf8' : '#94a3b8', fontWeight: 700, display: 'block' }}>{dayName}</span>
                              <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>{dayNum} Oct</span>
                            </div>
                            {isToday && (
                              <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                                Today
                              </span>
                            )}
                          </div>

                          {/* Team Roster for this Day */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#ffffff', fontWeight: 600 }}>Rohit S.</span>
                              <span style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: (isSun || (isSat && (dayNum === 10 || dayNum === 24))) ? 'rgba(255,255,255,0.05)' : dayNum === 20 ? 'rgba(2,132,199,0.15)' : 'rgba(16,185,129,0.15)',
                                color: (isSun || (isSat && (dayNum === 10 || dayNum === 24))) ? '#64748b' : dayNum === 20 ? '#38bdf8' : '#10b981'
                              }}>
                                {(isSun || (isSat && (dayNum === 10 || dayNum === 24))) ? 'Off' : dayNum === 20 ? 'WFH' : 'Office'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#cbd5e1' }}>Amit K.</span>
                              <span style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: isSun ? 'rgba(255,255,255,0.05)' : dayNum === 16 ? 'rgba(2,132,199,0.15)' : 'rgba(16,185,129,0.15)',
                                color: isSun ? '#64748b' : dayNum === 16 ? '#38bdf8' : '#10b981'
                              }}>
                                {isSun ? 'Off' : dayNum === 16 ? 'WFH' : 'Office'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#cbd5e1' }}>Priya M.</span>
                              <span style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: isSun ? 'rgba(255,255,255,0.05)' : (dayNum === 16 || dayNum === 17) ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)',
                                color: isSun ? '#64748b' : (dayNum === 16 || dayNum === 17) ? '#a78bfa' : '#10b981'
                              }}>
                                {isSun ? 'Off' : (dayNum === 16 || dayNum === 17) ? 'Leave' : 'Office'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#cbd5e1' }}>Neha P.</span>
                              <span style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: isSun ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.15)',
                                color: isSun ? '#64748b' : '#10b981'
                              }}>
                                {isSun ? 'Off' : 'Office'}
                              </span>
                            </div>
                          </div>

                          {/* Scheduled events on that day */}
                          <div style={{ marginTop: 'auto', paddingTop: '6px', borderTop: '1px dashed rgba(255,255,255,0.06)' }}>
                            {dayNum === 16 && (
                              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.62rem', fontWeight: 700, padding: '3px 6px', borderRadius: '4px', marginBottom: '3px' }}>
                                📌 11:00 AM Sprint Demo
                              </div>
                            )}
                            {dayNum === 19 && (
                              <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.62rem', fontWeight: 700, padding: '3px 6px', borderRadius: '4px' }}>
                                💬 10:00 AM Standup
                              </div>
                            )}
                            {dayNum === 21 && (
                              <div style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontSize: '0.62rem', fontWeight: 700, padding: '3px 6px', borderRadius: '4px' }}>
                                🎯 04:00 PM Tech Review
                              </div>
                            )}
                            {(dayNum !== 16 && dayNum !== 19 && dayNum !== 21) && (
                              <div style={{ color: '#475569', fontSize: '0.62rem', textAlign: 'center' }}>
                                Standard Shift
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Month Grid View */
                <div className="employee-team-grid">
                  {/* Left: Monthly Calendar with Events */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <div className="employee-cal-weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                      {prevPaddingDays.map((d, idx) => (
                        <div key={`cal-prev-${idx}`} style={{ minHeight: '60px', padding: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.74rem' }}>
                          {d}
                        </div>
                      ))}

                      {Array.from({ length: daysInCurrentMonth }, (_, i) => {
                        const day = i + 1;
                        const hasMeeting = day === 7;
                        const hasDemo = day === 14;
                        const hasReview = day === 16;
                        const hasHoliday = day === 22;
                        const hasCall = day === 28;

                        return (
                          <div
                            key={day}
                            style={{
                              minHeight: '60px',
                              padding: '6px',
                              background: '#0d1527',
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              flexDirection: 'column',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#ffffff'
                            }}
                          >
                            <span>{day}</span>
                            {hasMeeting && (
                              <span className="employee-event-chip-cal" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                                Team Meeting
                              </span>
                            )}
                            {hasDemo && (
                              <span className="employee-event-chip-cal" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                                Product Demo
                              </span>
                            )}
                            {hasReview && (
                              <span className="employee-event-chip-cal" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                Project Review
                              </span>
                            )}
                            {hasHoliday && (
                              <span className="employee-event-chip-cal" style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                Diwali Holiday
                              </span>
                            )}
                            {hasCall && (
                              <span className="employee-event-chip-cal" style={{ background: 'rgba(6, 182, 212, 0.18)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                                Client Call
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {nextPaddingDays.map((d, idx) => (
                        <div key={`cal-next-${idx}`} style={{ minHeight: '60px', padding: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', color: '#cbd5e1', fontSize: '0.74rem' }}>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Team Members Status List */}
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>Team Members</h3>

                    <div className="employee-team-members-list">
                      {[
                        { name: 'Rohit S.', role: 'Software Engineer', status: 'Present', color: '#10b981' },
                        { name: 'Amit K.', role: 'Frontend Lead', status: 'WFH', color: '#0284c7' },
                        { name: 'Priya M.', role: 'UI/UX Designer', status: 'Leave', color: '#8b5cf6' },
                        { name: 'Neha P.', role: 'QA Engineer', status: 'Present', color: '#10b981' },
                        { name: 'Vikas R.', role: 'Backend Engineer', status: 'Present', color: '#10b981' }
                      ].map((m, i) => (
                        <div key={i} className="employee-team-member-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(6, 182, 212, 0.2))', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#38bdf8' }}>
                              {m.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{m.name}</div>
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{m.role}</div>
                            </div>
                          </div>

                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: m.color }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: m.color }} />
                            {m.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 10: NOTIFICATIONS
             ================================================================= */}
          {activeModule === 'notifications' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 className="employee-header-title">Notifications</h1>
                  <p className="employee-header-desc">Stay updated with important announcements and updates.</p>
                </div>
                {notificationsList.some(n => n.isUnread) && (
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="employee-btn-action"
                    style={{ fontSize: '0.76rem', padding: '7px 14px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCircle size={14} color="#10b981" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['All', 'Attendance', 'Leaves', 'WFH', 'Company', 'Reminders'].map(t => {
                  const count = t === 'All' 
                    ? notificationsList.length 
                    : notificationsList.filter(n => n.category === t).length;
                  const unreadCount = t === 'All' 
                    ? notificationsList.filter(n => n.isUnread).length 
                    : notificationsList.filter(n => n.category === t && n.isUnread).length;

                  return (
                    <button
                      key={t}
                      onClick={() => setNotifTab(t)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: notifTab === t ? '#2563eb' : 'rgba(255, 255, 255, 0.04)',
                        color: notifTab === t ? '#ffffff' : '#94a3b8',
                        border: notifTab === t ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: notifTab === t ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{t}</span>
                      {count > 0 && (
                        <span style={{
                          fontSize: '0.65rem',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          background: notifTab === t ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                          color: '#ffffff'
                        }}>
                          {count}
                        </span>
                      )}
                      {unreadCount > 0 && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Notifications List */}
              <div style={{ background: '#0d1527', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
                {(() => {
                  const filtered = notificationsList.filter(n => notifTab === 'All' || n.category === notifTab);
                  if (filtered.length === 0) {
                    return (
                      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                        <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#cbd5e1' }}>No notifications found</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>There are no alerts in the "{notifTab}" category right now.</div>
                      </div>
                    );
                  }

                  return filtered.map((item, idx) => {
                    const Icon = item.icon || Bell;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.actionModule) setActiveModule(item.actionModule);
                          setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, isUnread: false } : n));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                          background: item.isUnread ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = item.isUnread ? 'rgba(37, 99, 235, 0.05)' : 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                            <Icon size={18} />
                            {item.isUnread && (
                              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.86rem', fontWeight: item.isUnread ? 800 : 700, color: '#ffffff' }}>{item.title}</span>
                              <span style={{
                                fontSize: '0.64rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: item.color,
                                border: `1px solid ${item.color}35`
                              }}>
                                {item.category}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>{item.desc}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {item.time}
                          </span>
                          <button
                            onClick={(e) => handleDismissNotification(item.id, e)}
                            title="Dismiss notification"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 11: COMPANY POLICIES
             ================================================================= */}
          {activeModule === 'policies' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '18px' }}>
                <div>
                  <h1 className="employee-header-title">Company Policies</h1>
                  <p className="employee-header-desc">Read and stay updated with company policies and guidelines.</p>
                </div>
              </div>

              {/* Search & Filter Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                  <input
                    type="text"
                    className="employee-input-control"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Search policies..."
                    value={policySearchQuery}
                    onChange={(e) => setPolicySearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="employee-input-control"
                  style={{ width: '180px' }}
                  value={policyCategoryFilter}
                  onChange={(e) => setPolicyCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="HR">HR Policies</option>
                  <option value="IT">IT & Security</option>
                  <option value="General">General Conduct</option>
                  <option value="Finance">Finance & Reimbursements</option>
                </select>
              </div>

              {/* 6 Document Cards Grid */}
              <div className="employee-policies-grid">
                {[
                  {
                    title: 'Work From Home Policy',
                    category: 'HR',
                    desc: 'Guidelines on monthly remote work allowance (5 days/mo), core online hours (10:00 AM - 05:00 PM), and VPN protocols.',
                    date: 'Updated on 10 Aug 2026',
                    color: '#38bdf8',
                    bg: 'rgba(56, 189, 248, 0.15)'
                  },
                  {
                    title: 'Sick & Casual Leave Policy',
                    category: 'HR',
                    desc: 'Entitlement rules for 12 casual leaves, 5 sick leaves, emergency approvals, and year-end carry forward limits.',
                    date: 'Updated on 10 Aug 2026',
                    color: '#818cf8',
                    bg: 'rgba(99, 102, 241, 0.15)'
                  },
                  {
                    title: 'Code of Professional Conduct',
                    category: 'General',
                    desc: 'Workplace ethics, POSH compliance, anti-bribery policies, and client data confidentiality expectations.',
                    date: 'Updated on 01 Sep 2026',
                    color: '#34d399',
                    bg: 'rgba(52, 211, 153, 0.15)'
                  },
                  {
                    title: 'Information & IT Security Policy',
                    category: 'IT',
                    desc: 'Mandatory multi-factor authentication, enterprise VPN usage, zero-trust network access, and incident reporting.',
                    date: 'Updated on 20 Aug 2026',
                    color: '#c084fc',
                    bg: 'rgba(192, 132, 252, 0.15)'
                  },
                  {
                    title: 'Biometric Attendance & Kiosk Policy',
                    category: 'HR',
                    desc: 'Standard shift timings, 15-minute late check-in grace period, face-scan kiosk rules, and miss punch regularization.',
                    date: 'Updated on 15 Jul 2026',
                    color: '#fbbf24',
                    bg: 'rgba(251, 191, 36, 0.15)'
                  },
                  {
                    title: 'Travel & Expense Reimbursement',
                    category: 'Finance',
                    desc: 'Per diem allowances, local conveyance reimbursement rules, hotel bookings, and submission turnaround within 7 days.',
                    date: 'Updated on 01 Jul 2026',
                    color: '#22d3ee',
                    bg: 'rgba(34, 211, 238, 0.15)'
                  }
                ]
                  .filter(doc => {
                    const matchesSearch = !policySearchQuery || doc.title.toLowerCase().includes(policySearchQuery.toLowerCase()) || doc.desc.toLowerCase().includes(policySearchQuery.toLowerCase());
                    const matchesCategory = policyCategoryFilter === 'All' || doc.category === policyCategoryFilter;
                    return matchesSearch && matchesCategory;
                  })
                  .map((doc, idx) => (
                    <div key={idx} className="employee-policy-card">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div className="employee-policy-icon-wrap" style={{ background: doc.bg, color: doc.color, margin: 0 }}>
                            <FileText size={20} />
                          </div>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: doc.color,
                            border: `1px solid ${doc.color}40`,
                            textTransform: 'uppercase'
                          }}>
                            {doc.category} Policy
                          </span>
                        </div>
                        <div className="employee-policy-title">{doc.title}</div>
                        <div className="employee-policy-date" style={{ marginBottom: '10px' }}>{doc.date}</div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                          {doc.desc}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button
                          onClick={() => setSelectedPolicyDoc(doc)}
                          className="employee-btn-primary"
                          style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.76rem' }}
                        >
                          <Eye size={13} />
                          <span>Read Policy</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPolicy(doc)}
                          className="employee-btn-action"
                          style={{ padding: '8px 12px', fontSize: '0.76rem' }}
                          title="Download Policy Document"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 12: HELP & SUPPORT
             ================================================================= */}
          {activeModule === 'help' && (
            <div>
              {/* Header */}
              <div className="employee-header" style={{ marginBottom: '20px' }}>
                <div>
                  <h1 className="employee-header-title">Help & Support</h1>
                  <p className="employee-header-desc">Need help, raise a request or contact the support team.</p>
                </div>
              </div>

              <div className="employee-help-grid">
                {/* Left: Raise a Support Ticket Form */}
                <div className="employee-form-box">
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
                    Raise a Support Ticket
                  </div>

                  <form onSubmit={handleSupportTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="employee-form-label-title">Category</label>
                      <select
                        className="employee-input-control"
                        value={supportTicketForm.category}
                        onChange={(e) => setSupportTicketForm({ ...supportTicketForm, category: e.target.value })}
                      >
                        <option value="Attendance Issue">Attendance Issue</option>
                        <option value="Leave Balance">Leave Balance Query</option>
                        <option value="WFH Request">WFH Request</option>
                        <option value="System Login Issue">System Login Issue</option>
                        <option value="Other">Other Query</option>
                      </select>
                    </div>

                    <div>
                      <label className="employee-form-label-title">Subject</label>
                      <input
                        type="text"
                        className="employee-input-control"
                        placeholder="Enter subject"
                        value={supportTicketForm.subject}
                        onChange={(e) => setSupportTicketForm({ ...supportTicketForm, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="employee-form-label-title">Description</label>
                      <textarea
                        rows={4}
                        className="employee-input-control"
                        placeholder="Describe your issue..."
                        value={supportTicketForm.desc}
                        onChange={(e) => setSupportTicketForm({ ...supportTicketForm, desc: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="employee-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.86rem', marginTop: '6px' }}
                    >
                      Submit Ticket
                    </button>
                  </form>
                </div>

                {/* Right: Quick Help & Contact Support */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                        Frequently Asked Questions
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>6 Guides</span>
                    </div>

                    <div className="employee-faq-list">
                      {[
                        {
                          q: 'How to mark attendance?',
                          a: 'Navigate to "Mark Attendance" in the sidebar. Choose either "Kiosk Mode" to scan your face via webcam or "QR Code" kiosk, then click "Checked In" or "Check Out".'
                        },
                        {
                          q: 'How to apply for WFH?',
                          a: 'Open "Apply WFH", pick your From and To dates, select a quick reason chip (e.g. Client Meeting, Remote Project), write your brief work plan, and click Submit.'
                        },
                        {
                          q: 'Leave balance & annual quota details',
                          a: 'Every full-time employee receives 12 Casual Leaves, 5 Sick Leaves, and earned leaves. You can check your live balance in the "Apply Leave" module.'
                        },
                        {
                          q: 'How to contact HR Operations?',
                          a: 'Our HR team is available Mon-Fri, 9:00 AM - 6:00 PM IST at hr@vorldx.com or via emergency WhatsApp line at +91 9876543210.'
                        },
                        {
                          q: 'System login or biometric issue?',
                          a: 'If biometric scanning fails or camera access is blocked, ensure camera permissions are allowed in your browser settings or contact IT Support.'
                        },
                        {
                          q: 'Missed check-out regularization',
                          a: 'Raise a regularization ticket using the support form on the left within 48 hours. Your reporting manager will review and approve.'
                        }
                      ].map((faq, i) => {
                        const isOpen = expandedFaq === i;
                        return (
                          <div
                            key={i}
                            style={{
                              background: isOpen ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '12px',
                              border: isOpen ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                              overflow: 'hidden',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div
                              onClick={() => setExpandedFaq(isOpen ? null : i)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 14px',
                                cursor: 'pointer',
                                color: isOpen ? '#38bdf8' : '#e2e8f0',
                                fontSize: '0.82rem',
                                fontWeight: 700
                              }}
                            >
                              <span>{faq.q}</span>
                              <ChevronDown
                                size={15}
                                color={isOpen ? '#38bdf8' : '#94a3b8'}
                                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                              />
                            </div>
                            {isOpen && (
                              <div style={{
                                padding: '0 14px 12px 14px',
                                fontSize: '0.78rem',
                                color: '#94a3b8',
                                lineHeight: 1.5,
                                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                paddingTop: '8px'
                              }}>
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: '#0d1527', borderRadius: '18px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                      Contact Support Desk
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                            <Mail size={15} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>HR Operations Email</div>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>hr@vorldx.com</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('hr@vorldx.com');
                            triggerToast('✓ Copied hr@vorldx.com to clipboard');
                          }}
                          className="employee-btn-action"
                          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        >
                          Copy
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <Smartphone size={15} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Helpline Support</div>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>+91 9876543210</div>
                          </div>
                        </div>
                        <button
                          onClick={() => triggerToast('📞 Initiating call to VorldX HR Helpline...')}
                          className="employee-btn-action"
                          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        >
                          Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =====================================================================
          INTERACTIVE MODALS
         ===================================================================== */}
      {/* MODAL 1: MARK ATTENDANCE */}
      {showPunchModal && (
        <div className="employee-modal-overlay">
          <div className="employee-modal-content" style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <QrCode size={30} color="#ffffff" />
            </div>

            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: '0 0 6px 0' }}>
              Mark Attendance (QR Punch)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 20px 0' }}>
              Scan the office kiosk QR code or use Instant Punch to log your attendance.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setPunchAction('Check In')}
                className={`employee-tab-btn ${punchAction === 'Check In' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px' }}
              >
                Check In
              </button>
              <button
                type="button"
                onClick={() => setPunchAction('Check Out')}
                className={`employee-tab-btn ${punchAction === 'Check Out' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px' }}
              >
                Check Out
              </button>
            </div>

            <div style={{
              border: '2px dashed rgba(56, 189, 248, 0.4)',
              borderRadius: '12px',
              padding: '24px',
              background: 'rgba(56, 189, 248, 0.05)',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                Office QR Scanner Ready
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                Location: Lucknow HQ • GPS Verified
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPunchModal(false)}
                className="employee-btn-action"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePerformPunch}
                className="employee-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Confirm {punchAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY WFH */}
      {showNewWfhModal && (
        <div className="employee-modal-overlay">
          <div className="employee-modal-content">
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px' }}>Apply for Work From Home</h3>
            <form onSubmit={handleCreateWfh}>
              <div style={{ marginBottom: '14px' }}>
                <label className="employee-field-label">Select Date</label>
                <input
                  type="date"
                  required
                  value={newWfhForm.date}
                  onChange={(e) => setNewWfhForm({ ...newWfhForm, date: e.target.value })}
                  className="employee-form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="employee-field-label">Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Family function, doctor appointment..."
                  value={newWfhForm.reason}
                  onChange={(e) => setNewWfhForm({ ...newWfhForm, reason: e.target.value })}
                  className="employee-form-input"
                  style={{ height: 'auto', padding: '10px 12px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewWfhModal(false)}
                  className="employee-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="employee-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: APPLY LEAVE */}
      {showNewLeaveModal && (
        <div className="employee-modal-overlay">
          <div className="employee-modal-content">
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px' }}>Submit Leave Application</h3>
            <form onSubmit={handleCreateLeave}>
              <div style={{ marginBottom: '12px' }}>
                <label className="employee-field-label">Leave Type</label>
                <select
                  value={newLeaveForm.leave_type}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, leave_type: e.target.value })}
                  className="employee-form-input"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="employee-field-label">From Date</label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.from_date}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, from_date: e.target.value })}
                    className="employee-form-input"
                  />
                </div>
                <div>
                  <label className="employee-field-label">To Date</label>
                  <input
                    type="date"
                    required
                    value={newLeaveForm.to_date}
                    onChange={(e) => setNewLeaveForm({ ...newLeaveForm, to_date: e.target.value })}
                    className="employee-form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="employee-field-label">Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Reason for leave..."
                  value={newLeaveForm.reason}
                  onChange={(e) => setNewLeaveForm({ ...newLeaveForm, reason: e.target.value })}
                  className="employee-form-input"
                  style={{ height: 'auto', padding: '10px 12px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewLeaveModal(false)}
                  className="employee-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="employee-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT PROFILE */}
      {showEditProfileModal && (
        <div className="employee-modal-overlay">
          <div className="employee-modal-content">
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px' }}>Edit Personal Information</h3>
            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '12px' }}>
                <label className="employee-field-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  className="employee-form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="employee-field-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  className="employee-form-input"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="employee-field-label">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                  className="employee-form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="employee-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="employee-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DETAILED MONTHLY ATTENDANCE REPORT (VIEW REPORT) */}
      {showReportModal && (
        <div className="employee-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="employee-modal-content" style={{ maxWidth: '820px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={20} color="#38bdf8" />
                  Monthly Attendance Statement
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  {currentUser.name} ({currentUser.id}) • {currentUser.department} • {MONTH_NAMES[calMonth]} {calYear}
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Summary Statistics Mini-Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{daysInCurrentMonth}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Days</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>18</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Present</div>
              </div>
              <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>3</div>
                <div style={{ fontSize: '0.72rem', color: '#a855f7' }}>WFH</div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>2</div>
                <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>Leave</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>3</div>
                <div style={{ fontSize: '0.72rem', color: '#ef4444' }}>Absent</div>
              </div>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>8h 15m</div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Avg Hours</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {['All', 'Present', 'WFH', 'Leave', 'Absent', 'Weekend'].map(f => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  style={{
                    background: reportFilter === f ? '#0284c7' : 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid ' + (reportFilter === f ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'),
                    color: reportFilter === f ? '#ffffff' : '#94a3b8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Scrollable Day-by-Day Table */}
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', marginBottom: '16px' }}>
              <table className="employee-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Mode / Location</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: daysInCurrentMonth }, (_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(calYear, calMonth, day);
                    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const att = getDayAttendanceInfo(day);

                    if (reportFilter !== 'All' && att.status !== reportFilter) {
                      return null;
                    }

                    const checkIn = (att.status === 'Absent' || att.status === 'Weekend') ? '--' : '09:05 AM';
                    const checkOut = (att.status === 'Absent' || att.status === 'Weekend') ? '--' : '05:30 PM';
                    const workHours = (att.status === 'Absent' || att.status === 'Weekend') ? '0h 00m' : att.status === 'WFH' ? '8h 00m' : '8h 25m';
                    const location = att.status === 'WFH' ? 'Remote (WFH)' : (att.status === 'Absent' || att.status === 'Weekend') ? 'N/A' : 'Office (via QR)';

                    return (
                      <tr key={day}>
                        <td className="employee-td-num">{day}</td>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{day} {MONTH_NAMES[calMonth]} {calYear}</td>
                        <td style={{ color: '#94a3b8' }}>{dayOfWeek}</td>
                        <td>
                          <span className={`employee-status-pill ${att.status.toLowerCase()}`}>
                            {att.status}
                          </span>
                        </td>
                        <td style={{ color: '#cbd5e1' }}>{checkIn}</td>
                        <td style={{ color: '#cbd5e1' }}>{checkOut}</td>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{workHours}</td>
                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{location}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleExportAttendanceStatement}
                  className="employee-btn-primary"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <Download size={14} />
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="employee-btn-action"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <Printer size={14} />
                  Print Statement
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="employee-btn-action"
                style={{ fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DETAILED REQUEST DETAILS (VIEW ACTION) */}
      {selectedRequestDetails && (
        <div className="employee-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="employee-modal-content" style={{ maxWidth: '520px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '8px', borderRadius: '8px' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                    Request Details • {selectedRequestDetails.id}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {selectedRequestDetails.type === 'wfh' ? 'Work From Home Application' : `${selectedRequestDetails.leave_type} Application`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequestDetails(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.84rem' }}>Current Status</span>
                <span className={`employee-status-pill ${selectedRequestDetails.status.toLowerCase()}`}>
                  ● {selectedRequestDetails.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Employee</div>
                  <div style={{ color: '#ffffff', fontSize: '0.86rem', fontWeight: 600, marginTop: '4px' }}>{currentUser.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{currentUser.id} • {currentUser.designation}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Requested Dates</div>
                  <div style={{ color: '#38bdf8', fontSize: '0.86rem', fontWeight: 600, marginTop: '4px' }}>
                    {selectedRequestDetails.type === 'wfh' ? selectedRequestDetails.date : `${selectedRequestDetails.from} to ${selectedRequestDetails.to}`}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                    {selectedRequestDetails.type === 'wfh' ? '1 Day (Remote Work)' : `${selectedRequestDetails.days} Days Total`}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Reason / Purpose</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.86rem', marginTop: '6px', lineHeight: 1.4 }}>
                  "{selectedRequestDetails.reason}"
                </div>
              </div>

              {/* Timeline */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Timeline & Audit</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                    <CheckCircle size={13} /> Applied on: {selectedRequestDetails.applied_on || selectedRequestDetails.from || '12 Oct 2026'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                    <Clock size={13} /> Approver: Amit Kumar (Manager - Operations)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: selectedRequestDetails.status === 'Approved' ? '#10b981' : selectedRequestDetails.status === 'Rejected' ? '#ef4444' : '#f59e0b' }}>
                    <AlertCircle size={13} />
                    Current Status: {selectedRequestDetails.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadSlip(selectedRequestDetails)}
                  className="employee-btn-action"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <Download size={14} />
                  Download Slip
                </button>

                {selectedRequestDetails.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleWithdrawRequest(selectedRequestDetails.id, selectedRequestDetails.type)}
                    className="employee-btn-action"
                    style={{ gap: '6px', fontSize: '0.82rem', color: '#f59e0b', borderColor: '#f59e0b' }}
                  >
                    <X size={14} />
                    Withdraw
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequestDetails(null)}
                className="employee-btn-primary"
                style={{ fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: COMPANY ANNOUNCEMENT */}
      {showAnnouncementModal && (
        <div className="employee-modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
          <div className="employee-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
              }}>
                <Megaphone size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 800 }}>
                  Official Company Announcement
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                  Annual Health Checkup Camp 2026
                </h3>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.84rem',
              color: '#cbd5e1'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color="#38bdf8" />
                <span><strong>Date:</strong> 25th October 2026 (Sunday)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#34d399" />
                <span><strong>Timings:</strong> 09:30 AM to 04:30 PM IST</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={16} color="#fbbf24" />
                <span><strong>Venue:</strong> HQ Tower B, 3rd Floor Wellness Lounge</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', lineHeight: 1.5, color: '#94a3b8', fontSize: '0.8rem' }}>
                Comprehensive health & wellness diagnostics: Complete Hemogram, Lipid Profile, Cardiac ECG, Eye & Dental Screening, and 1-on-1 consultations with senior health specialists. Healthy breakfast & refreshments provided.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setToastMsg('Slot confirmed! Calendar invite sent to rohit.s@vorldx.com.');
                  setTimeout(() => setToastMsg(''), 4000);
                }}
                className="employee-btn-primary"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', fontSize: '0.82rem' }}
              >
                Book My Slot
              </button>
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(false)}
                className="employee-btn-action"
                style={{ fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: POLICY DOCUMENT READER */}
      {selectedPolicyDoc && (
        <div className="employee-modal-overlay" onClick={() => setSelectedPolicyDoc(null)}>
          <div className="employee-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: selectedPolicyDoc.bg || 'rgba(56, 189, 248, 0.15)',
                  color: selectedPolicyDoc.color || '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: selectedPolicyDoc.color || '#38bdf8' }}>
                      {selectedPolicyDoc.category} Policy • v2.4
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>•</span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{selectedPolicyDoc.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: '2px 0 0 0' }}>
                    {selectedPolicyDoc.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPolicyDoc(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              lineHeight: 1.6
            }}>
              <div>
                <strong style={{ color: '#ffffff' }}>1. Scope & Objective:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>
                  This policy outlines the official corporate operating standards for all full-time employees, contractors, and interns at VorldX Technologies Pvt Ltd. It ensures workplace safety, statutory compliance, and fair operational governance.
                </p>
              </div>

              <div>
                <strong style={{ color: '#ffffff' }}>2. Policy Overview & Key Guidelines:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>
                  {selectedPolicyDoc.desc}
                </p>
              </div>

              <div>
                <strong style={{ color: '#ffffff' }}>3. Eligibility & Procedure:</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', color: '#94a3b8' }}>
                  <li>Requests must be raised via the VorldX Attendance 360 portal at least 24 hours prior.</li>
                  <li>Automatic workflow routing to designated Department Reporting Manager for approval.</li>
                  <li>All remote access must utilize the secure VorldX Zero-Trust VPN gateway.</li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', fontSize: '0.74rem', color: '#64748b' }}>
                Issued by VorldX Human Resources & Compliance Directorate • CIN: U62099UP2026PTC245598 • Lucknow HQ
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDownloadPolicy(selectedPolicyDoc)}
                className="employee-btn-primary"
                style={{ fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Download Document</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPolicyDoc(null)}
                className="employee-btn-action"
                style={{ fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHOOSE AVATAR PRESET OR UPLOAD CUSTOM DP */}
      {showAvatarPickerModal && (
        <div className="employee-modal-overlay" style={{ zIndex: 1200 }}>
          <div className="employee-modal-content" style={{ maxWidth: '480px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Change Profile Photo (DP)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPickerModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#94a3b8' }}>
              Choose from our curated professional corporate avatars or upload your custom picture from your device.
            </p>

            {/* Upload Custom DP Option Button */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'background 0.2s'
                }}
              >
                <Upload size={16} />
                <span>Upload Custom Photo From Device</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
              Or Select Professional Preset Avatar:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {PRESET_AVATARS.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPresetAvatar(av.url, av.name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px 8px',
                    borderRadius: '12px',
                    background: currentUser.avatar === av.url ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    border: currentUser.avatar === av.url ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                  onMouseLeave={(e) => {
                    if (currentUser.avatar !== av.url) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <img
                    src={av.url}
                    alt={av.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', marginBottom: '6px' }}
                  />
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#e2e8f0', textAlign: 'center', lineHeight: 1.2 }}>
                    {av.name}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAvatarPickerModal(false)}
                className="employee-btn-action"
                style={{ fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD NEW EMPLOYEE DOCUMENT */}
      {showUploadDocModal && (
        <div className="employee-modal-overlay" style={{ zIndex: 1200 }}>
          <div className="employee-modal-content" style={{ maxWidth: '500px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>Upload Compliance Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadDocModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadNewDocSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label className="employee-field-label">Document Category / Title</label>
                <select
                  className="employee-input-control"
                  style={{ width: '100%', background: '#0b1324', color: '#ffffff', borderRadius: '8px', padding: '8px 12px' }}
                  value={newDocForm.title}
                  onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                >
                  <option value="National ID Card (Aadhaar)">National ID Card (Aadhaar)</option>
                  <option value="PAN Card Copy">PAN Card Copy</option>
                  <option value="Offer Letter & Employment Agreement">Offer Letter & Employment Agreement</option>
                  <option value="Degree Certificates">Degree Certificates</option>
                  <option value="Salary Slip / Bank Statement">Salary Slip / Bank Statement</option>
                  <option value="Passport Copy">Passport Copy</option>
                  <option value="Experience & Relieving Letter">Experience & Relieving Letter</option>
                  <option value="Other">Other Document (Custom Title)</option>
                </select>
              </div>

              {newDocForm.title === 'Other' && (
                <div style={{ marginBottom: '14px' }}>
                  <label className="employee-field-label">Specify Document Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electricity Bill / Address Proof"
                    className="employee-form-input"
                    value={newDocForm.customTitle}
                    onChange={(e) => setNewDocForm({ ...newDocForm, customTitle: e.target.value })}
                  />
                </div>
              )}

              <div style={{ marginBottom: '18px' }}>
                <label className="employee-field-label">Select File to Upload</label>
                <div style={{
                  border: '2px dashed rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  background: 'rgba(56, 189, 248, 0.02)',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewDocForm({ ...newDocForm, selectedFile: e.target.files[0] });
                      }
                    }}
                  />
                  <Upload size={26} color="#38bdf8" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                    {newDocForm.selectedFile ? newDocForm.selectedFile.name : 'Click or Drag & Drop File Here'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                    {newDocForm.selectedFile 
                      ? `${(newDocForm.selectedFile.size / 1024).toFixed(0)} KB • Ready to upload`
                      : 'Accepts PDF, JPG, PNG, DOC (Max 10MB)'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="employee-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="employee-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW & PREVIEW EMPLOYEE DOCUMENT */}
      {selectedPreviewDoc && (
        <div className="employee-modal-overlay" style={{ zIndex: 1200 }}>
          <div className="employee-modal-content" style={{ maxWidth: '580px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>{selectedPreviewDoc.title}</h3>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {selectedPreviewDoc.filename} • {selectedPreviewDoc.size}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewDoc(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Digital Verification Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '18px',
              position: 'relative',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px dashed rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="#38bdf8" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>VORLDX INDUSTRIES COMPLIANCE</span>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  ● {selectedPreviewDoc.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.76rem', marginBottom: '14px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Employee Name</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{currentUser.name}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Employee ID</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{currentUser.id}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Document Type</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedPreviewDoc.type || selectedPreviewDoc.title}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Last Upload Date</span>
                  <span style={{ color: '#cbd5e1' }}>{selectedPreviewDoc.uploadedAt}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.72rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, marginBottom: '2px' }}>
                  <ShieldCheck size={14} />
                  <span>HR & Compliance Verified (SHA-256 Validated)</span>
                </div>
                <div>This document is verified and encrypted under VorldX Enterprise Data Protection Policies.</div>
              </div>
            </div>

            {/* Actions: Download + Replace Upload + Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Upload size={14} />
                <span>Replace Document</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleSingleDocUpload(selectedPreviewDoc.id, e);
                    setSelectedPreviewDoc(null);
                  }}
                />
              </label>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(selectedPreviewDoc)}
                  className="employee-btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="employee-btn-action"
                  style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW LEAVE APPLICATION DETAILS */}
      {selectedLeaveDetails && (
        <div className="employee-modal-overlay" style={{ zIndex: 1200 }} onClick={() => setSelectedLeaveDetails(null)}>
          <div className="employee-modal-content" style={{ maxWidth: '560px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>Leave Details</h3>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: selectedLeaveDetails.status === 'Approved' 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : selectedLeaveDetails.status === 'Upcoming' 
                          ? 'rgba(56, 189, 248, 0.15)' 
                          : 'rgba(239, 68, 68, 0.15)',
                      color: selectedLeaveDetails.status === 'Approved' 
                        ? '#10b981' 
                        : selectedLeaveDetails.status === 'Upcoming' 
                          ? '#38bdf8' 
                          : '#f87171',
                      border: selectedLeaveDetails.status === 'Approved'
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : selectedLeaveDetails.status === 'Upcoming'
                          ? '1px solid rgba(56, 189, 248, 0.3)'
                          : '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      ● {selectedLeaveDetails.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Ref: {selectedLeaveDetails.id} • {selectedLeaveDetails.type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeaveDetails(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Leave Details Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.7))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.76rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Leave Type</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedLeaveDetails.type}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Duration</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                    {selectedLeaveDetails.from} to {selectedLeaveDetails.to} ({selectedLeaveDetails.days} Day{selectedLeaveDetails.days > 1 ? 's' : ''})
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Applied On</span>
                  <span style={{ color: '#cbd5e1' }}>{selectedLeaveDetails.appliedOn || '18 Oct 2026 10:15 AM'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Approver</span>
                  <span style={{ color: '#cbd5e1' }}>{selectedLeaveDetails.approvedBy || 'Amit Kumar (Engineering Manager)'}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', marginBottom: '2px' }}>Reason for Application:</span>
                <span style={{ color: '#e2e8f0', fontSize: '0.78rem', lineHeight: 1.4 }}>{selectedLeaveDetails.reason}</span>
              </div>

              {/* Status Timeline */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', marginBottom: '6px' }}>Audit & Approval Trail:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} color="#10b981" />
                    <span>Applied by {currentUser.name} on {selectedLeaveDetails.appliedOn || '18 Oct 2026'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} color="#10b981" />
                    <span>Approved by {selectedLeaveDetails.approvedBy || 'Manager'} on {selectedLeaveDetails.approvedAt || '18 Oct 2026'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} color="#38bdf8" />
                    <span>Payroll & Attendance Balance synchronized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDownloadLeaveSlip(selectedLeaveDetails)}
                className="employee-btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} />
                <span>Download Leave Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLeaveDetails(null)}
                className="employee-btn-action"
                style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROHIT PHONE APP REAL-TIME ATTENDANCE SCAN & SUBMISSION MODAL */}
      {showPhoneScanModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '430px',
            background: '#090e1a',
            borderRadius: '24px',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.25)',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            {/* Phone Notch Bar */}
            <div style={{ height: '22px', background: '#040711', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '60px', height: '4px', borderRadius: '4px', background: '#334155' }} />
            </div>

            {/* Header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <Smartphone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>Rohit's Phone App</div>
                  <div style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    QR Code Scanner Active
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowPhoneScanModal(false); setPhonePunchSuccess(null); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '18px 20px' }}>
              {/* Real-Time Live Clock Display */}
              <div style={{
                textAlign: 'center',
                padding: '14px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))',
                borderRadius: '16px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Clock size={13} /> Real-Time Live System Clock
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '1px', fontFamily: 'monospace' }}>
                  {liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                  {liveClockTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Scanned QR & Employee Details */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.78rem'
              }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Employee Name:</div>
                  <strong style={{ color: '#ffffff' }}>Rohit Sharma</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Employee ID:</div>
                  <strong style={{ color: '#38bdf8' }}>VX001</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Punch Date:</div>
                  <strong style={{ color: '#e2e8f0' }}>{liveClockTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Kiosk Location:</div>
                  <strong style={{ color: '#10b981' }}>HQ Main Entrance (Verified)</strong>
                </div>
              </div>

              {/* Punch Mode Selection (In-Time vs Out-Time) */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                  SELECT ATTENDANCE PUNCH TYPE:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setPhonePunchAction('CHECK_IN')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: phonePunchAction === 'CHECK_IN' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: phonePunchAction === 'CHECK_IN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: phonePunchAction === 'CHECK_IN' ? '#34d399' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CheckCircle size={15} color={phonePunchAction === 'CHECK_IN' ? '#34d399' : '#64748b'} />
                    <span>Clock In (In-Time)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhonePunchAction('CHECK_OUT')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: phonePunchAction === 'CHECK_OUT' ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: phonePunchAction === 'CHECK_OUT' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: phonePunchAction === 'CHECK_OUT' ? '#f87171' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <LogOut size={15} color={phonePunchAction === 'CHECK_OUT' ? '#f87171' : '#64748b'} />
                    <span>Clock Out (Out-Time)</span>
                  </button>
                </div>
              </div>

              {/* Real-Time Punch Preview Box */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: phonePunchAction === 'CHECK_IN' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${phonePunchAction === 'CHECK_IN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Real-Time Punch Marking:</span>
                  <span style={{ fontSize: '0.72rem', color: phonePunchAction === 'CHECK_IN' ? '#34d399' : '#f87171', fontWeight: 800 }}>
                    {phonePunchAction === 'CHECK_IN' ? '🟢 Check-In Mode' : '🔴 Check-Out Mode'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 700 }}>
                    {phonePunchAction === 'CHECK_IN' ? 'In-Time (Arrival):' : 'Out-Time (Departure):'}
                  </span>
                  <span style={{ fontSize: '1.15rem', color: phonePunchAction === 'CHECK_IN' ? '#34d399' : '#f87171', fontWeight: 900 }}>
                    {liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                  Clicking submit will mark this real-time attendance directly into the HR SQLite Database.
                </div>
              </div>

              {/* Success Alert if already submitted */}
              {phonePunchSuccess && (
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
                    ✓ Attendance Successfully Submitted in Real Time!
                  </div>
                  <div>{phonePunchSuccess.message}</div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                disabled={phonePunchLoading}
                onClick={async () => {
                  setPhonePunchLoading(true);
                  const liveTimeStr = liveClockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const res = await handlePunchAttendance(liveTimeStr, phonePunchAction);
                  setPhonePunchLoading(false);
                  if (res && res.success) {
                    setPhonePunchSuccess(res);
                    setTimeout(() => {
                      setShowPhoneScanModal(false);
                      setPhonePunchSuccess(null);
                    }, 2200);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: phonePunchAction === 'CHECK_IN'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: phonePunchLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: phonePunchAction === 'CHECK_IN'
                    ? '0 6px 20px rgba(16, 185, 129, 0.4)'
                    : '0 6px 20px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                {phonePunchLoading ? (
                  <span>Marking Real-Time Attendance...</span>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Submit Attendance ({phonePunchAction === 'CHECK_IN' ? 'Clock In' : 'Clock Out'})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setShowPhoneScanModal(false); setPhonePunchSuccess(null); }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="employee-toast-notification">
          <CheckCircle size={16} color="#10b981" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

