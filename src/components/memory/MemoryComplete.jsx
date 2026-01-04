import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home, ArrowRight } from 'lucide-react';

export default function MemoryComplete({ 
  moves, 
  time, 
  bestMoves,
  bestTime,
  onPlayAgain, 
  onHome,
  onNextLevel
}) {
  const isNewRecord = moves < bestMoves || time < bestTime;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

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
            🎉
          </motion.div>

          <h2 className="text-3xl font-black text-gray-800 mb-2">
            You Win!
          </h2>
          
          {isNewRecord && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 font-bold mb-4"
            >
              🏆 New Record!
            </motion.p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-100 rounded-2xl p-4">
              <p className="text-sm text-purple-600 font-medium">Moves</p>
              <p className="text-3xl font-black text-purple-700">{moves}</p>
              {bestMoves < 999 && (
                <p className="text-xs text-purple-500">Best: {bestMoves}</p>
              )}
            </div>
            <div className="bg-blue-100 rounded-2xl p-4">
              <p className="text-sm text-blue-600 font-medium">Time</p>
              <p className="text-3xl font-black text-blue-700">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
              {bestTime < 999 && (
                <p className="text-xs text-blue-500">
                  Best: {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {onNextLevel && (
              <Button
                onClick={onNextLevel}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl"
              >
                Next Level <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            
            <Button
              onClick={onPlayAgain}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-2xl"
            >
              <RotateCcw className="mr-2 w-5 h-5" /> Play Again
            </Button>
            
            <Button
              onClick={onHome}
              variant="ghost"
              className="w-full h-12 text-gray-600"
            >
              <Home className="mr-2 w-5 h-5" /> Back to Menu
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}