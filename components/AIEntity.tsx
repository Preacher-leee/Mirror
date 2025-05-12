import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AIEntityProps {
  size?: "sm" | "md" | "lg";
  showMouth?: boolean;
}

export default function AIEntity({ size = "sm", showMouth = true }: AIEntityProps) {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const entityRef = useRef<HTMLDivElement>(null);
  
  // Get size values based on the size prop
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-24 h-24 md:w-32 md:h-32";
      case "md":
        return "w-40 h-40 md:w-60 md:h-60";
      case "lg":
        return "w-40 h-40 md:w-80 md:h-80";
      default:
        return "w-24 h-24 md:w-32 md:h-32";
    }
  };
  
  const getEyeSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-6 h-6";
      case "lg":
        return "w-10 h-10";
      default:
        return "w-4 h-4";
    }
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!entityRef.current) return;
      
      const rect = entityRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate the direction from center of entity to mouse
      const maxMove = 3;
      const distX = (e.clientX - centerX) / 50;
      const distY = (e.clientY - centerY) / 50;
      
      // Clamp the movement
      const moveX = Math.min(Math.max(distX, -maxMove), maxMove);
      const moveY = Math.min(Math.max(distY, -maxMove), maxMove);
      
      setEyePosition({ x: moveX, y: moveY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  return (
    <div className={`relative ${getSizeClass()}`} ref={entityRef}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-purple to-electric-blue opacity-50 animate-pulse"></div>
      <div className="absolute inset-4 rounded-full bg-dark-slate flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="w-full flex justify-center mb-6">
            <div className={`${getEyeSize()} rounded-full bg-electric-blue mx-2 relative`}>
              <motion.div
                className="absolute inset-2 rounded-full bg-cosmic-black"
                animate={{
                  x: eyePosition.x,
                  y: eyePosition.y,
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                }}
              ></motion.div>
            </div>
            <div className={`${getEyeSize()} rounded-full bg-electric-blue mx-2 relative`}>
              <motion.div
                className="absolute inset-2 rounded-full bg-cosmic-black"
                animate={{
                  x: eyePosition.x,
                  y: eyePosition.y,
                }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                }}
              ></motion.div>
            </div>
          </div>
          
          {/* Mouth representation */}
          {showMouth && (
            <motion.div
              className="w-32 h-2 bg-electric-blue rounded-full"
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            ></motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
