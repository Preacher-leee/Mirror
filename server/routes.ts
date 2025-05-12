import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { z } from "zod";
import { insertResponseSchema, insertProfileSchema } from "@shared/schema";
import { nanoid } from "nanoid";

// Request schemas
const generateQuestionsSchema = z.object({
  count: z.number().min(1).max(20).default(10)
});

const analyzeResponseSchema = z.object({
  response: z.string().min(1),
  sessionId: z.string().optional(),
  questionIndex: z.number().optional()
});

const generateProfileSchema = z.object({
  responses: z.array(z.string()),
  sessionId: z.string().optional()
});

const saveResponseSchema = z.object({
  sessionId: z.string(),
  questionIndex: z.number(),
  responseText: z.string(),
  emotionData: z.any().optional()
});

// Helper function to get or create a session ID
function getSessionId(req: Request): string {
  if (!req.headers['x-session-id']) {
    const sessionId = nanoid();
    req.headers['x-session-id'] = sessionId;
    return sessionId;
  }
  return req.headers['x-session-id'] as string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate interview questions
  app.post("/api/questions", async (req, res) => {
    try {
      const validation = generateQuestionsSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request", errors: validation.error.flatten() });
      }
      
      const { count } = validation.data;
      const questions = await openaiService.generateQuestions(count);
      
      // Add the session ID to the response
      const sessionId = getSessionId(req);
      return res.json({ ...questions, sessionId });
    } catch (error) {
      console.error("Error generating questions:", error);
      return res.status(500).json({ message: "Failed to generate questions" });
    }
  });
  
  // API endpoint to analyze user response
  app.post("/api/analyze", async (req, res) => {
    try {
      const validation = analyzeResponseSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request", errors: validation.error.flatten() });
      }
      
      const { response, sessionId: providedSessionId, questionIndex } = validation.data;
      const sessionId = providedSessionId || getSessionId(req);
      
      // Analyze the response
      const analysis = await openaiService.analyzeResponse(response);
      
      // Save the response to the database if questionIndex is provided
      if (questionIndex !== undefined) {
        try {
          const now = new Date().toISOString();
          const responseData = {
            sessionId,
            questionIndex,
            responseText: response,
            emotionData: analysis.analysis.emotions,
            createdAt: now
          };
          
          await storage.saveResponse(responseData);
          console.log(`Saved response for session ${sessionId}, question ${questionIndex}`);
        } catch (dbError) {
          console.error("Error saving response to database:", dbError);
          // Continue with analysis even if database saving fails
        }
      }
      
      return res.json(analysis);
    } catch (error) {
      console.error("Error analyzing response:", error);
      return res.status(500).json({ message: "Failed to analyze response" });
    }
  });
  
  // API endpoint to save a response
  app.post("/api/responses", async (req, res) => {
    try {
      const validation = saveResponseSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request", errors: validation.error.flatten() });
      }
      
      const responseData = validation.data;
      const now = new Date().toISOString();
      
      // Add timestamp
      const response = await storage.saveResponse({
        ...responseData,
        createdAt: now
      });
      
      return res.json({ success: true, response });
    } catch (error) {
      console.error("Error saving response:", error);
      return res.status(500).json({ message: "Failed to save response" });
    }
  });
  
  // API endpoint to generate mirror profile
  app.post("/api/profile", async (req, res) => {
    try {
      const validation = generateProfileSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request", errors: validation.error.flatten() });
      }
      
      const { responses, sessionId: providedSessionId } = validation.data;
      const sessionId = providedSessionId || getSessionId(req);
      
      // Filter out empty responses
      const validResponses = responses.filter(r => r.trim().length > 0);
      
      if (validResponses.length < 3) {
        return res.status(400).json({ message: "Not enough valid responses to generate a profile" });
      }
      
      // Generate profile
      const profileResult = await openaiService.generateProfile(validResponses);
      
      // Save the profile to the database
      try {
        const now = new Date().toISOString();
        const profileData = {
          sessionId,
          entityName: profileResult.mirrorProfile.entityName,
          strengths: profileResult.mirrorProfile.strengths,
          unrealizedPotential: profileResult.mirrorProfile.unrealizedPotential,
          poeticSummary: profileResult.mirrorProfile.poeticSummary,
          shadowEcho: profileResult.mirrorProfile.shadowEcho,
          createdAt: now
        };
        
        await storage.saveProfile(profileData);
        console.log(`Saved profile for session ${sessionId}`);
      } catch (dbError) {
        console.error("Error saving profile to database:", dbError);
        // Continue returning the profile even if database saving fails
      }
      
      return res.json(profileResult);
    } catch (error) {
      console.error("Error generating profile:", error);
      return res.status(500).json({ message: "Failed to generate profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
