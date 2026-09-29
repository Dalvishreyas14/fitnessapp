import { create } from 'zustand';
import { Exercise } from '../constants/exercises';
import { storage } from '../utils/storage';
import {
  calculateTotalVolume,
  calculateTotalSets,
  detectPR,
  calculateE1RM,
  calculateTonnage,
  calculateWorkoutCalories,
} from '../utils/workoutHelpers';
import {
  SetLog,
  ExerciseLog,
  WorkoutSession,
  WorkoutHistoryEntry,
  PersonalRecord,
  ExerciseHistoryEntry,
  RestTimerConfig,
  SupersetGroup,
  SetType,
} from '../types';

const defaultRestTimerConfig: RestTimerConfig = {
  defaultDuration: 90,
  presets: [30, 45, 60, 90, 120, 180],
  hapticEnabled: true,
  audioEnabled: true,
  countdownWarning: 10,
};

function createInitialSets(exercise: Exercise): SetLog[] {
  const count = parseInt(exercise.sets) || 3;
  const defaultReps = parseInt(exercise.reps) || 10;
  return Array.from({ length: count }, (_, i) => ({
    setNumber: i + 1,
    setType: (i === 0 ? 'warmup' : 'working') as SetType,
    reps: defaultReps,
    weight: 0,
    completed: false,
    notes: '',
  }));
}

interface WorkoutState {
  activeWorkout: WorkoutSession | null;
  history: WorkoutHistoryEntry[];
  personalRecords: Record<string, PersonalRecord[]>;
  exerciseHistory: Record<string, ExerciseHistoryEntry[]>;
  weeklyVolume: number;
  streak: number;
  totalWorkouts: number;
  restTimerConfig: RestTimerConfig;

  loadFromStorage: () => Promise<void>;

  startWorkout: (name: string, exercises: Exercise[], muscleGroups: string[]) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  replaceExercise: (exerciseIndex: number, newExercise: Exercise) => void;

  logSet: (
    exerciseIndex: number,
    setIndex: number,
    reps: number,
    weight: number,
    setType?: SetType,
    rpe?: number,
  ) => void;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSetType: (exerciseIndex: number, setIndex: number, setType: SetType) => void;
  addSetNote: (exerciseIndex: number, setIndex: number, note: string) => void;
  copyPreviousSet: (exerciseIndex: number, setIndex: number) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateRPE: (exerciseIndex: number, setIndex: number, rpe: number) => void;
  setExerciseNotes: (exerciseIndex: number, notes: string) => void;

  setRestTimer: (seconds: number) => void;

  startSuperset: (exerciseIndices: number[], label: string) => void;

  finishWorkout: () => void;
  cancelWorkout: () => void;

  getExerciseHistory: (exerciseId: string) => ExerciseHistoryEntry[];
  getExercisePRs: (exerciseId: string) => PersonalRecord[];

  updateRestTimerConfig: (config: Partial<RestTimerConfig>) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  history: [],
  personalRecords: {},
  exerciseHistory: {},
  weeklyVolume: 0,
  streak: 0,
  totalWorkouts: 0,
  restTimerConfig: defaultRestTimerConfig,

  loadFromStorage: async () => {
    const [history, personalRecords, exerciseHistory, activeWorkout, restTimerConfig] =
      await Promise.all([
        storage.getWorkoutHistory(),
        storage.getPersonalRecords(),
        storage.getExerciseHistory(),
        storage.getActiveWorkout(),
        storage.getRestTimerConfig(),
      ]);

    let weeklyVolume = 0;
    let streak = 0;
    let totalWorkouts = (history as WorkoutHistoryEntry[]).length;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (const entry of history as WorkoutHistoryEntry[]) {
      const entryDate = new Date(entry.date);
      if (entryDate >= weekAgo) {
        const parsed = parseFloat(entry.volume.replace(/[^0-9.]/g, '')) || 0;
        weeklyVolume += parsed;
      }
    }

    const sortedDates = (history as WorkoutHistoryEntry[])
      .map((e) => new Date(e.date).toDateString())
      .filter((d, i, arr) => arr.indexOf(d) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const today = new Date().toDateString();
    for (const dateStr of sortedDates) {
      const diff = (new Date(today).getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === streak) {
        streak++;
      } else {
        break;
      }
    }

    set({
      history: (history as WorkoutHistoryEntry[]) || [],
      personalRecords: (personalRecords as Record<string, PersonalRecord[]>) || {},
      exerciseHistory: (exerciseHistory as Record<string, ExerciseHistoryEntry[]>) || {},
      activeWorkout: (activeWorkout as WorkoutSession) || null,
      restTimerConfig: (restTimerConfig as RestTimerConfig) || defaultRestTimerConfig,
      weeklyVolume,
      streak,
      totalWorkouts,
    });
  },

  startWorkout: (name, exercises, muscleGroups) => {
    const workoutExercises: ExerciseLog[] = exercises.map((ex) => ({
      exerciseId: ex.id,
      exercise: ex,
      sets: createInitialSets(ex),
      notes: '',
      targetMuscles: ex.targetMuscles,
    }));

    const session: WorkoutSession = {
      id: Date.now().toString(),
      name,
      startTime: Date.now(),
      exercises: workoutExercises,
      supersets: [],
      totalVolume: 0,
      totalSets: 0,
      completed: false,
      muscleGroups,
    };

    set({ activeWorkout: session });
    storage.saveActiveWorkout(session);
  },

  addExerciseToWorkout: (exercise) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const newExercise: ExerciseLog = {
      exerciseId: exercise.id,
      exercise,
      sets: createInitialSets(exercise),
      notes: '',
      targetMuscles: exercise.targetMuscles,
    };

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise],
    };

    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  removeExerciseFromWorkout: (exerciseId) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((e) => e.exerciseId !== exerciseId),
      supersets: activeWorkout.supersets
        .map((s) => ({
          ...s,
          exerciseIds: s.exerciseIds.filter((id) => id !== exerciseId),
        }))
        .filter((s) => s.exerciseIds.length > 1),
    };

    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  replaceExercise: (exerciseIndex, newExercise) => {
    const { activeWorkout } = get();
    if (!activeWorkout || !activeWorkout.exercises[exerciseIndex]) return;

    const oldExercise = activeWorkout.exercises[exerciseIndex];
    const completedSets = oldExercise.sets.filter((s) => s.completed);

    const replacementSets: SetLog[] = completedSets.length > 0
      ? [
          ...completedSets,
          ...Array.from(
            { length: Math.max(0, (parseInt(newExercise.sets) || 3) - completedSets.length) },
            (_, i) => ({
              setNumber: completedSets.length + i + 1,
              setType: 'working' as SetType,
              reps: parseInt(newExercise.reps) || 10,
              weight: 0,
              completed: false,
              notes: '',
            }),
          ),
        ]
      : createInitialSets(newExercise);

    const newExerciseLog: ExerciseLog = {
      exerciseId: newExercise.id,
      exercise: newExercise,
      sets: replacementSets,
      notes: oldExercise.notes,
      targetMuscles: newExercise.targetMuscles,
      supersetId: oldExercise.supersetId,
    };

    const exercises = [...activeWorkout.exercises];
    exercises[exerciseIndex] = newExerciseLog;

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises,
      totalVolume: calculateTotalVolume(
        exercises.flatMap((e) => e.sets),
      ),
      totalSets: calculateTotalSets(
        exercises.flatMap((e) => e.sets),
      ),
    };

    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  logSet: (exerciseIndex, setIndex, reps, weight, setType, rpe) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    const existing = sets[setIndex];

    sets[setIndex] = {
      ...existing,
      reps,
      weight,
      rpe: rpe ?? existing.rpe,
      setType: setType ?? existing.setType,
      volume: reps * weight,
    };

    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const totalVolume = exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sa, s) => sa + s.reps * s.weight, 0),
      0,
    );
    const totalSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0,
    );

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises,
      totalVolume,
      totalSets,
    };

    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  completeSet: (exerciseIndex, setIndex) => {
    const { activeWorkout, exerciseHistory, personalRecords } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    const currentSet = sets[setIndex];

    sets[setIndex] = { ...currentSet, completed: true, volume: currentSet.reps * currentSet.weight };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const totalVolume = exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sa, s) => sa + s.reps * s.weight, 0),
      0,
    );
    const totalSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0,
    );

    const exerciseId = exercises[exerciseIndex].exerciseId;
    const exerciseName = exercises[exerciseIndex].exercise.name;
    const completedSets = sets.filter((s) => s.completed);
    const exerciseVolume = calculateTotalVolume(completedSets);
    const maxWeight = Math.max(...completedSets.map((s) => s.weight), 0);
    const maxReps = Math.max(...completedSets.map((s) => s.reps), 0);
    const bestE1RM = Math.max(
      ...completedSets.map((s) => calculateE1RM(s.weight, s.reps)),
      0,
    );
    const avgRpe =
      completedSets.filter((s) => s.rpe != null).length > 0
        ? completedSets.reduce((acc, s) => acc + (s.rpe || 0), 0) /
          completedSets.filter((s) => s.rpe != null).length
        : undefined;

    const historyEntry: ExerciseHistoryEntry = {
      exerciseId,
      date: new Date().toISOString(),
      sets: completedSets,
      totalVolume: exerciseVolume,
      maxWeight,
      maxReps,
      e1rm: bestE1RM,
      avgRpe,
      duration: Date.now() - activeWorkout.startTime,
    };

    const updatedExerciseHistory = { ...exerciseHistory };
    if (!updatedExerciseHistory[exerciseId]) {
      updatedExerciseHistory[exerciseId] = [];
    }
    updatedExerciseHistory[exerciseId] = [
      ...updatedExerciseHistory[exerciseId],
      historyEntry,
    ];

    const updatedPRs = { ...personalRecords };
    if (!updatedPRs[exerciseId]) {
      updatedPRs[exerciseId] = [];
    }

    const existingPRs = updatedPRs[exerciseId];
    const now = new Date().toISOString();

    const weightPR = detectPR(
      exerciseId,
      exerciseName,
      currentSet.weight,
      currentSet.reps,
      existingPRs.find((p) => p.type === 'weight')
        ? {
            weight: existingPRs.find((p) => p.type === 'weight')!.newBest.weight,
            reps: existingPRs.find((p) => p.type === 'weight')!.newBest.reps,
          }
        : null,
    );
    if (weightPR?.isPR) {
      updatedPRs[exerciseId] = [
        ...updatedPRs[exerciseId].filter((p) => p.type !== 'weight'),
        {
          exerciseId,
          exerciseName,
          type: 'weight' as const,
          previousBest: { weight: weightPR.previousBest.weight, reps: weightPR.previousBest.reps, value: weightPR.previousBest.weight },
          newBest: { weight: weightPR.newBest.weight, reps: weightPR.newBest.reps, value: weightPR.newBest.weight },
          date: now,
        },
      ];
    }

    const prevRepBest = existingPRs.find((p) => p.type === 'reps');
    const prevRepAtWeight = prevRepBest ? prevRepBest.newBest.reps : 0;
    if (currentSet.reps > prevRepAtWeight) {
      updatedPRs[exerciseId] = [
        ...updatedPRs[exerciseId].filter((p) => p.type !== 'reps'),
        {
          exerciseId,
          exerciseName,
          type: 'reps' as const,
          previousBest: { weight: currentSet.weight, reps: prevRepAtWeight, value: prevRepAtWeight },
          newBest: { weight: currentSet.weight, reps: currentSet.reps, value: currentSet.reps },
          date: now,
        },
      ];
    }

    const prevVolumeBest = existingPRs.find((p) => p.type === 'volume');
    const prevVolume = prevVolumeBest ? prevVolumeBest.newBest.value : 0;
    if (exerciseVolume > prevVolume) {
      updatedPRs[exerciseId] = [
        ...updatedPRs[exerciseId].filter((p) => p.type !== 'volume'),
        {
          exerciseId,
          exerciseName,
          type: 'volume' as const,
          previousBest: { weight: 0, reps: 0, value: prevVolume },
          newBest: { weight: 0, reps: 0, value: exerciseVolume },
          date: now,
        },
      ];
    }

    const prevE1RM = existingPRs.find((p) => p.type === 'e1rm');
    const prevE1RMValue = prevE1RM ? prevE1RM.newBest.value : 0;
    if (bestE1RM > prevE1RMValue) {
      updatedPRs[exerciseId] = [
        ...updatedPRs[exerciseId].filter((p) => p.type !== 'e1rm'),
        {
          exerciseId,
          exerciseName,
          type: 'e1rm' as const,
          previousBest: { weight: 0, reps: 0, value: prevE1RMValue },
          newBest: { weight: 0, reps: 0, value: bestE1RM },
          date: now,
        },
      ];
    }

    const prsAchieieved = activeWorkout.prsAchieieved || [];
    if (weightPR?.isPR) prsAchieieved.push(`${exerciseName}: Weight PR - ${currentSet.weight}`);
    if (currentSet.reps > prevRepAtWeight) prsAchieieved.push(`${exerciseName}: Rep PR - ${currentSet.reps} reps`);
    if (exerciseVolume > prevVolume) prsAchieieved.push(`${exerciseName}: Volume PR - ${exerciseVolume}`);
    if (bestE1RM > prevE1RMValue) prsAchieieved.push(`${exerciseName}: e1RM PR - ${bestE1RM.toFixed(1)}`);

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises,
      totalVolume,
      totalSets,
      prsAchieieved,
    };

    set({
      activeWorkout: updated,
      exerciseHistory: updatedExerciseHistory,
      personalRecords: updatedPRs,
    });

    storage.saveActiveWorkout(updated);
    storage.saveExerciseHistory(updatedExerciseHistory);
    storage.savePersonalRecords(updatedPRs);
  },

  updateSetType: (exerciseIndex, setIndex, setType) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], setType };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const updated: WorkoutSession = { ...activeWorkout, exercises };
    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  addSetNote: (exerciseIndex, setIndex, note) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], notes: note };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const updated: WorkoutSession = { ...activeWorkout, exercises };
    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  copyPreviousSet: (exerciseIndex, setIndex) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    if (setIndex <= 0) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    const prev = sets[setIndex - 1];

    sets[setIndex] = {
      ...sets[setIndex],
      reps: prev.reps,
      weight: prev.weight,
      setType: prev.setType === 'warmup' ? 'working' : prev.setType,
      rpe: prev.rpe,
      volume: prev.reps * prev.weight,
    };

    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const updated: WorkoutSession = { ...activeWorkout, exercises };
    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  addSet: (exerciseIndex) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    const lastSet = sets[sets.length - 1];

    sets.push({
      setNumber: sets.length + 1,
      setType: 'working',
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      completed: false,
      notes: '',
    });

    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const updated: WorkoutSession = { ...activeWorkout, exercises };
    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  removeSet: (exerciseIndex, setIndex) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets.splice(setIndex, 1);

    const renumbered = sets.map((s, i) => ({ ...s, setNumber: i + 1 }));
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets: renumbered };

    const totalVolume = exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sa, s) => sa + s.reps * s.weight, 0),
      0,
    );
    const totalSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0,
    );

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises,
      totalVolume,
      totalSets,
    };

    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  updateRPE: (exerciseIndex, setIndex, rpe) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], rpe };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    const updated: WorkoutSession = { ...activeWorkout, exercises };
    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  setExerciseNotes: (exerciseIndex, notes) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], notes };

    const updated: WorkoutSession = { ...activeWorkout, exercises };
    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  setRestTimer: (seconds) => {
    set((state) => ({
      restTimerConfig: { ...state.restTimerConfig, defaultDuration: seconds },
    }));
  },

  startSuperset: (exerciseIndices, label) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;
    if (exerciseIndices.length < 2) return;

    const id = `superset-${Date.now()}`;
    const exerciseIds = exerciseIndices.map(
      (i) => activeWorkout.exercises[i]?.exerciseId,
    ).filter(Boolean) as string[];

    const group: SupersetGroup = { id, label, exerciseIds };

    const exercises = [...activeWorkout.exercises];
    for (const idx of exerciseIndices) {
      if (exercises[idx]) {
        exercises[idx] = { ...exercises[idx], supersetId: id };
      }
    }

    const updated: WorkoutSession = {
      ...activeWorkout,
      exercises,
      supersets: [...activeWorkout.supersets, group],
    };

    set({ activeWorkout: updated });
    storage.saveActiveWorkout(updated);
  },

  finishWorkout: () => {
    const { activeWorkout, history, totalWorkouts, weeklyVolume } = get();
    if (!activeWorkout) return;

    const durationMs = Date.now() - activeWorkout.startTime;
    const durationMin = Math.round(durationMs / 60000);
    const completedSets = activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
      0,
    );

    const finalVolume = activeWorkout.exercises.reduce(
      (acc, ex) =>
        acc +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sa, s) => sa + s.reps * s.weight, 0),
      0,
    );

    const calories = calculateWorkoutCalories(
      durationMs,
      finalVolume,
      activeWorkout.exercises.length,
    );

    const prCount = (activeWorkout.prsAchieieved || []).length;

    const newEntry: WorkoutHistoryEntry = {
      id: activeWorkout.id,
      name: activeWorkout.name,
      date: new Date().toISOString(),
      exercises: activeWorkout.exercises.length,
      volume: `${finalVolume.toLocaleString()} kg`,
      duration: `${durationMin} min`,
      muscleGroups: activeWorkout.muscleGroups,
      sets: completedSets,
      calories,
      prCount,
    };

    const updatedHistory = [newEntry, ...history];
    const updatedWeeklyVolume = weeklyVolume + finalVolume;

    set({
      activeWorkout: null,
      history: updatedHistory,
      totalWorkouts: totalWorkouts + 1,
      weeklyVolume: updatedWeeklyVolume,
    });

    storage.saveWorkoutHistory(updatedHistory);
    storage.clearActiveWorkout();
  },

  cancelWorkout: () => {
    set({ activeWorkout: null });
    storage.clearActiveWorkout();
  },

  getExerciseHistory: (exerciseId) => {
    const { exerciseHistory } = get();
    return exerciseHistory[exerciseId] || [];
  },

  getExercisePRs: (exerciseId) => {
    const { personalRecords } = get();
    return personalRecords[exerciseId] || [];
  },

  updateRestTimerConfig: (config) => {
    set((state) => ({
      restTimerConfig: { ...state.restTimerConfig, ...config },
    }));
    const updated = { ...get().restTimerConfig };
    storage.saveRestTimerConfig(updated);
  },
}));
