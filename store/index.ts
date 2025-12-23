import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '../services/storage/mmkv';
import { createWalletSlice, WalletSlice } from './slices/walletSlice';

// Adapter for MMKV to work with Zustand persist (sync)
const mmkvZustandStorage = {
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

interface StoreState extends WalletSlice {
  // Add other slices here (Tasks, Settings)
}

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createWalletSlice(...a),
      // ...createTaskSlice(...a),
      // ...createSettingsSlice(...a),
    }),
    {
      name: 'dopaquest-global-store',
      storage: createJSONStorage(() => mmkvZustandStorage),
    }
  )
);
