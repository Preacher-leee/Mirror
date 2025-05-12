// Application screen types
export type ScreenType = "splash" | "welcome" | "interview" | "results";

// Emotion data type
export interface Emotion {
  name: string;
  value: number;
  color: string;
}

// Mirror profile strength type
export interface Strength {
  title: string;
  description: string;
}

// Mirror profile type
export interface MirrorProfile {
  entityName: string;
  strengths: Strength[];
  unrealizedPotential: string;
  poeticSummary: string;
  shadowEcho: string;
}

// Response analysis type
export interface ResponseAnalysis {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  emotions: Emotion[];
}

// Interview questions type
export interface InterviewQuestion {
  id: number;
  text: string;
}

// OpenAI API request/response types
export interface GenerateQuestionsRequest {
  count: number;
}

export interface GenerateQuestionsResponse {
  questions: string[];
}

export interface AnalyzeResponseRequest {
  response: string;
}

export interface AnalyzeResponseResponse {
  analysis: ResponseAnalysis;
}

export interface GenerateProfileRequest {
  responses: string[];
}

export interface GenerateProfileResponse {
  mirrorProfile: MirrorProfile;
}
