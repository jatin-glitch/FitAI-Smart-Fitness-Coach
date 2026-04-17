import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';
import { Text } from 'react-native';

interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  height?: number;
  barColor?: readonly [string, string];
}

export const AnimatedBarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  height = 150,
  barColor,
}) => {
  const { colors } = useTheme();
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const gradient = barColor || colors.gradient;

  return (
    <Animated.View entering={FadeIn.duration(600)} style={[styles.container, { height }]}>
      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <BarItem
            key={index}
            label={item.label}
            value={item.value}
            maxValue={max}
            height={height - 30}
            gradient={gradient}
            index={index}
            colors={colors}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const BarItem: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  height: number;
  gradient: readonly [string, string];
  index: number;
  colors: any;
}> = ({ label, value, maxValue, height, gradient, index, colors }) => {
  const barHeight = useSharedValue(0);
  const targetHeight = (value / maxValue) * height;

  useEffect(() => {
    barHeight.value = withTiming(targetHeight, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [value, maxValue]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    height: barHeight.value,
  }));

  return (
    <View style={styles.barWrapper}>
      <View style={[styles.barTrack, { height, backgroundColor: colors.border }]}>
        <Animated.View style={[styles.bar, animatedBarStyle]}>
          <LinearGradient
            colors={[...gradient]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barTrack: {
    width: '70%',
    maxWidth: 36,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    minHeight: 4,
  },
  barLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 6,
  },
});
