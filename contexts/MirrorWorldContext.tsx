import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ScreenType } from "@/types";
import { nanoid } from "nanoid";

interface MirrorWorldContextType {
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  responses: string[];
  addResponse: (response: string) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  resetJourney: () => void;
  sessionId: string;
}

// Generate a unique session ID
function generateSessionId(): string {
  // Check if there's a session ID in localStorage first
  const storedSessionId = localStorage.getItem('mirrorworld_session_id');
  if (storedSessionId) {
    return storedSessionId;
  }
  
  // Generate a new session ID if none exists
  const newSessionId = nanoid();
  localStorage.setItem('mirrorworld_session_id', newSessionId);
  return newSessionId;
}

// Initialize with welcome screen instead of splash to bypass transition issue
const initialScreen: ScreenType = "welcome";

// Create a default context value
const defaultContextValue: MirrorWorldContextType = {
  screen: initialScreen,
  setScreen: () => {},
  responses: [],
  addResponse: () => {},
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: () => {},
  resetJourney: () => {},
  sessionId: "",
};

const MirrorWorldContext = createContext<MirrorWorldContextType>(defaultContextValue);

export function MirrorWorldProvider({ children }: { children: ReactNode }) {
  // Start with welcome screen to bypass transition issue
  const [screen, setScreen] = useState<ScreenType>(initialScreen);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  
  // Initialize session ID
  useEffect(() => {
    setSessionId(generateSessionId());
    
    // Log the current screen right away
    console.log("Initial screen state:", initialScreen);
  }, []);
  
  // Enhanced setScreen function with logging
  const handleScreenChange = (newScreen: ScreenType) => {
    console.log(`Changing screen from ${screen} to ${newScreen}`);
    
    // Directly set the state to ensure it updates
    setScreen(newScreen);
    
    // For debugging - force set it again after a short delay
    setTimeout(() => {
      console.log(`Forced update to ${newScreen}`);
      setScreen(newScreen);
    }, 50);
  };
  
  const addResponse = (response: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = response;
    setResponses(newResponses);
  };
  
  const resetJourney = () => {
    setResponses([]);
    setCurrentQuestionIndex(0);
    handleScreenChange("welcome"); // Start at welcome instead of splash
    
    // Generate a new session ID for a new journey
    const newSessionId = nanoid();
    localStorage.setItem('mirrorworld_session_id', newSessionId);
    setSessionId(newSessionId);
  };
  
  return (
    <MirrorWorldContext.Provider
      value={{
        screen,
        setScreen: handleScreenChange,
        responses,
        addResponse,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        resetJourney,
        sessionId
      }}
    >
      {children}
    </MirrorWorldContext.Provider>
  );
}

export function useMirrorWorld() {
  const context = useContext(MirrorWorldContext);
  return context;
}
