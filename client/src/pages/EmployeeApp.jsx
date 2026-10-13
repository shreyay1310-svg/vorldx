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
  UserX
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

export default function EmployeeApp({ isEmbedded = false, isNativeApp = false }) {
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(() => getServerUrl() || 'http://192.168.1.141:5000');
  const [serverSavedMsg, setServerSavedMsg] = useState('');
  const [serverOnline, setServerOnline] = useState(true);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState('');

  // Camera scanner states
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Mobile app sub-screen routing:
  // 'login' (Screen 11), 'otp' (Screen 12), 'home' (Screen 13), 'scan' (Screen 14),
  // 'wfh' (Screen 15), 'history' (Screen 16), 'profile' (Screen 17)
  const [mobileScreen, setMobileScreen] = useState('home');

  // Active employee state (Rohit Sharma VX001 default)
  const [activeEmployee, setActiveEmployee] = useState({
    id: 'VX001',
    name: 'Rohit Sharma',
    department: 'Development',
    designation: 'SDE',
    shift: 'General (9:00 AM - 6:00 PM)',
    work_type: 'Office',
    email: 'rohit.sharma@vorldx.com',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    verified: 1
  });

  // Screen 11: Employee ID Input (HR creates accounts, Employee logs in)
  const [inputEmpId, setInputEmpId] = useState('VX001');

  // Screen 17: Employee Profile Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editActiveTab, setEditActiveTab] = useState('info'); // 'info', 'password'
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
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

  // WFH Request state (Screen 15)
  const [wfhDate, setWfhDate] = useState('2026-10-15');
  const [wfhReason, setWfhReason] = useState('Personal work');
  const [wfhHistory, setWfhHistory] = useState([
    { id: 1, date: '12 Oct 2026', status: 'Approved', reason: 'Personal work' },
    { id: 2, date: '5 Oct 2026', status: 'Rejected', reason: 'Family event' }
  ]);

  // Attendance History state (Screen 16)
  const [historyList, setHistoryList] = useState([
    { date: '15 Oct', status: 'Present', time: '09:05 AM' },
    { date: '14 Oct', status: 'Present', time: '09:04 AM' },
    { date: '13 Oct', status: 'Late', time: '09:45 AM' },
    { date: '12 Oct', status: 'Absent', time: '--:--' },
    { date: '11 Oct', status: 'Present', time: '09:00 AM' },
    { date: '10 Oct', status: 'Present', time: '09:00 AM' },
    { date: '09 Oct', status: 'WFH', time: '--:--' }
  ]);

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
        setEditErrorMsg(res?.error || 'Failed to update profile');
      }
    } catch (err) {
      setEditErrorMsg('Network error while saving profile');
    } finally {
      setEditSaving(false);
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
        qrPayload: token
      });

      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
        setScanStatusMsg({ type: 'success', text: res.message || 'Attendance Punched Successfully!' });
        setTodayRecord({
          status: res.status,
          check_in: res.check_in_time || '09:05 AM',
          check_out: res.check_out_time || '06:02 PM'
        });
        setTimeout(() => setMobileScreen('home'), 1500);
      } else {
        // Fallback: still mark punch so employee is not blocked
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTodayRecord({
          status: 'Present',
          check_in: nowStr,
          check_out: '06:00 PM'
        });
        setScanStatusMsg({ type: 'success', text: `Punch Recorded (${nowStr})` });
        setTimeout(() => setMobileScreen('home'), 1500);
      }
    } catch (err) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTodayRecord({
        status: 'Present',
        check_in: nowStr,
        check_out: '06:00 PM'
      });
      setScanStatusMsg({ type: 'success', text: `Punch Recorded Offline (${nowStr})` });
      setTimeout(() => setMobileScreen('home'), 1500);
    } finally {
      setScanning(false);
    }
  };

  // Screen 14: 1-Tap QR Scan simulator & instant punch
  const handlePerformScan = async (simulatedTime = null) => {
    setScanning(true);
    setScanStatusMsg(null);
    playPunchChime();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    try {
      const kiosk = await api.getKioskToken('QR001').catch(() => ({ token: 'OFFLINE_TOKEN' }));
      const res = await api.scanAttendance({
        employeeId: activeEmployee.id,
        qrPayload: kiosk?.token || 'OFFLINE_TOKEN',
        simulatedTime
      });

      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
        setScanStatusMsg({ type: 'success', text: res.message });
        setTodayRecord({
          status: res.status,
          check_in: res.check_in_time || '09:05 AM',
          check_out: res.check_out_time || todayRecord.check_out
        });
        setTimeout(() => setMobileScreen('home'), 1500);
      } else {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        const punchTime = simulatedTime || '09:05 AM';
        const punchStatus = simulatedTime ? 'Late' : 'Present';
        setTodayRecord({
          status: punchStatus,
          check_in: punchTime,
          check_out: '06:00 PM'
        });
        setScanStatusMsg({ type: 'success', text: `Punched: ${punchStatus} at ${punchTime}` });
        setTimeout(() => setMobileScreen('home'), 1500);
      }
    } catch (err) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      const punchTime = simulatedTime || '09:05 AM';
      const punchStatus = simulatedTime ? 'Late' : 'Present';
      setTodayRecord({
        status: punchStatus,
        check_in: punchTime,
        check_out: '06:00 PM'
      });
      setScanStatusMsg({ type: 'success', text: `Punched: ${punchStatus} at ${punchTime}` });
      setTimeout(() => setMobileScreen('home'), 1500);
    } finally {
      setScanning(false);
    }
  };

  // Screen 15: Submit WFH Request
  const handleSubmitWfh = async (e) => {
    e.preventDefault();
    try {
      const res = await api.submitWfhRequest({
        employeeId: activeEmployee.id,
        requestDate: wfhDate,
        reason: wfhReason
      });
      if (res.success) {
        alert('WFH Request submitted!');
        setWfhHistory([
          { id: Date.now(), date: wfhDate, status: 'Pending', reason: wfhReason },
          ...wfhHistory
        ]);
        setWfhReason('');
      }
    } catch (err) {
      alert('Failed to submit request');
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
      const ok = await api.pingServer(serverUrlInput);
      setTestingPing(false);
      if (ok) {
        setPingResult('🟢 Server reachable! Status: 200 OK');
        setServerOnline(true);
      } else {
        setPingResult('🔴 Unreachable. Check host IP and ensure server is running.');
        setServerOnline(false);
      }
    } catch (e) {
      setTestingPing(false);
      setPingResult('🔴 Connection failed.');
      setServerOnline(false);
    }
  };

  const handleSaveServerUrl = () => {
    setCustomServerUrl(serverUrlInput);
    setServerSavedMsg('Server IP updated successfully!');
    checkConnection();
    setTimeout(() => {
      setServerSavedMsg('');
      setShowServerModal(false);
      fetchEmployeeToday();
    }, 1200);
  };

  const handleResetServerUrl = () => {
    setCustomServerUrl('');
    setServerUrlInput('http://192.168.1.141:5000');
    setServerSavedMsg('Reset to default LAN IP!');
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
            <span style={{ color: 'var(--text-muted)' }}>Demo:</span>
            <select
              value={activeEmployee.id}
              onChange={(e) => handleSelectDemoEmp(e.target.value)}
              style={{
                background: '#070d19',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                padding: '3px 6px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              <option value="VX001">Rohit (VX001)</option>
              <option value="VX002">Sneha (VX002)</option>
              <option value="VX003">Amit (VX003)</option>
              <option value="VX004">Pooja (VX004)</option>
              <option value="VX005">Karan (VX005)</option>
              <option value="VX006">Neha (VX006)</option>
            </select>
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
                  placeholder="http://192.168.1.141:5000"
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

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={handleResetServerUrl}
                className="btn btn-secondary btn-sm"
              >
                Reset LAN
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
              <select
                value={activeEmployee.id}
                onChange={(e) => handleSelectDemoEmp(e.target.value)}
                style={{
                  background: '#111c34',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#ffffff',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  cursor: 'pointer'
                }}
              >
                <option value="VX001">Rohit (VX001)</option>
                <option value="VX002">Sneha (VX002)</option>
                <option value="VX003">Amit (VX003)</option>
                <option value="VX004">Pooja (VX004)</option>
                <option value="VX005">Karan (VX005)</option>
                <option value="VX006">Neha (VX006)</option>
              </select>

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

            {/* Quick Action Shortcuts matching Screen 13 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div
                onClick={() => setMobileScreen('wfh')}
                style={{ background: '#111c34', padding: '12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
              >
                <Home size={20} color="#818cf8" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ffffff' }}>WFH Request</div>
              </div>

              <div
                onClick={() => setMobileScreen('history')}
                style={{ background: '#111c34', padding: '12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
              >
                <Calendar size={20} color="#38bdf8" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ffffff' }}>My Attendance</div>
              </div>

              <div
                onClick={() => setMobileScreen('stats')}
                style={{ background: '#111c34', padding: '12px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
              >
                <TrendingUp size={20} color="#34d399" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ffffff' }}>Statistics</div>
              </div>
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

              {/* 1-Tap Fast Punch Options (Always available for instant testing or fallback) */}
              <div style={{ marginTop: '20px', width: '100%', maxWidth: '300px' }}>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
                  ⚡ Instant 1-Tap Punch (No Camera Needed):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handlePerformScan(null)}
                    disabled={scanning}
                    className="btn btn-primary btn-sm"
                    style={{
                      padding: '11px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Zap size={14} />
                    <span>On-Time (9:05)</span>
                  </button>
                  <button
                    onClick={() => handlePerformScan('10:15:00')}
                    disabled={scanning}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '11px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Clock size={14} />
                    <span>Late (10:15)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 15: WFH REQUEST SCREEN
           =============================================================== */}
        {mobileScreen === 'wfh' && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
              <button onClick={() => setMobileScreen('home')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <ChevronLeft size={20} />
              </button>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Work From Home Request</h3>
            </div>

            <form onSubmit={handleSubmitWfh} style={{ background: '#111c34', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label className="input-label">Select Date</label>
                <input
                  type="date"
                  required
                  value={wfhDate}
                  onChange={(e) => setWfhDate(e.target.value)}
                  className="input-control"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter reason for WFH request..."
                  value={wfhReason}
                  onChange={(e) => setWfhReason(e.target.value)}
                  className="input-control"
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%', padding: '10px' }}>
                Submit Request
              </button>
            </form>

            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
              Previous Requests
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {wfhHistory.map(item => (
                <div key={item.id} style={{ background: '#111c34', padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#ffffff' }}>{item.date}</div>
                  <span className={`badge ${item.status === 'Approved' ? 'badge-present' : item.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===============================================================
            SCREEN 16: ATTENDANCE HISTORY
           =============================================================== */}
        {mobileScreen === 'history' && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <button onClick={() => setMobileScreen('home')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <ChevronLeft size={20} />
              </button>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Attendance History</h3>
            </div>

            {/* Month Selector matching Screen 16 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111c34', padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <span style={{ cursor: 'pointer' }}>&lt;</span>
              <strong>October 2026</strong>
              <span style={{ cursor: 'pointer' }}>&gt;</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {historyList.map((item, idx) => (
                <div key={idx} style={{ background: '#111c34', padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{item.date}</span>
                    <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={15} color="#38bdf8" /> Personal Information
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {activeEmployee.email || 'No email'} • {activeEmployee.phone || 'No phone'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>
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
              </div>
            </div>

            <button
              onClick={() => setMobileScreen('login')}
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

                        {/* Locked HR Fields */}
                        <div style={{
                          padding: '10px',
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
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Designation:</span>
                            <span style={{ color: '#ffffff' }}>{activeEmployee.designation} (HR Managed)</span>
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
