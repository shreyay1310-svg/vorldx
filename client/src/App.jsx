import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SplitView from './pages/SplitView';
import AdminPortal from './pages/AdminPortal';
import EmployeeApp from './pages/EmployeeApp';
import KioskDisplay from './pages/KioskDisplay';
import ProjectReport from './pages/ProjectReport';

export default function App() {
  // Detect if running inside native Android APK (Capacitor)
  const isNativeApp = typeof window !== 'undefined' && Boolean(
    window.Capacitor?.isNativePlatform?.() ||
    window.Capacitor?.getPlatform?.() === 'android' ||
    window.location.protocol === 'capacitor:' ||
    (window.location.hostname === 'localhost' && (!window.location.port || window.location.port === '80'))
  );

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
    // If on mobile browser directly without params -> Employee App
    if (typeof window !== 'undefined') {
      const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobileDevice && window.innerWidth <= 600) {
        return 'employee';
      }
    }
    // Default Website view for HR & Admin -> HR / Admin Portal
    return 'admin';
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetDemo = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Standalone native mobile APK: Pure Employee Mobile App without desktop navbar
  if (isNativeApp) {
    return (
      <div key={refreshKey} style={{ minHeight: '100vh', background: '#090e17' }}>
        <EmployeeApp isEmbedded={false} isNativeApp={true} />
      </div>
    );
  }

  // Web Browser: HR & Admin Website with full portal navigation & APK downloads
  return (
    <div key={refreshKey} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'admin' && <AdminPortal />}
        {activeTab === 'kiosk' && <KioskDisplay isEmbedded={false} />}
        {activeTab === 'split' && <SplitView setActiveTab={setActiveTab} />}
        {activeTab === 'employee' && <EmployeeApp isEmbedded={false} isNativeApp={false} />}
        {activeTab === 'report' && <ProjectReport />}
      </main>
    </div>
  );
}

