import React, { useState, useEffect } from 'react';
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
  MoreVertical,
  LogOut,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Tv,
  FileText
} from 'lucide-react';
import { api } from '../api';

export default function AdminPortal() {
  // Current logged in user (starts logged in as Admin for demo, can toggle to Login view)
  const [currentUser, setCurrentUser] = useState({
    id: 'ADMIN01',
    name: 'Admin',
    role: 'Admin',
    designation: 'HR Manager',
    email: 'admin@vorldx.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&q=80'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@vorldx.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginRole, setLoginRole] = useState('Admin');

  // Active module matching Screens 2 to 10
  const [activeModule, setActiveModule] = useState('dashboard'); // 'dashboard', 'employees', 'profile', 'attendance', 'wfh', 'policies', 'displays', 'reports', 'audit'
  
  // Selected employee for Screen 4 (Employee Profile View)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('VX001');
  const [profileData, setProfileData] = useState(null);
  const [profileTab, setProfileTab] = useState('overview'); // 'overview', 'attendance', 'wfh', 'details'

  // Dashboard Overview state (Screen 2 & 9)
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Employees state (Screen 3)
  const [employees, setEmployees] = useState([]);
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('All');
  const [empStatusFilter, setEmpStatusFilter] = useState('All');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    id: 'VX007',
    name: '',
    email: '',
    phone: '',
    department: 'Development',
    designation: 'SDE',
    shift: 'General (9:00 AM - 6:00 PM)',
    work_type: 'Office',
    role: 'Employee'
  });

  // Attendance state (Screen 5)
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attDeptFilter, setAttDeptFilter] = useState('All');
  const [attStatusFilter, setAttStatusFilter] = useState('All');
  const [attDateFilter, setAttDateFilter] = useState('2026-10-15');
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [regularizeForm, setRegularizeForm] = useState({
    status: 'Present',
    check_in: '09:05 AM',
    check_out: '06:02 PM',
    remarks: 'Manual regularization approved by HR'
  });

  // WFH Requests state (Screen 6)
  const [wfhTab, setWfhTab] = useState('All'); // 'All', 'Pending', 'Approved', 'Rejected'
  const [wfhList, setWfhList] = useState([]);
  const [showWfhReviewModal, setShowWfhReviewModal] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState('Approved');
  const [reviewComment, setReviewComment] = useState('');

  // Policies state (Screen 7)
  const [policyData, setPolicyData] = useState({
    work_start_time: '09:00',
    work_end_time: '18:00',
    grace_period_minutes: 15,
    applicable_days: 'Monday,Tuesday,Wednesday,Thursday,Friday'
  });
  const [policyTab, setPolicyTab] = useState('policy'); // 'policy', 'shifts'
  const [savingPolicy, setSavingPolicy] = useState(false);

  // Displays state (Screen 8)
  const [displays, setDisplays] = useState([]);
  const [showAddDisplayModal, setShowAddDisplayModal] = useState(false);
  const [newDisplay, setNewDisplay] = useState({ id: 'QR005', name: '', location: '', status: 'Online' });

  // Reports state (Screen 9)
  const [reportsTab, setReportsTab] = useState('attendance'); // 'attendance', 'wfh', 'monthly'

  // Audit Logs state (Screen 10)
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch initial data
  useEffect(() => {
    if (isLoggedIn) {
      loadOverview();
      loadEmployees();
      loadAttendance();
      loadWfhList();
      loadPolicies();
      loadDisplays();
      loadAuditLogs();
    }
  }, [isLoggedIn]);

  // Load employee full profile when selectedEmployeeId changes
  useEffect(() => {
    if (selectedEmployeeId && activeModule === 'profile') {
      loadProfile(selectedEmployeeId);
    }
  }, [selectedEmployeeId, activeModule]);

  const loadOverview = async () => {
    try {
      const data = await api.getAdminOverview();
      setOverview(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadEmployees = async () => {
    try {
      const list = await api.getEmployees({
        department: empDeptFilter !== 'All' ? empDeptFilter : '',
        status: empStatusFilter !== 'All' ? empStatusFilter : '',
        search: empSearch
      });
      setEmployees(list);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAttendance = async () => {
    try {
      const list = await api.getAllAttendance({
        department: attDeptFilter !== 'All' ? attDeptFilter : '',
        status: attStatusFilter !== 'All' ? attStatusFilter : '',
        date: attDateFilter
      });
      setAttendanceRecords(list);
    } catch (e) {
      console.error(e);
    }
  };

  const loadWfhList = async () => {
    try {
      const list = await api.getAllWfhRequests({
        status: wfhTab !== 'All' ? wfhTab : ''
      });
      setWfhList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const loadPolicies = async () => {
    try {
      const data = await api.getPolicies();
      if (data) setPolicyData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadDisplays = async () => {
    try {
      const list = await api.getDisplays();
      setDisplays(list);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const list = await api.getAuditLogs();
      setAuditLogs(list);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProfile = async (empId) => {
    try {
      const data = await api.getEmployeeFullProfile(empId);
      setProfileData(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Login handler (Screen 1)
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail.includes('admin')) {
      setCurrentUser({
        id: 'ADMIN01',
        name: 'Admin',
        role: 'Admin',
        designation: 'HR Manager',
        email: loginEmail,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128'
      });
    } else {
      setCurrentUser({
        id: 'VX002',
        name: 'Sneha Verma',
        role: 'HR',
        designation: 'HR Executive',
        email: loginEmail,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128'
      });
    }
    setIsLoggedIn(true);
    setActiveModule('dashboard');
  };

  // Add Employee handler
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createEmployee(newEmp);
      if (res.success) {
        alert(`Employee ${newEmp.name} created!`);
        setShowAddEmpModal(false);
        loadEmployees();
      }
    } catch (err) {
      alert('Error creating employee');
    }
  };

  // Regularize Attendance handler
  const handleRegularize = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;
    try {
      await api.regularizeAttendance(selectedRecord.id, {
        ...regularizeForm,
        regularized_by: currentUser.name
      });
      alert('Attendance regularized successfully!');
      setShowRegularizeModal(false);
      loadAttendance();
      loadOverview();
    } catch (err) {
      alert('Failed to regularize');
    }
  };

  // Review WFH Request handler
  const handleReviewWfh = async () => {
    if (!reviewRequest) return;
    try {
      await api.reviewWfhRequest(reviewRequest.id, {
        status: reviewAction,
        adminComment: reviewComment || 'Reviewed by ' + currentUser.name,
        reviewedBy: currentUser.name
      });
      alert(`WFH Request ${reviewAction}!`);
      setShowWfhReviewModal(false);
      loadWfhList();
      loadOverview();
    } catch (err) {
      alert('Failed to review request');
    }
  };

  // Save Policy handler (Screen 7)
  const handleSavePolicy = async (e) => {
    e.preventDefault();
    setSavingPolicy(true);
    try {
      await api.updatePolicies(policyData);
      alert('Attendance policy updated successfully!');
      loadPolicies();
    } catch (err) {
      alert('Failed to update policy');
    } finally {
      setSavingPolicy(false);
    }
  };

  // Toggle Display status (Screen 8)
  const handleToggleDisplay = async (disp) => {
    const newStatus = disp.status === 'Online' ? 'Offline' : 'Online';
    try {
      await api.toggleDisplayStatus(disp.id, newStatus);
      loadDisplays();
    } catch (err) {
      alert('Failed to update display status');
    }
  };

  // Add Display handler
  const handleAddDisplay = async (e) => {
    e.preventDefault();
    try {
      await api.addDisplay(newDisplay);
      setShowAddDisplayModal(false);
      loadDisplays();
    } catch (err) {
      alert('Failed to add display');
    }
  };

  // =========================================================================
  // SCREEN 1: ADMIN LOGIN VIEW
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.15) 0%, #070d19 80%)'
      }}>
        <div style={{
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(37, 99, 235, 0.2)',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #2563eb, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)'
            }}>
              <Building2 size={28} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800 }}>
              Vorld<span style={{ color: '#38bdf8' }}>X</span>
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              HR/Admin Portal Login
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@vorldx.com"
                  className="input-control"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-control"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password is password123'); }} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
              Login to Admin Portal
            </button>
          </form>

          {/* Quick 1-Click Role Switcher Demo Helper */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
              DEMO 1-CLICK ROLE LOGIN:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => { setLoginEmail('admin@vorldx.com'); setLoginPassword('password123'); }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                Admin (Full Access)
              </button>
              <button
                type="button"
                onClick={() => { setLoginEmail('sneha.verma@vorldx.com'); setLoginPassword('password123'); }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                HR Manager (Approver)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREENS 2 TO 10: ADMIN DASHBOARD SHELL
  // =========================================================================
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)', background: '#0b1120' }}>
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside style={{
        width: '240px',
        background: '#070d19',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Logo Header */}
          <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Vorld<span style={{ color: '#38bdf8' }}>X</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'employees', label: 'Employees', icon: Users },
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'wfh', label: 'WFH Requests', icon: Home, badge: '4' },
              { id: 'policies', label: 'Policies', icon: Sliders },
              { id: 'displays', label: 'QR Display', icon: Tv },
              { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
              { id: 'audit', label: 'Audit Logs', icon: ShieldAlert }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id || (item.id === 'employees' && activeModule === 'profile');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#2563eb' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '10px',
                      background: isActive ? '#ffffff' : '#f59e0b',
                      color: isActive ? '#2563eb' : '#000000',
                      fontSize: '0.7rem',
                      fontWeight: 800
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Switch Role / Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOP HEADER */}
        <header style={{
          height: '64px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Search Employees Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search employees..."
              value={empSearch}
              onChange={(e) => { setEmpSearch(e.target.value); if (activeModule !== 'employees') setActiveModule('employees'); }}
              className="input-control"
              style={{ paddingLeft: '34px', height: '36px', fontSize: '0.8rem', borderRadius: '20px' }}
            />
          </div>

          {/* User Profile Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} color="var(--text-muted)" />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '7px', height: '7px', background: '#38bdf8', borderRadius: '50%' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #38bdf8' }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {currentUser.designation}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* BODY CONTENT ROUTER */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
          {/* ===============================================================
              SCREEN 2: DASHBOARD VIEW
             =============================================================== */}
          {activeModule === 'dashboard' && (
            <div>
              {/* Header Title + Month Filter */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Dashboard</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  color: 'var(--text-main)'
                }}>
                  <Calendar size={14} color="#38bdf8" />
                  <span>October 2026</span>
                </div>
              </div>

              {/* 4 Stat Cards from Screen 2 */}
              <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
                <div style={{ background: '#111c34', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Employees</span>
                    <Users size={16} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                    50
                  </div>
                </div>

                <div style={{ background: '#111c34', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present Today</span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700 }}>
                      +4%
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                    32
                  </div>
                </div>

                <div style={{ background: '#111c34', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WFH Today</span>
                    <Home size={16} color="#818cf8" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
                    8
                  </div>
                </div>

                <div style={{ background: '#111c34', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Late Today</span>
                    <Clock size={16} color="#fbbf24" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                    5
                  </div>
                </div>
              </div>

              {/* Lower Section: Bar Chart & Recent Activities (Screen 2) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
                {/* Attendance Overview Bar Chart */}
                <div style={{ background: '#111c34', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#ffffff' }}>Attendance Overview (This Month)</h3>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.7rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6' }}><span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }} /> Present</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06b6d4' }}><span style={{ width: '8px', height: '8px', background: '#06b6d4', borderRadius: '2px' }} /> WFH</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}><span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '2px' }} /> Late</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}><span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '2px' }} /> Absent</span>
                    </div>
                  </div>

                  {/* Simulated SVG Bar Chart for Days 1 to 30 */}
                  <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '5px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                    {overview?.monthlyAttendanceTrend?.slice(0, 25).map((item) => (
                      <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', maxWidth: '8px', height: `${Math.max(8, item.present * 3.5)}px`, background: '#3b82f6', borderRadius: '3px 3px 0 0' }} />
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          {item.day % 5 === 0 ? item.day : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                    <span>1 Oct</span>
                    <span>10 Oct</span>
                    <span>20 Oct</span>
                    <span>30 Oct</span>
                  </div>
                </div>

                {/* Recent Activities Feed (Screen 2) */}
                <div style={{ background: '#111c34', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Recent Activities</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {overview?.recentActivities?.map(act => (
                      <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={act.avatar} alt={act.user} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600, color: '#ffffff' }}>{act.action}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{act.user} — {act.details}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                          {act.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 3: EMPLOYEE MANAGEMENT
             =============================================================== */}
          {activeModule === 'employees' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Employees</h2>
                <button onClick={() => setShowAddEmpModal(true)} className="btn btn-primary btn-sm">
                  <Plus size={15} /> Add Employee
                </button>
              </div>

              {/* Filters Bar */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '16px',
                background: '#111c34',
                padding: '12px 16px',
                borderRadius: '10px'
              }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search by name, ID, department..."
                    value={empSearch}
                    onChange={(e) => { setEmpSearch(e.target.value); loadEmployees(); }}
                    className="input-control"
                    style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8rem' }}
                  />
                </div>

                <select
                  value={empDeptFilter}
                  onChange={(e) => { setEmpDeptFilter(e.target.value); }}
                  className="input-control"
                  style={{ width: '160px', height: '34px', fontSize: '0.8rem' }}
                >
                  <option value="All">All Departments</option>
                  <option value="Development">Development</option>
                  <option value="HR">HR</option>
                  <option value="Design">Design</option>
                  <option value="Testing">Testing</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                </select>

                <select
                  value={empStatusFilter}
                  onChange={(e) => { setEmpStatusFilter(e.target.value); }}
                  className="input-control"
                  style={{ width: '130px', height: '34px', fontSize: '0.8rem' }}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Employee Table (Screen 3) */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Dept</th>
                      <th>Designation</th>
                      <th>Shift</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                        <td style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>{emp.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={emp.avatar} alt={emp.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span
                              onClick={() => { setSelectedEmployeeId(emp.id); setActiveModule('profile'); }}
                              style={{ fontWeight: 600, color: '#ffffff', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {emp.name}
                            </span>
                          </div>
                        </td>
                        <td>{emp.department}</td>
                        <td>{emp.designation}</td>
                        <td>{emp.shift}</td>
                        <td>
                          <span className={`badge ${emp.status === 'Active' ? 'badge-present' : 'badge-absent'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => { setSelectedEmployeeId(emp.id); setActiveModule('profile'); }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching Screen 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span>Showing 1-6 of 50</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>&lt;</button>
                  <button className="btn btn-primary btn-sm" style={{ padding: '3px 8px' }}>1</button>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>2</button>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>3</button>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>4</button>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>5</button>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}>&gt;</button>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 4: EMPLOYEE PROFILE VIEW
             =============================================================== */}
          {activeModule === 'profile' && profileData && (
            <div>
              {/* Breadcrumb Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                <span onClick={() => setActiveModule('employees')} style={{ cursor: 'pointer', color: '#38bdf8' }}>Employees</span>
                <span>&gt;</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{profileData.employee.name}</span>
              </div>

              {/* Profile Card Header (Screen 4) */}
              <div style={{
                background: '#111c34',
                padding: '20px 24px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={profileData.employee.avatar}
                    alt={profileData.employee.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{profileData.employee.name}</h2>
                      <span className="badge badge-present">{profileData.employee.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                      {profileData.employee.id} • {profileData.employee.designation}
                    </div>
                  </div>
                </div>

                <button onClick={() => setActiveModule('employees')} className="btn btn-secondary btn-sm">
                  <ArrowLeft size={14} /> Back to Directory
                </button>
              </div>

              {/* Tabs: Overview, Attendance, WFH Requests, Details (Screen 4) */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                {['overview', 'attendance', 'wfh', 'details'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setProfileTab(tab)}
                    style={{
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      borderBottom: profileTab === tab ? '2px solid #38bdf8' : '2px solid transparent',
                      color: profileTab === tab ? '#38bdf8' : 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab === 'wfh' ? 'WFH Requests' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {profileTab === 'overview' && (
                <div style={{ background: '#111c34', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div className="grid-cols-2" style={{ gap: '20px', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Department</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.department}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Designation</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.designation}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Email</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.email}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Phone</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.phone}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Shift</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.shift}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Work Type</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.work_type}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Joining Date</span>
                      <strong style={{ color: '#ffffff' }}>{profileData.employee.joining_date}</strong>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'attendance' && (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileData.attendanceRecords.map(r => (
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>{r.check_in || '--'}</td>
                          <td>{r.check_out || '--'}</td>
                          <td>{r.duration_minutes > 0 ? `${Math.floor(r.duration_minutes/60)}h ${r.duration_minutes%60}m` : '--'}</td>
                          <td><span className={`badge badge-${r.status.toLowerCase().replace(' ', '')}`}>{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === 'wfh' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {profileData.wfhRequests.map(w => (
                    <div key={w.id} style={{ background: '#111c34', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{w.request_date}</strong> — <em>"{w.reason}"</em>
                      </div>
                      <span className={`badge ${w.status === 'Approved' ? 'badge-present' : w.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === 'details' && (
                <div style={{ background: '#111c34', padding: '20px', borderRadius: '12px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Additional HR Notes & Performance Logs are synced with VorldX Central ERP.</p>
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              SCREEN 5: ATTENDANCE MANAGEMENT
             =============================================================== */}
          {activeModule === 'attendance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Attendance Records</h2>
                <a href="/api/admin/export-csv" download className="btn btn-primary btn-sm">
                  <Download size={15} /> Export
                </a>
              </div>

              {/* Filters Bar matching Screen 5 */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '16px',
                background: '#111c34',
                padding: '12px 16px',
                borderRadius: '10px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} color="#38bdf8" />
                  <span>01 Oct 2026 - 31 Oct 2026</span>
                </div>

                <select
                  value={attDeptFilter}
                  onChange={(e) => { setAttDeptFilter(e.target.value); loadAttendance(); }}
                  className="input-control"
                  style={{ width: '160px', height: '34px', fontSize: '0.8rem' }}
                >
                  <option value="All">All Departments</option>
                  <option value="Development">Development</option>
                  <option value="HR">HR</option>
                  <option value="Design">Design</option>
                  <option value="Testing">Testing</option>
                  <option value="Operations">Operations</option>
                </select>

                <select
                  value={attStatusFilter}
                  onChange={(e) => { setAttStatusFilter(e.target.value); loadAttendance(); }}
                  className="input-control"
                  style={{ width: '130px', height: '34px', fontSize: '0.8rem' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="WFH">WFH</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              {/* Table matching Screen 5 */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Hours</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(r => (
                      <tr key={r.id}>
                        <td>{r.date}</td>
                        <td style={{ fontWeight: 700, color: '#38bdf8' }}>{r.employee_id}</td>
                        <td>{r.employee_name}</td>
                        <td>{r.check_in || '--'}</td>
                        <td>{r.check_out || '--'}</td>
                        <td>{r.duration_minutes > 0 ? `${Math.floor(r.duration_minutes/60)}h ${r.duration_minutes%60}m` : '--'}</td>
                        <td>
                          <span className={`badge badge-${r.status.toLowerCase().replace(' ', '')}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setRegularizeForm({
                                status: r.status,
                                check_in: r.check_in || '09:00 AM',
                                check_out: r.check_out || '06:00 PM',
                                remarks: r.remarks || 'Regularization'
                              });
                              setShowRegularizeModal(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            <Edit3 size={12} /> Regularize
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 6: WFH REQUESTS MANAGEMENT
             =============================================================== */}
          {activeModule === 'wfh' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>WFH Requests</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  October 2026
                </div>
              </div>

              {/* Tabs matching Screen 6: All (12), Pending (4), Approved (6), Rejected (2) */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[
                  { id: 'All', label: 'All', count: 12 },
                  { id: 'Pending', label: 'Pending', count: 4 },
                  { id: 'Approved', label: 'Approved', count: 6 },
                  { id: 'Rejected', label: 'Rejected', count: 2 }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setWfhTab(t.id); loadWfhList(); }}
                    className={`btn btn-sm ${wfhTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>

              {/* Table matching Screen 6 */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Employee</th>
                      <th>Reason</th>
                      <th>Queue / Approver</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wfhList.map(req => (
                      <tr key={req.id}>
                        <td>{req.request_date}</td>
                        <td style={{ fontWeight: 600 }}>{req.employee_name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{req.reason}</td>
                        <td style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                          {req.approver_role} Queue
                        </td>
                        <td>
                          <span className={`badge ${req.status === 'Approved' ? 'badge-present' : req.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  setReviewRequest(req);
                                  setReviewAction('Approved');
                                  setShowWfhReviewModal(true);
                                }}
                                className="btn btn-success btn-sm"
                                style={{ padding: '4px 8px' }}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setReviewRequest(req);
                                  setReviewAction('Rejected');
                                  setShowWfhReviewModal(true);
                                }}
                                className="btn btn-danger btn-sm"
                                style={{ padding: '4px 8px' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Decided</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 7: ATTENDANCE POLICY & SHIFT SETTINGS
             =============================================================== */}
          {activeModule === 'policies' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Attendance Policy & Shift Settings</h2>
                <button onClick={handleSavePolicy} disabled={savingPolicy} className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>

              {/* Tabs: Attendance Policy, Shift Settings */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <button
                  onClick={() => setPolicyTab('policy')}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: policyTab === 'policy' ? '2px solid #2563eb' : '2px solid transparent',
                    color: policyTab === 'policy' ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Attendance Policy
                </button>
                <button
                  onClick={() => setPolicyTab('shifts')}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: policyTab === 'shifts' ? '2px solid #2563eb' : '2px solid transparent',
                    color: policyTab === 'shifts' ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Shift Settings
                </button>
              </div>

              {/* Form matching Screen 7 */}
              <div style={{ background: '#111c34', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '14px' }}>Work Schedule</h3>
                <div className="grid-cols-3" style={{ marginBottom: '20px' }}>
                  <div>
                    <label className="input-label">Start Time</label>
                    <input
                      type="time"
                      value={policyData.work_start_time || '09:00'}
                      onChange={(e) => setPolicyData({ ...policyData, work_start_time: e.target.value })}
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label className="input-label">End Time</label>
                    <input
                      type="time"
                      value={policyData.work_end_time || '18:00'}
                      onChange={(e) => setPolicyData({ ...policyData, work_end_time: e.target.value })}
                      className="input-control"
                    />
                  </div>
                  <div>
                    <label className="input-label">Grace Period (minutes)</label>
                    <input
                      type="number"
                      value={policyData.grace_period_minutes ?? 15}
                      onChange={(e) => setPolicyData({ ...policyData, grace_period_minutes: parseInt(e.target.value) })}
                      className="input-control"
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '10px' }}>Late Rules</h3>
                <div style={{ marginBottom: '20px', maxWidth: '300px' }}>
                  <label className="input-label">Mark as Late after (minutes)</label>
                  <input
                    type="number"
                    value={policyData.grace_period_minutes ?? 15}
                    onChange={(e) => setPolicyData({ ...policyData, grace_period_minutes: parseInt(e.target.value) })}
                    className="input-control"
                  />
                </div>

                <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px' }}>Applicable Days</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={policyData.applicable_days?.includes(day)}
                        onChange={(e) => {
                          const current = policyData.applicable_days ? policyData.applicable_days.split(',') : [];
                          const updated = e.target.checked ? [...current, day] : current.filter(d => d !== day);
                          setPolicyData({ ...policyData, applicable_days: updated.join(',') });
                        }}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 8: OFFICE QR DISPLAY MANAGEMENT
             =============================================================== */}
          {activeModule === 'displays' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Office QR Displays</h2>
                <button onClick={() => setShowAddDisplayModal(true)} className="btn btn-primary btn-sm">
                  <Plus size={15} /> Add Display
                </button>
              </div>

              {/* List matching Screen 8 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {displays.map(disp => (
                  <div
                    key={disp.id}
                    style={{
                      background: '#111c34',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Tv size={22} color="#38bdf8" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                          {disp.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Device ID: {disp.id} • {disp.location}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge ${disp.status === 'Online' ? 'badge-online' : 'badge-offline'}`}>
                        {disp.status}
                      </span>
                      <button
                        onClick={() => handleToggleDisplay(disp)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem' }}
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 9: REPORTS & ANALYTICS
             =============================================================== */}
          {activeModule === 'reports' && (
            <div>
              {/* Header with Tabs and Export button (Screen 9) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Attendance Report', 'WFH Report', 'Monthly Summary'].map(t => (
                    <button
                      key={t}
                      onClick={() => setReportsTab(t)}
                      className={`btn btn-sm ${reportsTab === t ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <a href="/api/admin/export-csv" download className="btn btn-primary btn-sm">
                  <Download size={14} /> Export
                </a>
              </div>

              {/* 4 Stat Cards matching Screen 9 */}
              <div className="grid-cols-4" style={{ marginBottom: '20px' }}>
                <div style={{ background: '#111c34', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                    85%
                  </div>
                </div>
                <div style={{ background: '#111c34', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Present Days</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                    32
                  </div>
                </div>
                <div style={{ background: '#111c34', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WFH Days</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
                    8
                  </div>
                </div>
                <div style={{ background: '#111c34', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Late Days</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                    5
                  </div>
                </div>
              </div>

              {/* Charts matching Screen 9 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
                {/* Daily Attendance Trend */}
                <div style={{ background: '#111c34', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '14px' }}>Daily Attendance Trend</h3>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px', paddingBottom: '16px' }}>
                    {overview?.monthlyAttendanceTrend?.slice(0, 25).map(i => (
                      <div key={i.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${i.present * 3}px`, background: '#3b82f6', borderRadius: '2px 2px 0 0' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Wise Attendance Donut Chart (Screen 9) */}
                <div style={{ background: '#111c34', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '14px' }}>Department Wise Attendance</h3>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      margin: '0 auto',
                      background: 'conic-gradient(#3b82f6 0% 40%, #06b6d4 40% 60%, #f59e0b 60% 75%, #8b5cf6 75% 90%, #ef4444 90% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '75px',
                        height: '75px',
                        borderRadius: '50%',
                        background: '#111c34',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>50</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Employees</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                    {overview?.deptBreakdown?.map(d => (
                      <div key={d.department} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }} />
                          {d.department}
                        </span>
                        <span>{d.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 10: AUDIT LOGS
             =============================================================== */}
          {activeModule === 'audit' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Audit Logs</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  01 Oct 2026 - 31 Oct 2026
                </div>
              </div>

              {/* Table matching Screen 10 */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{log.timestamp}</td>
                        <td style={{ fontWeight: 600 }}>{log.actor}</td>
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            color: '#38bdf8',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD EMPLOYEE */}
      {showAddEmpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '14px' }}>Add Employee</h3>
            <form onSubmit={handleAddEmployee}>
              <div className="grid-cols-2" style={{ marginBottom: '10px' }}>
                <div>
                  <label className="input-label">Employee ID</label>
                  <input type="text" required value={newEmp.id} onChange={(e) => setNewEmp({ ...newEmp, id: e.target.value })} className="input-control" />
                </div>
                <div>
                  <label className="input-label">Full Name</label>
                  <input type="text" required placeholder="e.g. Rahul Sharma" value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} className="input-control" />
                </div>
              </div>
              <div className="grid-cols-2" style={{ marginBottom: '10px' }}>
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" required placeholder="rahul@vorldx.com" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} className="input-control" />
                </div>
                <div>
                  <label className="input-label">Department</label>
                  <select value={newEmp.department} onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })} className="input-control">
                    <option value="Development">Development</option>
                    <option value="HR">HR</option>
                    <option value="Design">Design</option>
                    <option value="Testing">Testing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowAddEmpModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGULARIZE ATTENDANCE */}
      {showRegularizeModal && selectedRecord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '14px' }}>
              Regularize Attendance: {selectedRecord.employee_name}
            </h3>
            <form onSubmit={handleRegularize}>
              <div style={{ marginBottom: '12px' }}>
                <label className="input-label">Status</label>
                <select value={regularizeForm.status} onChange={(e) => setRegularizeForm({ ...regularizeForm, status: e.target.value })} className="input-control">
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="WFH">WFH</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div className="grid-cols-2" style={{ marginBottom: '12px' }}>
                <div>
                  <label className="input-label">Check In</label>
                  <input type="text" value={regularizeForm.check_in} onChange={(e) => setRegularizeForm({ ...regularizeForm, check_in: e.target.value })} className="input-control" />
                </div>
                <div>
                  <label className="input-label">Check Out</label>
                  <input type="text" value={regularizeForm.check_out} onChange={(e) => setRegularizeForm({ ...regularizeForm, check_out: e.target.value })} className="input-control" />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Reason / Remarks</label>
                <input type="text" required value={regularizeForm.remarks} onChange={(e) => setRegularizeForm({ ...regularizeForm, remarks: e.target.value })} className="input-control" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setShowRegularizeModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Regularization</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW WFH */}
      {showWfhReviewModal && reviewRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '10px' }}>
              {reviewAction} WFH Request
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              {reviewRequest.employee_name} ({reviewRequest.request_date}): <em>"{reviewRequest.reason}"</em>
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Admin Comment</label>
              <input type="text" placeholder="e.g. Approved" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="input-control" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setShowWfhReviewModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="button" onClick={handleReviewWfh} className={`btn ${reviewAction === 'Approved' ? 'btn-success' : 'btn-danger'}`} style={{ flex: 1 }}>
                Confirm {reviewAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD DISPLAY */}
      {showAddDisplayModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '14px' }}>Add Office QR Display</h3>
            <form onSubmit={handleAddDisplay}>
              <div style={{ marginBottom: '10px' }}>
                <label className="input-label">Device ID</label>
                <input type="text" required value={newDisplay.id} onChange={(e) => setNewDisplay({ ...newDisplay, id: e.target.value })} className="input-control" />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label className="input-label">Display Name</label>
                <input type="text" required placeholder="e.g. Cafeteria Display" value={newDisplay.name} onChange={(e) => setNewDisplay({ ...newDisplay, name: e.target.value })} className="input-control" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Location</label>
                <input type="text" required placeholder="e.g. Ground Floor East Wing" value={newDisplay.location} onChange={(e) => setNewDisplay({ ...newDisplay, location: e.target.value })} className="input-control" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddDisplayModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register Display</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
