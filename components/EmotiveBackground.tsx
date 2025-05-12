import React, { useMemo } from 'react';
import { Emotion } from '@/types';

interface EmotiveBackgroundProps {
  emotions: Emotion[];
  intensity?: number;
}

/**
 * A simpler, CSS-based implementation for the emotive background
 * that provides a visual representation of the current emotional state
 * without requiring Three.js and WebGL
 */
export default function EmotiveBackground({ emotions = [], intensity = 1 }: EmotiveBackgroundProps) {
  // Set default emotions if none provided
  const defaultEmotions: Emotion[] = [
    { name: "Curiosity", value: 60, color: "bg-electric-blue" },
    { name: "Hope", value: 50, color: "bg-ethereal-green" },
    { name: "Wonder", value: 70, color: "bg-neon-purple" }
  ];
  
  const emotionsToUse = emotions.length > 0 ? emotions : defaultEmotions;
  
  // Get the dominant emotion for main background color
  const dominantEmotion = useMemo(() => {
    if (emotionsToUse.length === 0) return null;
    return [...emotionsToUse].sort((a, b) => b.value - a.value)[0];
  }, [emotionsToUse]);
  
  // Map emotion color classes to actual CSS gradient values
  const gradientColors = useMemo(() => {
    const colorMap: Record<string, string> = {
      "bg-electric-blue": "#33ccff",
      "bg-ethereal-green": "#42e66c",
      "bg-neon-purple": "#6f42c1", 
      "bg-warning-orange": "#ff7842"
    };
    
    return emotionsToUse.map(emotion => ({
      color: colorMap[emotion.color] || "#6f42c1",
      weight: emotion.value
    }));
  }, [emotionsToUse]);
  
  // Create a gradient based on all emotions
  const gradientStyle = useMemo(() => {
    // Sort by weight/intensity
    const sortedColors = [...gradientColors].sort((a, b) => b.weight - a.weight);
    
    // Create stops with relative positions
    let totalWeight = sortedColors.reduce((sum, item) => sum + item.weight, 0);
    let stops = "";
    let currentPos = 0;
    
    sortedColors.forEach(({ color, weight }) => {
      const normalizedWeight = weight / totalWeight;
      stops += `${color} ${Math.round(currentPos * 100)}%, ${color} ${Math.round((currentPos + normalizedWeight) * 100)}%, `;
      currentPos += normalizedWeight;
    });
    
    // Remove trailing comma and space
    stops = stops.slice(0, -2);
    
    const gradientSpeed = (100 - Math.min(70, Math.max(30, dominantEmotion?.value || 50))) / 10;
    
    return {
      background: `linear-gradient(135deg, ${stops})`,
      backgroundSize: '400% 400%',
      animation: `gradient ${gradientSpeed}s ease infinite`,
    };
  }, [gradientColors, dominantEmotion]);
  
  // Create particles based on emotions
  const particles = useMemo(() => {
    const count = Math.floor(30 * intensity);
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 6 + 2; // 2-8px
      const emotionIndex = i % emotionsToUse.length;
      const speed = (emotionsToUse[emotionIndex]?.value || 50) / 20; // 2.5-5s
      
      return {
        id: i,
        size,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${speed + Math.random() * 3}s`,
        delay: `${Math.random() * 5}s`,
        color: gradientColors[emotionIndex]?.color || "#6f42c1",
        opacity: Math.random() * 0.5 + 0.2, // 0.2-0.7
      };
    });
  }, [emotionsToUse, intensity, gradientColors]);
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={gradientStyle}>
      {/* Add animated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animation: `float ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}
      
      {/* Add a subtle noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-10"></div>
    </div>
  );
}