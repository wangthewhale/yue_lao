
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, RelationshipType, AnalysisResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeIdealMatch = async (
  userData: UserData,
  relationshipType: RelationshipType
): Promise<AnalysisResult> => {
  const ai = getClient();
  
  let typeDescription = "";
  switch (relationshipType) {
    case RelationshipType.CASUAL_PARTNER:
      typeDescription = "Casual Partner (Focus on physical attractiveness parity, realistic chemistry, no commitment)";
      break;
    case RelationshipType.LIFE_PARTNER:
      typeDescription = "Life Partner / Spouse (Focus on socioeconomic similarity 'men dang hu dui', shared lifestyle, long term)";
      break;
  }

  const systemInstruction = `
    You are an expert in "Evolutionary Psychology", "Astrological Archetypes", and "Modern Dating Markets". 
    Your job is to analyze the user's realistic data and provide a "Psychological Test Result" or "Horoscope Book" style analysis.

    CORE LOGIC:
    1. **Homophily (Like attracts Like)**: People with similar attractiveness, income, and values stay together.
    2. **Status Matching**: If user is high income, match is high income. If user is average, match is average.
    3. **Physical Matching**: If user is fit, match is fit. If user is heavy, match is heavy.
    
    TONE & STYLE (Crucial):
    1. **Traditional Chinese (繁體中文)** ONLY.
    2. **Style**: Like a popular Psychology Magazine test result or a detailed Horoscope reading.
    3. **Direct & Concrete**: Do NOT use abstract words like "willingness to explore" or "potential connection".
    4. **Use Specific Scenarios**: Instead of "good communication", say "Someone who puts down their phone when you speak."
    
    YUE LAO PRAYER RULES (THE SPECIFICATION SHEET):
    The user is tired of vague wishes. They want a **PRECISE SPECIFICATION LIST**.
    You MUST generate the 'yueLaoPrayer' as a **vernacular list of demands** (白話文條列式規格).
    
    Format the 'yueLaoPrayer' content EXACTLY like this (use bullet points or clear breaks):
    "拜託月老，我要訂製這一位對象：
    1. [外型]: 身高178-183cm，體脂15%以下的精壯身材，穿著Uniqlo日系風格。
    2. [職業]: 金融或是科技業主管，年薪200萬以上，有投資習慣。
    3. [個性]: 吵架會先低頭，回訊息秒讀秒回，情緒極度穩定。
    4. [習慣]: 週末喜歡爬百岳，不抽菸，睡前會閱讀。"
    
    *Constraint*: Include specific numbers (Height, Income, Age gap) and specific behaviors.
  `;

  // Explicitly translate scale values to text to avoid AI hallucination on numbers
  const introExtroDesc = userData.introExtroScale <= 5 ? "More Introverted (偏內向)" : "More Extroverted (偏外向)";
  const logicEmotionDesc = userData.thinkingFeelingScale <= 5 ? "Logic/Rational Priority (理性優先)" : "Emotion/Feeling Priority (感性優先)";

  const promptText = `
    User Data:
    - Name: ${userData.name} (${userData.age} y/o, ${userData.gender})
    - Sexual Orientation: ${userData.sexualOrientation}
    - Body: ${userData.height}cm, ${userData.weight}kg
    - Social: ${userData.occupation}, Income: ${userData.income}
    - Psychology: 
       * MBTI: ${userData.mbti || 'N/A'}
       * Energy: Score ${userData.introExtroScale}/10 -> ${introExtroDesc}
       * Decision Making: Score ${userData.thinkingFeelingScale}/10 -> ${logicEmotionDesc}
    - Interests: ${userData.interests}
    - Values: ${userData.values}
    - Dark Side: ${userData.darkSide}
    
    Looking for: ${typeDescription}

    Task:
    1. Analyze who fits them based on "Realistic Similarity".
    2. Explain "WHY" using psychological analysis tone.
    3. Suggest "WHERE" to meet based on lifestyle probability.
    4. List concrete GREEN flags (specific behaviors that fit user).
    5. List concrete RED flags (specific behaviors that clash with user).
    6. Generate the PRECISE YUE LAO SPECIFICATION LIST (Prayer).
  `;

  const parts: any[] = [{ text: promptText }];

  if (userData.photo) {
    const base64Data = userData.photo.split(',')[1];
    const mimeType = userData.photo.substring(userData.photo.indexOf(':') + 1, userData.photo.indexOf(';'));
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          archetypeTitle: { type: Type.STRING, description: "Creative Psychological Archetype Name. e.g. '理性的建築師', '感性的流浪者'" },
          tagline: { type: Type.STRING, description: "One sentence summary of the match vibe." },
          personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 adjectives describing the partner." },
          physicalDescription: { type: Type.STRING, description: "Detailed visual description of the partner (height, build, style) that matches user's level." },
          psychologicalProfile: { type: Type.STRING, description: "Deep analysis: 'Based on your [User Trait], you need someone who [Partner Trait] because...'. Explain the chemistry." },
          compatibilityScore: { type: Type.NUMBER, description: "0-100" },
          greenFlags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "5 VERY CONCRETE behaviors. E.g. '會主動幫你剝蝦', '吵架時會先冷靜不說話', '這人衣櫃比你還整齊'. Do NOT use abstract nouns." 
          },
          redFlags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "5 VERY CONCRETE warning signs. E.g. '吃飯一直滑手機', '對服務生不禮貌', '這人完全不存錢'. Do NOT use abstract nouns." 
          },
          whereToMeet: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Specific places. E.g. '誠品書店財經區', '週五晚上的World Gym', '公司樓下的全家'." },
          interactionAdvice: { type: Type.STRING, description: "One piece of actionable advice on how to catch them." },
          yueLaoPrayer: { 
            type: Type.STRING, 
            description: "The PRECISE SPECIFICATION LIST. Must follow the numbering format: 1. [Category]: Details. 2. [Category]: Details." 
          },
          imagePrompt: { type: Type.STRING, description: "English prompt for photorealistic portrait of the match." }
        },
        required: [
          "archetypeTitle", "tagline", "personalityTraits", "physicalDescription", 
          "psychologicalProfile", "compatibilityScore", "greenFlags", 
          "redFlags", "whereToMeet", "interactionAdvice", "yueLaoPrayer", "imagePrompt"
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as AnalysisResult;
};

export const generateMatchImage = async (prompt: string, type: RelationshipType): Promise<string> => {
  const ai = getClient();
  const contextAddon = "cinematic lighting, 8k, photorealistic, sharp focus, portrait photography";
  const finalPrompt = `Portrait of a person. ${prompt}. ${contextAddon}, neutral studio background.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [{ text: finalPrompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
              return `data:image/png;base64,${part.inlineData.data}`;
          }
      }
  }
  
  throw new Error("No image generated");
};
