import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, Spacing } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  index?: number;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  index = 0,
  noPadding = false,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(500).springify()}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surfaceGlass : colors.cardGlass,
          borderColor: colors.borderLight,
        },
        style,
      ]}
    >
      {isDark && (
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surfaceGlass }]} />
        </BlurView>
      )}
      <View style={[styles.content, noPadding && { padding: 0 }]}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
  },
});
