import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../components/BottomNav';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { ScopedStorage } from '../storage'; 
import { COLORS } from "../constants";
import SearchBar from "../components/SearchBar"

export default function ProfileScreen({ route }) {
  const { onSignOut } = route.params || {};
  const [user, setUser] = useState(null);
  const [cookedItems, setCookedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criticalError, setCriticalError] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const loadProfileData = async () => {
    setLoading(true);
    setCriticalError(false);
    try {
      const sessionData = await ScopedStorage.getItem('user_session');
      if (sessionData) {
        setUser(sessionData);
        setEditedName(sessionData.name || '');

        const storedCooked = await ScopedStorage.getItem('@user_cooked_recipes');
        if (storedCooked) {
          setCookedItems(storedCooked);
        }
      }
    } catch (error) {
      console.error('Failed to load storage data on Profile Screen:', error);
      setCriticalError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName.trim() === user.name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    try {
      const updatedUserSession = {
        ...user,
        name: editedName.trim(),
      };

      await ScopedStorage.setItem('user_session', updatedUserSession);
      setUser(updatedUserSession);
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update name in ScopedStorage:', error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await ScopedStorage.removeItem('user_session');
      if (onSignOut) {
        onSignOut();
      }
    } catch (error) {
      console.error('Error during session teardown:', error);
    }
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Assembling your cookbook profile..." />
      </View>
    );
  }

  if (criticalError) {
    return (
      <View style={styles.container}>
        <ErrorState 
          title="Profile Sync SNAG" 
          onRetry={loadProfileData} 
        />
      </View>
    );
  }

  if (!user) return null;

  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.container}>
    <SearchBar/>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{firstLetter}</Text>
          </View>

          <View style={styles.profileInfoTextWrap}>
            {isEditingName ? (
              <View style={styles.editRowContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  autoFocus
                  maxLength={25}
                  placeholder="Enter name"
                  placeholderTextColor={COLORS.muted}
                  returnKeyType="done"
                  onSubmitEditing={handleUpdateName}
                />
                
                {isSavingName ? (
                  <LoadingState message="" />
                ) : (
                  <View style={styles.actionIconsRow}>
                    <Pressable onPress={handleUpdateName} style={styles.actionIconBtn}>
                      <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
                    </Pressable>
                    <Pressable 
                      onPress={() => { setIsEditingName(false); setEditedName(user.name); }} 
                      style={styles.actionIconBtn}
                    >
                      <Ionicons name="close-circle-outline" size={24} color={COLORS.muted} />
                    </Pressable>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.nameDisplayRow}>
                <Text style={styles.name} numberOfLines={1}>{user?.name}</Text>
                <Pressable 
                  onPress={() => setIsEditingName(true)} 
                  style={styles.editPenBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="pencil-sharp" size={16} color={COLORS.primary} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statValue}>{cookedItems.length}</Text>
          <Text style={styles.statLabel}>Cooked</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cooked Items</Text>

          {cookedItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={32} color={COLORS.border} />
              <Text style={styles.emptyText}>No recipes marked as cooked yet.</Text>
            </View>
          ) : (
            cookedItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImg}
                />
                <View style={styles.overlay} />
                <Text style={styles.cardTitle}>{item?.name}</Text>
              </View>
            ))
          )}
        </View>
        <View style={styles.logoutWrap}>
          <Pressable 
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]} 
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>

      </ScrollView>
      <BottomNav active="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  profileHeader: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 16 },
  avatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: COLORS.secondary, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarLetter: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center'
  },
  profileInfoTextWrap: { flex: 1, justifyContent: 'center' },
  nameDisplayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: COLORS.text, fontSize: 22, fontWeight: '800', maxWidth: '80%' },
  editPenBtn: { padding: 4 },
  editRowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  nameInput: { 
    flex: 1,
    color: COLORS.text, 
    fontSize: 20, 
    fontWeight: '800', 
    backgroundColor: COLORS.secondary, 
    borderColor: COLORS.border, 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionIconsRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8, gap: 4 },
  actionIconBtn: { padding: 4 },
  stats: { padding: 16, backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 12, alignItems: 'flex-start' },
  statValue: { color: COLORS.primary, fontSize: 28, fontWeight: '800' },
  statLabel: { color: COLORS.muted, marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  card: { height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  cardImg: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  cardTitle: { position: 'absolute', bottom: 10, left: 10, color: COLORS.text, fontWeight: '700', fontSize: 16 },
  emptyContainer: { padding: 32, alignItems: 'center', gap: 8, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.muted, fontSize: 14, textAlign: 'center' },
  logoutWrap: { padding: 16, paddingBottom: 30 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.primary, padding: 14, borderRadius: 12, backgroundColor: 'transparent' },
  logoutBtnPressed: { backgroundColor: 'rgba(255, 181, 158, 0.1)' },
  logoutText: { color: COLORS.primary, fontWeight: '700' },
});