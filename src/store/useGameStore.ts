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
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 0,
      streak: 0,
      lastPlayedDate: null,
      loveCount: 0,
      invites: 0,
      levels: {
        easy: { questionsAnswered: 0, questionsCorrect: 0, unlocked: true, badge: null },
        medium: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
        hard: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
      },
      isMuted: false,
      theme: 'system',
      gameMode: 'timed',

      addPoints: (points) => set((state) => ({ points: state.points + points })),

      incrementLove: () => set((state) => ({ loveCount: state.loveCount + 1 })),

      incrementInvites: () => set((state) => {
        const currentPoints = state.points;
        return { invites: state.invites + 1, points: currentPoints + 100 };
      }),

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastPlayedDate, streak } = get();

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
        points: 0, streak: 0, lastPlayedDate: null, invites: 0,
        levels: {
          easy: { questionsAnswered: 0, questionsCorrect: 0, unlocked: true, badge: null },
          medium: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
          hard: { questionsAnswered: 0, questionsCorrect: 0, unlocked: false, badge: null },
        }
      })
    }),
    {
      name: 'mathstreak-storage',
    }
  )
);