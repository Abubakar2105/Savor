import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoadingState from '../components/LoadingState';

import { COLORS } from "../constants";
import { ScopedStorage } from '../storage';

export default function LoginScreen({ navigation, route }) {
  const onLoginSuccess = route?.params?.onLoginSuccess;

  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    const cleanCredential = emailOrUser.trim().toLowerCase();

    if (!cleanCredential || !password) {
      setErrorMessage('Please fill in both credential text fields.');
      return;
    }

    setLoading(true);

    try {
      const rawUsers = await AsyncStorage.getItem('@all_registered_users');
      const usersList = rawUsers ? JSON.parse(rawUsers) : [];

      const matchedUser = usersList.find(
        u => (u.email === cleanCredential || u.username.toLowerCase() === cleanCredential) && u.password === password
      );

      if (!matchedUser) {
        setErrorMessage('Invalid username, email, or password combination.');
        setLoading(false);
        return;
      }

      const realUserData = {
        username: matchedUser.username,
        name: matchedUser.name,
        email: matchedUser.email,
        avatarUrl: matchedUser.avatarUrl,
      };

      await ScopedStorage.setItem('user_session', realUserData);
      
      if (onLoginSuccess) {
        onLoginSuccess(realUserData);
      }
    } catch (error) {
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Verifying credentials..." />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Savor</Text>
      </View>

      <View style={styles.form}>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={COLORS.secondary || "#ffb59e"} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Text style={styles.label}>Username or Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@savor.com"
          placeholderTextColor="#a8a8a8"
          autoCapitalize="none"
          value={emailOrUser}
          onChangeText={setEmailOrUser}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#a8a8a8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable 
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Sign In</Text>
          <Ionicons name="log-out" size={18} style={{ transform: [{ rotate: '180deg' }] }} color={COLORS.bg || "#1c1c18"} />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SignUp')} style={styles.switchLink}>
          <Text style={styles.switchText}>New here? <Text style={styles.linkHighlight}>Create an Account</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131410', paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 40, fontWeight: '800', color: '#ffb59e', marginBottom: 8 },
  form: { gap: 16 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 181, 158, 0.1)', borderWidth: 1, borderColor: '#ffb59e', padding: 14, borderRadius: 12, gap: 10, marginBottom: 8 },
  errorText: { color: '#ffb59e', fontSize: 14, fontWeight: '600', flex: 1 },
  label: { color: '#e5e2db', fontSize: 14, fontWeight: '600', marginBottom: -6 },
  input: { backgroundColor: '#1c1c18', color: '#e5e2db', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#353530', fontSize: 16 },
  button: { flexDirection: 'row', backgroundColor: '#f16536', paddingVertical: 16, borderRadius: 999, justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 12 },
  buttonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  buttonText: { color: '#1c1c18', fontSize: 16, fontWeight: '700' },
  switchLink: { marginTop: 12, alignItems: 'center' },
  switchText: { color: '#a8a8a8', fontSize: 14 },
  linkHighlight: { color: '#ffb59e', fontWeight: '600' }
});