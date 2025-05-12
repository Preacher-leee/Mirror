import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuestions } from '@/hooks/useQuestions';
import { useMirrorWorld } from '@/contexts/MirrorWorldContext';
import AIEntity from '@/components/AIEntity';

interface InterviewScreenProps {
  visible: boolean;
  onComplete: () => void;
}

export default function InterviewScreen({ visible, onComplete }: InterviewScreenProps) {
  const [currentResponse, setCurrentResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addResponse } = useMirrorWorld();
  
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    userResponses,
    goToNextQuestion,
    goToPreviousQuestion,
    saveResponse
  } = useQuestions();

  // Handle response submission
  const handleSubmitResponse = () => {
    if (!currentResponse.trim()) return;
    
    setIsSubmitting(true);
    
    // Save the response locally
    saveResponse(currentResponse);
    
    // Add to context for later analysis
    addResponse(currentResponse);
    
    // If this is the last question, trigger completion
    if (isLastQuestion) {
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete();
      }, 800);
    } else {
      // Go to next question
      setTimeout(() => {
        setCurrentResponse('');
        setIsSubmitting(false);
        goToNextQuestion();
      }, 800);
    }
  };

  // Handle going back to previous question
  const handlePrevious = () => {
    goToPreviousQuestion();
    const previousResponse = userResponses[currentQuestionIndex - 1] || '';
    setCurrentResponse(previousResponse);
  };

  if (!visible) return null;

  return (
    <div className="relative z-40 w-full max-w-3xl mx-auto p-4 md:p-6">
      {/* Question number indicator */}
      <div className="text-center mb-4">
        <span className="font-space text-sm text-electric-blue">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>
      
      {/* Main interview panel */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex items-start mb-6">
          {/* AI Entity */}
          <div className="mr-4 flex-shrink-0">
            <AIEntity size="sm" showMouth={true} />
          </div>
          
          {/* Question text */}
          <div>
            <h2 className="font-rajdhani font-bold text-xl md:text-2xl gradient-text mb-2">
              {currentQuestion.text}
            </h2>
            <p className="font-space text-sm text-twilight-blue opacity-80">
              Take your time. Be honest with yourself.
            </p>
          </div>
        </div>
        
        {/* Response textarea */}
        <Textarea 
          value={currentResponse}
          onChange={(e) => setCurrentResponse(e.target.value)}
          placeholder="Type your response here..."
          className="min-h-[120px] bg-dark-slate/40 border-neon-purple/30 text-white font-space mb-6"
        />
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button 
            onClick={handlePrevious}
            variant="outline"
            disabled={isFirstQuestion || isSubmitting}
            className="font-orbitron border-electric-blue text-electric-blue hover:bg-electric-blue/20"
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleSubmitResponse}
            disabled={!currentResponse.trim() || isSubmitting}
            className={`font-orbitron ${isLastQuestion ? 'bg-neon-purple' : 'bg-electric-blue text-cosmic-black'} px-6 transition-all duration-300`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              isLastQuestion ? "Complete Interview" : "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}