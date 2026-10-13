import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark } from '../components/LogoMark';
import { ScreenProps } from '../navigation/types';

export default function WelcomeScreen({ navigation }: ScreenProps<'Welcome'>) {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.hero}>
        <LogoMark size={112} />
        <Text variant="headlineMedium" style={styles.title}>
          Get things done.
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Just a click away from planning your tasks.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => navigation.navigate('SignUp')} contentStyle={styles.btn}>
          Get started
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Login')}>
          I already have an account
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontWeight: '700', marginTop: 16 },
  subtitle: { textAlign: 'center' },
  actions: { gap: 8, paddingBottom: 16 },
  btn: { paddingVertical: 6 },
});
