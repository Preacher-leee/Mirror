import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMirrorWorld } from "@/contexts/MirrorWorldContext";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalysis } from "@/hooks/useAnalysis";

interface ResultsScreenProps {
  visible: boolean;
}

export default function ResultsScreen({ visible }: ResultsScreenProps) {
  const { setScreen, resetJourney } = useMirrorWorld();
  const [showShadow, setShowShadow] = useState(false);
  const { toast } = useToast();
  const { mirrorProfile } = useAnalysis();
  
  const handleDownloadProfile = async () => {
    try {
      // This would be implemented with a proper PDF generation library
      toast({
        title: "Download Started",
        description: "Your mirror profile will be downloaded shortly.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your profile.",
        variant: "destructive",
      });
    }
  };
  
  const handleShareProfile = () => {
    // This would be implemented with a proper sharing functionality
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: "My Mirror World Profile",
        text: "Check out my Mirror World profile!",
        url: shareUrl,
      }).catch(() => {
        // Fallback if sharing fails
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Share link copied to clipboard",
        });
      });
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard",
      });
    }
  };
  
  const handleRestartJourney = () => {
    resetJourney();
    setScreen("welcome");
  };
  
  const toggleShadow = () => {
    setShowShadow(!showShadow);
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-20 portal-bg"
        >
          <div className="relative min-h-screen overflow-y-auto py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8 md:mb-12"
              >
                <h2 className="font-rajdhani font-bold text-3xl md:text-5xl gradient-text">Your Mirror World Profile</h2>
                <p className="font-space text-electric-blue mt-4 max-w-xl mx-auto">A reflection of your unrealized potential and strengths hidden from your conscious awareness</p>
              </motion.header>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mirror Avatar */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="glass-panel rounded-2xl p-6 col-span-1 md:sticky md:top-4 self-start"
                >
                  <h3 className="font-rajdhani font-bold text-xl text-neon-purple mb-4">MIRROR ENTITY MANIFESTATION</h3>
                  
                  <div className="aspect-square rounded-xl overflow-hidden relative">
                    {/* Using an SVG background instead of an image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-deep-purple via-cosmic-black to-dark-slate flex items-center justify-center">
                      <svg viewBox="0 0 200 200" width="100%" height="100%" className="opacity-30">
                        <defs>
                          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--neon-purple))" />
                            <stop offset="100%" stopColor="hsl(var(--electric-blue))" />
                          </linearGradient>
                        </defs>
                        <path d="M43.2,-68.2C54.9,-61.5,62.5,-47.1,67.5,-32.6C72.5,-18.1,74.9,-3.7,73.1,11.1C71.3,25.8,65.3,40.8,54.2,47.9C43.1,55,26.9,54.1,12.4,56.7C-2.1,59.3,-14.9,65.5,-27.8,64.7C-40.8,64,-53.9,56.4,-61.9,44.8C-69.8,33.2,-72.7,17.6,-72.8,0C-72.9,-17.5,-70.2,-36.9,-59.6,-45.8C-49,-54.6,-30.6,-52.8,-15.3,-56.9C0,-61,16.2,-71,29.9,-71.1C43.6,-71.2,54.9,-61.4,43.2,-68.2Z" transform="translate(100 100)" fill="url(#grad1)">
                          <animateTransform 
                            attributeName="transform" 
                            type="translate" 
                            from="100 100" 
                            to="100 110" 
                            begin="0s" 
                            dur="10s" 
                            repeatCount="indefinite" 
                            additive="sum"
                          />
                          <animate 
                            attributeName="d" 
                            dur="20s" 
                            repeatCount="indefinite" 
                            values="M43.2,-68.2C54.9,-61.5,62.5,-47.1,67.5,-32.6C72.5,-18.1,74.9,-3.7,73.1,11.1C71.3,25.8,65.3,40.8,54.2,47.9C43.1,55,26.9,54.1,12.4,56.7C-2.1,59.3,-14.9,65.5,-27.8,64.7C-40.8,64,-53.9,56.4,-61.9,44.8C-69.8,33.2,-72.7,17.6,-72.8,0C-72.9,-17.5,-70.2,-36.9,-59.6,-45.8C-49,-54.6,-30.6,-52.8,-15.3,-56.9C0,-61,16.2,-71,29.9,-71.1C43.6,-71.2,54.9,-61.4,43.2,-68.2Z;
                            M44.2,-73.1C55.8,-66,62.6,-49.6,66.9,-34.3C71.3,-19,73.1,-4.7,70.6,8.4C68.1,21.4,61.3,33.2,51.7,42.2C42,51.3,29.6,57.6,15.3,63.5C1.1,69.3,-15,74.7,-28.3,71.2C-41.7,67.6,-52.2,55,-60.1,41.4C-68,27.9,-73.2,13.9,-75.1,-1.1C-77.1,-16.1,-75.8,-32.2,-68.3,-44.5C-60.8,-56.7,-47.1,-65,-33.3,-69.9C-19.6,-74.7,-5.9,-76.2,7.5,-73.4C20.9,-70.7,32.7,-80.1,44.2,-73.1Z;
                            M47.3,-77.9C58.7,-70.5,63.7,-52.1,69.1,-35.7C74.5,-19.3,80.4,-5,78.9,8.2C77.4,21.4,68.6,33.6,58.1,42.4C47.6,51.2,35.5,56.7,22,64.3C8.5,72,-6.3,81.7,-17,77.9C-27.6,74.1,-34.1,56.7,-43.1,44C-52.1,31.3,-63.6,23.2,-71.1,11.1C-78.6,-1,-82.1,-17.1,-76,-28.4C-69.9,-39.7,-54.2,-46.1,-40.4,-52.6C-26.5,-59.1,-14.5,-65.7,1.8,-68.7C18.2,-71.8,35.8,-85.3,47.3,-77.9Z;
                            M43.2,-68.2C54.9,-61.5,62.5,-47.1,67.5,-32.6C72.5,-18.1,74.9,-3.7,73.1,11.1C71.3,25.8,65.3,40.8,54.2,47.9C43.1,55,26.9,54.1,12.4,56.7C-2.1,59.3,-14.9,65.5,-27.8,64.7C-40.8,64,-53.9,56.4,-61.9,44.8C-69.8,33.2,-72.7,17.6,-72.8,0C-72.9,-17.5,-70.2,-36.9,-59.6,-45.8C-49,-54.6,-30.6,-52.8,-15.3,-56.9C0,-61,16.2,-71,29.9,-71.1C43.6,-71.2,54.9,-61.4,43.2,-68.2Z"
                          />
                        </path>
                      </svg>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black to-transparent opacity-80"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-orbitron text-sm text-electric-blue">ENTITY DESIGNATION:</p>
                      <h4 className="font-rajdhani font-bold text-2xl text-white">{mirrorProfile.entityName}</h4>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <Button
                      onClick={handleDownloadProfile}
                      className="flex items-center justify-center space-x-2 font-orbitron text-sm bg-neon-purple text-white px-4 py-2 rounded-full hover:bg-electric-blue transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span>DOWNLOAD PROFILE</span>
                    </Button>
                    
                    <Button
                      onClick={handleShareProfile}
                      variant="outline"
                      className="flex items-center justify-center space-x-2 font-orbitron text-sm border border-twilight-blue text-twilight-blue px-4 py-2 rounded-full hover:border-electric-blue hover:text-electric-blue transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      <span>SHARE</span>
                    </Button>
                  </div>
                </motion.div>
                
                {/* Profile Details */}
                <div className="col-span-1 space-y-8">
                  {/* Hidden Strengths */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel rounded-2xl p-6"
                  >
                    <h3 className="font-rajdhani font-bold text-xl text-neon-purple mb-4">HIDDEN STRENGTHS</h3>
                    
                    <ul className="space-y-4">
                      {mirrorProfile.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <div className="min-w-8 h-8 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-ethereal-green"></div>
                          </div>
                          <div>
                            <h4 className="font-space font-medium text-electric-blue">{strength.title}</h4>
                            <p className="font-space text-twilight-blue text-sm mt-1">{strength.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  {/* Unrealized Potential */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-panel rounded-2xl p-6"
                  >
                    <h3 className="font-rajdhani font-bold text-xl text-neon-purple mb-4">UNREALIZED POTENTIAL</h3>
                    
                    <div className="prose prose-invert max-w-none">
                      {mirrorProfile.unrealizedPotential.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={`font-space ${index === mirrorProfile.unrealizedPotential.split('\n\n').length - 1 ? 'text-electric-blue' : 'text-twilight-blue'} leading-relaxed ${index > 0 ? 'mt-4' : ''}`}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Poetic Summary */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="glass-panel rounded-2xl p-6"
                  >
                    <h3 className="font-rajdhani font-bold text-xl text-neon-purple mb-4">MIRROR WORLD REFLECTION</h3>
                    
                    <div className="prose prose-invert max-w-none">
                      <p className="font-rajdhani text-electric-blue text-xl italic leading-relaxed whitespace-pre-line">
                        {mirrorProfile.poeticSummary}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Shadow Echo (Bonus Feature) */}
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="glass-panel rounded-2xl p-6 border border-warning-orange"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-rajdhani font-bold text-xl text-warning-orange">SHADOW ECHO</h3>
                      
                      <Button
                        onClick={toggleShadow}
                        variant="outline"
                        className="font-orbitron text-xs text-warning-orange border border-warning-orange px-3 py-1 rounded-full hover:bg-warning-orange hover:text-cosmic-black transition-colors"
                      >
                        {showShadow ? "HIDE" : "REVEAL"}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {showShadow && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="prose prose-invert max-w-none">
                            {mirrorProfile.shadowEcho.split('\n\n').map((paragraph, index) => (
                              <p key={index} className={`font-space ${index === mirrorProfile.shadowEcho.split('\n\n').length - 1 ? 'text-warning-orange' : 'text-twilight-blue'} leading-relaxed ${index > 0 ? 'mt-4' : ''}`}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
              
              {/* Start Over Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-center"
              >
                <Button
                  onClick={handleRestartJourney}
                  variant="outline"
                  className="font-orbitron text-sm border border-twilight-blue text-twilight-blue px-6 py-3 rounded-full hover:border-electric-blue hover:text-electric-blue transition-colors"
                >
                  BEGIN NEW JOURNEY
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
