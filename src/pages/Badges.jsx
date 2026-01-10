import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Star, Target, Zap, Award, Flame, Brain, Medal, Rocket, ShieldCheck } from 'lucide-react';

const ALL_BADGES = [
  { id: 'first_step', name: 'First Step', desc: 'Birinchi darajani yutdingiz', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'level_10', name: 'Rising Star', desc: '10-darajaga yetdingiz', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'math_master', name: 'Math Master', desc: '100 ta misol yechildi', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'streak_10', name: 'On Fire', desc: 'Ketma-ket 10 ta to\'g\'ri javob', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'perfecto', name: 'Perfecto', desc: '100% natija qayd etildi', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-100' },
];

export default function Badges() {
  const navigate = useNavigate();
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  useEffect(() => {
    // Progressni xotiradan o'qish
    const progress = JSON.parse(localStorage.getItem('PlayerProgress')) || {};
    setUnlockedBadges(progress.badges || []);
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <Button variant="ghost" onClick={() => navigate('/')} className="rounded-xl">
            <ArrowLeft className="mr-2 h-5 w-5" /> Orqaga
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-800">Sening Nishonlaring</h1>
            <p className="text-sm text-slate-500">To'plangan: {unlockedBadges.length} / {ALL_BADGES.length}</p>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            const Icon = badge.icon;

            return (
              <motion.div
                key={badge.id}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center text-center transition-all ${
                  isUnlocked 
                    ? 'bg-white border-slate-100 shadow-lg shadow-purple-50' 
                    : 'bg-slate-50 border-transparent opacity-40 grayscale'
                }`}
              >
                <div className={`p-4 rounded-2xl mb-4 ${isUnlocked ? badge.bg : 'bg-slate-200'}`}>
                  <Icon className={`w-8 h-8 ${isUnlocked ? badge.color : 'text-slate-400'}`} />
                </div>
                <h3 className="font-bold text-sm text-slate-800">{badge.name}</h3>
                <p className="text-[10px] text-slate-500 mt-1">{badge.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}