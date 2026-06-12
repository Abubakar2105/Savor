import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function LoadingState({ message }) {
  return (
    <View style={styles.centerElement}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.statusText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centerElement: { 
    flex: 1, 
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 32 
  },
  statusText: { 
    color: COLORS.muted, 
    marginTop: 14, 
    fontWeight: '600', 
    fontSize: 14 
  },
});