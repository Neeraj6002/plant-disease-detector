'use client';

interface ScanningChamberProps {
  onUploadSimulate: () => void;
}

export default function ScanningChamber({ onUploadSimulate }: ScanningChamberProps) {
  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.3s ease both' }}>
      {/* Header Accent block container setup */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 40, alignItems: 'flex-start' }}>
        <div style={{ width: 2, height: 72, backgroundColor: '#2E6F40', flexShrink: 0 }} />
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 36,
              fontWeight: 400,
              color: '#1A241E',
              margin: '0 0 8px 0',
              lineHeight: 1.1,
            }}
          >
            Scanning Chamber
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B63', lineHeight: 1.6, margin: 0, maxWidth: 600 }}>
            Deploy our neural-augmented visual analysis tool to identify pathogens, nutrient deficiencies, or pests in botanical specimens with scientific precision.
          </p>
        </div>
      </div>

      {/* Interactive Drop Box Area */}
      <div
        onClick={onUploadSimulate}
        style={{
          border: '1px dashed #D4D4CC',
          backgroundColor: '#FBFBF9',
          borderRadius: 4,
          padding: '64px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
          marginBottom: 40
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = '#2E6F40'}
        onMouseOut={e => e.currentTarget.style.borderColor = '#D4D4CC'}
      >
        <div style={{ width: 48, height: 48, backgroundColor: '#E2ECE5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        </div>
        <div style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 18, color: '#1A241E', marginBottom: 6 }}>
          Drop leaf image here or <span style={{ textDecoration: 'underline', color: '#2E6F40' }}>click to browse.</span>
        </div>
        <div style={{ fontSize: 11, color: '#8A8A80' }}>
          High-resolution JPG or PNG supported (max 25MB).
        </div>
      </div>

      {/* Bottom Technical Principles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, paddingTop: 32, borderTop: '1px solid #E8E8E4' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1A241E', letterSpacing: '0.04em', marginBottom: 8 }}>01. PRECISION</div>
          <div style={{ fontSize: 12, color: '#6B6B63', lineHeight: 1.5 }}>Models are trained on 400,000+ clinical plant pathology samples ensuring 99.2% accuracy.</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1A241E', letterSpacing: '0.04em', marginBottom: 8 }}>02. LIGHTING</div>
          <div style={{ fontSize: 12, color: '#6B6B63', lineHeight: 1.5 }}>For optimal results, use neutral, top-down lighting and a high-contrast monochromatic background.</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1A241E', letterSpacing: '0.04em', marginBottom: 8 }}>03. RESPONSE</div>
          <div style={{ fontSize: 12, color: '#6B6B63', lineHeight: 1.5 }}>Real-time processing provides taxonomic identification and treatment protocol recommendations.</div>
        </div>
      </div>
    </div>
  );
}