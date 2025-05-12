import { motion, AnimatePresence } from "framer-motion";
import { useMirrorWorld } from "@/contexts/MirrorWorldContext";
import GlyphElement from "@/components/GlyphElement";
import PortalEffect from "@/components/PortalEffect";

interface SplashScreenProps {
  visible: boolean;
}

const glyphs = [
  { symbol: "⦿", top: "20%", left: "20%", delay: 0, color: "text-neon-purple" },
  { symbol: "⟟", top: "70%", left: "25%", delay: 1, color: "text-electric-blue" },
  { symbol: "⏣", top: "30%", left: "80%", delay: 2, color: "text-ethereal-green" },
  { symbol: "⏧", top: "80%", left: "75%", delay: 3, color: "text-neon-purple" },
  { symbol: "⎊", top: "50%", left: "10%", delay: 4, color: "text-electric-blue" },
  { symbol: "⏥", top: "40%", left: "90%", delay: 5, color: "text-ethereal-green" },
];

export default function SplashScreen({ visible }: SplashScreenProps) {
  const { setScreen } = useMirrorWorld();
  
  const handleContinue = () => {
    console.log("Manually transitioning to welcome screen");
    setScreen("welcome");
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center portal-bg"
        >
          <PortalEffect />
          
          <motion.div 
            className="absolute bottom-12 w-64 h-1 bg-dark-slate rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "16rem" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="loading-bar h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "easeInOut" }}
            />
          </motion.div>
          
          <motion.div
            className="absolute bottom-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="font-space text-sm text-twilight-blue animate-pulse">preparing to scan your consciousness</p>
          </motion.div>
          
          <motion.button 
            onClick={handleContinue}
            className="absolute bottom-20 right-8 px-6 py-2 font-orbitron text-sm bg-neon-purple text-white rounded-full hover:bg-electric-blue transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            CONTINUE
          </motion.button>

          {/* Floating glyphs around the portal */}
          <div className="absolute w-full h-full pointer-events-none">
            {glyphs.map((glyph, index) => (
              <GlyphElement 
                key={index}
                symbol={glyph.symbol}
                position={{ top: glyph.top, left: glyph.left }}
                delay={glyph.delay}
                color={glyph.color}
              />
            ))}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
