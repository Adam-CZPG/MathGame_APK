import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

import GameHeader from '@/components/game/GameHeader';
import MathProblem from '@/components/game/MathProblem';
import LevelComplete from '@/components/game/LevelComplete';
import Confetti from '@/components/game/Confetti';
import usePlayerStats from '@/components/Entities/PlayerProgress';

// --- OVOZLAR ---
import correctSfx from '/sounds/correct.mp3';
import wrongSfx from '/sounds/wrong.mp3';
import victorySfx from '/sounds/victory.mp3';

const audioCache = {
  correct: typeof Audio !== 'undefined' ? new Audio(correctSfx) : null,
  wrong: typeof Audio !== 'undefined' ? new Audio(wrongSfx) : null,
  victory: typeof Audio !== 'undefined' ? new Audio(victorySfx) : null,
};

const getLevelConfig = (level) => {
  let operations = ['+'];
  if (level > 5) operations.push('-');
  if (level > 20) operations.push('×'); 
  if (level > 40) operations.push('÷'); 
  let maxNum = level > 25 ? 100 : level > 10 ? 50 : 10;
  return { operations, maxNum, timeLimit: Math.max(5, 15 - Math.floor(level / 10)), questions: 10 };
};

const gradients = ['from-indigo-600 to-purple-700', 'from-emerald-500 to-teal-700', 'from-orange-500 to-rose-600', 'from-blue-600 to-cyan-700'];

export default function Game() {
  const { levelId } = useParams();
  const level = parseInt(levelId) || 1;
  const navigate = useNavigate();
  
  // GLOBAL STATS HOOK
  const { stats, updateStats } = usePlayerStats();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [muted, setMuted] = useState(false);

  const config = useMemo(() => getLevelConfig(level), [level]);
  const gradient = gradients[(Math.floor((level-1)/20)) % gradients.length];

  const playSound = useCallback((type) => {
    if (muted || !audioCache[type]) return;
    audioCache[type].currentTime = 0;
    audioCache[type].play().catch(() => {});
  }, [muted]);

  const generateProblem = useCallback(() => {
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    let n1, n2, ans;
    if (operation === '+') { n1 = Math.floor(Math.random() * config.maxNum) + 1; n2 = Math.floor(Math.random() * config.maxNum) + 1; ans = n1 + n2; }
    else if (operation === '-') { n1 = Math.floor(Math.random() * config.maxNum) + 10; n2 = Math.floor(Math.random() * (n1 - 1)) + 1; ans = n1 - n2; }
    else if (operation === '×') { n1 = Math.floor(Math.random() * 10) + 2; n2 = Math.floor(Math.random() * 10) + 2; ans = n1 * n2; }
    else { n2 = Math.floor(Math.random() * 9) + 2; ans = Math.floor(Math.random() * 9) + 2; n1 = n2 * ans; }

    const opts = new Set([ans]);
    while (opts.size < 4) { let off = Math.floor(Math.random() * 11) - 5; if (ans + off > 0) opts.add(ans + (off === 0 ? 2 : off)); }
    setProblem({ display: `${n1} ${operation} ${n2} = ?`, answer: ans });
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  }, [config]);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  const handleAnswer = (userAnswer) => {
    const isCorrect = userAnswer === problem.answer;
    playSound(isCorrect ? 'correct' : 'wrong');
    
    updateStats(isCorrect, isCorrect ? 10 : 0, 0);

    const newScore = isCorrect ? score + 1 : score;
    const newStreak = isCorrect ? streak + 1 : 0;
    
    setScore(newScore);
    setStreak(newStreak);

    setTimeout(() => {
      if (currentQuestion + 1 >= config.questions) {
        finishGame(newScore);
      } else {
        setCurrentQuestion(prev => prev + 1);
        generateProblem();
      }
    }, 250);
  };

  const finishGame = (finalScore) => {
    // 9 ball 3 ta yulduz, 7 ball 2 ta, 5 ball 1 ta
    const stars = finalScore >= 9 ? 3 : finalScore >= 7 ? 2 : finalScore >= 5 ? 1 : 0;
    const isPerfect = finalScore === 10;
    
    // YANGI MANTIQ: Faqat 3 ta yulduz bo'lsa keyingi level ochiladi
    const canUnlockNext = stars === 3;

    if (canUnlockNext) {
      setTimeout(() => playSound('victory'), 300);
      // level parametrini yuboramiz - keyingi bosqich ochiladi
      updateStats(true, 0, stars, level, isPerfect);
      setShowConfetti(true);
    } else {
      // Mag'lubiyat yoki kam yulduz (1-2 ta)
      playSound(stars > 0 ? 'victory' : 'wrong');
      // null yuboramiz - keyingi bosqich OCHILMAYDI
      updateStats(true, 0, stars, null, false);
      if (stars >= 2) setShowConfetti(true);
    }

    setGameComplete(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 text-white select-none`} 
          style={{ WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }}>
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

        <GameHeader stars={stats.total_stars} xp={stats.xp_points} streak={streak} level={level} />

        <div className="mt-12">
          {!gameComplete && problem ? (
            <MathProblem problem={problem} options={options} onAnswer={handleAnswer} 
                         questionNumber={currentQuestion + 1} totalQuestions={config.questions} timeLimit={config.timeLimit} />
          ) : (
            <LevelComplete level={level} score={score} totalQuestions={config.questions} 
                           starsEarned={score >= 9 ? 3 : score >= 7 ? 2 : score >= 5 ? 1 : 0}
                           // TUZATISH: score 9 va undan ko'p bo'lsa (3 ta yulduz) Next Level tugmasi chiqadi
                           onNextLevel={score >= 9 ? () => { navigate(`/game/${level + 1}`); window.location.reload(); } : null}
                           onRetry={() => window.location.reload()} onHome={() => navigate('/')} />
          )}
        </div>
      </div>
    </div>
  );
}