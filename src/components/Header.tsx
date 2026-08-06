import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { playSound } from '../utils/audio';
import { Heart, Zap, Award, Volume2, VolumeX, Moon, Sun, BatteryCharging, Crown, UserRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import PaywallModal from './PaywallModal';

import React from 'react';

// Tooltip - direction 'above' (default) or 'below'
const Tooltip = ({ label, direction = 'above', children }: { label: string; direction?: 'above' | 'below'; children: React.ReactNode }) => {
  const [visible, setVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const show = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (direction === 'below') {
        setCoords({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
      } else {
        setCoords({ x: rect.left + rect.width / 2, y: rect.top - 8 });
      }
    }
    setVisible(true);
  };

  const isBelow = direction === 'below';

  return (
    <div ref={ref} className="flex-shrink-0" onMouseEnter={show} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y,
            transform: isBelow ? 'translateX(-50%)' : 'translateX(-50%) translateY(-100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          className="px-2.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg whitespace-nowrap shadow-xl border border-slate-700"
        >
          {isBelow
            ? <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
            : <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          }
          {label}
        </div>
      )}
    </div>
  );
};

// Inline SVG Logo
const BrainMathLogo = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <defs>
      <linearGradient id="hBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e1b4b"/>
        <stop offset="100%" stopColor="#4c1d95"/>
      </linearGradient>
      <linearGradient id="hBrain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60a5fa"/>
        <stop offset="100%" stopColor="#818cf8"/>
      </linearGradient>
      <linearGradient id="hMath" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#f59e0b"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#hBg)"/>
    <line x1="32" y1="10" x2="32" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
    <g stroke="url(#hBrain)" strokeWidth="2" strokeLinecap="round" fill="none">
      <path d="M28 14 C20 14, 14 20, 14 28 C14 32, 16 35, 18 37 C16 39, 15 42, 17 45 C19 48, 23 49, 27 48 L30 48 L30 14 Z" fill="#60a5fa" fillOpacity="0.12"/>
      <path d="M14 26 C16 24, 19 25, 20 27"/>
      <path d="M14 33 C17 31, 21 32, 22 35"/>
      <path d="M17 40 C20 38, 24 39, 25 42"/>
      <circle cx="18" cy="22" r="1.5" fill="#60a5fa"/>
      <circle cx="24" cy="30" r="1.5" fill="#818cf8"/>
      <circle cx="20" cy="41" r="1.5" fill="#60a5fa"/>
    </g>
    <g fill="url(#hMath)">
      <rect x="34" y="16.75" width="10" height="2.5" rx="1"/>
      <rect x="38.25" y="12.5" width="2.5" height="10" rx="1"/>
      <rect x="34" y="30.75" width="10" height="2.5" rx="1"/>
      <rect x="33.8" y="43" width="11" height="2.4" rx="1" transform="rotate(45 39.5 44.2)"/>
      <rect x="33.8" y="43" width="11" height="2.4" rx="1" transform="rotate(-45 39.5 44.2)"/>
    </g>
  </svg>
);

const Header = () => {
  const {
    points, streak, loveCount, incrementLove,
    isMuted, toggleMute, theme, setTheme, isPaid, powers
  } = useGameStore();

  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isPaid && theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isPaid]);

  const handleLoveClick = () => {
    playSound.loveTap();
    if (!isPaid && loveCount >= 3) {
      setPaywallOpen(true);
      return;
    }
    incrementLove();
  };

  const toggleTheme = () => {
    playSound.tap();
    if (!isPaid) {
      setPaywallOpen(true);
      return;
    }
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    // Apply immediately to DOM without waiting for the effect
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleMuteToggle = () => {
    toggleMute();
    playSound.tap();
  };

  const effectiveTheme = isPaid ? theme : 'light';
  const isDark = effectiveTheme === 'dark';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <Tooltip label="MathStreak Home" direction="below">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => playSound.tap()}>
            <div className="group-hover:scale-105 transition-transform duration-200">
              <BrainMathLogo />
            </div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              MathStreak
            </span>
          </Link>
        </Tooltip>

        <div className="flex items-center gap-1.5 sm:gap-2">

          <Tooltip label={isPaid ? 'Pro Member - All features unlocked' : 'Free User - Upgrade for unlimited access'} direction="below">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
              isPaid
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}>
              {isPaid
                ? <><Crown size={11} className="fill-white" /><span>PRO</span></>
                : <><UserRound size={11} /><span>FREE</span></>
              }
            </div>
          </Tooltip>

          <Tooltip label={isPaid ? 'Unlimited Powers - Play as much as you want!' : `${powers} powers left today (resets daily)`} direction="below">
            <div
              onClick={() => !isPaid && setPaywallOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer transition-colors ${
                isPaid
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200'
              }`}
            >
              <BatteryCharging size={15} className={isPaid ? 'animate-pulse' : ''} />
              <span className="font-bold text-xs">{isPaid ? '\u221E' : powers}</span>
            </div>
          </Tooltip>

          <Tooltip label={`${streak}-day streak! Keep it going!`} direction="below">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <Zap size={15} className="fill-current" />
              <span className="font-bold text-xs">{streak}</span>
            </div>
          </Tooltip>

          <Tooltip label={`${points} total points earned`} direction="below">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <Award size={15} className="fill-current" />
              <span className="font-bold text-xs">{points}</span>
            </div>
          </Tooltip>

          <Tooltip label={isPaid ? 'Unlimited hearts!' : `${loveCount}/3 loves used (Upgrade for unlimited)`} direction="below">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleLoveClick}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={loveCount}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart size={15} className="fill-current" />
                </motion.div>
              </AnimatePresence>
              <span className="font-bold text-xs">{loveCount}</span>
            </motion.button>
          </Tooltip>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <Tooltip label={!isPaid ? 'Dark mode is PRO - Upgrade to unlock' : isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} direction="below">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors relative ${
                !isPaid
                  ? 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
              {!isPaid && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
                  <Crown size={7} className="text-white fill-white" />
                </span>
              )}
            </button>
          </Tooltip>

          <Tooltip label={isMuted ? 'Unmute sounds' : 'Mute sounds'} direction="below">
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </Tooltip>
        </div>
      </div>

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        level="easy"
        levelName="Full Version"
      />
    </header>
  );
};

export default Header;
