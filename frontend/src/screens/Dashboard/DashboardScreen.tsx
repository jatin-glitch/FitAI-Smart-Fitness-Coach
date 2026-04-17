import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { ProgressRing } from '../../components/common/ProgressRing';
import { AnimatedBarChart } from '../../components/charts/AnimatedBarChart';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store/appStore';
import { progressAPI } from '../../api/client';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

const motivationalQuotes = [
  "Push yourself, because no one else is going to do it for you.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Your body can stand almost anything. It's your mind you need to convince.",
  "Don't limit your challenges. Challenge your limits.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
];

export const DashboardScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const user = useAppStore((s) => s.user);
  const dailyStats = useAppStore((s) => s.dailyStats);
  const setDailyStats = useAppStore((s) => s.setDailyStats);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const loadData = async () => {
    try {
      const [weeklyRes, insightsRes] = await Promise.allSettled([
        progressAPI.getWeeklyStats(),
        progressAPI.getInsights(),
      ]);

      if (weeklyRes.status === 'fulfilled') {
        const days = weeklyRes.value.data.days || [];
        setWeeklyData(
          days.map((d: any) => {
            const dateObj = new Date(d.date + 'T00:00:00');
            return { label: dayNames[dateObj.getDay()], value: d.calories?.consumed || 0 };
          })
        );
        if (days.length > 0) {
          const today = days[days.length - 1];
          setDailyStats({
            calories: today.calories,
            steps: today.steps,
            workoutsCompleted: today.workoutsCompleted,
            activeMinutes: today.activeMinutes,
          });
        }
      }

      if (insightsRes.status === 'fulfilled') {
        setInsights(insightsRes.value.data.insights || []);
      }
    } catch { }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calorieProgress = dailyStats.calories.goal > 0
    ? dailyStats.calories.consumed / dailyStats.calories.goal
    : 0;
  const stepProgress = dailyStats.steps.goal > 0
    ? dailyStats.steps.count / dailyStats.steps.goal
    : 0;
  const waterProgress = dailyStats.water.goal > 0
    ? dailyStats.water.glasses / dailyStats.water.goal
    : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting()}</Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'Athlete'} 💪
          </Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}>
          <Ionicons name="flame" size={20} color={colors.accentOrange} />
          <Text style={[styles.streakText, { color: colors.text }]}>
            {user?.streak?.current || 0}
          </Text>
        </View>
      </Animated.View>

      {/* Quote */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <GlassCard index={0}>
          <LinearGradient
            colors={[...colors.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quoteGradient}
          >
            <Ionicons name="sparkles" size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.quoteText}>{quote}</Text>
          </LinearGradient>
        </GlassCard>
      </Animated.View>

      {/* Progress Rings */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Progress</Text>
        <GlassCard index={1}>
          <View style={styles.ringsContainer}>
            <ProgressRing
              progress={calorieProgress}
              size={100}
              strokeWidth={10}
              color={colors.primary}
              value={`${dailyStats.calories.consumed}`}
              label="Calories"
            />
            <ProgressRing
              progress={stepProgress}
              size={100}
              strokeWidth={10}
              color={colors.accentGreen}
              value={`${dailyStats.steps.count}`}
              label="Steps"
            />
            <ProgressRing
              progress={waterProgress}
              size={100}
              strokeWidth={10}
              color={colors.secondary}
              value={`${dailyStats.water.glasses}`}
              label="Water"
            />
          </View>
        </GlassCard>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard} index={2}>
            <Ionicons name="barbell-outline" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {dailyStats.workoutsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
          </GlassCard>
          <GlassCard style={styles.statCard} index={3}>
            <Ionicons name="time-outline" size={24} color={colors.accentGreen} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {dailyStats.activeMinutes}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Minutes</Text>
          </GlassCard>
          <GlassCard style={styles.statCard} index={4}>
            <Ionicons name="flame-outline" size={24} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {dailyStats.calories.burned}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Burned</Text>
          </GlassCard>
        </View>
      </Animated.View>

      {/* AI Features */}
      <Animated.View entering={FadeInDown.delay(350).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Features</Text>
        <View style={styles.aiFeaturesRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Posture')}
            style={{ flex: 1, marginRight: Spacing.sm }}
          >
            <GlassCard index={5} style={styles.aiCard}>
              <LinearGradient
                colors={['#00E676', '#00BCD4']}
                style={styles.aiCardIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="scan" size={22} color="#FFF" />
              </LinearGradient>
              <Text style={[styles.aiCardTitle, { color: colors.text }]}>Posture{'\n'}Check</Text>
              <Text style={[styles.aiCardSub, { color: colors.textSecondary }]}>AI detection</Text>
            </GlassCard>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('VoiceCoach')}
            style={{ flex: 1 }}
          >
            <GlassCard index={6} style={styles.aiCard}>
              <LinearGradient
                colors={['#6C63FF', '#00D9FF']}
                style={styles.aiCardIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="mic" size={22} color="#FFF" />
              </LinearGradient>
              <Text style={[styles.aiCardTitle, { color: colors.text }]}>Voice{'\n'}Coach</Text>
              <Text style={[styles.aiCardSub, { color: colors.textSecondary }]}>Real-time</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Weekly Chart */}
      {weeklyData.length > 0 && (
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Calories</Text>
          <GlassCard index={5}>
            <AnimatedBarChart data={weeklyData} height={160} />
          </GlassCard>
        </Animated.View>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
          {insights.map((insight, idx) => (
            <GlassCard key={idx} index={6 + idx} style={{ marginBottom: Spacing.sm }}>
              <View style={styles.insightRow}>
                <View style={[styles.insightIcon, {
                  backgroundColor: insight.type === 'success' ? colors.accentGreen + '20' :
                    insight.type === 'warning' ? colors.accentYellow + '20' : colors.primary + '20'
                }]}>
                  <Ionicons
                    name={
                      insight.type === 'success' ? 'trophy' :
                        insight.type === 'warning' ? 'alert-circle' :
                          insight.type === 'achievement' ? 'flame' : 'bulb'
                    }
                    size={20}
                    color={
                      insight.type === 'success' ? colors.accentGreen :
                        insight.type === 'warning' ? colors.accentYellow : colors.primary
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.insightTitle, { color: colors.text }]}>{insight.title}</Text>
                  <Text style={[styles.insightMessage, { color: colors.textSecondary }]}>
                    {insight.message}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </Animated.View>
      )}

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.quickActions}>
        <GradientButton
          title="Start Workout"
          onPress={() => navigation.navigate('Workouts')}
          icon={<Ionicons name="play" size={18} color="#FFF" />}
          style={{ flex: 1, marginRight: Spacing.sm }}
        />
        <GradientButton
          title="Log Meal"
          onPress={() => navigation.navigate('Calories')}
          variant="accent"
          icon={<Ionicons name="restaurant" size={18} color="#FFF" />}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  userName: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  streakText: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  quoteGradient: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.lg, margin: -Spacing.md },
  quoteText: { flex: 1, color: '#FFF', fontSize: FontSize.sm, fontWeight: FontWeight.medium, lineHeight: 20 },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  ringsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.sm },
  statsGrid: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  statLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  insightRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  insightIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  insightMessage: { fontSize: FontSize.sm, marginTop: 2, lineHeight: 18 },
  quickActions: { flexDirection: 'row', marginTop: Spacing.lg },
  aiFeaturesRow: { flexDirection: 'row', marginTop: Spacing.sm },
  aiCard: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  aiCardIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  aiCardTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, textAlign: 'center', lineHeight: 18 },
  aiCardSub: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
});
