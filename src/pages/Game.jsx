import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

import GameHeader from '@/components/game/GameHeader';
import MathProblem from '@/components/game/MathProblem';
import LevelComplete from '@/components/game/LevelComplete';
import Confetti from '@/components/game/Confetti';
import NewBadgeModal from '@/components/game/NewBadgeModal';

const audioCache = {
  correct: typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null,
  wrong: typeof Audio !== 'undefined' ? new Audio('/sounds/wrong.mp3') : null,
  victory: typeof Audio !== 'undefined' ? new Audio('/sounds/victory.mp3') : null,
};

// --- YANGILANGAN QIYINCHILIK MANTIQI ---
const getLevelConfig = (level) => {
  let operations = ['+'];
  if (level > 5) operations.push('-');
  if (level > 20) operations.push('×'); // World 2: Ko'paytirish
  if (level > 40) operations.push('÷'); // World 3: Bo'lish

  let maxNum = 10;
  if (level > 10) maxNum = 50;
  if (level > 25) maxNum = 100;
  if (level > 45) maxNum = 500;

  // Vaqt daraja oshgani sari kamayadi (min 5s)
  const timeLimit = Math.max(5, 15 - Math.floor(level / 10));

  return { operations, maxNum, timeLimit, questions: 10 };
};

const gradients = [
  'from-indigo-600 to-purple-700',
  'from-emerald-500 to-teal-700',
  'from-orange-500 to-rose-600',
  'from-blue-600 to-cyan-700',
];

export default function Game() {
  const { levelId } = useParams();
  const level = parseInt(levelId) || 1;
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionBestStreak, setSessionBestStreak] = useState(0);
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [muted, setMuted] = useState(false);

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('PlayerProgress');
    return saved ? JSON.parse(saved) : {
      total_stars: 0, xp_points: 0, badges: [], total_problems_solved: 0,
      total_attempts: 0, accuracy_percentage: 0, current_level: 1,
      best_streak: 0, completed_levels: []
    };
  });

  const config = getLevelConfig(level);
  const gradient = gradients[(Math.floor((level-1)/20)) % gradients.length];

  const playSound = useCallback((type) => {
    if (muted) return;
    const sound = audioCache[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }, [muted]);

  const generateProblem = useCallback(() => {
    const currentConfig = getLevelConfig(level);
    const operation = currentConfig.operations[Math.floor(Math.random() * currentConfig.operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * currentConfig.maxNum) + 1;
        num2 = Math.floor(Math.random() * currentConfig.maxNum) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * currentConfig.maxNum) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * (level > 30 ? 15 : 10)) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 9) + 2;
        num1 = num2 * answer;
        break;
      default:
        num1 = 1; num2 = 1; answer = 2;
    }

    const wrongOptions = new Set();
    while (wrongOptions.size < 3) {
      let offset = Math.floor(Math.random() * 10) - 5;
      let wrong = answer + (offset === 0 ? 3 : offset);
      if (wrong !== answer && wrong > 0) wrongOptions.add(wrong);
    }

    setProblem({ display: `${num1} ${operation} ${num2} = ?`, answer });
    setOptions([answer, ...wrongOptions].sort(() => Math.random() - 0.5));
  }, [level]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const handleAnswer = (userAnswer) => {
    const isCorrect = userAnswer === problem.answer;
    playSound(isCorrect ? 'correct' : 'wrong');
    
    const newScore = isCorrect ? score + 1 : score;
    const newStreak = isCorrect ? streak + 1 : 0;
    
    setScore(newScore);
    setStreak(newStreak);
    if (newStreak > sessionBestStreak) setSessionBestStreak(newStreak);

    if (currentQuestion + 1 >= config.questions) {
      finishGame(newScore);
    } else {
      setCurrentQuestion(prev => prev + 1);
      generateProblem();
    }
  };

  const finishGame = (finalScore) => {
    const starsEarned = finalScore >= 9 ? 3 : finalScore >= 7 ? 2 : finalScore >= 5 ? 1 : 0;
    if (starsEarned > 0) playSound('victory');

    const currentSaved = JSON.parse(localStorage.getItem('PlayerProgress')) || progress;
    const totalSolved = (currentSaved.total_problems_solved || 0) + finalScore;
    const totalAttempts = (currentSaved.total_attempts || 0) + config.questions;
    const accuracy = Math.min(100, Math.round((totalSolved / totalAttempts) * 100));

    const updatedProgress = {
      ...currentSaved,
      total_stars: (currentSaved.total_stars || 0) + starsEarned,
      xp_points: (currentSaved.xp_points || 0) + (finalScore * 10),
      total_problems_solved: totalSolved,
      total_attempts: totalAttempts,
      accuracy_percentage: accuracy,
      current_level: starsEarned >= 1 ? Math.max(currentSaved.current_level, level + 1) : currentSaved.current_level,
      completed_levels: starsEarned >= 1 ? [...new Set([...(currentSaved.completed_levels || []), level])] : currentSaved.completed_levels
    };

    localStorage.setItem('PlayerProgress', JSON.stringify(updatedProgress));
    setProgress(updatedProgress);
    if (starsEarned >= 2) setShowConfetti(true);
    setGameComplete(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 text-white`}>
      <Confetti trigger={showConfetti} />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="bg-white/20 px-4 py-1 rounded-full font-bold">Level {level}</span>
            <Button variant="ghost" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
        </div>

        <GameHeader stars={progress.total_stars} xp={progress.xp_points} streak={streak} level={level} />

        <div className="mt-12">
          {!gameComplete && problem ? (
            <MathProblem
              problem={problem}
              options={options}
              onAnswer={handleAnswer}
              questionNumber={currentQuestion + 1}
              totalQuestions={config.questions}
              timeLimit={config.timeLimit}
            />
          ) : (
            <LevelComplete
              level={level}
              score={score}
              totalQuestions={config.questions}
              starsEarned={Math.round((score/10)*3)}
              onNextLevel={() => {
                navigate(`/game/${level + 1}`);
                window.location.reload(); // Darajani to'liq yangilash uchun
              }}
              onRetry={() => window.location.reload()}
              onHome={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </div>
  );
}