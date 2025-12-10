// /api/analyze.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);

    const { userData, relationshipType } = req.body;

    const prompt = `你在前端寫的 system + user prompt，我可以幫你搬過來完整重寫`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);

    return res.status(200).json(JSON.parse(result.response.text()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
