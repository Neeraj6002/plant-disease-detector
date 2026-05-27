// components/ImageUploader.tsx

"use client";

import { useCallback, useState } from "react";

interface Props {
  onImageSelect: (file: File, preview: string) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onImageSelect, disabled }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Only JPG and PNG files are supported.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        border: `1px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "2px",
        padding: "3rem 2rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 0.2s, background 0.2s",
        background: dragging ? "rgba(126,200,80,0.04)" : "transparent",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {/* Leaf icon */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M20 4C20 4 6 10 6 24C6 31.7 12.3 38 20 38C27.7 38 34 31.7 34 24C34 10 20 4 20 4Z"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M20 38V16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 22C17 19 12 18 9 20" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M20 28C23 25 28 24 31 26" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </svg>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--text)", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
          DROP LEAF IMAGE HERE
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: "0.4rem" }}>
          or click to browse · JPG, PNG
        </p>
      </div>
    </label>
  );
}