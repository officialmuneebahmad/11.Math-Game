import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Lock, Medal, UserPlus, FileText } from 'lucide-react';
import { useGameStore, type Level } from '../store/useGameStore';
import PaywallModal from '../components/PaywallModal';
import { playSound } from '../utils/audio';

const Home = () => {
  const navigate = useNavigate();
  const { levels, updateStreak, gameMode, setGameMode, incrementInvites } = useGameStore();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState<Level>('easy');
  const [selectedLevelName, setSelectedLevelName] = useState('');

  // Check and update streak on load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const handlePlayClick = (level: Level, title: string) => {
    playSound.tap();
    const lvl = levels[level];

    // Check if locked and they hit the free limit
    if (!lvl.unlocked && lvl.questionsAnswered >= 50) {
      setSelectedLevelId(level);
      setSelectedLevelName(title);
      setPaywallOpen(true);
      return;
    }

    navigate(`/game/${level}`);
  };

  const handleInvite = async () => {
    playSound.tap();
    const inviteLink = `${window.location.origin}/?ref=friend`;
    const text = `Join me on MathStreak and train your brain 5 minutes a day! ${inviteLink}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join MathStreak',
          text: text,
          url: inviteLink,
        });
        incrementInvites();
      } else {
        await navigator.clipboard.writeText(text);
        alert('Invite link copied to clipboard!');
        incrementInvites();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const levelConfigs: { id: Level; title: string; desc: string; color: string; iconColor: string }[] = [
    {
      id: 'easy',
      title: 'Warm Up',
      desc: '+, -, ×, ÷ (1–20)',
      color: 'from-emerald-400 to-teal-500',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'medium',
      title: 'Fluency',
      desc: 'Larger numbers, Remainders, %',
      color: 'from-blue-400 to-indigo-500',
      iconColor: 'text-blue-500'
    },
    {
      id: 'hard',
      title: 'Advanced',
      desc: 'Squares, Cubes, Mixed Fractions',
      color: 'from-rose-400 to-pink-500',
      iconColor: 'text-rose-500'
    },
  ];

  const getBadgeColor = (badge: string | null) => {
    if (badge === 'gold') return 'text-yellow-500';
    if (badge === 'silver') return 'text-slate-400';
    if (badge === 'bronze') return 'text-amber-700 dark:text-amber-600';
    return 'text-slate-200 dark:text-slate-700';
  };

  return (
    <div className="flex-grow flex flex-col justify-center py-8">

      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white"
        >
          Train Your Brain.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
            5 Minutes a Day.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Build mental agility with daily math challenges. No ads, just pure focus.
        </motion.p>

        <div className="flex justify-center items-center gap-4 mt-8">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setGameMode('timed')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${gameMode === 'timed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Timed (5 Min)
              </button>
              <button
                onClick={() => setGameMode('untimed')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${gameMode === 'untimed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Untimed Practice
              </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full mb-12">
        {levelConfigs.map((config, index) => {
          const stats = levels[config.id];
          const isSoftLocked = !stats.unlocked && stats.questionsAnswered >= 50;
          const progressPercent = (stats.questionsAnswered / (stats.unlocked ? 100 : 50)) * 100;

          return (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-700">
                <div
                  className={`h-full bg-gradient-to-r ${config.color} transition-all duration-500`}
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-start mb-6 mt-2">
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white capitalize">{config.id}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{config.title}</p>
                </div>
                <Medal size={28} className={getBadgeColor(stats.badge)} />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                {config.desc}
              </p>

              <div className="flex items-center justify-between mb-6 text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">
                  {stats.questionsAnswered} / {stats.unlocked ? 100 : 50} played
                </span>
                <span className={stats.questionsCorrect > 0 ? 'text-emerald-500' : 'text-slate-400'}>
                  {stats.questionsAnswered > 0 ? Math.round((stats.questionsCorrect / stats.questionsAnswered) * 100) : 0}% acc
                </span>
              </div>

              <button
                onClick={() => handlePlayClick(config.id, config.title)}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                  isSoftLocked
                    ? 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-slate-300 dark:shadow-none'
                    : `bg-gradient-to-r ${config.color} hover:opacity-90 shadow-indigo-200 dark:shadow-none`
                }`}
              >
                {isSoftLocked ? (
                  <>
                    <Lock size={20} />
                    <span>Unlock More</span>
                  </>
                ) : (
                  <>
                    <Play size={20} fill="currentColor" />
                    <span>Play Now</span>
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row gap-4 px-4 sm:px-0">
         <button
           onClick={handleInvite}
           className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 hover:border-indigo-300 transition-colors group"
         >
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
              <UserPlus size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 dark:text-white">Invite a Friend</div>
              <div className="text-xs text-slate-500">Earn 100 bonus points</div>
            </div>
         </button>

         <div className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <FileText size={18} className="text-slate-400" /> SEO & GEO Optimized
            </h3>
            <p className="text-xs text-slate-500">
              MathStreak includes valid JSON-LD FAQ schema, semantic HTML, and is structured for AI Answer Engines.
            </p>
         </div>
      </div>

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        level={selectedLevelId}
        levelName={selectedLevelName}
      />
    </div>
  );
};

export default Home;