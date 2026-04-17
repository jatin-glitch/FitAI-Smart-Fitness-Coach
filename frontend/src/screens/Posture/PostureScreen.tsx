import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../../components/common/GlassCard';
import { GradientButton } from '../../components/common/GradientButton';
import { ProgressRing } from '../../components/common/ProgressRing';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export const PostureScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [isDetecting, setIsDetecting] = useState(false);
  const [postureScore, setPostureScore] = useState(0);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [exerciseType, setExerciseType] = useState('standing');

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isDetecting) {
      pulseScale.value = withRepeat(
        withTiming(1.15, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulseScale.value = withSpring(1);
    }
  }, [isDetecting]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const exerciseTypes = [
    { id: 'standing', label: 'Standing', icon: 'body' },
    { id: 'squat', label: 'Squat', icon: 'fitness' },
    { id: 'plank', label: 'Plank', icon: 'remove' },
    { id: 'pushup', label: 'Push-up', icon: 'arrow-down' },
  ];

  const simulateDetection = () => {
    setIsDetecting(true);
    setFeedback([]);
    setPostureScore(0);

    // Simulate AI detection with progressive feedback
    setTimeout(() => {
      setPostureScore(72);
      setFeedback([
        { type: 'correction', message: 'Straighten your back', bodyPart: 'back', severity: 'high' },
        { type: 'warning', message: 'Shoulders are slightly uneven', bodyPart: 'shoulders', severity: 'medium' },
      ]);
    }, 2000);

    setTimeout(() => {
      setPostureScore(85);
      setFeedback([
        { type: 'success', message: 'Good posture improvement!', bodyPart: 'general', severity: 'none' },
        { type: 'info', message: 'Keep your chin slightly tucked', bodyPart: 'head', severity: 'low' },
      ]);
    }, 5000);

    setTimeout(() => {
      setPostureScore(94);
      setFeedback([
        { type: 'success', message: 'Excellent posture! Keep it up.', bodyPart: 'general', severity: 'none' },
      ]);
      setIsDetecting(false);
    }, 8000);
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'success': return colors.accentGreen;
      case 'correction': return colors.accent;
      case 'warning': return colors.accentYellow;
      default: return colors.info;
    }
  };

  const getFeedbackIcon = (type: string): any => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'correction': return 'alert-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>AI Posture Check</Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      {/* Camera Preview Area */}
      <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.cameraArea}>
        <LinearGradient
          colors={isDetecting ? ['#00E676', '#00BCD4'] : [...colors.gradient]}
          style={styles.cameraGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={pulseStyle}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons
                name={isDetecting ? 'scan' : 'camera'}
                size={60}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.cameraText}>
                {isDetecting ? 'Analyzing posture...' : 'Camera Preview'}
              </Text>
            </View>
          </Animated.View>

          {/* Skeleton overlay indicators */}
          {isDetecting && (
            <View style={styles.skeletonOverlay}>
              {['Head', 'Shoulders', 'Hips', 'Knees'].map((part, idx) => (
                <View key={part} style={[styles.keypointDot, { top: 30 + idx * 50, left: width / 2 - 50 + (idx % 2) * 10 }]}>
                  <View style={styles.keypointInner} />
                </View>
              ))}
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Exercise Type Selector */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.exerciseSelector}>
        {exerciseTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => setExerciseType(type.id)}
            style={[
              styles.exerciseTypeBtn,
              {
                backgroundColor: exerciseType === type.id ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name={type.icon as any}
              size={18}
              color={exerciseType === type.id ? '#FFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.exerciseTypeText,
                { color: exerciseType === type.id ? '#FFF' : colors.textSecondary },
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Score & Feedback */}
      {postureScore > 0 && (
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ paddingHorizontal: Spacing.md }}>
          <View style={styles.scoreRow}>
            <ProgressRing
              progress={postureScore / 100}
              size={80}
              strokeWidth={8}
              color={postureScore >= 80 ? colors.accentGreen : postureScore >= 60 ? colors.accentYellow : colors.accent}
              value={`${postureScore}`}
              label="Score"
            />
            <View style={styles.feedbackList}>
              {feedback.map((fb, idx) => (
                <View key={idx} style={styles.feedbackItem}>
                  <Ionicons name={getFeedbackIcon(fb.type)} size={16} color={getFeedbackColor(fb.type)} />
                  <Text style={[styles.feedbackText, { color: colors.text }]}>{fb.message}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <GradientButton
          title={isDetecting ? 'Analyzing...' : 'Start Detection'}
          onPress={simulateDetection}
          disabled={isDetecting}
          loading={isDetecting}
          size="lg"
          variant={isDetecting ? 'green' : 'primary'}
          icon={!isDetecting ? <Ionicons name="scan" size={20} color="#FFF" /> : undefined}
          style={{ width: width - Spacing.lg * 2 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: 60, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  cameraArea: { marginHorizontal: Spacing.md, borderRadius: BorderRadius.xl, overflow: 'hidden', height: 280 },
  cameraGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cameraPlaceholder: { alignItems: 'center', gap: Spacing.sm },
  cameraText: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.md, fontWeight: FontWeight.medium },
  skeletonOverlay: { ...StyleSheet.absoluteFillObject },
  keypointDot: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(0,230,118,0.4)', alignItems: 'center', justifyContent: 'center' },
  keypointInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00E676' },
  exerciseSelector: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: Spacing.sm, marginTop: Spacing.md },
  exerciseTypeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: BorderRadius.md, borderWidth: 1 },
  exerciseTypeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md },
  feedbackList: { flex: 1, gap: 6 },
  feedbackItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  feedbackText: { fontSize: FontSize.sm, flex: 1 },
  actionContainer: { position: 'absolute', bottom: 40, alignSelf: 'center' },
});
