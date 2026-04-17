import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { GradientButton } from '../../components/common/GradientButton';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';
import { useAppStore } from '../../store/appStore';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'fitness-outline' as const,
    title: 'AI-Powered Workouts',
    description: 'Personalized workout plans that adapt to your fitness level and goals using smart AI.',
    gradient: ['#6C63FF', '#8B83FF'] as const,
  },
  {
    id: '2',
    icon: 'body-outline' as const,
    title: 'Posture Detection',
    description: 'Real-time posture analysis during workouts ensures perfect form every time.',
    gradient: ['#00D9FF', '#00E676'] as const,
  },
  {
    id: '3',
    icon: 'nutrition-outline' as const,
    title: 'Smart Nutrition',
    description: 'Track calories, get meal suggestions, and optimize your diet for peak performance.',
    gradient: ['#FF6B6B', '#FF9100'] as const,
  },
  {
    id: '4',
    icon: 'trending-up-outline' as const,
    title: 'Track Progress',
    description: 'Beautiful charts and insights show your journey. Stay motivated with streaks and achievements.',
    gradient: ['#00E676', '#00BCD4'] as const,
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const { colors, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const setOnboarding = useAppStore((s) => s.setOnboarding);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      setCurrentIndex(Number(viewableItems[0].index));
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setOnboarding(true);
    navigation.replace('Auth');
  };

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => (
    <View style={[styles.slide, { width }]}>
      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={styles.iconContainer}
      >
        <LinearGradient
          colors={[...item.gradient]}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={item.icon} size={64} color="#FFF" />
        </LinearGradient>
      </Animated.View>
      <Animated.Text
        entering={FadeInUp.delay(400).duration(500)}
        style={[styles.title, { color: colors.text }]}
      >
        {item.title}
      </Animated.Text>
      <Animated.Text
        entering={FadeInUp.delay(500).duration(500)}
        style={[styles.description, { color: colors.textSecondary }]}
      >
        {item.description}
      </Animated.Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeIn.delay(100)} style={styles.skipContainer}>
        {currentIndex < slides.length - 1 && (
          <Text
            style={[styles.skipText, { color: colors.textSecondary }]}
            onPress={handleGetStarted}
          >
            Skip
          </Text>
        )}
      </Animated.View>

      <Animated.FlatList
        ref={flatListRef as any}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <PaginationDot
              key={index}
              index={index}
              scrollX={scrollX}
              colors={colors}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            size="lg"
            style={{ width: width - Spacing.xl * 2 }}
          />
        </View>
      </View>
    </View>
  );
};

const PaginationDot = ({
  index,
  scrollX,
  colors,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
  colors: any;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);

    return {
      width: dotWidth,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: colors.primary },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    zIndex: 10,
  },
  skipText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.heavy,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.lg,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },
  bottomContainer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
