import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge } from '../../src/components/ui';
import { useWorkoutStore } from '../../src/store/workoutStore';
import { PersonalRecord } from '../../src/types';

const prTypeLabels: Record<PersonalRecord['type'], string> = {
  weight: 'Max Weight',
  reps: 'Max Reps',
  volume: 'Best Volume',
  e1rm: 'Est. 1RM',
};

const prTypeIcons: Record<PersonalRecord['type'], keyof typeof Ionicons.glyphMap> = {
  weight: 'barbell',
  reps: 'repeat',
  volume: 'analytics',
  e1rm: 'flash',
};

function formatPRValue(pr: PersonalRecord): string {
  if (pr.type === 'volume') {
    return `${(pr.previousBest.value || 0).toLocaleString()} → ${(pr.newBest.value || 0).toLocaleString()} kg`;
  }
  if (pr.type === 'e1rm') {
    return `${(pr.previousBest.value || 0).toFixed(1)} → ${(pr.newBest.value || 0).toFixed(1)} kg`;
  }
  return `${pr.previousBest.weight}kg × ${pr.previousBest.reps} → ${pr.newBest.weight}kg × ${pr.newBest.reps}`;
}

export default function PersonalRecordsScreen() {
  const { personalRecords } = useWorkoutStore();

  const allPRs = useMemo(() => {
    const prs: PersonalRecord[] = [];
    for (const exercisePRs of Object.values(personalRecords)) {
      prs.push(...exercisePRs);
    }
    return prs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [personalRecords]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Records</Text>
          <View style={{ width: 40 }} />
        </View>

        {allPRs.length > 0 && (
          <Card style={styles.trophyCard}>
            <Ionicons name="trophy" size={40} color={colors.primary} />
            <Text style={styles.trophyCount}>{allPRs.length}</Text>
            <Text style={styles.trophyLabel}>Personal Records Achieved</Text>
          </Card>
        )}

        {allPRs.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No PRs Yet</Text>
            <Text style={styles.emptyText}>
              Beat your previous bests and your personal records will show up here.
            </Text>
          </Card>
        ) : (
          allPRs.map((pr, i) => (
            <Card key={`${pr.exerciseId}-${pr.type}-${i}`} style={styles.prCard}>
              <View style={styles.prTop}>
                <View style={[styles.prIconWrap, { backgroundColor: 'rgba(204, 255, 0, 0.15)' }]}>
                  <Ionicons name={prTypeIcons[pr.type]} size={20} color={colors.primary} />
                </View>
                <View style={styles.prInfo}>
                  <Text style={styles.prExercise}>{pr.exerciseName}</Text>
                  <Badge label={prTypeLabels[pr.type]} variant="primary" size="sm" />
                </View>
              </View>

              <View style={styles.prValueRow}>
                <Text style={styles.prValue}>{formatPRValue(pr)}</Text>
              </View>

              <Text style={styles.prDate}>{formatDate(pr.date)}</Text>
            </Card>
          ))
        )}
      </ScrollView>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
  },
  trophyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  trophyCount: {
    ...typography.metric,
    color: colors.primary,
  },
  trophyLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.massive,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  prCard: {
    marginBottom: spacing.md,
  },
  prTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  prIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  prExercise: {
    ...typography.bodyBold,
    color: colors.white,
  },
  prValueRow: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  prValue: {
    ...typography.bodyBold,
    color: colors.primary,
    textAlign: 'center',
  },
  prDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
