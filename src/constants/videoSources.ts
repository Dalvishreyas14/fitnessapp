export interface VideoSource {
  exerciseId: string;
  demoUrl: string;
  tutorialUrl: string;
  thumbnailUrl: string;
  duration: string;
}

export const VIDEO_SOURCES: Record<string, VideoSource> = {
  'bench-press': { exerciseId: 'bench-press', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '2:15' },
  'incline-dumbbell-press': { exerciseId: 'incline-dumbbell-press', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:45' },
  'cable-fly': { exerciseId: 'cable-fly', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:30' },
  'squat': { exerciseId: 'squat', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '2:30' },
  'deadlift': { exerciseId: 'deadlift', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '2:45' },
  'pull-up': { exerciseId: 'pull-up', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:50' },
  'overhead-press': { exerciseId: 'overhead-press', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:40' },
  'barbell-row': { exerciseId: 'barbell-row', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '2:00' },
  'lat-pulldown': { exerciseId: 'lat-pulldown', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:35' },
  'dumbbell-curl': { exerciseId: 'dumbbell-curl', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:20' },
  'tricep-pushdown': { exerciseId: 'tricep-pushdown', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:15' },
  'leg-press': { exerciseId: 'leg-press', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:55' },
  'face-pull': { exerciseId: 'face-pull', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:25' },
  'cable-crunch': { exerciseId: 'cable-crunch', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:10' },
  'lateral-raise': { exerciseId: 'lateral-raise', demoUrl: '', tutorialUrl: '', thumbnailUrl: '', duration: '1:20' },
};

export function getVideoSource(exerciseId: string): VideoSource | null {
  return VIDEO_SOURCES[exerciseId] || null;
}

export const EXERCISE_SVG_ILLUSTRATIONS: Record<string, string> = {
  chest: '🫁',
  back: '🔙',
  shoulders: '🎯',
  arms: '💪',
  legs: '🦵',
  core: '🔥',
};

export function getExerciseIllustration(muscleGroups: string[]): string {
  if (muscleGroups.some(m => m.includes('chest'))) return '🫁';
  if (muscleGroups.some(m => m.includes('back') || m.includes('lats'))) return '🔙';
  if (muscleGroups.some(m => m.includes('delt'))) return '🎯';
  if (muscleGroups.some(m => m.includes('bicep') || m.includes('tricep'))) return '💪';
  if (muscleGroups.some(m => m.includes('quad') || m.includes('hamstring') || m.includes('glute') || m.includes('calf'))) return '🦵';
  if (muscleGroups.some(m => m.includes('abs') || m.includes('oblique'))) return '🔥';
  return '🏋️';
}
