import { useState, useEffect } from 'react';

export function useRecipesByTag(tag) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanTag = tag?.trim() || '';

  useEffect(() => {
    if (!cleanTag) return;

    const fetchRecipesByTag = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://dummyjson.com/recipes/tag/${encodeURIComponent(cleanTag)}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes for tag: ${cleanTag}`);
        }
        const json = await response.json();
        setRecipes(json.recipes || []);
      } catch (err) {
        setError(err.message || 'Error executing tag request');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesByTag();
  }, [cleanTag]);

  return { recipes, loading, error };
}