'use client';

import { useState } from 'react';
import { DetectionResult } from '@/types/detection';

interface ResultCardProps {
  result: DetectionResult;
  imageUrl: string;
  capturedAt?: string;
  onNewAnalysis: () => void;
}

const severityConfig = {
  None: { color: '#2E6F40', bg: '#F3F7F4', label: 'Healthy' },
  Low: { color: '#D97706', bg: '#FFFBEB', label: 'Low Severity' },
  Moderate: { color: '#D97706', bg: '#FFFBEB', label: 'Moderate' },
  Critical: { color: '#C0392B', bg: '#FEF2F2', label: 'Critical' },
};

export default function ResultCard({ result, imageUrl, capturedAt, onNewAnalysis }: ResultCardProps) {
  const severity = severityConfig[result.severity] || severityConfig.Low;
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'organic' | 'chemical'>('diagnosis');
  const [showFullReport, setShowFullReport] = useState(false);

  return (
    <>
      <div style={{ padding: '32px 40px', maxWidth: 760, animation: 'fadeIn 0.4s ease both' }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 28,
                fontWeight: 700,
                color: '#1A241E',
                letterSpacing: '-0.02em',
                marginBottom: 4,
              }}
            >
              {result.plantName} {result.diseaseName !== 'Healthy' ? result.diseaseName : '— Healthy'}
            </h1>
            {result.scientificName && (
              <p style={{ fontSize: 13, color: '#6B6B63', fontStyle: 'italic' }}>{result.scientificName}</p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: severity.bg,
                  color: severity.color,
                  border: `1px solid ${severity.color}30`,
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {severity.label}
              </span>
              {result.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    background: '#F3F7F4',
                    color: '#2E6F40',
                    border: '1px solid #D4E7D7',
                    borderRadius: 20,
                    padding: '3px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence circle */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: `3px solid ${severity.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: severity.color, lineHeight: 1 }}>
              {result.confidence}%
            </span>
            <span style={{ fontSize: 8, color: '#B0B0A8', letterSpacing: '0.04em', marginTop: 1 }}>MATCH</span>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, alignItems: 'start' }}>
          {/* Left: image */}
          <div>
            <div
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                background: '#1A241E',
              }}
            >
              <img
                src={imageUrl}
                alt="Specimen"
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  background: 'rgba(26,36,30,0.85)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 9,
                  color: '#D4E7D7',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  border: '1px solid rgba(46,111,64,0.3)',
                }}
              >
                ⬡ SCANNING_ACTIVE_ELEMENTS_v4.2
              </div>
            </div>

            {/* Metadata */}
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                background: '#F7F7F4',
                borderRadius: 8,
                border: '1px solid #E8E8E4',
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#B0B0A8', marginBottom: 4 }}>
                IMAGE METADATA
              </div>
              <p style={{ fontSize: 11, color: '#6B6B63' }}>
                Captured: {capturedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Right: tabs + content */}
          <div>
            {/* Tab switcher */}
            <div
              style={{
                display: 'flex',
                gap: 2,
                borderBottom: '1px solid #E8E8E4',
                marginBottom: 16,
              }}
            >
              {(['diagnosis', 'organic', 'chemical'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: 12,
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? '#2E6F40' : '#6B6B63',
                    borderBottom: `2px solid ${activeTab === tab ? '#2E6F40' : 'transparent'}`,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    letterSpacing: '0.03em',
                    transition: 'all 0.15s',
                    marginBottom: -1,
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ animation: 'fadeIn 0.2s ease both' }}>
              {activeTab === 'diagnosis' && (
                <div>
                  <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.7, marginBottom: 16 }}>
                    {result.diagnosis}
                  </p>
                  {result.observationNotes.length > 0 && (
                    <div
                      style={{
                        background: '#F7F7F4',
                        borderRadius: 8,
                        padding: 14,
                        border: '1px solid #E8E8E4',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#2A2A25', letterSpacing: '0.04em' }}>
                          Observation Notes
                        </span>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {result.observationNotes.map((note, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#6B6B63', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <span style={{ color: '#2E6F40', marginTop: 2, flexShrink: 0 }}>•</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'organic' && (
                <div>
                  <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.7 }}>{result.organicRemedy}</p>
                  {result.prevention && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#2E6F40', letterSpacing: '0.04em', marginBottom: 6 }}>
                        PREVENTION
                      </div>
                      <p style={{ fontSize: 12, color: '#6B6B63', lineHeight: 1.7 }}>{result.prevention}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chemical' && (
                <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.7 }}>{result.chemicalRemedy}</p>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowFullReport(true)}
                style={{
                  flex: 1,
                  background: '#2E6F40',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 0',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#1A241E')}
                onMouseOut={e => (e.currentTarget.style.background = '#2E6F40')}
              >
                Full Report
              </button>
             
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL REPORT MODAL ── */}
     {showFullReport && (
  <div
    onClick={e => { if (e.target === e.currentTarget) setShowFullReport(false); }}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 18, 12, 0.72)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      animation: 'fadeIn 0.2s ease both',
    }}
  >
    {/* Injecting the scrollbar hiding style rules */}
    <style>{`
      .hide-scrollbar::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }
      .hide-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `}</style>

    <div
      className="hide-scrollbar" /* Added class name here */
      style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 780,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 32px 80px rgba(10,18,12,0.35)',
        animation: 'slideUp 0.25s ease both',
      }}
    >
      {/* Modal header bar */}
      <div
        style={{
          background: '#1A241E',
          borderRadius: '16px 16px 0 0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 9, color: '#D4E7D7', letterSpacing: '0.1em', fontWeight: 700 }}>
            ⬡ BOTANICAL INTELLIGENCE — FULL SPECIMEN REPORT
          </span>
        </div>
        <button
          onClick={() => setShowFullReport(false)}
          style={{
            background: 'rgba(212,231,215,0.12)',
            border: '1px solid rgba(212,231,215,0.2)',
            borderRadius: 6,
            color: '#D4E7D7',
            width: 28,
            height: 28,
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'rgba(212,231,215,0.22)')}
          onMouseOut={e => (e.currentTarget.style.background = 'rgba(212,231,215,0.12)')}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Modal body */}
      <div style={{ padding: '28px 32px' }}>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 26,
                fontWeight: 700,
                color: '#1A241E',
                letterSpacing: '-0.02em',
                marginBottom: 4,
              }}
            >
              {result.plantName} {result.diseaseName}
            </h2>
            {result.scientificName && (
              <p style={{ fontSize: 13, color: '#6B6B63', fontStyle: 'italic', marginBottom: 10 }}>
                {result.scientificName}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  background: severity.bg,
                  color: severity.color,
                  border: `1px solid ${severity.color}30`,
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {severity.label}
              </span>
              {result.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    background: '#F3F7F4',
                    color: '#2E6F40',
                    border: '1px solid #D4E7D7',
                    borderRadius: 20,
                    padding: '3px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: `3px solid ${severity.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 800, color: severity.color, lineHeight: 1 }}>
              {result.confidence}%
            </span>
            <span style={{ fontSize: 8, color: '#B0B0A8', letterSpacing: '0.04em', marginTop: 2 }}>MATCH</span>
          </div>
        </div>

        {/* Full image */}
        <div
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            background: '#1A241E',
            marginBottom: 24,
          }}
        >
          <img
            src={imageUrl}
            alt="Full specimen"
            style={{ width: '100%', maxHeight: 360, objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(26,36,30,0.85)',
              backdropFilter: 'blur(6px)',
              borderRadius: 4,
              padding: '4px 10px',
              fontSize: 9,
              color: '#D4E7D7',
              letterSpacing: '0.06em',
              fontWeight: 600,
              border: '1px solid rgba(46,111,64,0.3)',
            }}
          >
            ⬡ SCANNING_ACTIVE_ELEMENTS_v4.2
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              background: 'rgba(26,36,30,0.85)',
              backdropFilter: 'blur(6px)',
              borderRadius: 4,
              padding: '4px 10px',
              fontSize: 9,
              color: '#D4E7D7',
              letterSpacing: '0.06em',
              fontWeight: 600,
              border: '1px solid rgba(46,111,64,0.3)',
            }}
          >
            Captured: {capturedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* 3-col stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'CONFIDENCE', value: `${result.confidence}%` },
            { label: 'SEVERITY', value: result.severity },
            { label: 'STATUS', value: result.isHealthy ? 'Healthy' : 'Diseased' },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                background: '#F7F7F4',
                border: '1px solid #E8E8E4',
                borderRadius: 10,
                padding: '14px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#B0B0A8', marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1A241E' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Diagnosis section */}
        <Section title="Diagnosis">
          <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.8 }}>{result.diagnosis}</p>
          {result.observationNotes.length > 0 && (
            <div
              style={{
                marginTop: 14,
                background: '#F7F7F4',
                borderRadius: 8,
                padding: 14,
                border: '1px solid #E8E8E4',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: '#2E6F40', letterSpacing: '0.04em', marginBottom: 8 }}>
                OBSERVATION NOTES
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.observationNotes.map((note, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#6B6B63', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#2E6F40', marginTop: 2, flexShrink: 0 }}>•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* Organic remedy */}
        <Section title="Organic Remedy">
          <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.8 }}>{result.organicRemedy}</p>
        </Section>

        {/* Chemical remedy */}
        <Section title="Chemical Treatment">
          <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.8 }}>{result.chemicalRemedy}</p>
        </Section>

        {/* Prevention */}
        {result.prevention && (
          <Section title="Prevention">
            <p style={{ fontSize: 13, color: '#2A2A25', lineHeight: 1.8 }}>{result.prevention}</p>
          </Section>
        )}

        {/* Close button */}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowFullReport(false)}
            style={{
              background: '#1A241E',
              color: '#D4E7D7',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'background 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#2E6F40')}
            onMouseOut={e => (e.currentTarget.style.background = '#1A241E')}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#2E6F40',
          }}
        >
          {title.toUpperCase()}
        </span>
        <div style={{ flex: 1, height: 1, background: '#E8E8E4' }} />
      </div>
      {children}
    </div>
  );
}