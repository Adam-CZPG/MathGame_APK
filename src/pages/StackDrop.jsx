import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

const BLOCK_HEIGHT = 40;
const INITIAL_WIDTH = 200;
const SWING_SPEED = 4; // Biroz tezlashtirildi qiziqarli bo'lishi uchun
const PERFECT_THRESHOLD = 5;

export default function StackDrop() {
  const navigate = useNavigate();
  const gameAreaRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [blocks, setBlocks] = useState([{ x: 100, width: INITIAL_WIDTH, color: '#FF6B6B' }]);
  const [currentBlock, setCurrentBlock] = useState({ x: 0, width: INITIAL_WIDTH, color: '#4ECDC4' });
  const [direction, setDirection] = useState(1);
  const [perfectCount, setPerfectCount] = useState(0);
  const [showPerfect, setShowPerfect] = useState(false);

  // --- LOKAL PROGRESS (High Score'ni saqlash bilan) ---
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('stackDrop_highScore');
    return saved ? parseInt(saved) : 0;
  });

  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FFA07A', '#98D8C8'];

  // Swing animation (Blokni u yoqdan bu yoqqa harakatlantirish)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setCurrentBlock(prev => {
        const gameWidth = gameAreaRef.current?.offsetWidth || 400;
        let newX = prev.x + (direction * SWING_SPEED);
        let newDirection = direction;

        if (newX <= 0 || newX + prev.width >= gameWidth) {
          newDirection = -direction;
          newX = newX <= 0 ? 0 : gameWidth - prev.width;
          setDirection(newDirection);
        }

        return { ...prev, x: newX };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, direction]);

  const dropBlock = () => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    if (gameOver) return;

    const lastBlock = blocks[blocks.length - 1];
    const overlap = calculateOverlap(currentBlock, lastBlock);

    if (overlap <= 0) {
      endGame();
      return;
    }

    const isPerfect = Math.abs(currentBlock.x - lastBlock.x) < PERFECT_THRESHOLD;
    
    if (isPerfect) {
      const newWidth = Math.min(lastBlock.width + 10, INITIAL_WIDTH);
      const newBlock = {
        x: lastBlock.x,
        width: newWidth,
        color: colors[blocks.length % colors.length]
      };
      
      setBlocks([...blocks, newBlock]);
      setCurrentBlock(prev => ({ ...prev, width: newWidth, color: colors[(blocks.length + 1) % colors.length] }));
      setPerfectCount(perfectCount + 1);
      setShowPerfect(true);
      setTimeout(() => setShowPerfect(false), 500);
    } else {
      const newX = Math.max(currentBlock.x, lastBlock.x);
      const newWidth = overlap;
      
      if (newWidth < 20) {
        endGame();
        return;
      }

      const newBlock = {
        x: newX,
        width: newWidth,
        color: colors[blocks.length % colors.length]
      };

      setBlocks([...blocks, newBlock]);
      setCurrentBlock({ x: 0, width: newWidth, color: colors[(blocks.length + 1) % colors.length] });
    }

    setScore(score + 1);
  };

  const calculateOverlap = (current, last) => {
    const currentRight = current.x + current.width;
    const lastRight = last.x + last.width;
    const overlapStart = Math.max(current.x, last.x);
    const overlapEnd = Math.min(currentRight, lastRight);
    return Math.max(0, overlapEnd - overlapStart);
  };

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('stackDrop_highScore', score.toString());
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setBlocks([{ x: 100, width: INITIAL_WIDTH, color: '#FF6B6B' }]);
    setCurrentBlock({ x: 0, width: INITIAL_WIDTH, color: '#4ECDC4' });
    setDirection(1);
    setPerfectCount(0);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 flex flex-col select-none"
      onClick={() => (gameOver ? resetGame() : dropBlock())}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="text-white hover:bg-white/20 rounded-xl" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Orqaga
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
            <span className="text-white text-2xl font-black">{score}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md h-[600px]">
          
          {/* Start Screen */}
          {!gameStarted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/30 backdrop-blur-md rounded-3xl p-6 text-center">
              <h1 className="text-5xl font-black text-white mb-4">Stack & Drop</h1>
              <p className="text-white/80 text-lg mb-8">Bloklarni tushirish uchun ekranga bosing!</p>
              <Button className="bg-white text-purple-600 font-bold text-xl px-10 py-7 rounded-2xl shadow-xl">Boshlash</Button>
            </motion.div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-md rounded-3xl p-6 text-center">
              <div className="text-7xl mb-4">🏗️</div>
              <h2 className="text-4xl font-black text-white mb-2">Tamom!</h2>
              <div className="bg-white/20 rounded-2xl p-6 mb-6 w-full">
                <p className="text-white text-xl">Ball: <span className="font-black text-4xl text-yellow-300">{score}</span></p>
                {score >= highScore && score > 0 && <p className="text-green-400 font-bold mt-2">Yangi Rekord! 🎉</p>}
              </div>
              <Button className="bg-white text-purple-600 font-bold text-xl px-10 py-7 rounded-2xl shadow-xl">
                <RotateCcw className="w-6 h-6 mr-2" /> Qayta o'ynash
              </Button>
            </motion.div>
          )}

          <AnimatePresence>
            {showPerfect && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-yellow-400 text-black font-black text-2xl px-6 py-2 rounded-full shadow-2xl">
                DAHSHAT! ⭐
              </motion.div>
            )}
          </AnimatePresence>

          {/* Board */}
          <div ref={gameAreaRef} className="relative w-full h-full bg-white/5 backdrop-blur-[2px] rounded-3xl overflow-hidden border border-white/10 shadow-inner">
            
            {/* Current moving block */}
            {gameStarted && !gameOver && (
              <div 
                className="absolute shadow-2xl transition-all duration-75"
                style={{
                  top: 60,
                  left: currentBlock.x,
                  width: currentBlock.width,
                  height: BLOCK_HEIGHT,
                  backgroundColor: currentBlock.color,
                  borderRadius: '10px'
                }}
              />
            )}

            {/* Stacked blocks */}
            <div className="absolute bottom-0 w-full">
              {blocks.map((block, index) => (
                <motion.div
                  key={index}
                  className="absolute border-t border-white/20 shadow-lg"
                  style={{
                    left: block.x,
                    width: block.width,
                    height: BLOCK_HEIGHT,
                    backgroundColor: block.color,
                    bottom: (index * BLOCK_HEIGHT),
                    borderRadius: '4px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}