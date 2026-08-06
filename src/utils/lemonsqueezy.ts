import { useEffect } from 'react';
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { useGameStore, type Level } from '../store/useGameStore';

export const useLemonSqueezy = () => {
  useEffect(() => {
    lemonSqueezySetup({
      apiKey: 'MOCK_API_KEY_FOR_DEV',
      onError: (error) => console.error('Lemon Squeezy error', error),
    });
  }, []);

  const unlockLevel = useGameStore((state) => state.unlockLevel);

  const initiateCheckout = (level: Level, isBundle: boolean = false) => {
    setTimeout(() => {
      alert(`Simulation: Payment for ${isBundle ? 'All Levels' : level} successful! Level unlocked.`);
      if (isBundle) {
        unlockLevel('easy');
        unlockLevel('medium');
        unlockLevel('hard');
      } else {
        unlockLevel(level);
      }
    }, 1500);
  };

  return { initiateCheckout };
};