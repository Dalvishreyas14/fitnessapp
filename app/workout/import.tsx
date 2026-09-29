import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge, Button } from '../../src/components/ui';

const difficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;
const locations = ['Home', 'Gym'] as const;
const durations = ['30', '45', '60', '90'] as const;
const muscleGroups = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Glutes', 'Full Body'];

export default function ImportWorkoutScreen() {
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [location, setLocation] = useState<string>('Gym');
  const [duration, setDuration] = useState<string>('45');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['Chest', 'Back']);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import Workout</Text>
        <Badge label="Remix with AI" variant="primary" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Tell us your preferences and we'll generate a personalized workout for you.
        </Text>

        {/* Step 1: Difficulty */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Select Difficulty</Text>
          </View>
          <View style={styles.radioGroup}>
            {difficulties.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.radioItem, difficulty === d && styles.radioItemActive]}
                onPress={() => setDifficulty(d)}
              >
                <View style={[styles.radio, difficulty === d && styles.radioSelected]}>
                  {difficulty === d && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioLabel, difficulty === d && styles.radioLabelActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Step 2: Location */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Select Location</Text>
          </View>
          <View style={styles.radioGroup}>
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[styles.radioItem, location === loc && styles.radioItemActive]}
                onPress={() => setLocation(loc)}
              >
                <View style={[styles.radio, location === loc && styles.radioSelected]}>
                  {location === loc && <View style={styles.radioInner} />}
                </View>
                <Ionicons
                  name={loc === 'Home' ? 'home-outline' : 'barbell-outline'}
                  size={18}
                  color={location === loc ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.radioLabel, location === loc && styles.radioLabelActive]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Step 3: Duration */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Duration (minutes)</Text>
          </View>
          <View style={styles.durationGrid}>
            {durations.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.durationItem, duration === d && styles.durationItemActive]}
                onPress={() => setDuration(d)}
              >
                <Text style={[styles.durationNumber, duration === d && styles.durationNumberActive]}>
                  {d}
                </Text>
                <Text style={[styles.durationLabel, duration === d && styles.durationLabelActive]}>
                  min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Step 4: Muscle Focus */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Muscle Focus</Text>
          </View>
          <View style={styles.chipGrid}>
            {muscleGroups.map((muscle) => {
              const isSelected = selectedMuscles.includes(muscle);
              return (
                <TouchableOpacity
                  key={muscle}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => toggleMuscle(muscle)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {muscle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Advanced Toggle */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Ionicons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.advancedToggleText}>Customize</Text>
        </TouchableOpacity>

        {showAdvanced && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Options</Text>
            <View style={styles.advancedOption}>
              <Text style={styles.advancedLabel}>Rest Time Between Sets</Text>
              <View style={styles.chipGrid}>
                {['30s', '60s', '90s', '120s'].map((rest) => (
                  <TouchableOpacity key={rest} style={styles.chip}>
                    <Text style={styles.chipText}>{rest}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.advancedOption}>
              <Text style={styles.advancedLabel}>Equipment Available</Text>
              <View style={styles.chipGrid}>
                {['Dumbbells', 'Barbell', 'Cables', 'Bands', 'None'].map((eq) => (
                  <TouchableOpacity key={eq} style={styles.chip}>
                    <Text style={styles.chipText}>{eq}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>
        )}

        <View style={styles.buttonGroup}>
          <Button
            title="Generate Workout"
            onPress={() => router.push('/workout/active')}
            size="lg"
          />
          <Button
            title="Customize Further"
            onPress={() => setShowAdvanced(!showAdvanced)}
            variant="secondary"
            size="lg"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    flex: 1,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    ...typography.captionBold,
    color: colors.background,
    fontWeight: '800',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.white,
    flex: 1,
  },
  radioGroup: {
    gap: spacing.md,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  radioItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  radioLabelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  durationGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  durationItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  durationItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  durationNumber: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  durationNumberActive: {
    color: colors.primary,
  },
  durationLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  durationLabelActive: {
    color: colors.primary,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  chipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  advancedToggleText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  advancedOption: {
    marginTop: spacing.lg,
  },
  advancedLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  buttonGroup: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
