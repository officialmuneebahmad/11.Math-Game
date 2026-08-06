import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Lock, CheckCircle2, Key, Check, AlertCircle } from 'lucide-react';
import { useLemonSqueezy } from '../utils/lemonsqueezy';
import { useGameStore, type Level } from '../store/useGameStore';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: Level;
  levelName: string;
}

const PaywallModal = ({ isOpen, onClose, level, levelName }: PaywallModalProps) => {
  const { initiateCheckout } = useLemonSqueezy();
  const activateLicenseKey = useGameStore((state) => state.activateLicenseKey);

  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    playSound.tap();
    const result = activateLicenseKey(licenseKey);
    setStatusMsg(result.message);
    setIsError(!result.success);

    if (result.success) {
      playSound.correct();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onClose();
        setLicenseKey('');
        setStatusMsg('');
        setShowLicenseInput(false);
      }, 2000);
    } else {
      playSound.incorrect();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/30 hover:bg-slate-900/50 text-white transition-colors z-[110]"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Unlock Full Version For Lifetime</h2>
          <p className="text-indigo-100 text-sm">
            Unlock the full potential of MathStreak training, with unlimited plays and custom game modes.
          </p>
        </div>

        <div className="p-6">
          <ul className="space-y-3 mb-8">
            {[
              'Access all levels and game modes forever',
              'Advanced analytics and performance tracking',
              'Support independent development',
              'No recurring fees, yours forever'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <button
              onClick={() => {
                initiateCheckout(level, true);
                onClose();
              }}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-transform active:scale-[0.98]"
            >
              Unlock All Levels - $0.99
            </button>

            <div className="pt-2">
              {!showLicenseInput ? (
                <button
                  onClick={() => {
                    playSound.tap();
                    setShowLicenseInput(true);
                  }}
                  className="w-full py-2.5 px-4 border border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Key size={16} />
                  <span>Have a License Key?</span>
                </button>
              ) : (
                <form onSubmit={handleActivate} className="space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MS-ALL-XXXX"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="flex-grow px-3 py-2 border rounded-xl outline-none focus:border-indigo-500 text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
                    >
                      Activate
                    </button>
                  </div>
                  {statusMsg && (
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isError ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {isError ? <AlertCircle size={14} /> : <Check size={14} />}
                      <span>{statusMsg}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Secure payment powered by Polar.sh.
          </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default PaywallModal;