import { apiRequest } from "./queryClient";
import { 
  GenerateQuestionsResponse, 
  AnalyzeResponseResponse,
  GenerateProfileResponse
} from "@/types";

/**
 * Client-side wrapper for API calls to OpenAI services
 */
export const openaiService = {
  // Generate interview questions
  async generateQuestions(count = 10, sessionId?: string): Promise<GenerateQuestionsResponse> {
    try {
      const response = await apiRequest("POST", "/api/questions", { 
        count,
        sessionId
      });
      return await response.json();
    } catch (error) {
      console.error("Error generating questions:", error);
      throw error;
    }
  },
  
  // Analyze a user response for sentiment and emotions
  async analyzeResponse(
    response: string, 
    sessionId?: string, 
    questionIndex?: number
  ): Promise<AnalyzeResponseResponse> {
    try {
      const apiResponse = await apiRequest("POST", "/api/analyze", { 
        response,
        sessionId,
        questionIndex
      });
      return await apiResponse.json();
    } catch (error) {
      console.error("Error analyzing response:", error);
      throw error;
    }
  },
  
  // Save a response to the database
  async saveResponse(
    sessionId: string,
    questionIndex: number,
    responseText: string,
    emotionData?: any
  ) {
    try {
      const response = await apiRequest("POST", "/api/responses", {
        sessionId,
        questionIndex,
        responseText,
        emotionData
      });
      return await response.json();
    } catch (error) {
      console.error("Error saving response:", error);
      throw error;
    }
  },
  
  // Generate a mirror profile based on all responses
  async generateProfile(responses: string[], sessionId?: string): Promise<GenerateProfileResponse> {
    try {
      const response = await apiRequest("POST", "/api/profile", { 
        responses,
        sessionId
      });
      return await response.json();
    } catch (error) {
      console.error("Error generating profile:", error);
      throw error;
    }
  }
};
