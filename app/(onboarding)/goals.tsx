import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { goals } from '../../src/constants/exercises';
import { useUserStore } from '../../src/store/userStore';

export default function GoalsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const setProfile = useUserStore((s) => s.setProfile);

  const toggleGoal = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setProfile({ goals: selected });
    router.push('/(onboarding)/experience');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>What is your{'\n'}primary goal?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <View style={styles.grid}>
          {goals.map((goal) => {
            const isSelected = selected.includes(goal);
            return (
              <TouchableOpacity
                key={goal}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                onPress={() => toggleGoal(goal)}
                activeOpacity={0.7}
              >
                <Text style={styles.goalIcon}>🎯</Text>
                <Text style={[styles.goalName, isSelected && styles.goalNameSelected]}>
                  {goal}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={selected.length === 0}
        />
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
  grid: {
    gap: spacing.md,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  goalIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  goalName: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  goalNameSelected: {
    color: colors.primary,
  },
  goalDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  goalDescSelected: {
    color: colors.textPrimary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
});
