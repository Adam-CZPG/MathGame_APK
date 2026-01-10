import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// Komponentlarni import qilish
import GameHeader from '@/components/game/GameHeader';
import MathProblem from '@/components/game/MathProblem';
import LevelComplete from '@/components/game/LevelComplete';
import Confetti from '@/components/game/Confetti';
import NewBadgeModal from '@/components/game/NewBadgeModal';

// --- OVOZLARNI OLDINDAN YUKLASH ---
const audioCache = {
  correct: typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null,
  wrong: typeof Audio !== 'undefined' ? new Audio('/sounds/wrong.mp3') : null,
  victory: typeof Audio !== 'undefined' ? new Audio('/sounds/victory.mp3') : null,
};

const getLevelConfig = (level) => {
  let operations = ['+'];
  if (level > 3) operations.push('-');
  if (level > 8) operations.push('×');
  if (level > 12) operations.push('÷');

  let maxNum = 10;
  if (level > 5) maxNum = 50;
  if (level > 10) maxNum = 100;
  if (level > 20) maxNum = 500;
  if (level > 35) maxNum = 1000;

  const timeLimit = Math.max(5, 15 - Math.floor(level / 5));

  return { operations, maxNum, timeLimit, questions: 10 };
};

const gradients = [
  'from-pink-500 via-rose-500 to-red-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-lime-500 via-green-500 to-emerald-500',
  'from-teal-500 via-cyan-500 to-sky-500',
  'from-blue-500 via-indigo-500 to-violet-500',
  'from-purple-500 via-fuchsia-500 to-pink-500',
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
      total_stars: 0,
      xp_points: 0,
      badges: [],
      total_problems_solved: 0,
      total_attempts: 0,
      accuracy_percentage: 0,
      current_level: 1,
      best_streak: 0,
      completed_levels: []
    };
  });

  const config = getLevelConfig(level);
  const gradient = gradients[(level - 1) % gradients.length];

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
    const minNum = level > 10 ? Math.floor(currentConfig.maxNum / 5) : 1;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * (currentConfig.maxNum - minNum)) + minNum;
        num2 = Math.floor(Math.random() * (currentConfig.maxNum - minNum)) + minNum;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * (currentConfig.maxNum - minNum)) + minNum;
        num2 = Math.floor(Math.random() * (num1 - minNum)) + minNum;
        answer = num1 - num2;
        break;
      case '×':
        const multiLimit = level > 20 ? 25 : 12;
        num1 = Math.floor(Math.random() * multiLimit) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 10) + 2;
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

    const allOptions = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
    setProblem({ display: `${num1} ${operation} ${num2} = ?`, answer });
    setOptions(allOptions);
  }, [level]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const checkForNewBadges = (updatedProgress, currentScore, currentStreak) => {
    const earned = [...(updatedProgress.badges || [])];
    let justWon = null;

    const addBadge = (id) => {
      if (!earned.includes(id)) {
        earned.push(id);
        justWon = id;
      }
    };

    if (level === 1 && currentScore >= 5) addBadge('first_step');
    if (currentStreak >= 5) addBadge('on_fire');
    if (updatedProgress.current_level >= 10) addBadge('level_up');
    if (updatedProgress.total_problems_solved >= 100) addBadge('math_master');
    if (currentScore === 10) addBadge('perfecto');
    if (updatedProgress.total_stars >= 500) addBadge('champion');

    return { newBadgesList: earned, newlyUnlocked: justWon };
  };

  const handleAnswer = async (answer) => {
    const isCorrect = answer === problem.answer;
    playSound(isCorrect ? 'correct' : 'wrong');
    
    let newStreak = isCorrect ? streak + 1 : 0;
    let newScore = isCorrect ? score + 1 : score;
    
    setStreak(newStreak);
    if (newStreak > sessionBestStreak) setSessionBestStreak(newStreak);
    setScore(newScore);

    if (currentQuestion + 1 >= config.questions) {
      const starsEarned = newScore >= 9 ? 3 : newScore >= 7 ? 2 : newScore >= 5 ? 1 : 0;
      if (newScore > 0) playSound('victory');

      const currentSaved = JSON.parse(localStorage.getItem('PlayerProgress')) || progress;
      
      const totalSolved = (Number(currentSaved.total_problems_solved) || 0) + newScore;
      const totalAttempts = (Number(currentSaved.total_attempts) || 0) + config.questions;
      
      // Accuracy 100% dan oshib ketishini oldini olish
      const accuracy = totalAttempts > 0 
        ? Math.min(100, Math.round((totalSolved / totalAttempts) * 100)) 
        : 0;

      const overallBestStreak = Math.max(Number(currentSaved.best_streak) || 0, sessionBestStreak, newStreak);

      let updatedProgress = {
        ...currentSaved,
        total_stars: (Number(currentSaved.total_stars) || 0) + starsEarned,
        xp_points: (Number(currentSaved.xp_points) || 0) + (newScore * 10),
        total_problems_solved: totalSolved,
        total_attempts: totalAttempts,
        accuracy_percentage: accuracy,
        best_streak: overallBestStreak,
        current_level: starsEarned >= 1 ? Math.max(Number(currentSaved.current_level) || 1, level + 1) : (Number(currentSaved.current_level) || 1),
        completed_levels: starsEarned >= 1 
          ? [...new Set([...(currentSaved.completed_levels || []), level])]
          : (currentSaved.completed_levels || [])
      };

      const { newBadgesList, newlyUnlocked } = checkForNewBadges(updatedProgress, newScore, overallBestStreak);
      updatedProgress.badges = newBadgesList;

      localStorage.setItem('PlayerProgress', JSON.stringify(updatedProgress));
      setProgress(updatedProgress);

      if (newlyUnlocked) setNewBadge(newlyUnlocked);
      if (starsEarned >= 2) setShowConfetti(true);
      setGameComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      generateProblem();
    }
  };

  const handleNextLevel = () => {
    navigate(`/game/${level + 1}`);
    resetGameState();
  };

  const handleRetry = () => {
    resetGameState();
    generateProblem();
  };

  const resetGameState = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setSessionBestStreak(0);
    setGameComplete(false);
    setShowConfetti(false);
    setNewBadge(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 md:p-6`}>
      <Confetti trigger={showConfetti} />
      
      <AnimatePresence>
        {newBadge && (
          <NewBadgeModal 
            badgeId={newBadge} 
            onClose={() => setNewBadge(null)} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="text-white hover:bg-white/20 rounded-xl" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
              <span className="text-white font-bold">Level {level}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-xl" onClick={() => setMuted(!muted)}>
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <GameHeader 
          stars={progress.total_stars} 
          xp={progress.xp_points} 
          streak={streak} 
          level={level} 
        />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {!gameComplete && problem && (
              <MathProblem
                key={currentQuestion}
                problem={problem}
                options={options}
                onAnswer={handleAnswer}
                questionNumber={currentQuestion + 1}
                totalQuestions={config.questions}
                timeLimit={config.timeLimit}
              />
            )}
          </AnimatePresence>
        </div>

        {gameComplete && (
          <LevelComplete
            level={level}
            score={score}
            totalQuestions={config.questions}
            starsEarned={Math.round((score / config.questions) * 3)}
            xpEarned={score * 10}
            onNextLevel={handleNextLevel}
            onRetry={handleRetry}
            onHome={() => navigate('/')}
            isLastLevel={false}
          />
        )}
      </div>
    </div>
  );
}