import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { useUserStore } from '../../src/store/userStore';

export default function BodyProfileScreen() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const setProfile = useUserStore((s) => s.setProfile);

  const handleContinue = () => {
    setProfile({ age, height, weight });
    router.push('/(onboarding)/body-scan');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/body-scan');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Body &{'\n'}Measurements</Text>
          <Text style={styles.subtitle}>
            Optional — this helps us personalize your workouts and track progress.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="25"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="75"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
          <Text style={styles.privacyText}>
            Your data is stored locally on your device and is never shared without your explicit consent.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...typography.body,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  privacyNote: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  privacyText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  skipText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
});
