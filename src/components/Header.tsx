import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { playSound } from '../utils/audio';
import { Heart, Zap, Award, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Header = () => {
  const {
    points, streak, loveCount, incrementLove,
    isMuted, toggleMute, theme, setTheme
  } = useGameStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleLoveClick = () => {
    playSound.loveTap();
    incrementLove();
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    playSound.tap();
  };

  const handleMuteToggle = () => {
    toggleMute();
    playSound.tap();
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 group" onClick={() => playSound.tap()}>
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm tracking-tighter">M</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            MathStreak
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <Zap size={16} className="fill-current" />
            <span className="font-bold text-sm">{streak}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
            <Award size={16} className="fill-current" />
            <span className="font-bold text-sm">{points}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLoveClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={loveCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Heart size={16} className="fill-current" />
              </motion.div>
            </AnimatePresence>
            <span className="font-bold text-sm">{loveCount}</span>
          </motion.button>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={handleMuteToggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;