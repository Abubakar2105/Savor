import { useState, useEffect } from 'react';
import { useAsyncStorage } from './useAsyncStorage';

export function useBookmarks() {
 
  const [storedIds, setStoredIds, loading] = useAsyncStorage('@user_bookmarked_recipes', []);
  
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    if (!loading && storedIds) {
      setBookmarkedIds(storedIds);
    }
  }, [storedIds, loading]);

  const toggleBookmark = async (id) => {
    const nextIds = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id]; 

    setBookmarkedIds(nextIds);

    try {
      await setStoredIds(nextIds);
    } catch (error) {
      console.error("Failed to sync bookmarked recipe ID to ScopedStorage:", error);
     
      setBookmarkedIds(bookmarkedIds);
    }
  };

  return {
    bookmarkedIds,
    isBookmarked: (id) => bookmarkedIds.includes(id),
    toggleBookmark,
    loading
  };
}