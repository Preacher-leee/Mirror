import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Emotion {
  name: string;
  value: number;
  color: string;
}

interface EmotionChartProps {
  emotions: Emotion[];
}

export default function EmotionChart({ emotions }: EmotionChartProps) {
  const [displayedEmotions, setDisplayedEmotions] = useState<Emotion[]>(emotions);
  
  // Update displayed emotions with animation when emotions change
  useEffect(() => {
    setDisplayedEmotions(emotions);
  }, [emotions]);
  
  return (
    <div className="flex justify-between space-x-2 mt-2">
      {displayedEmotions.map((emotion, index) => (
        <div key={index} className="flex-1">
          <div className="h-16 bg-dark-slate rounded-lg relative overflow-hidden">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${emotion.value}%` }}
              transition={{ duration: 0.5 }}
              className={`absolute bottom-0 w-full ${emotion.color} opacity-70`}
            ></motion.div>
          </div>
          <p className="text-center text-xs font-space text-twilight-blue mt-1">{emotion.name}</p>
        </div>
      ))}
    </div>
  );
}
