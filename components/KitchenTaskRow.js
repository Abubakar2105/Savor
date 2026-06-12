import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';

export default function KitchenTaskRow({ 
  text, 
  done, 
  isLocked, 
  onPress, 
  type = 'checklist' 
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      style={[
        styles.rowContainer,
        isLocked && styles.locked,
        (type === 'instruction' && done) && styles.doneStep,
      ]}
    >
      <View style={styles.iconColumn}>
        {type === 'checklist' ? (
          <View style={[styles.checkbox, done && styles.checkboxActive]}>
            {done && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
        ) : (
          <Ionicons
            name={done ? 'checkmark-circle' : isLocked ? 'lock-closed' : 'ellipse-outline'}
            size={18}
            color={COLORS.secondary}
          />
        )}
      </View>

      <Text style={[styles.rowText, done && styles.strike]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rowContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 14, 
    backgroundColor: COLORS.surface, 
    borderRadius: 14, 
    marginBottom: 10 
  },
  iconColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  checkbox: { 
    width: 22, 
    height: 22, 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: COLORS.secondary, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkboxActive: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary 
  },
  rowText: { 
    color: COLORS.text, 
    fontWeight: '600', 
    flex: 1, 
    lineHeight: 20 
  },
  strike: { 
    textDecorationLine: 'line-through', 
    opacity: 0.4 
  },
  locked: { 
    opacity: 0.35 
  },
  doneStep: { 
    backgroundColor: '#1a1915', 
    borderWidth: 0.5, 
    borderColor: 'rgba(211,84,0,0.15)' 
  },
});