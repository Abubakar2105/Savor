import { useState, useEffect } from 'react';
import { ScopedStorage } from '../storage';

export function useRecipeDetails(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);

      const RECIPE_CACHE_KEY = `recipe_id_${id}`;

      try {
        const cachedRecipe = await ScopedStorage.getItem(RECIPE_CACHE_KEY);
        if (cachedRecipe) {
          setRecipe(cachedRecipe);
          setLoading(false);
          return;
        }

        const response = await fetch(`https://dummyjson.com/recipes/${id}`);
        if (!response.ok) throw new Error('Failed to fetch details');
        
        const json = await response.json();
        await ScopedStorage.setItem(RECIPE_CACHE_KEY, json);
        setRecipe(json);
      } catch (err) {
        setError(err.message || 'Could not load recipe details');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  return { recipe, loading, error };
}