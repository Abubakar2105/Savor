import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {COLORS} from "../constants"

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  const navigation = useNavigation(); 
  const [searchQuery, setSearchQuery] = useState('');

 const onSubmit = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('RecipeList', {
        category: 'Search Results',
        searchQuery: searchQuery,
      });
    }
  };
  return (
    <View style={styles.header}>
      <View style={[styles.searchWrap, focused && styles.searchFocused]}>
        <Ionicons name="search" size={18} color={COLORS.primary} />
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor="#888"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
      </View>
      <Text style={styles.logo}>Savor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'space-between' },
  searchWrap: { flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333', paddingVertical: 6, marginRight: 10, alignItems: 'center' },
  searchFocused: { borderBottomColor: COLORS.primary },
  input: { flex: 1, marginLeft: 8, color: '#fff' },
  logo: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
});