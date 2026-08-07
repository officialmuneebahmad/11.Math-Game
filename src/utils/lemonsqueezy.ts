import { type Level } from '../store/useGameStore';

const POLAR_CHECKOUT_URL = 'https://buy.polar.sh/polar_cl_LFcFealIdDsd9JyHrHgaeGr4wkEOsXeIime1c23Zwpi';

export const useLemonSqueezy = () => {

  const initiateCheckout = (_level: Level, _isBundle: boolean = false) => {
    window.open(POLAR_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  return { initiateCheckout };
};