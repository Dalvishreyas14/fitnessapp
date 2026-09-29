import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface MuscleGroup {
  id: string;
  name: string;
  volume: number;
  target: number;
}

interface MuscleHeatMapProps {
  muscles: MuscleGroup[];
  onPress?: (muscleId: string) => void;
}

function getVolumeColor(volume: number, target: number): string {
  const ratio = target > 0 ? volume / target : 0;
  if (ratio < 0.5) return colors.error;
  if (ratio < 0.8) return colors.warning;
  return colors.success;
}

function getVolumeLabel(volume: number, target: number): string {
  const ratio = target > 0 ? volume / target : 0;
  if (ratio < 0.5) return 'Undertrained';
  if (ratio < 0.8) return 'Balanced';
  return 'High Volume';
}

export function MuscleHeatMap({ muscles, onPress }: MuscleHeatMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muscle Volume</Text>
      <View style={styles.grid}>
        {muscles.map((muscle) => {
          const color = getVolumeColor(muscle.volume, muscle.target);
          const label = getVolumeLabel(muscle.volume, muscle.target);
          return (
            <TouchableOpacity
              key={muscle.id}
              style={styles.muscleItem}
              onPress={() => onPress?.(muscle.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.indicator, { backgroundColor: color }]} />
              <View style={styles.muscleInfo}>
                <Text style={styles.muscleName}>{muscle.name}</Text>
                <Text style={[styles.muscleLabel, { color }]}>{label}</Text>
              </View>
              <Text style={styles.musclePercent}>
                {muscle.target > 0 ? Math.round((muscle.volume / muscle.target) * 100) : 0}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.md,
  },
  grid: {
    gap: spacing.xs,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  muscleInfo: {
    flex: 1,
  },
  muscleName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  muscleLabel: {
    ...typography.caption,
    marginTop: 1,
  },
  musclePercent: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
});
