import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'dopaquest-storage',
});

// Keys for persistence
export const STORAGE_KEYS = {
  WALLET: 'user_wallet',
  TASKS: 'user_tasks',
  SETTINGS: 'user_settings',
};
