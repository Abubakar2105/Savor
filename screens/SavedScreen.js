import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from "../components/SearchBar"
import BottomNav from '../components/BottomNav';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import { useBookmarks } from '../hooks/useBookmarks';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

export default function SavedScreen({ navigation }) {
  const { bookmarkedIds, isBookmarked, toggleBookmark } = useBookmarks();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criticalError, setCriticalError] = useState(false);
  
  const fetchSavedRecipes = async () => {
    if (bookmarkedIds.length === 0) {
      setRecipes([]);
      setLoading(false);
      setCriticalError(false);
      return;
    }
    try {
      setLoading(true);
      setCriticalError(false);
      const response = await fetch('https://dummyjson.com/recipes?limit=50');
      const json = await response.json();
      const savedItems = json.recipes.filter(recipe => 
        bookmarkedIds.includes(recipe.id)
      );
      setRecipes(savedItems);
    } catch (error) {
      console.error("Failed fetching saved details:", error);
      setCriticalError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, [bookmarkedIds]);

  const renderItem = ({ item, index }) => {
    const isSaved = isBookmarked(item.id);
    const cardHeight = index % 3 === 0 ? 260 : index % 3 === 1 ? 210 : 240;
    const displayImage = item?.image;
    const displayTitle = item?.name || '';
    const displayTime = `${(item?.prepTimeMinutes || 0) + (item?.cookTimeMinutes || 0)} min`;
    const displayTag = item?.mealType ? item?.mealType[0] : 'Recipe';
    
    return (
      <Pressable
        onPress={() => navigation.navigate('Recipe', { id: item.id })}
        style={[styles.card, { height: cardHeight }]}
      >
        <Image source={{ uri: displayImage }} style={styles.img} />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.type}>{displayTag}</Text>
          <Text numberOfLines={2} style={styles.title}>
            {displayTitle}
          </Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={14} color={COLORS.primary} />
            <Text style={styles.time}>{displayTime}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => toggleBookmark(item.id)}
          style={styles.bookmark}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={COLORS.primary}
          />
        </Pressable>
      </Pressable>
    );
  };

  if (loading) {
    return <LoadingState message="Fetching your saved inspirations..." />;
  }

  if (criticalError) {
    return (
      <ErrorState 
        title="Failed to Load Collection" 
        onRetry={fetchSavedRecipes} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
     <SearchBar/>
     
      
      <View style={{ padding: 16 }}>
        <Text style={styles.h1}>Saved Collection</Text>
        <Text style={styles.sub}>
          {`${recipes?.length} curated inspirations`}
        </Text>
      </View>

      {recipes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons 
            name="bookmark-outline" 
            size={48} 
            color={COLORS.muted} 
            style={{ marginBottom: 12 }} 
          />
          <Text style={styles.emptyText}>Your collection is empty.</Text>
          <Text style={styles.emptySubText}>Recipes you bookmark will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.rowWrap}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
      <BottomNav active="Saved" navigation={navigation} />
    </View>
  );
}

const CARD_WIDTH = (width - 30) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  h1: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  sub: {
    color: COLORS.muted,
    marginTop: 4,
  },
  rowWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  content: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  type: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  time: {
    color: COLORS.muted,
    fontSize: 12,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 99,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubText: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
});