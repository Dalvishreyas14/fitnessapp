import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../constants/exercises';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface QuickSetEntryProps {
  exerciseIndex: number;
  exercise: Exercise;
  onComplete: (reps: number, weight: number, rpe?: number) => void;
  previousSet?: { weight: number; reps: number };
  isBodyweight?: boolean;
}

export function QuickSetEntry({
  exerciseIndex,
  exercise,
  onComplete,
  previousSet,
  isBodyweight = false,
}: QuickSetEntryProps) {
  const [weight, setWeight] = useState(previousSet?.weight ?? 0);
  const [reps, setReps] = useState(previousSet?.reps ?? 10);
  const [rpe, setRpe] = useState<number | null>(null);
  const [addedWeight, setAddedWeight] = useState(0);

  const WEIGHT_STEP = 2.5;
  const REPS_STEP = 1;

  const handleComplete = () => {
    const totalWeight = isBodyweight ? addedWeight : weight;
    onComplete(reps, totalWeight, rpe ?? undefined);
  };

  return (
    <View style={styles.container}>
      {isBodyweight ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>BODYWEIGHT</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setAddedWeight((w) => Math.max(0, w - WEIGHT_STEP))}
                accessibilityLabel="Decrease added weight"
              >
                <Text style={styles.stepButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>
                  BW {addedWeight > 0 ? `+ ${addedWeight}` : ''} KG
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setAddedWeight((w) => w + WEIGHT_STEP)}
                accessibilityLabel="Increase added weight"
              >
                <Text style={styles.stepButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.unitLabel}>ADDED WEIGHT (KG)</Text>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WEIGHT (KG)</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => setWeight((w) => Math.max(0, w - WEIGHT_STEP))}
              accessibilityLabel="Decrease weight"
            >
              <Text style={styles.stepButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{weight}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => setWeight((w) => w + WEIGHT_STEP)}
              accessibilityLabel="Increase weight"
            >
              <Text style={styles.stepButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REPS</Text>
        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => setReps((r) => Math.max(0, r - REPS_STEP))}
            accessibilityLabel="Decrease reps"
          >
            <Text style={styles.stepButtonText}>−</Text>
          </TouchableOpacity>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{reps}</Text>
          </View>
          <TouchableOpacity
            style={styles.stepButton}
            onPress={() => setReps((r) => r + REPS_STEP)}
            accessibilityLabel="Increase reps"
          >
            <Text style={styles.stepButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>RPE</Text>
        <View style={styles.rpeRow}>
          <TouchableOpacity
            style={[
              styles.rpeButton,
              styles.rpeEasy,
              rpe === 5 && styles.rpeEasySelected,
            ]}
            onPress={() => setRpe(rpe === 5 ? null : 5)}
          >
            <Text
              style={[
                styles.rpeButtonText,
                rpe === 5 && styles.rpeButtonTextSelected,
              ]}
            >
              EASY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rpeButton,
              styles.rpeMedium,
              rpe === 7 && styles.rpeMediumSelected,
            ]}
            onPress={() => setRpe(rpe === 7 ? null : 7)}
          >
            <Text
              style={[
                styles.rpeButtonText,
                rpe === 7 && styles.rpeButtonTextSelected,
              ]}
            >
              MEDIUM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rpeButton,
              styles.rpeHard,
              rpe === 9 && styles.rpeHardSelected,
            ]}
            onPress={() => setRpe(rpe === 9 ? null : 9)}
          >
            <Text
              style={[
                styles.rpeButtonText,
                rpe === 9 && styles.rpeButtonTextSelected,
              ]}
            >
              HARD
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>SET COMPLETE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  unitLabel: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepButton: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    ...typography.h2,
    color: colors.white,
  },
  valueContainer: {
    flex: 1,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  valueText: {
    ...typography.h2,
    color: colors.white,
  },
  rpeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rpeButton: {
    flex: 1,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeEasy: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  rpeEasySelected: {
    backgroundColor: colors.success,
  },
  rpeMedium: {
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
  },
  rpeMediumSelected: {
    backgroundColor: colors.warning,
  },
  rpeHard: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
  },
  rpeHardSelected: {
    backgroundColor: colors.error,
  },
  rpeButtonText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  rpeButtonTextSelected: {
    color: colors.background,
  },
  completeButton: {
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    ...typography.bodyBold,
    color: colors.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
