import { motion } from 'framer-motion';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import { useLemonSqueezy } from '../utils/lemonsqueezy';
import { type Level } from '../store/useGameStore';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: Level;
  levelName: string;
}

const PaywallModal = ({ isOpen, onClose, level, levelName }: PaywallModalProps) => {
  const { initiateCheckout } = useLemonSqueezy();

  if (!isOpen) return null;

  return (
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
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Unlock {levelName} Pro</h2>
          <p className="text-indigo-100 text-sm">
            You've completed the 50 free daily questions! Unlock the remaining questions to continue your streak.
          </p>
        </div>

        <div className="p-6">
          <ul className="space-y-3 mb-8">
            {[
              'Access 50 more unique questions today',
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
                initiateCheckout(level, false);
                onClose();
              }}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-transform active:scale-[0.98]"
            >
              Unlock {levelName} - $4.99
            </button>
            <button
              onClick={() => {
                initiateCheckout(level, true);
                onClose();
              }}
              className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition-transform active:scale-[0.98]"
            >
              Unlock All Levels - $9.99
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Secure payment powered by Lemon Squeezy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaywallModal;