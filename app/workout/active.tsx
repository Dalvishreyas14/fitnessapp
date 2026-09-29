import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge, Button } from '../../src/components/ui';
import { SetLogger } from '../../src/components/workout/SetLogger';
import { RPEInput } from '../../src/components/workout/RPEInput';
import { RestTimer } from '../../src/components/workout/RestTimer';
import SetTypeSelector from '../../src/components/workout/SetTypeSelector';
import PreviousPerformance from '../../src/components/workout/PreviousPerformance';
import PRCelebration from '../../src/components/workout/PRCelebration';
import SetCompletionOverlay from '../../src/components/workout/SetCompletionOverlay';
import { ExerciseCard } from '../../src/components/workout/ExerciseCard';
import { WorkoutComplete } from '../../src/components/workout/WorkoutComplete';
import { useWorkoutStore } from '../../src/store/workoutStore';
import { useUserStore } from '../../src/store/userStore';
import { generateTodayWorkout } from '../../src/utils/aiWorkoutGenerator';
import { formatDuration, formatVolume } from '../../src/utils/workoutHelpers';
import { SetType } from '../../src/types';
import { exercises as allExercises } from '../../src/constants/exercises';

type WorkoutPhase = 'overview' | 'exercise' | 'rest' | 'complete';

export default function ActiveWorkoutScreen() {
  const {
    activeWorkout, startWorkout, logSet, completeSet, updateRPE,
    finishWorkout, cancelWorkout, addSet, removeSet, copyPreviousSet,
    updateSetType, addSetNote, replaceExercise, restTimerConfig,
    personalRecords, exerciseHistory,
  } = useWorkoutStore();
  const { profile } = useUserStore();
  const [phase, setPhase] = useState<WorkoutPhase>('overview');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [showRPE, setShowRPE] = useState(false);
  const [currentRPE, setCurrentRPE] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const [showSetTypeSelector, setShowSetTypeSelector] = useState(false);
  const [selectingSetIndex, setSelectingSetIndex] = useState(0);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [prCelebrationData, setPrCelebrationData] = useState<{
    exerciseName: string;
    prType: 'weight' | 'reps' | 'volume' | 'e1rm';
    previousBest: { weight: number; reps: number; value: number };
    newBest: { weight: number; reps: number; value: number };
  } | null>(null);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [completionData, setCompletionData] = useState<{
    setNumber: number;
    volume: number;
    isPR: boolean;
  } | null>(null);
  const [showVideoSheet, setShowVideoSheet] = useState(false);
  const [selectedFormCue, setSelectedFormCue] = useState('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    if (!activeWorkout) {
      const workout = generateTodayWorkout(
        profile.goals,
        profile.experience,
        profile.equipment,
        profile.trainingStyle,
      );
      startWorkout(workout.name, workout.exercises, workout.muscleGroups);
    }
  }, []);

  useEffect(() => {
    if (!activeWorkout) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeWorkout?.startTime]);

  useEffect(() => {
    if (activeWorkout) {
      const ex = activeWorkout.exercises[activeExerciseIndex];
      if (ex?.exercise.formCues?.length > 0) {
        setSelectedFormCue(ex.exercise.formCues[0]);
      } else {
        setSelectedFormCue('');
      }
    }
  }, [activeExerciseIndex, activeWorkout]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogSet = useCallback(
    (setIndex: number, reps: number, weight: number, setType: SetType, rpe?: number) => {
      logSet(activeExerciseIndex, setIndex, reps, weight, setType, rpe);
    },
    [activeExerciseIndex, logSet],
  );

  const handleCompleteSet = useCallback(
    (setIndex: number) => {
      if (!activeWorkout) return;

      const exercise = activeWorkout.exercises[activeExerciseIndex];
      const set = exercise.sets[setIndex];

      const prevPRs = personalRecords[exercise.exerciseId] || [];
      const prevPRCount = prevPRs.length;

      completeSet(activeExerciseIndex, setIndex);

      const setVolume = set.reps * set.weight;

      const updatedPRs = useWorkoutStore.getState().personalRecords[exercise.exerciseId] || [];
      const newPR = updatedPRs.length > prevPRCount;

      setCompletionData({
        setNumber: setIndex + 1,
        volume: setVolume,
        isPR: newPR,
      });
      setShowCompletionOverlay(true);

      if (newPR && updatedPRs.length > 0) {
        const latestPR = updatedPRs[updatedPRs.length - 1];
        setPrCelebrationData({
          exerciseName: exercise.exercise.name,
          prType: latestPR.type,
          previousBest: latestPR.previousBest,
          newBest: latestPR.newBest,
        });
        setTimeout(() => setShowPRCelebration(true), 400);
      }

      setPhase('rest');
    },
    [activeExerciseIndex, activeWorkout, completeSet, personalRecords],
  );

  const handleSetTypeSelect = useCallback(
    (setType: SetType) => {
      updateSetType(activeExerciseIndex, selectingSetIndex, setType);
      setShowSetTypeSelector(false);
    },
    [activeExerciseIndex, selectingSetIndex, updateSetType],
  );

  const handleAddSet = useCallback(() => {
    addSet(activeExerciseIndex);
  }, [activeExerciseIndex, addSet]);

  const handleRemoveSet = useCallback(
    (setIndex: number) => {
      removeSet(activeExerciseIndex, setIndex);
    },
    [activeExerciseIndex, removeSet],
  );

  const handleCopyPreviousSet = useCallback(
    (setIndex: number) => {
      copyPreviousSet(activeExerciseIndex, setIndex);
    },
    [activeExerciseIndex, copyPreviousSet],
  );

  const handleAddSetNote = useCallback(
    (setIndex: number, note: string) => {
      addSetNote(activeExerciseIndex, setIndex, note);
    },
    [activeExerciseIndex, addSetNote],
  );

  const handleUpdateRPE = useCallback(
    (setIndex: number, rpe: number) => {
      updateRPE(activeExerciseIndex, setIndex, rpe);
    },
    [activeExerciseIndex, updateRPE],
  );

  const handleReplaceExercise = useCallback(
    (newExerciseId: string) => {
      const exercise = allExercises.find((e) => e.id === newExerciseId);
      if (exercise) {
        replaceExercise(activeExerciseIndex, exercise);
      }
      setShowExercisePicker(false);
    },
    [activeExerciseIndex, replaceExercise],
  );

  const handleRestComplete = useCallback(() => {
    setPhase('exercise');
  }, []);

  const handleFinishWorkout = useCallback(() => {
    finishWorkout();
    setPhase('complete');
  }, [finishWorkout]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? Progress will be lost.',
      [
        { text: 'Continue Workout', style: 'cancel' },
        {
          text: 'Cancel Workout',
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            router.back();
          },
        },
      ],
    );
  }, [cancelWorkout]);

  if (!activeWorkout) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading workout...</Text>
      </View>
    );
  }

  if (phase === 'complete') {
    const durationMin = Math.floor(elapsedTime / 60);
    const xpEarned = Math.floor(
      activeWorkout.totalSets * 30 + activeWorkout.totalVolume / 100,
    );
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <WorkoutComplete
            workoutName={activeWorkout.name}
            totalVolume={activeWorkout.totalVolume}
            totalSets={activeWorkout.totalSets}
            duration={durationMin}
            exerciseCount={activeWorkout.exercises.length}
            xpEarned={xpEarned}
          />
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Done" onPress={() => router.back()} size="lg" />
        </View>
      </View>
    );
  }

  const currentExercise = activeWorkout.exercises[activeExerciseIndex];
  const completedSets =
    currentExercise?.sets.filter((s) => s.completed).length || 0;
  const totalSets = currentExercise?.sets.length || 0;
  const totalCompletedSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0,
  );
  const totalTargetSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0,
  );
  const progress = totalTargetSets > 0 ? totalCompletedSets / totalTargetSets : 0;

  const currentExerciseObj = currentExercise?.exercise;
  const alternatives = currentExerciseObj?.alternatives || [];
  const alternativeExercises = alternatives
    .map((id) => allExercises.find((e) => e.id === id))
    .filter(Boolean) as typeof allExercises;

  const supersetGroups = new Map<string, number[]>();
  activeWorkout.exercises.forEach((ex, idx) => {
    if (ex.supersetId) {
      if (!supersetGroups.has(ex.supersetId)) {
        supersetGroups.set(ex.supersetId, []);
      }
      supersetGroups.get(ex.supersetId)!.push(idx);
    }
  });

  const isFirstInSuperset = (idx: number): boolean => {
    const ex = activeWorkout.exercises[idx];
    if (!ex.supersetId) return false;
    const group = supersetGroups.get(ex.supersetId);
    return group ? group[0] === idx : false;
  };

  const isLastInSuperset = (idx: number): boolean => {
    const ex = activeWorkout.exercises[idx];
    if (!ex.supersetId) return false;
    const group = supersetGroups.get(ex.supersetId);
    return group ? group[group.length - 1] === idx : false;
  };

  const getSupersetLabel = (idx: number): string => {
    const ex = activeWorkout.exercises[idx];
    if (!ex.supersetId) return '';
    const superset = activeWorkout.supersets.find(
      (s) => s.id === ex.supersetId,
    );
    const labelIndex =
      activeWorkout.supersets.findIndex((s) => s.id === ex.supersetId) + 1;
    return (
      superset?.label || `SUPERSET ${labelIndex}`
    );
  };

  const getPreviousPerformanceData = () => {
    const history = exerciseHistory[currentExercise.exerciseId] || [];
    if (history.length === 0) return undefined;
    const lastEntry = history[history.length - 1];
    return {
      previousSets: lastEntry.sets.map((s) => ({
        weight: s.weight,
        reps: s.reps,
        rpe: s.rpe,
        setType: s.setType,
      })),
      lastWorkoutDate: lastEntry.date,
    };
  };

  const prevPerf = getPreviousPerformanceData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.workoutName}>{activeWorkout.name}</Text>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="headset-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.volumeBar}>
        <Ionicons name="barbell-outline" size={14} color={colors.primary} />
        <Text style={styles.volumeText}>
          {formatVolume(activeWorkout.totalVolume)} kg volume
        </Text>
        <View style={styles.volumeSeparator} />
        <Text style={styles.volumeSetText}>
          {totalCompletedSets}/{totalTargetSets} sets
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>

      {phase === 'rest' ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.restCard}>
            <Text style={styles.restTitle}>
              NEXT: SET {completedSets + 1} — {currentExercise?.exercise.name}
            </Text>
            <RestTimer
              duration={
                currentExercise?.exercise.restTime ||
                restTimerConfig.defaultDuration
              }
              onComplete={handleRestComplete}
              onSkip={handleRestComplete}
              nextSetPreview={`${completedSets + 1}/${totalSets}`}
            />
          </Card>
        </ScrollView>
      ) : phase === 'exercise' ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Badge
                label={`EXERCISE ${activeExerciseIndex + 1}/${activeWorkout.exercises.length}`}
                variant="primary"
              />
              <Badge
                label={`${completedSets}/${totalSets} sets`}
                variant="muted"
              />
            </View>
            <Text style={styles.exerciseName}>
              {currentExercise.exercise.name}
            </Text>
            <Text style={styles.exerciseMuscles}>
              {currentExercise.targetMuscles.join(' · ')}
            </Text>

            {selectedFormCue ? (
              <View style={styles.formCueBanner}>
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.formCueText} numberOfLines={1}>
                  {selectedFormCue}
                </Text>
              </View>
            ) : null}

            <PreviousPerformance
              exerciseId={currentExercise.exerciseId}
              previousSets={prevPerf?.previousSets}
              lastWorkoutDate={prevPerf?.lastWorkoutDate}
            />

            <SetLogger
              exerciseIndex={activeExerciseIndex}
              exercise={currentExercise.exercise}
              sets={currentExercise.sets}
              onLogSet={handleLogSet}
              onCompleteSet={handleCompleteSet}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
              onCopyPreviousSet={handleCopyPreviousSet}
              onUpdateSetType={(setIndex, _setType) => {
                setSelectingSetIndex(setIndex);
                setShowSetTypeSelector(true);
              }}
              onAddSetNote={handleAddSetNote}
              onUpdateRPE={handleUpdateRPE}
              restTimerConfig={restTimerConfig}
            />
          </Card>

          <View style={styles.exerciseActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowVideoSheet(true)}
            >
              <Ionicons
                name="videocam-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.actionText}>Watch Demo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="camera-outline"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.actionText}>Form Check</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowExercisePicker(true)}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={20}
                color={colors.purple}
              />
              <Text style={styles.actionText}>Replace</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>All Exercises</Text>
          {activeWorkout.exercises.map((ex, index) => {
            const showSupersetHeader = isFirstInSuperset(index);
            const supersetLabel = showSupersetHeader
              ? getSupersetLabel(index)
              : '';

            return (
              <React.Fragment key={ex.exerciseId}>
                {showSupersetHeader && (
                  <View style={styles.supersetHeader}>
                    <View style={styles.supersetLine} />
                    <Text style={styles.supersetLabel}>{supersetLabel}</Text>
                    <View style={styles.supersetLine} />
                  </View>
                )}
                <ExerciseCard
                  exercise={ex}
                  index={index}
                  isActive={index === activeExerciseIndex}
                  onPress={() => {
                    setActiveExerciseIndex(index);
                    setPhase('exercise');
                  }}
                />
                {isLastInSuperset(index) && (
                  <View style={styles.supersetEndLine} />
                )}
              </React.Fragment>
            );
          })}
        </ScrollView>
      ) : null}

      {phase === 'exercise' && (
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            {activeExerciseIndex > 0 && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  setActiveExerciseIndex((prev) => prev - 1);
                  setShowRPE(false);
                  setCurrentRPE(null);
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }} />
            {activeExerciseIndex <
            activeWorkout.exercises.length - 1 ? (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonPrimary]}
                onPress={() => {
                  setActiveExerciseIndex((prev) => prev + 1);
                  setShowRPE(false);
                  setCurrentRPE(null);
                }}
              >
                <Text style={styles.navButtonTextPrimary}>
                  Next Exercise
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.background}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonPrimary]}
                onPress={handleFinishWorkout}
              >
                <Text style={styles.navButtonTextPrimary}>
                  Finish Workout
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.background}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <SetTypeSelector
        visible={showSetTypeSelector}
        onSelect={handleSetTypeSelect}
        onClose={() => setShowSetTypeSelector(false)}
        currentType={currentExercise?.sets[selectingSetIndex]?.setType}
      />

      <PRCelebration
        visible={showPRCelebration}
        exerciseName={prCelebrationData?.exerciseName || ''}
        prType={prCelebrationData?.prType || 'weight'}
        previousBest={
          prCelebrationData?.previousBest || {
            weight: 0,
            reps: 0,
            value: 0,
          }
        }
        newBest={
          prCelebrationData?.newBest || { weight: 0, reps: 0, value: 0 }
        }
        onDismiss={() => {
          setShowPRCelebration(false);
          setPrCelebrationData(null);
        }}
      />

      <SetCompletionOverlay
        visible={showCompletionOverlay}
        setNumber={completionData?.setNumber || 0}
        volume={completionData?.volume || 0}
        isPR={completionData?.isPR || false}
        onDismiss={() => {
          setShowCompletionOverlay(false);
          setCompletionData(null);
        }}
      />

      <Modal
        visible={showVideoSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVideoSheet(false)}
      >
        <TouchableOpacity
          style={styles.videoOverlay}
          activeOpacity={1}
          onPress={() => setShowVideoSheet(false)}
        >
          <View style={styles.videoSheet}>
            <View style={styles.videoHandle} />
            <Text style={styles.videoTitle}>
              {currentExerciseObj?.name}
            </Text>
            <View style={styles.videoPlaceholder}>
              <Ionicons
                name="play-circle-outline"
                size={64}
                color={colors.primary}
              />
              <Text style={styles.videoPlaceholderText}>
                Exercise Demo
              </Text>
              <Text style={styles.videoPlaceholderSubtext}>
                Video coming soon
              </Text>
            </View>
            <TouchableOpacity
              style={styles.videoCloseBtn}
              onPress={() => setShowVideoSheet(false)}
            >
              <Text style={styles.videoCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showExercisePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExercisePicker(false)}
      >
        <TouchableOpacity
          style={styles.videoOverlay}
          activeOpacity={1}
          onPress={() => setShowExercisePicker(false)}
        >
          <View style={styles.exercisePickerSheet}>
            <View style={styles.videoHandle} />
            <Text style={styles.videoTitle}>Replace Exercise</Text>
            <Text style={styles.exercisePickerSubtitle}>
              Alternatives for {currentExerciseObj?.name}
            </Text>
            <ScrollView
              style={styles.exercisePickerList}
              showsVerticalScrollIndicator={false}
            >
              {alternativeExercises.map((alt) => (
                <TouchableOpacity
                  key={alt.id}
                  style={styles.exercisePickerItem}
                  onPress={() => handleReplaceExercise(alt.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.exercisePickerItemContent}>
                    <Text style={styles.exercisePickerItemName}>
                      {alt.name}
                    </Text>
                    <Text style={styles.exercisePickerItemMuscles}>
                      {alt.targetMuscles.join(' · ')}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              ))}
              {alternativeExercises.length === 0 && (
                <Text style={styles.exercisePickerEmpty}>
                  No alternatives available
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.videoCloseBtn}
              onPress={() => setShowExercisePicker(false)}
            >
              <Text style={styles.videoCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  workoutName: {
    ...typography.h4,
    color: colors.white,
  },
  timer: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  volumeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  volumeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  volumeSeparator: {
    width: 1,
    height: 12,
    backgroundColor: colors.surfaceBorder,
  },
  volumeSetText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  scroll: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  restCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  restTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  exerciseCard: {
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  exerciseName: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  exerciseMuscles: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  formCueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  formCueText: {
    ...typography.caption,
    color: colors.primary,
    flex: 1,
  },
  rpeContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  rpeConfirmButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  rpeConfirmText: {
    ...typography.bodyBold,
    color: colors.background,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  actionText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.md,
  },
  supersetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  supersetLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
  },
  supersetLabel: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  supersetEndLine: {
    height: 1,
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    marginVertical: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.lg,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  navButtonPrimary: {
    backgroundColor: colors.primary,
  },
  navButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  navButtonTextPrimary: {
    ...typography.bodyBold,
    color: colors.background,
  },
  videoOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  videoSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  videoHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  videoTitle: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingVertical: spacing.xxxl,
    marginBottom: spacing.xl,
  },
  videoPlaceholderText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  videoPlaceholderSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  videoCloseBtn: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  videoCloseText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  exercisePickerSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  exercisePickerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  exercisePickerList: {
    marginBottom: spacing.lg,
  },
  exercisePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  exercisePickerItemContent: {
    flex: 1,
  },
  exercisePickerItemName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  exercisePickerItemMuscles: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  exercisePickerEmpty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
