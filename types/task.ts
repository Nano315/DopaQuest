export type TaskType = 'manual' | 'pedometer';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  difficulty: TaskDifficulty;
  completed: boolean;
  type: TaskType;
  schedule?: string[]; // Days of the week, optional for now
  createdAt: number;
}
