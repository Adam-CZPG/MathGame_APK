import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Timer, Target } from 'lucide-react';
import MemoryCard from '@/components/memory/MemoryCard';
import MemoryComplete from '@/components/memory/MemoryComplete';
import Confetti from '@/components/game/Confetti';

const difficulties = {
  easy: { pairs: 6, emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'] },
  medium: { pairs: 8, emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'] },
  hard: { pairs: 10, emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'] },
};

export default function MemoryGame() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- LOKAL PROGRESS (Server o'rniga) ---
  const [progress, setProgress] = useState({
    games_played: 0,
    best_time: 999,
    best_moves: 999,
    total_wins: 0,
    current_difficulty: 'easy'
  });

  const config = difficulty ? difficulties[difficulty] : null;

  useEffect(() => {
    if (difficulty) {
      initializeGame();
    }
  }, [difficulty]);

  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameComplete]);

  useEffect(() => {
    if (config && matchedPairs.length === config.pairs && matchedPairs.length > 0) {
      setGameComplete(true);
      setShowConfetti(true);
      
      // Lokal progressni yangilash
      setProgress(prev => ({
        ...prev,
        games_played: prev.games_played + 1,
        best_time: Math.min(prev.best_time, time),
        best_moves: Math.min(prev.best_moves, moves),
        total_wins: prev.total_wins + 1,
      }));
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    const emojis = difficulties[difficulty].emojis;
    const cardPairs = [...emojis, ...emojis];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameComplete(false);
    setShowConfetti(false);
  };

  const handleCardClick = (index) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index])) return; // Jo'r bo'lgan kartani bosishni oldini olish
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatchedPairs([...matchedPairs, cards[first]]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Level Selection Screen
  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 rounded-xl"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Orqaga
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
              Memory Match
            </h1>
            <p className="text-white/80 text-lg">Qiyinchilik darajasini tanlang!</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {['easy', 'medium', 'hard'].map((level, i) => (
              <motion.button
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(level)}
                className="bg-white rounded-3xl p-8 shadow-2xl transition-all text-center"
              >
                <div className="text-5xl mb-4">
                  {level === 'easy' ? '😊' : level === 'medium' ? '🤔' : '😤'}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 capitalize">{level}</h3>
                <p className="text-gray-600">{difficulties[level].pairs} juftlik</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 p-4 md:p-6">
      <Confetti trigger={showConfetti} />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 rounded-xl"
            onClick={() => setDifficulty(null)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Menyu
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-gray-800 font-bold">{moves} yurish</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-gray-800 font-bold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-xl"
              onClick={initializeGame}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="text-center mb-8 text-white">
          <h2 className="text-3xl font-black capitalize">{difficulty} Mode</h2>
        </div>

        <div className={`grid gap-4 ${
            config.pairs === 6 ? 'grid-cols-3 md:grid-cols-4' :
            config.pairs === 8 ? 'grid-cols-4' :
            'grid-cols-4 md:grid-cols-5'
          }`}
        >
          {cards.map((emoji, index) => (
            <MemoryCard
              key={index}
              emoji={emoji}
              isFlipped={flippedIndices.includes(index)}
              isMatched={matchedPairs.includes(emoji)}
              onClick={() => handleCardClick(index)}
              disabled={flippedIndices.length === 2}
            />
          ))}
        </div>

        {gameComplete && (
          <MemoryComplete
            moves={moves}
            time={time}
            bestMoves={progress.best_moves}
            bestTime={progress.best_time}
            onPlayAgain={initializeGame}
            onHome={() => navigate('/')}
            onNextLevel={difficulty !== 'hard' ? () => {
                const levels = ['easy', 'medium', 'hard'];
                setDifficulty(levels[levels.indexOf(difficulty) + 1]);
            } : null}
          />
        )}
      </div>
    </div>
  );
}