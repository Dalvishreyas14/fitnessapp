import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';
import { storage } from '../src/utils/storage';
import { useUserStore } from '../src/store/userStore';

export default function Index() {
  const router = useRouter();
  const loadProfile = useUserStore((s) => s.loadProfile);

  useEffect(() => {
    let mounted = true;
    async function redirect() {
      try {
        const complete = await storage.isOnboardingComplete();
        if (complete) {
          await loadProfile();
        }
        if (mounted) {
          router.replace(complete ? '/(tabs)' : '/(onboarding)/welcome');
        }
      } catch {
        if (mounted) {
          router.replace('/(onboarding)/welcome');
        }
      }
    }
    redirect();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
