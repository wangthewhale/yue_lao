import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-image",
    });

    const { prompt } = req.body;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const imagePart = result.response.candidates?.[0]?.content.parts?.find(
      (p: any) => p.inlineData
    );

    if (!imagePart) throw new Error("No image returned");

    return res.status(200).json({
      base64: `data:image/png;base64,${imagePart.inlineData.data}`,
    });
  } catch (error: any) {
    console.error("IMAGE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
