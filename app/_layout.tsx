import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../src/theme/colors';
import { storage } from '../src/utils/storage';
import { useUserStore } from '../src/store/userStore';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadProfile = useUserStore((s) => s.loadProfile);

  useEffect(() => {
    async function prepare() {
      try {
        await storage.isOnboardingComplete().then(async (complete) => {
          if (complete) {
            await loadProfile();
          }
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="workout" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
