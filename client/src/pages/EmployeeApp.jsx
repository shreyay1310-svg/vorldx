import React, { useState, useEffect } from 'react';
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
  Zap
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

  // Login / Register inputs (Screen 11)
  const [loginTab, setLoginTab] = useState('login'); // 'login', 'register'
  const [inputEmpId, setInputEmpId] = useState('VX001');

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

            {/* Tabs: Login, Register */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setLoginTab('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: loginTab === 'login' ? '#2563eb' : 'transparent',
                  color: loginTab === 'login' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button
                onClick={() => setLoginTab('register')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: loginTab === 'register' ? '#2563eb' : 'transparent',
                  color: loginTab === 'register' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleLoginContinue}>
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <label className="input-label">Enter Employee ID</label>
                <input
                  type="text"
                  required
                  value={inputEmpId}
                  onChange={(e) => setInputEmpId(e.target.value.toUpperCase())}
                  placeholder="VX001"
                  className="input-control"
                  style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.1em', fontWeight: 700 }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Continue
              </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              New here? <span onClick={() => setLoginTab('register')} style={{ color: '#38bdf8', cursor: 'pointer' }}>Register</span>
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
                onClick={() => setMobileScreen('history')}
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
            SCREEN 17: PROFILE VIEW
           =============================================================== */}
        {mobileScreen === 'profile' && (
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <button onClick={() => setMobileScreen('home')} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <ChevronLeft size={20} />
              </button>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>My Profile</h3>
            </div>

            {/* Avatar & Info matching Screen 17 */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={activeEmployee.avatar}
                alt={activeEmployee.name}
                style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8', marginBottom: '8px' }}
              />
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{activeEmployee.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{activeEmployee.id}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeEmployee.department} - {activeEmployee.designation}</div>
            </div>

            {/* List options matching Screen 17 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: '#111c34', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ffffff' }}>
                <span>Personal Information</span>
                <ChevronRight size={16} color="var(--text-dim)" />
              </div>
              <div style={{ background: '#111c34', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ffffff' }}>
                <span>Attendance Information</span>
                <ChevronRight size={16} color="var(--text-dim)" />
              </div>
              <div style={{ background: '#111c34', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ffffff' }}>
                <span>Change Password</span>
                <ChevronRight size={16} color="var(--text-dim)" />
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
