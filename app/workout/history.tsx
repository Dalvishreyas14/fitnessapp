import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge } from '../../src/components/ui';
import { useWorkoutStore } from '../../src/store/workoutStore';

type Filter = 'all' | 'week' | 'month';

export default function WorkoutHistoryScreen() {
  const { history, totalWorkouts, weeklyVolume, streak } = useWorkoutStore();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredHistory = useMemo(() => {
    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return history.filter((w) => new Date(w.date) >= weekAgo);
    }
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return history.filter((w) => new Date(w.date) >= monthAgo);
    }
    return history;
  }, [history, filter]);

  const totalVolumeAll = useMemo(() => {
    return history.reduce((acc, w) => {
      return acc + (parseFloat(w.volume.replace(/[^0-9.]/g, '')) || 0);
    }, 0);
  }, [history]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout History</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{(totalVolumeAll / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Total Volume (kg)</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>
        </View>

        <View style={styles.filterRow}>
          {(['all', 'week', 'month'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredHistory.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="barbell-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Workouts Yet</Text>
            <Text style={styles.emptyText}>
              Complete your first workout and it will appear here.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/workout/active')}
            >
              <Text style={styles.emptyButtonText}>Start a Workout</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          filteredHistory.map((workout) => (
            <Card key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutTop}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
                </View>
                {workout.prCount > 0 && (
                  <Badge label={`${workout.prCount} PR`} variant="success" />
                )}
              </View>

              <View style={styles.workoutMetrics}>
                <View style={styles.metric}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metricText}>{workout.duration}</Text>
                </View>
                <View style={styles.metric}>
                  <Ionicons name="barbell-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metricText}>{workout.exercises} exercises</Text>
                </View>
                <View style={styles.metric}>
                  <Ionicons name="flame-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metricText}>{workout.volume}</Text>
                </View>
              </View>

              <View style={styles.badgeRow}>
                {workout.muscleGroups.map((muscle) => (
                  <Badge key={muscle} label={muscle} variant="muted" size="sm" />
                ))}
              </View>
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.background,
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
  emptyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  emptyButtonText: {
    ...typography.button,
    color: colors.background,
  },
  workoutCard: {
    marginBottom: spacing.md,
  },
  workoutTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    ...typography.h4,
    color: colors.white,
    marginBottom: 2,
  },
  workoutDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  workoutMetrics: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
