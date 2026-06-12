import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScopedStorage } from '../storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation, route }) {
  const onLoginSuccess = route?.params?.onLoginSuccess;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignUp = async () => {
    setErrorMessage(null); 
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      setErrorMessage('Username, Email, and Password fields are required.');
      return;
    }

    setLoading(true);

    try {
      const existingUsersRaw = await AsyncStorage.getItem('@all_registered_users');
      const usersList = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const userExists = usersList.some(
        u => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email === cleanEmail
      );

      if (userExists) {
        setErrorMessage('This username or email address is already in use.');
        setLoading(false);
        return;
      }

      const newUserData = {
        username: cleanUsername,
        name: cleanUsername,
        email: cleanEmail,
        password: password
      };

      usersList.push(newUserData);
      await AsyncStorage.setItem('@all_registered_users', JSON.stringify(usersList));
      await ScopedStorage.setItem('user_session', {
        username: newUserData.username,
        name: newUserData.name,
        email: newUserData.email
      });

      if (onLoginSuccess) {
        onLoginSuccess(newUserData);
      }
    } catch (error) {
      setErrorMessage('Profile registration pipeline failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Savor</Text>
        <Text style={styles.subtitle}>Create your real kitchen profile.</Text>
      </View>

      <View style={styles.form}>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ffb59e" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <Text style={styles.label}>Username *</Text>
        <TextInput
          style={styles.input}
          placeholder="chef_julian"
          placeholderTextColor="#a8a8a8"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@savor.com"
          placeholderTextColor="#a8a8a8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#a8a8a8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Culinary Tagline</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Mastering French Classics"
          placeholderTextColor="#a8a8a8"
          value={tagline}
          onChangeText={setTagline}
        />

        <Pressable 
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1c1c18" />
          ) : (
            <>
              <Text style={styles.buttonText}>Register & Sign In</Text>
              <Ionicons name="restaurant" size={18} color="#1c1c18" />
            </>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.switchLink}>
          <Text style={styles.switchText}>Already have an account? <Text style={styles.linkHighlight}>Sign In</Text></Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#131410', paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center' },
  header: { marginBottom: 24 },
  title: { fontSize: 40, fontWeight: '800', color: '#ffb59e', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#e5e2db', fontWeight: '500' },
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