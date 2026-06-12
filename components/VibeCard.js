import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';


export default function VibeCard({ vibe }) {
  const navigation = useNavigation();

  return (
    <Pressable 
      style={styles.vibeCard}
      onPress={() => navigation.navigate('RecipeList', { category: vibe?.mealType[0],isMealType: true})}
    >
      <View style={styles.vibeContent}>
        <Text style={styles.vibeTitle} numberOfLines={1}>{vibe?.mealType[0]}</Text>
      </View>

      <View style={styles.vibeImageWrap}>
        <Image source={{ uri: vibe?.image }} style={styles.vibeImg} />
        <View style={styles.vibeOverlay} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  vibeCard: { flexDirection: 'row', height: 100, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: '#1c1c18' },
  vibeContent: { flex: 1, justifyContent: 'center', paddingLeft: 14, paddingRight: 10, zIndex: 2 },
  vibeTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  vibeImageWrap: { flex: 1, position: 'relative' },
  vibeImg: { width: '100%', height: '100%' },
  vibeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' }
});