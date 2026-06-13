import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <ImageBackground
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcB402aUqUQbva3fNd7-ront3Hq9hA3IkV_s5MuwC_XyGOknzTsvSCBHYH-D0JTkLjrtY21HQ6DwukCkzRueeOn5-Sy5k0VR_pQgILNYQeXNJFnpJ-Ri_GDlEh6UirdMlPpLQ_H6jOSI8qxcNG796t9y_dlFRmlVsQE2bgAZ4UJnvyK7oLB03Q6fnLCyY6XAHdwMzpQYqsUQHU1iWJozkCEoDiq3rsppRWOXEYlTm8_NypRUi1oAdYD7Nq_m6-vZdnXen5qhY5Fw',
        }}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.scrimDark} />
        <View style={styles.scrimLight} />
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Savor</Text>

          <Text style={styles.subtitle}>
            Your Culinary Journey Starts Here.
          </Text>

          <Text style={styles.description}>
            Experience cooking not as a chore, but as a deeply sensory immersion.
            Discover recipes, refine your technique, and taste the difference.
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#1c1c18" />
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131410',
  },

  scrimDark: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  scrimLight: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  textBlock: {
    marginBottom: 40,
  },

  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffb59e',
    letterSpacing: -1,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e5e2db',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: '#e1bfb6',
    lineHeight: 24,
    maxWidth: 320,
  },

  button: {
    flexDirection: 'row',
    backgroundColor: '#f16536',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: '#1c1c18',
    fontSize: 14,
    fontWeight: '600',
  },
});