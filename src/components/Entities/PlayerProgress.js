import React, { useState, useEffect } from 'react';

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
  completed_levels: [],
  // YANGI: Har bir level uchun yulduzlarni saqlash ob'ekti
  level_stars: {} 
};

const usePlayerStats = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('PlayerProgress');
    if (!saved) return INITIAL_PLAYER_PROGRESS;
    
    const parsed = JSON.parse(saved);
    // Eski keshda level_stars bo'lmasa, uni qo'shib ketamiz
    return { ...INITIAL_PLAYER_PROGRESS, ...parsed };
  });

  const checkBadges = (currentStats) => {
    const newBadges = [...(currentStats.badges || [])];
    const { best_streak, completed_levels, total_problems_solved } = currentStats;

    if (completed_levels.includes(1) && !newBadges.includes('first_step')) {
      newBadges.push('first_step');
    }
    if (best_streak >= 5 && !newBadges.includes('on_fire')) {
      newBadges.push('on_fire');
    }
    if (total_problems_solved >= 100 && !newBadges.includes('math_master')) {
      newBadges.push('math_master');
    }
    return newBadges;
  };

  const updateStats = (isCorrect, earnedXP, earnedStars, finishedLevel = null, isPerfect = false) => {
    const savedData = JSON.parse(localStorage.getItem('PlayerProgress')) || stats;
    const newStats = { ...savedData };
    
    // level_stars ob'ekti mavjudligini tekshiramiz (eski kesh uchun)
    if (!newStats.level_stars) newStats.level_stars = {};

    newStats.total_attempts += 1;
    if (isCorrect) {
      newStats.total_problems_solved += 1;
      newStats.current_streak += 1;
      newStats.xp_points += earnedXP;
      if (newStats.current_streak > newStats.best_streak) {
        newStats.best_streak = newStats.current_streak;
      }
    } else {
      newStats.current_streak = 0;
    }

    if (finishedLevel) {
      // Eng yaxshi yulduzni saqlash mantig'i
      const previousStars = newStats.level_stars[finishedLevel] || 0;
      
      if (earnedStars > previousStars) {
        // Faqat yaxshiroq natija bo'lsa, umumiy yulduzlarga farqni qo'shamiz
        newStats.total_stars += (earnedStars - previousStars);
        newStats.level_stars[finishedLevel] = earnedStars;
      }

      if (!newStats.completed_levels.includes(finishedLevel)) {
        newStats.completed_levels.push(finishedLevel);
      }
      newStats.current_level = Math.max(newStats.current_level, finishedLevel + 1);
      
      if (isPerfect && !newStats.badges.includes('perfecto')) {
        newStats.badges.push('perfecto');
      }
    }

    newStats.accuracy_percentage = Math.round((newStats.total_problems_solved / (newStats.total_attempts || 1)) * 100);
    newStats.badges = checkBadges(newStats);

    setStats(newStats);
    localStorage.setItem('PlayerProgress', JSON.stringify(newStats));
    return newStats;
  };

  return { stats, updateStats };
};

export default usePlayerStats;