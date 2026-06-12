import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

export default function ErrorState({ 
  title = "Connection Disrupted", 
  message = "We hit a snag loading your recipes. Check your connection data and try again.",
  onRetry 
}) {
  return (
    <View style={styles.centerElement}>
      <View style={styles.errorIconCircle}>
        <Ionicons name="cloud-offline-outline" size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.errorTitleText}>{title}</Text>
      <Text style={styles.errorSubtitleText}>{message}</Text>
      
      {onRetry && (
        <Pressable 
          style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]} 
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerElement: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 32 
  },
  errorIconCircle: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: COLORS.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  errorTitleText: { 
    color: COLORS.text, 
    fontSize: 18, 
    fontWeight: '800', 
    marginBottom: 6, 
    textAlign: 'center' 
  },
  errorSubtitleText: { 
    color: COLORS.muted, 
    fontSize: 13, 
    textAlign: 'center', 
    lineHeight: 20 
  },
  retryBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent'
  },
  retryBtnPressed: {
    backgroundColor: 'rgba(255, 181, 158, 0.1)'
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14
  }
});