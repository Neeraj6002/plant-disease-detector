import { DetectionResult } from "@/types/detection";

export async function detectDisease(
  base64Image: string,
  mimeType: string
): Promise<DetectionResult> {
  const prompt = `You are an expert plant pathologist. Analyze this leaf image and return ONLY a JSON object — no markdown, no explanation, just raw JSON.

If the image is NOT a plant leaf, return:
{"isNotLeaf": true}

Otherwise return:
{
  "plantName": "string",
  "diseaseName": "string (or 'Healthy' if no disease)",
  "isHealthy": boolean,
  "confidence": number (0-100, integer),
  "severity": "None" | "Low" | "Moderate" | "High" | "Critical",
  "remedy": "string (2-3 sentences)",
  "prevention": "string (2-3 sentences)",
  "isNotLeaf": false
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      max_tokens: 512, // ✅ Fix #2: cap tokens to stay within free tier
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  // ✅ Fix #3: guard against empty/incomplete response
  if (!clean) {
    throw new Error("Model returned an empty response. Try again.");
  }

  const parsed: DetectionResult = JSON.parse(clean);
  return parsed;
}