import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface WorkoutCompleteProps {
  workoutName: string;
  totalVolume: number;
  totalSets: number;
  duration: number;
  exerciseCount: number;
  xpEarned: number;
  calories?: number;
  prCount?: number;
  prNames?: string[];
  exercises?: { name: string; sets: number; volume: number }[];
  muscleGroups?: string[];
}

function formatVolume(volume: number): string {
  if (volume >= 10000) {
    return `${(volume / 1000).toFixed(1)}k`;
  }
  return volume.toLocaleString();
}

export function WorkoutComplete({
  workoutName,
  totalVolume,
  totalSets,
  duration,
  exerciseCount,
  xpEarned,
  calories,
  prCount = 0,
  prNames = [],
  exercises = [],
  muscleGroups = [],
}: WorkoutCompleteProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>🔥</Text>
      </View>
      <Text style={styles.title}>WORKOUT COMPLETE</Text>
      <Text style={styles.subtitle}>{workoutName}</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{duration}</Text>
          <Text style={styles.statLabel}>MINUTES</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSets}</Text>
          <Text style={styles.statLabel}>SETS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {formatVolume(totalVolume)}
          </Text>
          <Text style={styles.statLabel}>VOLUME (KG)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{calories ?? '—'}</Text>
          <Text style={styles.statLabel}>CALORIES</Text>
        </View>
      </View>

      {muscleGroups.length > 0 && (
        <View style={styles.muscleSection}>
          <Text style={styles.sectionTitle}>MUSCLES WORKED</Text>
          <View style={styles.muscleRow}>
            {muscleGroups.map((group) => (
              <Badge key={group} label={group} variant="primary" size="sm" />
            ))}
          </View>
        </View>
      )}

      {prCount > 0 && (
        <View style={styles.prBanner}>
          <Text style={styles.prTitle}>🏆 {prCount} PR{prCount > 1 ? 's' : ''} Achieved!</Text>
          {prNames.map((name) => (
            <Text key={name} style={styles.prName}>• {name}</Text>
          ))}
        </View>
      )}

      {exercises.length > 0 && (
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>EXERCISE BREAKDOWN</Text>
          {exercises.map((ex) => (
            <View key={ex.name} style={styles.exerciseRow}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetail}>{ex.sets} sets</Text>
              </View>
              <Text style={styles.exerciseVolume}>{formatVolume(ex.volume)} kg</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.xpBanner}>
        <Text style={styles.xpText}>+{xpEarned} XP</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Share to Feed" variant="primary" onPress={() => {}} />
        <View style={styles.secondaryRow}>
          <Button title="View History" variant="secondary" onPress={() => {}} style={styles.halfButton} />
          <Button title="Done" variant="secondary" onPress={() => {}} style={styles.halfButton} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  muscleSection: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  prBanner: {
    width: '100%',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  prTitle: {
    ...typography.h4,
    color: '#FFD700',
    marginBottom: spacing.sm,
  },
  prName: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  exercisesSection: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  exerciseDetail: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  exerciseVolume: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  xpBanner: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxl,
  },
  xpText: {
    ...typography.h3,
    color: colors.primary,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
});
