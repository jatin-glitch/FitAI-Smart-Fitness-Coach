import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientButton } from '../../components/common/GradientButton';
import { Skeleton } from '../../components/common/Skeleton';
import { workoutAPI } from '../../api/client';
import { useAppStore } from '../../store/appStore';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

const categoryIcons: Record<string, string> = {
  strength: 'barbell',
  cardio: 'heart',
  hiit: 'flash',
  yoga: 'leaf',
  stretching: 'body',
  full_body: 'fitness',
  custom: 'create',
};

const categoryColors: Record<string, string[]> = {
  strength: ['#6C63FF', '#8B83FF'],
  cardio: ['#FF6B6B', '#FF9100'],
  hiit: ['#FF9100', '#FFD740'],
  yoga: ['#00E676', '#00BCD4'],
  stretching: ['#00BCD4', '#00D9FF'],
  full_body: ['#6C63FF', '#00D9FF'],
  custom: ['#9C27B0', '#E040FB'],
};

export const WorkoutListScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any>(null);

  const categories = ['all', 'strength', 'cardio', 'hiit', 'full_body', 'yoga'];

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const [plansRes, suggestionsRes] = await Promise.allSettled([
        workoutAPI.getPlans(params),
        workoutAPI.getSuggestions(),
      ]);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data.plans || []);
      if (suggestionsRes.status === 'fulfilled') setSuggestions(suggestionsRes.value.data);
    } catch {}
    setLoading(false);
  };

  const startWorkout = async (planId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('WorkoutDetail', { planId });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Workouts</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('WorkoutDetail', { isNew: true })}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Category Filter */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(cat === 'all' ? null : cat);
              }}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    (cat === 'all' && !selectedCategory) || selectedCategory === cat
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      (cat === 'all' && !selectedCategory) || selectedCategory === cat
                        ? '#FFF'
                        : colors.textSecondary,
                  },
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Smart Suggestions */}
      {suggestions && suggestions.neglectedMuscles?.length > 0 && (
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ paddingHorizontal: Spacing.md }}>
          <GlassCard index={0}>
            <View style={styles.suggestionRow}>
              <Ionicons name="bulb" size={20} color={colors.accentYellow} />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={[styles.suggestionTitle, { color: colors.text }]}>AI Suggestion</Text>
                <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>
                  Focus on: {suggestions.neglectedMuscles.join(', ')}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      )}

      {/* Workout Plans */}
      {loading ? (
        <View style={{ padding: Spacing.md }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: Spacing.md }}>
              <Skeleton height={180} borderRadius={BorderRadius.xl} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: Spacing.md, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={SlideInRight.delay(index * 100).duration(500).springify()}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => startWorkout(item._id)}
                style={{ marginBottom: Spacing.md }}
              >
                <GlassCard noPadding index={index}>
                  <LinearGradient
                    colors={categoryColors[item.category] || categoryColors.custom}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradientHeader}
                  >
                    <Ionicons
                      name={(categoryIcons[item.category] || 'fitness') as any}
                      size={32}
                      color="rgba(255,255,255,0.9)"
                    />
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>{item.difficulty}</Text>
                    </View>
                  </LinearGradient>
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.cardMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                        <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                          {item.duration} min
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="flame-outline" size={14} color={colors.textTertiary} />
                        <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                          ~{item.caloriesBurn} cal
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="barbell-outline" size={14} color={colors.textTertiary} />
                        <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                          {item.exercises?.length || 0} exercises
                        </Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No workout plans found
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export const WorkoutDetailScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();
  const { planId, isNew } = route.params || {};
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const startWorkoutState = useAppStore((s) => s.startWorkout);
  const endWorkoutState = useAppStore((s) => s.endWorkout);

  useEffect(() => {
    if (planId && !isNew) {
      loadPlan();
    } else {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    let interval: any;
    if (workoutActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [workoutActive]);

  const loadPlan = async () => {
    try {
      const { data } = await workoutAPI.getPlan(planId);
      setPlan(data.plan);
    } catch {}
    setLoading(false);
  };

  const handleStartWorkout = async () => {
    try {
      const { data } = await workoutAPI.startWorkout(planId);
      startWorkoutState(data.log._id);
      setWorkoutActive(true);
      setTimer(0);
      setCurrentExerciseIndex(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  };

  const handleCompleteWorkout = async () => {
    const logId = useAppStore.getState().activeWorkoutId;
    if (!logId) return;
    try {
      await workoutAPI.completeWorkout(logId, {
        caloriesBurned: plan?.caloriesBurn || 0,
        rating: 4,
      });
      endWorkoutState();
      setWorkoutActive(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch {}
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: Spacing.md, paddingTop: 80 }]}>
        <Skeleton height={200} borderRadius={BorderRadius.xl} />
        <View style={{ height: 16 }} />
        <Skeleton height={24} width="60%" />
        <View style={{ height: 8 }} />
        <Skeleton height={16} width="90%" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: Spacing.md, paddingTop: 80 }]}>
        <Text style={[{ color: colors.text, fontSize: FontSize.lg }]}>Workout not found</Text>
      </View>
    );
  }

  const gradientColors = categoryColors[plan.category] || categoryColors.custom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradientColors} style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Ionicons name={(categoryIcons[plan.category] || 'fitness') as any} size={80} color="rgba(255,255,255,0.3)" />
          {workoutActive && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.detailContent}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>{plan.name}</Text>
          <Text style={[styles.detailDesc, { color: colors.textSecondary }]}>{plan.description}</Text>

          <View style={styles.detailMeta}>
            <View style={[styles.detailMetaItem, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailMetaValue, { color: colors.text }]}>{plan.duration} min</Text>
            </View>
            <View style={[styles.detailMetaItem, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
              <Ionicons name="flame-outline" size={18} color={colors.accent} />
              <Text style={[styles.detailMetaValue, { color: colors.text }]}>~{plan.caloriesBurn} cal</Text>
            </View>
            <View style={[styles.detailMetaItem, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
              <Ionicons name="speedometer-outline" size={18} color={colors.accentGreen} />
              <Text style={[styles.detailMetaValue, { color: colors.text }]}>{plan.difficulty}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
          {plan.exercises?.map((ex: any, idx: number) => (
            <Animated.View key={idx} entering={FadeInDown.delay(idx * 80).duration(400)}>
              <GlassCard
                index={idx}
                style={{
                  marginBottom: Spacing.sm,
                  ...(workoutActive && idx === currentExerciseIndex && { borderColor: colors.primary, borderWidth: 2 }),
                }}
              >
                <View style={styles.exerciseRow}>
                  <View style={[styles.exerciseNumber, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.exerciseNumberText, { color: colors.primary }]}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {ex.exercise?.name || 'Exercise'}
                    </Text>
                    <Text style={[styles.exerciseMeta, { color: colors.textSecondary }]}>
                      {ex.sets} sets x {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`} | {ex.restTime}s rest
                    </Text>
                  </View>
                  {workoutActive && idx === currentExerciseIndex && (
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (idx < plan.exercises.length - 1) {
                          setCurrentExerciseIndex(idx + 1);
                        }
                      }}
                    >
                      <Ionicons name="checkmark-circle" size={28} color={colors.accentGreen} />
                    </TouchableOpacity>
                  )}
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomAction, { backgroundColor: colors.background }]}>
        {workoutActive ? (
          <GradientButton
            title="Complete Workout"
            onPress={handleCompleteWorkout}
            variant="green"
            size="lg"
            icon={<Ionicons name="checkmark" size={20} color="#FFF" />}
            style={{ flex: 1 }}
          />
        ) : (
          <GradientButton
            title="Start Workout"
            onPress={handleStartWorkout}
            size="lg"
            icon={<Ionicons name="play" size={20} color="#FFF" />}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: 60, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.hero, fontWeight: FontWeight.heavy },
  addButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  categoriesContainer: { paddingHorizontal: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.md },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  categoryText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  suggestionRow: { flexDirection: 'row', alignItems: 'center' },
  suggestionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  suggestionText: { fontSize: FontSize.sm, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyText: { fontSize: FontSize.lg },
  cardGradientHeader: { height: 100, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cardBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  cardBadgeText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'capitalize' },
  cardContent: { padding: Spacing.md },
  cardTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: 4 },
  cardDesc: { fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.sm },
  cardMeta: { flexDirection: 'row', gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  // Detail styles
  detailHeader: { height: 220, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  backButton: { position: 'absolute', top: 50, left: Spacing.md, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  timerContainer: { position: 'absolute', bottom: 16, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: BorderRadius.full },
  timerText: { color: '#FFF', fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, fontVariant: ['tabular-nums'] },
  detailContent: { padding: Spacing.md },
  detailTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, marginBottom: 4 },
  detailDesc: { fontSize: FontSize.md, lineHeight: 22, marginBottom: Spacing.md },
  detailMeta: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  detailMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  detailMetaValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginBottom: Spacing.md },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  exerciseNumber: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  exerciseNumberText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  exerciseName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  exerciseMeta: { fontSize: FontSize.sm, marginTop: 2 },
  bottomAction: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, paddingBottom: 40 },
});
