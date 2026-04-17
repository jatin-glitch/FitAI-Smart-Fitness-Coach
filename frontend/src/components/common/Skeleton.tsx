import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useEffect } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}) => {
  const { colors } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.surfaceLight,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <Skeleton height={16} width="60%" />
    <View style={{ height: 8 }} />
    <Skeleton height={12} width="90%" />
    <View style={{ height: 8 }} />
    <Skeleton height={12} width="75%" />
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
});
