import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function MathProblem({ 
  problem, 
  options, 
  onAnswer, 
  questionNumber, 
  totalQuestions,
  timeLimit 
}) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setTimeLeft(timeLimit);
  }, [problem, timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelected(answer);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(answer);
    }, 1200);
  };

  const isCorrect = selected === problem.answer;
  const timerPercentage = (timeLeft / timeLimit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white/80">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white/80'}`}>
            ⏱ {timeLeft}s
          </span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-400' : 'bg-white'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${timerPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Problem Display */}
      <motion.div 
        className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
        layoutId="problem-card"
      >
        <div className="text-center">
          <motion.div 
            key={problem.display}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-black text-gray-800 tracking-wider"
          >
            {problem.display}
          </motion.div>
          
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="mt-4"
              >
                {isCorrect ? (
                  <div className="flex items-center justify-center gap-2 text-green-500">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="text-2xl font-bold">Correct!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-red-500">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-8 h-8" />
                      <span className="text-2xl font-bold">
                        {selected === null ? "Time's up!" : "Try again!"}
                      </span>
                    </div>
                    <span className="text-lg text-gray-600">
                      Answer: {problem.answer}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <motion.div
            key={`${problem.display}-${option}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className={`w-full h-16 text-2xl font-bold rounded-2xl transition-all ${
                showResult
                  ? option === problem.answer
                    ? 'bg-green-500 hover:bg-green-500 text-white'
                    : option === selected
                      ? 'bg-red-500 hover:bg-red-500 text-white'
                      : 'bg-white/50 text-gray-400'
                  : 'bg-white hover:bg-white/90 text-gray-800 hover:scale-105 shadow-lg'
              }`}
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}