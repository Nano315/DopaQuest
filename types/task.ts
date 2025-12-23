export type TaskType = 'manual' | 'pedometer';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  difficulty: TaskDifficulty;
  completed: boolean;
  type: TaskType;
  schedule?: number[]; // Days of the week (0=Sunday, 1=Monday...)
  createdAt: number;
}
