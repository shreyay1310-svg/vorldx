import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Clock, 
  Tv, 
  Sparkles, 
  CheckCircle2, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  RefreshCw, 
  Check, 
  Lock, 
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { api } from '../api';

export default function KioskDisplay({ isEmbedded = false }) {
  // Mode toggle: 'kiosk' (Screen 18 Fullscreen Display) vs 'wfo_terminal' (WFO Desktop Login & QR Workflow)
  const [activeKioskMode, setActiveKioskMode] = useState('wfo_terminal');

  // Network local IP
  const [localIp, setLocalIp] = useState('192.168.1.141');

  // Screen 18 State
  const [tokenData, setTokenData] = useState(null);
  const [countdown, setCountdown] = useState(45);
  const [currentTime, setCurrentTime] = useState(new Date('2026-10-15T10:24:30'));
  const canvasRef = useRef(null);

  // WFO Desktop Login & QR Workflow State (User Request)
  // Steps: 'ENTER_ID', 'VERIFY_OTP', 'SHOW_NAME_QR', 'ATTENDANCE_SUCCESS'
  const [wfoStep, setWfoStep] = useState('ENTER_ID');
  const [inputEmpId, setInputEmpId] = useState('VX001');
  const [matchedEmployee, setMatchedEmployee] = useState(null);
  const [wfoOtp, setWfoOtp] = useState('123456');
  const [wfoSession, setWfoSession] = useState(null);
  const [wfoAttendanceResult, setWfoAttendanceResult] = useState(null);
  const [wfoLoading, setWfoLoading] = useState(false);
  const [wfoError, setWfoError] = useState('');

  const wfoCanvasRef = useRef(null);

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch local network IP on mount
  useEffect(() => {
    api.getNetworkInfo().then(info => {
      if (info?.localIp) setLocalIp(info.localIp);
    }).catch(() => {});
  }, []);

  // Fetch Screen 18 Token & render QR
  const fetchKioskToken = async () => {
    try {
      const data = await api.getKioskToken('QR001');
      setTokenData(data);
      setCountdown(data.secondsRemaining || 45);

      if (canvasRef.current && (data.mobileUrl || data.qrPayload)) {
        // Enforce URL so mobile camera opens webpage directly!
        const payload = data.mobileUrl || `http://${localIp}:5173/?kioskScan=QR001&token=${data.token}`;
        QRCode.toCanvas(canvasRef.current, payload, {
          width: 260,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeKioskMode === 'kiosk') {
      fetchKioskToken();
      const countTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            fetchKioskToken();
            return 45;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countTimer);
    }
  }, [activeKioskMode, localIp]);

  // WFO Step 1: Employee enters ID on desktop
  const handleWfoInitiate = async (e) => {
    e.preventDefault();
    setWfoLoading(true);
    setWfoError('');
    try {
      const res = await api.wfoInitiate(inputEmpId);
      if (res.success) {
        setMatchedEmployee(res.employee);
        setWfoOtp(res.demo_otp || '123456');
        setWfoStep('VERIFY_OTP');
      } else {
        setWfoError(res.error || 'Employee ID not found');
      }
    } catch (err) {
      setWfoError('Failed to query employee from database');
    } finally {
      setWfoLoading(false);
    }
  };

  // WFO Step 2: Employee verifies OTP on desktop -> displays personalized Name QR
  const handleWfoVerifyOtp = async (e) => {
    e.preventDefault();
    setWfoLoading(true);
    setWfoError('');
    try {
      const res = await api.wfoVerifyOtp(matchedEmployee.id, wfoOtp);
      if (res.success) {
        setWfoSession(res);
        setWfoStep('SHOW_NAME_QR');

        // Render personalized QR code with mobile URL
        setTimeout(() => {
          if (wfoCanvasRef.current && res.qrUrl) {
            QRCode.toCanvas(wfoCanvasRef.current, res.qrUrl, {
              width: 260,
              margin: 1,
              color: { dark: '#000000', light: '#ffffff' }
            });
          }
        }, 100);
      } else {
        setWfoError(res.error || 'Invalid OTP');
      }
    } catch (err) {
      setWfoError('OTP verification failed');
    } finally {
      setWfoLoading(false);
    }
  };

  // WFO Step 3: Desktop polls session status to detect when mobile scans
  useEffect(() => {
    let pollInterval;
    if (wfoStep === 'SHOW_NAME_QR' && wfoSession?.sessionId) {
      pollInterval = setInterval(async () => {
        try {
          const statusRes = await api.wfoGetSessionStatus(wfoSession.sessionId);
          if (statusRes.status === 'ATTENDANCE_MARKED') {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            setWfoAttendanceResult(statusRes.attendance);
            setWfoStep('ATTENDANCE_SUCCESS');
          }
        } catch (e) {}
      }, 1500);
    }
    return () => clearInterval(pollInterval);
  }, [wfoStep, wfoSession]);

  const formattedDateTime = '15 Oct 2026 10:24:30 AM';

  return (
    <div style={{
      minHeight: isEmbedded ? 'auto' : 'calc(100vh - 70px)',
      background: '#070d19',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: isEmbedded ? '20px 16px' : '36px 48px',
      borderRadius: isEmbedded ? '16px' : '0',
      border: isEmbedded ? '1px solid var(--border-subtle)' : 'none',
      position: 'relative'
    }}>
      {/* Top Mode Switcher Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(17, 28, 52, 0.7)',
        padding: '8px 16px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* VorldX Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              Vorld<span style={{ color: '#38bdf8' }}>X</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
              Terminal IP: <strong style={{ color: '#38bdf8' }}>{localIp}</strong>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveKioskMode('wfo_terminal')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeKioskMode === 'wfo_terminal' ? '#2563eb' : 'transparent',
              color: activeKioskMode === 'wfo_terminal' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <User size={14} />
            <span>WFO Desktop Login & QR</span>
          </button>

          <button
            onClick={() => setActiveKioskMode('kiosk')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeKioskMode === 'kiosk' ? '#2563eb' : 'transparent',
              color: activeKioskMode === 'kiosk' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Tv size={14} />
            <span>General Office Display (Screen 18)</span>
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
          {formattedDateTime}
        </div>
      </div>

      {/* =========================================================================
          MODE 1: WFO DESKTOP LOGIN & PERSONALIZED NAME QR WORKFLOW (USER REQUEST)
         ========================================================================= */}
      {activeKioskMode === 'wfo_terminal' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '560px',
          margin: '0 auto',
          width: '100%',
          padding: '20px 0'
        }}>
          {/* STEP 1: EMPLOYEE ENTERS EMPLOYEE ID ON DESKTOP */}
          {wfoStep === 'ENTER_ID' && (
            <div style={{
              background: '#111c34',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '1px solid var(--border-subtle)',
              width: '100%',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <User size={28} color="#38bdf8" />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                WFO Desktop Check-in
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Desktop par apna Employee ID enter karein. Database verify hote hi OTP aur attendance QR generate hoga.
              </p>

              {wfoError && (
                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.8rem', marginBottom: '16px' }}>
                  {wfoError}
                </div>
              )}

              <form onSubmit={handleWfoInitiate}>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <label className="input-label">Enter Employee ID</label>
                  <input
                    type="text"
                    required
                    value={inputEmpId}
                    onChange={(e) => setInputEmpId(e.target.value.toUpperCase())}
                    placeholder="e.g. VX001"
                    className="input-control"
                    style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.1em' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                    Sample DB IDs: <strong>VX001</strong> (Rohit Sharma), <strong>VX002</strong> (Sneha Verma), <strong>VX003</strong> (Amit Kumar)
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={wfoLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  {wfoLoading ? 'Matching with Database...' : 'Verify Employee ID'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: VERIFICATION THROUGH OTP ON DESKTOP */}
          {wfoStep === 'VERIFY_OTP' && matchedEmployee && (
            <div style={{
              background: '#111c34',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '1px solid var(--border-subtle)',
              width: '100%',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center'
            }}>
              {/* Employee Matched Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <img
                  src={matchedEmployee.avatar}
                  alt={matchedEmployee.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{matchedEmployee.name}</span>
                    <span className="badge badge-present">DB Matched ✓</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                    ID: {matchedEmployee.id} • {matchedEmployee.department} ({matchedEmployee.designation})
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                Verification Through OTP
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Enter the 6-digit OTP code to authorize and generate your personalized WFO QR Code:
              </p>

              {/* Demo OTP Banner */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Simulated OTP Code:
                </span>
                <div style={{ fontFamily: 'monospace', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.2em' }}>
                  {wfoOtp}
                </div>
              </div>

              {wfoError && (
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.8rem', marginBottom: '14px' }}>
                  {wfoError}
                </div>
              )}

              <form onSubmit={handleWfoVerifyOtp}>
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={wfoOtp}
                    onChange={(e) => setWfoOtp(e.target.value)}
                    className="input-control"
                    style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.2em', fontWeight: 800 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setWfoStep('ENTER_ID'); setWfoError(''); }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={wfoLoading}
                    className="btn btn-primary"
                    style={{ flex: 2 }}
                  >
                    {wfoLoading ? 'Verifying...' : 'Verify & Display Name QR'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: DESKTOP DISPLAYS PERSONALIZED NAME QR CODE */}
          {wfoStep === 'SHOW_NAME_QR' && matchedEmployee && (
            <div style={{
              background: '#111c34',
              borderRadius: '28px',
              padding: '32px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.2)',
              textAlign: 'center'
            }}>
              {/* Employee Name & Photo Header */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 16px',
                borderRadius: '30px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <img
                  src={matchedEmployee.avatar}
                  alt={matchedEmployee.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  {matchedEmployee.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                  ({matchedEmployee.id})
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                Scan QR to Open Mobile Dashboard
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Point your mobile phone camera at this QR code. Your dashboard will open and mark WFO attendance!
              </p>

              {/* White QR Code Card */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '20px',
                boxShadow: '0 0 45px rgba(56, 189, 248, 0.35)',
                display: 'inline-block',
                margin: '0 auto 18px'
              }}>
                <canvas ref={wfoCanvasRef} style={{ display: 'block', borderRadius: '8px' }} />
              </div>

              {/* URL Info for Mobile Camera */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                color: '#38bdf8',
                marginBottom: '16px',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                🔗 {wfoSession?.qrUrl}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: '#34d399' }}>
                <span className="pulse-indicator green" />
                <span>Waiting for {matchedEmployee.name} to scan with mobile...</span>
              </div>

              {/* Simulated 1-Click Scan for Testing on Single Computer */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await api.wfoMobileConfirm(wfoSession.sessionId, matchedEmployee.id);
                    if (res.success) {
                      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                      setWfoAttendanceResult(res.attendance);
                      setWfoStep('ATTENDANCE_SUCCESS');
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  ⚡ Simulate Mobile Scan (1-Click Test)
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ATTENDANCE SUCCESS (CONFIRMED ON DESKTOP & MOBILE) */}
          {wfoStep === 'ATTENDANCE_SUCCESS' && matchedEmployee && (
            <div style={{
              background: '#111c34',
              borderRadius: '28px',
              padding: '40px 32px',
              border: '2px solid #10b981',
              width: '100%',
              boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px'
              }}>
                <Check size={36} />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                Attendance Marked Successfully!
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                <strong style={{ color: '#ffffff' }}>{matchedEmployee.name}</strong> ({matchedEmployee.id}) checked in for Work From Office (WFO). Mobile dashboard opened!
              </p>

              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '16px',
                borderRadius: '14px',
                marginBottom: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                textAlign: 'left'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Check-in Time</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
                    {wfoAttendanceResult?.check_in || '09:05 AM'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Status</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    Present (On-Time)
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setWfoStep('ENTER_ID');
                  setMatchedEmployee(null);
                  setWfoSession(null);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                <RotateCcw size={16} /> Check-in Another Employee
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: SCREEN 18 GENERAL OFFICE QR DISPLAY FULLSCREEN
         ========================================================================= */}
      {activeKioskMode === 'kiosk' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '36px 0'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '28px',
            textAlign: 'center'
          }}>
            Scan QR to Mark Attendance
          </h2>

          {/* QR Code White Card */}
          <div style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '24px',
            boxShadow: '0 0 50px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '8px' }} />
          </div>

          {/* Valid for Countdown matching Screen 18 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
            fontSize: '0.95rem',
            color: '#94a3b8',
            fontWeight: 600
          }}>
            <Clock size={18} color="#38bdf8" />
            <span>Valid for: {countdown} seconds</span>
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>
            📱 Camera Link: http://{localIp}:5173/?kioskScan=QR001
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.85rem',
        color: 'var(--text-dim)'
      }}>
        VorldX Industries Pvt Ltd | Office Attendance
      </div>
    </div>
  );
}
