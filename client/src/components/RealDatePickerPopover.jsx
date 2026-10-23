import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function RealDatePickerPopover({
  selectedMonthYear, // e.g. "October 2026"
  onSelectMonthYear, // callback (monthYearStr, { month, year }) => void
  onSelectDate,      // optional callback (dateStr, dateObj) => void
  align = 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Parse initial month & year from prop or default to Oct 2026 / today
  const parseInitial = () => {
    if (selectedMonthYear) {
      const parts = selectedMonthYear.split(' ');
      if (parts.length === 2) {
        const mIdx = MONTH_NAMES.findIndex(m => m.toLowerCase().startsWith(parts[0].toLowerCase()));
        const y = parseInt(parts[1], 10);
        if (mIdx !== -1 && !isNaN(y)) {
          return { month: mIdx, year: y };
        }
      }
    }
    return { month: 9, year: 2026 }; // October 2026 default
  };

  const [calState, setCalState] = useState(parseInitial);
  const [selectedDay, setSelectedDay] = useState(16);

  // Sync if selectedMonthYear changes externally
  useEffect(() => {
    setCalState(parseInitial());
  }, [selectedMonthYear]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCalState(prev => {
      const nextMonth = prev.month === 0 ? 11 : prev.month - 1;
      const nextYear = prev.month === 0 ? prev.year - 1 : prev.year;
      const next = { month: nextMonth, year: nextYear };
      if (onSelectMonthYear) {
        onSelectMonthYear(`${MONTH_NAMES[next.month]} ${next.year}`, { month: next.month, year: next.year });
      }
      return next;
    });
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCalState(prev => {
      const nextMonth = prev.month === 11 ? 0 : prev.month + 1;
      const nextYear = prev.month === 11 ? prev.year + 1 : prev.year;
      const next = { month: nextMonth, year: nextYear };
      if (onSelectMonthYear) {
        onSelectMonthYear(`${MONTH_NAMES[next.month]} ${next.year}`, { month: next.month, year: next.year });
      }
      return next;
    });
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    const formattedMonthYear = `${MONTH_NAMES[calState.month]} ${calState.year}`;
    const fullDateStr = `${day} ${formattedMonthYear}`;
    
    if (onSelectMonthYear) {
      onSelectMonthYear(formattedMonthYear, { month: calState.month, year: calState.year });
    }
    if (onSelectDate) {
      onSelectDate(fullDateStr, new Date(calState.year, calState.month, day));
    }
    setIsOpen(false);
  };

  const handleSetToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    setCalState({ month: today.getMonth(), year: today.getFullYear() });
    setSelectedDay(today.getDate());
    const formatted = `${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;
    if (onSelectMonthYear) {
      onSelectMonthYear(formatted, { month: today.getMonth(), year: today.getFullYear() });
    }
    setIsOpen(false);
  };

  const handleQuickOct2026 = (e) => {
    e.stopPropagation();
    setCalState({ month: 9, year: 2026 });
    setSelectedDay(16);
    if (onSelectMonthYear) {
      onSelectMonthYear('October 2026', { month: 9, year: 2026 });
    }
    setIsOpen(false);
  };

  // Math for calendar grid
  const firstDayIndex = new Date(calState.year, calState.month, 1).getDay(); // 0=Sun, 1=Mon ...
  const daysInMonth = new Date(calState.year, calState.month + 1, 0).getDate();
  const daysInPrevMonth = new Date(calState.year, calState.month, 0).getDate();

  // Previous month trailing padding days
  const prevDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevDays.push(daysInPrevMonth - i);
  }

  // Trailing next month days to complete 35 or 42 grid cells
  const totalOccupied = prevDays.length + daysInMonth;
  const totalGridCells = totalOccupied > 35 ? 42 : 35;
  const nextDaysCount = totalGridCells - totalOccupied;
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

  const displayLabel = selectedMonthYear || `${MONTH_NAMES[calState.month]} ${calState.year}`;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={popoverRef}>
      {/* The Trigger Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Click to open interactive calendar picker"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: isOpen ? '#1e293b' : '#101a2e',
          border: isOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
          padding: '7px 14px',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#ffffff',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: isOpen ? '0 0 14px rgba(56, 189, 248, 0.25)' : 'none'
        }}
      >
        <Calendar size={14} color="#38bdf8" />
        <span>{displayLabel}</span>
        <ChevronDown 
          size={13} 
          color="#94a3b8" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          [align === 'right' ? 'right' : 'left']: 0,
          width: '320px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)',
          backdropFilter: 'blur(16px)',
          padding: '16px',
          zIndex: 1000,
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Header Month / Year Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px'
          }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Selectable Month & Year */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <select
                value={calState.month}
                onChange={(e) => {
                  const newM = parseInt(e.target.value, 10);
                  setCalState(prev => {
                    const next = { ...prev, month: newM };
                    if (onSelectMonthYear) {
                      onSelectMonthYear(`${MONTH_NAMES[next.month]} ${next.year}`, { month: next.month, year: next.year });
                    }
                    return next;
                  });
                }}
                style={{
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={calState.year}
                onChange={(e) => {
                  const newY = parseInt(e.target.value, 10);
                  setCalState(prev => {
                    const next = { ...prev, year: newY };
                    if (onSelectMonthYear) {
                      onSelectMonthYear(`${MONTH_NAMES[next.month]} ${next.year}`, { month: next.month, year: next.year });
                    }
                    return next;
                  });
                }}
                style={{
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Names Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#64748b',
            marginBottom: '8px'
          }}>
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Calendar Grid of Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '14px'
          }}>
            {/* Dim days from previous month */}
            {prevDays.map(d => (
              <div
                key={`prev-${d}`}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: '#334155',
                  borderRadius: '6px'
                }}
              >
                {d}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const isSelected = selectedDay === d;
              const isToday = calState.year === 2026 && calState.month === 9 && d === 16;
              const dayOfWeek = (firstDayIndex + i) % 7;
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

              return (
                <button
                  type="button"
                  key={`day-${d}`}
                  onClick={() => handleSelectDay(d)}
                  style={{
                    aspectRatio: '1',
                    background: isSelected ? '#0284c7' : isToday ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #38bdf8' : isToday ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '6px',
                    color: isSelected ? '#ffffff' : isWeekend ? '#94a3b8' : '#e2e8f0',
                    fontSize: '0.78rem',
                    fontWeight: isSelected || isToday ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <span>{d}</span>
                  {isToday && (
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8', marginTop: '1px' }} />
                  )}
                </button>
              );
            })}

            {/* Dim days for next month */}
            {nextDays.map(d => (
              <div
                key={`next-${d}`}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: '#334155',
                  borderRadius: '6px'
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Quick Footer Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '10px'
          }}>
            <button
              type="button"
              onClick={handleQuickOct2026}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 6px'
              }}
            >
              Default (Oct 2026)
            </button>

            <button
              type="button"
              onClick={handleSetToday}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#10b981',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 6px'
              }}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '4px',
                padding: '3px 8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
