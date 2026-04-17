import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientButton } from '../../components/common/GradientButton';
import { ProgressRing } from '../../components/common/ProgressRing';
import { calorieAPI } from '../../api/client';
import { useAppStore } from '../../store/appStore';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

const mealTypeIcons: Record<string, any> = {
  breakfast: 'sunny',
  lunch: 'restaurant',
  dinner: 'moon',
  snack: 'cafe',
};

const mealTypeColors: Record<string, string[]> = {
  breakfast: ['#FF9100', '#FFD740'],
  lunch: ['#00E676', '#00BCD4'],
  dinner: ['#6C63FF', '#8B83FF'],
  snack: ['#FF6B6B', '#FF9100'],
};

export const CalorieTrackerScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const dailyStats = useAppStore((s) => s.dailyStats);
  const [meals, setMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const { data } = await calorieAPI.getMeals(today);
      setMeals(data.meals || []);
      setTotals(data.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 });
    } catch {}
  };

  const loadSuggestions = async (type: string) => {
    try {
      const { data } = await calorieAPI.getSuggestions(type);
      setSuggestions(data.suggestions || []);
    } catch {}
  };

  const handleAddMeal = async (item?: any) => {
    const name = item?.name || mealName;
    const calories = item?.calories || Number(mealCalories);
    if (!name || !calories) {
      Alert.alert('Error', 'Please enter meal name and calories');
      return;
    }
    try {
      await calorieAPI.logMeal({
        date: today,
        mealType: selectedMealType,
        items: [{
          name,
          calories,
          protein: item?.protein || 0,
          carbs: item?.carbs || 0,
          fat: item?.fat || 0,
          quantity: 1,
          unit: 'serving',
        }],
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMealName('');
      setMealCalories('');
      setShowAddMeal(false);
      loadMeals();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to log meal');
    }
  };

  const calorieProgress = dailyStats.calories.goal > 0
    ? totals.calories / dailyStats.calories.goal
    : 0;
  const remaining = Math.max(0, dailyStats.calories.goal - totals.calories);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Nutrition</Text>
        </Animated.View>

        {/* Daily Summary Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <GlassCard index={0}>
            <View style={styles.summaryRow}>
              <ProgressRing
                progress={calorieProgress}
                size={120}
                strokeWidth={12}
                color={calorieProgress > 1 ? colors.accent : colors.primary}
                value={`${totals.calories}`}
                label="consumed"
              />
              <View style={styles.summaryStats}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Goal</Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>
                    {dailyStats.calories.goal}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Remaining</Text>
                  <Text style={[styles.summaryValue, { color: remaining > 0 ? colors.accentGreen : colors.accent }]}>
                    {remaining}
                  </Text>
                </View>
              </View>
            </View>

            {/* Macros Bar */}
            <View style={styles.macrosRow}>
              {[
                { label: 'Protein', value: totals.protein, color: colors.primary, unit: 'g' },
                { label: 'Carbs', value: totals.carbs, color: colors.accentGreen, unit: 'g' },
                { label: 'Fat', value: totals.fat, color: colors.accentOrange, unit: 'g' },
              ].map((macro, idx) => (
                <View key={idx} style={styles.macroItem}>
                  <View style={[styles.macroDot, { backgroundColor: macro.color }]} />
                  <Text style={[styles.macroValue, { color: colors.text }]}>
                    {macro.value}{macro.unit}
                  </Text>
                  <Text style={[styles.macroLabel, { color: colors.textTertiary }]}>{macro.label}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Meal Type Selector */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.mealTypes}>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setSelectedMealType(type);
                setShowAddMeal(true);
                loadSuggestions(type);
                Haptics.selectionAsync();
              }}
              style={[
                styles.mealTypeCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <LinearGradient
                colors={mealTypeColors[type]}
                style={styles.mealTypeIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={mealTypeIcons[type]} size={20} color="#FFF" />
              </LinearGradient>
              <Text style={[styles.mealTypeLabel, { color: colors.text }]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Add Meal Panel */}
        {showAddMeal && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <GlassCard index={5}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Add {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
              </Text>

              {/* Manual Entry */}
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceLight, color: colors.text, borderColor: colors.border, flex: 2 }]}
                  placeholder="Food name"
                  placeholderTextColor={colors.textTertiary}
                  value={mealName}
                  onChangeText={setMealName}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceLight, color: colors.text, borderColor: colors.border, flex: 1 }]}
                  placeholder="Cal"
                  placeholderTextColor={colors.textTertiary}
                  value={mealCalories}
                  onChangeText={setMealCalories}
                  keyboardType="numeric"
                />
              </View>
              <GradientButton
                title="Add"
                onPress={() => handleAddMeal()}
                size="sm"
                style={{ marginBottom: Spacing.md }}
              />

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <Text style={[styles.subTitle, { color: colors.textSecondary }]}>Suggestions</Text>
                  {suggestions.map((s, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleAddMeal(s)}
                      style={[styles.suggestionItem, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.suggestionName, { color: colors.text }]}>{s.name}</Text>
                        <Text style={[styles.suggestionMacros, { color: colors.textTertiary }]}>
                          P: {s.protein}g  C: {s.carbs}g  F: {s.fat}g
                        </Text>
                      </View>
                      <Text style={[styles.suggestionCal, { color: colors.primary }]}>{s.calories} cal</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </GlassCard>
          </Animated.View>
        )}

        {/* Today's Meals */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
            Today's Meals
          </Text>
          {meals.length === 0 ? (
            <GlassCard index={6}>
              <View style={styles.emptyMeals}>
                <Ionicons name="restaurant-outline" size={40} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No meals logged yet
                </Text>
              </View>
            </GlassCard>
          ) : (
            meals.map((meal, idx) => (
              <GlassCard key={meal._id || idx} index={7 + idx} style={{ marginBottom: Spacing.sm }}>
                <View style={styles.mealRow}>
                  <LinearGradient
                    colors={mealTypeColors[meal.mealType] || ['#6C63FF', '#8B83FF']}
                    style={styles.mealIcon}
                  >
                    <Ionicons name={mealTypeIcons[meal.mealType] || 'restaurant'} size={16} color="#FFF" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mealRowType, { color: colors.text }]}>
                      {meal.mealType?.charAt(0).toUpperCase() + meal.mealType?.slice(1)}
                    </Text>
                    <Text style={[styles.mealRowItems, { color: colors.textSecondary }]} numberOfLines={1}>
                      {meal.items?.map((i: any) => i.name).join(', ')}
                    </Text>
                  </View>
                  <Text style={[styles.mealRowCal, { color: colors.text }]}>{meal.totalCalories} cal</Text>
                </View>
              </GlassCard>
            ))
          )}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: 60 },
  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSize.hero, fontWeight: FontWeight.heavy },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  summaryStats: { flex: 1, gap: Spacing.md },
  summaryItem: {},
  summaryLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  summaryValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  macroItem: { alignItems: 'center', gap: 2 },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  macroLabel: { fontSize: FontSize.xs },
  mealTypes: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  mealTypeCard: { flex: 1, alignItems: 'center', gap: 6, padding: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1 },
  mealTypeIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mealTypeLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  subTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, marginBottom: Spacing.sm },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  input: { height: 44, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.sm, borderWidth: 1, fontSize: FontSize.md },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, marginBottom: Spacing.xs },
  suggestionName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  suggestionMacros: { fontSize: FontSize.xs, marginTop: 2 },
  suggestionCal: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  emptyMeals: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.md },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  mealIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mealRowType: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  mealRowItems: { fontSize: FontSize.sm, marginTop: 2 },
  mealRowCal: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
