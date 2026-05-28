'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultCard from '@/components/ResultCard';
import { DetectionResult, HistoryEntry } from '@/types/detection';

type View = 'upload' | 'processing' | 'result';

export default function HomePage() {
  const [view, setView] = useState<View>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'history' | 'lab' | 'support'>('lab');
  const [capturedAt, setCapturedAt] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUpload = useCallback(async (file: File, preview: string) => {
    setPreviewUrl(preview);
    setError('');
    setView('processing');
    setSidebarOpen(false);
    setCapturedAt(
      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    );

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Detection failed');
      }

      const data: DetectionResult = await res.json();
      setResult(data);
      setView('result');

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        imageUrl: preview,
        label: data.isHealthy ? data.plantName : `${data.plantName} ${data.diseaseName}`,
        tag: data.isHealthy ? 'Healthy' : (data.tags[0] || data.severity),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        result: data,
      };
      setHistory(prev => [entry, ...prev]);
      setActiveHistoryId(entry.id);
      setActiveTab('history');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setView('upload');
    }
  }, []);

  const handleSelectHistory = (entry: HistoryEntry) => {
    setResult(entry.result);
    setPreviewUrl(entry.imageUrl);
    setActiveHistoryId(entry.id);
    setView('result');
    setSidebarOpen(false);
  };

  const handleNew = () => {
    setView('upload');
    setResult(null);
    setPreviewUrl('');
    setError('');
    setActiveHistoryId('');
    setActiveTab('lab');
  };

  return (
    <>
      <style>{`
        .app-shell {
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: #FAFAF8;
          overflow: hidden;
        }
        .app-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
          position: relative;
        }
        /* Sidebar overlay for mobile */
        .sidebar-overlay {
          display: none;
        }
        .sidebar-wrapper {
          flex-shrink: 0;
        }
        .main-content {
          flex-grow: 1;
          padding: 40px 56px 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .mobile-sidebar-toggle {
          display: none;
        }
        .error-banner {
          width: 100%;
          max-width: 780px;
          margin: 0 0 16px 0;
          padding: 12px 16px;
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 8px;
          font-size: 13px;
          color: #C0392B;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .app-shell {
            height: 100dvh;
          }
          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .sidebar-wrapper.open {
            transform: translateX(0);
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(10, 18, 12, 0.5);
            z-index: 199;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.28s ease;
          }
          .sidebar-overlay.open {
            opacity: 1;
            pointer-events: all;
          }
          .main-content {
            padding: 16px 16px 32px;
          }
          .mobile-sidebar-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 24px;
            right: 20px;
            z-index: 150;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #2E6F40;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(46,111,64,0.35);
            color: #fff;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 12px 12px 80px;
          }
        }
      `}</style>

      <div className="app-shell">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="app-body">
          {/* Mobile overlay */}
          <div
            className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />

          <div className={`sidebar-wrapper${sidebarOpen ? ' open' : ''}`}>
            <Sidebar
              history={history}
              onSelect={handleSelectHistory}
              onNew={handleNew}
              activeId={activeHistoryId}
            />
          </div>

          <main className="main-content">
            {error && (
              <div className="error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {view === 'upload' && (
                <ImageUploader onUpload={handleUpload} isProcessing={false} />
              )}
              {view === 'processing' && (
                <LoadingSpinner imageUrl={previewUrl} />
              )}
              {view === 'result' && result && (
                <ResultCard
                  result={result}
                  imageUrl={previewUrl}
                  capturedAt={capturedAt}
                  onNewAnalysis={handleNew}
                />
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>

      {/* Mobile sidebar toggle FAB */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(v => !v)}
        aria-label="Toggle history"
      >
        {sidebarOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>
    </>
  );
}