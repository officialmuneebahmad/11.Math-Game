import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Zap } from 'lucide-react';
import { useGameStore, type Level } from '../store/useGameStore';
import { generateQuestionBank, type Question } from '../utils/questionGenerator';
import { playSound } from '../utils/audio';

const Game = () => {
  const { level } = useParams<{ level: Level }>();
  const navigate = useNavigate();
  const { updateLevelProgress, addPoints, gameMode } = useGameStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isGameOver, setIsGameOver] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [combo, setCombo] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const endGame = useCallback(() => {
    setIsGameOver(true);
    playSound.levelComplete();
    setTimeout(() => {
      // Pass stats via state to Results page
      navigate('/results', {
        state: {
          level,
          stats: sessionStats,
          timeSpent: gameMode === 'timed' ? 300 - timeLeft : sessionStats.total * 5, // Approximation for untimed
          maxCombo: combo
        }
      });
    }, 1500);
  }, [combo, level, navigate, sessionStats, timeLeft, gameMode]);

  // Initialize questions
  useEffect(() => {
    if (!level || !['easy', 'medium', 'hard'].includes(level)) {
      navigate('/');
      return;
    }
    setQuestions(generateQuestionBank(level));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [level, navigate]);

  // Timer logic - only if mode is 'timed'
  useEffect(() => {
    if (isGameOver || questions.length === 0 || gameMode !== 'timed') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, questions.length, endGame, gameMode]);

  const handleAnswer = (answer: string | number) => {
    if (feedback !== null || isGameOver) return;

    const currentQ = questions[currentIndex];
    const isCorrect = String(answer).trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase();

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playSound.correct();
      setCombo(prev => prev + 1);
      const pointsEarned = 10 + (combo * 2);
      addPoints(pointsEarned);
      setSessionStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      playSound.incorrect();
      setCombo(0);
      setSessionStats(prev => ({ ...prev, total: prev.total + 1 }));
    }

    updateLevelProgress(level as Level, isCorrect);

    // Proceed to next question after delay
    setTimeout(() => {
      setFeedback(null);
      setInputValue('');

      if (currentIndex + 1 >= questions.length) {
        endGame();
      } else {
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAnswer(inputValue);
    }
  };

  // Allow manual early exit
  const handleExit = () => {
    if (sessionStats.total > 0) {
      endGame();
    } else {
      navigate('/');
    }
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex-grow flex flex-col max-w-2xl mx-auto w-full pt-4 pb-8">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={handleExit} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <X size={24} />
        </button>

        <div className="flex gap-4">
          {combo >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-bold text-sm"
            >
              <Zap size={14} className="fill-current" /> {combo}x Combo!
            </motion.div>
          )}
          {gameMode === 'timed' ? (
             <div className="flex items-center gap-2 font-mono font-bold text-lg text-slate-700 dark:text-slate-300">
               <Clock size={20} />
               <span className={timeLeft < 60 ? 'text-rose-500' : ''}>{formatTime(timeLeft)}</span>
             </div>
          ) : (
             <div className="flex items-center gap-2 font-bold text-sm text-slate-500 dark:text-slate-400">
               Practice Mode
             </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-12 overflow-hidden">
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Area */}
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-12 tracking-tighter text-center">
              {currentQ.text}
            </h2>

            {currentQ.format === 'multiple-choice' && currentQ.options ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {currentQ.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={feedback !== null}
                    className={`
                      py-6 text-2xl font-bold rounded-2xl transition-all
                      ${feedback === null ? 'bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 text-slate-800 dark:text-white shadow-sm' : ''}
                      ${feedback === 'correct' && option === currentQ.answer ? 'bg-emerald-500 border-emerald-500 text-white scale-105' : ''}
                      ${feedback === 'incorrect' && option === currentQ.answer ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="w-full max-w-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={feedback !== null}
                  placeholder="Type answer..."
                  className={`
                    w-full text-center text-4xl font-bold py-4 rounded-2xl border-4 outline-none transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                    ${feedback === null ? 'border-slate-200 dark:border-slate-700 focus:border-indigo-500' : ''}
                    ${feedback === 'correct' ? 'border-emerald-500 text-emerald-500' : ''}
                    ${feedback === 'incorrect' ? 'border-rose-500 text-rose-500' : ''}
                  `}
                  autoComplete="off"
                />
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Game;