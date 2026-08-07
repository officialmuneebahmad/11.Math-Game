import { useState } from 'react';
import { X, AlertTriangle, Crown, Zap, Award } from 'lucide-react';
import { playSound } from '../utils/audio';
import { useGameStore } from '../store/useGameStore';

const Footer = () => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'account' | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const { isPaid, activatedKeys, streak, points, deactivateLicense, resetStreak, resetPoints } = useGameStore();

  const handleOpenModal = (modal: 'terms' | 'privacy' | 'account') => {
    playSound.tap();
    setActiveModal(modal);
    setConfirmAction(null);
  };

  const closeModal = () => {
    playSound.tap();
    setActiveModal(null);
    setConfirmAction(null);
  };

  const handleConfirm = (action: string) => {
    playSound.tap();
    if (action === 'deactivate') {
      deactivateLicense();
    } else if (action === 'streak') {
      resetStreak();
    } else if (action === 'points') {
      resetPoints();
    }
    setConfirmAction(null);
  };

  return (
    <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
          Made with 💓 from{' '}
          <span className="text-base" title="Pakistan">🇵🇰</span>
          {' '}for 🌎
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap justify-center">
          <a href="https://github.com/officialmuneebahmad" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
            Developer
          </a>
          <button onClick={() => handleOpenModal('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium cursor-pointer">
            Terms
          </button>
          <button onClick={() => handleOpenModal('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium cursor-pointer">
            Privacy
          </button>
          <button
            onClick={() => handleOpenModal('account')}
            className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-semibold cursor-pointer"
          >
            Account
          </button>
        </div>
      </div>

      {/* Copyright + GitHub CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
        <span>© 2026 MathStreak. Do not copy, only use for reference.</span>
        <span className="flex items-center gap-3">
          <a
            href="https://github.com/officialmuneebahmad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors font-semibold"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            Follow me on GitHub
          </a>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <a
            href="https://github.com/officialmuneebahmad/11.Math-Game"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-semibold"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            Star this project
          </a>
        </span>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>

            {activeModal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Terms of Service</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <p>Welcome to MathStreak. By playing our game, you agree to these simple terms.</p>
                  <p><strong>1. License &amp; Access:</strong> Free users get access to up to 50 daily questions and 5 plays daily. Premium lifetime unlocks are personal and non-transferable.</p>
                  <p><strong>2. Fair Play:</strong> MathStreak is a tool for mental agility. Attempts to reverse engineer or automate gameplay are discouraged.</p>
                  <p><strong>3. Disclaimer:</strong> The service is provided "as is". We aim to maintain streaks and progress, but are not responsible for any local data loss.</p>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <p>Your privacy is important to us. Here is how we handle your data:</p>
                  <p><strong>1. Local Storage:</strong> All game scores, streaks, level progression, and license status are stored completely locally on your device. We do not send your gameplay data to any external server.</p>
                  <p><strong>2. Payments:</strong> Any payments are securely handled by Polar.sh. We do not store or process your credit card information.</p>
                  <p><strong>3. Analytics:</strong> We do not track you or use third-party tracking scripts. MathStreak is built to be clean and focus-oriented.</p>
                </div>
              </div>
            )}

            {activeModal === 'account' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">My Account</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Manage your MathStreak account settings</p>

                {/* Account Status Card */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl mb-5 ${isPaid ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaid ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <Crown size={20} className={isPaid ? 'text-amber-600 fill-amber-500' : 'text-slate-400'} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${isPaid ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {isPaid ? 'PRO Member' : 'Free User'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isPaid ? `${activatedKeys.length} license key(s) active` : 'No active license'}
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1 text-orange-500"><Zap size={12} className="fill-current" />{streak}d</div>
                    <div className="flex items-center gap-1 text-yellow-500"><Award size={12} className="fill-current" />{points}pts</div>
                  </div>
                </div>

                {/* Inline confirm banner */}
                {confirmAction && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      {confirmAction === 'deactivate' ? 'Remove PRO access and all license keys?' : ''}
                      {confirmAction === 'streak' ? 'Reset your streak to 0?' : ''}
                      {confirmAction === 'points' ? 'Clear all your points, played questions & accuracy?' : ''}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirm(confirmAction)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                      >
                        Yes, do it
                      </button>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="border border-red-200 dark:border-red-900/50 rounded-2xl overflow-hidden">
                  <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2.5 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Danger Zone</span>
                  </div>
                  <div className="divide-y divide-red-100 dark:divide-red-900/30">

                    <div className="flex items-center justify-between px-4 py-3 gap-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Deactivate License</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Remove PRO access and license keys</div>
                      </div>
                      <button
                        onClick={() => { playSound.tap(); setConfirmAction('deactivate'); }}
                        disabled={!isPaid}
                        className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Deactivate
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 gap-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Reset Streak</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Set your daily streak back to zero</div>
                      </div>
                      <button
                        onClick={() => { playSound.tap(); setConfirmAction('streak'); }}
                        className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Reset Streak
                      </button>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 gap-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">Reset Points</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Clears points, played questions & accuracy %</div>
                      </div>
                      <button
                        onClick={() => { playSound.tap(); setConfirmAction('points'); }}
                        className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Reset Points
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
