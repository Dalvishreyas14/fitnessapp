import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge } from '../../src/components/ui';
import { useWorkoutStore } from '../../src/store/workoutStore';

type Period = '1W' | '1M' | '3M' | '6M' | '1Y';

const periodDays: Record<Period, number> = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsScreen() {
  const { history, personalRecords } = useWorkoutStore();
  const [period, setPeriod] = useState<Period>('1M');

  const filteredHistory = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - periodDays[period] * 24 * 60 * 60 * 1000);
    return history.filter((w) => new Date(w.date) >= cutoff);
  }, [history, period]);

  const stats = useMemo(() => {
    const totalWorkouts = filteredHistory.length;
    const totalVolume = filteredHistory.reduce(
      (acc, w) => acc + (parseFloat(w.volume.replace(/[^0-9.]/g, '')) || 0),
      0,
    );
    const avgDuration =
      totalWorkouts > 0
        ? Math.round(
            filteredHistory.reduce((acc, w) => {
              const mins = parseInt(w.duration.replace(/[^0-9]/g, '')) || 0;
              return acc + mins;
            }, 0) / totalWorkouts,
          )
        : 0;
    const totalPRs = filteredHistory.reduce((acc, w) => acc + w.prCount, 0);
    return { totalWorkouts, totalVolume, avgDuration, totalPRs };
  }, [filteredHistory]);

  const weeklyVolume = useMemo(() => {
    const now = new Date();
    const weeks: { label: string; volume: number }[] = [];
    const numWeeks = period === '1W' ? 1 : period === '1M' ? 4 : period === '3M' ? 12 : period === '6M' ? 24 : 52;

    for (let i = numWeeks - 1; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const vol = filteredHistory
        .filter((w) => {
          const d = new Date(w.date);
          return d >= weekStart && d < weekEnd;
        })
        .reduce((acc, w) => acc + (parseFloat(w.volume.replace(/[^0-9.]/g, '')) || 0), 0);
      weeks.push({ label: `W${numWeeks - i}`, volume: vol });
    }
    return weeks;
  }, [filteredHistory, period]);

  const maxVolume = useMemo(() => Math.max(...weeklyVolume.map((w) => w.volume), 1), [weeklyVolume]);

  const dayFrequency = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    filteredHistory.forEach((w) => {
      const day = new Date(w.date).getDay();
      counts[day]++;
    });
    const max = Math.max(...counts, 1);
    return counts.map((c, i) => ({ day: dayLabels[i], count: c, pct: c / max }));
  }, [filteredHistory]);

  const muscleGroups = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredHistory.forEach((w) => {
      w.muscleGroups.forEach((m) => {
        counts[m] = (counts[m] || 0) + 1;
      });
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: count / total }))
      .sort((a, b) => b.count - a.count);
  }, [filteredHistory]);

  const maxMuscle = useMemo(() => Math.max(...muscleGroups.map((m) => m.count), 1), [muscleGroups]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.periodRow}>
          {(['1W', '1M', '3M', '6M', '1Y'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Volume (kg)</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgDuration}</Text>
            <Text style={styles.statLabel}>Avg Min</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalPRs}</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </Card>
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Volume</Text>
          <View style={styles.barChart}>
            {weeklyVolume.map((week, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max((week.volume / maxVolume) * 100, 2)}%`,
                        backgroundColor: week.volume > 0 ? colors.primary : colors.surfaceLight,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{week.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Workout Frequency</Text>
          <View style={styles.freqChart}>
            {dayFrequency.map((d, i) => (
              <View key={i} style={styles.freqColumn}>
                <View style={styles.freqTrack}>
                  <View
                    style={[
                      styles.freqFill,
                      {
                        height: `${Math.max(d.pct * 100, 2)}%`,
                        backgroundColor: d.count > 0 ? colors.blue : colors.surfaceLight,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.freqLabel}>{d.day}</Text>
                <Text style={styles.freqCount}>{d.count}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Muscle Group Distribution</Text>
          {muscleGroups.length === 0 ? (
            <Text style={styles.noData}>No data for this period</Text>
          ) : (
            muscleGroups.map((m, i) => (
              <View key={m.name} style={styles.muscleRow}>
                <Text style={styles.muscleName}>{m.name}</Text>
                <View style={styles.muscleTrack}>
                  <View
                    style={[
                      styles.muscleFill,
                      {
                        width: `${(m.count / maxMuscle) * 100}%`,
                        backgroundColor:
                          i === 0 ? colors.primary : i === 1 ? colors.blue : colors.purple,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.musclePct}>{Math.round(m.pct * 100)}%</Text>
              </View>
            ))
          )}
        </Card>
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
  periodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  periodChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  periodChipActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
  },
  statValue: {
    ...typography.h4,
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 120,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: radii.sm,
    minHeight: 2,
  },
  barLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  freqChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 140,
  },
  freqColumn: {
    flex: 1,
    alignItems: 'center',
  },
  freqTrack: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
  },
  freqFill: {
    width: '100%',
    borderRadius: radii.sm,
    minHeight: 2,
  },
  freqLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  freqCount: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  muscleName: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 80,
    textTransform: 'capitalize',
  },
  muscleTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  muscleFill: {
    height: '100%',
    borderRadius: radii.full,
  },
  musclePct: {
    ...typography.captionBold,
    color: colors.textPrimary,
    width: 35,
    textAlign: 'right',
  },
  noData: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
