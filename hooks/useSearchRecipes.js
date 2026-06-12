import { useState, useEffect } from 'react';

export function useSearchRecipes(query) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchQueryKey = query?.trim() || '';

  useEffect(() => {
    if (!searchQueryKey) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const fetchSearchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://dummyjson.com/recipes/search?q=${encodeURIComponent(searchQueryKey)}`
        );
        if (!response.ok) {
          throw new Error('Search failed to execute request');
        }
        const json = await response.json();
        setRecipes(json.recipes);
      } catch (err) {
        setError(err.message || 'Error executing item search');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchRecipes();
  }, [searchQueryKey]);

  return { recipes, loading, error };
}