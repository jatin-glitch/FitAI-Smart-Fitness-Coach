import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FontSize, FontWeight } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
  bgColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color,
  label,
  value,
  bgColor,
}) => {
  const { colors } = useTheme();
  const animatedProgress = useSharedValue(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = color || colors.primary;

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(progress, 1), {
      duration: 1200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor || colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.labelContainer}>
        {value && (
          <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        )}
        {label && (
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
});
