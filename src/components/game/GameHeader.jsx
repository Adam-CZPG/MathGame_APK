import React from 'react';
import { Star, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameHeader({ stars, xp, streak, level }) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg"
    >
      <div className="flex items-center gap-6">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Stars</p>
            <p className="text-lg font-bold text-gray-800">{stars}</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">XP</p>
            <p className="text-lg font-bold text-gray-800">{xp}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        {streak > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          >
            <span className="text-white text-sm font-bold">🔥 {streak}</span>
          </motion.div>
        )}
        
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Level</p>
            <p className="text-lg font-bold text-gray-800">{level}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}