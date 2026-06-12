import React from 'react';
import { View, ScrollView, Text, FlatList, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';

import SearchBar from '../components/SearchBar';
import HeroGrid from '../components/HeroGrid';
import TrendingCard from '../components/Card';
import VibeCard from '../components/VibeCard';


import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

import { useRecipes } from '../hooks/useRecipes';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const navigation = useNavigation();

  const { recipes, loading, error, refetch } = useRecipes({ limit: 9 }); 

  const heroRecipes = recipes.slice(0, 3);
  const trendingRecipes = recipes.slice(3, 6);
  const vibeRecipes = recipes.slice(6, 9);

 

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" />

      <SearchBar />

      {loading && <LoadingState />}

      {!loading && error && <ErrorState onRetry={refetch} />}

      {!loading && !error && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeroGrid topRecipes={heroRecipes} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 22, marginBottom: 12 }}>
            <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '700' }}>Trending Now</Text>
            <Text 
              style={{ color: COLORS.primary, fontSize: 13, fontWeight: '600' }} 
              onPress={() => navigation.navigate("RecipeList", { category: "All", isAllMode: true })}
            >
              View all →
            </Text>
          </View>

          <FlatList
            horizontal
            data={trendingRecipes}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 16 }}
            renderItem={({ item }) => <TrendingCard item={item} />}
          />

          <View style={{ height: 30 }} />

          <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 }}>
            Browse by Vibe
          </Text>

          {vibeRecipes.map((v, i) => (
            <VibeCard key={i} vibe={v} />
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      <BottomNav />
    </View>
  );
}