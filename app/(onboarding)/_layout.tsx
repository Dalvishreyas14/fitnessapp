import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="experience" />
      <Stack.Screen name="location" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="body-profile" />
      <Stack.Screen name="body-scan" />
      <Stack.Screen name="personalization" />
    </Stack>
  );
}
