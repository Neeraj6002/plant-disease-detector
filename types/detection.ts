export interface DetectionResult {
  plantName: string;
  diseaseName: string;
  scientificName?: string;
  isHealthy: boolean;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'Critical' | 'None';
  diagnosis: string;
  organicRemedy: string;
  chemicalRemedy: string;
  prevention: string;
  observationNotes: string[];
  tags: string[];
}

export interface HistoryEntry {
  id: string;
  imageUrl: string;
  label: string;
  tag: string;
  date: string;
  result: DetectionResult;
}
