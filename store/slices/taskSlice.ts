import { StateCreator } from 'zustand';
import { DEFAULT_GLOBAL_DIFFICULTY, DIFFICULTY_REWARDS, GLOBAL_MULTIPLIERS } from '../../constants/GameRules';
import { Task, TaskDifficulty } from '../../types/task';
import { WalletSlice } from './walletSlice';

interface TaskState {
  tasks: Task[];
  lastOpenDate: string | null;
}

interface TaskActions {
  addTask: (title: string, difficulty: TaskDifficulty, schedule: number[]) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  checkDailyReset: () => void;
}

export type TaskSlice = TaskState & TaskActions;

// Helper to calculate reward
const calculateReward = (difficulty: TaskDifficulty): number => {
  const base = DIFFICULTY_REWARDS[difficulty];
  const multiplier = GLOBAL_MULTIPLIERS[DEFAULT_GLOBAL_DIFFICULTY];
  return Math.round(base * multiplier);
};

export const createTaskSlice: StateCreator<
  TaskSlice & WalletSlice,
  [],
  [],
  TaskSlice
> = (set, get) => ({
  tasks: [],
  lastOpenDate: null,
  addTask: (title, difficulty, schedule) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(), // Simple ID generation for MVP
          title,
          difficulty,
          completed: false,
          type: 'manual',
          schedule,
          createdAt: Date.now(),
        },
      ],
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  toggleTask: (id) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);

    if (!task) return;

    const isCompleting = !task.completed;
    const reward = calculateReward(task.difficulty);

    // Update Task State
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: isCompleting } : t
      ),
    }));

    // Update Wallet
    if (isCompleting) {
      get().addTime(reward);
    } else {
      get().consumeTime(reward); 
    }
  },
  checkDailyReset: () => {
    const { lastOpenDate, tasks } = get();
    const today = new Date().toISOString().split('T')[0];

    if (lastOpenDate !== today) {
      set((state) => ({
        lastOpenDate: today,
        tasks: state.tasks.map((t) => ({ ...t, completed: false })),
      }));
    }
  },
});
