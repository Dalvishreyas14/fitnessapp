export interface Muscle {
  id: string;
  name: string;
  group: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core';
  region?: string;
}

export const muscles: Muscle[] = [
  { id: 'upper-chest', name: 'Upper Chest', group: 'chest', region: 'Upper' },
  { id: 'mid-chest', name: 'Mid Chest', group: 'chest', region: 'Mid' },
  { id: 'lower-chest', name: 'Lower Chest', group: 'chest', region: 'Lower' },
  { id: 'front-delt', name: 'Front Deltoid', group: 'shoulders' },
  { id: 'lateral-delt', name: 'Lateral Deltoid', group: 'shoulders' },
  { id: 'rear-delt', name: 'Rear Deltoid', group: 'shoulders' },
  { id: 'biceps', name: 'Biceps', group: 'arms' },
  { id: 'triceps', name: 'Triceps', group: 'arms' },
  { id: 'forearms', name: 'Forearms', group: 'arms' },
  { id: 'lats', name: 'Lats', group: 'back' },
  { id: 'upper-back', name: 'Upper Back', group: 'back' },
  { id: 'lower-back', name: 'Lower Back', group: 'back' },
  { id: 'traps', name: 'Traps', group: 'back' },
  { id: 'abs', name: 'Abs', group: 'core' },
  { id: 'obliques', name: 'Obliques', group: 'core' },
  { id: 'glutes', name: 'Glutes', group: 'legs' },
  { id: 'quads', name: 'Quadriceps', group: 'legs' },
  { id: 'hamstrings', name: 'Hamstrings', group: 'legs' },
  { id: 'calves', name: 'Calves', group: 'legs' },
];

export const muscleGroups = [
  { id: 'chest', name: 'Chest', icon: '💪', color: '#FF5252' },
  { id: 'back', name: 'Back', icon: '🔙', color: '#448AFF' },
  { id: 'shoulders', name: 'Shoulders', icon: '🎯', color: '#BB86FC' },
  { id: 'arms', name: 'Arms', icon: '💪', color: '#FF9100' },
  { id: 'legs', name: 'Legs', icon: '🦵', color: '#00E676' },
  { id: 'core', name: 'Core', icon: '🔥', color: '#FFB300' },
];
