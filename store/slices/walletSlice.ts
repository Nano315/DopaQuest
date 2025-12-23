import { StateCreator } from 'zustand';

export interface WalletSlice {
  balance: number; // in minutes
  addTime: (minutes: number) => void;
  consumeTime: (minutes: number) => boolean;
}

export const createWalletSlice: StateCreator<WalletSlice> = (set) => ({
  balance: 0,
  addTime: (minutes) =>
    set((state) => ({ balance: state.balance + minutes })),
  consumeTime: (minutes) => {
    let success = false;
    set((state) => {
      if (state.balance >= minutes) {
        success = true;
        return { balance: state.balance - minutes };
      }
      return state;
    });
    return success;
  },
});
