import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from "../constants";

export default function HeroGrid({ topRecipes = [] }) {
  const navigation = useNavigation();

  const [bigHero, ...rightColumnItems] = topRecipes;

  return (
    <View style={styles.heroGrid}>

      {bigHero && (
        <Pressable 
          style={styles.heroBig} 
          onPress={() => navigation.navigate('RecipeList', { category: bigHero?.cuisine, isTagMode: true })}
        >
          <Image source={{ uri: bigHero?.image }} style={styles.heroImg} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{bigHero?.cuisine}</Text>
          </View>
        </Pressable>
      )}

      <View style={styles.heroRight}>
        {rightColumnItems.map((item, index) => (
          <Pressable 
            key={item.id || index}
            style={styles.heroSmall} 
            onPress={() => navigation.navigate('RecipeList', { category: item?.cuisine, isTagMode: true })}
          >
            <Image source={{ uri: item?.image }} style={styles.heroImg} />
            <View style={styles.heroOverlay}>
              <Text style={styles.smallText}>{item?.cuisine}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroGrid: { flexDirection: 'row', height: 260, padding: 16, gap: 10 },
  heroBig: { flex: 2, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  heroRight: { flex: 1, gap: 10 },
  heroSmall: { flex: 1, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.45)', 
    justifyContent: 'flex-end',            
    padding: 12,                           
  },
  
  heroTitle: { 
    color: COLORS.text, 
    fontSize: 22, 
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.4)', 
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  smallText: { 
    color: COLORS.text, 
    fontSize: 14, 
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});