'use client';

interface NavbarProps {
  activeTab: 'history' | 'lab' | 'support';
  onTabChange: (tab: 'history' | 'lab' | 'support') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs: Array<{ id: 'history' | 'lab' | 'support'; label: string }> = [
    { id: 'history', label: 'History' },
    { id: 'lab', label: 'Lab' },
    { id: 'support', label: 'Support' },
  ];

  return (
    <nav
      style={{
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #E8E8E4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
      }}
    >
      {/* Brand + Tabs — LEFT group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: '#2E6F40',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2C6 2 3.5 4.5 3.5 7.5C3.5 10 5 12 7 13V16H11V13C13 12 14.5 10 14.5 7.5C14.5 4.5 12 2 9 2Z"
                fill="white"
                opacity="0.9"
              />
              <line x1="9" y1="13" x2="9" y2="16" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 16,
              fontWeight: 700,
              color: '#1A241E',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Botanical Intelligence
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  padding: '5px 12px',
                  fontSize: 13,
                  fontFamily: 'var(--font-jakarta), sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#2E6F40' : '#6B6B63',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #2E6F40' : '2px solid transparent',
                  borderRadius: 0,
                  cursor: 'pointer',
                  lineHeight: '24px',
                  transition: 'color 0.15s, border-color 0.15s',
                  outline: 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings icon — RIGHT */}
      <button
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          color: '#6B6B63',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#F3F3F0';
          (e.currentTarget as HTMLButtonElement).style.color = '#1A241E';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = '#6B6B63';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </nav>
  );
}