// Define frequencies for synthesized sounds to keep bundle size small and responsive without assets
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;
let isMuted = false;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const toggleMute = (muted: boolean) => {
  isMuted = muted;
};

const playTone = (frequency: number, type: OscillatorType, duration: number, volume = 0.1) => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playSound = {
  correct: () => {
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
  },
  incorrect: () => {
    playTone(220, 'triangle', 0.3, 0.1); // A3
    setTimeout(() => playTone(207.65, 'triangle', 0.4, 0.1), 150); // G#3
  },
  levelComplete: () => {
    playTone(523.25, 'sine', 0.2, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 200); // G5
    setTimeout(() => playTone(1046.50, 'sine', 0.4, 0.1), 300); // C6
  },
  tap: () => {
    playTone(800, 'sine', 0.05, 0.05);
  },
  loveTap: () => {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }
};