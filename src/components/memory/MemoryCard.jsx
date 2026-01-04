import React from 'react';
import { motion } from 'framer-motion';

export default function MemoryCard({ emoji, isFlipped, isMatched, onClick, disabled }) {
  return (
    <motion.button
      whileHover={!disabled && !isFlipped ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isFlipped ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || isFlipped || isMatched}
      className="relative w-full aspect-square"
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back of card */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl">❓</span>
        </div>
        
        {/* Front of card */}
        <div 
          className={`absolute inset-0 rounded-2xl shadow-lg flex items-center justify-center ${
            isMatched ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-white'
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <motion.span 
            className="text-5xl"
            animate={isMatched ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {emoji}
          </motion.span>
        </div>
      </motion.div>
    </motion.button>
  );
}