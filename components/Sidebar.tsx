'use client';

import { HistoryEntry } from '@/types/detection';

interface SidebarProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onNew: () => void;
  activeId?: string;
}

const tagColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('healthy')) return '#2E6F40';
  if (t.includes('fungal') || t.includes('critical') || t.includes('blight') || t.includes('wilt')) return '#C0392B';
  return '#D97706';
};

export default function Sidebar({ history, onSelect, onNew, activeId }: SidebarProps) {
  return (
    <aside
      style={{
        width: 208,
        minWidth: 208,
        background: '#FAFAF8',
        borderRight: '1px solid #E8E8E4',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
      }}
    >
      {/* History Vault header */}
      <div style={{ padding: '22px 18px 14px' }}>
        <div
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 16,
            fontWeight: 700,
            color: '#1A241E',
            marginBottom: 3,
          }}
        >
          History Vault
        </div>
        <div
          style={{
            fontSize: 10,
            color: '#B0B0A8',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Scientific Archive
        </div>
      </div>

      <div style={{ height: 1, background: '#E8E8E4', margin: '0 18px' }} />

      {/* History list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {history.length === 0 && (
          <div
            style={{
              padding: '32px 18px',
              textAlign: 'center',
              color: '#B0B0A8',
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            No analyses yet.<br />Upload a specimen to begin.
          </div>
        )}
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 14px 9px 16px',
              background: activeId === entry.id ? '#EEF5F0' : 'transparent',
              border: 'none',
              borderLeft: `3px solid ${activeId === entry.id ? '#2E6F40' : 'transparent'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onMouseOver={e => {
              if (activeId !== entry.id) e.currentTarget.style.background = '#F3F7F4';
            }}
            onMouseOut={e => {
              if (activeId !== entry.id) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 7,
                overflow: 'hidden',
                flexShrink: 0,
                background: '#E8E8E4',
              }}
            >
              {entry.imageUrl && (
                <img src={entry.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: tagColor(entry.tag),
                  marginBottom: 2,
                }}
              >
                {entry.tag}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1A241E',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                }}
              >
                {entry.label}
              </div>
              <div style={{ fontSize: 10, color: '#B0B0A8', marginTop: 2 }}>{entry.date}</div>
            </div>
          </button>
        ))}
      </div>

      {/* New Analysis button */}
      <div style={{ padding: '12px 14px 10px' }}>
        <button
          onClick={onNew}
          style={{
            width: '100%',
            background: '#2E6F40',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#1A241E')}
          onMouseOut={e => (e.currentTarget.style.background = '#2E6F40')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Analysis
        </button>
      </div>

      {/* User avatar row */}
      <div
        style={{
          padding: '10px 14px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderTop: '1px solid #E8E8E4',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#1A241E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#D4E7D7' }}>N</span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 12,
            fontWeight: 600,
            color: '#2E6F40',
          }}
        >
          Botanical Intelligence
        </span>
      </div>
    </aside>
  );
}
