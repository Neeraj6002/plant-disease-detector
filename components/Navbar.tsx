'use client';

interface NavbarProps {
  activeTab: 'history' | 'lab' | 'support';
  onTabChange: (tab: 'history' | 'lab' | 'support') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <>
      <style>{`
        .navbar {
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #E8E8E4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          flex-shrink: 0;
        }
        .navbar-brand-text {
          font-family: var(--font-playfair), serif;
          font-size: 16px;
          font-weight: 700;
          color: #1A241E;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 0 16px;
          }
          .navbar-brand-text {
            font-size: 14px;
          }
        }
      `}</style>

      <nav className="navbar">
        {/* Brand — LEFT */}
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
          <span className="navbar-brand-text">Botanical Intelligence</span>
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
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F3F3F0';
            e.currentTarget.style.color = '#1A241E';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6B6B63';
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
    </>
  );
}