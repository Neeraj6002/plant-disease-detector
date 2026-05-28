'use client';

interface LoadingSpinnerProps {
  imageUrl?: string;
}

export default function LoadingSpinner({ imageUrl }: LoadingSpinnerProps) {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 680, animation: 'fadeIn 0.3s ease both' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#1A241E',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          Processing Lens
        </h1>
        <p style={{ fontSize: 14, color: '#6B6B63', lineHeight: 1.6 }}>
          Neural-augmented visual analysis in progress. Identifying pathogens, nutrient deficiencies, and pests.
        </p>
      </div>

      {/* Preview with scan overlay */}
      <div
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          background: '#1A241E',
          aspectRatio: '4/3',
          maxHeight: 320,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Processing"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
        )}

        {/* Scan line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #2E6F40 30%, #7ec99a 50%, #2E6F40 70%, transparent 100%)',
            animation: 'scan-line 2.5s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(46,111,64,0.8)',
          }}
        />

        {/* Corner brackets */}
        {[
          { top: 16, left: 16, borderTop: '2px solid #2E6F40', borderLeft: '2px solid #2E6F40' },
          { top: 16, right: 16, borderTop: '2px solid #2E6F40', borderRight: '2px solid #2E6F40' },
          { bottom: 16, left: 16, borderBottom: '2px solid #2E6F40', borderLeft: '2px solid #2E6F40' },
          { bottom: 16, right: 16, borderBottom: '2px solid #2E6F40', borderRight: '2px solid #2E6F40' },
        ].map((style, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 20,
              height: 20,
              ...style,
            }}
          />
        ))}

        {/* Center crosshair */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            border: '1.5px solid rgba(46,111,64,0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '1.5px solid rgba(126,201,154,0.4)',
              borderRadius: '50%',
              position: 'absolute',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7ec99a" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        {/* Status label */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(26,36,30,0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 6,
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(46,111,64,0.3)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#2E6F40',
              animation: 'pulse-ring 1.5s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: 10, color: '#D4E7D7', fontWeight: 600, letterSpacing: '0.08em' }}>
            SCANNING_ACTIVE_ELEMENTS_v4.2
          </span>
        </div>
      </div>

      {/* Progress steps */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Image preprocessing & normalization', done: true },
          { label: 'Pathogen pattern recognition', done: true },
          { label: 'Severity assessment', done: false },
          { label: 'Treatment protocol generation', done: false },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: `2px solid ${step.done ? '#2E6F40' : '#D4E7D7'}`,
                background: step.done ? '#2E6F40' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s',
              }}
            >
              {step.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {!step.done && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: '2px solid #D4E7D7',
                    borderTopColor: '#2E6F40',
                    animation: i === 2 ? 'spin 1s linear infinite' : 'none',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 12, color: step.done ? '#2A2A25' : '#B0B0A8' }}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
