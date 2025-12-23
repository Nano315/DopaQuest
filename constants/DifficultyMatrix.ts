export const BASE_VALUES = {
  EASY: 15, // minutes
  MEDIUM: 30, // minutes
  HARD: 60, // minutes
};

export const DIFFICULTY_MULTIPLIERS = {
  EASY: 1.0, // Mode Cool
  MEDIUM: 0.5, // Mode Équilibré
  HARD: 0.25, // Mode Hardcore
};

export type TaskDifficulty = keyof typeof BASE_VALUES;
export type GlobalDifficulty = keyof typeof DIFFICULTY_MULTIPLIERS;

export const calculateReward = (
  taskDiff: TaskDifficulty,
  globalDiff: GlobalDifficulty
): number => {
  const base = BASE_VALUES[taskDiff];
  const multiplier = DIFFICULTY_MULTIPLIERS[globalDiff];
  return Math.floor(base * multiplier);
};

export const DIFFICULTY_LOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
