import { Exercise } from '../constants/exercises';
import { SetLog, PersonalRecord, ExerciseHistoryEntry } from '../types';

export function calculateTotalVolume(sets: SetLog[]): number {
  return sets.reduce((total, set) => {
    if (!set.completed) return total;
    const effectiveWeight =
      set.addedWeight !== undefined
        ? set.weight + set.addedWeight
        : set.weight;
    return total + effectiveWeight * set.reps;
  }, 0);
}

export function calculateTotalSets(sets: SetLog[]): number {
  return sets.filter((set) => set.completed).length;
}

export function detectPR(
  exerciseId: string,
  exerciseName: string,
  newWeight: number,
  newReps: number,
  previousBest: { weight: number; reps: number } | null,
): {
  isPR: boolean;
  previousBest: { weight: number; reps: number };
  newBest: { weight: number; reps: number };
} | null {
  if (newWeight <= 0 && newReps <= 0) return null;

  const newBest = { weight: newWeight, reps: newReps };

  if (!previousBest) {
    return {
      isPR: true,
      previousBest: { weight: 0, reps: 0 },
      newBest,
    };
  }

  const prevE1RM = calculateE1RM(previousBest.weight, previousBest.reps);
  const newE1RM = calculateE1RM(newWeight, newReps);
  const isPR = newE1RM > prevE1RM;

  return {
    isPR,
    previousBest,
    newBest,
  };
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatVolume(kg: number): string {
  if (kg >= 1_000_000) {
    return `${(kg / 1_000_000).toFixed(1)}M`;
  }
  if (kg >= 1_000) {
    return `${(kg / 1_000).toFixed(1)}k`;
  }
  return kg.toFixed(0);
}

const muscleNameMap: Record<string, string> = {
  'mid-chest': 'Chest',
  'upper-chest': 'Upper Chest',
  'lower-chest': 'Lower Chest',
  'front-delt': 'Front Delts',
  'lateral-delt': 'Side Delts',
  'rear-delt': 'Rear Delts',
  'shoulders': 'Shoulders',
  'traps': 'Traps',
  'upper-back': 'Upper Back',
  'lats': 'Lats',
  'lower-back': 'Lower Back',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearms': 'Forearms',
  'abs': 'Abs',
  'obliques': 'Obliques',
  'quads': 'Quads',
  'hamstrings': 'Hamstrings',
  'glutes': 'Glutes',
  'calves': 'Calves',
  'hip-flexors': 'Hip Flexors',
  'adductors': 'Adductors',
  'abductors': 'Abductors',
  'neck': 'Neck',
  'grip': 'Grip',
  'full-body': 'Full Body',
};

export function getMuscleName(muscleId: string): string {
  return muscleNameMap[muscleId] || muscleId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function calculateE1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
}

export function calculateTonnage(sets: SetLog[]): number {
  return sets.reduce((total, set) => {
    if (!set.completed) return total;
    const effectiveWeight =
      set.addedWeight !== undefined
        ? set.weight + set.addedWeight
        : set.weight;
    return total + effectiveWeight * set.reps;
  }, 0);
}

export function calculateWorkoutCalories(
  durationMs: number,
  totalVolume: number,
  exerciseCount: number,
): number {
  const durationMinutes = durationMs / 60_000;
  if (durationMinutes <= 0) return 0;

  const baseCaloriesPerMinute = 5;
  const volumeBonus = totalVolume / 10_000;
  const exerciseComplexityBonus = exerciseCount * 0.5;

  const estimatedCalories =
    (baseCaloriesPerMinute + volumeBonus + exerciseComplexityBonus) *
    durationMinutes;

  return Math.round(Math.max(estimatedCalories, 0));
}

export function detectWeightPR(
  exerciseId: string,
  newWeight: number,
  history: ExerciseHistoryEntry[],
): PersonalRecord | null {
  if (history.length === 0 || newWeight <= 0) return null;

  const exerciseHistory = history.filter(
    (entry) => entry.exerciseId === exerciseId,
  );
  if (exerciseHistory.length === 0) return null;

  const previousMaxWeight = Math.max(
    ...exerciseHistory.map((entry) => entry.maxWeight),
  );

  if (newWeight <= previousMaxWeight) return null;

  const bestEntry = exerciseHistory.reduce((best, entry) =>
    entry.maxWeight > best.maxWeight ? entry : best,
  );

  return {
    exerciseId,
    exerciseName: '',
    type: 'weight',
    previousBest: {
      weight: bestEntry.maxWeight,
      reps: bestEntry.maxReps,
      value: bestEntry.maxWeight,
    },
    newBest: {
      weight: newWeight,
      reps: 0,
      value: newWeight,
    },
    date: new Date().toISOString(),
  };
}

export function detectRepPR(
  exerciseId: string,
  weight: number,
  reps: number,
  history: ExerciseHistoryEntry[],
): PersonalRecord | null {
  if (history.length === 0 || reps <= 0) return null;

  const exerciseHistory = history.filter(
    (entry) => entry.exerciseId === exerciseId,
  );
  if (exerciseHistory.length === 0) return null;

  const matchingEntries = exerciseHistory.filter(
    (entry) => entry.maxWeight >= weight,
  );
  if (matchingEntries.length === 0) return null;

  let bestReps = 0;
  let bestEntry: ExerciseHistoryEntry | null = null;

  for (const entry of matchingEntries) {
    if (entry.maxWeight === weight && entry.maxReps > bestReps) {
      bestReps = entry.maxReps;
      bestEntry = entry;
    }
  }

  if (!bestEntry) {
    const heaviestEntry = matchingEntries.reduce((best, entry) =>
      entry.maxWeight > best.maxWeight ? entry : best,
    );
    if (weight > heaviestEntry.maxWeight) {
      return {
        exerciseId,
        exerciseName: '',
        type: 'reps',
        previousBest: {
          weight: heaviestEntry.maxWeight,
          reps: heaviestEntry.maxReps,
          value: heaviestEntry.maxReps,
        },
        newBest: { weight, reps, value: reps },
        date: new Date().toISOString(),
      };
    }
    return null;
  }

  if (reps <= bestReps) return null;

  return {
    exerciseId,
    exerciseName: '',
    type: 'reps',
    previousBest: {
      weight: bestEntry.maxWeight,
      reps: bestEntry.maxReps,
      value: bestEntry.maxReps,
    },
    newBest: { weight, reps, value: reps },
    date: new Date().toISOString(),
  };
}

export function detectVolumePR(
  exerciseId: string,
  newVolume: number,
  history: ExerciseHistoryEntry[],
): PersonalRecord | null {
  if (history.length === 0 || newVolume <= 0) return null;

  const exerciseHistory = history.filter(
    (entry) => entry.exerciseId === exerciseId,
  );
  if (exerciseHistory.length === 0) return null;

  const previousMaxVolume = Math.max(
    ...exerciseHistory.map((entry) => entry.totalVolume),
  );

  if (newVolume <= previousMaxVolume) return null;

  const bestEntry = exerciseHistory.reduce((best, entry) =>
    entry.totalVolume > best.totalVolume ? entry : best,
  );

  return {
    exerciseId,
    exerciseName: '',
    type: 'volume',
    previousBest: {
      weight: bestEntry.maxWeight,
      reps: bestEntry.maxReps,
      value: bestEntry.totalVolume,
    },
    newBest: {
      weight: 0,
      reps: 0,
      value: newVolume,
    },
    date: new Date().toISOString(),
  };
}

export function getProgressiveOverloadSuggestion(
  previousBest: { weight: number; reps: number; avgRpe?: number },
  exercise: Exercise,
): { weight: number; reps: number; message: string } {
  const { weight, reps, avgRpe } = previousBest;
  const isHighRPE = avgRpe !== undefined && avgRpe >= 9;
  const isModerateRPE = avgRpe !== undefined && avgRpe >= 7 && avgRpe < 9;

  if (isHighRPE && weight > 0) {
    const newReps = Math.min(reps + 1, 15);
    if (newReps > reps) {
      return {
        weight,
        reps: newReps,
        message: `Add 1 rep at ${weight}kg (you were at RPE ${avgRpe})`,
      };
    }
    const newWeight = weight * 1.025;
    return {
      weight: Math.round(newWeight * 2) / 2,
      reps: Math.max(reps - 1, 5),
      message: `Increase weight slightly to ${Math.round(newWeight * 2) / 2}kg, reduce reps`,
    };
  }

  if (isModerateRPE && weight > 0) {
    const newWeight = weight * 1.025;
    return {
      weight: Math.round(newWeight * 2) / 2,
      reps,
      message: `Try ${Math.round(newWeight * 2) / 2}kg for ${reps} reps`,
    };
  }

  if (weight > 0 && reps < 12) {
    return {
      weight,
      reps: reps + 1,
      message: `Add 1 rep at ${weight}kg`,
    };
  }

  if (weight > 0) {
    const newWeight = weight * 1.025;
    return {
      weight: Math.round(newWeight * 2) / 2,
      reps: Math.max(reps - 2, 6),
      message: `Increase weight to ${Math.round(newWeight * 2) / 2}kg`,
    };
  }

  return {
    weight: 0,
    reps: reps + 1,
    message: 'Add 1 rep',
  };
}

export function calculateRestTime(
  startTime: number,
  endTime: number,
): number {
  return Math.max(0, endTime - startTime);
}

export function formatWeight(weight: number, unit: 'kg' | 'lb' = 'kg'): string {
  return `${weight}${unit}`;
}

export function getRelativeDate(date: string): string {
  const inputDate = new Date(date);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfInput = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  );

  const diffMs = startOfToday.getTime() - startOfInput.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays < 730) return '1 year ago';
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
