import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// Komponentlarni import qilish
import GameHeader from '@/components/game/GameHeader';
import MathProblem from '@/components/game/MathProblem';
import LevelComplete from '@/components/game/LevelComplete';
import Confetti from '@/components/game/Confetti';
import NewBadgeModal from '@/components/game/NewBadgeModal';

// --- OVOZLARNI OLDINDAN YUKLASH (Preload) ---
const audioCache = {
  correct: typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null,
  wrong: typeof Audio !== 'undefined' ? new Audio('/sounds/wrong.mp3') : null,
  victory: typeof Audio !== 'undefined' ? new Audio('/sounds/victory.mp3') : null, // Victory qo'shildi
};

const levelConfigs = {
  1: { operations: ['+'], maxNum: 10, timeLimit: 15, questions: 10 },
  2: { operations: ['-'], maxNum: 10, timeLimit: 15, questions: 10 },
  3: { operations: ['+', '-'], maxNum: 20, timeLimit: 12, questions: 10 },
  4: { operations: ['×'], maxNum: 10, timeLimit: 15, questions: 10 },
  5: { operations: ['÷'], maxNum: 50, timeLimit: 15, questions: 10 },
  6: { operations: ['×', '÷'], maxNum: 12, timeLimit: 12, questions: 10 },
  7: { operations: ['+', '-', '×', '÷'], maxNum: 20, timeLimit: 12, questions: 12 },
  8: { operations: ['+', '-', '×', '÷'], maxNum: 50, timeLimit: 10, questions: 12 },
  9: { operations: ['+', '-', '×', '÷'], maxNum: 100, timeLimit: 8, questions: 15 },
  10: { operations: ['+', '-', '×', '÷'], maxNum: 100, timeLimit: 6, questions: 20 },
};

const gradients = [
  'from-pink-500 via-rose-500 to-red-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-lime-500 via-green-500 to-emerald-500',
  'from-teal-500 via-cyan-500 to-sky-500',
  'from-blue-500 via-indigo-500 to-violet-500',
  'from-purple-500 via-fuchsia-500 to-pink-500',
  'from-rose-500 via-pink-500 to-fuchsia-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-violet-500 via-purple-500 to-indigo-500',
];

export default function Game() {
  const { levelId } = useParams();
  const level = parseInt(levelId) || 1;
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [muted, setMuted] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState(null);

  const [progress, setProgress] = useState({
    total_stars: 0,
    xp_points: 0,
    badges: [],
    total_problems_solved: 0,
    total_attempts: 0,
    current_level: level,
    completed_levels: []
  });

  const config = levelConfigs[level] || levelConfigs[1];
  const gradient = gradients[(level - 1) % gradients.length];

  // --- OVOZ CHALISH FUNKSIYASI ---
  // Endi u 'type' qabul qiladi: correct, wrong yoki victory
  const playSound = useCallback((type) => {
    if (muted) return;
    const sound = audioCache[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error("Audio error:", err));
    }
  }, [muted]);

  const generateProblem = useCallback(() => {
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * config.maxNum) + 1;
        num2 = Math.floor(Math.random() * config.maxNum) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * config.maxNum) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * config.maxNum) + 1;
        num2 = Math.floor(Math.random() * config.maxNum) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 1; num2 = 1; answer = 2;
    }

    const wrongOptions = new Set();
    while (wrongOptions.size < 3) {
      let wrong;
      const offset = Math.floor(Math.random() * 10) - 5;
      wrong = answer + (offset === 0 ? 1 : offset);
      if (wrong !== answer && wrong > 0) wrongOptions.add(wrong);
    }

    const allOptions = [answer, ...wrongOptions];
    allOptions.sort(() => Math.random() - 0.5);

    setProblem({ display: `${num1} ${operation} ${num2} = ?`, answer });
    setOptions(allOptions);
    setAnswerStartTime(Date.now());
  }, [config]);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const handleAnswer = async (answer) => {
    const isCorrect = answer === problem.answer;
    
    // To'g'ri/Xato ovozini chalish
    playSound(isCorrect ? 'correct' : 'wrong');
    
    const timeTaken = (Date.now() - answerStartTime) / 1000;
    
    let newStreak = isCorrect ? streak + 1 : 0;
    let newScore = isCorrect ? score + 1 : score;
    
    setStreak(newStreak);
    setScore(newScore);

    if (currentQuestion + 1 >= config.questions) {
      const percentage = (newScore / config.questions) * 100;
      const starsEarned = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
      
      // --- VICTORY OVOZI SHU YERDA ---
      if (newScore > 0) {
        playSound('victory');
      }

      setProgress(prev => ({
        ...prev,
        total_stars: prev.total_stars + starsEarned,
        xp_points: prev.xp_points + (newScore * 10),
        total_problems_solved: prev.total_problems_solved + newScore
      }));

      if (starsEarned >= 2) setShowConfetti(true);
      setGameComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      generateProblem();
    }
  };

  const handleNextLevel = () => {
    navigate(`/game/${level + 1}`);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
    setShowConfetti(false);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
    setShowConfetti(false);
    generateProblem();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 md:p-6`}>
      <Confetti trigger={showConfetti} />
      
      {newBadge && (
        <NewBadgeModal badgeId={newBadge} onClose={() => setNewBadge(null)} />
      )}

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

        <GameHeader stars={progress.total_stars} xp={progress.xp_points} streak={streak} level={level} />

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
            isLastLevel={level >= 10}
          />
        )}
      </div>
    </div>
  );
}