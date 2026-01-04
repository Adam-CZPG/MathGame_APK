import React from 'react';
import { motion } from 'framer-motion';
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

export default function BadgeDisplay({ earnedBadges, showAll = false }) {
  const displayBadges = showAll 
    ? Object.keys(badges) 
    : earnedBadges;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {displayBadges.map((badgeId, index) => {
        const badge = badges[badgeId];
        if (!badge) return null;
        
        const isEarned = earnedBadges.includes(badgeId);
        const Icon = badge.icon;
        
        return (
          <motion.div
            key={badgeId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col items-center p-4 rounded-2xl ${
              isEarned 
                ? `bg-gradient-to-br ${badge.color} shadow-lg` 
                : 'bg-gray-200'
            }`}
          >
            {!isEarned && (
              <div className="absolute inset-0 bg-gray-400/60 rounded-2xl backdrop-blur-sm" />
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
              isEarned ? 'bg-white/30' : 'bg-gray-300'
            }`}>
              <Icon className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <span className={`text-xs font-bold text-center ${
              isEarned ? 'text-white' : 'text-gray-400'
            }`}>
              {badge.name}
            </span>
            <span className={`text-[10px] text-center mt-1 ${
              isEarned ? 'text-white/80' : 'text-gray-400'
            }`}>
              {badge.description}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}