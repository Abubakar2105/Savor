import { useState, useEffect } from 'react';
import { ScopedStorage } from '../storage';

export function useRecipes({ limit } = {}) {
  const [data, setData] = useState({ recipes: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!limit) return;
      setLoading(true);
      setError(null);

      const CACHE_STORAGE_KEY = `recipes_cache_${limit}`;

      try {
        const localCachedData = await ScopedStorage.getItem(CACHE_STORAGE_KEY);
        if (localCachedData) {
          setData(localCachedData);
          setLoading(false);
          return;
        }
        const params = new URLSearchParams({ limit: limit.toString() });
        const response = await fetch(`https://dummyjson.com/recipes?${params.toString()}`);
        if (!response.ok) throw new Error(`Status error: ${response.status}`);
        
        const json = await response.json();
        await ScopedStorage.setItem(CACHE_STORAGE_KEY, json);
        setData(json);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [limit]);

  return { recipes: data.recipes, total: data.total, loading, error };
}