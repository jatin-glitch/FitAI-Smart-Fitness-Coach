import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { GradientButton } from '../../components/common/GradientButton';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';
import { authAPI } from '../../api/client';
import { useAppStore } from '../../store/appStore';

export const LoginScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAppStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      setAuth(data.token, data.user);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <LinearGradient
            colors={[...colors.gradient]}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="fitness" size={40} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.appName, { color: colors.text }]}>FitAI</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Your Smart Fitness Coach
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.form}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Welcome Back</Text>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>

          <GradientButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={{ marginTop: Spacing.md }}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const RegisterScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAppStore((s) => s.setAuth);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register({ email, password, name });
      setAuth(data.token, data.user);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <LinearGradient
            colors={[...colors.gradient]}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="fitness" size={40} color="#FFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.form}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Create Account</Text>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <GradientButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            style={{ marginTop: Spacing.md }}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.heavy,
  },
  tagline: {
    fontSize: FontSize.md,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 56,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.md,
  },
  linkText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
