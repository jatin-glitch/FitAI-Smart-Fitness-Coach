import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';


interface GradientButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'accent' | 'green' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!loading && !disabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {
        // Ignore haptics error on certain web browsers
      }
      onPress();
    }
  };

  const gradientColors =
    variant === 'accent'
      ? colors.gradientAccent
      : variant === 'green'
        ? colors.gradientGreen
        : colors.gradient;

  const heights = { sm: 42, md: 52, lg: 60 };
  const fontSizes = { sm: FontSize.sm, md: FontSize.md, lg: FontSize.lg };

  if (variant === 'outline') {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        <Animated.View
          style={[
            animatedStyle,
            styles.button,
            { height: heights[size], borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' },
            style,
          ]}
        >
          {icon}
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[styles.buttonText, { fontSize: fontSizes[size], color: colors.primary }, textStyle]}>
              {title}
            </Text>
          )}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }, style]}>
        <LinearGradient
          colors={[...gradientColors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, { height: heights[size] }]}
        >
          {icon}
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={[styles.buttonText, { fontSize: fontSizes[size] }, textStyle]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
});
