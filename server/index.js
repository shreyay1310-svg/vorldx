const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./db');

const authRoutes = require('./routes/auth');
const { router: kioskRoutes } = require('./routes/kiosk');
const attendanceRoutes = require('./routes/attendance');
const wfhRoutes = require('./routes/wfh');
const adminRoutes = require('./routes/admin');
const { router: wfoRoutes } = require('./routes/wfo');
const leaveRoutes = require('./routes/leaves');
const announcementRoutes = require('./routes/announcements');
const projectRoutes = require('./routes/projects');

// Ensure DB is set up
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kiosk', kioskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/wfh', wfhRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wfo', wfoRoutes);

// Direct APK Download Endpoint
app.get(['/api/download/apk', '/downloads/VorldX-Attendance.apk'], (req, res) => {
  const apkPath = path.join(__dirname, 'downloads', 'VorldX-Attendance.apk');
  const fs = require('fs');
  if (fs.existsSync(apkPath)) {
    res.download(apkPath, 'VorldX-Attendance.apk');
  } else {
    res.status(404).json({ error: 'APK file not found' });
  }
});

// Direct Project Report PDF Download Endpoint
app.get(['/api/download/report-pdf', '/downloads/VorldX-Project-Report.pdf', '/api/report-pdf'], (req, res) => {
  const pdfPath = path.join(__dirname, 'downloads', 'VorldX-Project-Report.pdf');
  const rootPdfPath = path.join(__dirname, '..', 'VorldX_Project_Report.pdf');
  const fs = require('fs');
  const target = fs.existsSync(pdfPath) ? pdfPath : (fs.existsSync(rootPdfPath) ? rootPdfPath : null);
  if (target) {
    res.download(target, 'VorldX_Project_Report.pdf');
  } else {
    res.status(404).json({ error: 'PDF Report file not found' });
  }
});

// Dynamic network IP detection
const os = require('os');
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '192.168.1.77';
}

// Health check & Test Ping endpoints (supports mobile APK diagnostics)
app.get(['/api/ping', '/ping', '/api/health', '/health'], (req, res) => {
  const currentIp = getLocalIp();
  res.json({
    status: 'online',
    success: true,
    message: 'VorldX Attendance Backend API is Online & Ready',
    service: 'VorldX Employee Attendance API',
    timestamp: new Date().toISOString(),
    ip: currentIp,
    port: PORT,
    cin: 'U62099UP2026PTC245598'
  });
});

// Serve frontend in production build if built
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  const currentIp = getLocalIp();
  console.log(`=================================================`);
  console.log(`🚀 VorldX Attendance Server running on 0.0.0.0:${PORT}`);
  console.log(`📍 Headquarters: Lucknow, U.P., India (CIN: U62099UP2026PTC245598)`);
  console.log(`🌐 Local API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Network LAN API: http://${currentIp}:${PORT}/api/health`);
  console.log(`=================================================`);
});
