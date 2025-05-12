import { motion, AnimatePresence } from "framer-motion";
import { useMirrorWorld } from "@/contexts/MirrorWorldContext";
import AIEntity from "@/components/AIEntity";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface WelcomeScreenProps {
  visible: boolean;
}

export default function WelcomeScreen({ visible }: WelcomeScreenProps) {
  const { setScreen } = useMirrorWorld();
  const [soundOn, setSoundOn] = useState(false);
  
  const handleBeginJourney = () => {
    console.log("BEGIN JOURNEY clicked, changing to interview screen");
    
    // Force screen change multiple ways to ensure it works
    setScreen("interview");
    
    // Use direct DOM manipulation as a last resort to ensure the button works
    document.querySelectorAll('.welcome-screen').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    document.querySelectorAll('.interview-screen').forEach(el => {
      (el as HTMLElement).style.display = 'block';
    });
    
    // Also try with a timeout
    setTimeout(() => {
      console.log("Forced interview screen after timeout");
      setScreen("interview");
    }, 100);
  };
  
  const toggleSound = () => {
    setSoundOn(!soundOn);
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center portal-bg welcome-screen"
        >
          <motion.div 
            className="glass-panel rounded-2xl p-8 max-w-md relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.3, 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 loading-bar"></div>
            
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
                onClick={handleBeginJourney}
                className="font-orbitron text-cosmic-black bg-electric-blue px-8 py-6 rounded-full hover:bg-neon-purple hover:text-white transition-all duration-300 transform hover:scale-105"
                onMouseDown={(e) => {
                  // Extra click handling to ensure it works
                  e.preventDefault();
                  console.log("Button pressed");
                }}
                onMouseUp={(e) => {
                  // Extra click handling to ensure it works
                  e.preventDefault();
                  console.log("Button released, triggering handleBeginJourney");
                  handleBeginJourney();
                }}
              >
                BEGIN JOURNEY
              </Button>
            </div>
          </motion.div>
          
          {/* AI Entity visualization */}
          <motion.div 
            className="absolute bottom-8 w-full flex justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <AIEntity size="md" />
          </motion.div>
          
          <motion.div 
            className="absolute top-4 right-4 md:top-8 md:right-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button 
              onClick={toggleSound}
              className="text-twilight-blue hover:text-electric-blue transition-colors p-2"
            >
              {soundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
