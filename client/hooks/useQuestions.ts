import { useState, useCallback } from 'react';
import { InterviewQuestion } from '@/types';

const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    text: "When do you feel most like yourself?"
  },
  {
    id: 2,
    text: "What's a talent or quality you often overlook in yourself?"
  },
  {
    id: 3,
    text: "If fear didn't exist, what would you chase?"
  },
  {
    id: 4,
    text: "What kind of energy do people feel from you — and what do you wish they felt?"
  },
  {
    id: 5,
    text: "What's a role you've played in life that doesn't reflect the real you?"
  },
  {
    id: 6,
    text: "Describe a moment where you surprised yourself — in a good way."
  },
  {
    id: 7,
    text: "If your inner voice had a job, what would it be?"
  },
  {
    id: 8,
    text: "Which emotion do you suppress the most?"
  },
  {
    id: 9,
    text: "Who do you pretend to be… but aren't?"
  },
  {
    id: 10,
    text: "If your life was a symbol, what would it look like?"
  }
];

export function useQuestions() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const totalQuestions = interviewQuestions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === interviewQuestions.length - 1;

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const saveResponse = useCallback((response: string) => {
    setUserResponses(prev => {
      const newResponses = [...prev];
      newResponses[currentQuestionIndex] = response;
      return newResponses;
    });
  }, [currentQuestionIndex]);

  const resetQuestions = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserResponses([]);
  }, []);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,
    userResponses,
    goToNextQuestion,
    goToPreviousQuestion,
    saveResponse,
    resetQuestions,
    allQuestions: interviewQuestions,
  };
}