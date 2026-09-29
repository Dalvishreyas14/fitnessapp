import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Exercise } from '../../constants/exercises';
import { SetLog, SetType, RestTimerConfig } from '../../types';
import { SET_TYPES, getSetTypeInfo } from '../../constants/setTypes';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface SetLoggerProps {
  exerciseIndex: number;
  exercise: Exercise;
  sets: SetLog[];
  onLogSet: (
    setIndex: number,
    reps: number,
    weight: number,
    setType: SetType,
    rpe?: number,
  ) => void;
  onCompleteSet: (setIndex: number) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  onCopyPreviousSet: (setIndex: number) => void;
  onUpdateSetType: (setIndex: number, setType: SetType) => void;
  onAddSetNote: (setIndex: number, note: string) => void;
  onUpdateRPE: (setIndex: number, rpe: number) => void;
  restTimerConfig?: RestTimerConfig;
}

const WEIGHT_STEP = 2.5;
const REPS_STEP = 1;

export function SetLogger({
  exercise,
  sets,
  onLogSet,
  onCompleteSet,
  onAddSet,
  onRemoveSet,
  onCopyPreviousSet,
  onUpdateSetType,
  onAddSetNote,
  onUpdateRPE,
}: SetLoggerProps) {
  const [editingWeight, setEditingWeight] = useState<number | null>(null);
  const [editingReps, setEditingReps] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [editingSetType, setEditingSetType] = useState<number | null>(null);

  const hasCompletedSet = sets.some((s) => s.completed);

  const handleWeightChange = (setIndex: number, delta: number) => {
    const set = sets[setIndex];
    let newWeight: number;

    if (exercise.isBodyweight && (exercise.supportsAddedWeight || exercise.supportsAssistedWeight)) {
      const currentAdded = set.addedWeight ?? 0;
      newWeight = Math.max(0, currentAdded + delta);
      onLogSet(setIndex, set.reps, newWeight, set.setType, set.rpe);
      return;
    }

    newWeight = Math.max(0, Math.round((set.weight + delta) * 10) / 10);
    onLogSet(setIndex, set.reps, newWeight, set.setType, set.rpe);
  };

  const handleRepsChange = (setIndex: number, delta: number) => {
    const set = sets[setIndex];
    const newReps = Math.max(0, set.reps + delta);
    onLogSet(setIndex, newReps, set.weight, set.setType, set.rpe);
  };

  const handleWeightSubmit = (setIndex: number) => {
    const set = sets[setIndex];
    const val = parseFloat(weightInput) || 0;
    onLogSet(setIndex, set.reps, val, set.setType, set.rpe);
    setEditingWeight(null);
  };

  const handleRepsSubmit = (setIndex: number) => {
    const set = sets[setIndex];
    const val = parseInt(repsInput, 10) || 0;
    onLogSet(setIndex, val, set.weight, set.setType, set.rpe);
    setEditingReps(null);
  };

  const cycleRPE = (setIndex: number) => {
    const set = sets[setIndex];
    const current = set.rpe ?? 0;
    const next = current >= 10 ? 0 : current + 1;
    onUpdateRPE(setIndex, next);
  };

  const cycleSetType = (setIndex: number) => {
    const set = sets[setIndex];
    const currentIdx = SET_TYPES.findIndex((t) => t.id === set.setType);
    const nextIdx = (currentIdx + 1) % SET_TYPES.length;
    onUpdateSetType(setIndex, SET_TYPES[nextIdx].id);
  };

  const getDisplayWeight = (set: SetLog): string => {
    if (editingWeight !== null && editingWeight === sets.indexOf(set)) {
      return weightInput;
    }
    if (exercise.isBodyweight && (exercise.supportsAddedWeight || exercise.supportsAssistedWeight)) {
      const added = set.addedWeight ?? 0;
      return added > 0 ? `+${added}` : '0';
    }
    return set.weight > 0 ? set.weight.toString() : '0';
  };

  const getDisplayReps = (set: SetLog): string => {
    if (editingReps !== null && editingReps === sets.indexOf(set)) {
      return repsInput;
    }
    return set.reps > 0 ? set.reps.toString() : '0';
  };

  const renderCompletedIcon = (completed: boolean) => {
    if (completed) {
      return (
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      );
    }
    return <View style={styles.emptyCircle} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.setHeader]}>SET</Text>
        <Text style={[styles.headerText, styles.weightHeader]}>WEIGHT</Text>
        <Text style={[styles.headerText, styles.repsHeader]}>REPS</Text>
        <Text style={[styles.headerText, styles.rpeHeader]}>RPE</Text>
        <Text style={[styles.headerText, styles.typeHeader]}>TYPE</Text>
      </View>

      {sets.map((set, index) => {
        const typeInfo = getSetTypeInfo(set.setType);
        const isWeightEditing = editingWeight === index;
        const isRepsEditing = editingReps === index;
        const isTypeEditing = editingSetType === index;

        return (
          <View
            key={index}
            style={[
              styles.setRow,
              set.completed && styles.setRowCompleted,
            ]}
          >
            <View style={styles.setNumberContainer}>
              <Text
                style={[
                  styles.setNumberText,
                  set.completed && styles.setNumberTextCompleted,
                ]}
              >
                {index + 1}
              </Text>
            </View>

            <View style={styles.weightColumn}>
              {isWeightEditing ? (
                <View style={styles.inlineEditRow}>
                  <TextInput
                    style={styles.inlineInput}
                    value={weightInput}
                    onChangeText={setWeightInput}
                    keyboardType="decimal-pad"
                    autoFocus
                    selectTextOnFocus
                    onSubmitEditing={() => handleWeightSubmit(index)}
                    onBlur={() => handleWeightSubmit(index)}
                  />
                </View>
              ) : (
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleWeightChange(index, -WEIGHT_STEP)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.valueDisplay}
                    onPress={() => {
                      setEditingWeight(index);
                      setWeightInput(getDisplayWeight(set));
                    }}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.valueText}>{getDisplayWeight(set)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleWeightChange(index, WEIGHT_STEP)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.repsColumn}>
              {isRepsEditing ? (
                <View style={styles.inlineEditRow}>
                  <TextInput
                    style={styles.inlineInput}
                    value={repsInput}
                    onChangeText={setRepsInput}
                    keyboardType="number-pad"
                    autoFocus
                    selectTextOnFocus
                    onSubmitEditing={() => handleRepsSubmit(index)}
                    onBlur={() => handleRepsSubmit(index)}
                  />
                </View>
              ) : (
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleRepsChange(index, -REPS_STEP)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.valueDisplay}
                    onPress={() => {
                      setEditingReps(index);
                      setRepsInput(getDisplayReps(set));
                    }}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.valueText}>{getDisplayReps(set)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => handleRepsChange(index, REPS_STEP)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.rpeButton}
              onPress={() => cycleRPE(index)}
              activeOpacity={0.6}
            >
              <Text style={styles.rpeText}>
                {set.rpe && set.rpe > 0 ? set.rpe.toString() : '-'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeChip,
                { backgroundColor: typeInfo.bgColor },
              ]}
              onPress={() => cycleSetType(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.typeChipText, { color: typeInfo.color }]}>
                {typeInfo.shortLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => onCompleteSet(index)}
              activeOpacity={0.6}
            >
              {renderCompletedIcon(set.completed)}
            </TouchableOpacity>
          </View>
        );
      })}

      {hasCompletedSet && (
        <TouchableOpacity
          style={styles.copyPreviousBtn}
          onPress={() => {
            const lastCompletedIdx = sets.findLastIndex((s) => s.completed);
            if (lastCompletedIdx >= 0) {
              onCopyPreviousSet(lastCompletedIdx);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.copyPreviousText}>Copy Previous Set</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.addSetBtn}
        onPress={onAddSet}
        activeOpacity={0.7}
      >
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerText: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setHeader: {
    width: 36,
    textAlign: 'center',
  },
  weightHeader: {
    flex: 1,
    textAlign: 'center',
  },
  repsHeader: {
    flex: 1,
    textAlign: 'center',
  },
  rpeHeader: {
    width: 44,
    textAlign: 'center',
  },
  typeHeader: {
    width: 48,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
  },
  setNumberContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumberText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  setNumberTextCompleted: {
    color: colors.success,
  },
  weightColumn: {
    flex: 1,
    alignItems: 'center',
  },
  repsColumn: {
    flex: 1,
    alignItems: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    fontSize: 16,
  },
  valueDisplay: {
    minWidth: 44,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  valueText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineInput: {
    width: 56,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
    ...typography.bodyBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: spacing.xs,
  },
  rpeButton: {
    width: 44,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeText: {
    ...typography.captionBold,
    color: colors.textSecondary,
    fontSize: 12,
  },
  typeChip: {
    minWidth: 44,
    height: 28,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  typeChipText: {
    ...typography.small,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  completeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
  },
  copyPreviousBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
  },
  copyPreviousText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  addSetBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    alignItems: 'center',
  },
  addSetText: {
    ...typography.captionBold,
    color: colors.primary,
  },
});
