// components/LoadingSpinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div
        style={{
          width: 48,
          height: 48,
          border: "2px solid var(--border)",
          borderTop: "2px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
        ANALYSING LEAF...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}