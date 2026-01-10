import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils';

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

// --- DINAMIK NOMI ANIQLASH FUNKSIYASI ---
const getOperationName = (level) => {
  if (level <= 3) return 'Addition (+)';
  if (level <= 8) return 'Subtraction (−)';
  if (level <= 12) return 'Multiplication (×)';
  if (level <= 15) return 'Division (÷)';
  if (level <= 25) return 'Mixed Operations';
  if (level <= 50) return 'Expert Challenge';
  return 'Master Mode';
};

export default function LevelCard({ level, isUnlocked, isCompleted, starsEarned, onClick }) {
  // Mavzularni aylana bo'yicha olish (11-level yana birinchi rangdan boshlanadi)
  const theme = levelThemes[(level - 1) % levelThemes.length];
  const operationName = getOperationName(level);
  
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
      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Lock className="w-8 h-8 text-white/60" />
          <span className="text-2xl font-black text-white/60">{level}</span>
        </div>
      ) : (
        <>
          {isCompleted && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </motion.div>
          )}

          <span className="text-4xl font-black text-white drop-shadow-lg">{level}</span>
          
          {/* ENDI BU MATN DINAMIK: */}
          <span className="text-[10px] font-medium text-white/90 mt-1 text-center leading-tight uppercase tracking-wider">
            {operationName}
          </span>
          
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