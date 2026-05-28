import { DetectionResult } from '@/types/detection';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const DETECTION_PROMPT = `Analyze this plant leaf image for diseases.
Respond ONLY with a single valid JSON object — no markdown, no backticks, no explanation.

Use exactly these fields:
{
  "plantName": "string — common name of the plant (e.g. Tomato, Oak, Fern), or 'Unknown' if unidentifiable",
  "diseaseName": "string — name of the disease (e.g. Late Blight), or 'Healthy' if no disease found",
  "scientificName": "string — scientific name of the disease or pathogen, or null if healthy/unknown",
  "isHealthy": boolean,
  "confidence": number — integer from 0 to 100 representing detection confidence,
  "severity": "None" | "Low" | "Moderate" | "Critical",
  "diagnosis": "string — 2 to 3 sentence clinical description of the observed condition",
  "organicRemedy": "string — specific organic or natural treatment steps",
  "chemicalRemedy": "string — specific chemical treatment options with dosage guidance",
  "prevention": "string — preventive measures to avoid recurrence",
  "observationNotes": ["string", "string", "string"] — array of 3 concise visual observations,
  "tags": ["string"] — short descriptor tags (e.g. FungalPathogen, CriticalSeverity, NeedsImmediateAction)
}

If the image does NOT contain a plant or leaf, return exactly this:
{"plantName":"Not a plant","diseaseName":"Invalid specimen","scientificName":null,"isHealthy":false,"confidence":0,"severity":"None","diagnosis":"The uploaded image does not appear to contain a plant specimen. Please upload a clear photo of a plant leaf.","organicRemedy":"","chemicalRemedy":"","prevention":"","observationNotes":["No plant material detected","Image may be blurry or off-topic","Try a close-up photo of a leaf"],"tags":["InvalidInput"]}`;

function validateDetectionResult(obj: unknown): obj is DetectionResult {
  if (typeof obj !== 'object' || obj === null) return false;
  const r = obj as Record<string, unknown>;

  return (
    typeof r.plantName === 'string' &&
    typeof r.diseaseName === 'string' &&
    typeof r.isHealthy === 'boolean' &&
    typeof r.confidence === 'number' &&
    ['None', 'Low', 'Moderate', 'Critical'].includes(r.severity as string) &&
    typeof r.diagnosis === 'string' &&
    Array.isArray(r.observationNotes) &&
    Array.isArray(r.tags)
  );
}

function parseJSON(raw: string): DetectionResult {
  // Strip markdown fences if present (safety net)
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Try to extract the first {...} block if surrounding text slipped through
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(
        `Gemini returned non-JSON output. Preview: ${cleaned.slice(0, 200)}`
      );
    }
    parsed = JSON.parse(match[0]);
  }

  if (!validateDetectionResult(parsed)) {
    throw new Error(
      `Gemini response is missing required fields. Got: ${JSON.stringify(parsed).slice(0, 300)}`
    );
  }

  return parsed;
}

export async function detectPlantDisease(
  base64Image: string,
  mimeType: string
): Promise<DetectionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
              { text: DETECTION_PROMPT },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });
  } catch (networkErr) {
    throw new Error(`Network error reaching Gemini API: ${String(networkErr)}`);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '(unreadable)');
    throw new Error(
      `Gemini API returned ${response.status} ${response.statusText}: ${errorBody}`
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Gemini API returned an invalid JSON response body.');
  }

  const content =
    (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
      ?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content || content.trim() === '') {
    // Check for prompt blocks or safety rejections
    const blockReason = (
      data as { promptFeedback?: { blockReason?: string } }
    )?.promptFeedback?.blockReason;

    throw new Error(
      blockReason
        ? `Gemini blocked the request: ${blockReason}`
        : 'Gemini returned an empty response. The image may have been rejected.'
    );
  }

  return parseJSON(content);
}