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

  const handleUpload = useCallback(async (file: File, preview: string) => {
    setPreviewUrl(preview);
    setError('');
    setView('processing');
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

      // Add to history
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
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#FAFAF8',
        overflow: 'hidden',
      }}
    >
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar
          history={history}
          onSelect={handleSelectHistory}
          onNew={handleNew}
          activeId={activeHistoryId}
        />

        {/* Main content */}
          <main 
  style={{ 
    flexGrow: 1, 
    padding: '40px 56px 64px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'hidden',
    overflowY: 'auto',
  }}
>
          {error && (
            <div
              style={{
                margin: '16px 48px 0',
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 8,
                fontSize: 13,
                color: '#C0392B',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div style={{ flex: 1 }}>
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
  );
}
