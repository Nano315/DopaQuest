import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createWalletSlice, WalletSlice } from './slices/walletSlice';

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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
