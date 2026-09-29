import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="active" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="exercise/[id]" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
