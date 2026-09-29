import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { getProgressiveOverloadSuggestion } from '../../utils/workoutHelpers';
import { Exercise } from '../../constants/exercises';

interface ProgressiveOverloadProps {
  exercise: Exercise;
  previousBest?: { weight: number; reps: number; avgRpe?: number };
  onAccept: (suggestedWeight: number, suggestedReps: number) => void;
  onDismiss: () => void;
}

export default function ProgressiveOverload({
  exercise,
  previousBest,
  onAccept,
  onDismiss,
}: ProgressiveOverloadProps) {
  const suggestion = useMemo(() => {
    if (!previousBest) return null;
    return getProgressiveOverloadSuggestion(previousBest, exercise);
  }, [previousBest, exercise]);

  if (!suggestion || !previousBest) return null;

  return (
    <View style={styles.container}>
      <View style={styles.suggestionHeader}>
        <Text style={styles.label}>PROGRESSIVE OVERLOAD</Text>
      </View>

      <View style={styles.suggestionCard}>
        <Text style={styles.suggestionValue}>
          {suggestion.weight}kg × {suggestion.reps}
        </Text>
        <Text style={styles.suggestionMessage}>{suggestion.message}</Text>
      </View>

      <View style={styles.previousRow}>
        <Text style={styles.previousLabel}>Previous:</Text>
        <Text style={styles.previousValue}>
          {previousBest.weight}kg × {previousBest.reps}
          {previousBest.avgRpe !== undefined ? ` @ RPE ${previousBest.avgRpe}` : ''}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => onAccept(suggestion.weight, suggestion.reps)}
          activeOpacity={0.7}
        >
          <Text style={styles.acceptText}>Use This</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissText}>Skip</Text>
        </TouchableOpacity>
      </View>
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
  suggestionHeader: {
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  suggestionCard: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
    marginBottom: 8,
  },
  suggestionValue: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  suggestionMessage: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  previousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  previousLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  previousValue: {
    color: colors.textMuted,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  acceptText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
  dismissButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  dismissText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
