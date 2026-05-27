// types/detection.ts

export interface DetectionResult {
  plantName: string;
  diseaseName: string;
  isHealthy: boolean;
  confidence: number;        // 0–100
  severity: "None" | "Low" | "Moderate" | "High" | "Critical";
  remedy: string;
  prevention: string;
  isNotLeaf?: boolean;       // true if image isn't a plant leaf
}