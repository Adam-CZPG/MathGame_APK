import React, { useState, useEffect } from 'react';

// Siz yuborgan sxema asosida boshlang'ich qiymatlar
const INITIAL_PLAYER_PROGRESS = {
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

const usePlayerStats = () => {
  // 1. Ma'lumotlarni LocalStorage'dan o'qish
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('PlayerProgress');
    return saved ? JSON.parse(saved) : INITIAL_PLAYER_PROGRESS;
  });

  // 2. Ma'lumotlarni saqlash funksiyasi
  const updateStats = (isCorrect, earnedXP, earnedStars) => {
    const newStats = { ...stats };
    
    // Urinishlar va yechilgan masalalar
    newStats.total_attempts += 1;
    if (isCorrect) {
      newStats.total_problems_solved += 1;
      newStats.current_streak += 1;
      newStats.xp_points += earnedXP;
      newStats.total_stars += earnedStars;
      
      // Eng yaxshi streakni tekshirish
      if (newStats.current_streak > newStats.best_streak) {
        newStats.best_streak = newStats.current_streak;
      }
    } else {
      newStats.current_streak = 0; // Xato bo'lsa streak uziladi
    }

    // Aniqlik foizini hisoblash
    newStats.accuracy_percentage = Math.round(
      (newStats.total_problems_solved / newStats.total_attempts) * 100
    );

    // Darajani oshirish mantiqi (misol: har 500 XP da yangi daraja)
    const nextLevel = Math.floor(newStats.xp_points / 500) + 1;
    if (nextLevel > newStats.current_level && nextLevel <= 10) {
      newStats.current_level = nextLevel;
    }

    setStats(newStats);
    localStorage.setItem('PlayerProgress', JSON.stringify(newStats));
  };

  return { stats, updateStats };
};