'use client';

import { useState, useRef, DragEvent } from 'react';

interface ImageUploaderProps {
  onUpload: (file: File, previewUrl: string) => void;
  isProcessing: boolean;
}

export default function ImageUploader({ onUpload, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    onUpload(file, url);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  return (
    <>
      <style>{`
        .uploader-root {
          padding: 40px 48px 32px;
          max-width: 780px;
          width: 100%;
          animation: fadeIn 0.35s ease both;
        }
        .uploader-title {
          font-family: var(--font-playfair), serif;
          font-size: 38px;
          font-weight: 700;
          color: #1A241E;
          letter-spacing: -0.025em;
          margin-bottom: 10px;
          line-height: 1.15;
        }
        .uploader-subtitle {
          font-size: 14px;
          color: #6B6B63;
          line-height: 1.65;
          max-width: 500px;
        }
        .drop-zone {
          border-radius: 14px;
          padding: 70px 40px;
          text-align: center;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-top: 44px;
          padding-top: 28px;
          border-top: 1px solid #E8E8E4;
        }

        @media (max-width: 768px) {
          .uploader-root {
            padding: 24px 20px 24px;
          }
          .uploader-title {
            font-size: 28px;
          }
          .drop-zone {
            padding: 48px 24px;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 28px;
          }
        }

        @media (max-width: 480px) {
          .uploader-root {
            padding: 16px 14px 20px;
          }
          .uploader-title {
            font-size: 24px;
          }
          .uploader-subtitle {
            font-size: 13px;
          }
          .drop-zone {
            padding: 36px 16px;
          }
        }
      `}</style>

      <div className="uploader-root">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="uploader-title">Scanning Chamber</h1>
          <p className="uploader-subtitle">
            Deploy our neural-augmented visual analysis tool to identify pathogens,
            nutrient deficiencies, or pests in botanical specimens with scientific precision.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className="drop-zone"
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          style={{
            border: `1.5px dashed ${isDragging ? '#2E6F40' : '#C8D8CA'}`,
            cursor: isProcessing ? 'default' : 'pointer',
            background: isDragging ? '#F3F7F4' : '#FAFAF8',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '1.5px solid #C8D8CA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              background: '#fff',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2E6F40" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>

          <p style={{ fontSize: 16, fontWeight: 600, color: '#1A241E', marginBottom: 6 }}>
            Drop leaf image here or click to browse.
          </p>
          <p style={{ fontSize: 13, color: '#B0B0A8' }}>
            High-resolution JPG or PNG supported (max 25MB).
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            disabled={isProcessing}
            style={{
              background: '#2E6F40',
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              padding: '11px 28px',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              transition: 'background 0.15s',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
            onMouseOver={e => !isProcessing && (e.currentTarget.style.background = '#1A241E')}
            onMouseOut={e => (e.currentTarget.style.background = '#2E6F40')}
          >
            Upload Specimen
          </button>
        </div>

        {/* Info footer */}
        <div className="info-grid">
          {[
            {
              num: '01. PRECISION',
              desc: 'Our models are trained on 400,000+ clinical plant pathology samples ensuring 99.2% diagnostic accuracy.',
            },
            {
              num: '02. LIGHTING',
              desc: 'For optimal results, use neutral, top-down lighting and a high-contrast monochromatic background.',
            },
            {
              num: '03. RESPONSE',
              desc: 'Real-time processing provides taxonomic identification and treatment protocol recommendations instantly.',
            },
          ].map(item => (
            <div key={item.num}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#2E6F40',
                  letterSpacing: '0.10em',
                  marginBottom: 8,
                }}
              >
                {item.num}
              </div>
              <p style={{ fontSize: 12, color: '#6B6B63', lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}