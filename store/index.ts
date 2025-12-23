import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createTaskSlice, TaskSlice } from './slices/taskSlice';
import { createWalletSlice, WalletSlice } from './slices/walletSlice';

interface StoreState extends WalletSlice, TaskSlice {
  // Add other slices here (Settings)
}

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createWalletSlice(...a),
      ...createTaskSlice(...a),
      // ...createSettingsSlice(...a),
    }),
    {
      name: 'dopaquest-global-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
