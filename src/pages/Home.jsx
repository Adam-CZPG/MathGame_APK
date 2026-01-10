import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Trophy, Award, Sparkles } from 'lucide-react';
import GameHeader from '@/components/game/GameHeader';
import LevelCard from '@/components/game/LevelCard';
import BadgeDisplay from '@/components/game/BadgeDisplay';
import ProgressStats from '@/components/game/ProgressStats';

export default function Home() {
  const navigate = useNavigate();
  
  // Ma'lumotlarni localStorage'dan yuklash
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('PlayerProgress');
    return savedProgress ? JSON.parse(savedProgress) : {
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
    };
  });

  // --- O'ZGARTIRISH SHU YERDA: Dinamik darajalar yaratish ---
  // Foydalanuvchi yetib kelgan darajadan keyin yana 4 ta qulflangan darajani ko'rsatib turadi
  // Kamida 10 ta darajani har doim ko'rsatadi
  const currentMaxLevel = Math.max(15, (progress?.current_level || 1) + 4);
  const levels = Array.from({ length: currentMaxLevel }, (_, i) => i + 1);
  
  const isLevelUnlocked = (level) => {
    if (level === 1) return true;
    // Daraja ochilishi uchun undan oldingisi bajarilgan bo'lishi kerak
    return (progress?.completed_levels || []).includes(level - 1) || level <= (progress?.current_level || 1);
  };

  const isLevelCompleted = (level) => {
    return (progress?.completed_levels || []).includes(level);
  };

  const getLevelStars = (level) => {
    return isLevelCompleted(level) ? 3 : 0;
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mt-10 mb-4"> 
          <GameHeader 
            stars={progress?.total_stars || 0}
            xp={progress?.xp_points || 0}
            streak={progress?.current_streak || 0}
            level={progress?.current_level || 1}
          />
        </div>

        {/* Hero Section */}
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

        {/* Main Content */}
        <Tabs defaultValue="levels" className="mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/20 backdrop-blur-sm rounded-2xl p-1">
            <TabsTrigger 
              value="levels" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-800 text-white font-bold"
            >
              <Play className="w-4 h-4 mr-2" /> Play
            </TabsTrigger>
            <TabsTrigger 
              value="progress"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-800 text-white font-bold"
            >
              <Trophy className="w-4 h-4 mr-2" /> Stats
            </TabsTrigger>
            <TabsTrigger 
              value="badges"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-gray-800 text-white font-bold"
            >
              <Award className="w-4 h-4 mr-2" /> Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="mt-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {levels.map((level, index) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.05, 1) }} // Ko'p levellarda delay juda cho'zilib ketmasligi uchun
                  onClick={() => isLevelUnlocked(level) && navigate(`/game/${level}`)}
                  className={isLevelUnlocked(level) ? "cursor-pointer" : "cursor-not-allowed"}
                >
                    <LevelCard
                      level={level}
                      isUnlocked={isLevelUnlocked(level)}
                      isCompleted={isLevelCompleted(level)}
                      starsEarned={getLevelStars(level)}
                      onClick={() => {}}
                    />
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Play Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <Button 
                onClick={() => navigate(`/game/${progress?.current_level || 1}`)}
                className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-2xl shadow-xl shadow-green-500/30"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Continue Level {progress?.current_level || 1}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressStats progress={progress} />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white/90 backdrop-blur-sm rounded-3xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Journey</h3>
              <div className="relative">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    // Progressni joriy darajaga moslab dinamik foizda ko'rsatamiz
                    animate={{ width: `${Math.min(((progress?.current_level || 1) / currentMaxLevel) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Level 1</span>
                  <span className="font-bold text-purple-600">Level {progress?.current_level || 1}</span>
                  <span>Goal: {currentMaxLevel}</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Your Badges ({(progress?.badges || []).length} / 10)
              </h3>
              <BadgeDisplay 
                earnedBadges={progress?.badges || []} 
                showAll={true}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}