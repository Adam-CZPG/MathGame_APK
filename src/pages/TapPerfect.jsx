import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';

const POWER_SPEED = 3;
const PERFECT_THRESHOLD = 15;
const GOOD_THRESHOLD = 30;

export default function TapPerfect() {
  const navigate = useNavigate();
  const animationRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [power, setPower] = useState(0);
  const [charging, setCharging] = useState(true);
  const [shooting, setShooting] = useState(false);
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState(null);
  const [combo, setCombo] = useState(0);
  const [perfectTaps, setPerfectTaps] = useState(0);

  // Lokal High Score
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tapPerfect_highScore');
    return saved ? parseInt(saved) : 0;
  });

  // Kuch o'lchagich animatsiyasi
  useEffect(() => {
    if (!gameStarted || gameOver || !charging || shooting) return;

    const animate = () => {
      setPower(prev => {
        const newPower = prev + POWER_SPEED;
        return newPower >= 100 ? 0 : newPower;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameOver, charging, shooting]);

  const handleTap = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setCharging(true);
      return;
    }

    if (gameOver || shooting) return;

    setShooting(true);
    setCharging(false);

    const targetPower = 50; // O'rtadagi nuqta
    const difference = Math.abs(power - targetPower);

    const startX = 0;
    const duration = 500;
    const startTime = Date.now();

    const animateArrow = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setArrowPosition({
        x: startX + (300 * progress),
        y: (difference * 0.8 * progress) // Xatolikka qarab yuqori/pastga ketadi
      });

      if (progress < 1) {
        requestAnimationFrame(animateArrow);
      } else {
        evaluateShot(difference);
      }
    };

    animateArrow();
  };

  const evaluateShot = (difference) => {
    if (difference <= PERFECT_THRESHOLD) {
      const points = 10 + combo * 2;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setPerfectTaps(prev => prev + 1);
      setFeedback({ text: '🎯 BULLSEYE!', color: 'text-yellow-300' });
    } else if (difference <= GOOD_THRESHOLD) {
      setScore(prev => prev + 5);
      setCombo(0);
      setFeedback({ text: '✓ Yaxshi!', color: 'text-green-300' });
    } else {
      handleMiss();
      return;
    }
    resetArrow();
  };

  const handleMiss = () => {
    setCombo(0);
    setFeedback({ text: '✗ Miss!', color: 'text-red-400' });
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) endGame();
      return newLives;
    });
    if (lives > 1) resetArrow();
  };

  const resetArrow = () => {
    setTimeout(() => {
      setShooting(false);
      setPower(0);
      setArrowPosition({ x: 0, y: 0 });
      setFeedback(null);
      setCharging(true);
    }, 800);
  };

  const endGame = () => {
    setGameOver(true);
    setCharging(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tapPerfect_highScore', score.toString());
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setPower(0);
    setCombo(0);
    setPerfectTaps(0);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 p-4 flex flex-col select-none" onClick={handleTap}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="text-white hover:bg-white/20 rounded-xl" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5 mr-2" /> Orqaga
        </Button>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-2xl text-white font-black text-2xl">
            {score}
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="font-bold">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Lives & Combo */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-2xl">{i < lives ? '❤️' : '🖤'}</span>
          ))}
        </div>
        <AnimatePresence>
          {combo > 1 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="bg-yellow-400 text-black px-4 py-1 rounded-full font-black">
              🔥 {combo}x COMBO
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
          
          {/* Target Visual */}
          <div className="relative w-64 h-64 rounded-full border-8 border-white/20 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-red-500 border-4 border-white flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-yellow-400 border-4 border-white" />
              </div>
            </div>
          </div>

          {/* Shooting Arrow */}
          {shooting && (
            <div 
              className="absolute left-0 z-20"
              style={{ transform: `translate(${arrowPosition.x}px, ${arrowPosition.y}px)` }}
            >
              <div className="flex items-center">
                <div className="w-16 h-1 bg-amber-800" />
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-800 border-b-8 border-b-transparent" />
              </div>
            </div>
          )}

          {/* Start/End Screens */}
          {!gameStarted && (
            <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-4xl font-black text-white mb-2">Archery Master</h1>
              <p className="text-white/80 mb-6">O'rtada to'xtatish uchun bosing!</p>
              <Button className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl">Boshlash</Button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md rounded-full flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-3xl font-black text-white mb-2">Tamom!</h2>
              <p className="text-white text-xl mb-4">Ball: {score}</p>
              <Button onClick={(e) => { e.stopPropagation(); resetGame(); }} className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl">Qayta o'ynash</Button>
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: -50, opacity: 1 }} exit={{ opacity: 0 }} className={`absolute z-40 font-black text-3xl ${feedback.color}`}>
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Power Meter */}
      {gameStarted && !gameOver && !shooting && (
        <div className="w-full max-w-md mx-auto mb-10">
          <div className="h-10 bg-black/30 rounded-full relative overflow-hidden border-2 border-white/50">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-500" 
              style={{ width: `${power}%` }} 
            />
            <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-[0_0_10px_white]" />
          </div>
          <p className="text-center text-white/70 mt-2 font-bold">🎯 Markazda bosing!</p>
        </div>
      )}
    </div>
  );
}