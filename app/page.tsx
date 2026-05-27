// app/page.tsx

"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ResultCard from "@/components/ResultCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { DetectionResult } from "@/types/detection";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (f: File, prev: string) => {
    setFile(f);
    setPreview(prev);
    setResult(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/detect", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Detection failed.");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
          <span style={{ color: "var(--accent)", fontSize: "1rem" }}>⬡</span>
          <span style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
            AI · PLANT PATHOLOGY
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--text)",
          }}
        >
          Plant Disease<br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Detector</em>
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.78rem",
            marginTop: "0.8rem",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
          }}
        >
          Upload a leaf photo. Gemini Vision analyses it and returns disease,
          severity, remedy &amp; prevention in seconds.
        </p>
      </header>

      {/* Upload area */}
      {!preview ? (
        <ImageUploader onImageSelect={handleImageSelect} disabled={loading} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Preview */}
          <div style={{ position: "relative", border: "1px solid var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Leaf preview"
              style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }}
            />
            <button
              onClick={handleReset}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(14,18,13,0.85)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                padding: "0.3rem 0.7rem",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              × CLEAR
            </button>
          </div>

          {/* Analyse button */}
          {!result && !loading && (
            <button
              onClick={handleDetect}
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "2px",
                padding: "0.85rem",
                fontSize: "0.8rem",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.12em",
                cursor: "pointer",
                fontWeight: 500,
                transition: "opacity 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ANALYSE LEAF →
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Error */}
      {error && (
        <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "1rem", letterSpacing: "0.04em" }}>
          ⚠ {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          <ResultCard result={result} />
          <button
            onClick={handleReset}
            style={{
              marginTop: "1rem",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              borderRadius: "2px",
              padding: "0.65rem 1.2rem",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            ← ANALYSE ANOTHER
          </button>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: "4rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          BUILT BY{" "}
          <a
            href="https://github.com/Neeraj6002"
            style={{ color: "var(--accent)", textDecoration: "none" }}
            target="_blank"
            rel="noreferrer"
          >
            NEERAJ
          </a>{" "}
          · POWERED BY GEMINI 2.0 FLASH
        </p>
      </footer>
    </main>
  );
}