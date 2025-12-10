// /api/generate-image.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image"
    });

    const result = await model.generateContent(prompt);

    const imagePart = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!imagePart) throw new Error("No image generated");

    return res.status(200).json({
      image: `data:image/png;base64,${imagePart.inlineData.data}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

