import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Target, Share2, Home } from 'lucide-react';
import { generateShareImage, shareResult } from '../utils/share';
import { useGameStore } from '../store/useGameStore';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { streak } = useGameStore();

  const state = location.state as {
    level: string;
    stats: { correct: number; total: number };
    timeSpent: number;
    maxCombo: number;
  } | null;

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, [state, navigate]);

  if (!state) return null;

  const { level, stats, timeSpent, maxCombo } = state;
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  const handleShare = async () => {
    const dataUrl = await generateShareImage({
      level,
      accuracy,
      correct: stats.correct,
      total: stats.total,
      timeSpent,
      streak,
      maxCombo,
    });
    shareResult(dataUrl, `I scored ${accuracy}% on MathStreak ${level} level! 🔥 Streak: ${streak} days`);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center mb-8 bg-white dark:bg-slate-800 pb-2">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Session Complete!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium capitalize">{level} Level</p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
              <Target size={24} className="text-indigo-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{accuracy}%</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Accuracy</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
              <Clock size={24} className="text-indigo-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-slate-900 dark:text-white leading-[36px]">{formatTime(timeSpent)}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Time</div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <span>Correct: {stats.correct}/{stats.total}</span>
            <span>•</span>
            <span>Max Combo: {maxCombo}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Share2 size={20} />
            Share Score
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Home size={20} />
            Back Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;