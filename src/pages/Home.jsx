import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Trophy, Award, Sparkles, Lock } from 'lucide-react';

import GameHeader from '@/components/game/GameHeader';
import LevelCard from '@/components/game/LevelCard';
import BadgeDisplay from '@/components/game/BadgeDisplay';
import ProgressStats from '@/components/game/ProgressStats';

const WORLDS = [
  { id: 1, name: "Novice", subtitle: "Addition & Subtraction", range: [1, 20], color: "from-green-400 to-emerald-500", icon: "🌱" },
  { id: 2, name: "Apprentice", subtitle: "Multiplication", range: [21, 40], color: "from-blue-400 to-indigo-500", icon: "⚔️" },
  { id: 3, name: "Master", subtitle: "Mixed Challenges", range: [41, 60], color: "from-orange-400 to-rose-500", icon: "👑" },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeWorld, setActiveWorld] = useState(1);
  
  const [progress, setProgress] = useState({
    total_problems_solved: 0,
    current_level: 1,
    current_streak: 0,
    best_streak: 0,
    total_stars: 0,
    badges: [],
    accuracy_percentage: 0,
    total_attempts: 0,
    xp_points: 0,
    completed_levels: [],
    level_stars: {} // Initial statega qo'shildi
  });

  const loadProgress = () => {
    const savedProgress = localStorage.getItem('PlayerProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed);
      const worldOfPlayer = WORLDS.find(w => (parsed.current_level || 1) >= w.range[0] && (parsed.current_level || 1) <= w.range[1]);
      if (worldOfPlayer) setActiveWorld(worldOfPlayer.id);
    }
  };

  useEffect(() => {
    loadProgress();
    window.addEventListener('focus', loadProgress);
    return () => window.removeEventListener('focus', loadProgress);
  }, []);

  const isLevelUnlocked = (level) => {
    if (level === 1) return true;
    return (progress?.completed_levels || []).includes(level - 1) || level <= (progress?.current_level || 1);
  };

  const isLevelCompleted = (level) => (progress?.completed_levels || []).includes(level);
  
  // TUZATILGAN JOY: Endi yulduzlar haqiqiy natijadan olinadi
  const getLevelStars = (level) => progress?.level_stars?.[level] || 0;

  const currentWorld = WORLDS.find(w => w.id === activeWorld);
  const levelsInWorld = Array.from(
    { length: currentWorld.range[1] - currentWorld.range[0] + 1 },
    (_, i) => currentWorld.range[0] + i
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mt-10 mb-4"> 
          <GameHeader 
            stars={progress?.total_stars || 0}
            xp={progress?.xp_points || 0}
            streak={progress?.current_streak || 0}
            level={progress?.current_level || 1}
          />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">Math Champions</h1>
          <p className="text-white/60 text-lg">Choose your challenge and dominate!</p>
        </motion.div>

        <Tabs defaultValue="levels" className="mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/10">
            <TabsTrigger value="levels" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white transition-all font-bold"><Play className="w-4 h-4 mr-2" /> Play</TabsTrigger>
            <TabsTrigger value="progress" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white transition-all font-bold"><Trophy className="w-4 h-4 mr-2" /> Stats</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white transition-all font-bold"><Award className="w-4 h-4 mr-2" /> Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="mt-6 outline-none">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {WORLDS.map((world) => {
                const isLocked = (progress?.current_level || 1) < world.range[0];
                return (
                  <button
                    key={world.id}
                    disabled={isLocked}
                    onClick={() => setActiveWorld(world.id)}
                    className={`relative overflow-hidden group px-6 py-4 rounded-2xl transition-all duration-300 border-2 ${
                      activeWorld === world.id 
                        ? `bg-gradient-to-r ${world.color} border-white shadow-xl scale-105` 
                        : isLocked ? 'bg-slate-800/50 border-transparent opacity-50' : 'bg-slate-800 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{world.icon}</span>
                      <div className="text-left">
                        <p className={`text-xs font-bold uppercase tracking-wider ${activeWorld === world.id ? 'text-white/80' : 'text-slate-500'}`}>World {world.id}</p>
                        <p className={`font-black ${activeWorld === world.id ? 'text-white' : 'text-slate-300'}`}>{world.name}</p>
                      </div>
                      {isLocked && <Lock className="w-4 h-4 text-slate-500 ml-2" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeWorld} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {levelsInWorld.map((level) => (
                  <div
                    key={level}
                    onClick={() => isLevelUnlocked(level) && navigate(`/game/${level}`)}
                    className={isLevelUnlocked(level) ? "cursor-pointer transform hover:scale-105 transition-transform" : "cursor-not-allowed opacity-75"}
                  >
                    <LevelCard
                      level={level}
                      isUnlocked={isLevelUnlocked(level)}
                      isCompleted={isLevelCompleted(level)}
                      starsEarned={getLevelStars(level)}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Button onClick={() => navigate(`/game/${progress?.current_level || 1}`)} className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 rounded-2xl shadow-2xl shadow-emerald-500/20">
                <Sparkles className="w-6 h-6 mr-3" /> Quick Play: Level {progress?.current_level || 1}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressStats progress={progress} />
          </TabsContent>

          <TabsContent value="badges" className="mt-6 text-center">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <BadgeDisplay earnedBadges={progress?.badges || []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}