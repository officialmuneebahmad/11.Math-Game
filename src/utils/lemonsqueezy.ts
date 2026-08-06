import { useGameStore, type Level } from '../store/useGameStore';

export const useLemonSqueezy = () => {

  const unlockLevel = useGameStore((state) => state.unlockLevel);

  const initiateCheckout = (level: Level, isBundle: boolean = false) => {
    setTimeout(() => {
      alert(`Polar.sh: Simulation checkout for ${isBundle ? 'All Levels' : level} successful! A mock license key has been generated.`);
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