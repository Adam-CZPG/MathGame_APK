import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Hash, Play, RefreshCw } from 'lucide-react';

// Siz yuborgan sxema asosida boshlang'ich qiymatlar
const INITIAL_STATS = {
  games_played: 0,
  best_time: 999,
  best_moves: 999,
  total_wins: 0,
  current_difficulty: "easy"
};

const MemoryGame = () => {
  // 1. LOCAL STORAGE BILAN ISHLASH (Base44 o'rniga)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('MemoryGameProgress');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Taymer mantiqi
  useEffect(() => {
    let interval = null;
    if (isActive && !isWon) {
      interval = setInterval(() => {
        setTimer((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon]);

  // O'yinni boshlash
  const initGame = () => {
    const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🍍', '🥝'];
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    
    setCards(deck);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setTimer(0);
    setIsActive(true);
    setIsWon(false);
  };

  // G'ALABA VA LOCALSTORAGE YANGILASH
  const handleWin = (finalTime, finalMoves) => {
    setIsWon(true);
    setIsActive(false);

    const newStats = {
      ...stats,
      games_played: stats.games_played + 1,
      total_wins: stats.total_wins + 1,
      // Faqat yaxshi natija bo'lsa yangilaymiz
      best_time: Math.min(stats.best_time, finalTime),
      best_moves: Math.min(stats.best_moves, finalMoves)
    };

    setStats(newStats);
    localStorage.setItem('MemoryGameProgress', JSON.stringify(newStats));
  };

  const handleCardClick = (id) => {
    if (!isActive || flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        const newSolved = [...solved, first, second];
        setSolved(newSolved);
        setFlipped([]);
        if (newSolved.length === cards.length) {
          handleWin(timer, moves + 1);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-3xl shadow-xl">
      {/* STATISTIKA PANEL (SXEMA ASOSIDA) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-500" size={18} />
            <span className="text-xs font-semibold text-gray-500">BEST TIME</span>
          </div>
          <span className="font-bold">{stats.best_time === 999 ? '--' : stats.best_time + 's'}</span>
        </div>
        <div className="p-3 bg-purple-50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="text-purple-500" size={18} />
            <span className="text-xs font-semibold text-gray-500">BEST MOVES</span>
          </div>
          <span className="font-bold">{stats.best_moves === 999 ? '--' : stats.best_moves}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold text-gray-700">Time: {timer}s | Moves: {moves}</div>
        <button onClick={initGame} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* O'YIN MAYDONI */}
      <div className="grid grid-cols-4 gap-3">
        {cards.length > 0 ? cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square flex items-center justify-center text-3xl cursor-pointer rounded-2xl transition-all duration-500 transform ${
              flipped.includes(card.id) || solved.includes(card.id)
                ? 'bg-white border-2 border-indigo-200 rotate-0'
                : 'bg-indigo-600 rotate-180'
            }`}
          >
            {(flipped.includes(card.id) || solved.includes(card.id)) ? card.symbol : ''}
          </div>
        )) : (
          <div className="col-span-4 py-20 text-center">
            <button onClick={initGame} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200">
              O'yinni boshlash
            </button>
          </div>
        )}
      </div>

      {isWon && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 text-center rounded-2xl font-bold animate-bounce">
          🎉 G'alaba! Hammasini topdingiz!
        </div>
      )}
    </div>
  );
};

export default MemoryGame;