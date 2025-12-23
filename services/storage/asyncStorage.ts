import AsyncStorage from '@react-native-async-storage/async-storage';

// Compatible API with the previous MMKV implementation (as much as possible)
// But purely async as required by AsyncStorage

export const storage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Failed to fetch from storage', e);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove from storage', e);
    }
  },
};

// Keys for persistence
export const STORAGE_KEYS = {
  WALLET: 'user_wallet',
  TASKS: 'user_tasks',
  SETTINGS: 'user_settings',
};
