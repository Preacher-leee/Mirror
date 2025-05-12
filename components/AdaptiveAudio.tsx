import React, { useEffect, useRef, useState } from 'react';
import { Emotion } from '@/types';

interface AdaptiveAudioProps {
  emotions: Emotion[];
  isPlaying?: boolean;
  volume?: number;
}

// Sound URLs - in a real app, these would be proper audio files
const emotionSoundMap: Record<string, string> = {
  // Default sounds for different emotional states
  "Curiosity": "/sounds/curiosity.mp3",
  "Hope": "/sounds/hope.mp3",
  "Anxiety": "/sounds/anxiety.mp3", 
  "Confidence": "/sounds/confidence.mp3",
  "Wonder": "/sounds/wonder.mp3",
  // Fallback sound
  "default": "/sounds/ambient.mp3"
};

export default function AdaptiveAudio({ 
  emotions = [], 
  isPlaying = false,
  volume = 0.5
}: AdaptiveAudioProps) {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const defaultEmotions: Emotion[] = [
    { name: "Curiosity", value: 60, color: "bg-electric-blue" },
    { name: "Hope", value: 50, color: "bg-ethereal-green" },
    { name: "Wonder", value: 70, color: "bg-neon-purple" }
  ];
  
  const emotionsToUse = emotions.length > 0 ? emotions : defaultEmotions;

  // Initialize Audio Context
  useEffect(() => {
    // Only create the audio context when user interacts (to comply with browser autoplay policies)
    const initializeAudio = () => {
      if (audioInitialized) return;
      
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioContext.destination);
        gainNodeRef.current = gainNode;
        
        // Create audio elements for each emotion
        const emotionNames = Object.keys(emotionSoundMap);
        emotionNames.forEach(emotion => {
          // In a real implementation, we'd load actual audio files
          // For this demo, we'll simulate it
          const audio = document.createElement('audio');
          audio.src = emotionSoundMap[emotion] || emotionSoundMap.default;
          audio.loop = true;
          audioElementsRef.current[emotion] = audio;
        });
        
        setAudioInitialized(true);
        console.log("Audio system initialized");
      } catch (error) {
        console.error("Failed to initialize audio:", error);
      }
    };

    // Add event listener for user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove event listeners after initialization
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      
      // Cleanup audio context when component unmounts
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume when prop changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Play/pause audio based on emotions
  useEffect(() => {
    if (!audioInitialized || !isPlaying || emotionsToUse.length === 0) return;

    // Find dominant emotion
    const dominantEmotion = [...emotionsToUse].sort((a, b) => b.value - a.value)[0];
    const emotionName = dominantEmotion.name;
    
    console.log(`Adapting audio to dominant emotion: ${emotionName}`);
    
    // Simulate playing the appropriate emotion sound
    // In a real implementation, we'd use the Web Audio API to crossfade between sounds
    console.log(`Playing ${emotionName} audio at intensity ${dominantEmotion.value}`);
    
    // Return cleanup function
    return () => {
      // Cleanup and stop audio if needed
    };
  }, [isPlaying, emotionsToUse, audioInitialized]);

  // This component doesn't render anything visible
  return null;
}