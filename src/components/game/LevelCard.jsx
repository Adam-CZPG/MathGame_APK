import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils'; // Loyihangizdagi utils joylashuviga qarang

const levelThemes = [
  { from: 'from-pink-400', to: 'to-rose-500', shadow: 'shadow-pink-200' },
  { from: 'from-orange-400', to: 'to-amber-500', shadow: 'shadow-orange-200' },
  { from: 'from-yellow-400', to: 'to-lime-500', shadow: 'shadow-yellow-200' },
  { from: 'from-green-400', to: 'to-emerald-500', shadow: 'shadow-green-200' },
  { from: 'from-teal-400', to: 'to-cyan-500', shadow: 'shadow-teal-200' },
  { from: 'from-blue-400', to: 'to-indigo-500', shadow: 'shadow-blue-200' },
  { from: 'from-indigo-400', to: 'to-purple-500', shadow: 'shadow-indigo-200' },
  { from: 'from-purple-400', to: 'to-fuchsia-500', shadow: 'shadow-purple-200' },
  { from: 'from-fuchsia-400', to: 'to-pink-500', shadow: 'shadow-fuchsia-200' },
  { from: 'from-rose-400', to: 'to-red-500', shadow: 'shadow-rose-200' },
];

const levelOperations = [
  'Addition (+)', 'Subtraction (−)', 'Mixed +/−', 'Multiplication (×)',
  'Division (÷)', 'Mixed ×/÷', 'All Operations', 'Challenge Mode',
  'Speed Round', 'Master Level'
];

export default function LevelCard({ level, isUnlocked, isCompleted, starsEarned, onClick }) {
  const theme = levelThemes[(level - 1) % levelThemes.length];
  
  return (
    <motion.button
      whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
      onClick={() => isUnlocked && onClick(level)}
      disabled={!isUnlocked}
      className={cn(
        "relative w-full aspect-square rounded-3xl p-4 flex flex-col items-center justify-center transition-all",
        isUnlocked 
          ? `bg-gradient-to-br ${theme.from} ${theme.to} shadow-xl ${theme.shadow} cursor-pointer` 
          : "bg-gray-400/30 backdrop-blur-sm cursor-not-allowed border-2 border-white/10"
      )}
    >
      {/* Agar qulflangan bo'lsa: Qulf tepada, raqam uning ostida */}
      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Lock className="w-8 h-8 text-white/60" />
          <span className="text-2xl font-black text-white/60">{level}</span>
        </div>
      ) : (
        <>
          {/* Agar bajarilgan bo'lsa: Yashil belgi */}
          {isCompleted && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </motion.div>
          )}

          {/* Ochiq holatda: Katta raqam va matn */}
          <span className="text-4xl font-black text-white drop-shadow-lg">{level}</span>
          <span className="text-[10px] font-medium text-white/90 mt-1 text-center leading-tight uppercase tracking-wider">
            {levelOperations[level - 1]}
          </span>
          
          {/* Yulduzchalar paneli */}
          <div className="flex gap-1 mt-3">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={cn(
                  "w-4 h-4",
                  starsEarned >= star ? "text-yellow-300 fill-yellow-300" : "text-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </motion.button>
  );
}