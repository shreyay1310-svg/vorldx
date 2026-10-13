import React from 'react';
import { 
  Printer, 
  Download, 
  CheckCircle, 
  Database, 
  Server, 
  Smartphone, 
  Building2, 
  QrCode, 
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Users,
  Tv
} from 'lucide-react';

export default function ProjectReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        background: '#111c34',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <FileText size={16} color="#38bdf8" />
          <span>VorldX Employee Attendance System — Official Project Documentation</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary btn-sm"
          >
            <Printer size={15} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Report Body */}
      <div style={{
        background: '#0d1527',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '48px',
        boxShadow: 'var(--shadow-card)',
        lineHeight: 1.7
      }}>
        {/* Cover Header */}
        <div style={{
          borderBottom: '2px solid rgba(56, 189, 248, 0.3)',
          paddingBottom: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em'
                }}>
                  VORLD<span style={{ color: '#38bdf8' }}>X</span>
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 700
                }}>
                  FULL-STACK SUBMISSION REPORT
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Employee Attendance System
              </h1>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '6px' }}>
                18 UI Screens • Role-Based Access Control • WFH Approval Workflow
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>VORLDX INDUSTRIES PRIVATE LIMITED</div>
              <div>CIN: U62099UP2026PTC245598</div>
              <div>Headquartered in Lucknow, U.P., India</div>
              <div>hello@vorldx.com</div>
              <div style={{ marginTop: '4px', color: '#38bdf8' }}>Date: October 2026</div>
            </div>
          </div>
        </div>

        {/* Section 1: Overview */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#38bdf8', marginBottom: '10px' }}>
            1. Project Overview & System Components
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '0.925rem', marginBottom: '12px' }}>
            The <strong>VorldX Employee Attendance System</strong> is a full-stack corporate attendance solution developed for VorldX Industries Private Limited. The architecture connects three unified tiers: an Admin & HR web application, a responsive employee mobile application, and a supporting full-screen office QR display kiosk.
          </p>
        </section>

        {/* Section 2: Catalog of 18 UI Screens */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#38bdf8', marginBottom: '14px' }}>
            2. Implemented 18 UI Screens Catalog
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Admin Website Screens */}
            <div style={{ background: '#111c34', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Building2 size={18} color="#38bdf8" />
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>A. Admin / HR Website (Screens 1 – 10)</h4>
              </div>
              <ol style={{ paddingLeft: '18px', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <li><strong>Admin Login:</strong> Role-aware login (`admin@vorldx.com`, `sneha.verma@vorldx.com`).</li>
                <li><strong>Admin Dashboard:</strong> Total 50, Present 32, WFH 8, Late 5, Bar Chart & Activities.</li>
                <li><strong>Employee Management:</strong> Search, department filter, table, pagination, Add modal.</li>
                <li><strong>Employee Profile:</strong> Rohit Sharma (`VX001`), Overview, Attendance, WFH tabs.</li>
                <li><strong>Attendance Management:</strong> 01-31 Oct filter, status, hours, regularization modal.</li>
                <li><strong>WFH Requests Management:</strong> All (12), Pending (4), Approved (6), Rejected (2).</li>
                <li><strong>Policy & Shift Settings:</strong> 09:00 - 18:00, 15m grace, applicable days.</li>
                <li><strong>Office QR Displays:</strong> Registry of 4 displays (`QR001` to `QR004`).</li>
                <li><strong>Reports & Analytics:</strong> 85% rate, 32 Present, 8 WFH, 5 Late, donut chart.</li>
                <li><strong>Audit Logs:</strong> Immutable activity history with timestamps.</li>
              </ol>
            </div>

            {/* Mobile App Screens */}
            <div style={{ background: '#111c34', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Smartphone size={18} color="#818cf8" />
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>B. Employee Mobile App (Screens 11 – 17)</h4>
              </div>
              <ol start="11" style={{ paddingLeft: '18px', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <li><strong>Login / Register:</strong> ID input (`VX001`), Login/Register tabs.</li>
                <li><strong>OTP Verification:</strong> 6-digit OTP input boxes with demo OTP (`123456`).</li>
                <li><strong>Home Dashboard:</strong> Today's status, Check-in `09:05 AM`, big Scan button.</li>
                <li><strong>QR Scan:</strong> Camera viewfinder, target corners, flashlight toggle.</li>
                <li><strong>WFH Request:</strong> Date picker, reason, submit, previous requests history.</li>
                <li><strong>Attendance History:</strong> Month selector ('&lt; October 2026 &gt;'), list rows.</li>
                <li><strong>Employee Profile:</strong> Avatar, personal details, change password, Logout.</li>
              </ol>
            </div>

            {/* Office QR Screen */}
            <div style={{ background: '#111c34', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Tv size={18} color="#34d399" />
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem' }}>C. Office QR Display (Screen 18)</h4>
              </div>
              <ol start="18" style={{ paddingLeft: '18px', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                <li><strong>Full-screen Attendance Display:</strong> VorldX branding, `15 Oct 2026 10:24:30 AM` clock, rotating dynamic QR code, `Valid for: 45 seconds` countdown ring, and corporate footer.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 3: RBAC Matrix */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#38bdf8', marginBottom: '12px' }}>
            3. Role-Based Access Control (RBAC) Matrix
          </h2>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Admin</th>
                  <th>HR</th>
                  <th>Employee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dashboard</td>
                  <td>Full system overview & metrics</td>
                  <td>HR-related overview</td>
                  <td>Personal overview</td>
                </tr>
                <tr>
                  <td>Employee records</td>
                  <td>Full access (CRUD)</td>
                  <td>Manage as permitted</td>
                  <td>Own profile only</td>
                </tr>
                <tr>
                  <td>Attendance</td>
                  <td>All records; permitted corrections</td>
                  <td>Employee records; permitted corrections</td>
                  <td>Own records</td>
                </tr>
                <tr>
                  <td>Employee WFH approval</td>
                  <td>Optional override</td>
                  <td>Approve / Reject (Decision maker)</td>
                  <td>Submit & view status</td>
                </tr>
                <tr>
                  <td>HR WFH approval</td>
                  <td>Approve / Reject (Decision maker)</td>
                  <td>Submit & view own status</td>
                  <td>No access</td>
                </tr>
                <tr>
                  <td>Policies and shifts</td>
                  <td>Manage</td>
                  <td>View / limited management</td>
                  <td>No access</td>
                </tr>
                <tr>
                  <td>Reports & audit logs</td>
                  <td>Full access</td>
                  <td>Limited access</td>
                  <td>Own history</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: WFH Approval Workflow */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#38bdf8', marginBottom: '12px' }}>
            4. Hierarchical WFH Approval Workflow
          </h2>

          <div style={{
            background: '#111c34',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <strong style={{ color: '#38bdf8' }}>Route 1: Employee WFH Workflow</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '4px' }}>
                  Requester: <strong>Employee</strong> (e.g. Rohit Sharma)<br />
                  Destination: <strong>HR Dashboard / Notification Queue</strong><br />
                  Decision Maker: <strong>HR</strong> (Sneha Verma)<br />
                  Result: Employee sees Pending → Approved / Rejected (Auto-logs to Attendance table upon approval).
                </p>
              </div>

              <div>
                <strong style={{ color: '#818cf8' }}>Route 2: HR WFH Workflow</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '4px' }}>
                  Requester: <strong>HR Manager</strong> (Sneha Verma)<br />
                  Destination: <strong>Admin Dashboard / Notification Queue</strong><br />
                  Decision Maker: <strong>Super Admin</strong> (Vikram Singhania)<br />
                  Result: HR sees Pending → Approved / Rejected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Verification Sign-off */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff' }}>VORLDX INDUSTRIES PRIVATE LIMITED</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              18 UI Screens • Role-Based Access Control • WFH Approval Workflow Completed
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            <CheckCircle size={15} /> All 18 Screens Verified & Operational
          </div>
        </div>
      </div>
    </div>
  );
}
