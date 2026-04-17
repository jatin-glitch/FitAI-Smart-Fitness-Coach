import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { ProgressRing } from '../../components/common/ProgressRing';
import { AnimatedBarChart } from '../../components/charts/AnimatedBarChart';
import { progressAPI } from '../../api/client';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

export const ProgressScreen = () => {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [weeklyRes, monthlyRes, streakRes] = await Promise.allSettled([
        progressAPI.getWeeklyStats(),
        progressAPI.getMonthlyStats(),
        progressAPI.getStreak(),
      ]);
      if (weeklyRes.status === 'fulfilled') setWeeklyStats(weeklyRes.value.data);
      if (monthlyRes.status === 'fulfilled') setMonthlyStats(monthlyRes.value.data);
      if (streakRes.status === 'fulfilled') setStreak(streakRes.value.data.streak || { current: 0, longest: 0 });
    } catch {}
  };

  const weeklyCalorieData = weeklyStats?.days?.map((d: any, i: number) => ({
    label: dayNames[new Date(d.date + 'T00:00:00').getDay()],
    value: d.calories?.consumed || 0,
  })) || [];

  const weeklyStepData = weeklyStats?.days?.map((d: any, i: number) => ({
    label: dayNames[new Date(d.date + 'T00:00:00').getDay()],
    value: d.steps?.count || 0,
  })) || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Progress</Text>
      </Animated.View>

      {/* Period Toggle */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.periodToggle}>
        {(['weekly', 'monthly'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.periodButton,
              {
                backgroundColor: period === p ? colors.primary : 'transparent',
              },
            ]}
          >
            <Text style={[styles.periodText, { color: period === p ? '#FFF' : colors.textSecondary }]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Streak Card */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <GlassCard index={0}>
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={32} color={colors.accentOrange} />
              <Text style={[styles.streakValue, { color: colors.text }]}>{streak.current}</Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current Streak</Text>
            </View>
            <View style={[styles.streakDivider, { backgroundColor: colors.border }]} />
            <View style={styles.streakItem}>
              <Ionicons name="trophy" size={32} color={colors.accentYellow} />
              <Text style={[styles.streakValue, { color: colors.text }]}>{streak.longest}</Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Best Streak</Text>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Summary Stats */}
      {weeklyStats?.summary && (
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.summaryGrid}>
            <GlassCard style={styles.summaryCard} index={1}>
              <Ionicons name="barbell-outline" size={24} color={colors.primary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {period === 'weekly' ? weeklyStats.summary.totalWorkouts : monthlyStats?.summary?.totalWorkouts || 0}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Workouts</Text>
            </GlassCard>
            <GlassCard style={styles.summaryCard} index={2}>
              <Ionicons name="footsteps-outline" size={24} color={colors.accentGreen} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {((period === 'weekly' ? weeklyStats.summary.totalSteps : 0) / 1000).toFixed(1)}k
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Steps</Text>
            </GlassCard>
            <GlassCard style={styles.summaryCard} index={3}>
              <Ionicons name="time-outline" size={24} color={colors.secondary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {period === 'weekly' ? weeklyStats.summary.totalActiveMinutes : 0}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Minutes</Text>
            </GlassCard>
            <GlassCard style={styles.summaryCard} index={4}>
              <Ionicons name="restaurant-outline" size={24} color={colors.accent} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {period === 'weekly' ? weeklyStats.summary.avgCalories : monthlyStats?.summary?.avgCalories || 0}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Avg Cal</Text>
            </GlassCard>
          </View>
        </Animated.View>
      )}

      {/* Calorie Chart */}
      {weeklyCalorieData.length > 0 && period === 'weekly' && (
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Calories This Week</Text>
          <GlassCard index={5}>
            <AnimatedBarChart data={weeklyCalorieData} height={160} />
          </GlassCard>
        </Animated.View>
      )}

      {/* Steps Chart */}
      {weeklyStepData.length > 0 && period === 'weekly' && (
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Steps This Week</Text>
          <GlassCard index={6}>
            <AnimatedBarChart data={weeklyStepData} height={160} barColor={colors.gradientGreen} />
          </GlassCard>
        </Animated.View>
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: 60 },
  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSize.hero, fontWeight: FontWeight.heavy },
  periodToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: BorderRadius.full, padding: 4, marginBottom: Spacing.lg },
  periodButton: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.full, alignItems: 'center' },
  periodText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  streakRow: { flexDirection: 'row', alignItems: 'center' },
  streakItem: { flex: 1, alignItems: 'center', gap: 4 },
  streakDivider: { width: 1, height: 60 },
  streakValue: { fontSize: FontSize.hero, fontWeight: FontWeight.heavy },
  streakLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md },
  summaryCard: { width: (width - Spacing.md * 2 - Spacing.sm) / 2 - 1, alignItems: 'center', gap: 4 },
  summaryValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  summaryLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: Spacing.lg, marginBottom: Spacing.sm },
});
