import { useState, useEffect } from 'react';

export function useRecipesByMealType(mealType) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanMealType = mealType?.trim() || '';

  useEffect(() => {
    if (!cleanMealType) return;

    const fetchRecipesByMealType = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://dummyjson.com/recipes/meal-type/${encodeURIComponent(cleanMealType)}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes for meal type: ${cleanMealType}`);
        }
        const json = await response.json();
        setRecipes(json.recipes || []);
      } catch (err) {
        setError(err.message || 'Error executing meal type request');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesByMealType();
  }, [cleanMealType]);

  return { recipes, loading, error };
}