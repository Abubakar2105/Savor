import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useSearchRecipes } from '../hooks/useSearchRecipes';
import { useRecipesByTag } from '../hooks/useRecipesByTag';
import { useRecipesByMealType } from '../hooks/useRecipesByMealType';
import { useRecipes } from '../hooks/useRecipes';
import { COLORS } from "../constants";

import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function RecipeListScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { 
    category = 'All', 
    searchQuery = '', 
    isAllMode = false, 
    isMealType = false, 
    isTagMode = false 
  } = route.params || {};

  const [recipesList, setRecipesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { recipes: searchData, loading: searchLoading, error: searchError } = useSearchRecipes(searchQuery);
  const { recipes: allData, loading: allLoading, error: allError } = useRecipes(isAllMode ? { limit: 50, skip: 0 } : undefined);
  const { recipes: mealData, loading: mealLoading, error: mealError } = useRecipesByMealType(isMealType ? category.toLowerCase() : '');
  const { recipes: tagData, loading: tagLoading, error: tagError } = useRecipesByTag(isTagMode ? category : '');

  useEffect(() => {
    if (searchQuery) {
      setLoading(searchLoading);
      setError(searchError);
      setRecipesList(searchData);
    } else if (isAllMode) {
      setLoading(allLoading);
      setError(allError);
      setRecipesList(allData);
    } else if (isMealType) {
      setLoading(mealLoading);
      setError(mealError);
      setRecipesList(mealData);
    } else if (isTagMode) {
      setLoading(tagLoading);
      setError(tagError);
      setRecipesList(tagData);
    }
  }, [
    searchQuery, isAllMode, isMealType, isTagMode,
    searchData, searchLoading, searchError,
    allData, allLoading, allError,
    mealData, mealLoading, mealError,
    tagData, tagLoading, tagError
  ]);

  if (loading) {
    return <LoadingState message="Plating up recipes..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title={error} 
        retryText="Go Back" 
        onRetry={() => navigation.navigate('Discover')} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {searchQuery ? `Results for "${searchQuery}"` : category}
          </Text>

          <Text style={styles.headerSubtitle}>
            {recipesList.length} {recipesList.length === 1 ? 'recipe' : 'recipes'}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={recipesList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={64} color="#333" />
            <Text style={styles.emptyTitle}>No Recipes Found</Text>
            <Pressable style={styles.exploreBtn} onPress={() => navigation.navigate('Discover')}>
              <Text style={styles.exploreBtnText}>Go Back</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.recipeCard}
            onPress={() => navigation.navigate('Recipe', { id: item.id })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.recipeImg} />
              <View style={styles.darkOverlay} />
              
              <View style={styles.pillsRow}>
                <Text style={styles.pillText}>
                  {`${item.prepTimeMinutes + item.cookTimeMinutes}m`}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.pillText}>{item.difficulty}</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.recipeTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.recipeDesc} numberOfLines={1}>
                {`${item.cuisine || 'Chef'} Specialty`}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c18',
  },
  backButton: { padding: 4 },
  titleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  headerTitle: { color: COLORS.primary, fontSize: 18, fontWeight: '800' },
  headerSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  row: { flex: 1, justifyContent: 'space-between', marginBottom: 16 },
  recipeCard: { width: '48%', backgroundColor: COLORS.card, borderRadius: 14, overflow: 'hidden' },
  imageContainer: { width: '100%', height: 130, position: 'relative' },
  recipeImg: { width: '100%', height: '100%' },
  darkOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.25)' },
  pillsRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillText: { color: COLORS.text, fontSize: 10, fontWeight: '700' },
  dot: { color: '#888', fontSize: 10, marginHorizontal: 4 },
  cardContent: { padding: 10 },
  recipeTitle: { color: COLORS.primary, fontSize: 14, fontWeight: '800' },
  recipeDesc: { color: COLORS.secondary, fontSize: 11, marginTop: 2, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginTop: 16 },
  exploreBtn: { marginTop: 20, backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  exploreBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});