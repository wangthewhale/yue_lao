
export enum RelationshipType {
  CASUAL_PARTNER = 'CASUAL_PARTNER',
  LIFE_PARTNER = 'LIFE_PARTNER',
}

export interface UserData {
  // Basic Physical & Status (New)
  photo: string | null; // Base64 string
  height: string; // cm
  weight: string; // kg
  income: string; // text description or range
  occupation: string;

  // Basic Info
  name: string;
  age: string;
  gender: string;
  email: string; // New field
  sexualOrientation: string;
  
  // Deep
  mbti?: string;
  introExtroScale: number; // 1-10
  thinkingFeelingScale: number; // 1-10
  
  // Qualitative
  interests: string; // Comma separated or paragraph
  values: string; // Core values
  petPeeves: string; // What they hate
  idealWeekend: string;
  
  // The Secret Sauce
  loveLanguage: string;
  darkSide: string; // Vulnerabilities or "toxic traits" user admits to
}

export interface AnalysisResult {
  archetypeTitle: string; // e.g. "The Realistic Mirror"
  tagline: string;
  
  personalityTraits: string[];
  physicalDescription: string; // Description of vibe/style
  
  psychologicalProfile: string; // Why this works
  compatibilityScore: number; // 0-100 (simulated)
  
  greenFlags: string[]; // What to look for
  redFlags: string[]; // What to avoid (false positives)
  
  whereToMeet: string[];
  
  interactionAdvice: string; // How to approach them
  
  yueLaoPrayer: string; // Specific prayer text for the user
  
  imagePrompt: string; // Hidden field for image generation
}
