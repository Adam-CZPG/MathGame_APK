import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Star, Zap, Trophy, Target, Flame, Crown, 
  Rocket, Medal, Award, Sparkles 
} from 'lucide-react';

const badges = {
  first_problem: { icon: Star, name: 'First Steps', description: 'Solved your first problem!', color: 'from-yellow-400 to-orange-500' },
  streak_5: { icon: Flame, name: 'On Fire', description: '5 correct answers in a row!', color: 'from-orange-500 to-red-500' },
  streak_10: { icon: Zap, name: 'Unstoppable', description: '10 correct answers in a row!', color: 'from-purple-500 to-indigo-600' },
  level_5: { icon: Medal, name: 'Halfway There', description: 'Reached level 5!', color: 'from-blue-400 to-cyan-500' },
  level_10: { icon: Crown, name: 'Math Master', description: 'Completed all levels!', color: 'from-amber-400 to-yellow-500' },
  accuracy_90: { icon: Target, name: 'Sharpshooter', description: '90% accuracy achieved!', color: 'from-green-400 to-emerald-500' },
  problems_50: { icon: Rocket, name: 'Problem Solver', description: 'Solved 50 problems!', color: 'from-pink-400 to-rose-500' },
  problems_100: { icon: Trophy, name: 'Century', description: 'Solved 100 problems!', color: 'from-indigo-400 to-purple-500' },
  speed_demon: { icon: Sparkles, name: 'Speed Demon', description: 'Answered in under 3 seconds!', color: 'from-teal-400 to-cyan-500' },
  perfect_level: { icon: Award, name: 'Perfect Score', description: 'Completed a level with 100%!', color: 'from-fuchsia-400 to-pink-500' },
};

export default function NewBadgeModal({ badgeId, onClose }) {
  const badge = badges[badgeId];
  if (!badge) return null;
  
  const Icon = badge.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-bold text-gray-500 mb-2"
          >
            🎊 New Badge Unlocked! 🎊
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-2xl mb-4`}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl font-black text-gray-800 mb-2"
          >
            {badge.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-600 mb-6"
          >
            {badge.description}
          </motion.p>

          <Button
            onClick={onClose}
            className={`w-full h-12 text-lg font-bold bg-gradient-to-r ${badge.color} hover:opacity-90 rounded-2xl`}
          >
            Awesome! 🎉
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}