import React from 'react';
import KioskDisplay from './KioskDisplay';
import EmployeeApp from './EmployeeApp';
import { Sparkles, ArrowRight, Building2, FileText, CheckCircle2 } from 'lucide-react';

export default function SplitView({ setActiveTab }) {
  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px 20px' }}>
      {/* Banner / Instructions */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: '16px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Side-by-Side End-to-End Simulation
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scan the rotating QR on the <strong>Left Kiosk</strong> using the <strong>Right Employee Phone</strong>. Watch the live ticker update instantly!
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('admin')}
            className="btn btn-secondary btn-sm"
          >
            <Building2 size={14} /> Open HR Admin Portal
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className="btn btn-primary btn-sm"
          >
            <FileText size={14} /> View Project Report
          </button>
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Left: Office QR Display Kiosk */}
        <div>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>📺 Office Screen Component</span>
            <span style={{ color: '#38bdf8' }}>(Lucknow Reception)</span>
          </div>
          <KioskDisplay isEmbedded={true} />
        </div>

        {/* Right: Employee Mobile Application */}
        <div>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>📱 VorldX Employee App</span>
            <span style={{ color: '#818cf8' }}>(Mobile Interface)</span>
          </div>
          <EmployeeApp isEmbedded={true} />
        </div>
      </div>
    </div>
  );
}
