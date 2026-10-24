import React, { useState, useEffect } from 'react';
import RealDatePickerPopover from '../components/RealDatePickerPopover';
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
  FileText,
  Send,
  UserPlus,
  UserCheck,
  Eye,
  Megaphone,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Upload,
  ExternalLink,
  ChevronDown,
  Printer,
  Trash2,
  HelpCircle,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { api } from '../api';
import VorldXLogin from './VorldXLogin';
import './AdminPortal.css';

export default function AdminPortal({
  initialUser,
  externalIsLoggedIn = true,
  onLogout,
  onSwitchToEmployee
} = {}) {
  // Current logged in user (Default to Rahul Verma - Admin • HR Management as shown in reference)
  const [currentUser, setCurrentUser] = useState(initialUser || {
    id: 'EMP000',
    name: 'Rahul Verma',
    role: 'Admin • HR Management',
    designation: 'Admin • HR Management',
    email: 'rahul.verma@worldx.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'
  });

  const [isLoggedIn, setIsLoggedIn] = useState(externalIsLoggedIn !== undefined ? externalIsLoggedIn : true);

  // Active module matching 12 Sidebar Modules & 7 Core Mockup Screens:
  // 'dashboard' (1), 'employees' (2), 'wfh' (3), 'leaves' (4), 'hr_management' (5), 'policies' (6), 'reports' (7)
  // Additional modules: 'attendance', 'roles', 'notices', 'settings', 'audit_logs'
  const [activeModule, setActiveModule] = useState('dashboard');

  // Search & Global filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  // ---------------------------------------------------------------------------
  // SCREEN 2: EMPLOYEES DIRECTORY STATE & DATA (Exact 8 employees from mockup)
  // ---------------------------------------------------------------------------
  const [employees, setEmployees] = useState([
    { id: 'EMP001', name: 'Neha Singh', department: 'Software Development', designation: 'Developer', joining_date: '10 Jan 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 'EMP005', name: 'Rohit Sharma', department: 'Product Design', designation: 'Designer', joining_date: '12 Feb 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'EMP012', name: 'Pooja Yadav', department: 'Human Resources', designation: 'Executive', joining_date: '01 Mar 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'EMP018', name: 'Amit Kumar', department: 'Operations', designation: 'Manager', joining_date: '15 Apr 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP020', name: 'Karan Mehta', department: 'Marketing', designation: 'Associate', joining_date: '01 May 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 'EMP022', name: 'Sneha Verma', department: 'Quality Assurance', designation: 'QA Engineer', joining_date: '20 May 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' },
    { id: 'EMP028', name: 'Vikram Singh', department: 'Finance', designation: 'Analyst', joining_date: '11 Jun 2024', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128' },
    { id: 'EMP030', name: 'Anjali Gupta', department: 'IT Support', designation: 'Support Engineer', joining_date: '25 Jul 2024', status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128' }
  ]);
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('All');
  const [empRoleFilter, setEmpRoleFilter] = useState('All');
  const [empStatusFilter, setEmpStatusFilter] = useState('All');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPresentModal, setShowPresentModal] = useState(false);
  const [presentSearch, setPresentSearch] = useState('');
  const [viewAttendanceRecordModal, setViewAttendanceRecordModal] = useState(null);
  const [editAttendanceRecordModal, setEditAttendanceRecordModal] = useState(null);
  const [presentEmployeesList, setPresentEmployeesList] = useState([
    { id: 'EMP000', name: 'Amit Singh', department: 'Administration', date: '16 Oct 2026', arrival: '08:52 AM', departure: '06:02 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' },
    { id: 'EMP001', name: 'Neha Singh', department: 'Software Development', date: '16 Oct 2026', arrival: '09:02 AM', departure: '06:05 PM', total_hours: '9h 03m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 'EMP002', name: 'Aarav Patel', department: 'Software Development', date: '16 Oct 2026', arrival: '08:55 AM', departure: '06:00 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'EMP003', name: 'Priya Nair', department: 'Software Development', date: '16 Oct 2026', arrival: '08:48 AM', departure: '05:58 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'EMP004', name: 'Rohan Iyer', department: 'Software Development', date: '16 Oct 2026', arrival: '09:10 AM', departure: '06:15 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP005', name: 'Rohit Sharma', department: 'Product Design', date: '16 Oct 2026', arrival: '09:22 AM', departure: '06:25 PM', total_hours: '9h 03m', status: 'Present', arrival_status: 'Late by 7m', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'EMP006', name: 'Siddharth Joshi', department: 'Product Design', date: '16 Oct 2026', arrival: '09:05 AM', departure: '06:10 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 'EMP007', name: 'Ananya Rao', department: 'Product Design', date: '16 Oct 2026', arrival: '09:00 AM', departure: '06:02 PM', total_hours: '9h 02m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128' },
    { id: 'EMP008', name: 'Aditya Chopra', department: 'Software Development', date: '16 Oct 2026', arrival: '08:50 AM', departure: '06:00 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128' },
    { id: 'EMP009', name: 'Divya Menon', department: 'Software Development', date: '16 Oct 2026', arrival: '08:59 AM', departure: '06:05 PM', total_hours: '9h 06m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' },
    { id: 'EMP010', name: 'Kabir Malhotra', department: 'Software Development', date: '16 Oct 2026', arrival: '09:12 AM', departure: '06:18 PM', total_hours: '9h 06m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128' },
    { id: 'EMP011', name: 'Meera Nambiar', department: 'Product Design', date: '16 Oct 2026', arrival: '09:01 AM', departure: '06:04 PM', total_hours: '9h 03m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128' },
    { id: 'EMP012', name: 'Pooja Yadav', department: 'Human Resources', date: '16 Oct 2026', arrival: '08:45 AM', departure: '05:55 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'EMP014', name: 'Arun Mishra', department: 'Human Resources', date: '16 Oct 2026', arrival: '08:50 AM', departure: '06:05 PM', total_hours: '9h 15m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP016', name: 'Ritika Sharma', department: 'Human Resources', date: '16 Oct 2026', arrival: '08:58 AM', departure: '06:08 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128' },
    { id: 'EMP018', name: 'Amit Kumar', department: 'Operations', date: '16 Oct 2026', arrival: '09:00 AM', departure: '06:10 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 'EMP019', name: 'Sunil Gavaskar', department: 'Operations', date: '16 Oct 2026', arrival: '09:05 AM', departure: '06:05 PM', total_hours: '9h 00m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128' },
    { id: 'EMP020', name: 'Karan Mehta', department: 'Marketing', date: '16 Oct 2026', arrival: '09:14 AM', departure: '06:20 PM', total_hours: '9h 06m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'EMP022', name: 'Sneha Verma', department: 'Quality Assurance', date: '16 Oct 2026', arrival: '08:57 AM', departure: '06:02 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' },
    { id: 'EMP023', name: 'Rakesh Pandey', department: 'Software Development', date: '16 Oct 2026', arrival: '09:03 AM', departure: '06:08 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128' },
    { id: 'EMP024', name: 'Shweta Tiwari', department: 'Software Development', date: '16 Oct 2026', arrival: '09:08 AM', departure: '06:12 PM', total_hours: '9h 04m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128' },
    { id: 'EMP025', name: 'Mohit Chauhan', department: 'Software Development', date: '16 Oct 2026', arrival: '08:56 AM', departure: '06:00 PM', total_hours: '9h 04m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP026', name: 'Varun Dhawan', department: 'Marketing', date: '16 Oct 2026', arrival: '09:11 AM', departure: '06:15 PM', total_hours: '9h 04m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 'EMP028', name: 'Vikram Singh', department: 'Finance', date: '16 Oct 2026', arrival: '08:51 AM', departure: '06:01 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128' },
    { id: 'EMP029', name: 'Gaurav Seth', department: 'Finance', date: '16 Oct 2026', arrival: '09:04 AM', departure: '06:06 PM', total_hours: '9h 02m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'EMP030', name: 'Anjali Gupta', department: 'IT Support', date: '16 Oct 2026', arrival: '08:49 AM', departure: '05:59 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128' },
    { id: 'EMP031', name: 'Harsh Vardhan', department: 'IT Support', date: '16 Oct 2026', arrival: '08:55 AM', departure: '06:05 PM', total_hours: '9h 10m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128' },
    { id: 'EMP032', name: 'Bhavna Sen', department: 'Software Development', date: '16 Oct 2026', arrival: '09:07 AM', departure: '06:10 PM', total_hours: '9h 03m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' },
    { id: 'EMP033', name: 'Kunal Roy', department: 'Software Development', date: '16 Oct 2026', arrival: '09:02 AM', departure: '06:07 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 'EMP034', name: 'Pallavi Sen', department: 'Product Design', date: '16 Oct 2026', arrival: '08:58 AM', departure: '06:02 PM', total_hours: '9h 04m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'EMP035', name: 'Naveen Jindal', department: 'Operations', date: '16 Oct 2026', arrival: '09:00 AM', departure: '06:05 PM', total_hours: '9h 05m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP036', name: 'Suman Lata', department: 'Operations', date: '16 Oct 2026', arrival: '08:54 AM', departure: '06:00 PM', total_hours: '9h 06m', status: 'Present', arrival_status: 'On Time', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128' }
  ]);

  // Live attendance synchronization with SQLite Database for Admin
  useEffect(() => {
    const fetchAdminAttendance = async () => {
      try {
        const records = await api.getAllAttendance();
        if (Array.isArray(records) && records.length > 0) {
          const mapped = records.map(r => ({
            id: r.employee_id,
            name: r.employee_name || (r.employee_id === 'EMP005' ? 'Rohit S.' : 'Employee'),
            department: r.department || 'Engineering',
            date: r.date || 'Today',
            arrival: r.check_in || '--:--',
            departure: r.check_out || '--:--',
            total_hours: r.duration_minutes ? `${Math.floor(r.duration_minutes / 60)}h ${r.duration_minutes % 60}m` : (r.check_in && !r.check_out ? 'In Progress' : '--'),
            status: r.status || 'Present',
            arrival_status: r.late_by_minutes ? `Late by ${r.late_by_minutes}m` : 'On Time',
            avatar: r.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128'
          }));

          setPresentEmployeesList(prev => {
            const existingIds = new Set(mapped.map(m => m.id));
            const remaining = prev.filter(p => !existingIds.has(p.id));
            return [...mapped, ...remaining];
          });
        }
      } catch (err) {}
    };

    fetchAdminAttendance();
    const timer = setInterval(fetchAdminAttendance, 3000);
    return () => clearInterval(timer);
  }, []);

  const [newEmp, setNewEmp] = useState({
    id: 'EMP035',
    name: '',
    email: '',
    department: 'Software Development',
    designation: 'Developer',
    joining_date: '16 Oct 2026',
    status: 'Active'
  });

  // ---------------------------------------------------------------------------
  // SCREEN 3: WFH REQUESTS STATE & DATA (Exact 5 rows from mockup)
  // ---------------------------------------------------------------------------
  const [wfhTab, setWfhTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'
  const [wfhSearch, setWfhSearch] = useState('');
  const [wfhDeptFilter, setWfhDeptFilter] = useState('All');
  const [wfhList, setWfhList] = useState([
    { id: 'WFH-01', employee_id: 'EMP001', employee_name: 'Neha Singh', department: 'Software Dev', request_date: '14 Oct 2026', reason: 'Family function', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 'WFH-02', employee_id: 'EMP005', employee_name: 'Rohit Sharma', department: 'Product Design', request_date: '13 Oct 2026', reason: 'Personal work', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'WFH-03', employee_id: 'EMP012', employee_name: 'Pooja Yadav', department: 'HR', request_date: '12 Oct 2026', reason: 'Health issue', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'WFH-04', employee_id: 'EMP020', employee_name: 'Karan Mehta', department: 'Marketing', request_date: '10 Oct 2026', reason: 'Family commitment', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 'WFH-05', employee_id: 'EMP030', employee_name: 'Anjali Gupta', department: 'IT Support', request_date: '08 Oct 2026', reason: 'Official work', status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128' }
  ]);

  // ---------------------------------------------------------------------------
  // SCREEN 4: LEAVE REQUESTS STATE & DATA (Exact 5 rows from mockup)
  // ---------------------------------------------------------------------------
  const [leaveTab, setLeaveTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'
  const [leaveSearch, setLeaveSearch] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');
  const [leaveList, setLeaveList] = useState([
    { id: 'LV-01', employee_id: 'EMP005', employee_name: 'Rohit Sharma', leave_type: 'Casual Leave', from_date: '14 Oct 2026', to_date: '15 Oct 2026', total_days: 2, reason: 'Personal work', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 'LV-02', employee_id: 'EMP012', employee_name: 'Pooja Yadav', leave_type: 'Sick Leave', from_date: '12 Oct 2026', to_date: '12 Oct 2026', total_days: 1, reason: 'Fever', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'LV-03', employee_id: 'EMP001', employee_name: 'Neha Singh', leave_type: 'Earned Leave', from_date: '05 Oct 2026', to_date: '07 Oct 2026', total_days: 3, reason: 'Family vacation', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 'LV-04', employee_id: 'EMP018', employee_name: 'Amit Kumar', leave_type: 'Casual Leave', from_date: '28 Sep 2026', to_date: '29 Sep 2026', total_days: 2, reason: 'Personal', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'LV-05', employee_id: 'EMP020', employee_name: 'Karan Mehta', leave_type: 'Sick Leave', from_date: '20 Sep 2026', to_date: '20 Sep 2026', total_days: 1, reason: 'Health issue', status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' }
  ]);

  // ---------------------------------------------------------------------------
  // SCREEN 5: HR MANAGEMENT (ADMIN) STATE & DATA
  // ---------------------------------------------------------------------------
  const [hrMembers, setHrMembers] = useState([
    { id: 'EMP012', name: 'Pooja Yadav', role: 'HR Executive', department: 'Human Resources', email: 'pooja@vorldx.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'EMP014', name: 'Arun Mishra', role: 'HR Manager', department: 'Human Resources', email: 'arun@vorldx.com', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP016', name: 'Ritika Sharma', role: 'HR Executive', department: 'Human Resources', email: 'ritika@vorldx.com', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' }
  ]);
  const [hrRequestsTab, setHrRequestsTab] = useState('Pending');
  const [hrRequestsList, setHrRequestsList] = useState([
    { id: 'HR-REQ-01', member: 'Pooja Yadav', type: 'WFH', date: '14 Oct 2026', reason: 'Doctor appointment', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'HR-REQ-02', member: 'Arun Mishra', type: 'Leave', date: '10 Oct 2026', reason: 'Personal', status: 'Approved', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' }
  ]);
  const [showAddHrModal, setShowAddHrModal] = useState(false);
  const [newHrMember, setNewHrMember] = useState({
    name: '',
    role: 'HR Executive',
    email: '',
    status: 'Active'
  });

  // ---------------------------------------------------------------------------
  // SCREEN 6: HR MANAGEMENT STATE & DATA (Image 2 Screen 6)
  // Tabs: Departments, Designations, Holidays, Shifts, Work Locations
  // ---------------------------------------------------------------------------
  const [hrMgmtTab, setHrMgmtTab] = useState('Departments');
  const [departmentsList, setDepartmentsList] = useState([
    { id: 1, name: 'Engineering', head: 'Amit Kumar', headAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128', employeeCount: 50, status: 'Active' },
    { id: 2, name: 'Human Resources', head: 'Neha Gupta', headAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128', employeeCount: 12, status: 'Active' },
    { id: 3, name: 'Marketing', head: 'Priya Sharma', headAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128', employeeCount: 20, status: 'Active' },
    { id: 4, name: 'Sales', head: 'Ankit Verma', headAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128', employeeCount: 28, status: 'Active' },
    { id: 5, name: 'Finance', head: 'Vikas Rai', headAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128', employeeCount: 15, status: 'Active' },
    { id: 6, name: 'Quality Assurance', head: 'Sneha Verma', headAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128', employeeCount: 14, status: 'Active' },
    { id: 7, name: 'IT Support', head: 'Rohan Iyer', headAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128', employeeCount: 18, status: 'Active' }
  ]);
  const [designationsList, setDesignationsList] = useState([
    { id: 1, designation: 'Senior Software Engineer', department: 'Engineering', count: 18, status: 'Active' },
    { id: 2, designation: 'Frontend Specialist', department: 'Engineering', count: 12, status: 'Active' },
    { id: 3, designation: 'UI/UX Designer', department: 'Product Design', count: 8, status: 'Active' },
    { id: 4, designation: 'HR Operations Manager', department: 'Human Resources', count: 4, status: 'Active' },
    { id: 5, designation: 'Account Executive', department: 'Sales', count: 14, status: 'Active' },
    { id: 6, designation: 'Financial Analyst', department: 'Finance', count: 6, status: 'Active' }
  ]);
  const [holidaysList, setHolidaysList] = useState([
    { id: 1, name: 'Diwali (Deepavali)', date: '24 Oct 2026', day: 'Saturday', type: 'Gazetted Holiday', status: 'Upcoming' },
    { id: 2, name: 'Govardhan Puja', date: '25 Oct 2026', day: 'Sunday', type: 'Restricted Holiday', status: 'Upcoming' },
    { id: 3, name: 'Bhai Dooj', date: '26 Oct 2026', day: 'Monday', type: 'Gazetted Holiday', status: 'Upcoming' },
    { id: 4, name: 'Guru Nanak Jayanti', date: '15 Nov 2026', day: 'Sunday', type: 'Gazetted Holiday', status: 'Upcoming' },
    { id: 5, name: 'Christmas Day', date: '25 Dec 2026', day: 'Friday', type: 'Public Holiday', status: 'Upcoming' }
  ]);
  const [shiftsList, setShiftsList] = useState([
    { id: 1, name: 'General Shift (HQ)', timing: '09:00 AM - 06:00 PM', grace: '15 mins', count: 180, status: 'Active' },
    { id: 2, name: 'Early Engineering Shift', timing: '08:00 AM - 05:00 PM', grace: '10 mins', count: 35, status: 'Active' },
    { id: 3, name: 'Afternoon Support Shift', timing: '01:00 PM - 10:00 PM', grace: '15 mins', count: 25, status: 'Active' },
    { id: 4, name: 'Night Operations Shift', timing: '10:00 PM - 07:00 AM', grace: '20 mins', count: 10, status: 'Active' }
  ]);
  const [workLocationsList, setWorkLocationsList] = useState([
    { id: 1, name: 'Lucknow HQ Campus', address: 'Cyber City, Lucknow, UP', geofence: '150 meters', staff: 210, status: 'Active' },
    { id: 2, name: 'Noida Regional Tech Center', address: 'Sector 62, Noida, NCR', geofence: '100 meters', staff: 25, status: 'Active' },
    { id: 3, name: 'Bangalore Innovation Lab', address: 'HSR Layout, Bengaluru, KA', geofence: '120 meters', staff: 15, status: 'Active' }
  ]);
  const [showAddHrItemModal, setShowAddHrItemModal] = useState(false);
  const [newHrItemForm, setNewHrItemForm] = useState({
    name: '',
    field2: '',
    field3: '',
    field4: '',
    status: 'Active'
  });

  // ---------------------------------------------------------------------------
  // SCREEN 7: ROLES & PERMISSIONS STATE (Image 2 Screen 7)
  // Tabs: Roles, Users, Permissions
  // ---------------------------------------------------------------------------
  const [rolesTab, setRolesTab] = useState('Roles');
  const [rolesList, setRolesList] = useState([
    { id: 1, roleName: 'Admin', description: 'Full access to all modules and configurations', users: 5, status: 'Active' },
    { id: 2, roleName: 'HR', description: 'Manage employees, leaves, attendance and policies', users: 8, status: 'Active' },
    { id: 3, roleName: 'Manager', description: 'Approve team leaves, view team attendance reports', users: 15, status: 'Active' },
    { id: 4, roleName: 'Employee', description: 'Limited access to own attendance, slips and requests', users: 200, status: 'Active' },
    { id: 5, roleName: 'Auditor', description: 'Read-only access to audit trail and compliance', users: 2, status: 'Active' }
  ]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingRoleModal, setEditingRoleModal] = useState(null);
  const [newRoleForm, setNewRoleForm] = useState({
    roleName: '',
    description: '',
    users: 1,
    status: 'Active'
  });
  const [usersRolesList, setUsersRolesList] = useState([
    { id: 'EMP001', name: 'Rahul Verma', role: 'Admin', dept: 'HR & Management', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128' },
    { id: 'EMP012', name: 'Pooja Yadav', role: 'HR', dept: 'Human Resources', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 'EMP018', name: 'Amit Kumar', role: 'Manager', dept: 'Operations', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 'EMP005', name: 'Neha Singh', role: 'Employee', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 'EMP024', name: 'Vikram Mehta', role: 'Auditor', dept: 'Compliance & Legal', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' }
  ]);
  const [permissionsMatrix, setPermissionsMatrix] = useState([
    { module: 'Dashboard & Global Analytics', admin: true, hr: true, mgr: true, emp: false },
    { module: 'Employee Directory & Roster', admin: true, hr: true, mgr: true, emp: false },
    { module: 'Daily Attendance & Punch Kiosk', admin: true, hr: true, mgr: true, emp: true },
    { module: 'WFH & Leave Approval Rights', admin: true, hr: true, mgr: true, emp: false },
    { module: 'Company Policy Management', admin: true, hr: true, mgr: false, emp: false },
    { module: 'System Settings & Audit Logs', admin: true, hr: false, mgr: false, emp: false }
  ]);

  // ---------------------------------------------------------------------------
  // SCREEN 8: COMPANY POLICIES STATE (Image 2 Screen 8)
  // Tabs: All Policies, HR Policies, Attendance, Leave, WFH, Others
  // ---------------------------------------------------------------------------
  const [policiesDocTab, setPoliciesDocTab] = useState('All Policies');
  const [policiesDocsList, setPoliciesDocsList] = useState([
    { id: 1, name: 'Work From Home Policy', category: 'HR Policies', size: '2.4 MB', updatedOn: '01 Aug 2026', downloads: 142 },
    { id: 2, name: 'Leave & Attendance Policy', category: 'HR Policies', size: '3.1 MB', updatedOn: '15 Jul 2026', downloads: 218 },
    { id: 3, name: 'Code of Professional Conduct', category: 'General', size: '1.8 MB', updatedOn: '10 Aug 2026', downloads: 195 },
    { id: 4, name: 'Information Security Policy', category: 'IT Security', size: '2.1 MB', updatedOn: '12 Aug 2026', downloads: 167 },
    { id: 5, name: 'Travel & Expense Reimbursement', category: 'Finance', size: '1.5 MB', updatedOn: '14 Aug 2026', downloads: 88 },
    { id: 6, name: 'POSH & Workplace Safety Policy', category: 'HR Policies', size: '2.8 MB', updatedOn: '20 Aug 2026', downloads: 130 },
    { id: 7, name: 'Attendance & Punctuality Rules', category: 'Attendance', size: '1.6 MB', updatedOn: '22 Aug 2026', downloads: 94 },
    { id: 8, name: 'Annual & Sick Leave Entitlement', category: 'Leave', size: '2.2 MB', updatedOn: '25 Aug 2026', downloads: 176 },
    { id: 9, name: 'Remote Work Infrastructure & Security', category: 'WFH', size: '3.0 MB', updatedOn: '05 Sep 2026', downloads: 112 }
  ]);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [viewPolicyModalDoc, setViewPolicyModalDoc] = useState(null);
  const [newPolicyForm, setNewPolicyForm] = useState({
    name: '',
    category: 'HR Policies',
    size: '2.1 MB',
    summary: ''
  });

  // ---------------------------------------------------------------------------
  // SCREEN 9: NOTICES & ANNOUNCEMENTS STATE (Image 2 Screen 9)
  // Tabs: All (10), Important (4), General (4), Holiday (2)
  // ---------------------------------------------------------------------------
  const [noticesTab, setNoticesTab] = useState('All');
  const [noticesList, setNoticesList] = useState([
    { id: 1, title: 'Office will remain closed on 24th Oct 2026 (Diwali Holiday)', type: 'Holiday', date: '12 Oct 2026', status: 'Published', content: 'In celebration of Diwali, the Festival of Lights, all WorldX offices across Lucknow, Noida, and Bengaluru will remain officially closed on 24th October 2026. Have a safe and prosperous festival!', audience: 'All Staff' },
    { id: 2, title: 'Diwali Gift Voucher Distribution at Lucknow Campus', type: 'Holiday', date: '25 Sep 2026', status: 'Published', content: 'Festive gift hampers and coupons can be collected from the HR Reception Desk on Floor 4 between 10:00 AM and 05:00 PM.', audience: 'Lucknow HQ' },
    { id: 3, title: 'Mandatory profile update for all employees', type: 'Important', date: '01 Oct 2026', status: 'Published', content: 'All staff members must verify their emergency contact numbers and bank payout details in the Profile Management tab before 25th October.', audience: 'All Staff' },
    { id: 4, title: 'Annual Health Checkup Camp Registration at HQ', type: 'Important', date: '28 Sep 2026', status: 'Published', content: 'WorldX Wellness Camp starts on 5th Nov. Free dental, vision, and full-body health screenings available.', audience: 'All Staff' },
    { id: 5, title: 'Quarterly compliance and data safety certification deadline', type: 'Important', date: '20 Sep 2026', status: 'Published', content: 'Complete the mandatory ISO/IEC 27001 data protection quiz on the internal portal before month end.', audience: 'Engineering & HR' },
    { id: 6, title: 'Server maintenance window scheduled for Saturday 02:00 AM', type: 'Important', date: '15 Sep 2026', status: 'Published', content: 'Core infrastructure will undergo scheduled firmware upgrades. Kiosk attendance will fall back to offline mode during this 30-minute window.', audience: 'All Staff' },
    { id: 7, title: 'New IT Security Policy is now live. Please review.', type: 'General', date: '10 Oct 2026', status: 'Published', content: 'Our updated Information Security and Cloud Access policy is now available in the Company Policies module. Please review and acknowledge.', audience: 'All Staff' },
    { id: 8, title: 'Quarterly performance review cycle starts next week', type: 'General', date: '05 Oct 2026', status: 'Published', content: 'Managers and department leads should schedule 1:1 appraisal check-ins. Self-evaluation forms are now live.', audience: 'Managers & Leads' },
    { id: 9, title: 'New Cafeteria Vendor & Organic Salad Bar at HQ', type: 'General', date: '18 Sep 2026', status: 'Published', content: 'We are excited to welcome GreenEats to the 3rd floor cafeteria starting this Monday with subsidized meal passes.', audience: 'Lucknow HQ' },
    { id: 10, title: 'Monthly Town Hall & CEO Keynote address this Friday', type: 'General', date: '14 Sep 2026', status: 'Published', content: 'Join us in Auditorium A or via the live broadcast link for our Q3 company highlights and product roadmap reveal.', audience: 'All Staff' }
  ]);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [viewNoticeModal, setViewNoticeModal] = useState(null);
  const [editingNoticeModal, setEditingNoticeModal] = useState(null);
  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    type: 'General',
    date: '22 Oct 2026',
    content: '',
    audience: 'All Staff'
  });

  // ---------------------------------------------------------------------------
  // SCREEN 10: REPORTS & ANALYTICS STATE (Image 2 Screen 10)
  // Tabs: Attendance, Leave, WFH, Department, Employee, Export
  // ---------------------------------------------------------------------------
  const [reportsSubTab, setReportsSubTab] = useState('Attendance');
  const [reportFormat, setReportFormat] = useState('PDF'); // 'PDF' | 'Excel' | 'CSV'
  const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);
  const [reportEmployeeSearch, setReportEmployeeSearch] = useState('');

  // ---------------------------------------------------------------------------
  // SCREEN 11: TEAM CALENDAR STATE (Image 2 Screen 11)
  // Month / Week / Day toggle + Upcoming Events
  // ---------------------------------------------------------------------------
  const [adminCalView, setAdminCalView] = useState('Month'); // 'Month', 'Week', 'Day'
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, day: '16', mon: 'OCT', title: 'Monthly Team Meeting', sub: '10:00 AM - 11:00 AM', tag: 'Meeting', tagBg: 'rgba(37, 99, 235, 0.2)', tagColor: '#38bdf8' },
    { id: 2, day: '18', mon: 'OCT', title: 'Performance Review Cycle', sub: 'All Departments', tag: 'Event', tagBg: 'rgba(245, 158, 11, 0.2)', tagColor: '#fbbf24' },
    { id: 3, day: '21', mon: 'OCT', title: 'Policy Training Session', sub: '03:00 PM - 04:30 PM', tag: 'Training', tagBg: 'rgba(168, 85, 247, 0.2)', tagColor: '#c084fc' },
    { id: 4, day: '24', mon: 'OCT', title: 'Diwali Holiday', sub: 'All Day', tag: 'Holiday', tagBg: 'rgba(239, 68, 68, 0.2)', tagColor: '#f87171' }
  ]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    date: '2026-10-25',
    time: '11:00 AM - 12:00 PM',
    tag: 'Meeting'
  });

  // ---------------------------------------------------------------------------
  // SCREEN 12: PROFILE MANAGEMENT STATE (Image 2 Screen 12)
  // ---------------------------------------------------------------------------
  const [profileNavTab, setProfileNavTab] = useState('Personal Details');
  const [profileSubTab, setProfileSubTab] = useState('Personal Details');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    name: currentUser.name,
    role: currentUser.role,
    email: currentUser.email,
    avatar: currentUser.avatar
  });

  // ---------------------------------------------------------------------------
  // SCREEN 13: SYSTEM SETTINGS STATE (Image 2 Screen 13)
  // Tabs: General, Attendance Rules, Leave Settings, WFH Settings, Notifications, Integrations
  // ---------------------------------------------------------------------------
  const [systemSettingsTab, setSystemSettingsTab] = useState('General');
  const [generalSettingsForm, setGeneralSettingsForm] = useState({
    companyName: 'WorldX Technologies Pvt Ltd',
    timeZone: '(GMT+05:30) India Standard Time',
    dateFormat: 'DD/MM/YYYY',
    workDays: 'Monday - Friday',
    defaultWorkingHours: '09:00 AM - 06:00 PM'
  });
  const [systemPrefs, setSystemPrefs] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    autoApproveManager: true,
    allowAttendanceCorrection: true,
    enableWfhRequests: true
  });
  const [attendanceRulesSettings, setAttendanceRulesSettings] = useState({
    shiftStart: '09:00 AM',
    shiftEnd: '06:00 PM',
    gracePeriod: '15 mins',
    halfDayThreshold: '4 hours',
    geofenceRadius: '150 meters',
    autoMarkAbsent: '11:30 AM'
  });
  const [leaveSettingsForm, setLeaveSettingsForm] = useState({
    casualLeaves: 12,
    sickLeaves: 10,
    earnedLeaves: 18,
    carryForwardLimit: 8,
    requireManagerApproval: true,
    allowNegativeBalance: false
  });
  const [wfhSettingsForm, setWfhSettingsForm] = useState({
    monthlyQuota: 8,
    minNoticeHours: 12,
    requireCoreHours: true,
    coreHoursText: '11:00 AM - 04:00 PM',
    mandatoryVpn: true
  });
  const [notificationSettingsForm, setNotificationSettingsForm] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dailyDigest: true,
    leaveApprovalEmail: true,
    pushNotifications: true
  });
  // Screen 13: System Settings -> Integrations State
  const [configureIntegrationModal, setConfigureIntegrationModal] = useState(null);
  const [integrationsSettings, setIntegrationsSettings] = useState([
    {
      id: 1,
      name: 'Slack Workplace',
      desc: 'Sync daily attendance alerts and leave requests directly into #general',
      connected: true,
      webhookUrl: 'https://hooks.slack.com/services/T0821/B0821/x98a7sd6fa54',
      apiKey: 'xoxb-84920481-9921-slack-bot',
      channel: '#general-attendance',
      syncFreq: 'Real-time Webhook',
      lastSync: '2 minutes ago',
      events: ['Punch In/Out alerts', 'Leave approval notices', 'WFH alerts']
    },
    {
      id: 2,
      name: 'Microsoft Teams',
      desc: 'Bot notifications in HR & Admin operations channel',
      connected: true,
      webhookUrl: 'https://vorldx.webhook.office.com/webhookb2/hr-channel',
      apiKey: 'ms-teams-sec-48192-token',
      channel: 'HR & Admin Operations',
      syncFreq: 'Real-time Webhook',
      lastSync: '5 minutes ago',
      events: ['Leave requests', 'Attendance alerts', 'Kiosk status']
    },
    {
      id: 3,
      name: 'Google Workspace',
      desc: 'Sync official holidays and approved leaves with Google Calendar',
      connected: true,
      webhookUrl: 'https://calendar.googleapis.com/calendar/v3/calendars/vorldx-hr/events',
      apiKey: 'AIzaSyDw-VorldX-GoogleKey-9281',
      channel: 'VorldX Official Calendar',
      syncFreq: 'Real-time Webhook',
      lastSync: 'Just now',
      events: ['Official Holidays', 'Approved Leaves', 'Company Calendar']
    },
    {
      id: 4,
      name: 'ZKTeco Biometric API',
      desc: 'Hardware terminal clock-in sync for biometric scanners',
      connected: true,
      webhookUrl: 'https://biometrics.vorldx.internal:8443/api/v2/punch-stream',
      apiKey: 'zk-term-token-849204-hq',
      channel: 'Terminals 01, 02, 03, 04 (HQ)',
      syncFreq: 'Real-time API Webhook',
      lastSync: 'Real-time (0ms latency)',
      events: ['Biometric thumb punch', 'Face recognition logs', 'Hardware errors']
    }
  ]);

  // ---------------------------------------------------------------------------
  // SCREEN 14: AUDIT LOGS STATE (Image 2 Screen 14)
  // ---------------------------------------------------------------------------
  const [auditModuleFilter, setAuditModuleFilter] = useState('All');
  const [auditUserFilter, setAuditUserFilter] = useState('All');
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [auditLogsData, setAuditLogsData] = useState([
    { id: 1, user: 'Rahul Verma', action: 'Updated leave policy', module: 'Company Policies', dateTime: '14 Oct 2026, 10:25 AM' },
    { id: 2, user: 'Amit Kumar', action: 'Approved WFH request', module: 'WFH Requests', dateTime: '14 Oct 2026, 09:40 AM' },
    { id: 3, user: 'Pooja Yadav', action: 'Marked attendance', module: 'Attendance', dateTime: '14 Oct 2026, 09:05 AM' },
    { id: 4, user: 'Ankit Verma', action: 'Updated employee profile', module: 'Profile', dateTime: '13 Oct 2026, 05:20 PM' },
    { id: 5, user: 'Admin', action: 'Added new employee', module: 'Employees', dateTime: '13 Oct 2026, 04:15 PM' },
    { id: 6, user: 'System Bot', action: 'Nightly biometric sync completed', module: 'System', dateTime: '13 Oct 2026, 02:00 AM' }
  ]);

  // ---------------------------------------------------------------------------
  // SCREEN 15: HELP & SUPPORT STATE (Image 2 Screen 15)
  // Tabs: Support Tickets, FAQ, Contact HR
  // ---------------------------------------------------------------------------
  const [helpTicketsTab, setHelpTicketsTab] = useState('Support Tickets');
  const [selectedSupportTicket, setSelectedSupportTicket] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', category: 'Attendance', priority: 'High', description: '' });
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqExpandedIndex, setFaqExpandedIndex] = useState(null);
  const [faqHelpfulVotes, setFaqHelpfulVotes] = useState({});
  const [hrContactForm, setHrContactForm] = useState({ subject: '', category: 'General HR', message: '', urgency: 'Normal' });
  const [supportTicketsList, setSupportTicketsList] = useState([
    {
      id: 1,
      subject: 'Unable to mark attendance',
      category: 'Attendance',
      status: 'Open',
      priority: 'High',
      createdOn: '14 Oct 2026',
      employee: 'Rahul Verma',
      employeeId: 'EMP001',
      description: 'Face recognition kiosk at Lucknow 2nd floor returned error "Terminal 03 timeout" during morning clock-in at 09:05 AM.',
      replies: [
        { sender: 'Rahul Verma', time: '14 Oct 2026, 09:12 AM', text: 'Please resolve this so my daily check-in is not marked as late.' },
        { sender: 'IT Admin Support', time: '14 Oct 2026, 09:45 AM', text: 'We have logged the terminal issue and refreshed kiosk 03. Please try again or use the mobile QR.' }
      ]
    },
    {
      id: 2,
      subject: 'WFH policy clarification',
      category: 'HR',
      status: 'Resolved',
      priority: 'Medium',
      createdOn: '12 Oct 2026',
      employee: 'Amit Kumar',
      employeeId: 'EMP002',
      description: 'Need clarification on maximum allowable WFH days per month under the revised Q4 hybrid policy.',
      replies: [
        { sender: 'Amit Kumar', time: '12 Oct 2026, 11:20 AM', text: 'Can tech lead approve consecutive 3 WFH days?' },
        { sender: 'HR Operations', time: '12 Oct 2026, 02:30 PM', text: 'Policy allows up to 4 days WFH per month with manager approval. Beyond that requires HR sign-off.' }
      ]
    },
    {
      id: 3,
      subject: 'Leave balance calculation issue',
      category: 'Leave',
      status: 'Closed',
      priority: 'Low',
      createdOn: '10 Oct 2026',
      employee: 'Pooja Yadav',
      employeeId: 'EMP003',
      description: 'Annual leave balance showed 11 instead of 13 after Q3 accrual cycle update.',
      replies: [
        { sender: 'Pooja Yadav', time: '10 Oct 2026, 03:15 PM', text: 'Two accrued days from August were missing in the ledger.' },
        { sender: 'HR Admin', time: '11 Oct 2026, 10:00 AM', text: 'Discrepancy resolved. 2 days added to annual leave balance. Ledger now shows 13 days.' }
      ]
    },
    {
      id: 4,
      subject: 'System login problem on kiosk',
      category: 'Technical',
      status: 'Open',
      priority: 'High',
      createdOn: '08 Oct 2026',
      employee: 'Ankit Verma',
      employeeId: 'EMP004',
      description: 'Touchscreen calibration on Kiosk Terminal 02 is unresponsive to RFID badge swipe.',
      replies: [
        { sender: 'Ankit Verma', time: '08 Oct 2026, 09:02 AM', text: 'RFID badge reader is not registering scans on the terminal.' }
      ]
    }
  ]);

  // ---------------------------------------------------------------------------
  // SCREEN 16: SYSTEM OVERVIEW & APPROVALS STATE (Image 2 Screen 16)
  // ---------------------------------------------------------------------------
  const [systemOverviewSubTab, setSystemOverviewSubTab] = useState('Overview');
  const [pendingApprovalFilter, setPendingApprovalFilter] = useState('All');
  const [showGlobalPolicyModal, setShowGlobalPolicyModal] = useState(false);
  const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsLog, setDiagnosticsLog] = useState(null);
  const [activeUsersSearch, setActiveUsersSearch] = useState('');
  const [activeUsersLocationFilter, setActiveUsersLocationFilter] = useState('All');
  const [selectedPendingItem, setSelectedPendingItem] = useState(null);
  const [pendingApprovalsList, setPendingApprovalsList] = useState([
    // WFH Requests (6)
    { id: 'WFH-101', type: 'WFH', employee: 'Ananya Sharma', empId: 'EMP005', dept: 'Design', date: '23 Oct 2026', details: 'Client UI prototype sprint and broadband testing', urgency: 'Normal', status: 'Pending' },
    { id: 'WFH-102', type: 'WFH', employee: 'Amit Kumar', empId: 'EMP002', dept: 'Engineering', date: '24 Oct 2026', details: 'Home broadband fiber maintenance in the morning', urgency: 'Normal', status: 'Pending' },
    { id: 'WFH-103', type: 'WFH', employee: 'Vikas Patel', empId: 'EMP007', dept: 'Quality Assurance', date: '25 Oct 2026', details: 'Automated test suite load testing from home lab', urgency: 'High', status: 'Pending' },
    { id: 'WFH-104', type: 'WFH', employee: 'Priya Singh', empId: 'EMP008', dept: 'HR & Operations', date: '26 Oct 2026', details: 'Virtual campus recruitment interviews', urgency: 'Normal', status: 'Pending' },
    { id: 'WFH-105', type: 'WFH', employee: 'Rahul Verma', empId: 'EMP001', dept: 'Engineering', date: '27 Oct 2026', details: 'Deep architectural refactoring on attendance gateway', urgency: 'High', status: 'Pending' },
    { id: 'WFH-106', type: 'WFH', employee: 'Sneha Patel', empId: 'EMP009', dept: 'Marketing', date: '28 Oct 2026', details: 'Webinar host broadcast and video editing', urgency: 'Normal', status: 'Pending' },

    // Leave Requests (8)
    { id: 'LV-201', type: 'Leave', employee: 'Pooja Yadav', empId: 'EMP003', dept: 'Marketing', date: '24 Oct - 26 Oct', details: 'Casual Leave - Family function', urgency: 'Normal', status: 'Pending' },
    { id: 'LV-202', type: 'Leave', employee: 'Rohan Gupta', empId: 'EMP010', dept: 'Engineering', date: '25 Oct', details: 'Sick Leave - Viral fever with doctor prescription', urgency: 'High', status: 'Pending' },
    { id: 'LV-203', type: 'Leave', employee: 'Kavita Joshi', empId: 'EMP011', dept: 'Finance', date: '27 Oct - 29 Oct', details: 'Earned Leave - Pre-planned travel', urgency: 'Normal', status: 'Pending' },
    { id: 'LV-204', type: 'Leave', employee: 'Arjun Nair', empId: 'EMP012', dept: 'Product', date: '28 Oct', details: 'Casual Leave - Personal emergency', urgency: 'Normal', status: 'Pending' },
    { id: 'LV-205', type: 'Leave', employee: 'Meera Iyer', empId: 'EMP013', dept: 'HR & Operations', date: '30 Oct', details: 'Compensatory Off - Worked on Saturday deployment', urgency: 'Normal', status: 'Pending' },
    { id: 'LV-206', type: 'Leave', employee: 'Devendra Pal', empId: 'EMP014', dept: 'Support', date: '31 Oct', details: 'Casual Leave - Festival observance', urgency: 'Normal', status: 'Pending' },
    { id: 'LV-207', type: 'Leave', employee: 'Tanvi Saxena', empId: 'EMP015', dept: 'Engineering', date: '02 Nov - 04 Nov', details: 'Maternity check-up and medical leave', urgency: 'High', status: 'Pending' },
    { id: 'LV-208', type: 'Leave', employee: 'Sameer Khan', empId: 'EMP016', dept: 'Sales', date: '03 Nov', details: 'Earned Leave - Annual wellness day', urgency: 'Normal', status: 'Pending' },

    // Attendance Corrections (4)
    { id: 'AC-301', type: 'Attendance Correction', employee: 'Vikas Patel', empId: 'EMP007', dept: 'QA', date: '21 Oct 2026', details: 'Missed punch-out due to late production release', urgency: 'High', status: 'Pending' },
    { id: 'AC-302', type: 'Attendance Correction', employee: 'Priya Singh', empId: 'EMP008', dept: 'HR', date: '20 Oct 2026', details: 'Biometric fingerprint scanner timeout at 09:02 AM', urgency: 'Normal', status: 'Pending' },
    { id: 'AC-303', type: 'Attendance Correction', employee: 'Rahul Verma', empId: 'EMP001', dept: 'Engineering', date: '19 Oct 2026', details: 'QR code scan failure on Kiosk 01', urgency: 'Normal', status: 'Pending' },
    { id: 'AC-304', type: 'Attendance Correction', employee: 'Ananya Sharma', empId: 'EMP005', dept: 'Design', date: '18 Oct 2026', details: 'Office internet outage during punch-out', urgency: 'Normal', status: 'Pending' },

    // New Employee Requests (3)
    { id: 'EMP-REQ-401', type: 'New Employee', employee: 'Neha Kapoor', empId: 'TEMP-401', dept: 'Engineering', date: 'Joining 01 Nov 2026', details: 'Frontend React Developer - Offer accepted, IT provisioning needed', urgency: 'High', status: 'Pending' },
    { id: 'EMP-REQ-402', type: 'New Employee', employee: 'Siddharth Roy', empId: 'TEMP-402', dept: 'DevOps', date: 'Joining 05 Nov 2026', details: 'Cloud Infrastructure Engineer - Hardware kit allocation required', urgency: 'High', status: 'Pending' },
    { id: 'EMP-REQ-403', type: 'New Employee', employee: 'Aastha Mishra', empId: 'TEMP-403', dept: 'Marketing', date: 'Joining 10 Nov 2026', details: 'Content Strategist - Background check verified', urgency: 'Normal', status: 'Pending' }
  ]);

  const [activeUsersList, setActiveUsersList] = useState([
    { id: 1, name: 'Rahul Verma', empId: 'EMP001', role: 'Senior Software Engineer', dept: 'Engineering', location: 'Lucknow HQ', ip: '192.168.1.142', device: 'Chrome / Windows 11', activeSince: '09:05 AM', lastSeen: 'Just now', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128' },
    { id: 2, name: 'Ananya Sharma', empId: 'EMP005', role: 'UI/UX Designer', dept: 'Design', location: 'Remote / WFH', ip: '106.213.84.19', device: 'Safari / macOS Sonoma', activeSince: '09:12 AM', lastSeen: '1 min ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128' },
    { id: 3, name: 'Amit Kumar', empId: 'EMP002', role: 'Engineering Lead', dept: 'Engineering', location: 'Lucknow HQ', ip: '192.168.1.108', device: 'Firefox / Ubuntu 24', activeSince: '08:58 AM', lastSeen: 'Just now', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128' },
    { id: 4, name: 'Pooja Yadav', empId: 'EMP003', role: 'Marketing Specialist', dept: 'Marketing', location: 'Lucknow HQ', ip: '192.168.1.165', device: 'Edge / Windows 11', activeSince: '09:20 AM', lastSeen: '3 mins ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128' },
    { id: 5, name: 'Vikas Patel', empId: 'EMP007', role: 'QA Lead', dept: 'Quality Assurance', location: 'Remote / WFH', ip: '49.36.120.44', device: 'Chrome / macOS', activeSince: '09:30 AM', lastSeen: 'Just now', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128' },
    { id: 6, name: 'Priya Singh', empId: 'EMP008', role: 'HR Operations Manager', dept: 'HR & Operations', location: 'Lucknow HQ', ip: '192.168.1.115', device: 'Chrome / Windows 10', activeSince: '08:45 AM', lastSeen: 'Just now', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128' },
    { id: 7, name: 'Rohan Gupta', empId: 'EMP010', role: 'Backend Engineer', dept: 'Engineering', location: 'Lucknow HQ', ip: '192.168.1.189', device: 'Chrome / Linux', activeSince: '09:15 AM', lastSeen: '4 mins ago', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128' },
    { id: 8, name: 'Kavita Joshi', empId: 'EMP011', role: 'Financial Analyst', dept: 'Finance', location: 'Lucknow HQ', ip: '192.168.1.134', device: 'Excel Addin / Windows', activeSince: '09:00 AM', lastSeen: '2 mins ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128' },
    { id: 9, name: 'Arjun Nair', empId: 'EMP012', role: 'Product Manager', dept: 'Product', location: 'Remote / WFH', ip: '152.57.19.88', device: 'Chrome / macOS', activeSince: '09:10 AM', lastSeen: '5 mins ago', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128' },
    { id: 10, name: 'Sneha Patel', empId: 'EMP009', role: 'Growth Lead', dept: 'Marketing', location: 'Lucknow HQ', ip: '192.168.1.177', device: 'VorldX Mobile / iOS', activeSince: '09:25 AM', lastSeen: 'Just now', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128' }
  ]);

  // Policy Timing Settings (Modal & collapsible)
  const [policyTab, setPolicyTab] = useState('Attendance Policy');
  const [showEditPolicyModal, setShowEditPolicyModal] = useState(false);
  const [policySettings, setPolicySettings] = useState({
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    halfDay: '< 4 hours',
    lateMark: '09:15 AM',
    workingDays: 'Mon - Fri',
    graceTime1: '15 minutes',
    graceTime2: '15 minutes',
    enableQr: true,
    allowCorrection: true,
    autoAbsent: true
  });

  // ---------------------------------------------------------------------------
  // SCREEN 7: REPORTS & ANALYTICS
  // ---------------------------------------------------------------------------
  const [reportTab, setReportTab] = useState('Attendance Report');
  const [reportMonth, setReportMonth] = useState('October 2026');
  const [reportDept, setReportDept] = useState('All Departments');

  // ---------------------------------------------------------------------------
  // INTERACTIVE DATE RANGE FILTER MODAL STATES (Screenshot 3)
  // ---------------------------------------------------------------------------
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [dateFilterTarget, setDateFilterTarget] = useState('wfh'); // 'wfh' | 'leave' | 'attendance' | 'audit'
  const [wfhDateRangeLabel, setWfhDateRangeLabel] = useState('');
  const [wfhDateRangeFilter, setWfhDateRangeFilter] = useState(null);
  const [leaveDateRangeLabel, setLeaveDateRangeLabel] = useState('');
  const [leaveDateRangeFilter, setLeaveDateRangeFilter] = useState(null);
  const [attendanceDateRangeLabel, setAttendanceDateRangeLabel] = useState('14 Oct 2026 (Today)');
  const [attendanceDateRangeFilter, setAttendanceDateRangeFilter] = useState(null);
  const [auditDateRangeLabel, setAuditDateRangeLabel] = useState('');
  const [auditDateRangeFilter, setAuditDateRangeFilter] = useState(null);
  const [customRangeStart, setCustomRangeStart] = useState('2026-10-01');
  const [customRangeEnd, setCustomRangeEnd] = useState('2026-10-22');

  // ---------------------------------------------------------------------------
  // DUAL MODE ATTENDANCE CARD STATES & LIVE CLOCK (Screenshot 2)
  // ---------------------------------------------------------------------------
  const [attendanceCardMode, setAttendanceCardMode] = useState('qr'); // 'qr' | 'kiosk'
  const [liveClock, setLiveClock] = useState(new Date());
  const [punchStatus, setPunchStatus] = useState('Checked In'); // 'Checked In' | 'Checked Out'
  const [punchCheckInTime, setPunchCheckInTime] = useState('09:05 AM');
  const [punchCheckOutTime, setPunchCheckOutTime] = useState(null);
  const [qrCodeToken, setQrCodeToken] = useState('WORLDKZ026');
  const [kioskPinInput, setKioskPinInput] = useState('');
  const [kioskSelectedEmpId, setKioskSelectedEmpId] = useState('EMP001');

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load real API data on mount if available
  useEffect(() => {
    async function fetchBackendData() {
      try {
        const empRes = await api.getEmployees();
        if (Array.isArray(empRes) && empRes.length >= 8) {
          // keep merged state
        }
      } catch (err) {
        // Mockup fallback
      }
    }
    fetchBackendData();
  }, []);

  // Handler for Add Employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const created = {
      ...newEmp,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128'
    };
    setEmployees([created, ...employees]);
    setShowAddEmpModal(false);
    alert(`Employee ${newEmp.name} (${newEmp.id}) added successfully!`);
  };

  // Handler for Add HR Member
  const handleAddHrMember = (e) => {
    e.preventDefault();
    const created = {
      id: `EMP${Math.floor(100 + Math.random() * 900)}`,
      name: newHrMember.name,
      role: newHrMember.role,
      department: 'Human Resources',
      email: newHrMember.email,
      status: newHrMember.status,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128'
    };
    setHrMembers([...hrMembers, created]);
    setShowAddHrModal(false);
    alert(`HR Member ${newHrMember.name} added successfully!`);
  };

  // Handler for Approving / Rejecting WFH
  const handleWfhAction = (id, newStatus) => {
    setWfhList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Handler for Approving / Rejecting Leave
  const handleLeaveAction = (id, newStatus) => {
    setLeaveList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Working States for Employee Profile Details, Edit, Action Menus & Exports
  const [selectedEmpDetails, setSelectedEmpDetails] = useState(null);
  const [editEmpModal, setEditEmpModal] = useState(null);
  const [openAdminActionMenuId, setOpenAdminActionMenuId] = useState(null);
  const [adminToastMsg, setAdminToastMsg] = useState(null);

  useEffect(() => {
    const handleOutside = () => setOpenAdminActionMenuId(null);
    if (openAdminActionMenuId) {
      window.addEventListener('click', handleOutside);
    }
    return () => window.removeEventListener('click', handleOutside);
  }, [openAdminActionMenuId]);

  const triggerAdminToast = (msg) => {
    setAdminToastMsg(msg);
    setTimeout(() => setAdminToastMsg(null), 3500);
  };

  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Pending Leave Requests matching Image 1
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([
    {
      id: 'PLV-01',
      employee: 'Priya Sharma',
      department: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128',
      type: 'Casual',
      from: '14 Oct',
      to: '15 Oct',
      days: 2,
      status: 'Pending'
    },
    {
      id: 'PLV-02',
      employee: 'Rohit S.',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128',
      type: 'Sick',
      from: '16 Oct',
      to: '18 Oct',
      days: 3,
      status: 'Pending'
    },
    {
      id: 'PLV-03',
      employee: 'Ankit Verma',
      department: 'Sales',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128',
      type: 'Earned',
      from: '20 Oct',
      to: '22 Oct',
      days: 3,
      status: 'Pending'
    },
    {
      id: 'PLV-04',
      employee: 'Neha Gupta',
      department: 'HR',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128',
      type: 'Casual',
      from: '21 Oct',
      to: '21 Oct',
      days: 1,
      status: 'Pending'
    }
  ]);

  const handleApprovePendingLeave = (id, emp) => {
    setPendingLeaveRequests(prev => prev.filter(r => r.id !== id));
    triggerAdminToast(`✓ Approved leave request for ${emp}`);
  };

  const handleRejectPendingLeave = (id, emp) => {
    setPendingLeaveRequests(prev => prev.filter(r => r.id !== id));
    triggerAdminToast(`✓ Rejected leave request for ${emp}`);
  };

  // CSV Export: Organization Attendance Report
  const handleExportOrgReport = () => {
    const header = ['Employee ID', 'Employee Name', 'Department', 'Designation', 'Present Days', 'WFH Days', 'Leave Days', 'Absent Days', 'Status'];
    const rows = [header];
    employees.forEach(emp => {
      rows.push([
        emp.id,
        emp.name,
        emp.department,
        emp.designation,
        18,
        3,
        2,
        3,
        emp.status
      ]);
    });
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VorldX_Organization_Attendance_Report_${selectedMonth.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerAdminToast(`✓ Organization Attendance Report for ${selectedMonth} downloaded!`);
  };

  // CSV Export: Employee Roster
  const handleExportEmpRoster = () => {
    const header = ['Employee ID', 'Full Name', 'Department', 'Designation', 'Joining Date', 'Status', 'Official Email'];
    const rows = [header];
    employees.forEach(emp => {
      rows.push([
        emp.id,
        emp.name,
        emp.department,
        emp.designation,
        emp.joining_date,
        emp.status,
        `${emp.name.toLowerCase().replace(/\s+/g, '.')}@vorldx.com`
      ]);
    });
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'VorldX_Employees_Directory_Roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerAdminToast('✓ Employees Directory Roster CSV downloaded!');
  };

  // CSV Export: Analytics Report
  const handleExportAnalytics = () => {
    const header = ['Department', 'Present Employees', 'WFH Employees', 'On Leave', 'Absent Employees', 'Total Headcount'];
    const rows = [header];
    [
      { name: 'Software Development', present: 22, wfh: 6, leave: 3, absent: 2, total: 33 },
      { name: 'Product Design', present: 16, wfh: 4, leave: 2, absent: 1, total: 23 },
      { name: 'Human Resources', present: 8, wfh: 2, leave: 1, absent: 0, total: 11 },
      { name: 'Operations', present: 12, wfh: 3, leave: 2, absent: 2, total: 19 },
      { name: 'Marketing', present: 10, wfh: 4, leave: 2, absent: 1, total: 17 }
    ].forEach(d => {
      rows.push([d.name, d.present, d.wfh, d.leave, d.absent, d.total]);
    });
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VorldX_Analytics_Report_${reportMonth.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerAdminToast(`✓ Analytics Report for ${reportMonth} downloaded!`);
  };

  // Download single employee profile summary slip
  const handleDownloadEmpSlip = (emp) => {
    const text = `========================================================
            VORLDX EMPLOYEE PROFILE SUMMARY
========================================================
Employee ID   : ${emp.id}
Full Name     : ${emp.name}
Department    : ${emp.department}
Designation   : ${emp.designation}
Joining Date  : ${emp.joining_date}
Official Email: ${emp.name.toLowerCase().replace(/\s+/g, '.')}@vorldx.com
Status        : ${emp.status.toUpperCase()}
Issued By     : OfficeNova Portal
Timestamp     : ${new Date().toLocaleString()}
========================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${emp.id}_Profile_Summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerAdminToast(`✓ Downloaded profile summary for ${emp.name}`);
    setOpenAdminActionMenuId(null);
  };

  // Toggle active/inactive status
  const handleToggleEmpStatus = (empId) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === empId) {
        const next = e.status === 'Active' ? 'Inactive' : 'Active';
        triggerAdminToast(`Status changed to ${next} for ${e.name}`);
        return { ...e, status: next };
      }
      return e;
    }));
    setOpenAdminActionMenuId(null);
    if (selectedEmpDetails && selectedEmpDetails.id === empId) {
      setSelectedEmpDetails(prev => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }));
    }
  };

  // Save edited employee
  const handleSaveEditedEmp = (e) => {
    e.preventDefault();
    setEmployees(prev => prev.map(emp => emp.id === editEmpModal.id ? editEmpModal : emp));
    triggerAdminToast(`✓ Updated employee profile for ${editEmpModal.name}`);
    setEditEmpModal(null);
  };

  // CSV Export: Audit Logs Trail Report (Screenshot 1)
  const handleExportAuditLogs = () => {
    const header = ['Log ID', 'User', 'Action', 'Module', 'Date & Time', 'Status'];
    const rows = [header];
    auditLogsData.forEach(l => {
      rows.push([l.id, l.user, l.action, l.module, l.dateTime, 'Logged & Verified']);
    });
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'VorldX_Audit_Logs_Trail_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerAdminToast('✓ Audit Logs Trail CSV report downloaded!');
  };

  // Download official company policy document (Screenshot 5)
  const handleDownloadPolicy = (policy) => {
    const docText = `================================================================================
                    VORLDX TECHNOLOGIES PVT LTD
                  OFFICIAL ORGANIZATIONAL POLICY
================================================================================
Policy Name      : ${policy.name}
Category         : ${policy.category}
Document Size    : ${policy.size}
Last Updated     : ${policy.updatedOn}
Document Version : 2026.4
Approved By      : Executive Board & Chief Human Resources Officer
Classification   : Confidential - Internal Company Documentation

--------------------------------------------------------------------------------
1. PURPOSE & OBJECTIVE
--------------------------------------------------------------------------------
This official policy document establishes guidelines, expectations, and operational
standards governing "${policy.name}" across all entities, branches, and remote
work locations under VorldX Technologies Pvt Ltd.

--------------------------------------------------------------------------------
2. SCOPE & ELIGIBILITY
--------------------------------------------------------------------------------
This policy applies to all full-time employees, consultants, interns, and contractors
engaged across Software Development, Product Design, Human Resources, Operations,
Marketing, and Finance departments.

--------------------------------------------------------------------------------
3. CORE POLICY GUIDELINES & PROCEDURES
--------------------------------------------------------------------------------
- Standard working hours: 09:00 AM - 06:00 PM (Monday to Friday).
- Grace period for clock-in: 15 minutes.
- All requests and approvals must be routed via the VorldX Attendance 360 portal.
- Zero tolerance for data compliance violations or unauthorized system tampering.

--------------------------------------------------------------------------------
4. COMPLIANCE & ESCALATION
--------------------------------------------------------------------------------
For queries or policy dispensations, contact:
Human Resources Desk: hr@vorldx.com | Compliance: compliance@vorldx.com
Headquarters: WorldX Towers, Cyber City, Lucknow UP

================================================================================
          © 2026 VorldX Technologies Pvt Ltd. All Rights Reserved.
================================================================================`;
    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VorldX_Policy_${policy.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setPoliciesDocsList(prev => prev.map(p => p.id === policy.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p));
    triggerAdminToast(`✓ Downloaded ${policy.name} (${policy.size})`);
  };

  // Dual Mode Attendance Handlers (Screenshot 2)
  const handlePunchCheckIn = () => {
    const nowTimeStr = liveClock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setPunchStatus('Checked In');
    setPunchCheckInTime(nowTimeStr);
    triggerAdminToast(`✓ Checked in successfully at ${nowTimeStr}! GPS Verified.`);
  };

  const handlePunchCheckOut = () => {
    const nowTimeStr = liveClock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setPunchStatus('Checked Out');
    setPunchCheckOutTime(nowTimeStr);
    triggerAdminToast(`✓ Checked out successfully at ${nowTimeStr}! Day completed.`);
  };

  const handleRegenerateQR = () => {
    const newToken = 'WORLDKZ' + Math.floor(100 + Math.random() * 900);
    setQrCodeToken(newToken);
    triggerAdminToast(`✓ Refreshed QR code token: ${newToken}`);
  };

  const handleKioskKey = (key) => {
    if (key === 'C') {
      setKioskPinInput('');
    } else if (key === 'OK') {
      handleKioskSubmit();
    } else {
      if (kioskPinInput.length < 6) {
        setKioskPinInput(prev => prev + key);
      }
    }
  };

  const handleKioskSubmit = () => {
    const emp = employees.find(e => e.id === kioskSelectedEmpId) || employees[0];
    const nowTimeStr = liveClock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const nextAction = punchStatus === 'Checked In' ? 'Checked Out' : 'Checked In';
    setPunchStatus(nextAction);
    if (nextAction === 'Checked In') setPunchCheckInTime(nowTimeStr);
    else setPunchCheckOutTime(nowTimeStr);
    setKioskPinInput('');
    triggerAdminToast(`✓ Kiosk biometric punch recorded: ${emp.name} marked ${nextAction} at ${nowTimeStr}!`);
  };

  // Date Range Presets and Apply Logic (Screenshot 3)
  const handleApplyDatePreset = (preset) => {
    let label = '';
    let filterVal = null;
    if (preset === 'Today') {
      label = 'Today (14 Oct 2026)';
      filterVal = { preset: 'Today' };
    } else if (preset === 'Yesterday') {
      label = 'Yesterday (13 Oct 2026)';
      filterVal = { preset: 'Yesterday' };
    } else if (preset === 'This Week') {
      label = 'This Week (12 - 18 Oct)';
      filterVal = { preset: 'This Week' };
    } else if (preset === 'This Month') {
      label = 'This Month (Oct 2026)';
      filterVal = { preset: 'This Month' };
    } else if (preset === 'Last 30 Days') {
      label = 'Last 30 Days';
      filterVal = { preset: 'Last 30 Days' };
    } else if (preset === 'All') {
      label = '';
      filterVal = null;
    }

    if (dateFilterTarget === 'wfh') {
      setWfhDateRangeLabel(label);
      setWfhDateRangeFilter(filterVal);
    } else if (dateFilterTarget === 'leave') {
      setLeaveDateRangeLabel(label);
      setLeaveDateRangeFilter(filterVal);
    } else if (dateFilterTarget === 'attendance') {
      setAttendanceDateRangeLabel(label || 'All Dates');
      setAttendanceDateRangeFilter(filterVal);
    } else if (dateFilterTarget === 'audit') {
      setAuditDateRangeLabel(label);
      setAuditDateRangeFilter(filterVal);
    }

    setShowDateRangeModal(false);
    triggerAdminToast(label ? `✓ Filter applied: ${label}` : '✓ Date filter cleared (All Dates)');
  };

  const handleApplyCustomDateRange = (e) => {
    e.preventDefault();
    if (!customRangeStart || !customRangeEnd) {
      alert('Please select both start and end dates.');
      return;
    }
    const label = `${customRangeStart} to ${customRangeEnd}`;
    const filterVal = { preset: 'Custom', start: customRangeStart, end: customRangeEnd };

    if (dateFilterTarget === 'wfh') {
      setWfhDateRangeLabel(label);
      setWfhDateRangeFilter(filterVal);
    } else if (dateFilterTarget === 'leave') {
      setLeaveDateRangeLabel(label);
      setLeaveDateRangeFilter(filterVal);
    } else if (dateFilterTarget === 'attendance') {
      setAttendanceDateRangeLabel(label);
      setAttendanceDateRangeFilter(filterVal);
    } else if (dateFilterTarget === 'audit') {
      setAuditDateRangeLabel(label);
      setAuditDateRangeFilter(filterVal);
    }

    setShowDateRangeModal(false);
    triggerAdminToast(`✓ Custom date filter applied: ${label}`);
  };

  // Roles & Permissions Handlers (Screenshot 4)
  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleForm.roleName.trim()) return;
    const newRole = {
      id: Date.now(),
      roleName: newRoleForm.roleName.trim(),
      description: newRoleForm.description || 'Custom organizational role',
      users: parseInt(newRoleForm.users) || 0,
      status: newRoleForm.status || 'Active'
    };
    setRolesList(prev => [...prev, newRole]);
    setShowAddRoleModal(false);
    setNewRoleForm({ roleName: '', description: '', users: 1, status: 'Active' });
    triggerAdminToast(`✓ New role "${newRole.roleName}" created successfully!`);
  };

  // HR Management Handlers
  const handleCreateHrItem = (e) => {
    e.preventDefault();
    if (!newHrItemForm.name.trim()) return;

    if (hrMgmtTab === 'Departments') {
      const newDept = {
        id: Date.now(),
        name: newHrItemForm.name.trim(),
        head: newHrItemForm.field2.trim() || 'Pooja Yadav',
        headAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128',
        employeeCount: parseInt(newHrItemForm.field3) || 1,
        status: 'Active'
      };
      setDepartmentsList(prev => [...prev, newDept]);
      triggerAdminToast(`✓ Added Department: ${newDept.name}`);
    } else if (hrMgmtTab === 'Designations') {
      const newDesig = {
        id: Date.now(),
        designation: newHrItemForm.name.trim(),
        department: newHrItemForm.field2.trim() || 'Engineering',
        count: parseInt(newHrItemForm.field3) || 1,
        status: 'Active'
      };
      setDesignationsList(prev => [...prev, newDesig]);
      triggerAdminToast(`✓ Added Designation: ${newDesig.designation}`);
    } else if (hrMgmtTab === 'Holidays') {
      const newHol = {
        id: Date.now(),
        name: newHrItemForm.name.trim(),
        date: newHrItemForm.field2.trim() || '15 Nov 2026',
        day: newHrItemForm.field3.trim() || 'Sunday',
        type: newHrItemForm.field4.trim() || 'Gazetted Holiday',
        status: 'Upcoming'
      };
      setHolidaysList(prev => [...prev, newHol]);
      triggerAdminToast(`✓ Added Holiday: ${newHol.name}`);
    } else if (hrMgmtTab === 'Shifts') {
      const newShift = {
        id: Date.now(),
        name: newHrItemForm.name.trim(),
        timing: newHrItemForm.field2.trim() || '09:00 AM - 06:00 PM',
        grace: newHrItemForm.field3.trim() || '15 mins',
        count: parseInt(newHrItemForm.field4) || 10,
        status: 'Active'
      };
      setShiftsList(prev => [...prev, newShift]);
      triggerAdminToast(`✓ Added Shift: ${newShift.name}`);
    } else if (hrMgmtTab === 'Work Locations') {
      const newLoc = {
        id: Date.now(),
        name: newHrItemForm.name.trim(),
        address: newHrItemForm.field2.trim() || 'Cyber City, Lucknow UP',
        geofence: newHrItemForm.field3.trim() || '150 meters',
        staff: parseInt(newHrItemForm.field4) || 20,
        status: 'Active'
      };
      setWorkLocationsList(prev => [...prev, newLoc]);
      triggerAdminToast(`✓ Added Work Location: ${newLoc.name}`);
    }

    setShowAddHrItemModal(false);
    setNewHrItemForm({ name: '', field2: '', field3: '', field4: '', status: 'Active' });
  };

  const handleDeleteHrItem = (type, id, itemName) => {
    if (type === 'dept') setDepartmentsList(prev => prev.filter(d => d.id !== id));
    else if (type === 'desig') setDesignationsList(prev => prev.filter(d => d.id !== id));
    else if (type === 'hol') setHolidaysList(prev => prev.filter(h => h.id !== id));
    else if (type === 'shift') setShiftsList(prev => prev.filter(s => s.id !== id));
    else if (type === 'loc') setWorkLocationsList(prev => prev.filter(l => l.id !== id));
    triggerAdminToast(`✓ Removed ${itemName}`);
  };

  const handleSaveEditedAttendanceRecord = (e) => {
    e.preventDefault();
    if (!editAttendanceRecordModal) return;
    setPresentEmployeesList(prev => prev.map(emp => 
      emp.id === editAttendanceRecordModal.id ? editAttendanceRecordModal : emp
    ));
    triggerAdminToast(`✓ Attendance log updated for ${editAttendanceRecordModal.name}!`);
    setEditAttendanceRecordModal(null);
  };

  const handleCreateCalendarEvent = (e) => {
    e.preventDefault();
    if (!newEventForm.title.trim()) return;
    const d = new Date(newEventForm.date);
    const dayStr = String(d.getDate() || 25).padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monStr = monthNames[d.getMonth()] || 'OCT';

    let tagBg = 'rgba(37, 99, 235, 0.2)';
    let tagColor = '#38bdf8';
    if (newEventForm.tag === 'Event') {
      tagBg = 'rgba(245, 158, 11, 0.2)';
      tagColor = '#fbbf24';
    } else if (newEventForm.tag === 'Training') {
      tagBg = 'rgba(168, 85, 247, 0.2)';
      tagColor = '#c084fc';
    } else if (newEventForm.tag === 'Holiday') {
      tagBg = 'rgba(239, 68, 68, 0.2)';
      tagColor = '#f87171';
    }

    const newEv = {
      id: Date.now(),
      day: dayStr,
      mon: monStr,
      title: newEventForm.title,
      sub: newEventForm.time || 'All Day',
      tag: newEventForm.tag,
      tagBg,
      tagColor
    };
    setCalendarEvents(prev => [newEv, ...prev]);
    setShowAddEventModal(false);
    setNewEventForm({ title: '', date: '2026-10-25', time: '11:00 AM - 12:00 PM', tag: 'Meeting' });
    triggerAdminToast(`✓ Event "${newEv.title}" added to calendar!`);
  };

  const handleDeleteCalendarEvent = (id) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    triggerAdminToast('✓ Calendar event removed from schedule.');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: profileEditForm.name,
      role: profileEditForm.role,
      designation: profileEditForm.role,
      email: profileEditForm.email,
      avatar: profileEditForm.avatar || prev.avatar
    }));
    setShowEditProfileModal(false);
    triggerAdminToast('✓ Profile updated successfully!');
  };

  const handleSaveEditedRole = (e) => {
    e.preventDefault();
    if (!editingRoleModal) return;
    setRolesList(prev => prev.map(r => r.id === editingRoleModal.id ? editingRoleModal : r));
    triggerAdminToast(`✓ Role "${editingRoleModal.roleName}" updated successfully!`);
    setEditingRoleModal(null);
  };

  const handleDeleteRole = (id, roleName) => {
    if (['Admin', 'Employee'].includes(roleName)) {
      alert('Default system roles cannot be deleted.');
      return;
    }
    setRolesList(prev => prev.filter(r => r.id !== id));
    setEditingRoleModal(null);
    triggerAdminToast(`✓ Role "${roleName}" removed.`);
  };

  const handleChangeUserRole = (userId, newRole) => {
    setUsersRolesList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setRolesList(prev => prev.map(r => {
      if (r.roleName === newRole) {
        return { ...r, users: r.users + 1 };
      }
      return r;
    }));
    triggerAdminToast(`✓ Assigned role for ${userId} updated to ${newRole}`);
  };

  const handleTogglePermission = (rowIndex, roleKey) => {
    setPermissionsMatrix(prev => prev.map((item, idx) => {
      if (idx === rowIndex) {
        const nextVal = !item[roleKey];
        triggerAdminToast(`✓ Updated permission: ${item.module} (${roleKey.toUpperCase()}: ${nextVal ? 'Granted' : 'Revoked'})`);
        return { ...item, [roleKey]: nextVal };
      }
      return item;
    }));
  };

  // Company Policy Handlers (Screenshot 5)
  const handleCreatePolicy = (e) => {
    e.preventDefault();
    if (!newPolicyForm.name.trim()) return;
    const createdPolicy = {
      id: Date.now(),
      name: newPolicyForm.name.trim(),
      category: newPolicyForm.category || 'HR Policies',
      size: newPolicyForm.size || '2.1 MB',
      updatedOn: '22 Oct 2026',
      downloads: 0,
      summary: newPolicyForm.summary || 'Official organization guideline and policy document.'
    };
    setPoliciesDocsList(prev => [createdPolicy, ...prev]);
    setShowAddPolicyModal(false);
    setNewPolicyForm({ name: '', category: 'HR Policies', size: '2.1 MB', summary: '' });
    triggerAdminToast(`✓ Policy "${createdPolicy.name}" published successfully!`);
  };

  // Notices & Announcements Handlers (Screenshot 1)
  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newNoticeForm.title.trim()) return;
    const newNotice = {
      id: Date.now(),
      title: newNoticeForm.title.trim(),
      type: newNoticeForm.type || 'General',
      date: newNoticeForm.date || '22 Oct 2026',
      status: 'Published',
      content: newNoticeForm.content || 'Official circular issued by WorldX Management.',
      audience: newNoticeForm.audience || 'All Staff'
    };
    setNoticesList(prev => [newNotice, ...prev]);
    setShowAddNoticeModal(false);
    setNewNoticeForm({ title: '', type: 'General', date: '22 Oct 2026', content: '', audience: 'All Staff' });
    triggerAdminToast(`✓ Published notice: "${newNotice.title}"`);
  };

  const handleSaveEditedNotice = (e) => {
    e.preventDefault();
    if (!editingNoticeModal) return;
    setNoticesList(prev => prev.map(n => n.id === editingNoticeModal.id ? editingNoticeModal : n));
    triggerAdminToast(`✓ Notice updated: "${editingNoticeModal.title}"`);
    setEditingNoticeModal(null);
  };

  const handleDeleteNotice = (id) => {
    setNoticesList(prev => prev.filter(n => n.id !== id));
    setEditingNoticeModal(null);
    triggerAdminToast('✓ Notice deleted.');
  };

  // System Settings Handlers (Screenshot 3 & Integrations)
  const handleSaveSystemSettings = () => {
    try {
      localStorage.setItem('vorldx_integrations_settings', JSON.stringify(integrationsSettings));
    } catch {
      // fallback
    }
    triggerAdminToast(`✓ ${systemSettingsTab} configuration updated and saved successfully!`);
  };

  const handleOpenConfigureIntegration = (integ) => {
    setConfigureIntegrationModal({ ...integ });
  };

  const handleSaveIntegrationConfig = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!configureIntegrationModal) return;
    setIntegrationsSettings(prev => prev.map(item =>
      item.id === configureIntegrationModal.id ? { ...configureIntegrationModal, lastSync: 'Just updated' } : item
    ));
    triggerAdminToast(`✓ ${configureIntegrationModal.name} settings saved successfully!`);
    setConfigureIntegrationModal(null);
  };

  const handleTestIntegrationPing = (integ) => {
    const latency = Math.floor(Math.random() * 35) + 15;
    triggerAdminToast(`✓ Connection verified: ${integ.name} HTTP 200 OK (${latency}ms)`);
    setIntegrationsSettings(prev => prev.map(item =>
      item.id === integ.id ? { ...item, lastSync: `Verified (${latency}ms)` } : item
    ));
  };

  // Support Ticket Handlers (Screenshot 2)
  const handleCreateSupportTicket = (e) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim()) return;
    const newId = supportTicketsList.length + 1;
    const newTicket = {
      id: newId,
      subject: newTicketForm.subject.trim(),
      category: newTicketForm.category || 'Attendance',
      status: 'Open',
      priority: newTicketForm.priority || 'High',
      createdOn: '14 Oct 2026',
      employee: currentUser?.name || 'Rahul Verma',
      employeeId: currentUser?.employeeId || 'EMP001',
      description: newTicketForm.description.trim() || 'No additional details provided.',
      replies: [
        {
          sender: currentUser?.name || 'Rahul Verma',
          time: 'Just now',
          text: newTicketForm.description.trim() || 'Ticket raised.'
        }
      ]
    };
    setSupportTicketsList(prev => [newTicket, ...prev]);
    setNewTicketForm({ subject: '', category: 'Attendance', priority: 'High', description: '' });
    setShowSupportModal(false);
    triggerAdminToast(`✓ Support ticket #${newId} created successfully!`);
  };

  const handleSendTicketReply = () => {
    if (!ticketReplyText.trim() || !selectedSupportTicket) return;
    const newReply = {
      sender: 'IT & HR Admin Support',
      time: 'Just now',
      text: ticketReplyText.trim()
    };
    const updatedTicket = {
      ...selectedSupportTicket,
      replies: [...(selectedSupportTicket.replies || []), newReply]
    };
    setSelectedSupportTicket(updatedTicket);
    setSupportTicketsList(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setTicketReplyText('');
    triggerAdminToast('✓ Reply posted to ticket thread!');
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setSupportTicketsList(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    if (selectedSupportTicket && selectedSupportTicket.id === ticketId) {
      setSelectedSupportTicket(prev => ({ ...prev, status: newStatus }));
    }
    triggerAdminToast(`✓ Ticket #${ticketId} status changed to ${newStatus}`);
  };

  // System Overview & Approvals Handlers (Screenshot 3)
  const handleApprovePendingItem = (item) => {
    setPendingApprovalsList(prev => prev.map(p => p.id === item.id ? { ...p, status: 'Approved' } : p));
    if (selectedPendingItem && selectedPendingItem.id === item.id) {
      setSelectedPendingItem(prev => ({ ...prev, status: 'Approved' }));
    }
    triggerAdminToast(`✓ Approved ${item.type} for ${item.employee} (${item.id})`);
  };

  const handleRejectPendingItem = (item) => {
    setPendingApprovalsList(prev => prev.map(p => p.id === item.id ? { ...p, status: 'Rejected' } : p));
    if (selectedPendingItem && selectedPendingItem.id === item.id) {
      setSelectedPendingItem(prev => ({ ...prev, status: 'Rejected' }));
    }
    triggerAdminToast(`✕ Rejected ${item.type} for ${item.employee} (${item.id})`);
  };

  const handleApproveAllVisible = () => {
    const visiblePending = pendingApprovalsList.filter(item =>
      (pendingApprovalFilter === 'All' || item.type === pendingApprovalFilter) && item.status === 'Pending'
    );
    if (visiblePending.length === 0) {
      triggerAdminToast('ℹ No pending requests to approve in current view.');
      return;
    }
    setPendingApprovalsList(prev => prev.map(item => {
      if ((pendingApprovalFilter === 'All' || item.type === pendingApprovalFilter) && item.status === 'Pending') {
        return { ...item, status: 'Approved' };
      }
      return item;
    }));
    triggerAdminToast(`✓ Approved all ${visiblePending.length} pending requests!`);
  };

  const handleRunSystemDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticsLog('Initiating full system diagnostic scan across infrastructure...');
    setTimeout(() => {
      setDiagnosticsLog('Testing API Gateway & Load Balancer routes... HTTP 200 OK (14ms)');
    }, 600);
    setTimeout(() => {
      setDiagnosticsLog('Verifying PostgreSQL Connection Pool & Read Replica... Healthy (9ms)');
    }, 1200);
    setTimeout(() => {
      setDiagnosticsLog('Checking ZKTeco Biometric terminals (4 devices)... All Online & Synced');
    }, 1800);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsLog('✓ System Diagnostic Scan Complete: All 4 clusters healthy, 0 errors detected.');
      triggerAdminToast('✓ Full System Diagnostic Passed (100% Operational)');
    }, 2400);
  };

  const handleTerminateUserSession = (userId, userName) => {
    setActiveUsersList(prev => prev.filter(u => u.id !== userId));
    triggerAdminToast(`✓ Revoked session for ${userName}. User logged out.`);
  };

  // Reports & Analytics Generator (Screenshot 2)
  const handleGenerateReportFile = () => {
    if (reportFormat === 'CSV') {
      if (reportsSubTab === 'Attendance' || reportsSubTab === 'Export') handleExportOrgReport();
      else if (reportsSubTab === 'Employee') handleExportEmpRoster();
      else handleExportAnalytics();
    } else if (reportFormat === 'Excel') {
      handleExportAnalytics();
      triggerAdminToast(`✓ Excel format generated for ${reportsSubTab} (${reportMonth})`);
    } else {
      const reportText = `================================================================================
                    VORLDX TECHNOLOGIES PVT LTD
             EXECUTIVE REPORT: ${reportsSubTab.toUpperCase()} ANALYTICS
================================================================================
Report Period    : ${reportMonth}
Target Scope     : ${reportDept}
Export Format    : PDF Official Summary
Generated By     : HR & Admin Command Center
Generated On     : ${new Date().toLocaleString()}

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & HEADCOUNT
--------------------------------------------------------------------------------
Total Calendar Days : 26 Days
Total Active Staff  : 250 Employees
Average Daily Attendance: 74.4%

--------------------------------------------------------------------------------
2. ATTENDANCE & REMOTE WORK METRICS
--------------------------------------------------------------------------------
- Present Staff  : 186 employees (74%)
- Remote / WFH   : 32 employees (13%)
- Approved Leave : 18 employees (7%)
- Absent         : 14 employees (6%)

--------------------------------------------------------------------------------
3. DEPARTMENT-WISE BREAKDOWN
--------------------------------------------------------------------------------
Software Dev   : Present 22 | WFH 6 | Leave 3 | Absent 2 | Total: 33
Product Design : Present 16 | WFH 4 | Leave 2 | Absent 1 | Total: 23
Human Resources: Present 8  | WFH 2 | Leave 1 | Absent 0 | Total: 11
Operations     : Present 12 | WFH 3 | Leave 2 | Absent 2 | Total: 19
Marketing      : Present 10 | WFH 4 | Leave 2 | Absent 1 | Total: 17

--------------------------------------------------------------------------------
4. AUTHORIZATION & COMPLIANCE SEAL
--------------------------------------------------------------------------------
This document is digitally verified and approved for board review.
System Signature: SHA256-WX-77894109-OK
================================================================================`;
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VorldX_${reportsSubTab}_Report_${reportMonth.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerAdminToast(`✓ ${reportsSubTab} PDF Summary Report downloaded!`);
    }
  };

  // If not logged in, show VorldX Login
  if (!isLoggedIn) {
    return (
      <VorldXLogin
        onLoginSuccess={(user, portal) => {
          if (portal === 'employee') {
            if (onSwitchToEmployee) onSwitchToEmployee(user);
          } else {
            setCurrentUser(user);
            setIsLoggedIn(true);
            setActiveModule('dashboard');
          }
        }}
        onNavigate={(tab) => {
          if (tab === 'employee' && onSwitchToEmployee) {
            onSwitchToEmployee();
          } else if (onLogout) {
            onLogout(tab);
          }
        }}
      />
    );
  }

  // 16 Sidebar Navigation Items covering all modules
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'wfh', label: 'WFH Requests', icon: Home, badge: 8 },
    { id: 'leaves', label: 'Leave Requests', icon: FileText, badge: 12 },
    { id: 'hr_management', label: 'HR Management', icon: ShieldAlert },
    { id: 'roles', label: 'Roles & Permissions', icon: Lock },
    { id: 'policies', label: 'Company Policies', icon: ShieldCheck },
    { id: 'notices', label: 'Notices & Announcements', icon: Megaphone, badge: 3 },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Team Calendar', icon: Calendar },
    { id: 'profile', label: 'Profile Management', icon: User },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit_logs', label: 'Audit Logs', icon: FileSpreadsheet },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'system-overview', label: 'System Overview & Approvals', icon: Layers }
  ];

  // 16 Screen Switcher matching Mockup Grid (Image 2)
  const quickScreens = [
    { id: 'dashboard', label: '1. Dashboard (Admin)' },
    { id: 'employees', label: '2. Employees' },
    { id: 'attendance', label: '3. Attendance' },
    { id: 'wfh', label: '4. WFH Requests' },
    { id: 'leaves', label: '5. Leave Requests' },
    { id: 'hr_management', label: '6. HR Management' },
    { id: 'roles', label: '7. Roles & Permissions' },
    { id: 'policies', label: '8. Company Policies' },
    { id: 'notices', label: '9. Notices & Announcements' },
    { id: 'reports', label: '10. Reports & Analytics' },
    { id: 'calendar', label: '11. Team Calendar' },
    { id: 'profile', label: '12. Profile Management' },
    { id: 'settings', label: '13. System Settings' },
    { id: 'audit_logs', label: '14. Audit Logs' },
    { id: 'help', label: '15. Help & Support' },
    { id: 'system-overview', label: '16. System Overview & Approvals' }
  ];

  return (
    <div className="admin-portal-root">
      {/* =====================================================================
          LEFT SIDEBAR: WorldX ATTENDANCE 360 | ADMIN PORTAL (12 MODULES)
         ===================================================================== */}
      <aside className="admin-sidebar">
        <div>
          {/* Logo Header */}
          <div className="admin-sidebar-logo">
            <div className="admin-logo-row">
              <div className="admin-logo-icon">
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div className="admin-brand-title">
                World<span>X</span>
              </div>
              <span className="admin-badge-360">ATTENDANCE 360</span>
            </div>
            <div className="admin-portal-sublabel">ADMIN PORTAL</div>
          </div>

          {/* 12 Navigation Items */}
          <nav className="admin-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="admin-nav-left">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="admin-badge-pill admin-badge-pending" style={{ background: item.badge === 8 || item.badge === 3 ? '#ef4444' : '#f59e0b' }}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Promo Card from Image 1 */}
        <div style={{ marginTop: 'auto' }}>
          <div className="admin-sidebar-promo-card">
            <div className="admin-promo-title">Build a Smart & Happy Workplace</div>
            <div style={{ height: '44px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <svg viewBox="0 0 100 44" width="100%" height="44">
                <path d="M 5 38 Q 30 30, 55 18 T 95 6" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 3" />
                <polygon points="90,4 97,6 93,11" fill="#a855f7" />
                <rect x="74" y="24" width="16" height="16" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <path d="M 82 24 Q 78 14, 70 12 Q 79 16, 82 24" fill="#10b981" />
                <path d="M 82 24 Q 86 14, 94 12 Q 85 16, 82 24" fill="#059669" />
                <circle cx="82" cy="10" r="3" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* Sidebar Footer: Logout */}
          <div className="admin-sidebar-footer">
            <button
              onClick={() => {
                setIsLoggedIn(false);
                if (onLogout) onLogout();
              }}
              className="admin-logout-btn"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          MAIN CONTENT AREA & TOPBAR
         ===================================================================== */}
      <div className="admin-main-wrap">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <div className="admin-search-wrapper" style={{ maxWidth: '440px' }}>
            <Search size={15} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search employees, requests, reports, policies...        Ctrl + K"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="admin-topbar-right">
            {/* Real Calendar Popover Button from Image 1 */}
            <RealDatePickerPopover
              selectedMonthYear={selectedMonth}
              onSelectMonthYear={(my) => setSelectedMonth(my)}
              align="right"
            />

            {/* Notification Bell with Red Badge 5 */}
            <button className="admin-icon-btn" title="Notifications" onClick={() => setActiveModule('notices')} style={{ position: 'relative' }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.62rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                5
              </span>
            </button>

            {/* Dark Mode Moon Toggle */}
            <button className="admin-icon-btn" title="Theme Toggle">
              <span style={{ fontSize: '1rem' }}>🌙</span>
            </button>

            {/* Admin User Profile: Rahul Verma */}
            <div className="admin-user-pill" onClick={() => setActiveModule('profile')} style={{ cursor: 'pointer' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="admin-user-avatar"
              />
              <div className="admin-user-info">
                <span className="admin-user-name">{currentUser.name}</span>
                <span className="admin-user-role">{currentUser.role || 'Admin • HR Management'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 16-SCREEN QUICK SWITCHER CHIP STRIP MATCHING IMAGE 2 */}
        <div className="admin-screens-strip">
          <span className="admin-screens-title">MODULES:</span>
          {quickScreens.map(scr => (
            <button
              key={scr.id}
              onClick={() => setActiveModule(scr.id)}
              className={`admin-screen-chip ${activeModule === scr.id ? 'active' : ''}`}
            >
              {scr.label}
            </button>
          ))}
        </div>

        {/* SCROLLABLE VIEWPORT */}
        <div className="admin-content-scroll">
          {/* =================================================================
              SCREEN 1: ADMIN DASHBOARD (MATCHING IMAGE 1 EXACTLY)
             ================================================================= */}
          {activeModule === 'dashboard' && (
            <div>
              {/* Top Hero Banner */}
              <div className="admin-hero-banner">
                <div className="admin-hero-left">
                  <div className="admin-hero-tag">Welcome back 👋</div>
                  <h1 className="admin-hero-title">Admin Dashboard</h1>
                  <p className="admin-hero-desc">Manage your organization, monitor attendance, and streamline HR operations.</p>
                </div>
                <div className="admin-hero-right">
                  <div className="admin-hero-quote">
                    “A productive team builds a brighter tomorrow.”
                  </div>
                  <div className="admin-hero-img-wrap">
                    <img src="/employee_hero.jpg" alt="Admin Workplace" />
                  </div>
                  <button className="admin-hero-quick-btn" onClick={() => setShowQuickActionsModal(true)}>
                    <Sparkles size={16} />
                    <span>Quick Actions</span>
                  </button>
                </div>
              </div>

              {/* 5 KPI Stats Cards Matching Image 1 */}
              <div className="admin-5kpi-grid">
                {/* 1. Total Employees */}
                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">Total Employees</div>
                      <div className="admin-5kpi-val">250</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#3b82f6' }}>
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#10b981', fontWeight: 700 }}>↑ 12%</span>
                    <span style={{ color: '#64748b' }}>+25 this month</span>
                  </div>
                </div>

                {/* 2. Present Today */}
                <div
                  className="admin-5kpi-card"
                  onClick={() => setShowPresentModal(true)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view all Present Employees"
                >
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">Present Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#10b981' }}>186</div>
                    </div>
                    {/* Donut Meter */}
                    <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="42" height="42" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="74, 100" strokeLinecap="round" />
                      </svg>
                      <span style={{ position: 'absolute', fontSize: '0.62rem', fontWeight: 800, color: '#10b981' }}>74%</span>
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>74% of total</span>
                  </div>
                </div>

                {/* 3. WFH Today */}
                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">WFH Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#c084fc' }}>32</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                      <Home size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#94a3b8' }}>13% of total</span>
                  </div>
                </div>

                {/* 4. On Leave Today */}
                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">On Leave Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#fbbf24' }}>18</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#94a3b8' }}>7% of total</span>
                  </div>
                </div>

                {/* 5. Absent Today */}
                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">Absent Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#f87171' }}>14</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                      <AlertCircle size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#94a3b8' }}>6% of total</span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Attendance Overview + Attendance Rate + Recent Activities */}
              <div className="admin-mid-3col">
                {/* 1. Attendance Overview (This Month) */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Attendance Overview (This Month)</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} /> Present</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2dd4bf' }} /> WFH</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} /> Leave</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }} /> Absent</span>
                      </div>
                      <select className="admin-select-control" style={{ height: '28px', fontSize: '0.72rem', padding: '0 8px' }}>
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>
                  </div>

                  {/* High Tech Stacked Bars with Trendline & 15 Oct Tooltip */}
                  <div style={{ position: 'relative', height: '170px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* SVG Trendline */}
                    <svg viewBox="0 0 400 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
                      <path d="M 28 85 Q 90 70, 145 78 T 260 55 T 375 60" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="205" cy="52" r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                    </svg>

                    {/* Tooltip on 15 Oct matching image */}
                    <div style={{
                      position: 'absolute',
                      bottom: '95px',
                      left: '46%',
                      background: '#1e293b',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
                      zIndex: 10,
                      fontSize: '0.72rem',
                      lineHeight: 1.4
                    }}>
                      <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>15 Oct</div>
                      <div style={{ color: '#38bdf8' }}>● Present: 68</div>
                      <div style={{ color: '#2dd4bf' }}>● WFH: 12</div>
                      <div style={{ color: '#fbbf24' }}>● Leave: 6</div>
                      <div style={{ color: '#f87171' }}>● Absent: 4</div>
                    </div>

                    {[
                      { date: '1 Oct', p: 58, w: 10, l: 4, a: 5 },
                      { date: '5 Oct', p: 62, w: 12, l: 3, a: 4 },
                      { date: '10 Oct', p: 54, w: 14, l: 5, a: 5 },
                      { date: '15 Oct', p: 68, w: 12, l: 6, a: 4 },
                      { date: '20 Oct', p: 60, w: 15, l: 4, a: 3 },
                      { date: '25 Oct', p: 56, w: 12, l: 7, a: 4 },
                      { date: '30 Oct', p: 64, w: 11, l: 4, a: 4 }
                    ].map((b, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2 }}>
                        <div style={{ width: '16px', display: 'flex', flexDirection: 'column-reverse', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                          <div style={{ height: `${b.p * 1.1}px`, background: '#38bdf8' }} />
                          <div style={{ height: `${b.w * 1.1}px`, background: '#2dd4bf' }} />
                          <div style={{ height: `${b.l * 1.1}px`, background: '#fbbf24' }} />
                          <div style={{ height: `${b.a * 1.1}px`, background: '#f87171' }} />
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '6px' }}>{b.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Attendance Rate Donut Card */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Attendance Rate</h3>
                    <button onClick={() => setActiveModule('reports')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      View Details →
                    </button>
                  </div>

                  {/* Circular Donut */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px 0' }}>
                    <div style={{ position: 'relative', width: '108px', height: '108px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="108" height="108" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.8" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2dd4bf" strokeWidth="3.8" strokeDasharray="74, 100" strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>74%</span>
                        <span style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase' }}>Overall</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                      <span>Present <strong>74%</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                      <span>Leave <strong>7%</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2dd4bf' }} />
                      <span>WFH <strong>13%</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }} />
                      <span>Absent <strong>6%</strong></span>
                    </div>
                  </div>
                </div>

                {/* 3. Recent Activities */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Recent Activities</h3>
                    <button onClick={() => setActiveModule('audit_logs')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { icon: UserCheck, color: '#10b981', bg: 'rgba(16,185,129,0.15)', title: 'New employee added', sub: 'Neha Singh - Software Developer', time: '10 min ago' },
                      { icon: Home, color: '#a855f7', bg: 'rgba(168,85,247,0.15)', title: 'WFH request approved', sub: 'Amit Kumar - 14 Oct 2026', time: '25 min ago' },
                      { icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', title: 'Leave request rejected', sub: 'Pooja Yadav - Insufficient balance', time: '1 hour ago' },
                      { icon: ShieldCheck, color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', title: 'Policy updated', sub: 'WFH policy guidelines v2.0', time: '2 hours ago' },
                      { icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', title: 'Attendance correction', sub: 'Rohit S. - 12 Oct 2026', time: '3 hours ago' }
                    ].map((act, idx) => {
                      const Icon = act.icon;
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: act.bg, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={14} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{act.title}</div>
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{act.sub}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.66rem', color: '#64748b', whiteSpace: 'nowrap' }}>{act.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4 Wide Shortcut Action Cards */}
              <div className="admin-shortcuts-4col">
                <div className="admin-shortcut-tile admin-shortcut-blue" onClick={() => setActiveModule('employees')}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>Manage Employees</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Add / Edit / Deactivate</div>
                  </div>
                </div>

                <div className="admin-shortcut-tile admin-shortcut-amber" onClick={() => setActiveModule('leaves')}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>Pending Approvals</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>WFH (4) | Leave (8)</div>
                  </div>
                </div>

                <div className="admin-shortcut-tile admin-shortcut-teal" onClick={() => setActiveModule('reports')}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>View Reports</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Attendance, Leave, WFH</div>
                  </div>
                </div>

                <div className="admin-shortcut-tile admin-shortcut-purple" onClick={() => setActiveModule('settings')}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Settings size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>Company Settings</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Policies, Roles, Holidays</div>
                  </div>
                </div>
              </div>

              {/* Lower 3-Column Grid: Department Attendance + Pending Leaves Table + Upcoming Events */}
              <div className="admin-lower-3col">
                {/* 1. Department-wise Attendance */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Department-wise Attendance</h3>
                    <select className="admin-select-control" style={{ height: '26px', fontSize: '0.7rem', padding: '0 8px' }}>
                      <option>This Month</option>
                      <option>Today</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Engineering', pct: 85, count: '68/80' },
                      { name: 'HR', pct: 72, count: '18/25' },
                      { name: 'Sales', pct: 70, count: '35/50' },
                      { name: 'Marketing', pct: 78, count: '28/36' },
                      { name: 'Support', pct: 69, count: '24/35' }
                    ].map((d, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{d.name}</span>
                          <span style={{ color: '#94a3b8' }}>
                            <strong style={{ color: '#ffffff' }}>{d.pct}%</strong> ({d.count})
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${d.pct}%`, background: 'linear-gradient(90deg, #38bdf8, #2dd4bf)', borderRadius: '6px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Leave Requests (Pending) Table */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Leave Requests (Pending)</h3>
                    <button onClick={() => setActiveModule('leaves')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table" style={{ width: '100%', fontSize: '0.76rem' }}>
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Leave Type</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Days</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingLeaveRequests.map((req) => (
                          <tr key={req.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src={req.avatar} alt={req.employee} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{req.employee}</div>
                                  <div style={{ fontSize: '0.66rem', color: '#64748b' }}>{req.department}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>
                                {req.type}
                              </span>
                            </td>
                            <td style={{ color: '#94a3b8' }}>{req.from}</td>
                            <td style={{ color: '#94a3b8' }}>{req.to}</td>
                            <td style={{ fontWeight: 700, color: '#ffffff' }}>{req.days}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleApprovePendingLeave(req.id, req.employee)}
                                  style={{ padding: '3px 8px', borderRadius: '6px', background: '#059669', border: 'none', color: '#ffffff', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPendingLeave(req.id, req.employee)}
                                  style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Upcoming Events */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Upcoming Events</h3>
                    <button onClick={() => setActiveModule('calendar')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { day: '16', mon: 'OCT', title: 'Monthly Team Meeting', sub: '10:00 AM - 11:00 AM', tag: 'Meeting', tagBg: '#eff6ff', tagColor: '#2563eb' },
                      { day: '18', mon: 'OCT', title: 'Performance Review Cycle', sub: 'All Departments', tag: 'Event', tagBg: '#fef3c7', tagColor: '#d97706' },
                      { day: '21', mon: 'OCT', title: 'Policy Training Session', sub: '03:00 PM - 04:30 PM', tag: 'Training', tagBg: '#f3e8ff', tagColor: '#7c3aed' }
                    ].map((ev, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 800, lineHeight: 1 }}>
                            <span style={{ fontSize: '0.82rem' }}>{ev.day}</span>
                            <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>{ev.mon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>{ev.title}</div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{ev.sub}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: ev.tagBg, color: ev.tagColor }}>
                          {ev.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom 3-Column Grid: System Overview + Notices + Need Help */}
              <div className="admin-bottom-3col">
                {/* 1. System Overview */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0' }}>System Overview</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active Users</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>240</div>
                      <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>↑ 8%</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Requests</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>128</div>
                      <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>↑ 12%</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Resolved</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>112</div>
                      <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>↑ 15%</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pending</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>16</div>
                      <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700 }}>↓ 8%</div>
                    </div>
                  </div>
                </div>

                {/* 2. Notices & Announcements */}
                <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Notices & Announcements</h3>
                    <button onClick={() => setActiveModule('notices')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { text: 'Office will remain closed on 24th Oct 2026 (Diwali Holiday)', date: '12 Oct 2026', badge: 'Holiday', bg: '#fee2e2', color: '#dc2626' },
                      { text: 'New IT Security Policy is now live. Please review.', date: '10 Oct 2026', badge: 'Policy', bg: '#eff6ff', color: '#2563eb' },
                      { text: 'Mandatory profile update for all employees.', date: '08 Oct 2026', badge: 'Important', bg: '#fef3c7', color: '#d97706' }
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600 }}>{n.text}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{n.date}</div>
                        </div>
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: n.bg, color: n.color }}>
                          {n.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Need Help? Card */}
                <div className="admin-table-card" style={{ padding: '20px', background: 'linear-gradient(135deg, #1e1b4b 0%, #0d1527 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>Need Help?</h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                      Our support team is always here for you. Raise a ticket anytime.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
                      alt="Support Representative"
                      style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #38bdf8', objectFit: 'cover' }}
                    />
                  </div>

                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="admin-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.8rem' }}
                  >
                    Raise a Support Ticket →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 2: EMPLOYEES DIRECTORY
             ================================================================= */}
          {activeModule === 'employees' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Employees Directory</h1>
                  <p className="admin-header-desc">Manage all employees in the organization</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn-action" onClick={() => setShowImportModal(true)}>
                    <Upload size={14} />
                    <span>Import (Excel)</span>
                  </button>
                  <button className="admin-btn-action" onClick={handleExportEmpRoster} title="Download Employee Roster CSV">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                  <button className="admin-btn-primary" onClick={() => setShowAddEmpModal(true)}>
                    <Plus size={15} />
                    <span>Add Employee</span>
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="admin-filters-bar">
                <div className="admin-filter-search">
                  <Search size={14} className="admin-filter-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name, department or ID..."
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    className="admin-filter-input"
                  />
                </div>

                <select
                  value={empDeptFilter}
                  onChange={(e) => setEmpDeptFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Departments</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Finance">Finance</option>
                  <option value="IT Support">IT Support</option>
                </select>

                <select
                  value={empRoleFilter}
                  onChange={(e) => setEmpRoleFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Roles</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Executive">Executive</option>
                  <option value="Manager">Manager</option>
                  <option value="Associate">Associate</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Support Engineer">Support Engineer</option>
                </select>

                <select
                  value={empStatusFilter}
                  onChange={(e) => setEmpStatusFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <button
                  className="admin-btn-reset"
                  onClick={() => {
                    setEmpSearch('');
                    setEmpDeptFilter('All');
                    setEmpRoleFilter('All');
                    setEmpStatusFilter('All');
                  }}
                >
                  <RefreshCw size={13} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Employees Table Card */}
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Joining Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees
                      .filter(emp => {
                        const s = empSearch.toLowerCase();
                        const matchSearch = !empSearch || emp.name.toLowerCase().includes(s) || emp.id.toLowerCase().includes(s) || emp.department.toLowerCase().includes(s);
                        const matchDept = empDeptFilter === 'All' || emp.department === empDeptFilter;
                        const matchRole = empRoleFilter === 'All' || emp.designation === empRoleFilter;
                        const matchStatus = empStatusFilter === 'All' || emp.status === empStatusFilter;
                        return matchSearch && matchDept && matchRole && matchStatus;
                      })
                      .map((emp, idx) => (
                        <tr key={emp.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div className="admin-employee-cell">
                              <img src={emp.avatar} alt={emp.name} className="admin-employee-avatar" />
                              <div>
                                <div className="admin-employee-name">{emp.name}</div>
                                <div className="admin-employee-id">{emp.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="admin-td-dept">{emp.department}</td>
                          <td className="admin-td-role">{emp.designation}</td>
                          <td className="admin-td-date">{emp.joining_date}</td>
                          <td>
                            <span className={`admin-status-pill ${emp.status === 'Active' ? 'active' : 'inactive'}`}>
                              {emp.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group" style={{ position: 'relative' }}>
                              <button
                                className="admin-action-chip"
                                onClick={() => setSelectedEmpDetails(emp)}
                                title="View Employee Profile"
                              >
                                View
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => setEditEmpModal({ ...emp })}
                                title="Edit Employee"
                              >
                                Edit
                              </button>
                              <button
                                className="admin-action-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenAdminActionMenuId(openAdminActionMenuId === emp.id ? null : emp.id);
                                }}
                                title="More options"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {openAdminActionMenuId === emp.id && (
                                <div className="admin-action-dropdown-menu">
                                  <button onClick={() => { setSelectedEmpDetails(emp); setOpenAdminActionMenuId(null); }}>
                                    <Eye size={13} color="#38bdf8" /> View Profile
                                  </button>
                                  <button onClick={() => { setEditEmpModal({ ...emp }); setOpenAdminActionMenuId(null); }}>
                                    <Edit3 size={13} color="#f59e0b" /> Edit Employee
                                  </button>
                                  <button onClick={() => handleDownloadEmpSlip(emp)}>
                                    <Download size={13} color="#10b981" /> Download Slip
                                  </button>
                                  <button onClick={() => handleToggleEmpStatus(emp.id)}>
                                    <RefreshCw size={13} color="#a855f7" /> Toggle {emp.status === 'Active' ? 'Inactive' : 'Active'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEmployees(prev => prev.filter(e => e.id !== emp.id));
                                      triggerAdminToast(`✓ Employee ${emp.name} deleted.`);
                                      setOpenAdminActionMenuId(null);
                                    }}
                                    style={{ color: '#ef4444' }}
                                  >
                                    <Trash2 size={13} color="#ef4444" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Lower Section: Attendance Records - 14 Oct 2026 matching Image 2 Screen 2 */}
              <div style={{ marginTop: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Attendance Records - 14 Oct 2026
                    </h3>
                    <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      Live daily check-in records for all active staff
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn-action" onClick={() => setActiveModule('attendance')}>
                      <Calendar size={13} />
                      <span>View Full Attendance</span>
                    </button>
                  </div>
                </div>

                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Employee</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presentEmployeesList.slice(0, 6).map((rec, idx) => (
                        <tr key={rec.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div className="admin-employee-cell">
                              <img src={rec.avatar} alt={rec.name} className="admin-employee-avatar" />
                              <div>
                                <div className="admin-employee-name">{rec.name}</div>
                                <div className="admin-employee-id">{rec.id} • {rec.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="admin-td-date" style={{ color: '#10b981', fontWeight: 600 }}>{rec.arrival}</td>
                          <td className="admin-td-date" style={{ color: '#f59e0b', fontWeight: 600 }}>{rec.departure}</td>
                          <td style={{ color: '#ffffff', fontWeight: 600 }}>{rec.total_hours}</td>
                          <td>
                            <span className="admin-status-pill active" style={{ fontSize: '0.72rem' }}>
                              ● {rec.status}
                            </span>
                          </td>
                          <td style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Office (HQ)</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => setSelectedEmpDetails(employees.find(e => e.id === rec.id) || employees[0])}
                              >
                                View
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => triggerAdminToast(`✓ Logged manual check for ${rec.name}`)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 3: WFH REQUESTS (ADMIN VIEW)
             ================================================================= */}
          {/* =================================================================
              SCREEN 4: WFH REQUESTS (ADMIN VIEW - IMAGE 2 SCREEN 4)
             ================================================================= */}
          {activeModule === 'wfh' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">WFH Requests</h1>
                  <p className="admin-header-desc">Manage and review work from home applications</p>
                </div>
                <button className="admin-btn-primary" onClick={() => setActiveModule('apply-wfh')}>
                  <Plus size={15} />
                  <span>New WFH Request</span>
                </button>
              </div>

              {/* Status Tabs: All (12), Pending (8), Approved (4), Rejected (1) */}
              <div className="admin-tabs-row">
                {[
                  { id: 'All', label: 'All', count: 12 },
                  { id: 'Pending', label: 'Pending', count: 8 },
                  { id: 'Approved', label: 'Approved', count: 4 },
                  { id: 'Rejected', label: 'Rejected', count: 1 }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setWfhTab(t.id)}
                    className={`admin-tab-btn ${wfhTab === t.id ? 'active' : ''}`}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>

              {/* Filters Bar */}
              <div className="admin-filters-bar">
                <div className="admin-filter-search">
                  <Search size={14} className="admin-filter-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by employee or reason..."
                    value={wfhSearch}
                    onChange={(e) => setWfhSearch(e.target.value)}
                    className="admin-filter-input"
                  />
                </div>

                <select
                  value={wfhDeptFilter}
                  onChange={(e) => setWfhDeptFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Departments</option>
                  <option value="Software Dev">Software Dev</option>
                  <option value="Product Design">Product Design</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="IT Support">IT Support</option>
                </select>

                <div
                  className="admin-select-date"
                  onClick={() => { setDateFilterTarget('wfh'); setShowDateRangeModal(true); }}
                  title="Click to select date range"
                >
                  <Calendar size={13} color="#38bdf8" />
                  <span>{wfhDateRangeLabel || 'Select Date Range'}</span>
                  {wfhDateRangeLabel && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setWfhDateRangeLabel('');
                        setWfhDateRangeFilter(null);
                        triggerAdminToast('✓ Cleared WFH date filter');
                      }}
                      style={{ marginLeft: '6px', cursor: 'pointer', color: '#f87171', fontWeight: 800 }}
                      title="Clear date filter"
                    >
                      ✕
                    </span>
                  )}
                </div>

                <select
                  className="admin-filter-select"
                  value={wfhTab}
                  onChange={(e) => setWfhTab(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Table */}
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wfhList
                      .filter(w => wfhTab === 'All' || w.status === wfhTab)
                      .filter(w => {
                        const s = wfhSearch.toLowerCase();
                        return !wfhSearch || w.employee_name.toLowerCase().includes(s) || w.reason.toLowerCase().includes(s);
                      })
                      .filter(w => {
                        if (!wfhDateRangeFilter) return true;
                        if (wfhDateRangeFilter.preset === 'Today') return w.request_date.includes('14 Oct') || w.request_date.includes('Today');
                        if (wfhDateRangeFilter.preset === 'Yesterday') return w.request_date.includes('13 Oct');
                        if (wfhDateRangeFilter.preset === 'This Week') return w.request_date.includes('Oct');
                        if (wfhDateRangeFilter.preset === 'This Month') return w.request_date.includes('Oct');
                        return true;
                      })
                      .map((req, idx) => (
                        <tr key={req.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div className="admin-employee-cell">
                              <img src={req.avatar} alt={req.employee_name} className="admin-employee-avatar" />
                              <div>
                                <div className="admin-employee-name">{req.employee_name}</div>
                                <div className="admin-employee-id">{req.employee_id} • {req.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="admin-td-date">{req.request_date}</td>
                          <td className="admin-td-date">{req.request_date}</td>
                          <td className="admin-td-num" style={{ fontWeight: 700, color: '#ffffff' }}>1</td>
                          <td className="admin-td-reason">{req.reason}</td>
                          <td>
                            <span className={`admin-status-pill ${req.status.toLowerCase()}`}>
                              {req.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => alert(`WFH Request:\nEmployee: ${req.employee_name}\nDate: ${req.request_date}\nReason: ${req.reason}`)}
                              >
                                View
                              </button>
                              {req.status === 'Pending' ? (
                                <>
                                  <button
                                    className="admin-btn-approve"
                                    onClick={() => handleWfhAction(req.id, 'Approved')}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="admin-btn-reject"
                                    onClick={() => handleWfhAction(req.id, 'Rejected')}
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: '0.8rem', padding: '0 8px' }}>-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* WFH Policy Guidelines card matching Image 2 Screen 4 */}
              <div className="admin-table-card" style={{ marginTop: '22px', padding: '22px', background: 'linear-gradient(135deg, #0d1527 0%, #1e1b4b 100%)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1 1 420px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#38bdf8" /> WFH Policy Guidelines
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>Submit request at least 1 day before.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>Approval subject to manager's confirmation.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>Maintain productivity and availability.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>WFH applicable as per company policy.</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160" alt="WFH Guidelines" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8', boxShadow: '0 0 20px rgba(56,189,248,0.2)' }} />
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 5: LEAVE REQUESTS (ADMIN VIEW - IMAGE 2 SCREEN 5)
             ================================================================= */}
          {activeModule === 'leaves' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Leave Requests</h1>
                  <p className="admin-header-desc">Review and approve employee leave applications</p>
                </div>
                <button className="admin-btn-primary" onClick={() => setActiveModule('apply-leave')}>
                  <Plus size={15} />
                  <span>New Leave Request</span>
                </button>
              </div>

              {/* Status Tabs: All (18), Pending (6), Approved (7), Rejected (5) */}
              <div className="admin-tabs-row">
                {[
                  { id: 'All', label: 'All', count: 18 },
                  { id: 'Pending', label: 'Pending', count: 6 },
                  { id: 'Approved', label: 'Approved', count: 7 },
                  { id: 'Rejected', label: 'Rejected', count: 5 }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setLeaveTab(t.id)}
                    className={`admin-tab-btn ${leaveTab === t.id ? 'active' : ''}`}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>

              {/* Filters Bar */}
              <div className="admin-filters-bar">
                <div className="admin-filter-search">
                  <Search size={14} className="admin-filter-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by employee or reason..."
                    value={leaveSearch}
                    onChange={(e) => setLeaveSearch(e.target.value)}
                    className="admin-filter-input"
                  />
                </div>

                <select
                  value={leaveTypeFilter}
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Leave Types</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>

                <div
                  className="admin-select-date"
                  onClick={() => { setDateFilterTarget('leave'); setShowDateRangeModal(true); }}
                  title="Click to select date range"
                >
                  <Calendar size={13} color="#38bdf8" />
                  <span>{leaveDateRangeLabel || 'Select Date Range'}</span>
                  {leaveDateRangeLabel && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setLeaveDateRangeLabel('');
                        setLeaveDateRangeFilter(null);
                        triggerAdminToast('✓ Cleared Leave date filter');
                      }}
                      style={{ marginLeft: '6px', cursor: 'pointer', color: '#f87171', fontWeight: 800 }}
                      title="Clear date filter"
                    >
                      ✕
                    </span>
                  )}
                </div>

                <select
                  className="admin-filter-select"
                  value={leaveTab}
                  onChange={(e) => setLeaveTab(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Table */}
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveList
                      .filter(l => leaveTab === 'All' || l.status === leaveTab)
                      .filter(l => {
                        const s = leaveSearch.toLowerCase();
                        return !leaveSearch || l.employee_name.toLowerCase().includes(s) || l.reason.toLowerCase().includes(s);
                      })
                      .filter(l => {
                        if (!leaveDateRangeFilter) return true;
                        if (leaveDateRangeFilter.preset === 'Today') return (l.from_date && l.from_date.includes('14 Oct')) || (l.to_date && l.to_date.includes('14 Oct'));
                        if (leaveDateRangeFilter.preset === 'Yesterday') return (l.from_date && l.from_date.includes('13 Oct')) || (l.to_date && l.to_date.includes('13 Oct'));
                        if (leaveDateRangeFilter.preset === 'This Week') return (l.from_date && l.from_date.includes('Oct'));
                        if (leaveDateRangeFilter.preset === 'This Month') return (l.from_date && l.from_date.includes('Oct'));
                        return true;
                      })
                      .map((req, idx) => (
                        <tr key={req.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div className="admin-employee-cell">
                              <img src={req.avatar} alt={req.employee_name} className="admin-employee-avatar" />
                              <div>
                                <div className="admin-employee-name">{req.employee_name}</div>
                                <div className="admin-employee-id">{req.employee_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="admin-td-dept">
                            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem' }}>
                              {req.leave_type}
                            </span>
                          </td>
                          <td className="admin-td-date">{req.from_date}</td>
                          <td className="admin-td-date">{req.to_date}</td>
                          <td className="admin-td-num" style={{ fontWeight: 700, color: '#ffffff' }}>{req.total_days}</td>
                          <td className="admin-td-reason">{req.reason}</td>
                          <td>
                            <span className={`admin-status-pill ${req.status.toLowerCase()}`}>
                              {req.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => alert(`Leave Request Details:\nEmployee: ${req.employee_name}\nType: ${req.leave_type}\nDates: ${req.from_date} to ${req.to_date} (${req.total_days} days)\nReason: ${req.reason}`)}
                              >
                                View
                              </button>
                              {req.status === 'Pending' ? (
                                <>
                                  <button
                                    className="admin-btn-approve"
                                    onClick={() => handleLeaveAction(req.id, 'Approved')}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="admin-btn-reject"
                                    onClick={() => handleLeaveAction(req.id, 'Rejected')}
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: '0.8rem', padding: '0 8px' }}>-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 6: HR MANAGEMENT (IMAGE 2 SCREEN 6 - 5 TABS)
             ================================================================= */}
          {activeModule === 'hr_management' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">HR Management</h1>
                  <p className="admin-header-desc">Manage departments, designations, shifts, and company holidays</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => setShowAddHrItemModal(true)}
                >
                  <Plus size={15} />
                  <span>Add {hrMgmtTab === 'Departments' ? 'Department' : hrMgmtTab === 'Designations' ? 'Designation' : hrMgmtTab === 'Holidays' ? 'Holiday' : hrMgmtTab === 'Shifts' ? 'Shift' : 'Location'}</span>
                </button>
              </div>

              {/* 5 Tabs: Departments, Designations, Holidays, Shifts, Work Locations */}
              <div className="admin-tabs-row">
                {[
                  { id: 'Departments', label: 'Departments', count: departmentsList.length },
                  { id: 'Designations', label: 'Designations', count: designationsList.length },
                  { id: 'Holidays', label: 'Holidays', count: holidaysList.length },
                  { id: 'Shifts', label: 'Shifts', count: shiftsList.length },
                  { id: 'Work Locations', label: 'Work Locations', count: workLocationsList.length }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setHrMgmtTab(t.id)}
                    className={`admin-tab-btn ${hrMgmtTab === t.id ? 'active' : ''}`}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>

              {/* Tab 1: Departments */}
              {hrMgmtTab === 'Departments' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Department</th>
                        <th>Head</th>
                        <th>Employee Count</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentsList.map((dept, idx) => (
                        <tr key={dept.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{dept.name}</td>
                          <td>
                            <div className="admin-employee-cell">
                              <img src={dept.headAvatar} alt={dept.head} className="admin-employee-avatar" />
                              <div className="admin-employee-name">{dept.head}</div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 700, color: '#38bdf8' }}>{dept.employeeCount}</td>
                          <td>
                            <span className={`admin-status-pill ${dept.status === 'Active' ? 'active' : 'inactive'}`}>{dept.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => {
                                  const nextStatus = dept.status === 'Active' ? 'Inactive' : 'Active';
                                  setDepartmentsList(prev => prev.map(d => d.id === dept.id ? { ...d, status: nextStatus } : d));
                                  triggerAdminToast(`✓ Department ${dept.name} set to ${nextStatus}`);
                                }}
                                title="Toggle Status"
                              >
                                Toggle
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => handleDeleteHrItem('dept', dept.id, dept.name)}
                                style={{ color: '#ef4444' }}
                                title="Remove Department"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Designations */}
              {hrMgmtTab === 'Designations' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Staff Count</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {designationsList.map((desig, idx) => (
                        <tr key={desig.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{desig.designation}</td>
                          <td className="admin-td-dept">{desig.department}</td>
                          <td style={{ fontWeight: 700, color: '#38bdf8' }}>{desig.count}</td>
                          <td>
                            <span className={`admin-status-pill ${desig.status === 'Active' ? 'active' : 'inactive'}`}>{desig.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => {
                                  const nextStatus = desig.status === 'Active' ? 'Inactive' : 'Active';
                                  setDesignationsList(prev => prev.map(d => d.id === desig.id ? { ...d, status: nextStatus } : d));
                                  triggerAdminToast(`✓ Designation ${desig.designation} set to ${nextStatus}`);
                                }}
                                title="Toggle Status"
                              >
                                Toggle
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => handleDeleteHrItem('desig', desig.id, desig.designation)}
                                style={{ color: '#ef4444' }}
                                title="Remove Designation"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Holidays */}
              {hrMgmtTab === 'Holidays' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Holiday Name</th>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidaysList.map((hol, idx) => (
                        <tr key={hol.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{hol.name}</td>
                          <td className="admin-td-date" style={{ color: '#38bdf8', fontWeight: 600 }}>{hol.date}</td>
                          <td style={{ color: '#cbd5e1' }}>{hol.day}</td>
                          <td>
                            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem' }}>
                              {hol.type}
                            </span>
                          </td>
                          <td>
                            <span className="admin-status-pill active" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                              {hol.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => handleDeleteHrItem('hol', hol.id, hol.name)}
                                style={{ color: '#ef4444' }}
                                title="Remove Holiday"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 4: Shifts */}
              {hrMgmtTab === 'Shifts' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Shift Name</th>
                        <th>Timing</th>
                        <th>Grace Period</th>
                        <th>Staff Assigned</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftsList.map((sh, idx) => (
                        <tr key={sh.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{sh.name}</td>
                          <td className="admin-td-date" style={{ color: '#10b981', fontWeight: 600 }}>{sh.timing}</td>
                          <td style={{ color: '#cbd5e1' }}>{sh.grace}</td>
                          <td style={{ fontWeight: 700, color: '#38bdf8' }}>{sh.count}</td>
                          <td>
                            <span className={`admin-status-pill ${sh.status === 'Active' ? 'active' : 'inactive'}`}>{sh.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => {
                                  const nextStatus = sh.status === 'Active' ? 'Inactive' : 'Active';
                                  setShiftsList(prev => prev.map(s => s.id === sh.id ? { ...s, status: nextStatus } : s));
                                  triggerAdminToast(`✓ Shift ${sh.name} set to ${nextStatus}`);
                                }}
                                title="Toggle Status"
                              >
                                Toggle
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => handleDeleteHrItem('shift', sh.id, sh.name)}
                                style={{ color: '#ef4444' }}
                                title="Remove Shift"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 5: Work Locations */}
              {hrMgmtTab === 'Work Locations' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Location Name</th>
                        <th>Address</th>
                        <th>Geofence Radius</th>
                        <th>Staff Count</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workLocationsList.map((loc, idx) => (
                        <tr key={loc.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{loc.name}</td>
                          <td style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>{loc.address}</td>
                          <td style={{ color: '#a855f7', fontWeight: 600 }}>{loc.geofence}</td>
                          <td style={{ fontWeight: 700, color: '#38bdf8' }}>{loc.staff}</td>
                          <td>
                            <span className={`admin-status-pill ${loc.status === 'Active' ? 'active' : 'inactive'}`}>{loc.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => {
                                  const nextStatus = loc.status === 'Active' ? 'Inactive' : 'Active';
                                  setWorkLocationsList(prev => prev.map(l => l.id === loc.id ? { ...l, status: nextStatus } : l));
                                  triggerAdminToast(`✓ Location ${loc.name} set to ${nextStatus}`);
                                }}
                                title="Toggle Status"
                              >
                                Toggle
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => handleDeleteHrItem('loc', loc.id, loc.name)}
                                style={{ color: '#ef4444' }}
                                title="Remove Location"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 8: COMPANY POLICIES (IMAGE 2 SCREEN 8)
             ================================================================= */}
          {activeModule === 'policies' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Company Policies</h1>
                  <p className="admin-header-desc">Manage organization policies and official documentation</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => setShowAddPolicyModal(true)}
                >
                  <Plus size={15} />
                  <span>Add Policy</span>
                </button>
              </div>

              {/* 6 Tabs: All Policies, HR Policies, Attendance, Leave, WFH, Others */}
              <div className="admin-tabs-row">
                {['All Policies', 'HR Policies', 'Attendance', 'Leave', 'WFH', 'Others'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPoliciesDocTab(tab)}
                    className={`admin-tab-btn ${policiesDocTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Documents Table matching Image 2 Screen 8 */}
              <div className="admin-table-card" style={{ marginBottom: '24px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Policy Name</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Updated On</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policiesDocsList
                      .filter(p => {
                        if (policiesDocTab === 'All Policies') return true;
                        if (policiesDocTab === 'HR Policies') return p.category === 'HR Policies';
                        if (policiesDocTab === 'Attendance') return p.category === 'Attendance' || p.name.includes('Attendance');
                        if (policiesDocTab === 'Leave') return p.category === 'Leave' || p.name.includes('Leave');
                        if (policiesDocTab === 'WFH') return p.category === 'WFH' || p.name.includes('Home') || p.name.includes('WFH');
                        if (policiesDocTab === 'Others') return ['General', 'IT Security', 'Finance'].includes(p.category);
                        return true;
                      })
                      .map((p, idx) => (
                        <tr key={p.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56,189,248,0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={16} />
                              </div>
                              <span style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</span>
                            </div>
                          </td>
                          <td className="admin-td-dept">{p.category}</td>
                          <td style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{p.size}</td>
                          <td className="admin-td-date">{p.updatedOn}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => setViewPolicyModalDoc(p)}
                              >
                                View
                              </button>
                              <button
                                className="admin-btn-action"
                                style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                                onClick={() => handleDownloadPolicy(p)}
                                title={`Download official copy of ${p.name}`}
                              >
                                <Download size={12} />
                                <span>Download</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Policy Timing Rules Card */}
              <div className="admin-policy-card">
                <div className="admin-policy-card-header">
                  <h3 className="admin-card-title">Attendance Policy Rules & Working Hours</h3>
                  <button className="admin-btn-edit-policy" onClick={() => setShowEditPolicyModal(true)}>
                    <Edit3 size={13} />
                    <span>Edit Rules</span>
                  </button>
                </div>

                {/* 7 Timing Parameter Metric Boxes */}
                <div className="admin-timing-grid">
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Office Start Time</div>
                    <div className="admin-timing-val">{policySettings.startTime}</div>
                  </div>
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Office End Time</div>
                    <div className="admin-timing-val">{policySettings.endTime}</div>
                  </div>
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Half Day Hours</div>
                    <div className="admin-timing-val">{policySettings.halfDay}</div>
                  </div>
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Late Mark After</div>
                    <div className="admin-timing-val">{policySettings.lateMark}</div>
                  </div>
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Working Days</div>
                    <div className="admin-timing-val">{policySettings.workingDays}</div>
                  </div>
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Grace Time</div>
                    <div className="admin-timing-val">{policySettings.graceTime1}</div>
                  </div>
                  <div className="admin-timing-box">
                    <div className="admin-timing-label">Overtime Minimum</div>
                    <div className="admin-timing-val">60 mins</div>
                  </div>
                </div>

                {/* Interactive Toggles */}
                <div className="admin-switches-group">
                  <div className="admin-switch-row">
                    <label className="admin-switch-toggle">
                      <input
                        type="checkbox"
                        checked={policySettings.enableQr}
                        onChange={(e) => setPolicySettings({ ...policySettings, enableQr: e.target.checked })}
                      />
                      <span className="admin-slider" />
                    </label>
                    <span className="admin-switch-label">Enable QR Attendance Kiosk</span>
                  </div>

                  <div className="admin-switch-row">
                    <label className="admin-switch-toggle">
                      <input
                        type="checkbox"
                        checked={policySettings.allowCorrection}
                        onChange={(e) => setPolicySettings({ ...policySettings, allowCorrection: e.target.checked })}
                      />
                      <span className="admin-slider" />
                    </label>
                    <span className="admin-switch-label">Allow Attendance Correction Requests</span>
                  </div>

                  <div className="admin-switch-row">
                    <label className="admin-switch-toggle">
                      <input
                        type="checkbox"
                        checked={policySettings.autoAbsent}
                        onChange={(e) => setPolicySettings({ ...policySettings, autoAbsent: e.target.checked })}
                      />
                      <span className="admin-slider" />
                    </label>
                    <span className="admin-switch-label">Auto Mark Absent after 11:30 AM cutoff</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 10: REPORTS & ANALYTICS (IMAGE 2 SCREEN 10)
             ================================================================= */}
          {activeModule === 'reports' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Reports & Analytics</h1>
                  <p className="admin-header-desc">Generate and export organization-wide reports</p>
                </div>
                <button className="admin-btn-export" onClick={handleExportAnalytics} title="Download Analytics CSV Report">
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </div>

              {/* 6 Subtabs: Attendance, Leave, WFH, Department, Employee, Export */}
              <div className="admin-tabs-row">
                {['Attendance', 'Leave', 'WFH', 'Department', 'Employee', 'Export'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setReportsSubTab(tab)}
                    className={`admin-tab-btn ${reportsSubTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Filter Bar */}
              <div className="admin-filters-bar" style={{ marginBottom: '20px' }}>
                <RealDatePickerPopover
                  selectedMonthYear={reportMonth}
                  onSelectMonthYear={(my) => setReportMonth(my)}
                  align="left"
                />

                <select
                  value={reportDept}
                  onChange={(e) => setReportDept(e.target.value)}
                  className="admin-filter-select"
                  style={{ width: '180px' }}
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                </select>

                <select 
                  className="admin-filter-select" 
                  style={{ width: '110px' }}
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>

                <button
                  className="admin-btn-primary"
                  onClick={() => setShowReportPreviewModal(true)}
                  title="Generate and Preview Executive Report"
                  style={{ gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Generate Report</span>
                </button>
              </div>

              {/* Subtab 1: ATTENDANCE */}
              {reportsSubTab === 'Attendance' && (
                <>
                  {/* 5 Stat Badges Matching Image 2 Screen 10 */}
                  <div className="admin-report-pills-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '22px' }}>
                    <div className="admin-report-stat-pill" style={{ background: '#0d1527', border: '1px solid rgba(56,189,248,0.25)' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Days</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>26</div>
                      </div>
                    </div>

                    <div className="admin-report-stat-pill admin-pill-green" style={{ background: '#0d1527' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Present</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>186</div>
                      </div>
                    </div>

                    <div className="admin-report-stat-pill admin-pill-purple" style={{ background: '#0d1527' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>WFH</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc' }}>32</div>
                      </div>
                    </div>

                    <div className="admin-report-stat-pill admin-pill-amber" style={{ background: '#0d1527' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Leave</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>18</div>
                      </div>
                    </div>

                    <div className="admin-report-stat-pill" style={{ background: '#0d1527', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Absent</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>14</div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Charts: Department-wise Clustered Bar + Attendance Trend */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '20px' }}>
                    {/* Chart 1: Department-wise Attendance */}
                    <div className="admin-chart-card">
                      <div className="admin-chart-header">
                        <h3 className="admin-card-title">Department-wise Attendance</h3>
                        <div className="admin-chart-legend">
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#0284c7' }} /> Present</span>
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#10b981' }} /> WFH</span>
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#f59e0b' }} /> Leave</span>
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#ef4444' }} /> Absent</span>
                        </div>
                      </div>

                      <div className="admin-clustered-chart-wrap">
                        <div className="admin-chart-y-axis">
                          <span>30</span>
                          <span>20</span>
                          <span>10</span>
                          <span>0</span>
                        </div>

                        <div className="admin-dept-clusters">
                          {[
                            { name: 'Engineering', present: 24, wfh: 6, leave: 3, absent: 2 },
                            { name: 'Product', present: 18, wfh: 4, leave: 2, absent: 1 },
                            { name: 'HR', present: 10, wfh: 2, leave: 1, absent: 0 },
                            { name: 'Operations', present: 14, wfh: 3, leave: 2, absent: 2 },
                            { name: 'Marketing', present: 12, wfh: 4, leave: 2, absent: 1 }
                          ].map(dept => (
                            <div key={dept.name} className="admin-dept-cluster">
                              <div className="admin-dept-bars-group">
                                <div className="admin-clustered-bar" style={{ height: `${(dept.present / 30) * 100}%`, background: '#0284c7' }} title={`Present: ${dept.present}`} />
                                <div className="admin-clustered-bar" style={{ height: `${(dept.wfh / 30) * 100}%`, background: '#10b981' }} title={`WFH: ${dept.wfh}`} />
                                <div className="admin-clustered-bar" style={{ height: `${(dept.leave / 30) * 100}%`, background: '#f59e0b' }} title={`Leave: ${dept.leave}`} />
                                <div className="admin-clustered-bar" style={{ height: `${(dept.absent / 30) * 100}%`, background: '#ef4444' }} title={`Absent: ${dept.absent}`} />
                              </div>
                              <span className="admin-dept-name">{dept.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chart 2: Attendance Trend Line Chart */}
                    <div className="admin-chart-card">
                      <div className="admin-chart-header">
                        <h3 className="admin-card-title">Attendance Trend</h3>
                        <div className="admin-chart-legend">
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#38bdf8' }} /> Present</span>
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#10b981' }} /> WFH</span>
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#f59e0b' }} /> Leave</span>
                          <span className="admin-legend-item"><span className="admin-legend-dot" style={{ background: '#ef4444' }} /> Absent</span>
                        </div>
                      </div>

                      <div style={{ position: 'relative', height: '220px', width: '100%', paddingTop: '10px' }}>
                        <svg viewBox="0 0 400 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <line x1="40" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.06)" />
                          <line x1="40" y1="75" x2="380" y2="75" stroke="rgba(255,255,255,0.06)" />
                          <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.06)" />
                          <line x1="40" y1="165" x2="380" y2="165" stroke="rgba(255,255,255,0.06)" />

                          <path d="M 60 70 Q 140 50, 220 60 T 360 40 L 360 165 L 60 165 Z" fill="url(#trendGrad)" />
                          <path d="M 60 70 Q 140 50, 220 60 T 360 40" fill="none" stroke="#38bdf8" strokeWidth="3" />
                          <circle cx="60" cy="70" r="4" fill="#38bdf8" />
                          <circle cx="160" cy="53" r="4" fill="#38bdf8" />
                          <circle cx="260" cy="56" r="4" fill="#38bdf8" />
                          <circle cx="360" cy="40" r="4" fill="#38bdf8" />

                          <path d="M 60 130 Q 140 120, 220 125 T 360 115" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                          <path d="M 60 148 Q 140 142, 220 145 T 360 140" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        </svg>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '50px', paddingRight: '20px', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                          <span>Week 1</span>
                          <span>Week 2</span>
                          <span>Week 3</span>
                          <span>Week 4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Subtab 2: LEAVE */}
              {reportsSubTab === 'Leave' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '22px' }}>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(56,189,248,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Leave Requests</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>42</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>For {reportMonth}</span>
                    </div>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Approved Rate</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>83.3%</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>35 requests approved</span>
                    </div>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Pending Review</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>4</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Awaiting manager action</span>
                    </div>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Rejected / Cancelled</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>3</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Policy limit exceeded</span>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527', marginBottom: '22px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Leave Distribution by Category</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                      {[
                        { type: 'Casual Leave', taken: 18, totalAllocated: 48, color: '#38bdf8' },
                        { type: 'Sick Leave', taken: 12, totalAllocated: 36, color: '#10b981' },
                        { type: 'Earned Leave', taken: 10, totalAllocated: 60, color: '#c084fc' },
                        { type: 'Compensatory Off', taken: 2, totalAllocated: 12, color: '#f59e0b' }
                      ].map(cat => (
                        <div key={cat.type} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{cat.type}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cat.color }}>{cat.taken} Days</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${(cat.taken / cat.totalAllocated) * 100}%`, height: '100%', background: cat.color, borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>{cat.taken} used of {cat.totalAllocated} allocated</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ background: '#0d1527' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Department Leave Utilization Breakdown</h4>
                      <button onClick={handleExportOrgReport} className="admin-btn-action" style={{ fontSize: '0.75rem' }}>Download Leave Table CSV</button>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Headcount</th>
                          <th>Leaves Taken</th>
                          <th>Leave Rate</th>
                          <th>Avg Duration</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { dept: 'Engineering', count: 50, taken: 14, rate: '28%', avg: '2.1 days', status: 'Normal' },
                          { dept: 'Product Design', count: 28, taken: 6, rate: '21.4%', avg: '1.8 days', status: 'Optimal' },
                          { dept: 'Human Resources', count: 12, taken: 3, rate: '25%', avg: '1.5 days', status: 'Optimal' },
                          { dept: 'Operations', count: 25, taken: 9, rate: '36%', avg: '2.4 days', status: 'Moderate' },
                          { dept: 'Marketing', count: 20, taken: 8, rate: '40%', avg: '2.2 days', status: 'Moderate' },
                          { dept: 'Finance', count: 15, taken: 2, rate: '13.3%', avg: '1.0 day', status: 'Optimal' }
                        ].map(d => (
                          <tr key={d.dept}>
                            <td style={{ fontWeight: 700, color: '#ffffff' }}>{d.dept}</td>
                            <td>{d.count} staff</td>
                            <td style={{ color: '#f59e0b', fontWeight: 700 }}>{d.taken} days</td>
                            <td>{d.rate}</td>
                            <td>{d.avg}</td>
                            <td>
                              <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: d.status === 'Optimal' ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)', color: d.status === 'Optimal' ? '#10b981' : '#38bdf8' }}>
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab 3: WFH */}
              {reportsSubTab === 'WFH' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '22px' }}>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Total Remote Days</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>32</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Authorized remote logins</span>
                    </div>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(56,189,248,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Remote Ratio</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>12.8%</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Of total working days</span>
                    </div>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Policy Compliance</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>98.2%</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>VPN &amp; core hours active</span>
                    </div>
                    <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Avg Daily Remote Hours</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>8.9h</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Productivity benchmark</span>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ background: '#0d1527' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Department Remote Work Distribution</h4>
                      <button onClick={handleExportAnalytics} className="admin-btn-action" style={{ fontSize: '0.75rem' }}>Download WFH Report CSV</button>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Eligible Staff</th>
                          <th>Monthly Quota</th>
                          <th>WFH Days Utilized</th>
                          <th>Utilization %</th>
                          <th>Avg Productive Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { dept: 'Software Development', staff: 50, quota: 8, days: 18, util: '45.0%', hrs: '9.1h' },
                          { dept: 'Product Design', staff: 28, quota: 8, days: 8, util: '35.7%', hrs: '8.8h' },
                          { dept: 'Human Resources', staff: 12, quota: 4, days: 2, util: '16.7%', hrs: '8.5h' },
                          { dept: 'Operations', staff: 25, quota: 4, days: 3, util: '12.0%', hrs: '8.7h' },
                          { dept: 'Marketing', staff: 20, quota: 6, days: 5, util: '25.0%', hrs: '8.9h' }
                        ].map(w => (
                          <tr key={w.dept}>
                            <td style={{ fontWeight: 700, color: '#ffffff' }}>{w.dept}</td>
                            <td>{w.staff}</td>
                            <td>{w.quota} days/mo</td>
                            <td style={{ color: '#c084fc', fontWeight: 700 }}>{w.days} days</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: w.util, height: '100%', background: '#c084fc' }} />
                                </div>
                                <span style={{ fontSize: '0.75rem' }}>{w.util}</span>
                              </div>
                            </td>
                            <td style={{ color: '#10b981', fontWeight: 600 }}>{w.hrs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab 4: DEPARTMENT */}
              {reportsSubTab === 'Department' && (
                <div className="admin-table-card" style={{ background: '#0d1527' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Departmental Attendance Performance Scorecard</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Comprehensive metrics for all business units for {reportMonth}</p>
                    </div>
                    <button onClick={handleExportAnalytics} className="admin-btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                      <Download size={13} /> Export Scorecard CSV
                    </button>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Head of Department</th>
                        <th>Headcount</th>
                        <th>Present</th>
                        <th>WFH</th>
                        <th>Leave</th>
                        <th>Attendance %</th>
                        <th>Punctuality Score</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { dept: 'Software Development', head: 'Amit Kumar', count: 50, present: 42, wfh: 6, leave: 2, pct: '96.0%', punct: '94.5%' },
                        { dept: 'Product Design', head: 'Siddharth Joshi', count: 28, present: 23, wfh: 4, leave: 1, pct: '96.4%', punct: '91.8%' },
                        { dept: 'Human Resources', head: 'Neha Gupta', count: 12, present: 10, wfh: 1, leave: 1, pct: '91.7%', punct: '98.2%' },
                        { dept: 'Operations', head: 'Vikas Rai', count: 25, present: 21, wfh: 2, leave: 2, pct: '92.0%', punct: '88.5%' },
                        { dept: 'Marketing', head: 'Priya Sharma', count: 20, present: 16, wfh: 3, leave: 1, pct: '95.0%', punct: '89.4%' },
                        { dept: 'Quality Assurance', head: 'Sneha Verma', count: 14, present: 12, wfh: 1, leave: 1, pct: '92.8%', punct: '96.0%' },
                        { dept: 'IT Support', head: 'Rohan Iyer', count: 18, present: 16, wfh: 1, leave: 1, pct: '94.4%', punct: '97.5%' }
                      ].map((dept) => (
                        <tr key={dept.dept}>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{dept.dept}</td>
                          <td style={{ color: '#cbd5e1' }}>{dept.head}</td>
                          <td>{dept.count}</td>
                          <td style={{ color: '#10b981', fontWeight: 700 }}>{dept.present}</td>
                          <td style={{ color: '#c084fc', fontWeight: 600 }}>{dept.wfh}</td>
                          <td style={{ color: '#f59e0b', fontWeight: 600 }}>{dept.leave}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '50px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: dept.pct, height: '100%', background: '#10b981' }} />
                              </div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>{dept.pct}</span>
                            </div>
                          </td>
                          <td style={{ color: '#38bdf8', fontWeight: 700 }}>{dept.punct}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="admin-action-chip"
                              onClick={() => {
                                const report = `Department: ${dept.dept}\nHead: ${dept.head}\nStaff: ${dept.count}\nAttendance: ${dept.pct}\nPunctuality: ${dept.punct}\nGenerated: ${new Date().toLocaleString()}`;
                                const blob = new Blob([report], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${dept.dept.replace(/\s+/g, '_')}_Monthly_Report.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                                triggerAdminToast(`✓ Exported ${dept.dept} summary report!`);
                              }}
                              title="Download Department Report"
                            >
                              Download Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Subtab 5: EMPLOYEE */}
              {reportsSubTab === 'Employee' && (
                <div className="admin-table-card" style={{ background: '#0d1527' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Individual Employee Attendance Roster</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Detailed monthly summary per employee</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div className="admin-search-wrapper" style={{ width: '220px' }}>
                        <Search size={14} className="admin-search-icon" />
                        <input
                          type="text"
                          placeholder="Search employee..."
                          value={reportEmployeeSearch}
                          onChange={(e) => setReportEmployeeSearch(e.target.value)}
                          className="admin-search-input"
                          style={{ fontSize: '0.75rem' }}
                        />
                      </div>
                      <button onClick={handleExportEmpRoster} className="admin-btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                        <Download size={13} /> Export All CSV
                      </button>
                    </div>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Present Days</th>
                        <th>WFH Days</th>
                        <th>Leaves</th>
                        <th>Monthly Hours</th>
                        <th>Punctuality</th>
                        <th style={{ textAlign: 'right' }}>Slip / Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presentEmployeesList
                        .filter(e => !reportEmployeeSearch || e.name.toLowerCase().includes(reportEmployeeSearch.toLowerCase()) || e.id.toLowerCase().includes(reportEmployeeSearch.toLowerCase()) || e.department.toLowerCase().includes(reportEmployeeSearch.toLowerCase()))
                        .slice(0, 15)
                        .map((emp) => (
                          <tr key={emp.id}>
                            <td>
                              <div className="admin-employee-cell">
                                <img src={emp.avatar} alt={emp.name} className="admin-employee-avatar" />
                                <div>
                                  <div className="admin-employee-name">{emp.name}</div>
                                  <div className="admin-employee-id">{emp.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="admin-td-dept">{emp.department}</td>
                            <td style={{ color: '#10b981', fontWeight: 700 }}>20 days</td>
                            <td style={{ color: '#c084fc', fontWeight: 600 }}>2 days</td>
                            <td style={{ color: '#f59e0b', fontWeight: 600 }}>0 days</td>
                            <td style={{ color: '#ffffff', fontWeight: 700 }}>182.5 hrs</td>
                            <td>
                              <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.78rem' }}>98.5% (High)</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="admin-action-chip"
                                onClick={() => handleDownloadEmpSlip(emp)}
                                title="Download Employee Monthly Slip"
                              >
                                Download Slip
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Subtab 6: EXPORT */}
              {reportsSubTab === 'Export' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
                    <div className="admin-table-card" style={{ padding: '18px', background: '#0d1527', border: '1px solid rgba(56,189,248,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Calendar size={18} color="#38bdf8" />
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Attendance Report</div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>Organization monthly presence, leaves and punches with geofence tags.</div>
                      <button onClick={handleExportOrgReport} className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.8rem' }}>
                        <Download size={14} /> Download CSV
                      </button>
                    </div>

                    <div className="admin-table-card" style={{ padding: '18px', background: '#0d1527', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Users size={18} color="#10b981" />
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Employee Roster</div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>Full staff directory with emails, roles, joining dates and statuses.</div>
                      <button onClick={handleExportEmpRoster} className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.8rem', background: '#059669' }}>
                        <Download size={14} /> Download CSV
                      </button>
                    </div>

                    <div className="admin-table-card" style={{ padding: '18px', background: '#0d1527', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <BarChart3 size={18} color="#c084fc" />
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Analytics Summary</div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>Department breakdown, WFH ratios and monthly absenteeism trends.</div>
                      <button onClick={handleExportAnalytics} className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.8rem', background: '#9333ea' }}>
                        <Download size={14} /> Download CSV
                      </button>
                    </div>

                    <div className="admin-table-card" style={{ padding: '18px', background: '#0d1527', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <FileSpreadsheet size={18} color="#f59e0b" />
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Audit Trail Logs</div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>Security events, role assignments, time edits and policy changes.</div>
                      <button onClick={handleExportAuditLogs} className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.8rem', background: '#d97706' }}>
                        <Download size={14} /> Download CSV
                      </button>
                    </div>
                  </div>

                  {/* Export History Activity Card */}
                  <div className="admin-table-card" style={{ background: '#0d1527' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Recent Export History &amp; Automated Snapshots</h4>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Export Date</th>
                          <th>Report Name</th>
                          <th>Format</th>
                          <th>Generated By</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Re-Download</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: '22 Oct 2026, 14:30', name: 'VorldX_Organization_Attendance_Report.csv', format: 'CSV', by: 'Rahul Verma (Admin)', status: 'Success' },
                          { date: '21 Oct 2026, 18:00', name: 'VorldX_Analytics_Report_October_2026.csv', format: 'CSV', by: 'System Automation', status: 'Success' },
                          { date: '20 Oct 2026, 09:15', name: 'VorldX_Employees_Directory_Roster.csv', format: 'CSV', by: 'Neha Gupta (HR)', status: 'Success' },
                          { date: '18 Oct 2026, 11:45', name: 'VorldX_Audit_Logs_Trail_Report.csv', format: 'CSV', by: 'Security Compliance', status: 'Success' }
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td className="admin-td-date">{item.date}</td>
                            <td style={{ fontWeight: 700, color: '#ffffff' }}>{item.name}</td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700 }}>
                                {item.format}
                              </span>
                            </td>
                            <td style={{ color: '#cbd5e1' }}>{item.by}</td>
                            <td>
                              <span className="admin-status-pill active">{item.status}</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                className="admin-action-chip"
                                onClick={handleExportOrgReport}
                                title="Re-download exported file"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 3: ATTENDANCE MANAGEMENT (IMAGE 2 SCREEN 3)
             ================================================================= */}
          {activeModule === 'attendance' && (
            <div>
              {/* Header */}
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Attendance Records</h1>
                  <p className="admin-header-desc">Daily attendance logs, check-in timestamps and status tracking</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn-action" onClick={handleExportOrgReport} title="Download Organization Attendance CSV Report">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                  <button className="admin-btn-primary" onClick={() => setActiveModule('mark-attendance')}>
                    <QrCode size={14} />
                    <span>Mark Attendance</span>
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">Present Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#10b981' }}>186</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                      <UserCheck size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#10b981', fontWeight: 700 }}>74%</span>
                    <span style={{ color: '#64748b' }}>of total staff</span>
                  </div>
                </div>

                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">WFH Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#c084fc' }}>32</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                      <Home size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#c084fc', fontWeight: 700 }}>13%</span>
                    <span style={{ color: '#64748b' }}>remote workers</span>
                  </div>
                </div>

                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">On Leave</div>
                      <div className="admin-5kpi-val" style={{ color: '#f59e0b' }}>18</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>7%</span>
                    <span style={{ color: '#64748b' }}>approved leaves</span>
                  </div>
                </div>

                <div className="admin-5kpi-card">
                  <div className="admin-5kpi-top">
                    <div>
                      <div className="admin-5kpi-label">Absent Today</div>
                      <div className="admin-5kpi-val" style={{ color: '#ef4444' }}>14</div>
                    </div>
                    <div className="admin-5kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                      <AlertCircle size={20} />
                    </div>
                  </div>
                  <div className="admin-5kpi-bottom">
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>6%</span>
                    <span style={{ color: '#64748b' }}>unexcused absence</span>
                  </div>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="admin-filters-bar">
                <div className="admin-filter-search">
                  <Search size={14} className="admin-filter-search-icon" />
                  <input
                    type="text"
                    placeholder="Search employee or ID..."
                    className="admin-filter-input"
                  />
                </div>

                <select className="admin-filter-select">
                  <option value="All">All Departments</option>
                  <option value="Software Dev">Software Dev</option>
                  <option value="Product Design">Product Design</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>

                <div
                  className="admin-select-date"
                  onClick={() => { setDateFilterTarget('attendance'); setShowDateRangeModal(true); }}
                  title="Click to select date range"
                >
                  <Calendar size={13} color="#38bdf8" />
                  <span>{attendanceDateRangeLabel || '14 Oct 2026 (Today)'}</span>
                </div>

                <select className="admin-filter-select">
                  <option value="All">All Status</option>
                  <option value="Present">Present</option>
                  <option value="WFH">WFH</option>
                  <option value="Leave">Leave</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              {/* Attendance Table */}
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Employee</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Working Hours</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presentEmployeesList.map((emp, idx) => (
                      <tr key={emp.id}>
                        <td className="admin-td-num">{idx + 1}</td>
                        <td>
                          <div className="admin-employee-cell">
                            <img src={emp.avatar} alt={emp.name} className="admin-employee-avatar" />
                            <div>
                              <div className="admin-employee-name">{emp.name}</div>
                              <div className="admin-employee-id">{emp.id} • {emp.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="admin-td-date" style={{ color: '#10b981', fontWeight: 600 }}>{emp.arrival}</td>
                        <td className="admin-td-date" style={{ color: '#f59e0b', fontWeight: 600 }}>{emp.departure}</td>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{emp.total_hours}</td>
                        <td>
                          <span className="admin-status-pill active">{emp.status}</span>
                        </td>
                        <td style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>HQ Lucknow</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-actions-group">
                            <button
                              className="admin-action-chip"
                              onClick={() => setViewAttendanceRecordModal(emp)}
                              title={`View attendance details for ${emp.name}`}
                            >
                              View
                            </button>
                            <button
                              className="admin-action-chip"
                              onClick={() => setEditAttendanceRecordModal({ ...emp })}
                              title={`Edit attendance check-in for ${emp.name}`}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 7: ROLES & PERMISSIONS (IMAGE 2 SCREEN 7)
             ================================================================= */}
          {activeModule === 'roles' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Roles & Permissions</h1>
                  <p className="admin-header-desc">Access control matrix, user roles and security privileges</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => setShowAddRoleModal(true)}
                >
                  <Plus size={14} />
                  <span>Add Role</span>
                </button>
              </div>

              {/* 3 Tabs: Roles, Users, Permissions */}
              <div className="admin-tabs-row">
                {['Roles', 'Users', 'Permissions'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRolesTab(tab)}
                    className={`admin-tab-btn ${rolesTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Roles Table matching Image 2 Screen 7 */}
              {rolesTab === 'Roles' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Users</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rolesList.map((r, idx) => (
                        <tr key={r.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{r.roleName}</td>
                          <td style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{r.description}</td>
                          <td style={{ fontWeight: 700, color: '#38bdf8' }}>{r.users}</td>
                          <td>
                            <span className={`admin-status-pill ${r.status === 'Active' ? 'active' : 'inactive'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => setEditingRoleModal(r)}
                                title={`Edit ${r.roleName} role details`}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Users Role Assignment Table */}
              {rolesTab === 'Users' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Employee</th>
                        <th>Assigned Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersRolesList.map((u, idx) => (
                        <tr key={u.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div className="admin-employee-cell">
                              <img src={u.avatar} alt={u.name} className="admin-employee-avatar" />
                              <div>
                                <div className="admin-employee-name">{u.name}</div>
                                <div className="admin-employee-id">{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                              className="admin-filter-select"
                              style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}
                            >
                              {rolesList.map(r => (
                                <option key={r.id} value={r.roleName}>{r.roleName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="admin-td-dept">{u.dept}</td>
                          <td><span className="admin-status-pill active">Active</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="admin-action-chip"
                              onClick={() => {
                                const nextRoles = rolesList.map(r => r.roleName);
                                const currIdx = nextRoles.indexOf(u.role);
                                const nextRole = nextRoles[(currIdx + 1) % nextRoles.length];
                                handleChangeUserRole(u.id, nextRole);
                              }}
                              title="Cycle to next role"
                            >
                              Change Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Permissions Matrix */}
              {rolesTab === 'Permissions' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Module / Feature</th>
                        <th style={{ textAlign: 'center' }}>Admin</th>
                        <th style={{ textAlign: 'center' }}>HR</th>
                        <th style={{ textAlign: 'center' }}>Manager</th>
                        <th style={{ textAlign: 'center' }}>Employee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsMatrix.map((perm, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{perm.module}</td>
                          {['admin', 'hr', 'mgr', 'emp'].map(roleKey => (
                            <td key={roleKey} style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleTogglePermission(idx, roleKey)}
                                style={{
                                  background: perm[roleKey] ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                                  border: perm[roleKey] ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                                  borderRadius: '6px',
                                  padding: '5px 12px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease'
                                }}
                                title={`Click to toggle ${perm.module} for ${roleKey.toUpperCase()}`}
                              >
                                {perm[roleKey] ? (
                                  <CheckCircle size={15} color="#10b981" />
                                ) : (
                                  <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>—</span>
                                )}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 9: NOTICES & ANNOUNCEMENTS (IMAGE 2 SCREEN 9)
             ================================================================= */}
          {activeModule === 'notices' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Notices & Announcements</h1>
                  <p className="admin-header-desc">Manage circulars, broadcast notifications and official office notices</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => setShowAddNoticeModal(true)}
                >
                  <Plus size={14} />
                  <span>New Notice</span>
                </button>
              </div>

              {/* 4 Tabs: All (10), Important (4), General (4), Holiday (2) */}
              <div className="admin-tabs-row">
                {[
                  { id: 'All', label: 'All', count: noticesList.length },
                  { id: 'Important', label: 'Important', count: noticesList.filter(n => n.type === 'Important').length },
                  { id: 'General', label: 'General', count: noticesList.filter(n => n.type === 'General').length },
                  { id: 'Holiday', label: 'Holiday', count: noticesList.filter(n => n.type === 'Holiday').length }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setNoticesTab(t.id)}
                    className={`admin-tab-btn ${noticesTab === t.id ? 'active' : ''}`}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>

              {/* Notices Table matching Image 2 Screen 9 */}
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noticesList
                      .filter(n => noticesTab === 'All' || n.type === noticesTab)
                      .map((n, idx) => (
                        <tr key={n.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{n.title}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: n.type === 'Holiday' ? 'rgba(239, 68, 68, 0.15)' : n.type === 'Important' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: n.type === 'Holiday' ? '#f87171' : n.type === 'Important' ? '#fbbf24' : '#38bdf8'
                            }}>
                              {n.type}
                            </span>
                          </td>
                          <td className="admin-td-date">{n.date}</td>
                          <td>
                            <span className="admin-status-pill active">{n.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-actions-group">
                              <button
                                className="admin-action-chip"
                                onClick={() => setViewNoticeModal(n)}
                              >
                                View
                              </button>
                              <button
                                className="admin-action-chip"
                                onClick={() => setEditingNoticeModal(n)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 13: SYSTEM SETTINGS (IMAGE 2 SCREEN 13)
             ================================================================= */}
          {activeModule === 'settings' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">System Settings</h1>
                  <p className="admin-header-desc">Platform configurations, organizational parameters and system rules</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={handleSaveSystemSettings}
                >
                  Save Changes
                </button>
              </div>

              {/* 6 Tabs: General, Attendance Rules, Leave Settings, WFH Settings, Notifications, Integrations */}
              <div className="admin-tabs-row">
                {['General', 'Attendance Rules', 'Leave Settings', 'WFH Settings', 'Notifications', 'Integrations'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSystemSettingsTab(tab)}
                    className={`admin-tab-btn ${systemSettingsTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: General Settings (Image 2 Screen 13) */}
              {systemSettingsTab === 'General' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.95fr', gap: '22px' }}>
                  {/* Left Card: General Settings Form */}
                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                      General Settings
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Company Name</label>
                        <input
                          type="text"
                          value={generalSettingsForm.companyName}
                          onChange={(e) => setGeneralSettingsForm({ ...generalSettingsForm, companyName: e.target.value })}
                          className="admin-filter-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Time Zone</label>
                        <select
                          value={generalSettingsForm.timeZone}
                          onChange={(e) => setGeneralSettingsForm({ ...generalSettingsForm, timeZone: e.target.value })}
                          className="admin-select-control"
                          style={{ width: '100%' }}
                        >
                          <option>(GMT+05:30) India Standard Time</option>
                          <option>(GMT+00:00) UTC Universal Time</option>
                          <option>(GMT-05:00) Eastern Standard Time</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Date Format</label>
                          <input
                            type="text"
                            value={generalSettingsForm.dateFormat}
                            onChange={(e) => setGeneralSettingsForm({ ...generalSettingsForm, dateFormat: e.target.value })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Working Days</label>
                          <input
                            type="text"
                            value={generalSettingsForm.workDays}
                            onChange={(e) => setGeneralSettingsForm({ ...generalSettingsForm, workDays: e.target.value })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Default Working Hours</label>
                        <input
                          type="text"
                          value={generalSettingsForm.defaultWorkingHours}
                          onChange={(e) => setGeneralSettingsForm({ ...generalSettingsForm, defaultWorkingHours: e.target.value })}
                          className="admin-filter-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Card: System Preferences Toggles */}
                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                        System Preferences
                      </h3>

                      <div className="admin-switches-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Enable Email Notifications</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={systemPrefs.enableEmailNotifications}
                              onChange={(e) => setSystemPrefs({ ...systemPrefs, enableEmailNotifications: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>

                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Enable SMS Notifications</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={systemPrefs.enableSmsNotifications}
                              onChange={(e) => setSystemPrefs({ ...systemPrefs, enableSmsNotifications: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>

                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Auto Approve (Manager)</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={systemPrefs.autoApproveManager}
                              onChange={(e) => setSystemPrefs({ ...systemPrefs, autoApproveManager: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>

                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Allow Attendance Correction</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={systemPrefs.allowAttendanceCorrection}
                              onChange={(e) => setSystemPrefs({ ...systemPrefs, allowAttendanceCorrection: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>

                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Enable WFH Requests</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={systemPrefs.enableWfhRequests}
                              onChange={(e) => setSystemPrefs({ ...systemPrefs, enableWfhRequests: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSystemSettings}
                      className="admin-btn-primary"
                      style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '10px' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Attendance Rules */}
              {systemSettingsTab === 'Attendance Rules' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.95fr', gap: '22px' }}>
                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                      Shift Timings & Cutoffs
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Shift Start Time</label>
                          <input
                            type="text"
                            value={attendanceRulesSettings.shiftStart}
                            onChange={(e) => setAttendanceRulesSettings({ ...attendanceRulesSettings, shiftStart: e.target.value })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Shift End Time</label>
                          <input
                            type="text"
                            value={attendanceRulesSettings.shiftEnd}
                            onChange={(e) => setAttendanceRulesSettings({ ...attendanceRulesSettings, shiftEnd: e.target.value })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Grace Period</label>
                          <input
                            type="text"
                            value={attendanceRulesSettings.gracePeriod}
                            onChange={(e) => setAttendanceRulesSettings({ ...attendanceRulesSettings, gracePeriod: e.target.value })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Half-Day Threshold</label>
                          <input
                            type="text"
                            value={attendanceRulesSettings.halfDayThreshold}
                            onChange={(e) => setAttendanceRulesSettings({ ...attendanceRulesSettings, halfDayThreshold: e.target.value })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Auto-mark Absent Cutoff</label>
                        <input
                          type="text"
                          value={attendanceRulesSettings.autoMarkAbsent}
                          onChange={(e) => setAttendanceRulesSettings({ ...attendanceRulesSettings, autoMarkAbsent: e.target.value })}
                          className="admin-filter-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                        Geofencing & Biometrics
                      </h3>
                      <div style={{ marginBottom: '14px' }}>
                        <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Office Geofence Radius</label>
                        <input
                          type="text"
                          value={attendanceRulesSettings.geofenceRadius}
                          onChange={(e) => setAttendanceRulesSettings({ ...attendanceRulesSettings, geofenceRadius: e.target.value })}
                          className="admin-filter-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="admin-switches-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Strict Geofence Enforcement</span>
                          <label className="admin-switch-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Selfie / Face Verification on Kiosk</span>
                          <label className="admin-switch-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Allow Biometric Offline Sync</span>
                          <label className="admin-switch-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="admin-slider" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSystemSettings}
                      className="admin-btn-primary"
                      style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '10px' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Leave Settings */}
              {systemSettingsTab === 'Leave Settings' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.95fr', gap: '22px' }}>
                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                      Annual Leave Quotas & Allocation
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Casual Leaves (Annual)</label>
                          <input
                            type="number"
                            value={leaveSettingsForm.casualLeaves}
                            onChange={(e) => setLeaveSettingsForm({ ...leaveSettingsForm, casualLeaves: parseInt(e.target.value) || 0 })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Sick Leaves (Annual)</label>
                          <input
                            type="number"
                            value={leaveSettingsForm.sickLeaves}
                            onChange={(e) => setLeaveSettingsForm({ ...leaveSettingsForm, sickLeaves: parseInt(e.target.value) || 0 })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Earned Leaves (Annual)</label>
                          <input
                            type="number"
                            value={leaveSettingsForm.earnedLeaves}
                            onChange={(e) => setLeaveSettingsForm({ ...leaveSettingsForm, earnedLeaves: parseInt(e.target.value) || 0 })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Carry Forward Limit</label>
                          <input
                            type="number"
                            value={leaveSettingsForm.carryForwardLimit}
                            onChange={(e) => setLeaveSettingsForm({ ...leaveSettingsForm, carryForwardLimit: parseInt(e.target.value) || 0 })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                        Leave Approval Policies
                      </h3>
                      <div className="admin-switches-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Require Manager Approval</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={leaveSettingsForm.requireManagerApproval}
                              onChange={(e) => setLeaveSettingsForm({ ...leaveSettingsForm, requireManagerApproval: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Allow Negative Balance</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={leaveSettingsForm.allowNegativeBalance}
                              onChange={(e) => setLeaveSettingsForm({ ...leaveSettingsForm, allowNegativeBalance: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Require Doctor's Note for &gt; 2 Days Sick Leave</span>
                          <label className="admin-switch-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Auto-escalate pending leaves after 48 hrs</span>
                          <label className="admin-switch-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="admin-slider" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSystemSettings}
                      className="admin-btn-primary"
                      style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '10px' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: WFH Settings */}
              {systemSettingsTab === 'WFH Settings' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.95fr', gap: '22px' }}>
                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                      Remote Work Allocation
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Monthly WFH Quota (Days)</label>
                          <input
                            type="number"
                            value={wfhSettingsForm.monthlyQuota}
                            onChange={(e) => setWfhSettingsForm({ ...wfhSettingsForm, monthlyQuota: parseInt(e.target.value) || 0 })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Min Advance Notice (Hours)</label>
                          <input
                            type="number"
                            value={wfhSettingsForm.minNoticeHours}
                            onChange={(e) => setWfhSettingsForm({ ...wfhSettingsForm, minNoticeHours: parseInt(e.target.value) || 0 })}
                            className="admin-filter-input"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-timing-label" style={{ display: 'block', marginBottom: '6px' }}>Core Collaboration Hours</label>
                        <input
                          type="text"
                          value={wfhSettingsForm.coreHoursText}
                          onChange={(e) => setWfhSettingsForm({ ...wfhSettingsForm, coreHoursText: e.target.value })}
                          className="admin-filter-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                        Remote Security & Compliance
                      </h3>
                      <div className="admin-switches-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Enforce Mandatory Enterprise VPN</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={wfhSettingsForm.mandatoryVpn}
                              onChange={(e) => setWfhSettingsForm({ ...wfhSettingsForm, mandatoryVpn: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Require Core Hours Active Status</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={wfhSettingsForm.requireCoreHours}
                              onChange={(e) => setWfhSettingsForm({ ...wfhSettingsForm, requireCoreHours: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Daily Morning Remote Standup Check-in</span>
                          <label className="admin-switch-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="admin-slider" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSystemSettings}
                      className="admin-btn-primary"
                      style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '10px' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 5: Notifications */}
              {systemSettingsTab === 'Notifications' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.95fr', gap: '22px' }}>
                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                      Notification Channels
                    </h3>
                    <div className="admin-switches-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                        <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Email Notification Gateway</span>
                        <label className="admin-switch-toggle">
                          <input
                            type="checkbox"
                            checked={notificationSettingsForm.emailAlerts}
                            onChange={(e) => setNotificationSettingsForm({ ...notificationSettingsForm, emailAlerts: e.target.checked })}
                          />
                          <span className="admin-slider" />
                        </label>
                      </div>
                      <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                        <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>SMS Gateway Alerts</span>
                        <label className="admin-switch-toggle">
                          <input
                            type="checkbox"
                            checked={notificationSettingsForm.smsAlerts}
                            onChange={(e) => setNotificationSettingsForm({ ...notificationSettingsForm, smsAlerts: e.target.checked })}
                          />
                          <span className="admin-slider" />
                        </label>
                      </div>
                      <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                        <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Push Notifications (Mobile Apps)</span>
                        <label className="admin-switch-toggle">
                          <input
                            type="checkbox"
                            checked={notificationSettingsForm.pushNotifications}
                            onChange={(e) => setNotificationSettingsForm({ ...notificationSettingsForm, pushNotifications: e.target.checked })}
                          />
                          <span className="admin-slider" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                        Alert Delivery Rules
                      </h3>
                      <div className="admin-switches-group" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Daily Morning Attendance Digest</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={notificationSettingsForm.dailyDigest}
                              onChange={(e) => setNotificationSettingsForm({ ...notificationSettingsForm, dailyDigest: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                        <div className="admin-switch-row" style={{ justifyContent: 'space-between' }}>
                          <span className="admin-switch-label" style={{ color: '#cbd5e1' }}>Immediate Leave &amp; WFH Request Emails</span>
                          <label className="admin-switch-toggle">
                            <input
                              type="checkbox"
                              checked={notificationSettingsForm.leaveApprovalEmail}
                              onChange={(e) => setNotificationSettingsForm({ ...notificationSettingsForm, leaveApprovalEmail: e.target.checked })}
                            />
                            <span className="admin-slider" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSystemSettings}
                      className="admin-btn-primary"
                      style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '10px' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 6: Integrations (Image 1 Screen 13) */}
              {systemSettingsTab === 'Integrations' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                    {integrationsSettings.map(integ => (
                      <div
                        key={integ.id}
                        className="admin-table-card"
                        style={{
                          padding: '22px',
                          background: '#0d1527',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: integ.connected ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '12px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>{integ.name}</h4>
                            </div>
                            <span style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              background: integ.connected ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                              color: integ.connected ? '#10b981' : '#f87171',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: integ.connected ? '#10b981' : '#f87171' }} />
                              {integ.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                            {integ.desc}
                          </p>

                          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.74rem', color: '#64748b', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <span>Target: <strong style={{ color: '#cbd5e1' }}>{integ.channel}</strong></span>
                            <span>Sync: <strong style={{ color: '#38bdf8' }}>{integ.syncFreq}</strong></span>
                            <span>Status: <strong style={{ color: integ.connected ? '#10b981' : '#f87171' }}>{integ.lastSync}</strong></span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {integ.connected ? 'Sync: Real-time API Webhook' : 'Sync: Inactive'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {integ.connected && (
                              <button
                                type="button"
                                onClick={() => handleTestIntegrationPing(integ)}
                                className="admin-btn-action"
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                title="Verify live webhook endpoint status"
                              >
                                Test Ping
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenConfigureIntegration(integ)}
                              className="admin-btn-action"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'rgba(56,189,248,0.4)', color: '#38bdf8' }}
                            >
                              Configure
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIntegrationsSettings(prev => prev.map(item => item.id === integ.id ? { ...item, connected: !item.connected, lastSync: !item.connected ? 'Connected just now' : 'Inactive' } : item));
                                triggerAdminToast(`✓ ${integ.name} ${integ.connected ? 'disconnected' : 'connected successfully'}!`);
                              }}
                              className={integ.connected ? 'admin-btn-action' : 'admin-btn-primary'}
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                              {integ.connected ? 'Disconnect' : 'Connect'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 14: AUDIT LOGS (IMAGE 2 SCREEN 14)
             ================================================================= */}
          {activeModule === 'audit_logs' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Audit Logs</h1>
                  <p className="admin-header-desc">Chronological trail of administrative, policy and security changes</p>
                </div>
                <button
                  className="admin-btn-action"
                  onClick={handleExportAuditLogs}
                  title="Download Audit Logs Trail CSV Report"
                >
                  <Download size={14} />
                  <span>Export Report</span>
                </button>
              </div>

              {/* Filters Bar matching Image 2 Screen 14 */}
              <div className="admin-filters-bar">
                <select
                  value={auditModuleFilter}
                  onChange={(e) => setAuditModuleFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Modules</option>
                  <option value="Company Policies">Company Policies</option>
                  <option value="WFH Requests">WFH Requests</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Profile">Profile</option>
                  <option value="Employees">Employees</option>
                </select>

                <select
                  value={auditUserFilter}
                  onChange={(e) => setAuditUserFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="All">All Users</option>
                  <option value="Rahul Verma">Rahul Verma</option>
                  <option value="Amit Kumar">Amit Kumar</option>
                  <option value="Pooja Yadav">Pooja Yadav</option>
                  <option value="Admin">Admin</option>
                </select>

                <div
                  className="admin-select-date"
                  onClick={() => { setDateFilterTarget('audit'); setShowDateRangeModal(true); }}
                  title="Click to select date range"
                >
                  <Calendar size={13} color="#38bdf8" />
                  <span>{auditDateRangeLabel || '14 Oct 2026 - 16 Oct 2026'}</span>
                </div>
              </div>

              {/* Audit Table matching Image 2 Screen 14 */}
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Module</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogsData
                      .filter(l => auditModuleFilter === 'All' || l.module === auditModuleFilter)
                      .filter(l => auditUserFilter === 'All' || l.user.includes(auditUserFilter))
                      .filter(l => {
                        if (!auditDateRangeFilter) return true;
                        if (auditDateRangeFilter.preset === 'Today') return l.dateTime.includes('14 Oct 2026');
                        if (auditDateRangeFilter.preset === 'Yesterday') return l.dateTime.includes('13 Oct 2026');
                        if (auditDateRangeFilter.preset === 'This Week' || auditDateRangeFilter.preset === 'This Month' || auditDateRangeFilter.preset === 'Last 30 Days') return l.dateTime.includes('Oct 2026');
                        if (auditDateRangeFilter.preset === 'Custom' && auditDateRangeFilter.start) return true;
                        return true;
                      })
                      .map((log, idx) => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedAuditLog(log)}
                          style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                          title="Click row to inspect security trail payload"
                          className="admin-clickable-row"
                        >
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{log.user}</td>
                          <td style={{ color: '#cbd5e1' }}>{log.action}</td>
                          <td>
                            <span style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                              {log.module}
                            </span>
                          </td>
                          <td className="admin-td-date">{log.dateTime}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* =================================================================
              SCREEN 4: MARK ATTENDANCE (CHECK IN/OUT) - DUAL QR + MANUAL
             ================================================================= */}
          {activeModule === 'mark-attendance' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Mark Attendance</h1>
                  <p className="admin-header-desc">Kiosk QR code check-in and administrative manual entry</p>
                </div>
                <button
                  className="admin-btn-action"
                  onClick={() => setActiveModule('attendance')}
                  style={{ gap: '6px', fontSize: '0.8rem' }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Attendance Records</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
                {/* Left: Dual Mode Attendance Card (Screenshot 2) */}
                <div className="admin-table-card" style={{ padding: '26px', background: '#0d1527', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: '100%', display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '3px', marginBottom: '18px' }}>
                    <button
                      onClick={() => setAttendanceCardMode('qr')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        background: attendanceCardMode === 'qr' ? '#2563eb' : 'transparent',
                        color: attendanceCardMode === 'qr' ? '#ffffff' : '#94a3b8',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      QR Code
                    </button>
                    <button
                      onClick={() => setAttendanceCardMode('kiosk')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        background: attendanceCardMode === 'kiosk' ? '#2563eb' : 'transparent',
                        color: attendanceCardMode === 'kiosk' ? '#ffffff' : '#94a3b8',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Kiosk Mode
                    </button>
                  </div>

                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>
                    {liveClock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px', fontWeight: 500 }}>
                    {liveClock.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>

                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    background: punchStatus === 'Checked In' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: punchStatus === 'Checked In' ? '#10b981' : '#f87171',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '16px'
                  }}>
                    ● {punchStatus === 'Checked In' ? 'Present' : 'Checked Out'}
                  </span>

                  {/* QR Box Mode */}
                  {attendanceCardMode === 'qr' ? (
                    <>
                      <div style={{ width: '160px', height: '160px', background: '#ffffff', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: '2px dashed #38bdf8', position: 'relative' }}>
                        <svg viewBox="0 0 100 100" width="100%" height="100%">
                          <rect width="100" height="100" fill="#ffffff" />
                          <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                          <rect x="15" y="15" width="14" height="14" fill="#ffffff" rx="2" />
                          <rect x="19" y="19" width="6" height="6" fill="#2563eb" />
                          <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                          <rect x="71" y="15" width="14" height="14" fill="#ffffff" rx="2" />
                          <rect x="75" y="19" width="6" height="6" fill="#2563eb" />
                          <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="3" />
                          <rect x="15" y="71" width="14" height="14" fill="#ffffff" rx="2" />
                          <rect x="19" y="75" width="6" height="6" fill="#2563eb" />
                          <circle cx="50" cy="50" r="12" fill="#2563eb" />
                          <text x="50" y="54" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">WX</text>
                        </svg>
                      </div>

                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                        Scan this QR code to mark attendance
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Code: <strong style={{ color: '#38bdf8' }}>{qrCodeToken}</strong> • GPS Verified</span>
                        <button
                          onClick={handleRegenerateQR}
                          style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px', display: 'inline-flex', alignItems: 'center' }}
                          title="Regenerate QR token"
                        >
                          <RefreshCw size={11} />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Kiosk Terminal Keypad Mode */
                    <div style={{ width: '100%', maxWidth: '240px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px', textAlign: 'left' }}>Select Employee / Enter PIN:</div>
                      <select
                        value={kioskSelectedEmpId}
                        onChange={(e) => setKioskSelectedEmpId(e.target.value)}
                        className="admin-filter-select"
                        style={{ width: '100%', marginBottom: '10px', fontSize: '0.76rem' }}
                      >
                        {employees.map(e => (
                          <option key={e.id} value={e.id}>{e.id} - {e.name}</option>
                        ))}
                      </select>

                      <div style={{ height: '36px', background: '#070b14', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '4px', color: '#38bdf8', marginBottom: '10px' }}>
                        {kioskPinInput ? kioskPinInput.replace(/./g, '●') : 'ENTER PIN'}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map(key => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleKioskKey(key)}
                            style={{
                              padding: '8px',
                              background: key === 'OK' ? '#059669' : key === 'C' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '6px',
                              color: key === 'OK' ? '#ffffff' : key === 'C' ? '#f87171' : '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: 'pointer'
                            }}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '16px' }}>
                    <button
                      className="admin-btn-primary"
                      onClick={handlePunchCheckIn}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        background: punchStatus === 'Checked In' ? '#059669' : '#1e293b',
                        border: punchStatus === 'Checked In' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: punchStatus === 'Checked In' ? '0 0 15px rgba(16,185,129,0.3)' : 'none',
                        cursor: 'pointer'
                      }}
                      title="Mark Checked In"
                    >
                      <Check size={14} />
                      <span>Checked In</span>
                    </button>
                    <button
                      className="admin-btn-secondary"
                      onClick={handlePunchCheckOut}
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        background: punchStatus === 'Checked Out' ? 'rgba(239,68,68,0.2)' : 'transparent',
                        borderColor: punchStatus === 'Checked Out' ? '#ef4444' : 'rgba(255,255,255,0.15)',
                        color: punchStatus === 'Checked Out' ? '#f87171' : '#cbd5e1',
                        cursor: 'pointer'
                      }}
                      title="Punch Check Out"
                    >
                      <LogOut size={14} />
                      <span>Check Out</span>
                    </button>
                  </div>
                </div>

                {/* Right: Manual Entry Form */}
                <div className="admin-table-card" style={{ padding: '26px', background: '#0d1527' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                    Manual Entry
                  </h3>

                  <form onSubmit={(e) => { e.preventDefault(); triggerAdminToast('✓ Manual attendance entry logged successfully!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="admin-field-label">Employee</label>
                      <select className="admin-form-input">
                        <option>EMP001 - Neha Singh (Software Developer)</option>
                        <option>EMP005 - Rohit Sharma (Product Designer)</option>
                        <option>EMP012 - Pooja Yadav (HR Executive)</option>
                        <option>EMP018 - Amit Kumar (Operations Manager)</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="admin-field-label">Check-In Time</label>
                        <input type="time" defaultValue="09:05" className="admin-form-input" />
                      </div>
                      <div>
                        <label className="admin-field-label">Check-Out Time</label>
                        <input type="time" defaultValue="18:00" className="admin-form-input" />
                      </div>
                    </div>

                    <div>
                      <label className="admin-field-label">Location (Optional)</label>
                      <input type="text" defaultValue="Office - Lucknow HQ" className="admin-form-input" />
                    </div>

                    <div>
                      <label className="admin-field-label">Remarks (Optional)</label>
                      <textarea rows={3} placeholder="Enter remarks..." className="admin-form-input" style={{ height: 'auto' }} />
                    </div>

                    <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      Submit Manual Attendance
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 6: APPLY WFH (NEW REQUEST)
             ================================================================= */}
          {activeModule === 'apply-wfh' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Apply for Work From Home</h1>
                  <p className="admin-header-desc">Submit new WFH application on behalf of an employee</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.85fr', gap: '22px' }}>
                <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                  <form onSubmit={(e) => { e.preventDefault(); triggerAdminToast('✓ WFH application submitted for approval!'); setActiveModule('wfh'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="admin-field-label">From Date</label>
                        <input type="date" defaultValue="2026-10-14" className="admin-form-input" required />
                      </div>
                      <div>
                        <label className="admin-field-label">To Date</label>
                        <input type="date" defaultValue="2026-10-16" className="admin-form-input" required />
                      </div>
                    </div>

                    <div>
                      <label className="admin-field-label">Reason</label>
                      <select className="admin-form-input">
                        <option>Client Meeting</option>
                        <option>Personal Work</option>
                        <option>Health Reason</option>
                        <option>Official Remote Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-field-label">Description</label>
                      <textarea rows={4} placeholder="Enter detailed reason..." className="admin-form-input" style={{ height: 'auto' }} />
                    </div>

                    <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      Submit Request
                    </button>
                  </form>
                </div>

                <div>
                  <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527', textAlign: 'center', marginBottom: '16px' }}>
                    <img src="/employee_hero.jpg" alt="WFH" style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: '10px' }} />
                  </div>

                  <div className="admin-table-card" style={{ padding: '18px', background: '#0d1527', borderLeft: '4px solid #38bdf8' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8', margin: '0 0 8px 0' }}>WFH Guidelines</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
                      <li>Submit request at least 1 day before</li>
                      <li>Approval subject to manager's confirmation</li>
                      <li>Use official communication tools</li>
                      <li>Maintain productivity and availability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 8: APPLY LEAVE (NEW REQUEST)
             ================================================================= */}
          {activeModule === 'apply-leave' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Apply for Leave</h1>
                  <p className="admin-header-desc">Submit new leave request on behalf of an employee</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.85fr', gap: '22px' }}>
                <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                  <form onSubmit={(e) => { e.preventDefault(); triggerAdminToast('✓ Leave request submitted successfully!'); setActiveModule('leaves'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="admin-field-label">Leave Type</label>
                      <select className="admin-form-input">
                        <option>Casual Leave</option>
                        <option>Sick Leave</option>
                        <option>Earned Leave</option>
                        <option>Compensatory Off</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="admin-field-label">From Date</label>
                        <input type="date" defaultValue="2026-10-14" className="admin-form-input" required />
                      </div>
                      <div>
                        <label className="admin-field-label">To Date</label>
                        <input type="date" defaultValue="2026-10-16" className="admin-form-input" required />
                      </div>
                    </div>

                    <div>
                      <label className="admin-field-label">Description</label>
                      <textarea rows={4} placeholder="Enter detailed reason..." className="admin-form-input" style={{ height: 'auto' }} />
                    </div>

                    <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      Submit Request
                    </button>
                  </form>
                </div>

                <div>
                  <div className="admin-table-card" style={{ padding: '20px', background: '#0d1527', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', margin: '0 0 12px 0' }}>Leave Balance</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Casual Leave</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>12 days</div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sick Leave</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>5 days</div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Earned Leave</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>8 days</div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Compensatory Off</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>2 days</div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '16px', background: '#0d1527', borderLeft: '4px solid #a855f7' }}>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      <strong>Note:</strong> Approval is subject to manager's confirmation and company policy.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 11: TEAM CALENDAR (IMAGE 2 SCREEN 11)
             ================================================================= */}
          {activeModule === 'calendar' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Team Calendar</h1>
                  <p className="admin-header-desc">View and schedule company events, meetings, and reviews</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '3px' }}>
                    {['Month', 'Week', 'Day'].map(view => (
                      <button
                        key={view}
                        onClick={() => setAdminCalView(view)}
                        style={{
                          padding: '4px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          background: adminCalView === view ? '#2563eb' : 'transparent',
                          color: adminCalView === view ? '#ffffff' : '#94a3b8',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {view}
                      </button>
                    ))}
                  </div>

                  <button
                    className="admin-btn-primary"
                    onClick={() => setShowAddEventModal(true)}
                  >
                    <Plus size={14} />
                    <span>Add Event</span>
                  </button>
                </div>
              </div>

              {/* Calendar Grid + Upcoming Events Side by Side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '22px' }}>
                {/* Left: Dynamic Calendar View based on adminCalView */}
                <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                  {/* Calendar Top Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button className="admin-icon-btn"><ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                        {adminCalView === 'Month' && 'October 2026'}
                        {adminCalView === 'Week' && 'Week 43: 19 Oct - 25 Oct 2026'}
                        {adminCalView === 'Day' && 'Thursday, 22 Oct 2026'}
                      </span>
                      <button className="admin-icon-btn"><ChevronRight size={18} /></button>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} /> Meeting</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Review</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Holiday</span>
                    </div>
                  </div>

                  {/* VIEW 1: MONTH VIEW (7x5 Grid) */}
                  {adminCalView === 'Month' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                        {Array.from({ length: 35 }, (_, i) => {
                          const day = i - 3;
                          const isCurrent = day >= 1 && day <= 31;
                          const hasMeeting = day === 7 || day === 16;
                          const hasHoliday = day === 24;
                          const hasReview = day === 18;
                          const hasTraining = day === 21;
                          const isToday = day === 22;

                          return (
                            <div
                              key={i}
                              onClick={() => {
                                if (isCurrent) {
                                  setNewEventForm({
                                    title: '',
                                    date: `2026-10-${String(day).padStart(2, '0')}`,
                                    time: '11:00 AM - 12:00 PM',
                                    tag: 'Meeting'
                                  });
                                  setShowAddEventModal(true);
                                }
                              }}
                              style={{
                                minHeight: '68px',
                                padding: '6px',
                                borderRadius: '8px',
                                background: isToday ? 'rgba(56,189,248,0.08)' : isCurrent ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                                border: isToday ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                color: isCurrent ? '#ffffff' : '#475569',
                                cursor: isCurrent ? 'pointer' : 'default',
                                transition: 'all 0.15s ease'
                              }}
                              title={isCurrent ? `Click to schedule an event on ${day} Oct 2026` : ''}
                            >
                              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: isToday ? '#38bdf8' : isCurrent ? '#ffffff' : '#475569' }}>
                                {isCurrent ? day : ''} {isToday && '•'}
                              </span>
                              {hasMeeting && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, padding: '2px 4px', borderRadius: '4px', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', marginTop: '3px' }}>
                                  Team Meet
                                </span>
                              )}
                              {hasReview && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, padding: '2px 4px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10b981', marginTop: '3px' }}>
                                  Review
                                </span>
                              )}
                              {hasTraining && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, padding: '2px 4px', borderRadius: '4px', background: 'rgba(192,132,252,0.2)', color: '#c084fc', marginTop: '3px' }}>
                                  Training
                                </span>
                              )}
                              {hasHoliday && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, padding: '2px 4px', borderRadius: '4px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', marginTop: '3px' }}>
                                  Diwali
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* VIEW 2: WEEK VIEW (7 Column Schedule) */}
                  {adminCalView === 'Week' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center' }}>
                        {[
                          { d: 'Mon', num: 19 },
                          { d: 'Tue', num: 20 },
                          { d: 'Wed', num: 21 },
                          { d: 'Thu', num: 22, today: true },
                          { d: 'Fri', num: 23 },
                          { d: 'Sat', num: 24, holiday: true },
                          { d: 'Sun', num: 25 }
                        ].map(col => (
                          <div
                            key={col.num}
                            style={{
                              padding: '8px 4px',
                              borderRadius: '8px',
                              background: col.today ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.03)',
                              border: col.today ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)'
                            }}
                          >
                            <div style={{ fontSize: '0.72rem', color: col.today ? '#38bdf8' : '#94a3b8', fontWeight: 700 }}>{col.d}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: col.holiday ? '#f87171' : '#ffffff' }}>{col.num}</div>
                          </div>
                        ))}
                      </div>

                      {/* Hourly slots */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { time: '09:00 AM', mon: 'Morning Standup', wed: 'Sprint Sync', thu: 'Attendance Check' },
                          { time: '11:00 AM', tue: 'Client Demo', fri: 'Tech Architecture' },
                          { time: '01:00 PM', all: 'Lunch & Break Window' },
                          { time: '03:00 PM', wed: 'Policy Training Session (HR)', thu: 'Engineering 1:1s' },
                          { time: '05:00 PM', sat: 'Diwali Eve Celebrations' }
                        ].map((slot, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '68px repeat(7, 1fr)', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>{slot.time}</span>
                            {Array.from({ length: 7 }, (_, colIdx) => {
                              const dayNum = 19 + colIdx;
                              let label = null;
                              let bg = 'rgba(255,255,255,0.02)';
                              let color = '#cbd5e1';

                              if (colIdx === 0 && slot.mon) { label = slot.mon; bg = 'rgba(56,189,248,0.15)'; color = '#38bdf8'; }
                              if (colIdx === 1 && slot.tue) { label = slot.tue; bg = 'rgba(168,85,247,0.15)'; color = '#c084fc'; }
                              if (colIdx === 2 && slot.wed) { label = slot.wed; bg = 'rgba(16,185,129,0.15)'; color = '#10b981'; }
                              if (colIdx === 3 && slot.thu) { label = slot.thu; bg = 'rgba(56,189,248,0.2)'; color = '#38bdf8'; }
                              if (colIdx === 4 && slot.fri) { label = slot.fri; bg = 'rgba(245,158,11,0.15)'; color = '#fbbf24'; }
                              if (colIdx === 5 && slot.sat) { label = slot.sat; bg = 'rgba(239,68,68,0.15)'; color = '#f87171'; }
                              if (slot.all) { label = slot.all; bg = 'rgba(255,255,255,0.04)'; color = '#94a3b8'; }

                              return (
                                <div
                                  key={colIdx}
                                  onClick={() => {
                                    setNewEventForm({
                                      title: label || 'Team Sync',
                                      date: `2026-10-${dayNum}`,
                                      time: slot.time,
                                      tag: colIdx === 5 ? 'Holiday' : 'Meeting'
                                    });
                                    setShowAddEventModal(true);
                                  }}
                                  style={{
                                    minHeight: '44px',
                                    padding: '4px',
                                    borderRadius: '6px',
                                    background: bg,
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    fontSize: '0.62rem',
                                    fontWeight: 700,
                                    color,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    lineHeight: 1.2
                                  }}
                                  title="Click to add or edit event"
                                >
                                  {label || '+'}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: DAY VIEW (Hour-by-Hour Timeline) */}
                  {adminCalView === 'Day' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.08)', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Today's Agenda • 22 October 2026</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>5 scheduled events and attendance check-in checkpoints</div>
                        </div>
                        <button
                          className="admin-btn-primary"
                          onClick={() => {
                            setNewEventForm({ title: '', date: '2026-10-22', time: '02:00 PM - 03:00 PM', tag: 'Meeting' });
                            setShowAddEventModal(true);
                          }}
                          style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                        >
                          <Plus size={13} /> Add Day Event
                        </button>
                      </div>

                      {[
                        { time: '09:00 AM', title: 'General Shift Clock-in Deadline', type: 'System', color: '#10b981', desc: 'Automatic geofence verification begins for all campus gates.' },
                        { time: '10:00 AM - 11:00 AM', title: 'Monthly Team Meeting', type: 'Meeting', color: '#38bdf8', desc: 'Auditorium A & Google Meet link with all Department Leads.' },
                        { time: '01:00 PM - 02:00 PM', title: 'Cafeteria Executive Lunch', type: 'Break', color: '#94a3b8', desc: 'Organic Salad Bar opening at Lucknow HQ 3rd floor.' },
                        { time: '03:00 PM - 04:30 PM', title: 'Policy Training Session', type: 'Training', color: '#c084fc', desc: 'Mandatory HR security and leave compliance review.' },
                        { time: '06:00 PM', title: 'Shift Departure & Evening Report', type: 'Operations', color: '#fbbf24', desc: 'Nightly biometric sync and kiosk punch audit.' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '14px', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: item.color, display: 'flex', alignItems: 'center' }}>
                            {item.time}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>{item.title}</span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: item.color }}>
                                {item.type}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Upcoming Events Panel matching Image 2 Screen 11 */}
                <div className="admin-table-card" style={{ padding: '22px', background: '#0d1527' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Upcoming Events</h3>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                      {calendarEvents.length} Scheduled
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {calendarEvents.map((ev) => (
                      <div key={ev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 800, lineHeight: 1 }}>
                            <span style={{ fontSize: '0.9rem' }}>{ev.day}</span>
                            <span style={{ fontSize: '0.58rem', opacity: 0.8 }}>{ev.mon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{ev.title}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{ev.sub}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: ev.tagBg, color: ev.tagColor }}>
                            {ev.tag}
                          </span>
                          <button
                            onClick={() => handleDeleteCalendarEvent(ev.id)}
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'inline-flex', alignItems: 'center' }}
                            title="Remove event"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 12: PROFILE MANAGEMENT (IMAGE 2 SCREEN 12)
             ================================================================= */}
          {activeModule === 'profile' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Profile Management (Employee View)</h1>
                  <p className="admin-header-desc">Manage employee identity, contact info and HR profile records</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => {
                    setProfileEditForm({
                      name: currentUser.name,
                      role: currentUser.role,
                      email: currentUser.email,
                      avatar: currentUser.avatar
                    });
                    setShowEditProfileModal(true);
                  }}
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* 2-Column Layout matching Image 2 Screen 12 */}
              <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.35fr', gap: '22px' }}>
                {/* Left Column: Avatar & Vertical Navigation Tabs */}
                <div className="admin-table-card" style={{ padding: '26px', background: '#0d1527', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #38bdf8', marginBottom: '14px', boxShadow: '0 0 25px rgba(56,189,248,0.25)' }}
                  />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0' }}>{currentUser.name}</h2>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>{currentUser.role}</div>

                  {/* Vertical Tabs matching Image 2 Screen 12 */}
                  <div style={{ width: '100%', marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['Personal Details', 'Work Details', 'Salary', 'Documents', 'Attendance Summary'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setProfileNavTab(tab)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          textAlign: 'left',
                          borderRadius: '8px',
                          border: 'none',
                          background: profileNavTab === tab ? '#2563eb' : 'transparent',
                          color: profileNavTab === tab ? '#ffffff' : '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: profileNavTab === tab ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column: Subtabs + Detail Fields Grid */}
                <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                  {profileNavTab === 'Personal Details' && (
                    <>
                      {/* Top Subtabs matching Image 2 Screen 12 */}
                      <div className="admin-tabs-row" style={{ marginBottom: '22px' }}>
                        {['Personal Details', 'Contact Details', 'Emergency Contact'].map(sub => (
                          <button
                            key={sub}
                            onClick={() => setProfileSubTab(sub)}
                            className={`admin-tab-btn ${profileSubTab === sub ? 'active' : ''}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>

                      {profileSubTab === 'Personal Details' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Full Name</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.name}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Employee ID</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>{currentUser.id || 'EMP001'}</div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Role / Designation</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.role}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Date of Birth</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.dob || '14 Oct 1990'}</div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Gender</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.gender || 'Male'}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Marital Status</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Married</div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Blood Group</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>O+ Positive</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Nationality</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Indian</div>
                          </div>
                        </div>
                      )}

                      {profileSubTab === 'Contact Details' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Official Email</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>{currentUser.email}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Personal Email</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com</div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Mobile Phone</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.phone || '+91 9876543210'}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Desk Extension</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Ext. 402 (Floor 4)</div>
                          </div>

                          <div style={{ gridColumn: 'span 2' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Current Address</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.address || 'Lucknow, Uttar Pradesh'}</div>
                          </div>

                          <div style={{ gridColumn: 'span 2' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Permanent Address</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1' }}>Plot 14, Cyber City Greens, Gomti Nagar Extension, Lucknow - 226010</div>
                          </div>
                        </div>
                      )}

                      {profileSubTab === 'Emergency Contact' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Contact Person Name</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.emergencyContact?.name || 'Priya Verma'}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Relationship</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>{currentUser.emergencyContact?.relationship || 'Spouse'}</div>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Emergency Phone Number</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>{currentUser.emergencyContact?.phone || '+91 9876543299'}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Alternate Emergency Phone</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>+91 9415012399</div>
                          </div>

                          <div style={{ gridColumn: 'span 2' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>City &amp; Hospital Preference</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.emergencyContact?.city || 'Lucknow, UP'} • Medanta Super Specialty Hospital</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {profileNavTab === 'Work Details' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Work &amp; Organization Details</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Department</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Human Resources &amp; Administration</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Designation</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8' }}>{currentUser.role}</div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Reporting Manager</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Board of Directors &amp; CEO</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Joining Date</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>01 Jan 2024 (Active 2+ Years)</div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Employment Type</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981' }}>Full-Time Permanent</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Base Location</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>VorldX Lucknow HQ Campus (Cyber City)</div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Shift Timing</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>General Shift (09:00 AM - 06:00 PM)</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '3px' }}>Security Clearance</span>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#a855f7' }}>Level 5 • Super Admin Access</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {profileNavTab === 'Salary' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Compensation &amp; Payroll Summary</h3>
                        <button
                          className="admin-btn-primary"
                          onClick={() => triggerAdminToast('✓ Official salary slip PDF generated and downloaded!')}
                          style={{ fontSize: '0.8rem', gap: '6px' }}
                        >
                          <Download size={14} />
                          <span>Download Payslip</span>
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>ANNUAL CTC</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>₹24,00,000</div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Band L2 Executive</span>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>MONTHLY GROSS</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>₹2,00,000</div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pre-tax earnings</span>
                        </div>
                        <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                          <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700 }}>NET TAKE HOME</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>₹1,85,600</div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>After PF &amp; deductions</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.84rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                          <span style={{ color: '#94a3b8' }}>Basic Pay</span>
                          <span style={{ color: '#ffffff', fontWeight: 700 }}>₹1,20,000</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                          <span style={{ color: '#94a3b8' }}>House Rent Allowance (HRA)</span>
                          <span style={{ color: '#ffffff', fontWeight: 700 }}>₹48,000</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                          <span style={{ color: '#94a3b8' }}>Special Allowance</span>
                          <span style={{ color: '#ffffff', fontWeight: 700 }}>₹32,000</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px' }}>
                          <span style={{ color: '#f87171' }}>Provident Fund (PF)</span>
                          <span style={{ color: '#f87171', fontWeight: 700 }}>-₹14,400</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {profileNavTab === 'Documents' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Verified Employee Documents</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                          { name: 'National Identity (Aadhaar Card)', docId: 'AADHAAR-8902-XXXX', size: '1.4 MB', date: 'Verified 10 Jan 2024' },
                          { name: 'Permanent Account Number (PAN)', docId: 'ABCDE1234F', size: '920 KB', date: 'Verified 10 Jan 2024' },
                          { name: 'Offer Letter & Executive Agreement', docId: 'DOC-OFFER-2024', size: '2.8 MB', date: 'Digitally Signed' },
                          { name: 'Corporate NDA & IP Assignment', docId: 'DOC-NDA-WX-991', size: '1.9 MB', date: 'Legally Executed' }
                        ].map((doc, idx) => (
                          <div key={idx} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>{doc.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>{doc.docId} • {doc.size}</div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', display: 'inline-block', marginTop: '4px' }}>● {doc.date}</span>
                            </div>
                            <button
                              className="admin-btn-action"
                              onClick={() => triggerAdminToast(`✓ Downloading ${doc.name}...`)}
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            >
                              <Download size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profileNavTab === 'Attendance Summary' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Personal Attendance Records &amp; Punctuality</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>DAYS PRESENT</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>20</div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>100% On-time</span>
                        </div>
                        <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>WFH DAYS</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>2</div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Authorized remote</span>
                        </div>
                        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}>LEAVES TAKEN</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>0</div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Full availability</span>
                        </div>
                        <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.2)', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 700 }}>AVG HOURS</span>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>9.1h</div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Per day working</span>
                        </div>
                      </div>

                      <div style={{ padding: '14px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>Punctuality &amp; Biometric Standing</div>
                          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '2px' }}>Zero tardiness recorded in October 2026. Biometric trust score: 100/100.</div>
                        </div>
                        <span className="admin-status-pill active">Exemplary Standing</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SCREEN 15: HELP & SUPPORT (IMAGE 2 SCREEN 15)
             ================================================================= */}
          {activeModule === 'help' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">Help & Support</h1>
                  <p className="admin-header-desc">Manage employee tickets, system issues and HR inquiries</p>
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => setShowSupportModal(true)}
                >
                  <Plus size={14} />
                  <span>Raise Ticket</span>
                </button>
              </div>

              {/* 3 Tabs: Support Tickets, FAQ, Contact HR (Screenshot 2) */}
              <div className="admin-tabs-row">
                {['Support Tickets', 'FAQ', 'Contact HR'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHelpTicketsTab(tab)}
                    className={`admin-tab-btn ${helpTicketsTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Support Tickets Table matching Screenshot 2 */}
              {helpTicketsTab === 'Support Tickets' && (
                <div className="admin-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}>#</th>
                        <th>Subject</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created On</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTicketsList.map((t, idx) => (
                        <tr key={t.id}>
                          <td className="admin-td-num">{idx + 1}</td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{t.subject}</td>
                          <td className="admin-td-dept">{t.category}</td>
                          <td>
                            <span className={`admin-status-pill ${t.status === 'Open' ? 'active' : t.status === 'Resolved' ? 'active' : 'inactive'}`} style={{
                              background: t.status === 'Open' ? 'rgba(56, 189, 248, 0.15)' : t.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                              color: t.status === 'Open' ? '#38bdf8' : t.status === 'Resolved' ? '#10b981' : '#94a3b8'
                            }}>
                              {t.status}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: t.priority === 'High' || t.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.15)' : t.priority === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: t.priority === 'High' || t.priority === 'Urgent' ? '#f87171' : t.priority === 'Medium' ? '#fbbf24' : '#10b981'
                            }}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="admin-td-date">{t.createdOn}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="admin-action-chip"
                              onClick={() => setSelectedSupportTicket(t)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FAQ Tab: Interactive Search & Expandable Accordions */}
              {helpTicketsTab === 'FAQ' && (
                <div className="admin-table-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', gap: '14px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>Frequently Asked Questions</h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Quick solutions for common employee & system inquiries</p>
                    </div>
                    <div style={{ position: 'relative', width: '280px' }}>
                      <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        placeholder="Search answers..."
                        className="admin-form-input"
                        style={{ paddingLeft: '32px', height: '34px', fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 0, q: 'How do I mark daily attendance?', a: 'You can check in using the QR code scanner at any office kiosk or through the VorldX mobile app within the office geofence. Alternatively, punch in using the dual-mode Kiosk in your portal.' },
                      { id: 1, q: 'How can I apply for WFH or Leave?', a: 'Navigate to WFH Requests or Leave Requests in the side navigation, click the "+ New Request" button, pick your dates, provide a brief reason and submit for approval.' },
                      { id: 2, q: 'What is the attendance grace period?', a: 'Standard grace period is 15 minutes past 09:00 AM. Arriving between 09:01 AM and 09:15 AM is permissible. Check-ins after 09:15 AM are logged as Late Mark.' },
                      { id: 3, q: 'Who approves my leave and WFH requests?', a: 'Your direct reporting manager reviews and approves your requests. In their absence, HR Operations will review and escalate urgent requests within 24 hours.' },
                      { id: 4, q: 'How do I request an attendance correction if kiosk scan fails?', a: 'Go to Attendance module, click "Request Attendance Correction", specify the date, time of missed punch, and select the terminal error or reason.' },
                      { id: 5, q: 'Can I check in from home when working remotely?', a: 'Yes. If your WFH request is approved for the day, the portal enables the Remote Web Clock-in with verified IP geofencing.' }
                    ]
                      .filter(item => !faqSearchQuery || item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || item.a.toLowerCase().includes(faqSearchQuery.toLowerCase()))
                      .map((item, i) => {
                        const isExpanded = faqExpandedIndex === item.id;
                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '14px 18px',
                              background: isExpanded ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.02)',
                              borderRadius: '10px',
                              border: isExpanded ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(255,255,255,0.05)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div
                              onClick={() => setFaqExpandedIndex(isExpanded ? null : item.id)}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            >
                              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>{item.q}</div>
                              <ChevronDown size={16} color={isExpanded ? '#38bdf8' : '#64748b'} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                            </div>
                            {isExpanded && (
                              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 10px 0' }}>{item.a}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.74rem', color: '#64748b' }}>
                                  <span>Was this helpful?</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFaqHelpfulVotes(prev => ({ ...prev, [item.id]: 'yes' }));
                                      triggerAdminToast('✓ Thank you for your feedback!');
                                    }}
                                    className="admin-btn-action"
                                    style={{ padding: '2px 8px', fontSize: '0.72rem', background: faqHelpfulVotes[item.id] === 'yes' ? 'rgba(16,185,129,0.2)' : undefined, color: faqHelpfulVotes[item.id] === 'yes' ? '#10b981' : undefined }}
                                  >
                                    <ThumbsUp size={12} /> Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFaqHelpfulVotes(prev => ({ ...prev, [item.id]: 'no' }));
                                      triggerAdminToast('✓ We will improve this article.');
                                    }}
                                    className="admin-btn-action"
                                    style={{ padding: '2px 8px', fontSize: '0.72rem', background: faqHelpfulVotes[item.id] === 'no' ? 'rgba(239,68,68,0.2)' : undefined, color: faqHelpfulVotes[item.id] === 'no' ? '#f87171' : undefined }}
                                  >
                                    <ThumbsDown size={12} /> No
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  <div style={{ marginTop: '20px', padding: '14px 18px', background: 'rgba(56,189,248,0.08)', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.84rem' }}>Can't find what you are looking for?</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.76rem' }}>Our IT & HR support engineers respond within 15 minutes.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(true)}
                      className="admin-btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                    >
                      <Plus size={14} /> Raise Ticket
                    </button>
                  </div>
                </div>
              )}

              {/* Contact HR Tab: Interactive Support Desk & Dispatch Message Form */}
              {helpTicketsTab === 'Contact HR' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="admin-table-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>HR Operations Desk</h3>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} /> Online (Avg 12m)
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: '#64748b' }}>HR Helpdesk Email:</span>
                        <strong style={{ color: '#38bdf8' }}>hr@vorldx.com</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: '#64748b' }}>Technical IT Support:</span>
                        <strong style={{ color: '#38bdf8' }}>support@vorldx.com</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: '#64748b' }}>Helpline Phone:</span>
                        <strong style={{ color: '#ffffff' }}>+91 9876543210 (Ext: 101)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: '#64748b' }}>Office Location:</span>
                        <strong style={{ color: '#ffffff' }}>VorldX Towers, Lucknow HQ</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#64748b' }}>Working Hours:</span>
                        <strong style={{ color: '#cbd5e1' }}>Mon - Fri: 09:00 AM - 06:30 PM</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => triggerAdminToast('✓ Dialing HR Desk Helpline +91 9876543210 (Ext: 101)...')}
                        className="admin-btn-action"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      >
                        Call Desk
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = 'mailto:hr@vorldx.com?subject=HR%20Operations%20Inquiry';
                          triggerAdminToast('✓ Opening email client for hr@vorldx.com');
                        }}
                        className="admin-btn-action"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      >
                        Send Email
                      </button>
                    </div>
                  </div>

                  <div className="admin-table-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Dispatch Quick Note to HR</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!hrContactForm.subject || !hrContactForm.message) return;
                      triggerAdminToast('✓ Inquiry submitted to HR desk. Ticket dispatched!');
                      setHrContactForm({ subject: '', category: 'General HR', message: '', urgency: 'Normal' });
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label className="admin-field-label">Category</label>
                          <select
                            value={hrContactForm.category}
                            onChange={(e) => setHrContactForm({ ...hrContactForm, category: e.target.value })}
                            className="admin-form-input"
                          >
                            <option value="General HR">General HR Inquiry</option>
                            <option value="Attendance Discrepancy">Attendance Discrepancy</option>
                            <option value="Leave Entitlement">Leave Entitlement</option>
                            <option value="Payroll & Reimbursement">Payroll & Reimbursement</option>
                            <option value="IT Hardware & Access">IT Hardware & Kiosk Access</option>
                          </select>
                        </div>
                        <div>
                          <label className="admin-field-label">Subject</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Question regarding Q4 leave rollover"
                            value={hrContactForm.subject}
                            onChange={(e) => setHrContactForm({ ...hrContactForm, subject: e.target.value })}
                            className="admin-form-input"
                          />
                        </div>
                        <div>
                          <label className="admin-field-label">Message Details</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Type your message for HR representative..."
                            value={hrContactForm.message}
                            onChange={(e) => setHrContactForm({ ...hrContactForm, message: e.target.value })}
                            className="admin-form-input"
                            style={{ height: 'auto' }}
                          />
                        </div>
                        <button
                          type="submit"
                          className="admin-btn-primary"
                          style={{ marginTop: '4px', justifyContent: 'center' }}
                        >
                          <Send size={14} /> Send Message to HR
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              SCREEN 16: SYSTEM OVERVIEW & APPROVALS (IMAGE 2 SCREEN 16)
             ================================================================= */}
          {activeModule === 'system-overview' && (
            <div>
              <div className="admin-header">
                <div>
                  <h1 className="admin-header-title">System Overview & Approvals</h1>
                  <p className="admin-header-desc">Executive oversight, pending administrative queues, and infrastructure health</p>
                </div>
              </div>

              {/* Top Tabs matching Screenshot 3: Pending Approvals, System Health, Active Users, Overview */}
              <div className="admin-tabs-row">
                {['Pending Approvals', 'System Health', 'Active Users', 'Overview'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSystemOverviewSubTab(tab)}
                    className={`admin-tab-btn ${systemOverviewSubTab === tab ? 'active' : ''}`}
                  >
                    {tab}
                    {tab === 'Pending Approvals' && (
                      <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '10px', fontSize: '0.68rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 800 }}>
                        {pendingApprovalsList.filter(i => i.status === 'Pending').length}
                      </span>
                    )}
                    {tab === 'Active Users' && (
                      <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '10px', fontSize: '0.68rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 800 }}>
                        {activeUsersList.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* VIEW 1: OVERVIEW TAB (Screenshot 3) */}
              {systemOverviewSubTab === 'Overview' && (
                <div>
                  {/* 4 Pending Approvals KPI Cards matching Screenshot 3 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '22px' }}>
                    <div
                      className="admin-5kpi-card"
                      onClick={() => {
                        setPendingApprovalFilter('WFH');
                        setSystemOverviewSubTab('Pending Approvals');
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Click to view and manage pending WFH requests"
                    >
                      <div className="admin-5kpi-top">
                        <div>
                          <div className="admin-5kpi-label">WFH Requests</div>
                          <div className="admin-5kpi-val" style={{ color: '#38bdf8' }}>
                            {pendingApprovalsList.filter(i => i.type === 'WFH' && i.status === 'Pending').length}
                          </div>
                        </div>
                        <div className="admin-5kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                          <Home size={20} />
                        </div>
                      </div>
                      <div className="admin-5kpi-bottom">
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pending Review</span>
                      </div>
                    </div>

                    <div
                      className="admin-5kpi-card"
                      onClick={() => {
                        setPendingApprovalFilter('Leave');
                        setSystemOverviewSubTab('Pending Approvals');
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Click to view and manage pending Leave requests"
                    >
                      <div className="admin-5kpi-top">
                        <div>
                          <div className="admin-5kpi-label">Leave Requests</div>
                          <div className="admin-5kpi-val" style={{ color: '#10b981' }}>
                            {pendingApprovalsList.filter(i => i.type === 'Leave' && i.status === 'Pending').length}
                          </div>
                        </div>
                        <div className="admin-5kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                          <FileText size={20} />
                        </div>
                      </div>
                      <div className="admin-5kpi-bottom">
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pending Review</span>
                      </div>
                    </div>

                    <div
                      className="admin-5kpi-card"
                      onClick={() => {
                        setPendingApprovalFilter('Attendance Correction');
                        setSystemOverviewSubTab('Pending Approvals');
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Click to view and manage pending Attendance Corrections"
                    >
                      <div className="admin-5kpi-top">
                        <div>
                          <div className="admin-5kpi-label">Attendance Correction</div>
                          <div className="admin-5kpi-val" style={{ color: '#a855f7' }}>
                            {pendingApprovalsList.filter(i => i.type === 'Attendance Correction' && i.status === 'Pending').length}
                          </div>
                        </div>
                        <div className="admin-5kpi-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
                          <Clock size={20} />
                        </div>
                      </div>
                      <div className="admin-5kpi-bottom">
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pending Review</span>
                      </div>
                    </div>

                    <div
                      className="admin-5kpi-card"
                      onClick={() => {
                        setPendingApprovalFilter('New Employee');
                        setSystemOverviewSubTab('Pending Approvals');
                      }}
                      style={{ cursor: 'pointer' }}
                      title="Click to view and manage pending New Employee approvals"
                    >
                      <div className="admin-5kpi-top">
                        <div>
                          <div className="admin-5kpi-label">New Employee Requests</div>
                          <div className="admin-5kpi-val" style={{ color: '#f59e0b' }}>
                            {pendingApprovalsList.filter(i => i.type === 'New Employee' && i.status === 'Pending').length}
                          </div>
                        </div>
                        <div className="admin-5kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                          <UserPlus size={20} />
                        </div>
                      </div>
                      <div className="admin-5kpi-bottom">
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pending Review</span>
                      </div>
                    </div>
                  </div>

                  {/* Lower Section: System Health Gauges + Active Users Strip matching Screenshot 3 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '22px', marginBottom: '22px' }}>
                    {/* System Health Circular Gauges */}
                    <div
                      className="admin-table-card"
                      style={{ padding: '24px', background: '#0d1527', cursor: 'pointer' }}
                      onClick={() => setSystemOverviewSubTab('System Health')}
                      title="Click to open System Health & Diagnostics"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                          System Health
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                          View Diagnostics →
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', textAlign: 'center' }}>
                        {[
                          { name: 'Server', pct: 99, color: '#10b981' },
                          { name: 'Database', pct: 98, color: '#10b981' },
                          { name: 'API', pct: 99, color: '#10b981' },
                          { name: 'Storage', pct: 72, color: '#38bdf8' }
                        ].map((g, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="64" height="64" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={g.color} strokeWidth="3" strokeDasharray={`${g.pct}, 100`} strokeLinecap="round" />
                              </svg>
                              <span style={{ position: 'absolute', fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>{g.pct}%</span>
                            </div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginTop: '8px' }}>{g.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Users Online Strip */}
                    <div
                      className="admin-table-card"
                      style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                      onClick={() => setSystemOverviewSubTab('Active Users')}
                      title="Click to view Active Concurrent Sessions Directory"
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Active Users ({activeUsersList.length})</h3>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} /> Live
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {activeUsersList.slice(0, 6).map((u, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <img src={u.avatar} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(56,189,248,0.4)' }} />
                              <span style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d1527' }} />
                            </div>
                          ))}
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                            +{activeUsersList.length > 6 ? activeUsersList.length - 6 : 18}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '16px', fontSize: '0.74rem', color: '#94a3b8' }}>
                        Real-time concurrent sessions across Lucknow HQ and remote web/mobile clients.
                      </div>
                    </div>
                  </div>

                  {/* Bottom Notice Banner matching Screenshot 3 */}
                  <div className="admin-table-card" style={{ padding: '16px 20px', background: 'linear-gradient(90deg, #1e3a8a 0%, #0d1527 100%)', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Megaphone size={18} color="#38bdf8" />
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>Global Awareness Policy:</strong>
                        <span style={{ color: '#cbd5e1', fontSize: '0.8rem', marginLeft: '6px' }}>Mandatory training for the upcoming security compliance guidelines is now open for all staff.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-btn-action"
                      style={{ padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700 }}
                      onClick={() => setShowGlobalPolicyModal(true)}
                    >
                      View Policy
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 2: PENDING APPROVALS TAB */}
              {systemOverviewSubTab === 'Pending Approvals' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Category Filter Chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { label: 'All', count: pendingApprovalsList.filter(i => i.status === 'Pending').length },
                        { label: 'WFH', count: pendingApprovalsList.filter(i => i.type === 'WFH' && i.status === 'Pending').length },
                        { label: 'Leave', count: pendingApprovalsList.filter(i => i.type === 'Leave' && i.status === 'Pending').length },
                        { label: 'Attendance Correction', count: pendingApprovalsList.filter(i => i.type === 'Attendance Correction' && i.status === 'Pending').length },
                        { label: 'New Employee', count: pendingApprovalsList.filter(i => i.type === 'New Employee' && i.status === 'Pending').length }
                      ].map(f => (
                        <button
                          key={f.label}
                          type="button"
                          onClick={() => setPendingApprovalFilter(f.label)}
                          className={`admin-btn-action ${pendingApprovalFilter === f.label ? 'active' : ''}`}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            background: pendingApprovalFilter === f.label ? '#2563eb' : 'rgba(255,255,255,0.03)',
                            color: '#ffffff',
                            borderColor: pendingApprovalFilter === f.label ? '#3b82f6' : 'rgba(255,255,255,0.08)'
                          }}
                        >
                          {f.label} <span style={{ opacity: 0.8, fontSize: '0.7rem' }}>({f.count})</span>
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleApproveAllVisible}
                        className="admin-btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      >
                        <CheckCircle size={14} /> Approve All Visible
                      </button>
                    </div>
                  </div>

                  {/* Pending Approvals Table */}
                  <div className="admin-table-card">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>#</th>
                          <th>Employee</th>
                          <th>Request Type</th>
                          <th>Details & Schedule</th>
                          <th>Urgency</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovalsList
                          .filter(item => pendingApprovalFilter === 'All' || item.type === pendingApprovalFilter)
                          .map((item, idx) => (
                            <tr key={item.id} style={{ opacity: item.status !== 'Pending' ? 0.6 : 1 }}>
                              <td className="admin-td-num">{idx + 1}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                    {item.employee.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.84rem' }}>{item.employee}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.empId} • {item.dept}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: item.type === 'WFH' ? 'rgba(56,189,248,0.15)' : item.type === 'Leave' ? 'rgba(16,185,129,0.15)' : item.type === 'Attendance Correction' ? 'rgba(168,85,247,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: item.type === 'WFH' ? '#38bdf8' : item.type === 'Leave' ? '#10b981' : item.type === 'Attendance Correction' ? '#c084fc' : '#fbbf24'
                                }}>
                                  {item.type}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{item.details}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Date: {item.date}</div>
                              </td>
                              <td>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: item.urgency === 'High' ? '#f87171' : '#94a3b8'
                                }}>
                                  {item.urgency}
                                </span>
                              </td>
                              <td>
                                <span className={`admin-status-pill ${item.status === 'Approved' ? 'active' : item.status === 'Rejected' ? 'inactive' : 'pending'}`} style={{
                                  background: item.status === 'Approved' ? 'rgba(16,185,129,0.15)' : item.status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: item.status === 'Approved' ? '#10b981' : item.status === 'Rejected' ? '#f87171' : '#fbbf24'
                                }}>
                                  {item.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                {item.status === 'Pending' ? (
                                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleApprovePendingItem(item)}
                                      className="admin-btn-action"
                                      style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}
                                      title="Approve request"
                                    >
                                      <Check size={13} /> Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectPendingItem(item)}
                                      className="admin-btn-action"
                                      style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                                      title="Reject request"
                                    >
                                      <X size={13} /> Reject
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedPendingItem(item)}
                                      className="admin-action-chip"
                                    >
                                      Details
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                    Processed
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 3: SYSTEM HEALTH TAB */}
              {systemOverviewSubTab === 'System Health' && (
                <div>
                  {/* Top 4 Circular Gauges */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '22px' }}>
                    {[
                      { name: 'App Server Node', pct: 99, status: 'Optimal', load: '0.24 Load Avg', color: '#10b981' },
                      { name: 'PostgreSQL DB', pct: 98, status: 'Healthy', load: '18 active pools', color: '#10b981' },
                      { name: 'API Gateway', pct: 99, status: 'Normal', load: '142 req/min', color: '#10b981' },
                      { name: 'Storage Disk', pct: 72, status: 'Adequate', load: '144 GB / 200 GB', color: '#38bdf8' }
                    ].map((m, i) => (
                      <div key={i} className="admin-table-card" style={{ padding: '20px', background: '#0d1527', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="56" height="56" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={m.color} strokeWidth="3" strokeDasharray={`${m.pct}, 100`} strokeLinecap="round" />
                          </svg>
                          <span style={{ position: 'absolute', fontSize: '0.74rem', fontWeight: 800, color: '#ffffff' }}>{m.pct}%</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.88rem' }}>{m.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>● {m.status}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>{m.load}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Diagnostics Console & Hardware Telemetry */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '22px', marginBottom: '22px' }}>
                    <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>Infrastructure Telemetry</h3>
                          <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8' }}>Live hardware metrics across cloud clusters & Lucknow HQ on-premise hardware</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRunSystemDiagnostics}
                          disabled={diagnosticsRunning}
                          className="admin-btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        >
                          <Activity size={14} /> {diagnosticsRunning ? 'Scanning...' : 'Run Diagnostics'}
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>CPU Core Utilization (16 Cores)</span>
                            <strong style={{ color: '#10b981' }}>28% Nominal</strong>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '28%', height: '100%', background: '#10b981' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>RAM Memory (4.2 GB / 16 GB Allocated)</span>
                            <strong style={{ color: '#38bdf8' }}>26% Used</strong>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '26%', height: '100%', background: '#38bdf8' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>Redis Cache Hit Ratio</span>
                            <strong style={{ color: '#10b981' }}>94.6% Hit Rate</strong>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '94.6%', height: '100%', background: '#10b981' }} />
                          </div>
                        </div>
                      </div>

                      {diagnosticsLog && (
                        <div style={{ marginTop: '18px', padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.76rem', color: '#10b981', fontFamily: 'monospace' }}>
                          {diagnosticsLog}
                        </div>
                      )}
                    </div>

                    <div className="admin-table-card" style={{ padding: '24px', background: '#0d1527', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>Security & Hardware</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ color: '#64748b' }}>SSL/TLS Certificate:</span>
                            <strong style={{ color: '#10b981' }}>Active (Expires in 284 days)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ color: '#64748b' }}>ZKTeco Biometric Kiosks:</span>
                            <strong style={{ color: '#38bdf8' }}>4 of 4 Online (Lucknow HQ)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ color: '#64748b' }}>DB Read Replica Latency:</span>
                            <strong style={{ color: '#10b981' }}>11ms (Real-time sync)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <span style={{ color: '#64748b' }}>Backup Status:</span>
                            <strong style={{ color: '#10b981' }}>Nightly backup completed (02:00 AM)</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button
                          type="button"
                          onClick={() => triggerAdminToast('✓ Temporary system session caches flushed successfully!')}
                          className="admin-btn-action"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}
                        >
                          Flush Temp Cache
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerAdminToast('✓ System Health Audit Log exported to PDF.')}
                          className="admin-btn-action"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}
                        >
                          Export Health Log
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: ACTIVE USERS TAB */}
              {systemOverviewSubTab === 'Active Users' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#10b981', fontWeight: 800 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                        {activeUsersList.length} Active Concurrent Sessions
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* Location Filter */}
                      <select
                        value={activeUsersLocationFilter}
                        onChange={(e) => setActiveUsersLocationFilter(e.target.value)}
                        className="admin-form-input"
                        style={{ width: '150px', height: '34px', fontSize: '0.78rem' }}
                      >
                        <option value="All">All Locations</option>
                        <option value="Lucknow HQ">Lucknow HQ</option>
                        <option value="Remote / WFH">Remote / WFH</option>
                      </select>

                      {/* User Search */}
                      <div style={{ position: 'relative', width: '220px' }}>
                        <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          value={activeUsersSearch}
                          onChange={(e) => setActiveUsersSearch(e.target.value)}
                          placeholder="Search active users..."
                          className="admin-form-input"
                          style={{ paddingLeft: '32px', height: '34px', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>#</th>
                          <th>Employee</th>
                          <th>Role & Department</th>
                          <th>Location</th>
                          <th>Device & IP</th>
                          <th>Active Since</th>
                          <th>Last Seen</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeUsersList
                          .filter(u => activeUsersLocationFilter === 'All' || u.location === activeUsersLocationFilter)
                          .filter(u => !activeUsersSearch || u.name.toLowerCase().includes(activeUsersSearch.toLowerCase()) || u.empId.toLowerCase().includes(activeUsersSearch.toLowerCase()) || u.dept.toLowerCase().includes(activeUsersSearch.toLowerCase()))
                          .map((u, idx) => (
                            <tr key={u.id}>
                              <td className="admin-td-num">{idx + 1}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ position: 'relative' }}>
                                    <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '1px solid #0d1527' }} />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.84rem' }}>{u.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{u.empId}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{u.role}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{u.dept}</div>
                              </td>
                              <td>
                                <span style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: u.location === 'Lucknow HQ' ? 'rgba(56,189,248,0.15)' : 'rgba(168,85,247,0.15)',
                                  color: u.location === 'Lucknow HQ' ? '#38bdf8' : '#c084fc'
                                }}>
                                  {u.location}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{u.device}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>{u.ip}</div>
                              </td>
                              <td className="admin-td-date">{u.activeSince}</td>
                              <td>
                                <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                                  ● {u.lastSeen}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => handleTerminateUserSession(u.id, u.name)}
                                  className="admin-btn-action"
                                  style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                                >
                                  Terminate
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* =====================================================================
          MODAL DIALOGS
         ===================================================================== */}
      {/* MODAL: QUICK ACTIONS */}
      {showQuickActionsModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#a855f7" />
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>Quick Actions</h3>
              </div>
              <button onClick={() => setShowQuickActionsModal(false)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <button
                onClick={() => { setShowQuickActionsModal(false); setActiveModule('mark-attendance'); }}
                style={{ padding: '14px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', cursor: 'pointer', textAlign: 'left' }}
              >
                <QrCode size={20} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Mark Attendance</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>QR punch & manual log</div>
              </button>

              <button
                onClick={() => { setShowQuickActionsModal(false); setShowAddEmpModal(true); }}
                style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', cursor: 'pointer', textAlign: 'left' }}
              >
                <UserPlus size={20} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Add Employee</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Create new employee profile</div>
              </button>

              <button
                onClick={() => { setShowQuickActionsModal(false); setActiveModule('apply-leave'); }}
                style={{ padding: '14px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#a855f7', cursor: 'pointer', textAlign: 'left' }}
              >
                <Calendar size={20} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Apply Leave</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>File employee leave</div>
              </button>

              <button
                onClick={() => { setShowQuickActionsModal(false); setActiveModule('notices'); }}
                style={{ padding: '14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', cursor: 'pointer', textAlign: 'left' }}
              >
                <Megaphone size={20} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Broadcast Notice</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Publish announcement</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RAISE SUPPORT TICKET */}
      {showSupportModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Raise a Support Ticket</h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSupportTicket}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                  <div>
                    <label className="admin-field-label">Category</label>
                    <select
                      value={newTicketForm.category}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                      className="admin-form-input"
                    >
                      <option value="Attendance">Attendance Issue</option>
                      <option value="HR">HR Operations</option>
                      <option value="Leave">Leave & WFH</option>
                      <option value="Technical">Technical / Kiosk</option>
                      <option value="Payroll">Payroll & Benefits</option>
                    </select>
                  </div>

                  <div>
                    <label className="admin-field-label">Priority</label>
                    <select
                      value={newTicketForm.priority}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                      className="admin-form-input"
                    >
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="admin-field-label">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of issue"
                    value={newTicketForm.subject}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div>
                  <label className="admin-field-label">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide full description of the problem..."
                    value={newTicketForm.description}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                    className="admin-form-input"
                    style={{ height: 'auto' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button type="button" onClick={() => setShowSupportModal(false)} className="admin-btn-action" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Submit Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD EMPLOYEE */}
      {showAddEmpModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Add New Employee</h3>
              </div>
              <button onClick={() => setShowAddEmpModal(false)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label className="admin-field-label">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={newEmp.id}
                    onChange={(e) => setNewEmp({ ...newEmp, id: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanya Mehra"
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label className="admin-field-label">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Finance">Finance</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label className="admin-field-label">Joining Date</label>
                  <input
                    type="text"
                    required
                    value={newEmp.joining_date}
                    onChange={(e) => setNewEmp({ ...newEmp, joining_date: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Status</label>
                  <select
                    value={newEmp.status}
                    onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD HR MEMBER */}
      {showAddHrModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Add HR Member</h3>
              </div>
              <button onClick={() => setShowAddHrModal(false)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddHrMember}>
              <div style={{ marginBottom: '10px' }}>
                <label className="admin-field-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Mishra"
                  value={newHrMember.name}
                  onChange={(e) => setNewHrMember({ ...newHrMember, name: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="admin-field-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="arun@vorldx.com"
                  value={newHrMember.email}
                  onChange={(e) => setNewHrMember({ ...newHrMember, email: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label className="admin-field-label">Role</label>
                  <select
                    value={newHrMember.role}
                    onChange={(e) => setNewHrMember({ ...newHrMember, role: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="HR Executive">HR Executive</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="HR Lead">HR Lead</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Status</label>
                  <select
                    value={newHrMember.status}
                    onChange={(e) => setNewHrMember({ ...newHrMember, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddHrModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: IMPORT EXCEL */}
      {showImportModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>Import Employees (Excel / CSV)</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
              Upload your employee roster spreadsheet to import in bulk.
            </p>
            <div style={{
              border: '2px dashed rgba(56, 189, 248, 0.4)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '16px',
              background: 'rgba(56, 189, 248, 0.05)'
            }}>
              <Upload size={32} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Drag and drop file here</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Supports .XLSX, .CSV up to 10MB</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="admin-btn-action"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Uploaded 8 new employee records successfully!');
                  setShowImportModal(false);
                }}
                className="admin-btn-primary"
                style={{ flex: 1 }}
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT POLICY SETTINGS */}
      {showEditPolicyModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Edit Attendance Policy</h3>
              </div>
              <button onClick={() => setShowEditPolicyModal(false)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label className="admin-field-label">Office Start Time</label>
                <input
                  type="text"
                  value={policySettings.startTime}
                  onChange={(e) => setPolicySettings({ ...policySettings, startTime: e.target.value })}
                  className="admin-form-input"
                />
              </div>
              <div>
                <label className="admin-field-label">Office End Time</label>
                <input
                  type="text"
                  value={policySettings.endTime}
                  onChange={(e) => setPolicySettings({ ...policySettings, endTime: e.target.value })}
                  className="admin-form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label className="admin-field-label">Half Day Hours</label>
                <input
                  type="text"
                  value={policySettings.halfDay}
                  onChange={(e) => setPolicySettings({ ...policySettings, halfDay: e.target.value })}
                  className="admin-form-input"
                />
              </div>
              <div>
                <label className="admin-field-label">Late Mark After</label>
                <input
                  type="text"
                  value={policySettings.lateMark}
                  onChange={(e) => setPolicySettings({ ...policySettings, lateMark: e.target.value })}
                  className="admin-form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="admin-field-label">Grace Time</label>
              <input
                type="text"
                value={policySettings.graceTime1}
                onChange={(e) => setPolicySettings({ ...policySettings, graceTime1: e.target.value })}
                className="admin-form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowEditPolicyModal(false)}
                className="admin-btn-action"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerAdminToast('✓ Attendance Policy Updated Successfully!');
                  setShowEditPolicyModal(false);
                }}
                className="admin-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PRESENT EMPLOYEES REGISTER (NAME, ID, DATE, ARRIVAL, DEPARTURE) */}
      {showPresentModal && (
        <div className="admin-modal-overlay" onClick={() => setShowPresentModal(false)}>
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '950px', width: '95%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={20} color="#10b981" />
                  Present Employees Register — 16 Oct 2026
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                  Showing 32 active on-site punches with Employee Name, ID, Date, Arrival, and Departure
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="admin-status-pill active" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                  32 Present
                </span>
                <button
                  onClick={() => setShowPresentModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Filter Search inside modal */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Search by Employee Name, ID, or Department..."
                value={presentSearch}
                onChange={(e) => setPresentSearch(e.target.value)}
                className="admin-filter-input"
                style={{ flex: 1 }}
              />
              <button
                className="admin-btn-action"
                onClick={() => {
                  const csvRows = [
                    ['Employee Name', 'Employee ID', 'Date', 'Arrival', 'Departure', 'Total Hours', 'Department', 'Status'],
                    ...presentEmployeesList.map(e => [e.name, e.id, e.date, e.arrival, e.departure, e.total_hours, e.department, e.status])
                  ];
                  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(r => r.join(',')).join('\n');
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute('download', 'Present_Employees_16Oct2026.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowY: 'auto', flex: 1, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
              <table className="admin-table" style={{ margin: 0 }}>
                <thead style={{ position: 'sticky', top: 0, background: '#131b2e', zIndex: 2 }}>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Arrival</th>
                    <th>Departure</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {presentEmployeesList
                    .filter(emp =>
                      emp.name.toLowerCase().includes(presentSearch.toLowerCase()) ||
                      emp.id.toLowerCase().includes(presentSearch.toLowerCase()) ||
                      emp.department.toLowerCase().includes(presentSearch.toLowerCase())
                    )
                    .map((emp, idx) => (
                      <tr key={emp.id}>
                        <td className="admin-td-num">{idx + 1}</td>
                        <td>
                          <div className="admin-employee-cell">
                            <img src={emp.avatar} alt={emp.name} className="admin-employee-avatar" />
                            <div>
                              <div className="admin-employee-name">{emp.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.department}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#38bdf8' }}>{emp.id}</td>
                        <td className="admin-td-date">{emp.date}</td>
                        <td className="admin-td-date" style={{ color: '#10b981', fontWeight: 600 }}>{emp.arrival}</td>
                        <td className="admin-td-date" style={{ color: '#f59e0b', fontWeight: 600 }}>{emp.departure}</td>
                        <td style={{ color: '#ffffff', fontWeight: 600 }}>{emp.total_hours}</td>
                        <td>
                          <span className="admin-status-pill active">{emp.status}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() => setShowPresentModal(false)}
                className="admin-btn-primary"
                style={{ minWidth: '120px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW EMPLOYEE PROFILE DETAILS */}
      {selectedEmpDetails && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '540px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={selectedEmpDetails.avatar}
                  alt={selectedEmpDetails.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>{selectedEmpDetails.name}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {selectedEmpDetails.id} • {selectedEmpDetails.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmpDetails(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.84rem' }}>Employment Status</span>
                <span className={`admin-status-pill ${selectedEmpDetails.status === 'Active' ? 'active' : 'inactive'}`}>
                  ● {selectedEmpDetails.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Department</div>
                  <div style={{ color: '#ffffff', fontSize: '0.86rem', fontWeight: 600, marginTop: '4px' }}>{selectedEmpDetails.department}</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Joining Date</div>
                  <div style={{ color: '#38bdf8', fontSize: '0.86rem', fontWeight: 600, marginTop: '4px' }}>{selectedEmpDetails.joining_date}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>Official Email & Location</div>
                <div style={{ color: '#ffffff', fontSize: '0.86rem', marginTop: '4px' }}>
                  {selectedEmpDetails.name.toLowerCase().replace(/\s+/g, '.')}@vorldx.com
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '2px' }}>VorldX HQ • Floor 4, Cyber City</div>
              </div>

              {/* Attendance Mini KPI */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#64748b', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  {selectedMonth} Attendance Performance
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ color: '#10b981', fontWeight: 800 }}>18</div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981' }}>Present</div>
                  </div>
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ color: '#a855f7', fontWeight: 800 }}>3</div>
                    <div style={{ fontSize: '0.7rem', color: '#a855f7' }}>WFH</div>
                  </div>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 800 }}>2</div>
                    <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Leave</div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ color: '#ef4444', fontWeight: 800 }}>3</div>
                    <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>Absent</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadEmpSlip(selectedEmpDetails)}
                  className="admin-btn-action"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <Download size={14} />
                  Download Summary
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleEmpStatus(selectedEmpDetails.id)}
                  className="admin-btn-action"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <RefreshCw size={14} />
                  Set {selectedEmpDetails.status === 'Active' ? 'Inactive' : 'Active'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEmpDetails(null)}
                className="admin-btn-primary"
                style={{ fontSize: '0.82rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT EMPLOYEE PROFILE */}
      {editEmpModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', width: '95%' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '14px' }}>
              Edit Employee • {editEmpModal.id}
            </h3>
            <form onSubmit={handleSaveEditedEmp}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={editEmpModal.name}
                  onChange={(e) => setEditEmpModal({ ...editEmpModal, name: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Department</label>
                <select
                  value={editEmpModal.department}
                  onChange={(e) => setEditEmpModal({ ...editEmpModal, department: e.target.value })}
                  className="admin-form-input"
                >
                  <option value="Software Development">Software Development</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Designation</label>
                <input
                  type="text"
                  required
                  value={editEmpModal.designation}
                  onChange={(e) => setEditEmpModal({ ...editEmpModal, designation: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="admin-field-label">Status</label>
                <select
                  value={editEmpModal.status}
                  onChange={(e) => setEditEmpModal({ ...editEmpModal, status: e.target.value })}
                  className="admin-form-input"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditEmpModal(null)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SELECT DATE RANGE (Screenshot 3) */}
      {showDateRangeModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '440px', width: '95%', background: '#0f172a', border: '1px solid rgba(56,189,248,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Select Date Range</h3>
              </div>
              <button
                onClick={() => setShowDateRangeModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
              Filter records for <strong>{dateFilterTarget.toUpperCase()}</strong> by selecting a preset or custom range:
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: 'Today (14 Oct)', preset: 'Today' },
                { label: 'Yesterday (13 Oct)', preset: 'Yesterday' },
                { label: 'This Week', preset: 'This Week' },
                { label: 'This Month', preset: 'This Month' },
                { label: 'Last 30 Days', preset: 'Last 30 Days' },
                { label: 'All Dates (Clear)', preset: 'All' }
              ].map(p => (
                <button
                  key={p.preset}
                  type="button"
                  onClick={() => handleApplyDatePreset(p.preset)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: p.preset === 'All' ? '#f87171' : '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Range Form */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>Custom Range</div>
              <form onSubmit={handleApplyCustomDateRange} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="admin-field-label">From Date</label>
                    <input
                      type="date"
                      value={customRangeStart}
                      onChange={(e) => setCustomRangeStart(e.target.value)}
                      className="admin-form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">To Date</label>
                    <input
                      type="date"
                      value={customRangeEnd}
                      onChange={(e) => setCustomRangeEnd(e.target.value)}
                      className="admin-form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowDateRangeModal(false)}
                    className="admin-btn-action"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Apply Range
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD HR ITEM (Department / Designation / Holiday / Shift / Work Location) */}
      {showAddHrItemModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '500px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                  Add {hrMgmtTab === 'Departments' ? 'Department' : hrMgmtTab === 'Designations' ? 'Designation' : hrMgmtTab === 'Holidays' ? 'Holiday' : hrMgmtTab === 'Shifts' ? 'Shift' : 'Work Location'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddHrItemModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHrItem}>
              {hrMgmtTab === 'Departments' && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Department Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artificial Intelligence & Labs"
                      value={newHrItemForm.name}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, name: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                    <div>
                      <label className="admin-field-label">Department Head</label>
                      <input
                        type="text"
                        placeholder="e.g. Pooja Yadav"
                        value={newHrItemForm.field2}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field2: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                    <div>
                      <label className="admin-field-label">Initial Employee Count</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="10"
                        value={newHrItemForm.field3}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field3: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {hrMgmtTab === 'Designations' && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Designation Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal Cloud Architect"
                      value={newHrItemForm.name}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, name: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', marginBottom: '18px' }}>
                    <div>
                      <label className="admin-field-label">Department</label>
                      <select
                        value={newHrItemForm.field2 || 'Engineering'}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field2: e.target.value })}
                        className="admin-form-input"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Product Design">Product Design</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                      </select>
                    </div>
                    <div>
                      <label className="admin-field-label">Staff Count</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="5"
                        value={newHrItemForm.field3}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field3: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {hrMgmtTab === 'Holidays' && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Holiday Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Republic Day"
                      value={newHrItemForm.name}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, name: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label className="admin-field-label">Date *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 26 Jan 2027"
                        value={newHrItemForm.field2}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field2: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                    <div>
                      <label className="admin-field-label">Day</label>
                      <input
                        type="text"
                        placeholder="e.g. Tuesday"
                        value={newHrItemForm.field3}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field3: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label className="admin-field-label">Holiday Category</label>
                    <select
                      value={newHrItemForm.field4 || 'Gazetted Holiday'}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field4: e.target.value })}
                      className="admin-form-input"
                    >
                      <option value="Gazetted Holiday">Gazetted Holiday</option>
                      <option value="Restricted Holiday">Restricted Holiday</option>
                      <option value="Public Holiday">Public Holiday</option>
                    </select>
                  </div>
                </>
              )}

              {hrMgmtTab === 'Shifts' && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Shift Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekend Operations Shift"
                      value={newHrItemForm.name}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, name: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                    <div>
                      <label className="admin-field-label">Shift Hours</label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM - 07:00 PM"
                        value={newHrItemForm.field2}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field2: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                    <div>
                      <label className="admin-field-label">Grace Period</label>
                      <input
                        type="text"
                        placeholder="e.g. 15 mins"
                        value={newHrItemForm.field3}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field3: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {hrMgmtTab === 'Work Locations' && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Location / Campus Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad Innovation Hub"
                      value={newHrItemForm.name}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, name: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label className="admin-field-label">Full Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HITEC City, Hyderabad, Telangana"
                      value={newHrItemForm.field2}
                      onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field2: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                    <div>
                      <label className="admin-field-label">Geofence Radius</label>
                      <input
                        type="text"
                        placeholder="e.g. 150 meters"
                        value={newHrItemForm.field3}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field3: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                    <div>
                      <label className="admin-field-label">Assigned Staff Count</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="35"
                        value={newHrItemForm.field4}
                        onChange={(e) => setNewHrItemForm({ ...newHrItemForm, field4: e.target.value })}
                        className="admin-form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddHrItemModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save &amp; Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ROLE (Screenshot 4) */}
      {showAddRoleModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Add New System Role</h3>
              </div>
              <button
                onClick={() => setShowAddRoleModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Lead, Technical Architect"
                  value={newRoleForm.roleName}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, roleName: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe permissions and operational scope of this role..."
                  value={newRoleForm.description}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  className="admin-form-input"
                  style={{ height: 'auto' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label className="admin-field-label">Initial Users Count</label>
                  <input
                    type="number"
                    min={0}
                    value={newRoleForm.users}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, users: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Status</label>
                  <select
                    value={newRoleForm.status}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ROLE (Screenshot 4) */}
      {editingRoleModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Edit Role • {editingRoleModal.roleName}</h3>
              </div>
              <button
                onClick={() => setEditingRoleModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedRole}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Role Name *</label>
                <input
                  type="text"
                  required
                  value={editingRoleModal.roleName}
                  onChange={(e) => setEditingRoleModal({ ...editingRoleModal, roleName: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingRoleModal.description}
                  onChange={(e) => setEditingRoleModal({ ...editingRoleModal, description: e.target.value })}
                  className="admin-form-input"
                  style={{ height: 'auto' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label className="admin-field-label">Assigned Users Count</label>
                  <input
                    type="number"
                    min={0}
                    value={editingRoleModal.users}
                    onChange={(e) => setEditingRoleModal({ ...editingRoleModal, users: parseInt(e.target.value) || 0 })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Status</label>
                  <select
                    value={editingRoleModal.status}
                    onChange={(e) => setEditingRoleModal({ ...editingRoleModal, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {!['Admin', 'Employee'].includes(editingRoleModal.roleName) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRole(editingRoleModal.id, editingRoleModal.roleName)}
                    style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditingRoleModal(null)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW COMPANY POLICY (Screenshot 5) */}
      {showAddPolicyModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '500px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Add Company Policy</h3>
              </div>
              <button
                onClick={() => setShowAddPolicyModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePolicy}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Policy Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hybrid Working & Cloud Access Policy"
                  value={newPolicyForm.name}
                  onChange={(e) => setNewPolicyForm({ ...newPolicyForm, name: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-field-label">Category</label>
                  <select
                    value={newPolicyForm.category}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, category: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="HR Policies">HR Policies</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Leave">Leave</option>
                    <option value="WFH">WFH</option>
                    <option value="IT Security">IT Security</option>
                    <option value="General">General</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Simulated Size</label>
                  <input
                    type="text"
                    value={newPolicyForm.size}
                    onChange={(e) => setNewPolicyForm({ ...newPolicyForm, size: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g. 2.4 MB"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="admin-field-label">Policy Summary / Core Rules *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter policy summary, clauses, and employee responsibilities..."
                  value={newPolicyForm.summary}
                  onChange={(e) => setNewPolicyForm({ ...newPolicyForm, summary: e.target.value })}
                  className="admin-form-input"
                  style={{ height: 'auto' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPolicyModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Publish Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW COMPANY POLICY DOCUMENT (Screenshot 5) */}
      {viewPolicyModalDoc && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '640px', width: '95%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>{viewPolicyModalDoc.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    {viewPolicyModalDoc.category} • {viewPolicyModalDoc.size} • Updated: {viewPolicyModalDoc.updatedOn}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewPolicyModalDoc(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '6px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>1. Policy Overview & Scope</div>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5', margin: '6px 0 0' }}>
                  This official document establishes corporate standards for <strong>{viewPolicyModalDoc.name}</strong>. It applies to all permanent employees, remote associates, and contract staff across all locations under VorldX Technologies Pvt Ltd.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>2. Key Guidelines & Standard Operating Procedures</div>
                <ul style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.6', margin: '8px 0 0', paddingLeft: '18px' }}>
                  <li>Official working hours adhere to standard business shifts (09:00 AM - 06:00 PM).</li>
                  <li>Requests and log corrections must be processed through the Admin / HR 360 portal within 48 hours.</li>
                  <li>Employees must maintain high compliance with data confidentiality and cyber-security policies.</li>
                  <li>Zero tolerance for unauthorized proxy attendance or biometric spoofing.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>3. Escalations & Official Contacts</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '6px' }}>
                  Questions or exemption requests should be routed to <strong style={{ color: '#38bdf8' }}>hr@vorldx.com</strong> or submitted via the Help & Support ticket desk.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Downloaded <strong>{viewPolicyModalDoc.downloads || 140} times</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadPolicy(viewPolicyModalDoc)}
                  className="admin-btn-primary"
                  style={{ gap: '6px', fontSize: '0.82rem' }}
                >
                  <Download size={14} />
                  <span>Download Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewPolicyModalDoc(null)}
                  className="admin-btn-action"
                  style={{ fontSize: '0.82rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW NOTICE & ANNOUNCEMENT (Screenshot 1) */}
      {showAddNoticeModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '520px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>New Notice / Circular</h3>
              </div>
              <button
                onClick={() => setShowAddNoticeModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNotice}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office will remain closed on Diwali Holiday"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-field-label">Category / Type</label>
                  <select
                    value={newNoticeForm.type}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, type: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Important">Important</option>
                    <option value="General">General</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Circular Date</label>
                  <input
                    type="text"
                    value={newNoticeForm.date}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, date: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g. All Staff, Lucknow HQ, Engineering"
                  value={newNoticeForm.audience}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, audience: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="admin-field-label">Notice Content / Instructions *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write full official announcement message here..."
                  value={newNoticeForm.content}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                  className="admin-form-input"
                  style={{ height: 'auto' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW NOTICE / CIRCULAR (Screenshot 1) */}
      {viewNoticeModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '580px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'inline-block',
                  marginBottom: '8px',
                  background: viewNoticeModal.type === 'Holiday' ? 'rgba(239, 68, 68, 0.15)' : viewNoticeModal.type === 'Important' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: viewNoticeModal.type === 'Holiday' ? '#f87171' : viewNoticeModal.type === 'Important' ? '#fbbf24' : '#38bdf8'
                }}>
                  {viewNoticeModal.type} Bulletin
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700, lineHeight: 1.35 }}>
                  {viewNoticeModal.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  Published on {viewNoticeModal.date} • Audience: <strong style={{ color: '#cbd5e1' }}>{viewNoticeModal.audience || 'All Staff'}</strong>
                </div>
              </div>
              <button
                onClick={() => setViewNoticeModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {viewNoticeModal.content || 'Official circular issued by WorldX Technologies Corporate Office. All employees and contractor personnel are requested to comply.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Status: <strong style={{ color: '#10b981' }}>{viewNoticeModal.status}</strong>
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const noticeToEdit = viewNoticeModal;
                    setViewNoticeModal(null);
                    setEditingNoticeModal(noticeToEdit);
                  }}
                  className="admin-btn-action"
                  style={{ fontSize: '0.82rem' }}
                >
                  Edit Notice
                </button>
                <button
                  type="button"
                  onClick={() => setViewNoticeModal(null)}
                  className="admin-btn-primary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT NOTICE (Screenshot 1) */}
      {editingNoticeModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '520px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Edit Notice</h3>
              </div>
              <button
                onClick={() => setEditingNoticeModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedNotice}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={editingNoticeModal.title}
                  onChange={(e) => setEditingNoticeModal({ ...editingNoticeModal, title: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-field-label">Type / Category</label>
                  <select
                    value={editingNoticeModal.type}
                    onChange={(e) => setEditingNoticeModal({ ...editingNoticeModal, type: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Important">Important</option>
                    <option value="General">General</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="admin-field-label">Circular Date</label>
                  <input
                    type="text"
                    value={editingNoticeModal.date}
                    onChange={(e) => setEditingNoticeModal({ ...editingNoticeModal, date: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Target Audience</label>
                <input
                  type="text"
                  value={editingNoticeModal.audience || 'All Staff'}
                  onChange={(e) => setEditingNoticeModal({ ...editingNoticeModal, audience: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="admin-field-label">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  value={editingNoticeModal.content || ''}
                  onChange={(e) => setEditingNoticeModal({ ...editingNoticeModal, content: e.target.value })}
                  className="admin-form-input"
                  style={{ height: 'auto' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteNotice(editingNoticeModal.id)}
                  style={{ padding: '8px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  Delete Notice
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNoticeModal(null)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT AUDIT LOG DETAIL (Screenshot 4) */}
      {selectedAuditLog && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '540px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                  Security Audit Trail • Entry #{selectedAuditLog.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Actor / User</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: '3px' }}>{selectedAuditLog.user}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Affected Module</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginTop: '3px' }}>{selectedAuditLog.module}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Action Performed</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9', marginTop: '3px' }}>{selectedAuditLog.action}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Logged Timestamp</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '3px' }}>{selectedAuditLog.dateTime}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Integrity Status</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'inline-block', marginTop: '3px' }}>✓ Verified Signed</span>
                </div>
              </div>

              <div style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>Telemetry &amp; Audit Metadata</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
                  IP: 192.168.1.104 • Client: Chrome/128 (Windows 11) • Session: WX-SES-9941 • Digest: SHA256:7f83b1657ff1...
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`Audit Log #${selectedAuditLog.id}: ${selectedAuditLog.action} by ${selectedAuditLog.user} on ${selectedAuditLog.dateTime}`);
                  triggerAdminToast('✓ Copied audit payload to clipboard!');
                }}
                className="admin-btn-action"
                style={{ fontSize: '0.8rem' }}
              >
                Copy Audit Hash
              </button>
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="admin-btn-primary"
                style={{ fontSize: '0.8rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* MODAL: VIEW ATTENDANCE RECORD */}
      {viewAttendanceRecordModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '520px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Attendance Punch Record</h3>
              </div>
              <button
                onClick={() => setViewAttendanceRecordModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Employee Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={viewAttendanceRecordModal.avatar} alt={viewAttendanceRecordModal.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{viewAttendanceRecordModal.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{viewAttendanceRecordModal.id} • {viewAttendanceRecordModal.department}</div>
              </div>
              <span className="admin-status-pill active">{viewAttendanceRecordModal.status || 'Present'}</span>
            </div>

            {/* Punch Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Punch Date</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{viewAttendanceRecordModal.date || '16 Oct 2026'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Punctuality Status</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{viewAttendanceRecordModal.arrival_status || 'On Time'}</div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.06)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Clock In (Arrival)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{viewAttendanceRecordModal.arrival}</div>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.06)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>Clock Out (Departure)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{viewAttendanceRecordModal.departure}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Working Duration</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>{viewAttendanceRecordModal.total_hours}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Punch Location</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginTop: '2px' }}>HQ Lucknow • Kiosk #01</div>
              </div>
            </div>

            {/* Geofence & Device Telemetry */}
            <div style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '8px', padding: '10px 12px', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#38bdf8" />
                <span>Geofence &amp; Biometric Telemetry</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
                ✓ GPS Radius: Verified (38m inside 150m geofence perimeter) • Terminal IP: 192.168.1.108 • Audit Hash: SHA256:4a81...ok
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setViewAttendanceRecordModal(null)}
                className="admin-btn-action"
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditAttendanceRecordModal({ ...viewAttendanceRecordModal });
                  setViewAttendanceRecordModal(null);
                }}
                className="admin-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Edit3 size={14} />
                <span>Edit Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ATTENDANCE RECORD */}
      {editAttendanceRecordModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Edit Attendance Record</h3>
              </div>
              <button
                onClick={() => setEditAttendanceRecordModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '8px 12px', background: 'rgba(56,189,248,0.06)', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.15)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>{editAttendanceRecordModal.name}</div>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>{editAttendanceRecordModal.id} • {editAttendanceRecordModal.department}</div>
            </div>

            <form onSubmit={handleSaveEditedAttendanceRecord}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-field-label">Check In Time</label>
                  <input
                    type="text"
                    required
                    value={editAttendanceRecordModal.arrival || ''}
                    onChange={(e) => setEditAttendanceRecordModal({ ...editAttendanceRecordModal, arrival: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Check Out Time</label>
                  <input
                    type="text"
                    required
                    value={editAttendanceRecordModal.departure || ''}
                    onChange={(e) => setEditAttendanceRecordModal({ ...editAttendanceRecordModal, departure: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-field-label">Total Duration</label>
                  <input
                    type="text"
                    required
                    value={editAttendanceRecordModal.total_hours || ''}
                    onChange={(e) => setEditAttendanceRecordModal({ ...editAttendanceRecordModal, total_hours: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Status</label>
                  <select
                    value={editAttendanceRecordModal.status || 'Present'}
                    onChange={(e) => setEditAttendanceRecordModal({ ...editAttendanceRecordModal, status: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="WFH">WFH</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Arrival Status / Remarks</label>
                <select
                  value={editAttendanceRecordModal.arrival_status || 'On Time'}
                  onChange={(e) => setEditAttendanceRecordModal({ ...editAttendanceRecordModal, arrival_status: e.target.value })}
                  className="admin-form-input"
                >
                  <option value="On Time">On Time</option>
                  <option value="Late by 5m">Late by 5m</option>
                  <option value="Late by 15m">Late by 15m</option>
                  <option value="Early Departure">Early Departure</option>
                  <option value="Manual Correction">Manual Correction</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setEditAttendanceRecordModal(null)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXECUTIVE REPORT PREVIEW */}
      {showReportPreviewModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '620px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={20} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                    Report Preview • {reportsSubTab}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Period: {reportMonth} • Scope: {reportDept}</span>
                </div>
              </div>
              <button
                onClick={() => setShowReportPreviewModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>TOTAL DAYS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>26</div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#10b981' }}>PRESENT</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>186</div>
              </div>
              <div style={{ background: 'rgba(168,85,247,0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#c084fc' }}>WFH</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>32</div>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#f59e0b' }}>LEAVE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>18</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Executive Summary Snapshot</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                • Organization-wide attendance reached <strong>74.4%</strong> during {reportMonth}.<br />
                • Average punctuality benchmark scored <strong>94.2%</strong> across {reportDept}.<br />
                • 32 remote work days authorized with 100% compliance to VPN security standards.<br />
                • Digital signature verified for Board of Directors audit compliance.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={() => setShowReportPreviewModal(false)}
                className="admin-btn-action"
                style={{ fontSize: '0.8rem' }}
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  handleExportAnalytics();
                  setShowReportPreviewModal(false);
                }}
                className="admin-btn-action"
                style={{ fontSize: '0.8rem', gap: '6px' }}
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleGenerateReportFile();
                  setShowReportPreviewModal(false);
                }}
                className="admin-btn-primary"
                style={{ fontSize: '0.8rem', gap: '6px' }}
              >
                <Download size={13} />
                <span>Download {reportFormat}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CALENDAR EVENT */}
      {showAddEventModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Add Calendar Event</h3>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCalendarEvent}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Town Hall, Client Sync"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-field-label">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-field-label">Event Type</label>
                  <select
                    value={newEventForm.tag}
                    onChange={(e) => setNewEventForm({ ...newEventForm, tag: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Event">Event / Review</option>
                    <option value="Training">Training</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="admin-field-label">Time / Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 11:30 AM or All Day"
                  value={newEventForm.time}
                  onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROFILE */}
      {showEditProfileModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>Edit Administrator Profile</h3>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileEditForm.name}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, name: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">System Role &amp; Designation *</label>
                <input
                  type="text"
                  required
                  value={profileEditForm.role}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, role: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-field-label">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={profileEditForm.email}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, email: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="admin-field-label">Avatar Image URL</label>
                <input
                  type="url"
                  value={profileEditForm.avatar}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, avatar: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="admin-btn-action"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURE INTEGRATION (Screenshot 1) */}
      {configureIntegrationModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={20} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                    Configure {configureIntegrationModal.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>API webhooks, event triggers, and endpoint credentials</p>
                </div>
              </div>
              <button onClick={() => setConfigureIntegrationModal(null)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveIntegrationConfig}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="admin-field-label">Webhook Endpoint URL *</label>
                  <input
                    type="url"
                    required
                    value={configureIntegrationModal.webhookUrl || ''}
                    onChange={(e) => setConfigureIntegrationModal({ ...configureIntegrationModal, webhookUrl: e.target.value })}
                    className="admin-form-input"
                    placeholder="https://hooks.example.com/services/..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                  <div>
                    <label className="admin-field-label">API Key / Bot Token</label>
                    <input
                      type="password"
                      value={configureIntegrationModal.apiKey || ''}
                      onChange={(e) => setConfigureIntegrationModal({ ...configureIntegrationModal, apiKey: e.target.value })}
                      className="admin-form-input"
                      placeholder="xoxb-secret-token"
                    />
                  </div>
                  <div>
                    <label className="admin-field-label">Target Channel / ID</label>
                    <input
                      type="text"
                      value={configureIntegrationModal.channel || ''}
                      onChange={(e) => setConfigureIntegrationModal({ ...configureIntegrationModal, channel: e.target.value })}
                      className="admin-form-input"
                      placeholder="#channel-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-field-label">Sync Frequency</label>
                  <select
                    value={configureIntegrationModal.syncFreq || 'Real-time Webhook'}
                    onChange={(e) => setConfigureIntegrationModal({ ...configureIntegrationModal, syncFreq: e.target.value })}
                    className="admin-form-input"
                  >
                    <option value="Real-time Webhook">Real-time API Webhook (Instant)</option>
                    <option value="Every 5 minutes">Every 5 minutes batch</option>
                    <option value="Hourly Batch">Hourly Sync</option>
                    <option value="Daily Digest">Daily Summary at 08:00 AM</option>
                  </select>
                </div>

                <div>
                  <label className="admin-field-label">Integration Active Status</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      id="integ-active-chk"
                      checked={configureIntegrationModal.connected}
                      onChange={(e) => setConfigureIntegrationModal({ ...configureIntegrationModal, connected: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#38bdf8' }}
                    />
                    <label htmlFor="integ-active-chk" style={{ fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
                      Enable active real-time data streaming and event delivery
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const latency = Math.floor(Math.random() * 30) + 15;
                      triggerAdminToast(`✓ Connection verified: ${configureIntegrationModal.name} responded with HTTP 200 (${latency}ms)`);
                    }}
                    className="admin-btn-action"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Test Connection
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUPPORT TICKET DETAILS & REPLY (Screenshot 2) */}
      {selectedSupportTicket && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '580px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                    #TKT-00{selectedSupportTicket.id}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: selectedSupportTicket.priority === 'High' || selectedSupportTicket.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: selectedSupportTicket.priority === 'High' || selectedSupportTicket.priority === 'Urgent' ? '#f87171' : '#fbbf24'
                  }}>
                    {selectedSupportTicket.priority} Priority
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                  {selectedSupportTicket.subject}
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                  Raised by <strong style={{ color: '#cbd5e1' }}>{selectedSupportTicket.employee || 'Rahul Verma'}</strong> ({selectedSupportTicket.employeeId || 'EMP001'}) • {selectedSupportTicket.createdOn} • Category: {selectedSupportTicket.category}
                </div>
              </div>
              <button onClick={() => setSelectedSupportTicket(null)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>

            {/* Status Selector & Quick Resolution */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Status:</span>
                <select
                  value={selectedSupportTicket.status}
                  onChange={(e) => handleUpdateTicketStatus(selectedSupportTicket.id, e.target.value)}
                  className="admin-form-input"
                  style={{ width: '130px', height: '30px', fontSize: '0.76rem', padding: '2px 8px' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {selectedSupportTicket.status !== 'Resolved' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateTicketStatus(selectedSupportTicket.id, 'Resolved')}
                    className="admin-btn-action"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedSupportTicket.status !== 'Closed' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateTicketStatus(selectedSupportTicket.id, 'Closed')}
                    className="admin-btn-action"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#94a3b8' }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Conversation / Reply Thread */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', paddingRight: '4px' }}>
              <div style={{ padding: '12px 14px', background: 'rgba(56,189,248,0.06)', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.74rem' }}>
                  <strong style={{ color: '#38bdf8' }}>{selectedSupportTicket.employee || 'Rahul Verma'} (Employee)</strong>
                  <span style={{ color: '#64748b' }}>{selectedSupportTicket.createdOn}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {selectedSupportTicket.description}
                </div>
              </div>

              {(selectedSupportTicket.replies || []).map((rep, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: rep.sender.includes('Admin') || rep.sender.includes('Support') ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                    border: rep.sender.includes('Admin') || rep.sender.includes('Support') ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.72rem' }}>
                    <strong style={{ color: rep.sender.includes('Admin') || rep.sender.includes('Support') ? '#10b981' : '#cbd5e1' }}>
                      {rep.sender}
                    </strong>
                    <span style={{ color: '#64748b' }}>{rep.time}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {rep.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Response Box */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <textarea
                rows={2}
                value={ticketReplyText}
                onChange={(e) => setTicketReplyText(e.target.value)}
                placeholder="Type your response to the employee..."
                className="admin-form-input"
                style={{ flex: 1, height: 'auto', fontSize: '0.8rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendTicketReply();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSendTicketReply}
                disabled={!ticketReplyText.trim()}
                className="admin-btn-primary"
                style={{ padding: '8px 16px', height: '38px', fontSize: '0.78rem' }}
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GLOBAL AWARENESS POLICY VIEWER (Screenshot 3) */}
      {showGlobalPolicyModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#38bdf8" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                    Global Awareness Policy
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>Security Compliance & Data Privacy Guidelines (2026-Q4)</p>
                </div>
              </div>
              <button onClick={() => setShowGlobalPolicyModal(false)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6, maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ padding: '12px 14px', background: 'rgba(56,189,248,0.08)', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)' }}>
                <strong style={{ color: '#ffffff' }}>Mandatory Compliance Notice:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  All full-time employees, contractors, and administrative personnel must complete and adhere to organizational cybersecurity standards by 31 October 2026.
                </p>
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>1. Attendance & Terminal Integrity</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  Biometric thumbprints, facial scans, and RFID badge swipes must be performed exclusively in person by the authorized employee. Sharing PINs or credentials on kiosks is strictly prohibited.
                </p>
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>2. Remote Work & VPN Protocols</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  When working from home, all staff must access internal repositories and staging servers via VorldX Encrypted WireGuard VPN. Unsecured public Wi-Fi is strictly forbidden without active tunneling.
                </p>
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>3. Multi-Factor Authentication (MFA)</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  MFA is enforced across all admin portals and Google Workspace logins with 30-day session timeout cycles.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  id="policy-ack-chk"
                  checked={policyAcknowledged}
                  onChange={(e) => setPolicyAcknowledged(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                />
                <label htmlFor="policy-ack-chk" style={{ fontSize: '0.78rem', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>
                  I acknowledge and confirm compliance with VorldX Security Guidelines 2026
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setShowGlobalPolicyModal(false)}
                className="admin-btn-action"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setPolicyAcknowledged(true);
                  setShowGlobalPolicyModal(false);
                  triggerAdminToast('✓ Security compliance policy acknowledged and logged!');
                }}
                className="admin-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <CheckCircle size={14} /> Acknowledge & Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PENDING ITEM DETAILS & APPROVAL */}
      {selectedPendingItem && (
        <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
          <div className="admin-modal-content" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
                  {selectedPendingItem.id}
                </span>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '4px 0 0 0', fontWeight: 700 }}>
                  {selectedPendingItem.type} Request
                </h3>
              </div>
              <button onClick={() => setSelectedPendingItem(null)} className="admin-icon-btn">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#64748b' }}>Employee:</span>
                <strong style={{ color: '#ffffff' }}>{selectedPendingItem.employee} ({selectedPendingItem.empId})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#64748b' }}>Department:</span>
                <strong style={{ color: '#cbd5e1' }}>{selectedPendingItem.dept}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#64748b' }}>Scheduled Date / Duration:</span>
                <strong style={{ color: '#38bdf8' }}>{selectedPendingItem.date}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#64748b' }}>Urgency Level:</span>
                <strong style={{ color: selectedPendingItem.urgency === 'High' ? '#f87171' : '#94a3b8' }}>{selectedPendingItem.urgency}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Reason & Justification:</span>
                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {selectedPendingItem.details}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => {
                  handleRejectPendingItem(selectedPendingItem);
                  setSelectedPendingItem(null);
                }}
                className="admin-btn-action"
                style={{ flex: 1, justifyContent: 'center', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              >
                <X size={14} /> Reject Request
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApprovePendingItem(selectedPendingItem);
                  setSelectedPendingItem(null);
                }}
                className="admin-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Check size={14} /> Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TOAST NOTIFICATION */}
      {adminToastMsg && (
        <div className="admin-toast-notification">
          <CheckCircle size={16} color="#10b981" />
          <span>{adminToastMsg}</span>
        </div>
      )}
    </div>
  );
}
