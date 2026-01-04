import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Flame, Star, Trophy } from 'lucide-react';

export default function ProgressStats({ progress }) {
  const stats = [
    { 
      icon: Star, 
      label: 'Total Stars', 
      value: progress?.total_stars || 0,
      color: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-orange-200'
    },
    { 
      icon: Zap, 
      label: 'XP Points', 
      value: progress?.xp_points || 0,
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-200'
    },
    { 
      icon: Target, 
      label: 'Accuracy', 
      value: `${Math.round(progress?.accuracy_percentage || 0)}%`,
      color: 'from-green-400 to-emerald-500',
      shadow: 'shadow-green-200'
    },
    { 
      icon: Flame, 
      label: 'Best Streak', 
      value: progress?.best_streak || 0,
      color: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-200'
    },
    { 
      icon: Trophy, 
      label: 'Problems Solved', 
      value: progress?.total_problems_solved || 0,
      color: 'from-blue-400 to-cyan-500',
      shadow: 'shadow-blue-200'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 shadow-lg ${stat.shadow}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/80 font-medium">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}