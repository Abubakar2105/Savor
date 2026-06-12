import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {COLORS} from "../constants"

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Discover', icon: 'compass-outline', screen: 'Discover' },
    { name: 'Saved', icon: 'bookmark-outline', screen: 'Saved' },
    { name: 'Kitchen', icon: 'restaurant-outline', screen: 'Kitchen' },
    { name: 'Profile', icon: 'person-outline', screen: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = route.name === tab.screen;

        return (
          <Pressable
            key={tab.screen}
            onPress={() => navigation.navigate(tab.screen)}
            style={[
              styles.tab,
              active && styles.activeTab, 
            ]}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={active ? COLORS.text : COLORS.primary}
            />

            {active && (
              <Text style={styles.activeLabel}>
                {tab.name}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,   
  },

  activeLabel: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
});