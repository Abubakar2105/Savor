import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomNav from '../components/BottomNav';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import KitchenTaskRow from '../components/KitchenTaskRow';

import { COLORS } from "../constants";
import { ScopedStorage } from '../storage';
import { useRecipeDetails } from '../hooks/useRecipeDetails';

export default function KitchenScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const { recipe, loading, error, refetch } = useRecipeDetails(id);

 
  const [timer, setTimer] = useState(0);
  const [initialCalculatedTime, setInitialCalculatedTime] = useState(0);
  const [running, setRunning] = useState(false);

  const [ingredientsState, setIngredientsState] = useState([]);
  const [stepsState, setStepsState] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [kitchenError, setKitchenError] = useState(null);

  
  useEffect(() => {
    if (!recipe) return;

    const rawMinutes = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0) || 45;
    const totalSeconds = rawMinutes * 60;
    
    setInitialCalculatedTime(totalSeconds);
    setTimer(totalSeconds);
    setRunning(false);
    setActiveStep(0);
    setShowCelebration(false);
    setKitchenError(null);

    setIngredientsState(
      (recipe.ingredients || []).map((ing, i) => ({ id: i, text: ing, done: false }))
    );
    setStepsState(
      (recipe.instructions || []).map((step, i) => ({ id: i, text: step, done: false }))
    );
  }, [recipe]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleReset = () => {
    setRunning(false);
    setTimer(initialCalculatedTime);
    setStepsState((prev) => prev.map((s) => ({ ...s, done: false })));
    setIngredientsState((prev) => prev.map((i) => ({ ...i, done: false })));
    setActiveStep(0);
    setShowCelebration(false);
    setKitchenError(null);
  };

  const toggleIngredient = (targetId) => {
    setIngredientsState((prev) =>
      prev.map((item) => (item.id === targetId ? { ...item, done: !item.done } : item))
    );
  };

  const handleStepPress = (index) => {
    if (index === 0 && !running) setRunning(true);

    const updatedSteps = stepsState.map((step, i) => {
      if (i === index) {
        return { ...step, done: !step.done };
      }
      if (i > index && stepsState[index].done) {
        return { ...step, done: false };
      }
      return step;
    });

    setStepsState(updatedSteps);

    const isStepNowDone = updatedSteps[index].done;
    if (isStepNowDone) {
      const nextStepIndex = Math.min(index + 1, updatedSteps.length - 1);
      setActiveStep(nextStepIndex);

     
      if (updatedSteps.every(s => s.done)) {
        setRunning(false);
        setShowCelebration(true);
        AsyncStorage.setItem(
          `@cooked_recipe_id_${id}`, 
          JSON.stringify({ completedAt: new Date().toISOString(), recipeId: id, recipeName: recipe?.name })
        ).catch(err => console.error("Session recording error:", err));
      }
    } else {
      setActiveStep(index);
    }
  };

  const handleExitKitchen = async () => {
    if (!recipe) return;
    setSavingLoading(true);
    setKitchenError(null);

    try {
      const existingCookedRaw = await ScopedStorage.getItem('@user_cooked_recipes');
      const cookedList = existingCookedRaw ? existingCookedRaw : [];
      
      if (!cookedList.some((item) => item.id === recipe.id)) {
        cookedList.push({ id: recipe.id, name: recipe.name, image: recipe.image });
        await ScopedStorage.setItem('@user_cooked_recipes', cookedList);
      }
      
      setShowCelebration(false);
      navigation.navigate('Profile');
    } catch (err) {
      setKitchenError('Failed to record recipe to profile data pool.');
    } finally {
      setSavingLoading(false);
    }
  };

  
  if (loading) return <View style={styles.container}><LoadingState message="Preparing workspace..." /><BottomNav active="Kitchen" navigation={navigation} /></View>;
  if (error) return <View style={styles.container}><ErrorState title="Kitchen Sync Snag" onRetry={refetch} /><BottomNav active="Kitchen" navigation={navigation} /></View>;
  if (!recipe) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCenter}>
          <Ionicons name="restaurant-outline" size={80} color="#2c2c22" />
          <Text style={styles.emptyTitle}>Your Kitchen is Quiet</Text>
          <Text style={styles.emptySubtitle}>You haven't selected a cooking session yet.</Text>
          <Pressable style={styles.exploreBtn} onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.exploreBtnText}>Browse Recipes</Text>
          </Pressable>
        </View>
        <BottomNav active="Kitchen" navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: recipe.image }} style={styles.heroImg} />
          <View style={styles.scrim} />
          <View style={styles.heroContent}>
            <Text style={styles.dishName}>{recipe.name}</Text>
            <Text style={styles.timer}>{formatTime(timer)}</Text>
            <View style={styles.controls}>
              <Pressable onPress={() => setRunning(!running)} style={styles.btn}>
                <Ionicons name={running ? 'pause' : 'play'} size={18} color={COLORS.secondary} />
                <Text style={styles.btnText}>{running ? 'Pause' : 'Start'}</Text>
              </Pressable>
              <Pressable onPress={handleReset} style={styles.btn}>
                <Ionicons name="refresh" size={18} color={COLORS.secondary} />
                <Text style={styles.btnText}>Reset Session</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Ingredients Checklist</Text>
          {ingredientsState.map((item) => (
            <KitchenTaskRow
              key={`ing-${item.id}`}
              text={item.text}
              done={item.done}
              type="checklist"
              onPress={() => toggleIngredient(item.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Interactive Instructions</Text>
          {stepsState.map((step, index) => (
            <KitchenTaskRow
              key={`step-${step.id}`}
              text={step.text}
              done={step.done}
              type="instruction"
              isLocked={index > activeStep}
              onPress={() => handleStepPress(index)}
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <Modal visible={showCelebration} transparent animationType="fade" onRequestClose={handleExitKitchen}>
        <View style={styles.modalBackdrop}>
          <View style={styles.celebrationCard}>
            <View style={styles.iconCircle}><Ionicons name="trophy-outline" size={44} color="#fff" /></View>
            <Text style={styles.celebrationTitle}>Bon Appétit!</Text>
            <Text style={styles.celebrationSubtitle}>You have completed cooking everything for{"\n"}<Text style={{ color: COLORS.secondary, fontWeight: '800' }}>{recipe.name}</Text>.</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryLabel}>Steps Clear</Text>
                <Text style={styles.summaryValue}>{stepsState.length}/{stepsState.length}</Text>
              </View>
              <View style={styles.dividerLine} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryLabel}>Remaining Time</Text>
                <Text style={styles.summaryValue}>{formatTime(timer)}</Text>
              </View>
            </View>
            {kitchenError && (
              <View style={styles.errorBannerContainer}>
                <Ionicons name="cloud-offline" size={18} color={COLORS.errorAlert} />
                <Text style={styles.errorBannerText}>{kitchenError}</Text>
              </View>
            )}
            <Pressable style={[styles.finishModalBtn, savingLoading && { opacity: 0.7 }]} onPress={handleExitKitchen} disabled={savingLoading}>
              {savingLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.finishModalBtnText}>Finish Cooking</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>

      <BottomNav active="Kitchen" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, marginBottom: 60 },
  emptyTitle: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginTop: 20, textAlign: 'center' },
  emptySubtitle: { color: COLORS.muted, fontSize: 14, textAlign: 'center', marginTop: 8 },
  exploreBtn: { marginTop: 24, backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25 },
  exploreBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  hero: { height: 420, position: 'relative' },
  heroImg: { width: '100%', height: '100%', position: 'absolute' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  heroContent: { flex: 1, padding: 20, justifyContent: 'flex-end' },
  dishName: { color: COLORS.text, fontSize: 24, fontWeight: '800' },
  timer: { fontSize: 48, color: COLORS.secondary, fontWeight: '800', marginTop: 6 },
  controls: { flexDirection: 'row', gap: 12, marginTop: 14 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  btnText: { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  title: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  celebrationCard: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a22' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  celebrationTitle: { color: COLORS.text, fontSize: 26, fontWeight: '900', marginBottom: 10 },
  celebrationSubtitle: { color: COLORS.muted, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', backgroundColor: COLORS.bg, padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 28, width: '100%' },
  summaryStat: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: COLORS.muted, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  summaryValue: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  dividerLine: { width: 1, height: 30, backgroundColor: '#2a2a22' },
  errorBannerContainer: { flexDirection: 'row', backgroundColor: 'rgba(255, 181, 158, 0.1)', borderWidth: 1, borderColor: COLORS.errorAlert, padding: 12, borderRadius: 12, gap: 8, marginBottom: 16, alignItems: 'center', width: '100%' },
  errorBannerText: { color: COLORS.errorAlert, fontWeight: '600', fontSize: 13, flex: 1 },
  finishModalBtn: { backgroundColor: COLORS.success, width: '100%', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  finishModalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});