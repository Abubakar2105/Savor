import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen'; 
import DiscoverScreen from './screens/DiscoverScreen';
import RecipeScreen from './screens/RecipeScreen.js';
import RecipeListScreen from './screens/RecipeListScreen';
import SavedScreen from './screens/SavedScreen';
import ProfileScreen from './screens/ProfileScreen';
import KitchenScreen from './screens/KitchenScreen';

import LoadingState from './components/LoadingState';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (session !== null) {
          setUserSession(JSON.parse(session));
        }
      } catch (e) {
        console.warn('Failed to restore session token', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <LoadingState message="Restoring session..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userSession == null ? (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                initialParams={{ onLoginSuccess: (user) => setUserSession(user) }}
              />
              <Stack.Screen 
                name="SignUp" 
                component={SignupScreen} 
                initialParams={{ onLoginSuccess: (user) => setUserSession(user) }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Discover" component={DiscoverScreen} />
              <Stack.Screen name="Recipe" component={RecipeScreen} />
              <Stack.Screen name="RecipeList" component={RecipeListScreen} />
              <Stack.Screen name="Saved" component={SavedScreen} />
              <Stack.Screen name="Kitchen" component={KitchenScreen} />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen} 
                initialParams={{ onSignOut: () => setUserSession(null) }}
              />
            </>
          )}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#131410',
  },
  loaderContainer: { 
    flex: 1, 
    backgroundColor: '#131410', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
});