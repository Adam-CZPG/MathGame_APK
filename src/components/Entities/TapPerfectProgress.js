import React, { useState, useEffect } from 'react';
import { Trophy, MousePointer2, Target, Play, RotateCcw } from 'lucide-react';

// Siz yuborgan sxema asosida boshlang'ich qiymatlar
const INITIAL_TAP_STATS = {
  high_score: 0,
  total_games: 0,
  perfect_taps: 0,
  total_taps: 0
};

const TapPerfect = () => {
  // 1. LOCAL STORAGE BILAN ISHLASH
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('TapPerfectProgress');
    return saved ? JSON.parse(saved) : INITIAL_TAP_STATS;
  });

  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 soniyalik o'yin

  // 2. TAYMER VA O'YIN TUGASHI
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      finishGame();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  // 3. O'YINNI BOSHLASH
  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameActive(true);
  };

  // 4. NATIJANI LOCALSTORAGE'GA SAQLASH
  const finishGame = () => {
    setGameActive(false);
    
    // Yangi statistika hisoblash
    const newStats = {
      ...stats,
      total_games: stats.total_games + 1,
      total_taps: stats.total_taps + score,
      // Misol uchun: 10 tadan ko'p bosilsa 1 ta perfect tap qo'shilsin (mantiq o'zgartirilishi mumkin)
      perfect_taps: stats.perfect_taps + (score > 20 ? 1 : 0),
      high_score: Math.max(stats.high_score, score)
    };

    setStats(newStats);
    localStorage.setItem('TapPerfectProgress', JSON.stringify(newStats));
  };

  const handleTap = () => {
    if (gameActive) {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-rose-50 rounded-3xl shadow-xl">
      {/* STATISTIKA PANEL (SXEMA ASOSIDA) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-3 rounded-2xl border border-rose-100 flex flex-col items-center">
          <Trophy className="text-amber-500 mb-1" size={20} />
          <span className="text-[10px] text-gray-400 uppercase font-bold">Best Score</span>
          <span className="text-xl font-black text-gray-800">{stats.high_score}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-rose-100 flex flex-col items-center">
          <Target className="text-rose-500 mb-1" size={20} />
          <span className="text-[10px] text-gray-400 uppercase font-bold">Perfect Taps</span>
          <span className="text-xl font-black text-gray-800">{stats.perfect_taps}</span>
        </div>
      </div>

      {/* O'YIN JONLI KO'RSATKICHLARI */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium italic">Time Left</span>
          <span className={`text-2xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 font-medium italic">Current Score</span>
          <div className="text-4xl font-black text-rose-600">{score}</div>
        </div>
      </div>

      {/* TAP MAYDONI */}
      <div 
        onClick={handleTap}
        className={`aspect-square rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-75 active:scale-90 shadow-2xl border-8 ${
          gameActive 
          ? 'bg-rose-500 border-rose-400 hover:bg-rose-400' 
          : 'bg-gray-200 border-gray-300'
        }`}
      >
        {!gameActive ? (
          <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="flex flex-col items-center gap-2">
            <Play size={40} className="text-gray-400 fill-gray-400" />
            <span className="font-black text-gray-400 tracking-widest">START</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 text-white">
            <MousePointer2 size={50} />
            <span className="font-black text-2xl tracking-widest">TAP!</span>
          </div>
        )}
      </div>

      {/* JAMI O'YINLAR (QISMAN SXEMA) */}
      <div className="mt-8 text-center">
        <span className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase">
          Total Games Played: {stats.total_games}
        </span>
      </div>
    </div>
  );
};

export default TapPerfect;