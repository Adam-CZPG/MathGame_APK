import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Flame, Zap, Trophy, Brain, 
  Target, Rocket, ShieldCheck, Medal, Award 
} from 'lucide-react';

// Full list of 10 badges with English descriptions
const ALL_BADGES = [
  { id: 'first_step', name: 'First Step', desc: 'Completed level 1', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'on_fire', name: 'On Fire', desc: '5 correct answers in a row', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'quick_thinker', name: 'Quick Thinker', desc: 'Answered very quickly', icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  { id: 'level_up', name: 'Level Up', desc: 'Reached level 10', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'math_master', name: 'Math Master', desc: 'Solved 100 problems', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'perfecto', name: 'Perfecto', desc: '100% score achieved', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 'steady', name: 'Steady', desc: 'Played 5 days in a row', icon: Target, color: 'text-rose-500', bg: 'bg-rose-100' },
  { id: 'champion', name: 'Champion', desc: 'Collected 500 stars', icon: Medal, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { id: 'conqueror', name: 'Conqueror', desc: 'Completed level 50', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'legend', name: 'Legend', desc: 'All badges collected', icon: Award, color: 'text-red-500', bg: 'bg-red-100' },
];

export default function BadgeDisplay({ earnedBadges = [] }) {
  // Ensure earnedBadges is always an array
  const badgesArray = Array.isArray(earnedBadges) ? earnedBadges : [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-2">
      {ALL_BADGES.map((badge, index) => {
        const isUnlocked = badgesArray.includes(badge.id);
        const Icon = badge.icon;

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all duration-500 ${
              isUnlocked 
                ? 'bg-white border-white shadow-lg shadow-indigo-100' 
                : 'bg-gray-200/40 border-transparent opacity-40 grayscale'
            }`}
          >
            {/* Icon Container */}
            <div className={`p-3 rounded-2xl mb-3 ${isUnlocked ? badge.bg : 'bg-gray-300'}`}>
              <Icon className={`w-8 h-8 ${isUnlocked ? badge.color : 'text-gray-500'}`} />
            </div>

            {/* Badge Name */}
            <h3 className={`font-bold text-[11px] uppercase tracking-tight ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
              {badge.name}
            </h3>

            {/* Badge Description */}
            <p className="text-[9px] text-gray-400 leading-tight mt-1 font-medium">
              {badge.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}