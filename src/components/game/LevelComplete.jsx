import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, RotateCcw, Home } from 'lucide-react';

export default function LevelComplete({ 
  level, 
  score, 
  totalQuestions, 
  starsEarned, 
  xpEarned,
  onNextLevel, 
  onRetry, 
  onHome,
  isLastLevel 
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </motion.div>

          <h2 className="text-3xl font-black text-gray-800 mb-2">
            Level {level} Complete!
          </h2>
          
          <p className="text-gray-600 mb-6">
            You got {score} out of {totalQuestions} correct ({percentage}%)
          </p>

          {/* Stars Display */}
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3].map((star, index) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ 
                  opacity: 1, 
                  scale: starsEarned >= star ? 1 : 0.6, 
                  rotate: 0 
                }}
                transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
              >
                <Star 
                  className={`w-12 h-12 ${
                    starsEarned >= star 
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' 
                      : 'text-gray-300'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* XP Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-8"
          >
            <span className="text-purple-600 font-bold">+{xpEarned} XP</span>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {percentage >= 70 && !isLastLevel && (
              <Button
                onClick={onNextLevel}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl"
              >
                Next Level <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full h-14 text-lg font-bold rounded-2xl border-2"
            >
              <RotateCcw className="mr-2 w-5 h-5" /> Try Again
            </Button>
            
            <Button
              onClick={onHome}
              variant="ghost"
              className="w-full h-12 text-gray-600"
            >
              <Home className="mr-2 w-5 h-5" /> Back to Levels
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}