import AsyncStorage from '@react-native-async-storage/async-storage';

const getScopedKey = async (key) => {
  if (key === 'user_session') {
    return 'user_session';
  }

  try {
    const session = await AsyncStorage.getItem('user_session');
    if (session) {
      const user = JSON.parse(session);
      return `${user.email}:${key}`;
    }
  } catch (e) {
    console.error('Error reading session for key scoping:', e);
  }
  return `guest:${key}`; 
};

export const ScopedStorage = {
  async getItem(key) {
    const scopedKey = await getScopedKey(key);
    const value = await AsyncStorage.getItem(scopedKey);
    return value ? JSON.parse(value) : null;
  },

  async setItem(key, value) {
    const scopedKey = await getScopedKey(key);
    await AsyncStorage.setItem(scopedKey, JSON.stringify(value));
  },

  async removeItem(key) {
    const scopedKey = await getScopedKey(key);
    await AsyncStorage.removeItem(scopedKey);
  }
};