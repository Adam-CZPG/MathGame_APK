import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Trophy, Award, Sparkles } from 'lucide-react';

// Komponentlar importi
import GameHeader from '@/components/game/GameHeader';
import LevelCard from '@/components/game/LevelCard';
import BadgeDisplay from '@/components/game/BadgeDisplay';
import ProgressStats from '@/components/game/ProgressStats';

export default function Home() {
  const navigate = useNavigate();
  
  // Progress holati
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
    completed_levels: []
  });

  // Ma'lumotlarni yuklash funksiyasi
  const loadProgress = () => {
    const savedProgress = localStorage.getItem('PlayerProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  };

  // Sahifa yuklanganda va har safar ushbu sahifaga qaytganda (focus) ma'lumotni yangilash
  useEffect(() => {
    loadProgress();
    
    // Foydalanuvchi o'yinni tugatib qaytsa, ma'lumotlar yangilanishi uchun window focus ni ham eshitamiz
    window.addEventListener('focus', loadProgress);
    return () => window.removeEventListener('focus', loadProgress);
  }, []);

  // Dinamik darajalar hisobi
  const currentMaxLevel = Math.max(15, (progress?.current_level || 1) + 4);
  const levels = Array.from({ length: currentMaxLevel }, (_, i) => i + 1);
  
  const isLevelUnlocked = (level) => {
    if (level === 1) return true;
    return (progress?.completed_levels || []).includes(level - 1) || level <= (progress?.current_level || 1);
  };

  const isLevelCompleted = (level) => (progress?.completed_levels || []).includes(level);
  const getLevelStars = (level) => isLevelCompleted(level) ? 3 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Statlar Paneli (Header) */}
        <div className="mt-10 mb-4"> 
          <GameHeader 
            stars={progress?.total_stars || 0}
            xp={progress?.xp_points || 0}
            streak={progress?.current_streak || 0}
            level={progress?.current_level || 1}
          />
        </div>

        {/* Markaziy Hero Qismi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🧮
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
            Math Champions
          </h1>
          <p className="text-white/80 text-lg max-w-md mx-auto">
            Master math through fun challenges! Earn stars, unlock badges, and become a Math Master!
          </p>
        </motion.div>

        {/* Bo'limlar (Tabs) */}
        <Tabs defaultValue="levels" className="mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/20 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger value="levels" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-800 text-white font-bold">
              <Play className="w-4 h-4 mr-2" /> Play
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-800 text-white font-bold">
              <Trophy className="w-4 h-4 mr-2" /> Stats
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-800 text-white font-bold">
              <Award className="w-4 h-4 mr-2" /> Badges
            </TabsTrigger>
          </TabsList>

          {/* Darajalar ro'yxati */}
          <TabsContent value="levels" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {levels.map((level, index) => (
                <div
                  key={level}
                  onClick={() => isLevelUnlocked(level) && navigate(`/game/${level}`)}
                  className={isLevelUnlocked(level) ? "cursor-pointer" : "cursor-not-allowed"}
                >
                    <LevelCard
                      level={level}
                      isUnlocked={isLevelUnlocked(level)}
                      isCompleted={isLevelCompleted(level)}
                      starsEarned={getLevelStars(level)}
                    />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button 
                onClick={() => navigate(`/game/${progress?.current_level || 1}`)}
                className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-2xl shadow-xl shadow-green-500/30"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Continue Level {progress?.current_level || 1}
              </Button>
            </div>
          </TabsContent>

          {/* Statistika */}
          <TabsContent value="progress" className="mt-6">
            <ProgressStats progress={progress} />
          </TabsContent>

          {/* Nishonlar Bo'limi - SHU YERDA BadgeDisplay CHAQIRILADI */}
          <TabsContent value="badges" className="mt-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Your Achievements</h3>
                <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-bold">
                  {(progress?.badges || []).length} / 10 Unlocked
                </span>
              </div>
              
              <BadgeDisplay earnedBadges={progress?.badges || []} />
            </motion.div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}