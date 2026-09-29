import { exercises, Exercise } from '../constants/exercises';

const muscleGroupMap: Record<string, string[]> = {
  'build-muscle': ['chest', 'back', 'shoulders', 'arms', 'legs'],
  'gain-strength': ['chest', 'back', 'legs', 'shoulders'],
  'lose-fat': ['chest', 'back', 'legs', 'core', 'shoulders'],
  'recomposition': ['chest', 'back', 'legs', 'shoulders', 'core'],
  'improve-fitness': ['chest', 'back', 'legs', 'core'],
  'athletic-performance': ['legs', 'back', 'shoulders', 'core'],
  'general-health': ['chest', 'back', 'legs', 'core', 'shoulders'],
};

const splitTemplates: Record<string, { name: string; muscles: string[] }[]> = {
  'ppl': [
    { name: 'Push Day', muscles: ['chest', 'shoulders'] },
    { name: 'Pull Day', muscles: ['back', 'biceps'] },
    { name: 'Leg Day', muscles: ['legs', 'core'] },
  ],
  'upper-lower': [
    { name: 'Upper Body', muscles: ['chest', 'back', 'shoulders', 'arms'] },
    { name: 'Lower Body', muscles: ['legs', 'core'] },
  ],
  'bro-split': [
    { name: 'Chest & Triceps', muscles: ['chest', 'triceps'] },
    { name: 'Back & Biceps', muscles: ['back', 'biceps'] },
    { name: 'Legs & Abs', muscles: ['legs', 'core'] },
    { name: 'Shoulders & Arms', muscles: ['shoulders', 'biceps', 'triceps'] },
  ],
  'full-body': [
    { name: 'Full Body', muscles: ['chest', 'back', 'legs', 'shoulders', 'core'] },
  ],
  'custom': [
    { name: 'Full Body', muscles: ['chest', 'back', 'legs', 'shoulders', 'core'] },
  ],
};

function getExercisesForMuscles(muscleIds: string[], equipment: string[]): Exercise[] {
  return exercises.filter((ex) => {
    const hasTarget = ex.targetMuscles.some((m) => muscleIds.includes(m));
    const hasEquipment = ex.equipment.length === 0 ||
      ex.equipment.some((e) => equipment.includes(e)) ||
      equipment.includes('bodyweight');
    return hasTarget && hasEquipment;
  }).slice(0, 14);
}

function getSetsForExperience(experience: string | null): number {
  switch (experience) {
    case 'beginner': return 3;
    case 'intermediate': return 3;
    case 'advanced': return 4;
    case 'athlete': return 4;
    default: return 3;
  }
}

function getRepsForGoal(goal: string[]): string {
  if (goal.includes('gain-strength')) return '5-8';
  if (goal.includes('build-muscle')) return '8-12';
  if (goal.includes('lose-fat')) return '12-15';
  return '8-12';
}

export function generateTodayWorkout(
  goals: string[],
  experience: string | null,
  equipment: string[],
  trainingStyle: string,
): { name: string; exercises: Exercise[]; muscleGroups: string[]; duration: number } {
  const style = splitTemplates[trainingStyle] || splitTemplates['custom'];
  const todayIndex = new Date().getDay() % style.length;
  const todaySplit = style[todayIndex];

  const targetExercises = getExercisesForMuscles(todaySplit.muscles, equipment);
  const sets = getSetsForExperience(experience);
  const reps = getRepsForGoal(goals);

  const exercisesWithSets = targetExercises.map((ex) => ({
    ...ex,
    sets: sets.toString(),
    reps,
  }));

  const estimatedDuration = exercisesWithSets.length * 4 + sets * exercisesWithSets.length;

  return {
    name: todaySplit.name,
    exercises: exercisesWithSets,
    muscleGroups: todaySplit.muscles,
    duration: estimatedDuration,
  };
}

export function getAIRecommendation(goals: string[], weeklyVolume: number): string {
  if (goals.includes('build-muscle')) {
    if (weeklyVolume < 10000) {
      return 'Your weekly volume is below target. Today\'s workout increases volume to help you reach your muscle-building goals.';
    }
    return 'Great progress this week! Your volume is on track. Today\'s workout maintains intensity while allowing recovery.';
  }
  if (goals.includes('gain-strength')) {
    return 'Focus on heavy compound lifts today. The AI recommends increasing weight on your main lifts by 2.5kg if last session felt manageable.';
  }
  if (goals.includes('lose-fat')) {
    return 'Today\'s workout includes higher-rep sets with shorter rest periods to maximize calorie burn while preserving muscle.';
  }
  return 'Your workout is optimized for your goals. Keep pushing and stay consistent!';
}
