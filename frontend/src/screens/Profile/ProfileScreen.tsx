import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store/appStore';
import { authAPI } from '../../api/client';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

export const ProfileScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const setTheme = useAppStore((s) => s.setTheme);
  const logout = useAppStore((s) => s.logout);
  const themeMode = useAppStore((s) => s.themeMode);

  const [editing, setEditing] = useState(false);
  const [height, setHeight] = useState(String(user?.profile?.height || ''));
  const [weight, setWeight] = useState(String(user?.profile?.weight || ''));
  const [age, setAge] = useState(String(user?.profile?.age || ''));

  const handleSaveProfile = async () => {
    try {
      const { data } = await authAPI.updateProfile({
        height: Number(height) || null,
        weight: Number(weight) || null,
        age: Number(age) || null,
      });
      setUser(data.user);
      setEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const themeOptions: Array<{ value: 'dark' | 'light' | 'system'; label: string; icon: any }> = [
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'light', label: 'Light', icon: 'sunny' },
    { value: 'system', label: 'System', icon: 'phone-portrait' },
  ];

  const goalLabels: Record<string, string> = {
    lose_weight: 'Lose Weight',
    build_muscle: 'Build Muscle',
    stay_fit: 'Stay Fit',
    gain_weight: 'Gain Weight',
    improve_flexibility: 'Improve Flexibility',
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </Animated.View>

      {/* Avatar Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <GlassCard index={0}>
          <View style={styles.avatarRow}>
            <LinearGradient
              colors={[...colors.gradient]}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User'}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
              <View style={styles.goalBadge}>
                <Ionicons name="trophy" size={14} color={colors.accentYellow} />
                <Text style={[styles.goalText, { color: colors.textSecondary }]}>
                  {goalLabels[user?.profile?.fitnessGoal || 'stay_fit']}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Body Stats */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Stats</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={[styles.editText, { color: colors.primary }]}>
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
        <GlassCard index={1}>
          {editing ? (
            <View style={styles.editForm}>
              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Height (cm)</Text>
                <TextInput
                  style={[styles.editInput, { color: colors.text, backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Weight (kg)</Text>
                <TextInput
                  style={[styles.editInput, { color: colors.text, backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Age</Text>
                <TextInput
                  style={[styles.editInput, { color: colors.text, backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>
              <GradientButton title="Save" onPress={handleSaveProfile} size="sm" style={{ marginTop: Spacing.sm }} />
            </View>
          ) : (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {user?.profile?.height || '--'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>cm</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {user?.profile?.weight || '--'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>kg</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {user?.profile?.age || '--'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>years</Text>
              </View>
            </View>
          )}
        </GlassCard>
      </Animated.View>

      {/* Theme Settings */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
          Appearance
        </Text>
        <GlassCard index={2}>
          <View style={styles.themeRow}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setTheme(option.value);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: themeMode === option.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={themeMode === option.value ? '#FFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: themeMode === option.value ? '#FFF' : colors.textSecondary },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>
      </Animated.View>

      {/* Settings */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.lg }]}>
          Settings
        </Text>
        <GlassCard index={3}>
          {[
            { label: 'Notifications', icon: 'notifications-outline', key: 'notificationsEnabled' },
            { label: 'Voice Coach', icon: 'mic-outline', key: 'voiceCoachEnabled' },
            { label: 'Haptic Feedback', icon: 'phone-portrait-outline', key: 'hapticFeedback' },
          ].map((setting, idx) => (
            <View
              key={setting.key}
              style={[
                styles.settingRow,
                idx < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Ionicons name={setting.icon as any} size={20} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{setting.label}</Text>
              <Switch
                value={(user?.preferences as any)?.[setting.key] ?? true}
                trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
                thumbColor={colors.primary}
              />
            </View>
          ))}
        </GlassCard>
      </Animated.View>

      {/* Logout */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)} style={{ marginTop: Spacing.xl }}>
        <GradientButton
          title="Sign Out"
          onPress={handleLogout}
          variant="accent"
          icon={<Ionicons name="log-out-outline" size={20} color="#FFF" />}
        />
      </Animated.View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: 60 },
  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSize.hero, fontWeight: FontWeight.heavy },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  userName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  userEmail: { fontSize: FontSize.sm, marginTop: 2 },
  goalBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  goalText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  editText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy },
  statLabel: { fontSize: FontSize.sm, marginTop: 2 },
  statDivider: { width: 1, height: 40 },
  editForm: { gap: Spacing.sm },
  editRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  editInput: { width: 100, height: 40, borderRadius: BorderRadius.md, textAlign: 'center', borderWidth: 1, fontSize: FontSize.md },
  themeRow: { flexDirection: 'row', gap: Spacing.sm },
  themeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: BorderRadius.md, borderWidth: 1 },
  themeOptionText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 12 },
  settingLabel: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium },
});
