import { useState, useEffect } from 'react';
import { ScopedStorage } from '../storage';

export function useAsyncStorage(key, initialValue = null) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedValue = await ScopedStorage.getItem(key);
        if (storedValue !== null) {
          setData(storedValue);
        }
      } catch (err) {
        console.error('Error reading storage key:', key, err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, [key]);

  const updateValue = async (newValue) => {
    try {
      setData(newValue);
      await ScopedStorage.setItem(key, newValue);
    } catch (err) {
      console.error('Error writing storage key:', key, err);
    }
  };

  return [data, updateValue, loading];
}