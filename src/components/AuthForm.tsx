import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { EMAIL_REGEX } from '../utils/authErrors';
import { LogoMark } from './LogoMark';

interface Props {
  mode: 'login' | 'signup';
  onSwitchMode: () => void;
}

const COPY = {
  login: {
    title: 'Welcome back!',
    submit: 'Log in',
    switchText: "Don't have an account?",
    switchAction: 'Get started!',
  },
  signup: {
    title: "Let's get started!",
    submit: 'Sign up',
    switchText: 'Already have an account?',
    switchAction: 'Log in',
  },
} as const;

export function AuthForm({ mode, onSwitchMode }: Props) {
  const theme = useTheme();
  const copy = COPY[mode];

  const { signIn, signUp, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Don't carry an error from one screen to the other.
  useEffect(() => clearError, [clearError]);

  const emailError = submitted && !EMAIL_REGEX.test(email.trim()) ? 'Enter a valid email address.' : '';
  const passwordError =
    submitted && password.length < 6 ? 'Password must be at least 6 characters.' : '';

  const handleSubmit = async () => {
    setSubmitted(true);
    clearError();
    if (!EMAIL_REGEX.test(email.trim()) || password.length < 6) return;
    if (mode === 'login') await signIn(email, password);
    else await signUp(email, password);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <LogoMark />
            <Text variant="headlineSmall" style={styles.title}>
              {copy.title}
            </Text>
          </View>

          <TextInput
            label="Email address"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            error={!!emailError}
            disabled={loading}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            error={!!passwordError}
            disabled={loading}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
          />
          <HelperText type="error" visible={!!passwordError}>
            {passwordError}
          </HelperText>

          {/* Server-side errors, e.g. wrong credentials or email already in use. */}
          <HelperText type="error" visible={!!error} style={styles.serverError}>
            {error}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            contentStyle={styles.btn}
          >
            {copy.submit}
          </Button>

          <View style={styles.switchRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {copy.switchText}
            </Text>
            <Button mode="text" compact onPress={onSwitchMode} disabled={loading}>
              {copy.switchAction}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', gap: 16, marginBottom: 32 },
  title: { fontWeight: '700' },
  serverError: { fontSize: 14 },
  btn: { paddingVertical: 6 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
});
