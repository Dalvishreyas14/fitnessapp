import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { experienceLevels } from '../../src/constants/exercises';
import { useUserStore } from '../../src/store/userStore';

export default function ExperienceScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const setProfile = useUserStore((s) => s.setProfile);

  const handleContinue = () => {
    setProfile({ experience: selected });
    router.push('/(onboarding)/location');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your{'\n'}training experience?</Text>
          <Text style={styles.subtitle}>This helps us calibrate your workouts</Text>
        </View>

        <View style={styles.options}>
          {experienceLevels.map((level) => {
            const isSelected = selected === level;
            return (
              <TouchableOpacity
                key={level}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(level)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardIcon}>💪</Text>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {level}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
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
          disabled={!selected}
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
  options: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.lg,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: 2,
  },
  cardTitleSelected: {
    color: colors.primary,
  },
  cardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cardDescSelected: {
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
});
