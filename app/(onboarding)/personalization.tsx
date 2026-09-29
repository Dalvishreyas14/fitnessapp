import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { useUserStore } from '../../src/store/userStore';
import { storage } from '../../src/utils/storage';

const daysOptions = ['1', '2', '3', '4', '5', '6', '7'];
const durationOptions = ['15 min', '30 min', '45 min', '60 min', '90 min'];
const styleOptions = [
  { id: 'ppl', name: 'Push/Pull/Legs', icon: '🔄' },
  { id: 'upper-lower', name: 'Upper/Lower', icon: '↕️' },
  { id: 'bro-split', name: 'Bro Split', icon: '💪' },
  { id: 'full-body', name: 'Full Body', icon: '🏃' },
  { id: 'custom', name: 'AI Decides', icon: '🤖' },
];

export default function PersonalizationScreen() {
  const [days, setDays] = useState('4');
  const [duration, setDuration] = useState('60 min');
  const [style, setStyle] = useState('custom');
  const setProfile = useUserStore((s) => s.setProfile);
  const saveProfile = useUserStore((s) => s.saveProfile);

  const handleComplete = async () => {
    setProfile({ daysPerWeek: days, workoutDuration: duration, trainingStyle: style });
    await saveProfile();
    await storage.setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Final touches</Text>
          <Text style={styles.subtitle}>Help us perfect your workout plan</Text>
        </View>

        {/* Days per week */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Days available per week</Text>
          <View style={styles.chipRow}>
            {daysOptions.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, days === d && styles.chipSelected]}
                onPress={() => setDays(d)}
              >
                <Text style={[styles.chipText, days === d && styles.chipTextSelected]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred workout duration</Text>
          <View style={styles.chipRow}>
            {durationOptions.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, styles.chipWide, duration === d && styles.chipSelected]}
                onPress={() => setDuration(d)}
              >
                <Text style={[styles.chipText, duration === d && styles.chipTextSelected]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Training style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training style</Text>
          <View style={styles.styleGrid}>
            {styleOptions.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.styleCard, style === s.id && styles.styleCardSelected]}
                onPress={() => setStyle(s.id)}
              >
                <Text style={styles.styleIcon}>{s.icon}</Text>
                <Text style={[styles.styleName, style === s.id && styles.styleNameSelected]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Complete Setup" onPress={handleComplete} size="lg" />
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
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 48,
    alignItems: 'center',
  },
  chipWide: {
    paddingHorizontal: spacing.lg,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  chipText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  styleGrid: {
    gap: spacing.sm,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.md,
  },
  styleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  styleIcon: {
    fontSize: 22,
  },
  styleName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  styleNameSelected: {
    color: colors.primary,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
});
