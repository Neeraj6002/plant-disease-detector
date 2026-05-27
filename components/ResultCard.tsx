// components/ResultCard.tsx

import { DetectionResult } from "@/types/detection";

interface Props {
  result: DetectionResult;
}

const severityColor: Record<string, string> = {
  None:     "var(--accent)",
  Low:      "var(--accent2)",
  Moderate: "var(--warn)",
  High:     "var(--danger)",
  Critical: "#ff3b3b",
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.7rem 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.1em", minWidth: 110, paddingTop: 2 }}>
        {label}
      </span>
      <span style={{ color: "var(--text)", fontSize: "0.85rem", flex: 1 }}>{value}</span>
    </div>
  );
}

export default function ResultCard({ result }: Props) {
  if (result.isNotLeaf) {
    return (
      <div style={{ border: "1px solid var(--border)", borderRadius: "2px", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--warn)", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
          ⚠ IMAGE NOT RECOGNISED AS A PLANT LEAF
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Please upload a clear photo of a plant leaf.
        </p>
      </div>
    );
  }

  const sevColor = severityColor[result.severity] ?? "var(--text)";

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "2px",
        overflow: "hidden",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.2rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--surface)",
        }}
      >
        <div>
          <p style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.12em" }}>DETECTED</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 300,
              color: result.isHealthy ? "var(--accent)" : "var(--danger)",
              marginTop: "0.2rem",
            }}
          >
            {result.isHealthy ? "✓ Healthy" : result.diseaseName}
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.12em" }}>CONFIDENCE</p>
          <p style={{ fontSize: "1.6rem", fontWeight: 500, color: "var(--accent)", lineHeight: 1.1 }}>
            {result.confidence}%
          </p>
        </div>
      </div>

      {/* Data rows */}
      <div style={{ padding: "0 1.5rem" }}>
        <Row label="PLANT" value={result.plantName} />
        <Row label="DISEASE" value={result.diseaseName} />
        <div style={{ display: "flex", gap: "1rem", padding: "0.7rem 0", borderBottom: "1px solid var(--border)" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.1em", minWidth: 110, paddingTop: 2 }}>
            SEVERITY
          </span>
          <span style={{ color: sevColor, fontSize: "0.85rem" }}>{result.severity}</span>
        </div>
      </div>

      {/* Remedy & Prevention */}
      {!result.isHealthy && (
        <div style={{ padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
              REMEDY
            </p>
            <p style={{ color: "var(--text)", fontSize: "0.82rem", lineHeight: 1.7 }}>{result.remedy}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: "0.65rem", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
              PREVENTION
            </p>
            <p style={{ color: "var(--text)", fontSize: "0.82rem", lineHeight: 1.7 }}>{result.prevention}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}