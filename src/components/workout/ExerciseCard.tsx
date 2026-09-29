import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { ExerciseLog, SetLog } from '../../types';

interface ExerciseCardProps {
  exercise: ExerciseLog;
  index: number;
  isActive?: boolean;
  onPress?: () => void;
}

export function ExerciseCard({ exercise, index, isActive, onPress }: ExerciseCardProps) {
  const completedSets = exercise.sets.filter((s: SetLog) => s.completed).length;
  const totalSets = exercise.sets.length;

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.numberContainer}>
        <Text style={[styles.number, isActive && styles.numberActive]}>{index + 1}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{exercise.exercise.name}</Text>
        <Text style={styles.muscles}>
          {exercise.targetMuscles.slice(0, 2).join(' · ')}
        </Text>
      </View>
      <View style={styles.setsInfo}>
        <Text style={styles.setsText}>
          {completedSets}/{totalSets} sets
        </Text>
        {completedSets === totalSets && totalSets > 0 && (
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        )}
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  containerActive: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  numberContainer: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  numberActive: {
    color: colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.white,
  },
  muscles: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  setsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  setsText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
});
