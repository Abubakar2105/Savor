import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useRecipeDetails } from '../hooks/useRecipeDetails';
import { useBookmarks } from '../hooks/useBookmarks'; 
import { COLORS } from "../constants";
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function RecipeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const { recipe, loading, error } = useRecipeDetails(id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [activeStep, setActiveStep] = useState(0);

  if (loading) {
    return <LoadingState message="Unlocking secret ingredients..." />;
  }

  if (error || !recipe) {
    return (
      <ErrorState 
        title="Recipe not found" 
        onRetry={() => navigation.goBack()} 
        retryText="Go Back"
      />
    );
  }

  const hasBookmark = isBookmarked(recipe.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerIconContainer}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable style={styles.headerIconContainer}>
            <Ionicons name="share-outline" size={22} color={COLORS.primary} />
          </Pressable>
       
          <Pressable 
            onPress={() => toggleBookmark(recipe.id)} 
            style={styles.headerIconContainer}
          >
            <Ionicons 
              name={hasBookmark ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={COLORS.primary} 
            />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={{ uri: recipe?.image }}
            style={styles.heroImg}
          />
          <View style={styles.imageOverlayShadow} />

          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{recipe?.name}</Text>
          </View>
        </View>
        
        <View style={styles.stats}>
          <Stat 
            icon="time-outline" 
            label="Time" 
            value={`${(recipe?.prepTimeMinutes || 0) + (recipe?.cookTimeMinutes || 0)}m`} 
          />
          <Stat icon="restaurant-outline" label="Serves" value={recipe?.servings} />
          <Stat icon="flame-outline" label="Kcal" value={recipe?.caloriesPerServing} />
          <Stat icon="star-outline" label="Level" value={recipe?.difficulty} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>

          {recipe?.ingredients?.map((item, i) => (
            <View key={i} style={styles.ingredient}>
              <Ionicons
                name="checkbox-outline"
                size={20}
                color={COLORS.primary}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.ingTitle}>{item}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The Method</Text>

          <View style={{ position: 'relative' }}>
            <View style={styles.line} />

            {recipe?.instructions?.map((s, i) => {
              const active = i === activeStep;

              return (
                <Pressable
                  key={i}
                  onPress={() => setActiveStep(i)}
                  style={styles.stepWrap}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      active && { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>

                  <View
                    style={[
                      styles.stepCard,
                      active && styles.stepActive,
                    ]}
                  >
                    <Text style={styles.stepTitle}>{`Step ${i + 1}`}</Text>
                    <Text style={styles.stepDesc}>{s}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.ctaWrap}>
        <Pressable 
          style={styles.cta}
          onPress={() => navigation.navigate('Kitchen', { id: recipe?.id })}
        >
          <Ionicons name="play-circle-outline" size={22} color="#fff" />
          <Text style={styles.ctaText}>Start Cooking</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ icon, label, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerIconContainer: { padding: 4 },
  hero: { height: 420, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  imageOverlayShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 25,
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 3,
  },
  heroTitle: { 
    color: COLORS.text, 
    fontSize: 24, 
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4 
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    paddingVertical: 18,
  },
  stat: { alignItems: 'center', gap: 4 },
  statLabel: { color: COLORS.muted, fontSize: 10 },
  statValue: { color: COLORS.text, fontWeight: '700' },
  section: { padding: 16 },
  sectionTitle: { color: COLORS.primary, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  ingredient: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  ingTitle: { color: COLORS.text, fontWeight: '600' },
  line: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#333',
  },
  stepWrap: { flexDirection: 'row', marginBottom: 16 },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    zIndex: 2,
  },
  stepNum: { color: '#fff', fontSize: 10 },
  stepCard: { flex: 1, backgroundColor: COLORS.card, padding: 12, borderRadius: 12 },
  stepActive: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  stepTitle: { color: COLORS.text, fontWeight: '700', marginBottom: 4 },
  stepDesc: { color: COLORS.muted, fontSize: 13 },
  ctaWrap: { position: 'absolute', bottom: 0, width: '100%', padding: 14, backgroundColor: 'rgba(0,0,0,0.6)' },
  cta: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
});