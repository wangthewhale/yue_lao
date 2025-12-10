import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Missing API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp"
    });

    const { userData, relationshipType } = req.body;

    const prompt = `
You are an expert in evolutionary psychology, astrology archetypes and modern dating markets.
You will return a JSON object ONLY. No extra text.

User Data:
${JSON.stringify(userData, null, 2)}

Relationship Type:
${relationshipType}

Return a JSON with:
{
  "archetypeTitle": "...",
  "tagline": "...",
  "personalityTraits": ["...", "..."],
  "physicalDescription": "...",
  "psychologicalProfile": "...",
  "compatibilityScore": 0-100,
  "greenFlags": ["...", "..."],
  "redFlags": ["...", "..."],
  "whereToMeet": ["...", "..."],
  "interactionAdvice": "...",
  "yueLaoPrayer": "拜託月老，請給我：1....2....3....",
  "imagePrompt": "English photorealistic portrait prompt"
}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json(JSON.parse(text));

  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
