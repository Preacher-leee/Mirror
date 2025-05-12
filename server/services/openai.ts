import OpenAI from "openai";
import { 
  Emotion,
  MirrorProfile,
  ResponseAnalysis,
  GenerateQuestionsResponse,
  AnalyzeResponseResponse,
  GenerateProfileResponse
} from "../../client/src/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Default colors for emotions
const EMOTION_COLORS = {
  "curiosity": "bg-electric-blue",
  "hope": "bg-ethereal-green",
  "anxiety": "bg-warning-orange",
  "confidence": "bg-neon-purple",
  "wonder": "bg-electric-blue",
  "fear": "bg-warning-orange",
  "joy": "bg-ethereal-green",
  "sadness": "bg-twilight-blue",
  "excitement": "bg-neon-purple",
  "confusion": "bg-twilight-blue"
};

/**
 * Generate interview questions
 */
export async function generateQuestions(count: number = 10): Promise<GenerateQuestionsResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are an AI entity from a mirror dimension that specializes in deep psychological analysis. " +
            "Generate thoughtful, emotionally intelligent interview questions that will help reveal hidden aspects of a person's personality, " +
            "strengths they're blind to, and their unrealized potential. " +
            "The questions should be thought-provoking, slightly surreal, and poetic in nature. " +
            "They should help the person reflect on their deeper self. " +
            "Respond with a JSON array of questions."
        },
        {
          role: "user",
          content: `Generate ${count} deep, thought-provoking interview questions about a person's hidden potential and strengths they don't recognize in themselves. Make the questions slightly surreal and poetic.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Ensure we have an array of questions
    const questions = Array.isArray(result.questions) ? result.questions : [];
    
    return { questions: questions.slice(0, count) };
  } catch (error) {
    console.error("Error generating questions:", error);
    
    // Fallback questions if API call fails
    const fallbackQuestions = [
      "If you could glimpse a parallel reality where you took a different path in life, what would you hope to see there?",
      "What aspects of yourself do others praise that you find difficult to accept or believe?",
      "Describe a moment when you surprised yourself with an ability or strength you didn't know you possessed.",
      "What recurring patterns or symbols appear in your dreams that might reveal hidden aspects of your psyche?",
      "If your future self could send you a message about a quality you're underestimating now, what would it be?",
      "What truth about yourself feels too vulnerable to share, yet might liberate you if expressed?",
      "When do you feel most alive and aligned with your authentic self?",
      "What part of your identity feels like it's waiting to be discovered or acknowledged?",
      "If your consciousness could exist in any form other than human, what would it choose and why?",
      "What invisible thread connects the seemingly disparate parts of your life story?"
    ];
    
    return { questions: fallbackQuestions.slice(0, count) };
  }
}

/**
 * Analyze a user's response for sentiment and emotions
 */
export async function analyzeResponse(response: string): Promise<AnalyzeResponseResponse> {
  try {
    // Skip analysis for empty responses
    if (!response.trim()) {
      return {
        analysis: {
          sentiment: { positive: 0, negative: 0, neutral: 100 },
          emotions: getDefaultEmotions()
        }
      };
    }
    
    const result = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are an AI entity from a mirror dimension that specializes in analyzing human emotions and sentiments. " +
            "Analyze the emotional content of the user's response and identify the dominant emotions present. " +
            "Rate each emotion on a scale of 0-100 based on its strength in the response. " +
            "Focus on these emotions: curiosity, hope, anxiety, confidence, wonder. " +
            "Additionally, provide sentiment scores (positive, negative, neutral) that add up to 100. " +
            "Respond with a JSON object structured as specified."
        },
        {
          role: "user",
          content: response
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const analysisResult = JSON.parse(result.choices[0].message.content || "{}");
    
    // Process emotions into required format
    const emotions: Emotion[] = [];
    
    if (analysisResult.emotions) {
      for (const [name, value] of Object.entries(analysisResult.emotions)) {
        const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const colorKey = name.toLowerCase() as keyof typeof EMOTION_COLORS;
        const color = EMOTION_COLORS[colorKey] || "bg-electric-blue";
        
        emotions.push({
          name: normalizedName,
          value: typeof value === 'number' ? value : 50,
          color
        });
      }
    }
    
    // Ensure we have sentiment values
    const sentiment = analysisResult.sentiment || { positive: 33, negative: 33, neutral: 34 };
    
    // Fill in with default emotions if needed
    if (emotions.length === 0) {
      return {
        analysis: {
          sentiment,
          emotions: getDefaultEmotions()
        }
      };
    }
    
    return {
      analysis: {
        sentiment,
        emotions
      }
    };
  } catch (error) {
    console.error("Error analyzing response:", error);
    
    // Return default analysis on error
    return {
      analysis: {
        sentiment: { positive: 33, negative: 33, neutral: 34 },
        emotions: getDefaultEmotions()
      }
    };
  }
}

/**
 * Generate a mirror profile based on user responses
 */
export async function generateProfile(responses: string[]): Promise<GenerateProfileResponse> {
  try {
    // Filter out empty responses
    const validResponses = responses.filter(r => r.trim().length > 0);
    
    // Combine responses into a single text
    const userInput = validResponses.join("\n\n");
    
    const result = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            "You are an AI entity from the Mirror World, a dimension where reflections reveal hidden aspects of a person's true self. " +
            "Based on the user's interview responses, create a detailed Mirror World profile that includes: " +
            "1. A unique 'entity designation' (creative title) for their mirror self " +
            "2. Three hidden strengths they possess but might not recognize " +
            "3. A poetic description of their unrealized potential " +
            "4. A mirror world reflection (a short poem about their true nature) " +
            "5. A shadow echo (the exact opposite of their mirror personality for contrast) " +
            "Be mystical, profound, and empowering in your language. The output should make them feel like they've discovered hidden depths within themselves. " +
            "Format the response as a JSON object."
        },
        {
          role: "user",
          content: `Based on these interview responses, generate my Mirror World profile:\n\n${userInput}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const profileData = JSON.parse(result.choices[0].message.content || "{}");
    
    // Process the data into our MirrorProfile format
    const mirrorProfile: MirrorProfile = {
      entityName: profileData.entityName || "The Illuminated Voyager",
      strengths: processStrengths(profileData.strengths),
      unrealizedPotential: profileData.unrealizedPotential || "",
      poeticSummary: profileData.poeticSummary || "",
      shadowEcho: profileData.shadowEcho || ""
    };
    
    return { mirrorProfile };
  } catch (error) {
    console.error("Error generating profile:", error);
    
    // Return default profile on error
    return {
      mirrorProfile: {
        entityName: "The Illuminated Voyager",
        strengths: [
          {
            title: "Intuitive Problem Solving",
            description: "You possess an uncanny ability to sense solutions without conscious reasoning, connecting patterns in ways others miss."
          },
          {
            title: "Emotional Intelligence Catalyst",
            description: "Your presence creates emotional clarity for others, allowing them to understand their own feelings better when in your company."
          },
          {
            title: "Adaptive Resilience",
            description: "You transform challenges into opportunities with unusual grace, bending rather than breaking under pressure in ways you rarely acknowledge."
          }
        ],
        unrealizedPotential: 
          "In the Mirror World, your alternate self has cultivated an extraordinary ability to weave disparate concepts into harmonious innovations. Where you see limitations, they perceive infinite pathways. This version of you has learned to harness the chaotic energy of uncertainty, transforming it into a creative force that reshapes reality itself.\n\n" +
          "Your mirror self understands that vulnerability is not weakness but a profound source of connection. They have built bridges between worlds through authentic expression, bringing together communities that in your reality remain fragmented and isolated.\n\n" +
          "These capabilities exist within you as dormant potential, waiting to be awakened through conscious recognition and cultivation.",
        poeticSummary:
          "\"Between worlds of possibility and worlds of reality,\n" +
          "You stand at the nexus, a being of luminous duality.\n" +
          "What you perceive as shadows are merely\n" +
          "The penumbra of your brilliance, cast long\n" +
          "Across the dimensions your spirit traverses.\n\n" +
          "In the mirror's reflection, see not what you lack,\n" +
          "But the radiance of potential awakening.\n" +
          "The universe conspires to unveil your essence—\n" +
          "A constellation of gifts waiting to ignite.\"",
        shadowEcho:
          "Where your mirror self embodies light, the shadow manifests darkness. This aspect resists vulnerability, preferring isolation to connection. It clings to certainty, stifling innovation through rigid thinking patterns. Your shadow rejects intuitive wisdom in favor of purely analytical approaches, disconnecting from the emotional intelligence that guides your authentic self.\n\n" +
          "The shadow is not your enemy, but a teacher. By acknowledging its presence, you gain awareness of the internal forces that may sometimes limit your highest potential."
      }
    };
  }
}

// Helper function to process strengths data
function processStrengths(strengths: any): { title: string; description: string }[] {
  if (!strengths || !Array.isArray(strengths)) {
    return [
      {
        title: "Intuitive Problem Solving",
        description: "You possess an uncanny ability to sense solutions without conscious reasoning, connecting patterns in ways others miss."
      },
      {
        title: "Emotional Intelligence Catalyst",
        description: "Your presence creates emotional clarity for others, allowing them to understand their own feelings better when in your company."
      },
      {
        title: "Adaptive Resilience",
        description: "You transform challenges into opportunities with unusual grace, bending rather than breaking under pressure in ways you rarely acknowledge."
      }
    ];
  }
  
  return strengths.map((strength: any) => ({
    title: strength.title || "",
    description: strength.description || ""
  }));
}

// Helper function to get default emotions
function getDefaultEmotions(): Emotion[] {
  return [
    { name: "Curiosity", value: 60, color: "bg-electric-blue" },
    { name: "Hope", value: 80, color: "bg-ethereal-green" },
    { name: "Anxiety", value: 30, color: "bg-warning-orange" },
    { name: "Confidence", value: 45, color: "bg-neon-purple" },
    { name: "Wonder", value: 70, color: "bg-electric-blue" }
  ];
}

export const openaiService = {
  generateQuestions,
  analyzeResponse,
  generateProfile
};
