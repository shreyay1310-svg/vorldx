import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SplitView from './pages/SplitView';
import AdminPortal from './pages/AdminPortal';
import HRPortal from './pages/HRPortal';
import EmployeeApp from './pages/EmployeeApp';
import EmployeePortal from './pages/EmployeePortal';
import KioskDisplay from './pages/KioskDisplay';
import ProjectReport from './pages/ProjectReport';
import VorldXLogin from './pages/VorldXLogin';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  // Detect if running inside native Android APK (Capacitor)
  const isNativeApp = typeof window !== 'undefined' && Boolean(
    window.Capacitor?.isNativePlatform?.() ||
    window.Capacitor?.getPlatform?.() === 'android' ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && (!window.location.port || window.location.port === '80'))
  );

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Dynamic responsive detection for mobile vs desktop automatic adjustment
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      setIsMobileScreen(mobile);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) return tab;
    if (params.get('wfoAuth') || params.get('kioskScan') || params.get('mobile')) {
      return 'employee';
    }
    if (params.get('kiosk')) {
      return 'kiosk';
    }
    if (params.get('split')) {
      return 'split';
    }
    // If native Android APK -> Dedicated Employee Mobile App
    if (isNativeApp) {
      return 'employee';
    }
    // Auto-adjust: If opened on mobile browser directly -> Employee Mobile App
    if (typeof window !== 'undefined') {
      const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobileDevice || window.innerWidth <= 768) {
        return 'employee';
      }
    }
    // Default Desktop view: Welcome & Authentication Portal
    return 'login';
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetDemo = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Standalone native mobile APK: Pure Employee Mobile App without desktop navbar
  if (isNativeApp) {
    return (
      <ErrorBoundary onReset={handleResetDemo}>
        <div key={refreshKey} style={{ minHeight: '100vh', background: '#090e17' }}>
          <EmployeeApp isEmbedded={false} isNativeApp={true} />
        </div>
      </ErrorBoundary>
    );
  }

  // Pure Full-screen Login & Welcome Page matching the exact Mockup Screenshot
  if (activeTab === 'login') {
    return (
      <ErrorBoundary onReset={handleResetDemo}>
        <div key={refreshKey} style={{ minHeight: '100vh' }}>
          <VorldXLogin
            onLoginSuccess={(user, portal) => {
              setLoggedInUser(user);
              if (portal === 'employee') {
                setActiveTab('employee');
              } else if (portal === 'hr') {
                setActiveTab('hr');
              } else {
                setActiveTab('admin');
              }
            }}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Web Browser: HR & Admin Website with full portal navigation & APK downloads
  return (
    <ErrorBoundary onReset={handleResetDemo}>
      <div key={refreshKey} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResetDemo={handleResetDemo}
        />

        <main style={{ flex: 1 }}>
          {activeTab === 'hr' && (
            <HRPortal
              onLogout={() => {
                setLoggedInUser(null);
                setActiveTab('login');
              }}
              onSwitchToAdmin={() => setActiveTab('admin')}
              onSwitchToEmployee={() => setActiveTab('employee')}
            />
          )}
          {activeTab === 'admin' && (
            <AdminPortal
              initialUser={loggedInUser || {
                id: 'EMP000',
                name: 'Rahul Verma',
                role: 'Admin • HR Management',
                designation: 'Admin • HR Management',
                email: 'rahul.verma@worldx.com',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
              }}
              externalIsLoggedIn={true}
              onLogout={() => {
                setLoggedInUser(null);
                setActiveTab('login');
              }}
              onSwitchToEmployee={(emp) => {
                if (emp) setLoggedInUser(emp);
                setActiveTab('employee');
              }}
            />
          )}
          {activeTab === 'kiosk' && <KioskDisplay isEmbedded={false} />}
          {activeTab === 'split' && <SplitView setActiveTab={setActiveTab} />}
          {activeTab === 'employee' && (
            <EmployeePortal
              initialEmployee={loggedInUser || {
                id: 'EMP005',
                name: 'Rohit S.',
                role: 'Employee',
                designation: 'Employee',
                department: 'Engineering',
                email: 'rohit.s@vorldx.com',
                phone: '+91 9876543210',
                joining_date: '10 Jan 2024',
                reporting_manager: 'Amit Kumar',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
              }}
              onLogout={() => {
                setLoggedInUser(null);
                setActiveTab('login');
              }}
            />
          )}
          {activeTab === 'report' && <ProjectReport />}
        </main>
      </div>
    </ErrorBoundary>
  );
}
