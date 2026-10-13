// Unified API Service for VorldX Attendance System

// Detect or retrieve backend server URL (supports Mobile APK & Web)
export const getServerUrl = () => {
  if (typeof window !== 'undefined') {
    // 1. User custom server URL saved in localStorage
    const saved = localStorage.getItem('vorldx_server_url');
    if (saved) return saved.replace(/\/$/, '');

    // 2. Running inside Android APK (Capacitor Native)
    const isCapacitor = Boolean(
      window.Capacitor?.isNativePlatform?.() ||
      window.Capacitor?.getPlatform?.() === 'android' ||
      window.Capacitor?.getPlatform?.() === 'ios' ||
      (window.location.protocol === 'capacitor:' || 
       (window.location.hostname === 'localhost' && (!window.location.port || window.location.port === '80')))
    );

    if (isCapacitor) {
      // Connect to host machine IP on port 5000
      return 'http://192.168.1.141:5000';
    }
  }
  // Standard web browser development/production
  return '';
};

export const setCustomServerUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (!url) {
      localStorage.removeItem('vorldx_server_url');
    } else {
      localStorage.setItem('vorldx_server_url', url.trim());
    }
  }
};

export const getApiBase = () => {
  const host = getServerUrl();
  return host ? `${host}/api` : '/api';
};

// Safe HTTP request helper with graceful error handling
async function request(endpoint, options = {}) {
  const base = getApiBase();
  const url = `${base}${endpoint}`;
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return { success: res.ok, status: res.status };
  } catch (err) {
    console.warn(`[VorldX API] Request to ${url} failed (network/offline):`, err);
    return { 
      error: 'Cannot reach server. Running in offline/demo mode.', 
      success: false,
      isOffline: true 
    };
  }
}

export const api = {
  // Auth & Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/auth/employees?${query}`);
  },

  async getEmployee(id) {
    return request(`/auth/employee/${id}`);
  },

  async updateEmployeeProfile(id, data) {
    return request(`/auth/employee/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  async mobileLogin(employeeId) {
    return request('/auth/mobile-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId })
    });
  },

  async requestRegistrationOtp(employeeId) {
    return request('/auth/register-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId })
    });
  },

  async verifyOtp(employeeId, otp) {
    return request('/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId, otp })
    });
  },

  // WFO Desktop Terminal & Mobile Personal QR Workflow
  async getNetworkInfo() {
    return request('/wfo/network-info');
  },

  async wfoInitiate(employeeId) {
    return request('/wfo/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId })
    });
  },

  async wfoVerifyOtp(employeeId, otp) {
    return request('/wfo/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId, otp })
    });
  },

  async wfoGetSessionStatus(sessionId) {
    return request(`/wfo/session-status/${sessionId}`);
  },

  async wfoMobileConfirm(sessionId, employeeId) {
    return request('/wfo/mobile-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, employee_id: employeeId })
    });
  },

  // Kiosk & QR Displays (Screen 8 & Screen 18)
  async getDisplays() {
    return request('/kiosk/displays');
  },

  async addDisplay(data) {
    return request('/kiosk/displays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async toggleDisplayStatus(id, status) {
    return request(`/kiosk/displays/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  async getKioskToken(displayId = 'QR001') {
    return request(`/kiosk/token?display_id=${displayId}`);
  },

  async getKioskRecentScans() {
    return request('/kiosk/recent-scans');
  },

  // Attendance
  async scanAttendance({ employeeId, qrPayload, simulatedTime }) {
    return request('/attendance/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: employeeId,
        qr_payload: qrPayload,
        simulated_time: simulatedTime
      })
    });
  },

  async getTodayAttendance(employeeId) {
    return request(`/attendance/today/${employeeId}`);
  },

  async getAttendanceHistory(employeeId) {
    return request(`/attendance/history/${employeeId}`);
  },

  async getAllAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/attendance/all?${query}`);
  },

  async regularizeAttendance(id, data) {
    return request(`/attendance/regularize/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Work From Home (Screen 6 & 15)
  async getWfhEligibility(employeeId) {
    return request(`/wfh/eligibility/${employeeId}`);
  },

  async submitWfhRequest({ employeeId, requestDate, reason }) {
    return request('/wfh/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_id: employeeId,
        request_date: requestDate,
        reason
      })
    });
  },

  async getEmployeeWfhRequests(employeeId) {
    return request(`/wfh/employee/${employeeId}`);
  },

  async getAllWfhRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/wfh/all?${query}`);
  },

  async reviewWfhRequest(id, { status, adminComment, reviewedBy }) {
    return request(`/wfh/review/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        admin_comment: adminComment,
        reviewed_by: reviewedBy
      })
    });
  },

  // Admin Portal & Reports (Screen 2, 4, 7, 9, 10)
  async getAdminOverview() {
    return request('/admin/overview');
  },

  async getEmployeeFullProfile(id) {
    return request(`/admin/employee/${id}/profile`);
  },

  async createEmployee(data) {
    return request('/admin/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getPolicies() {
    return request('/admin/policies');
  },

  async updatePolicies(data) {
    return request('/admin/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getAuditLogs() {
    return request('/admin/audit-logs');
  },

  async resetDemoData() {
    return request('/admin/reset-demo', { method: 'POST' });
  },

  async pingServer(targetHost) {
    try {
      const url = targetHost ? `${targetHost.replace(/\/$/, '')}/api/health` : `${getApiBase()}/health`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return res.ok;
    } catch (e) {
      return false;
    }
  }
};
