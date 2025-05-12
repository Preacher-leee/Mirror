import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMirrorWorld } from "@/contexts/MirrorWorldContext";
import SplashScreen from "@/components/SplashScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import InterviewScreen from "@/components/InterviewScreen";
import ResultsScreen from "@/components/ResultsScreen";
import { Helmet } from 'react-helmet';
import { Button } from "@/components/ui/button";
import AIEntity from "@/components/AIEntity";
import { ScreenType, Emotion } from "@/types";
import EmotiveBackground from "@/components/EmotiveBackground";
import AdaptiveAudio from "@/components/AdaptiveAudio";

export default function Home() {
  // We'll use a local state for screen management to simplify things
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("welcome");
  const { sessionId } = useMirrorWorld();
  
  // Add state for emotion data
  const [emotions, setEmotions] = useState<Emotion[]>([
    { name: "Curiosity", value: 80, color: "bg-electric-blue" },
    { name: "Hope", value: 60, color: "bg-ethereal-green" },
    { name: "Wonder", value: 70, color: "bg-neon-purple" }
  ]);
  
  // Audio playback state
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Log for debugging
  useEffect(() => {
    console.log("Current screen (local state):", currentScreen);
    console.log("Current session ID:", sessionId);
  }, [currentScreen, sessionId]);
  
  // Update emotions on screen change (for demo purposes)
  useEffect(() => {
    if (currentScreen === "welcome") {
      setEmotions([
        { name: "Curiosity", value: 80, color: "bg-electric-blue" },
        { name: "Hope", value: 60, color: "bg-ethereal-green" },
        { name: "Wonder", value: 70, color: "bg-neon-purple" }
      ]);
    } else if (currentScreen === "interview") {
      setEmotions([
        { name: "Curiosity", value: 65, color: "bg-electric-blue" },
        { name: "Anxiety", value: 40, color: "bg-warning-orange" },
        { name: "Confidence", value: 55, color: "bg-neon-purple" }
      ]);
    } else if (currentScreen === "results") {
      setEmotions([
        { name: "Wonder", value: 85, color: "bg-neon-purple" },
        { name: "Hope", value: 75, color: "bg-ethereal-green" },
        { name: "Curiosity", value: 50, color: "bg-electric-blue" }
      ]);
    }
  }, [currentScreen]);
  
  // Handler functions
  const handleStartInterview = () => {
    console.log("Starting interview");
    setCurrentScreen("interview");
  };
  
  const handleStartOver = () => {
    console.log("Starting over");
    setCurrentScreen("welcome");
  };
  
  const handleShowResults = () => {
    console.log("Showing results");
    setCurrentScreen("results"); 
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    console.log(`Audio ${!audioEnabled ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <>
      <Helmet>
        <title>Mirror World Interviewer | Discover Your Hidden Self</title>
        <meta name="description" content="Step into the Mirror World and discover your unseen potential through an AI-guided interview. Reveal strengths you're blind to and your unrealized potential." />
        <meta property="og:title" content="Mirror World Interviewer | Discover Your Hidden Self" />
        <meta property="og:description" content="Step into the Mirror World and discover your unseen potential through an AI-guided interview. Reveal strengths you're blind to and your unrealized potential." />
        <meta property="og:type" content="website" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;700&family=Orbitron:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="relative min-h-screen">
        {/* WebGL background that responds to emotions */}
        <EmotiveBackground emotions={emotions} intensity={1.2} />
        
        {/* Adaptive audio system */}
        <AdaptiveAudio emotions={emotions} isPlaying={audioEnabled} volume={0.3} />

        {/* WELCOME SCREEN */}
        {currentScreen === "welcome" && (
          <div className="fixed inset-0 z-40 flex flex-col items-center justify-center portal-bg bg-opacity-50">
            <div className="glass-panel rounded-2xl p-8 max-w-md relative overflow-hidden">
              <h2 className="font-rajdhani font-bold text-3xl gradient-text mb-6 text-center">Welcome, Traveler</h2>
              
              <p className="font-space text-twilight-blue leading-relaxed mb-6 text-center">
                You've crossed the threshold into the Mirror World, where reflections reveal what eyes cannot see.
                <span className="block mt-4 text-electric-blue">I am your guide—an entity from the space between realities.</span>
              </p>
              
              <p className="font-space text-twilight-blue leading-relaxed mb-8 text-center">
                Through our conversation, I will create a portrait of your mirror self—the you that exists in potential, beyond your awareness.
              </p>
              
              <div className="text-center">
                <Button 
                  onClick={handleStartInterview}
                  className="font-orbitron text-cosmic-black bg-electric-blue px-8 py-6 rounded-full hover:bg-neon-purple hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  BEGIN JOURNEY
                </Button>
              </div>
            </div>
            
            <div className="absolute bottom-16 md:bottom-24 right-8 md:right-16 pointer-events-none">
              <AIEntity size="md" />
            </div>
            
            {/* Sound toggle button */}
            <button
              onClick={toggleAudio}
              className="absolute top-4 right-4 p-3 bg-dark-slate bg-opacity-50 rounded-full text-twilight-blue hover:text-electric-blue transition-colors z-50"
              aria-label={audioEnabled ? "Disable sound" : "Enable sound"}
            >
              {audioEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* INTERVIEW SCREEN with questions */}
        {currentScreen === "interview" && (
          <div className="fixed inset-0 z-30 portal-bg bg-opacity-30 flex flex-col items-center justify-center">
            <InterviewScreen 
              visible={true} 
              onComplete={handleShowResults} 
            />
            
            {/* Sound toggle button */}
            <button
              onClick={toggleAudio}
              className="absolute top-4 right-4 p-3 bg-dark-slate bg-opacity-50 rounded-full text-twilight-blue hover:text-electric-blue transition-colors z-50"
              aria-label={audioEnabled ? "Disable sound" : "Enable sound"}
            >
              {audioEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* RESULTS SCREEN */}
        {currentScreen === "results" && (
          <div className="fixed inset-0 z-30 portal-bg bg-opacity-30 flex flex-col items-center justify-center">
            <div className="glass-panel rounded-2xl p-8 max-w-md relative overflow-hidden">
              <h2 className="font-rajdhani font-bold text-2xl gradient-text mb-6 text-center">Your Mirror Profile</h2>
              <p className="font-space text-twilight-blue mb-8">
                Here is the reflection of your hidden potential and strengths.
              </p>
              
              <div className="text-center">
                <Button 
                  onClick={handleStartOver}
                  className="font-orbitron bg-electric-blue text-cosmic-black px-8 py-4 rounded-full hover:bg-neon-purple hover:text-white transition-all duration-300"
                >
                  START OVER
                </Button>
              </div>
            </div>
            
            {/* Sound toggle button */}
            <button
              onClick={toggleAudio}
              className="absolute top-4 right-4 p-3 bg-dark-slate bg-opacity-50 rounded-full text-twilight-blue hover:text-electric-blue transition-colors z-50"
              aria-label={audioEnabled ? "Disable sound" : "Enable sound"}
            >
              {audioEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
