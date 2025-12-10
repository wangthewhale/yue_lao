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

    const { prompt } = req.body;

    const finalPrompt = `
A photorealistic portrait of a person.
${prompt}
Cinematic lighting, 8K, sharp focus, neutral studio background.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", 
      generationConfig: {
        responseMimeType: "image/png",
      },
    });

    const result = await model.generateContent(finalPrompt);

    // Image is returned as base64 in inlineData
    const imagePart = result.response.candidates[0].content.parts.find(
      p => p.inlineData
    );

    if (!imagePart) throw new Error("No image returned");

    return res.status(200).json({
      image: `data:image/png;base64,${imagePart.inlineData.data}`,
    });

  } catch (error: any) {
    console.error("Image API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
