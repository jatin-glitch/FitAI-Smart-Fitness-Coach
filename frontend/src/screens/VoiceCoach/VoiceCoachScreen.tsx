import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppStore } from '../../store/appStore';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

const coachMessages = [
  { text: "Great form! Keep pushing through!", category: "encouragement" },
  { text: "Remember to breathe steadily.", category: "technique" },
  { text: "You're halfway there! Don't give up!", category: "progress" },
  { text: "Engage your core for better stability.", category: "technique" },
  { text: "Amazing effort! You're getting stronger!", category: "encouragement" },
  { text: "Rest if you need to, then come back stronger.", category: "recovery" },
  { text: "Focus on the mind-muscle connection.", category: "technique" },
  { text: "You've burned over 200 calories! Keep going!", category: "progress" },
];

export const VoiceCoachScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const user = useAppStore((s) => s.user);

  const pulseScale = useSharedValue(1);
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      pulseScale.value = withRepeat(withTiming(1.2, { duration: 800 }), -1, true);
      waveOffset.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);

      const interval = setInterval(() => {
        const msg = coachMessages[messageIndex % coachMessages.length];
        setCurrentMessage(msg.text);
        Speech.speak(msg.text, { rate: 0.9, pitch: 1.0, volume });
        setMessageIndex((i) => i + 1);
      }, 6000);

      // Initial message
      const firstMsg = `Let's go, ${user?.name || 'champion'}! Time to crush your workout!`;
      setCurrentMessage(firstMsg);
      Speech.speak(firstMsg, { rate: 0.9, pitch: 1.0, volume });

      return () => {
        clearInterval(interval);
        Speech.stop();
      };
    } else {
      pulseScale.value = withSpring(1);
      waveOffset.value = withSpring(0);
    }
  }, [isActive]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const toggleCoach = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isActive) {
      Speech.stop();
      setCurrentMessage('');
    }
    setIsActive(!isActive);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Voice Coach</Text>
      </Animated.View>

      {/* Coach Visual */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.coachArea}>
        <Animated.View style={pulseStyle}>
          <LinearGradient
            colors={isActive ? ['#00E676', '#00BCD4'] : [...colors.gradient]}
            style={styles.coachCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={isActive ? 'mic' : 'mic-off'}
              size={60}
              color="rgba(255,255,255,0.9)"
            />
          </LinearGradient>
        </Animated.View>

        <Text style={[styles.statusText, { color: isActive ? colors.accentGreen : colors.textSecondary }]}>
          {isActive ? 'Coach Active' : 'Coach Inactive'}
        </Text>
      </Animated.View>

      {/* Current Message */}
      {currentMessage ? (
        <Animated.View entering={FadeInDown.duration(400)} style={{ paddingHorizontal: Spacing.md }}>
          <GlassCard index={0}>
            <View style={styles.messageRow}>
              <View style={[styles.messageIcon, { backgroundColor: colors.accentGreen + '20' }]}>
                <Ionicons name="chatbubble" size={20} color={colors.accentGreen} />
              </View>
              <Text style={[styles.messageText, { color: colors.text }]}>{currentMessage}</Text>
            </View>
          </GlassCard>
        </Animated.View>
      ) : null}

      {/* Controls */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.controls}>
        {/* Volume Control */}
        <GlassCard index={1} style={{ marginHorizontal: Spacing.md }}>
          <Text style={[styles.controlLabel, { color: colors.text }]}>Volume</Text>
          <View style={styles.volumeRow}>
            {[0.25, 0.5, 0.75, 1.0].map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => {
                  setVolume(v);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.volumeBtn,
                  {
                    backgroundColor: volume === v ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.volumeBtnText, { color: volume === v ? '#FFF' : colors.textSecondary }]}>
                  {Math.round(v * 100)}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Coach Tips */}
        <GlassCard index={2} style={{ marginHorizontal: Spacing.md, marginTop: Spacing.md }}>
          <View style={styles.tipRow}>
            <Ionicons name="bulb" size={20} color={colors.accentYellow} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Voice coach provides real-time motivation and technique reminders during workouts.
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Toggle Button */}
      <View style={styles.toggleContainer}>
        <GradientButton
          title={isActive ? 'Stop Coach' : 'Start Voice Coach'}
          onPress={toggleCoach}
          variant={isActive ? 'accent' : 'primary'}
          size="lg"
          icon={<Ionicons name={isActive ? 'stop' : 'play'} size={20} color="#FFF" />}
          style={{ width: width - Spacing.lg * 2 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingTop: 60, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.hero, fontWeight: FontWeight.heavy },
  coachArea: { alignItems: 'center', paddingVertical: Spacing.xxl },
  coachCircle: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  statusText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginTop: Spacing.md },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  messageIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  messageText: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium, lineHeight: 22 },
  controls: { marginTop: Spacing.lg },
  controlLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  volumeRow: { flexDirection: 'row', gap: Spacing.sm },
  volumeBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1 },
  volumeBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  tipText: { flex: 1, fontSize: FontSize.sm, lineHeight: 20 },
  toggleContainer: { position: 'absolute', bottom: 40, alignSelf: 'center' },
});
