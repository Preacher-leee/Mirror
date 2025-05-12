import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Emotion, MirrorProfile, ResponseAnalysis } from "@/types";
import { useMirrorWorld } from "@/contexts/MirrorWorldContext";

// Default emotions
const DEFAULT_EMOTIONS: Emotion[] = [
  { name: "Curiosity", value: 60, color: "bg-electric-blue" },
  { name: "Hope", value: 80, color: "bg-ethereal-green" },
  { name: "Anxiety", value: 30, color: "bg-warning-orange" },
  { name: "Confidence", value: 45, color: "bg-neon-purple" },
  { name: "Wonder", value: 70, color: "bg-electric-blue" }
];

// Default mirror profile
const DEFAULT_PROFILE: MirrorProfile = {
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
};

export function useAnalysis() {
  const [emotionData, setEmotionData] = useState<Emotion[]>(DEFAULT_EMOTIONS);
  const [mirrorProfile, setMirrorProfile] = useState<MirrorProfile>(DEFAULT_PROFILE);
  const { responses, sessionId, currentQuestionIndex } = useMirrorWorld();
  
  // Mutation for analyzing a single response
  const analyzeMutation = useMutation({
    mutationFn: async (response: string) => {
      if (!response.trim()) return null;
      
      // Use the openaiService which now includes session ID and question index
      const data = await apiRequest("POST", "/api/analyze", { 
        response,
        sessionId,
        questionIndex: currentQuestionIndex
      });
      return await data.json();
    },
    onSuccess: (data) => {
      if (data && data.analysis && data.analysis.emotions) {
        setEmotionData(data.analysis.emotions);
        
        // Save the response to the database including emotion data
        if (sessionId && responses[currentQuestionIndex]) {
          try {
            apiRequest("POST", "/api/responses", {
              sessionId,
              questionIndex: currentQuestionIndex,
              responseText: responses[currentQuestionIndex],
              emotionData: data.analysis.emotions
            });
          } catch (error) {
            console.error("Error saving response data:", error);
          }
        }
      } else {
        // If API fails, use the default emotions
        setEmotionData(DEFAULT_EMOTIONS);
      }
    }
  });
  
  // Calculate if we should fetch the profile
  const hasEnoughResponses = responses.filter(r => r.trim().length > 0).length >= 5;
  const canFetchProfile = !!sessionId && hasEnoughResponses;
  
  // Query for generating the final mirror profile
  const { data: profileData } = useQuery({
    queryKey: ["/api/profile", sessionId],
    enabled: canFetchProfile, // Only run when we have session ID and at least 5 non-empty responses
    queryFn: async () => {
      try {
        const res = await apiRequest("POST", "/api/profile", { 
          responses,
          sessionId
        });
        return await res.json();
      } catch (error) {
        console.error("Error generating profile:", error);
        return { mirrorProfile: DEFAULT_PROFILE };
      }
    },
  });
  
  // Update mirror profile when data is available
  if (profileData && profileData.mirrorProfile) {
    if (JSON.stringify(profileData.mirrorProfile) !== JSON.stringify(mirrorProfile)) {
      setMirrorProfile(profileData.mirrorProfile);
    }
  }
  
  const analyzeResponse = (response: string) => {
    if (response.trim()) {
      analyzeMutation.mutate(response);
    }
  };
  
  return {
    emotionData,
    mirrorProfile,
    analyzeResponse,
    isAnalyzing: analyzeMutation.isPending
  };
}
