import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Building2, 
  Smartphone, 
  QrCode, 
  FileText, 
  Columns, 
  RotateCcw, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Download,
  Copy,
  Check,
  X,
  Code
} from 'lucide-react';
import { api } from '../api';

export default function Navbar({ activeTab, setActiveTab, onResetDemo }) {
  const [resetting, setResetting] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [modalTab, setModalTab] = useState('pwa'); // 'pwa' | 'apk' | 'wfo'
  const [localIp, setLocalIp] = useState('192.168.1.141');
  const [copied, setCopied] = useState(false);
  const modalCanvasRef = useRef(null);

  useEffect(() => {
    api.getNetworkInfo().then(info => {
      if (info?.localIp) setLocalIp(info.localIp);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (showMobileModal && modalCanvasRef.current) {
      QRCode.toCanvas(modalCanvasRef.current, `http://${localIp}:5173`, {
        width: 180,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });
    }
  }, [showMobileModal, localIp]);

  const copyUrl = () => {
    navigator.clipboard.writeText(`http://${localIp}:5173`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = async () => {
    if (window.confirm('Reset all demo data back to clean initial state with sample employees and attendance records?')) {
      setResetting(true);
      try {
        await api.resetDemoData();
        if (onResetDemo) onResetDemo();
        alert('Demo data successfully reset!');
      } catch (e) {
        alert('Failed to reset demo data');
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* VorldX Brand Logo */}
        <div 
          onClick={() => setActiveTab('admin')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                Vorld<span style={{ color: '#38bdf8' }}>X</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                Attendance 360
              </span>
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              color: 'var(--text-dim)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <span>CIN: U62099UP2026PTC245598</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <MapPin size={10} /> Lucknow HQ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HR / Admin Portal Navigation Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(14, 21, 38, 0.85)',
        padding: '6px 16px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        gap: '8px'
      }}>
        <Building2 size={16} color="#38bdf8" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em' }}>
          HR & Admin Management Portal
        </span>
      </div>

      {/* Right Action Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '20px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '0.75rem',
          color: '#34d399',
          fontWeight: 600
        }}>
          <span className="pulse-indicator green" />
          <span>LAN: {localIp}</span>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          title="Reset demo data with sample employees, attendance logs, and policies"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <RotateCcw size={14} className={resetting ? 'spin' : ''} />
          <span>{resetting ? 'Resetting...' : 'Reset Data'}</span>
        </button>
      </div>

      {/* Mobile App & APK Guide Modal */}
      {showMobileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 10, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1527',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '24px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(56, 189, 248, 0.15)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowMobileModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Smartphone size={22} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  VorldX Mobile App & APK Guide
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Install the employee app on Android or scan desktop QR codes on your local Wi-Fi
                </p>
              </div>
            </div>

            {/* Quick Connect Box with QR */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              marginTop: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: '#ffffff',
                padding: '10px',
                borderRadius: '12px',
                flexShrink: 0
              }}>
                <canvas ref={modalCanvasRef} style={{ display: 'block', width: '130px', height: '130px' }} />
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Mobile LAN Access URL
                </span>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  margin: '6px 0 10px',
                  wordBreak: 'break-all',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span>http://{localIp}:5173</span>
                  <button
                    onClick={copyUrl}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                  Apne phone ko usi Wi-Fi network se connect karein aur camera se scan karein ya Chrome mein yeh URL kholein.
                </p>
              </div>
            </div>

            {/* Direct APK Download Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                    📦 VorldX-Attendance.apk
                  </span>
                  <span className="badge badge-present">Ready to Download</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                  Native Android APK (13.8 MB) • Real Camera Scanner • Standalone & Offline Ready
                </div>
              </div>

              <a
                href="/api/download/apk"
                download="VorldX-Attendance.apk"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <Download size={18} />
                <span>⬇️ Download Employee APK</span>
              </a>
            </div>

            {/* Modal Tabs */}
            <div style={{
              display: 'flex',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '4px',
              borderRadius: '10px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setModalTab('pwa')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: modalTab === 'pwa' ? '#2563eb' : 'transparent',
                  color: modalTab === 'pwa' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                1. ⚡ Direct Phone Install (WebAPK)
              </button>
              <button
                onClick={() => setModalTab('apk')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: modalTab === 'apk' ? '#2563eb' : 'transparent',
                  color: modalTab === 'apk' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                2. 📦 Android Studio Native APK
              </button>
              <button
                onClick={() => setModalTab('wfo')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: modalTab === 'wfo' ? '#2563eb' : 'transparent',
                  color: modalTab === 'wfo' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                3. 🏢 WFO QR Flow Guide
              </button>
            </div>

            {/* TAB 1: PWA WebAPK Direct Install */}
            {modalTab === 'pwa' && (
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <div style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  marginBottom: '14px'
                }}>
                  <strong style={{ color: '#38bdf8' }}>Sabse Aasan Tarika (No Android Studio required):</strong>
                  <br />
                  VorldX ek fully-configured Progressive Web App (PWA) hai. Android Chrome isko seedha ek <strong>Real Android App (WebAPK)</strong> ki tarah install kar leta hai!
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>1</span>
                    <div>
                      <strong>Phone par URL kholein:</strong> Apne phone ke Chrome browser mein <code style={{ color: '#38bdf8' }}>http://{localIp}:5173</code> open karein.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>2</span>
                    <div>
                      <strong>Install banner par tap karein:</strong> Screen ke neeche <em>"Add VorldX to Home screen"</em> ya Chrome ke 3 dots (⋮) menu mein jaakar <strong>"Install app"</strong> par click karein.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>3</span>
                    <div>
                      <strong>Standlone App Ready:</strong> Phone ke home screen aur app drawer par VorldX icon ban jayega. Yeh full-screen bina browser address bar ke native app ki tarah chalega!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Capacitor Native APK Build */}
            {modalTab === 'apk' && (
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 10px', color: 'var(--text-muted)' }}>
                  Agar aapko offline physical <code>.apk</code> file compile karke distribute karni hai, toh Capacitor ke zariye easily compile kar sakte hain:
                </p>

                <div style={{
                  background: '#050a14',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  color: '#38bdf8',
                  border: '1px solid var(--border-subtle)',
                  overflowX: 'auto',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  # 1. Workspace root mein Capacitor setup karein:<br />
                  cd client<br />
                  npm install @capacitor/core @capacitor/cli @capacitor/android<br />
                  npm run build<br />
                  <br />
                  # 2. Android Studio Project create karein:<br />
                  npx cap add android<br />
                  npx cap copy<br />
                  npx cap open android<br />
                  <br />
                  # 3. Android Studio mein:<br />
                  # Click "Build" &gt; "Build Bundle(s) / APK(s)" &gt; "Build APK(s)"<br />
                  # Output file: android/app/build/outputs/apk/debug/app-debug.apk
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Note: Pre-configured <code style={{ color: '#ffffff' }}>capacitor.config.json</code> workspace mein pehle se create kar diya gaya hai.
                </div>
              </div>
            )}

            {/* TAB 3: WFO Check-in Flow Guide */}
            {modalTab === 'wfo' && (
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 12px', color: '#ffffff', fontWeight: 700 }}>
                  Aapka requested WFO Flow kaise kaam karta hai:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
                    <strong style={{ color: '#ffffff' }}>Step 1: Desktop par Employee ID Login</strong><br />
                    Office Kiosk par <strong>Office QR Display</strong> kholein. Employee apna ID enter karta hai (e.g. <code>VX001</code>). Database se employee match ho jata hai (Rohit Sharma).
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', borderLeft: '3px solid #3b82f6' }}>
                    <strong style={{ color: '#ffffff' }}>Step 2: Verification Through OTP</strong><br />
                    Desktop screen par 6-digit OTP verification prompt aayega (Demo code: <code>123456</code>). Verify par click karte hi authentication complete ho jayegi.
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', borderLeft: '3px solid #8b5cf6' }}>
                    <strong style={{ color: '#ffffff' }}>Step 3: Employee Name QR Desktop Display</strong><br />
                    Desktop par Rohit Sharma ke photo aur name ke sath personalized <strong>Attendance Name QR</strong> display hoga. Isme direct URL encoded hai.
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
                    <strong style={{ color: '#ffffff' }}>Step 4: Mobile Scan & Dashboard Open</strong><br />
                    Jab employee apne mobile phone se scan karta hai:
                    phone par VorldX khulta hai, attendance instant "Present" mark ho jati hai, aur Screen 13 (Home Dashboard) open ho jata hai!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

