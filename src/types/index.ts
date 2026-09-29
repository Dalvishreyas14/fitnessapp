export type SetType =
  | 'warmup'
  | 'working'
  | 'dropset'
  | 'failure'
  | 'backoff'
  | 'amrap'
  | 'rest-pause'
  | 'superset'
  | 'giant-set';

export interface Exercise {
  id: string;
  name: string;
  category: 'compound' | 'isolation' | 'plyometric' | 'cardio' | 'mobility';
  targetMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  location: 'gym' | 'home' | 'both';
  instructions: string[];
  commonMistakes: string[];
  formCues: string[];
  sets: string;
  reps: string;
  restTime: number;
  alternatives: string[];
  isBodyweight: boolean;
  supportsAddedWeight: boolean;
  supportsAssistedWeight: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
}

export interface SetLog {
  setNumber: number;
  setType: SetType;
  reps: number;
  weight: number;
  rpe?: number;
  completed: boolean;
  notes: string;
  tempo?: string;
  distance?: number;
  time?: number;
  bodyweight?: number;
  addedWeight?: number;
  assistedWeight?: number;
  restDuration?: number;
  volume?: number;
}

export interface ExerciseLog {
  exerciseId: string;
  exercise: Exercise;
  sets: SetLog[];
  notes: string;
  targetMuscles: string[];
  supersetId?: string;
}

export interface SupersetGroup {
  id: string;
  label: string;
  exerciseIds: string[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  exercises: ExerciseLog[];
  supersets: SupersetGroup[];
  totalVolume: number;
  totalSets: number;
  completed: boolean;
  muscleGroups: string[];
  calories?: number;
  prsAchieieved?: string[];
}

export interface WorkoutHistoryEntry {
  id: string;
  name: string;
  date: string;
  exercises: number;
  volume: string;
  duration: string;
  muscleGroups: string[];
  sets: number;
  calories: number;
  prCount: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'volume' | 'e1rm';
  previousBest: { weight: number; reps: number; value: number };
  newBest: { weight: number; reps: number; value: number };
  date: string;
}

export interface ExerciseHistoryEntry {
  exerciseId: string;
  date: string;
  sets: SetLog[];
  totalVolume: number;
  maxWeight: number;
  maxReps: number;
  e1rm: number;
  avgRpe?: number;
  duration: number;
}

export interface RestTimerConfig {
  defaultDuration: number;
  presets: number[];
  hapticEnabled: boolean;
  audioEnabled: boolean;
  countdownWarning: number;
}

export interface SavedVideo {
  id: string;
  exerciseId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  savedAt: string;
}

export interface VideoFeedItem {
  id: string;
  exerciseId: string;
  title: string;
  description: string;
  creatorName: string;
  creatorAvatar: string;
  thumbnailUrl: string;
  videoUrl: string;
  likes: number;
  comments: number;
  duration: string;
  category: string;
  tags: string[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: { exerciseId: string; sets: number; reps: string; restTime: number }[];
  muscleGroups: string[];
  duration: number;
  difficulty: string;
  createdBy: string;
}

export type WeightUnit = 'kg' | 'lb';

export interface UserSettings {
  weightUnit: WeightUnit;
  restTimer: RestTimerConfig;
  hapticFeedback: boolean;
  audioFeedback: boolean;
}
