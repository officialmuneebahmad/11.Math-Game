import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Level = 'easy' | 'medium' | 'hard';
export type Badge = 'bronze' | 'silver' | 'gold' | null;
export type GameMode = 'timed' | 'untimed';

interface LevelProgress {
  questionsAnswered: number; // Max 100
  questionsCorrect: number;
  unlocked: boolean;
  badge: Badge;
}

interface GameState {
  points: number;
  streak: number;
  lastPlayedDate: string | null;
  loveCount: number;
  invites: number;

  levels: Record<Level, LevelProgress>;

  isMuted: boolean;
  theme: 'light' | 'dark' | 'system';
  gameMode: GameMode;
  activatedKeys: string[];
  isPaid: boolean;
  powers: number;
  customTimeLimit: number; // in seconds

  addPoints: (points: number) => void;
  incrementLove: () => void;
  incrementInvites: () => void;
  updateStreak: () => void;
  updateLevelProgress: (level: Level, isCorrect: boolean) => void;
  unlockLevel: (level: Level) => void;
  toggleMute: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setGameMode: (mode: GameMode) => void;
  resetProgress: () => void;
  activateLicenseKey: (key: string) => { success: boolean; message: string };
  usePower: () => boolean;
  setCustomTimeLimit: (seconds: number) => void;
  deactivateLicense: () => void;
  resetStreak: () => void;
  resetPoints: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 0,
      streak: 0,
      lastPlayedDate: null,
      loveCount: 0,
      invites: 0,
      activatedKeys: [],
      isPaid: false,
      powers: 5,
      customTimeLimit: 300,
      levels: {
        easy: { questionsAnswered: 0, questionsCorrect: 0, unlocked: true, badge: null },
        medium: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
        hard: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
      },
      isMuted: false,
      theme: 'light',
      gameMode: 'timed',

      addPoints: (points) => set((state) => ({ points: state.points + points })),

      incrementLove: () => set((state) => {
        if (!state.isPaid && state.loveCount >= 3) {
          return {};
        }
        return { loveCount: state.loveCount + 1 };
      }),

      incrementInvites: () => set((state) => {
        const currentPoints = state.points;
        return { invites: state.invites + 1, points: currentPoints + 100 };
      }),

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastPlayedDate, streak, activatedKeys } = get();

        // Self-heal: If keys are active, make sure isPaid is synced to true
        if (activatedKeys.length > 0) {
          set({ isPaid: true });
        }

        if (lastPlayedDate !== today) {
          set({ powers: 5 });
        }

        if (lastPlayedDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPlayedDate === yesterday.toDateString()) {
          set({ streak: streak + 1, lastPlayedDate: today });
        } else {
          set({ streak: 1, lastPlayedDate: today });
        }
      },

      updateLevelProgress: (level, isCorrect) => set((state) => {
        const lvl = state.levels[level];
        const newAnswered = lvl.questionsAnswered + 1;
        const newCorrect = isCorrect ? lvl.questionsCorrect + 1 : lvl.questionsCorrect;

        let newBadge = lvl.badge;
        if (newAnswered === 50 || newAnswered === 100) {
           const accuracy = newCorrect / newAnswered;
           if (accuracy >= 0.9) newBadge = 'gold';
           else if (accuracy >= 0.8) newBadge = 'silver';
           else if (accuracy >= 0.7) newBadge = 'bronze';
        }

        return {
          levels: {
            ...state.levels,
            [level]: {
              ...lvl,
              questionsAnswered: newAnswered,
              questionsCorrect: newCorrect,
              badge: newBadge
            }
          }
        };
      }),

      unlockLevel: (level) => set((state) => ({
        levels: {
          ...state.levels,
          [level]: { ...state.levels[level], unlocked: true }
        }
      })),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setTheme: (theme) => set({ theme }),

      setGameMode: (gameMode) => set({ gameMode }),

      resetProgress: () => set({
        points: 0, streak: 0, lastPlayedDate: null, invites: 0, activatedKeys: [], isPaid: false, powers: 5, customTimeLimit: 300,
        levels: {
          easy: { questionsAnswered: 0, questionsCorrect: 0, unlocked: true, badge: null },
          medium: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
          hard: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
        }
      }),

      usePower: () => {
        const { isPaid, powers } = get();
        if (isPaid) return true;
        if (powers <= 0) return false;
        set((state) => ({ powers: state.powers - 1 }));
        return true;
      },

      setCustomTimeLimit: (customTimeLimit) => set({ customTimeLimit }),

      deactivateLicense: () => set({ isPaid: false, activatedKeys: [] }),

      resetStreak: () => set({ streak: 0, lastPlayedDate: null }),

      resetPoints: () => set((state) => ({
        points: 0,
        levels: {
          easy:   { ...state.levels.easy,   questionsAnswered: 0, questionsCorrect: 0, badge: null },
          medium: { ...state.levels.medium, questionsAnswered: 0, questionsCorrect: 0, badge: null },
          hard:   { ...state.levels.hard,   questionsAnswered: 0, questionsCorrect: 0, badge: null },
        }
      })),

      activateLicenseKey: (key: string) => {
        const trimmedKey = key.trim().toUpperCase();
        const { activatedKeys } = get();

        if (activatedKeys.includes(trimmedKey)) {
          return { success: false, message: 'This key has already been activated!' };
        }

        let unlockedLevels: ('easy' | 'medium' | 'hard')[] = [];
        let message = '';

        if (/^MS-WUP-[A-Z0-9]{4,}$/.test(trimmedKey) || trimmedKey === 'MS-WUP-TEST') {
          unlockedLevels = ['easy'];
          message = 'Warm Up Level unlocked successfully!';
        } else if (/^MS-FLP-[A-Z0-9]{4,}$/.test(trimmedKey) || trimmedKey === 'MS-FLP-TEST') {
          unlockedLevels = ['medium'];
          message = 'Fluency Level unlocked successfully!';
        } else if (/^MS-ADP-[A-Z0-9]{4,}$/.test(trimmedKey) || trimmedKey === 'MS-ADP-TEST') {
          unlockedLevels = ['hard'];
          message = 'Advanced Level unlocked successfully!';
        } else if (/^MS-ALL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(trimmedKey) || trimmedKey === 'MS-ALL-TEST' || trimmedKey === 'MS-ALL-POLAR') {
          unlockedLevels = ['easy', 'medium', 'hard'];
          message = 'All Levels Bundle unlocked successfully! You are now a Pro!';
        } else {
          return { success: false, message: 'Invalid License Key format. Please check and try again.' };
        }

        set((state) => {
          const nextLevels = { ...state.levels };
          unlockedLevels.forEach((lvl) => {
            nextLevels[lvl] = { ...nextLevels[lvl], unlocked: true };
          });
          return {
            levels: nextLevels,
            activatedKeys: [...state.activatedKeys, trimmedKey],
            isPaid: true
          };
        });

        return { success: true, message };
      }
    }),
    {
      name: 'mathstreak-storage',
    }
  )
);