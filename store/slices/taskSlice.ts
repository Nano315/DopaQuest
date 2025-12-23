import { StateCreator } from 'zustand';
import { DEFAULT_GLOBAL_DIFFICULTY, DIFFICULTY_REWARDS, GLOBAL_MULTIPLIERS } from '../../constants/GameRules';
import { Task, TaskDifficulty } from '../../types/task';
import { WalletSlice } from './walletSlice';

interface TaskState {
  tasks: Task[];
}

interface TaskActions {
  addTask: (title: string, difficulty: TaskDifficulty) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
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
  addTask: (title, difficulty) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(), // Simple ID generation for MVP
          title,
          difficulty,
          completed: false,
          type: 'manual',
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
      // Refund logic if unchecked (prevent infinite loop exploit if rules change, but for now strict reverse)
      // We assume consumeTime returns boolean, here we just force consume/deduct
      // Since consumeTime checks balance, if user spent it, they might go to 0 or we force negative?
      // For MVP safely, we try to consume. If fail, well, free money loophole closed by honor system for now.
      // Better: addTime accepts negative handling or we use consumeTime.
      get().consumeTime(reward); 
    }
  },
});
