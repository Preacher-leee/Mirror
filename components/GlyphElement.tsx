import { motion } from "framer-motion";

interface GlyphElementProps {
  symbol: string;
  position: {
    top: string;
    left: string;
  };
  delay: number;
  color: string;
}

export default function GlyphElement({ symbol, position, delay, color }: GlyphElementProps) {
  return (
    <motion.div
      className="absolute glyph"
      style={{ 
        top: position.top, 
        left: position.left
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ 
        delay: delay * 0.2,
        duration: 0.8,
      }}
    >
      <motion.div
        className={`w-8 h-8 ${color} opacity-70`}
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 8,
          delay: delay * 0.5,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        {symbol}
      </motion.div>
    </motion.div>
  );
}
