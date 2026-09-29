import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface PreviousPerformanceProps {
  exerciseId: string;
  previousSets?: { weight: number; reps: number; rpe?: number; setType?: string }[];
  lastWorkoutDate?: string;
  recommendation?: string;
}

const setTypeColors: Record<string, string> = {
  warmup: colors.orange,
  dropset: colors.purple,
  amrap: colors.warning,
  failure: colors.error,
  normal: colors.textSecondary,
};

export default function PreviousPerformance({
  exerciseId,
  previousSets,
  lastWorkoutDate,
  recommendation,
}: PreviousPerformanceProps) {
  if (!previousSets || previousSets.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LAST TIME</Text>
        {lastWorkoutDate && (
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{formatDate(lastWorkoutDate)}</Text>
          </View>
        )}
      </View>

      <View style={styles.setsList}>
        {previousSets.map((set, index) => {
          const typeKey = set.setType?.toLowerCase() || 'normal';
          const typeColor = setTypeColors[typeKey] || colors.textMuted;

          return (
            <View key={index} style={styles.setRow}>
              <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
              <Text style={styles.setLabel}>Set {index + 1}</Text>
              <Text style={styles.setData}>
                {set.weight}kg × {set.reps}
              </Text>
              {set.rpe !== undefined && (
                <Text style={styles.rpeText}>RPE {set.rpe}</Text>
              )}
              {set.setType && set.setType !== 'normal' && (
                <View style={[styles.typeBadge, { borderColor: typeColor }]}>
                  <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                    {set.setType.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {recommendation ? (
        <View style={styles.recommendationBanner}>
          <Text style={styles.recommendationText}>💡 AI: {recommendation}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  dateBadge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  setsList: {
    gap: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    gap: 8,
  },
  typeIndicator: {
    width: 3,
    height: 14,
    borderRadius: 2,
  },
  setLabel: {
    color: colors.textMuted,
    fontSize: 12,
    width: 42,
  },
  setData: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  rpeText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  typeBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recommendationBanner: {
    marginTop: 8,
    backgroundColor: colors.primaryMuted,
    borderRadius: 8,
    padding: 8,
  },
  recommendationText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});
