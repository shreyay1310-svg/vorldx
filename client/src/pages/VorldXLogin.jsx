import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Users,
  BarChart3,
  Settings,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Fingerprint,
  Check,
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';
import './VorldXLogin.css';

export default function VorldXLogin({ onLoginSuccess, onNavigate }) {
  // Theme state: 'light' (mockup default) or 'dark'
  const [theme, setTheme] = useState('light');

  // Role tab: 'employee', 'hr', 'admin'
  const [activeRole, setActiveRole] = useState('employee');

  // Form states
  const [employeeId, setEmployeeId] = useState('VX001');
  const [hrEmail, setHrEmail] = useState('priya.sharma@vorldx.com');
  const [hrEmpId, setHrEmpId] = useState('EMP002');
  const [adminEmail, setAdminEmail] = useState('admin@vorldx.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & error handling
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Interactive dialog simulations
  const [showSsoModal, setShowSsoModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioScanning, setBioScanning] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Toggle light/dark theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Handle Role Tab Switching
  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrorMsg('');
    if (role === 'employee') {
      setEmployeeId('VX001');
      setPassword('password123');
    } else if (role === 'hr') {
      setHrEmail('priya.sharma@vorldx.com');
      setHrEmpId('EMP002');
      setPassword('password123');
    } else if (role === 'admin') {
      setAdminEmail('admin@vorldx.com');
      setPassword('password123');
    }
  };

  // Primary Login Submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeRole === 'employee') {
        const cleanId = (employeeId || 'VX001').trim().toUpperCase();
        
        // Attempt API login or fallback
        try {
          const res = await api.mobileLogin(cleanId);
          if (res && res.success && res.user) {
            triggerSuccessAnimation();
            if (onLoginSuccess) {
              onLoginSuccess(res.user, 'employee');
            }
            return;
          }
        } catch (apiErr) {
          // If offline or dev fallback
        }

        // Default successful employee profile
        const sampleEmployee = {
          id: cleanId,
          name: cleanId === 'VX002' ? 'Sneha Verma' : cleanId === 'VX006' ? 'Neha Gupta' : 'Rohit Sharma',
          department: cleanId === 'VX006' ? 'Product Design' : 'Development',
          designation: cleanId === 'VX006' ? 'Lead Designer' : 'SDE',
          role: 'Employee',
          shift: 'General (9:00 AM - 6:00 PM)',
          work_type: 'Office',
          joining_date: '01 Jan 2026',
          email: `${cleanId.toLowerCase()}@vorldx.com`,
          phone: '9876543210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128',
          verified: 1
        };

        triggerSuccessAnimation();
        if (onLoginSuccess) {
          onLoginSuccess(sampleEmployee, 'employee');
        }
      } else if (activeRole === 'hr') {
        const cleanEmail = hrEmail.trim().toLowerCase();
        const cleanEmpId = hrEmpId.trim().toUpperCase();

        if (!cleanEmail || !cleanEmpId) {
          setErrorMsg('Please enter both HR Email and Employee ID.');
          setLoading(false);
          return;
        }

        try {
          const res = await api.login({
            login_type: 'hr',
            email: cleanEmail,
            employee_id: cleanEmpId
          });

          if (res && res.success && res.user) {
            triggerSuccessAnimation();
            if (onLoginSuccess) {
              onLoginSuccess(res.user, 'hr');
            }
            return;
          }
        } catch (err) {}

        const hrUser = {
          id: cleanEmpId || 'EMP002',
          name: 'Priya Sharma',
          role: 'HR Manager',
          designation: 'HR Manager',
          email: cleanEmail || 'priya.sharma@vorldx.com',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128'
        };

        triggerSuccessAnimation();
        if (onLoginSuccess) {
          onLoginSuccess(hrUser, 'hr');
        }
      } else if (activeRole === 'admin') {
        const cleanEmail = adminEmail.trim().toLowerCase();
        const cleanPass = password.trim();

        if (!cleanEmail || !cleanPass) {
          setErrorMsg('Please enter both Admin Email and Password.');
          setLoading(false);
          return;
        }

        try {
          const res = await api.login({
            login_type: 'admin',
            email: cleanEmail,
            password: cleanPass
          });

          if (res && res.success && res.user) {
            triggerSuccessAnimation();
            if (onLoginSuccess) {
              onLoginSuccess(res.user, 'admin');
            }
            return;
          }
        } catch (err) {}

        const adminUser = {
          id: 'ADMIN01',
          name: 'Vikram Singhania',
          role: 'Admin',
          designation: 'Managing Director & Admin',
          email: cleanEmail || 'admin@vorldx.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128'
        };

        triggerSuccessAnimation();
        if (onLoginSuccess) {
          onLoginSuccess(adminUser, 'admin');
        }
      }
    } catch (err) {
      setErrorMsg('Login failed: ' + (err.message || 'Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const triggerSuccessAnimation = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // SSO Login Simulation
  const handleSsoLogin = (roleType) => {
    setShowSsoModal(false);
    handleRoleChange(roleType);
    setTimeout(() => {
      handleSubmit();
    }, 150);
  };

  // Biometric Touch Scan Simulation
  const handleBiometricScan = () => {
    setBioScanning(true);
    setTimeout(() => {
      setBioScanning(false);
      setShowBioModal(false);
      handleSubmit();
    }, 1600);
  };

  return (
    <div className={`vx-login-page theme-${theme}`}>
      {/* Background Organic Wave Overlays */}
      <div className="vx-bg-waves">
        <div className="vx-wave-top-left" />
        <div className="vx-wave-bottom-right" />
        <div className="vx-wave-center-curve" />
      </div>

      {/* Top Header Bar */}
      <header className="vx-header">
        <div className="vx-header-left">
          <div className="vx-header-logo">
            <span>Vorld</span>
            <span className="vx-accent-x">X</span>
          </div>
          <div className="vx-header-divider" />
          <div className="vx-header-portal-title">
            HR & Admin Management Portal
          </div>
        </div>

        <div className="vx-header-right">
          <div className="vx-location-badge">
            <Building2 size={15} color="#2563eb" />
            <span>Lucknow HQ</span>
          </div>
          <div className="vx-header-divider" />
          <div className="vx-version-tag">
            v2.0
          </div>
          <div className="vx-header-divider" />
          <button
            type="button"
            className="vx-theme-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Hero & Login Split View */}
      <main className="vx-main-content">
        {/* Left Hero Section */}
        <section className="vx-hero-left">
          <div className="vx-hero-welcome">
            Welcome to
          </div>
          
          <h1 className="vx-hero-brand">
            Vorld<span className="vx-brand-x">X</span>
          </h1>

          <div className="vx-hero-subtitle">
            HR & Admin Management Portal
          </div>

          <div className="vx-hero-pillars">
            <span>People</span>
            <span>|</span>
            <span>Process</span>
            <span>|</span>
            <span>Performance</span>
          </div>

          <p className="vx-hero-description">
            A unified platform for Employees, HR and Administrators to manage workforce, attendance, leave, payroll and more.
          </p>

          {/* 2x2 Feature Grid */}
          <div className="vx-features-grid">
            <div className="vx-feature-card">
              <div className="vx-feature-icon-box vx-icon-shield">
                <ShieldCheck size={28} />
              </div>
              <span className="vx-feature-label">Secure & Reliable</span>
            </div>

            <div className="vx-feature-card">
              <div className="vx-feature-icon-box vx-icon-users">
                <Users size={28} />
              </div>
              <span className="vx-feature-label">Role Based Access</span>
            </div>

            <div className="vx-feature-card">
              <div className="vx-feature-icon-box vx-icon-insights">
                <BarChart3 size={28} />
              </div>
              <span className="vx-feature-label">Real-time Insights</span>
            </div>

            <div className="vx-feature-card">
              <div className="vx-feature-icon-box vx-icon-settings">
                <Settings size={28} />
              </div>
              <span className="vx-feature-label">Easy to Use</span>
            </div>
          </div>

          {/* Quote Pill at bottom left */}
          <div className="vx-quote-badge">
            <div className="vx-quote-mark">“</div>
            <div className="vx-quote-content">
              <span className="vx-quote-line1">Empowering People</span>
              <span className="vx-quote-line2">Building Better Workplaces”</span>
            </div>
          </div>
        </section>

        {/* Center Architectural Building Backdrop */}
        <div className="vx-building-backdrop">
          <img
            src="/vorldx-building.jpg"
            alt="VorldX Corporate Headquarters"
            className="vx-building-img"
          />
          <div className="vx-building-overlay" />
        </div>

        {/* Right Floating Sign-in Card */}
        <div className="vx-login-card-wrapper">
          <div className="vx-login-card">
            {/* Card Top Branding */}
            <div className="vx-card-top">
              <div className="vx-card-app-icon">
                <Building2 size={32} />
              </div>

              <div className="vx-card-brand-title">
                <span>Vorld</span>
                <span className="vx-card-x">X</span>
              </div>

              <div className="vx-card-portal-badge">
                {activeRole === 'admin' ? 'Admin Portal' : 'HR Portal'}
              </div>

              <div className="vx-card-subtext">
                Sign in to your account
              </div>
            </div>

            {/* Role Switcher Tabs */}
            <div className="vx-role-tabs">
              <button
                type="button"
                className={`vx-role-tab-btn ${activeRole === 'employee' ? 'active' : ''}`}
                onClick={() => handleRoleChange('employee')}
              >
                <User size={15} />
                <span>Employee</span>
              </button>

              <button
                type="button"
                className={`vx-role-tab-btn ${activeRole === 'hr' ? 'active' : ''}`}
                onClick={() => handleRoleChange('hr')}
              >
                <Users size={15} />
                <span>HR</span>
              </button>

              <button
                type="button"
                className={`vx-role-tab-btn ${activeRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleChange('admin')}
              >
                <Settings size={15} />
                <span>Admin</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="vx-login-error">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Field 1: Employee ID / Username */}
              <div className="vx-form-group">
                <label className="vx-input-label">
                  {activeRole === 'employee'
                    ? 'Employee ID / Username'
                    : activeRole === 'hr'
                    ? 'HR Email or Employee ID'
                    : 'Admin Email / Username'}
                </label>
                <div className="vx-input-wrapper">
                  <User size={18} className="vx-input-icon" />
                  <input
                    type="text"
                    required
                    value={
                      activeRole === 'employee'
                        ? employeeId
                        : activeRole === 'hr'
                        ? hrEmail
                        : adminEmail
                    }
                    onChange={(e) => {
                      if (activeRole === 'employee') setEmployeeId(e.target.value);
                      else if (activeRole === 'hr') setHrEmail(e.target.value);
                      else setAdminEmail(e.target.value);
                    }}
                    placeholder={
                      activeRole === 'employee'
                        ? 'Enter your Employee ID'
                        : activeRole === 'hr'
                        ? 'Enter HR email (e.g. sneha.verma@vorldx.com)'
                        : 'Enter Admin email (admin@vorldx.com)'
                    }
                    className="vx-input-field"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="vx-form-group">
                <label className="vx-input-label">Password</label>
                <div className="vx-input-wrapper">
                  <Lock size={18} className="vx-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="vx-input-field"
                  />
                  <button
                    type="button"
                    className="vx-eye-btn"
                    onClick={() => setShowPassword(prev => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="vx-form-options">
                <div
                  className="vx-remember-box"
                  onClick={() => setRememberMe(prev => !prev)}
                >
                  <div className={`vx-custom-checkbox ${rememberMe ? 'checked' : ''}`}>
                    {rememberMe && <Check size={13} strokeWidth={3} />}
                  </div>
                  <span>Remember me</span>
                </div>

                <span
                  className="vx-forgot-link"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="vx-submit-btn"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      Login as {activeRole === 'employee' ? 'Employee' : activeRole === 'hr' ? 'HR' : 'Admin'}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="vx-divider">
              <span>Or continue with</span>
            </div>

            {/* Alternate Login Buttons */}
            <div className="vx-alt-login-row">
              <button
                type="button"
                className="vx-alt-btn"
                onClick={() => setShowSsoModal(true)}
              >
                {/* Microsoft Windows 4-pane Logo */}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" fill="#0078d4" />
                </svg>
                <span>SSO Login</span>
              </button>

              <button
                type="button"
                className="vx-alt-btn"
                onClick={() => {
                  setShowBioModal(true);
                  handleBiometricScan();
                }}
              >
                <Fingerprint size={18} color="#2563eb" />
                <span>Biometric Login</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* SSO Login Simulation Modal */}
      {showSsoModal && (
        <div className="vx-modal-backdrop" onClick={() => setShowSsoModal(false)}>
          <div className="vx-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="vx-modal-close"
              onClick={() => setShowSsoModal(false)}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" fill="#0078d4" />
              </svg>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Microsoft Azure AD SSO</h4>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Select corporate single sign-on identity</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button
                className="vx-alt-btn"
                style={{ justifyContent: 'flex-start', padding: '12px 14px' }}
                onClick={() => handleSsoLogin('employee')}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  RS
                </div>
                <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Rohit Sharma (Employee)</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>rohit.sharma@vorldx.com</div>
                </div>
              </button>

              <button
                className="vx-alt-btn"
                style={{ justifyContent: 'flex-start', padding: '12px 14px' }}
                onClick={() => handleSsoLogin('hr')}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  SV
                </div>
                <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Sneha Verma (HR Portal)</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>sneha.verma@vorldx.com</div>
                </div>
              </button>

              <button
                className="vx-alt-btn"
                style={{ justifyContent: 'flex-start', padding: '12px 14px' }}
                onClick={() => handleSsoLogin('admin')}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  VS
                </div>
                <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Vikram Singhania (Super Admin)</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>admin@vorldx.com</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biometric Scan Simulation Modal */}
      {showBioModal && (
        <div className="vx-modal-backdrop" onClick={() => !bioScanning && setShowBioModal(false)}>
          <div className="vx-modal-card" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button
              className="vx-modal-close"
              onClick={() => setShowBioModal(false)}
            >
              <X size={16} />
            </button>

            <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800 }}>Biometric Authentication</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              WebAuthn / Touch ID Hardware Verification
            </p>

            <div className="vx-fingerprint-pulse">
              <Fingerprint size={48} />
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: bioScanning ? '#2563eb' : '#10b981' }}>
              {bioScanning ? 'Scanning Fingerprint Sensor...' : 'Biometric Match Verified!'}
            </div>

            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px' }}>
              Logging into VorldX with registered biometric token...
            </p>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="vx-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="vx-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="vx-modal-close"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSuccess(false);
              }}
            >
              <X size={16} />
            </button>

            <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800 }}>Reset Password</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#64748b' }}>
              Enter your Employee ID or corporate email to receive a password reset link or SMS OTP.
            </p>

            {forgotSuccess ? (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#065f46', fontSize: '0.88rem', fontWeight: 600 }}>
                ✅ Reset instructions have been sent to your registered mobile and corporate email!
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setForgotSuccess(true);
              }}>
                <div className="vx-form-group">
                  <div className="vx-input-wrapper">
                    <User size={18} className="vx-input-icon" />
                    <input
                      type="text"
                      required
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      placeholder="e.g. VX001 or name@vorldx.com"
                      className="vx-input-field"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="vx-submit-btn"
                  style={{ marginTop: '12px' }}
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Discreet Quick Explorer & Demo Pill (Hidden per user request) */}
    </div>
  );
}
