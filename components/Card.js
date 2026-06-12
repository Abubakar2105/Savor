import React from 'react';
import { View, Text, Image, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS} from "../constants"
const { width } = Dimensions.get('window');


export default function TrendingCard({ item }) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('Recipe', { id: item.id })}
      style={styles.card}
    >
      <Image source={{ uri: item?.image }} style={styles.cardImg} />
      <View style={styles.darkOverlay} />

    

      <View style={styles.cardContent}>
        <View style={styles.pills}>
          <Text style={styles.pill}>{(item?.prepTimeMinutes + item?.cookTimeMinutes) || 0} mints</Text>
          <Text style={styles.pill}>{item?.difficulty || "Easy"}</Text>
        </View>

        <Text style={styles.cardTitle}>{item?.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: width * 0.78, height: 330, marginRight: 16, borderRadius: 18, overflow: 'hidden', position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
 
  cardContent: { position: 'absolute', bottom: 0, padding: 14 }, 
  pills: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  pill: { backgroundColor: 'rgba(0,0,0,0.4)', color: COLORS.text, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 11 },
  cardTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800' },
});