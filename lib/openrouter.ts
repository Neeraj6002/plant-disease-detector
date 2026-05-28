import { DetectionResult } from '@/types/detection';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const DETECTION_PROMPT = `You are an expert plant pathologist with decades of field and laboratory experience identifying plant diseases worldwide.

Carefully examine every detail of this leaf image:
- Lesion shape, size, color, texture, and distribution pattern
- Presence of pustules, spores, mold, or powdery coatings
- Necrosis patterns (angular vs. circular vs. irregular)
- Halo or ring patterns around lesions
- Leaf edge vs. center vs. vein proximity of lesions
- Color of spore masses (yellow, orange, rust-red, black, white)
- Whether spots are raised/sunken/flat

Based on these observations, identify the MOST SPECIFIC disease possible. Do NOT default to vague labels like "Unknown Fungal Leaf Spot" — always commit to your best clinical diagnosis with the evidence available.

Common disease clues:
- Red/orange raised pustules with yellow powder → Rust (Phakopsora, Puccinia, Uromyces)
- White powdery coating on surface → Powdery Mildew (Erysiphe, Podosphaera)
- Brown angular spots bounded by veins → Bacterial Leaf Spot or Angular Leaf Spot
- Circular brown spots with yellow halo → Cercospora Leaf Spot or Early Blight
- Dark water-soaked lesions spreading fast → Late Blight (Phytophthora)
- Black sooty coating → Sooty Mold (Capnodium)
- Yellowing with small brown dots → Downy Mildew or Septoria Leaf Spot
- Irregular tan/brown dead patches → Anthracnose or Leaf Scorch

Respond ONLY with a single valid JSON object — no markdown, no backticks, no explanation.

Use exactly these fields:
{
  "plantName": "string — identify the specific plant (e.g. Tomato, Chili, Mango, Soybean, Bean) based on leaf shape, texture, and veining. Say 'Unknown Plant' only if truly unidentifiable",
  "diseaseName": "string — the most specific disease name possible (e.g. 'Asian Soybean Rust', 'Cercospora Leaf Spot', 'Bacterial Angular Leaf Spot'). Never use 'Unknown Fungal Leaf Spot' as a diagnosis",
  "scientificName": "string — scientific name of the pathogen (e.g. Phakopsora pachyrhizi, Cercospora capsici), or null if healthy",
  "isHealthy": boolean,
  "confidence": number — integer 0–100. Be honest: use 60–75 if partially confident, 76–90 if fairly confident, 91–100 only if highly certain,
  "severity": "None" | "Low" | "Moderate" | "Critical",
  "diagnosis": "string — 2 to 3 sentence clinical description citing specific visual evidence you observed (pustule color, lesion pattern, spore type, etc.)",
  "organicRemedy": "string — specific organic or natural treatment steps with application frequency",
  "chemicalRemedy": "string — specific chemical treatment options with product names, active ingredients, and dosage guidance",
  "prevention": "string — concrete preventive measures to avoid recurrence",
  "observationNotes": ["string", "string", "string"] — exactly 3 specific visual observations you made from the image (e.g. 'Reddish-brown raised pustules on abaxial surface', 'Yellow urediniospore masses visible around lesions'),
  "tags": ["string"] — short descriptor tags (e.g. FungalPathogen, RustDisease, CriticalSeverity, NeedsImmediateAction, BacterialInfection)
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

function repairAndParseJSON(raw: string): unknown {
  // 1. Strip markdown fences
  let cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  // 2. Try parsing as-is first
  try {
    return JSON.parse(cleaned);
  } catch {
    // continue to repair steps
  }

  // 3. Extract the first { ... } block (handles leading/trailing prose)
  const braceStart = cleaned.indexOf('{');
  const braceEnd = cleaned.lastIndexOf('}');

  if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
    const extracted = cleaned.slice(braceStart, braceEnd + 1);
    try {
      return JSON.parse(extracted);
    } catch {
      // continue to repair steps
    }
  }

  // 4. JSON is truncated — attempt to auto-close it
  // Find everything from the first '{' to the end
  const partial = braceStart !== -1 ? cleaned.slice(braceStart) : cleaned;

  // Close any open string by finding unclosed quotes
  let repaired = partial;

  // Count open braces and brackets to close them
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escape = false;

  for (const ch of repaired) {
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') openBraces++;
    else if (ch === '}') openBraces--;
    else if (ch === '[') openBrackets++;
    else if (ch === ']') openBrackets--;
  }

  // If we're mid-string, close it
  if (inString) repaired += '"';

  // Remove trailing incomplete key-value (e.g. ends with a comma or partial key)
  repaired = repaired.replace(/,\s*$/, '');
  repaired = repaired.replace(/,\s*"[^"]*"\s*:\s*$/, '');
  repaired = repaired.replace(/,\s*"[^"]*"\s*$/, '');

  // Close open brackets and braces
  repaired += ']'.repeat(Math.max(0, openBrackets));
  repaired += '}'.repeat(Math.max(0, openBraces));

  try {
    return JSON.parse(repaired);
  } catch {
    throw new Error(
      `Gemini returned unparseable output even after repair. Preview: ${cleaned.slice(0, 300)}`
    );
  }
}

function parseJSON(raw: string): DetectionResult {
  const parsed = repairAndParseJSON(raw);

  if (!validateDetectionResult(parsed)) {
    throw new Error(
      `Gemini response is missing required fields. Got: ${JSON.stringify(parsed).slice(0, 300)}`
    );
  }

  return parsed as DetectionResult;
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
          temperature: 0.2,
          maxOutputTokens: 4096,  // increased to prevent truncation
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