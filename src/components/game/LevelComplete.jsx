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
  onHome
}) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Faqat 3 ta yulduz bo'lsa - Mastered (To'liq g'alaba)
  const isPerfect = starsEarned === 3;
  // 1 yoki 2 ta yulduz bo'lsa - Shunchaki urinish (Lekin level ochilmaydi)
  const isAttempt = starsEarned > 0 && starsEarned < 3;

  const getFeedbackEmoji = () => {
    if (isPerfect) return '🎉'; // 100% yoki 90%
    if (isAttempt) return '🧐'; // 50% - 80% (Yaxshi, lekin yetarli emas)
    return '🧠'; // 0% - 40% (Mashq qilish kerak)
  };

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
            className="text-6xl mb-4 flex justify-center"
          >
            {getFeedbackEmoji()}
          </motion.div>

          {/* Sarlavha mantiqi */}
          <h2 className={`text-3xl font-black mb-2 ${isPerfect ? 'text-green-600' : 'text-rose-500'}`}>
            {isPerfect ? `Level ${level} Mastered!` : `Level ${level} Failed!`}
          </h2>
          
          <p className="text-gray-600 mb-6 font-medium px-4">
            {isPerfect 
              ? `Perfect! You are a math genius!` 
              : isAttempt 
                ? `Good effort, but you need 3 stars to unlock the next level.`
                : `Keep practicing! You can do better.`
            }
            <span className="block text-sm text-gray-400 mt-2 font-bold">
              Final Score: {percentage}% ({score}/{totalQuestions})
            </span>
          </p>

          {/* Yulduzlar animatsiyasi */}
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3].map((star, index) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: starsEarned >= star ? 1.2 : 0.8,
                }}
                transition={{ delay: 0.5 + index * 0.15, type: "spring" }}
              >
                <Star 
                  className={`w-12 h-12 ${
                    starsEarned >= star 
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-md' 
                      : 'text-gray-200'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {/* Faqat 3 yulduz bo'lgandagina Next Level chiqadi */}
            {onNextLevel && isPerfect && (
              <Button
                onClick={onNextLevel}
                className="w-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 rounded-2xl text-white shadow-lg border-0"
              >
                Next Level <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            
            <Button
              onClick={onRetry}
              variant={isPerfect ? "outline" : "default"}
              className={`w-full h-14 text-lg font-bold rounded-2xl ${
                !isPerfect 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" 
                : "border-2 border-gray-200 text-gray-800"
              }`}
            >
              <RotateCcw className="mr-2 w-5 h-5" /> Try Again
            </Button>
            
            <Button
              onClick={onHome}
              variant="ghost"
              className="w-full h-12 text-gray-400 hover:text-gray-600"
            >
              <Home className="mr-2 w-5 h-5" /> Back to Levels
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}