import { SetType } from '../types';

export type { SetType };

export interface SetTypeInfo {
  id: SetType;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

export const SET_TYPES: SetTypeInfo[] = [
  { id: 'warmup', label: 'Warm-up', shortLabel: 'WU', color: '#A0A0A0', bgColor: 'rgba(160,160,160,0.15)', icon: '🌡️', description: 'Light set to prepare muscles' },
  { id: 'working', label: 'Working Set', shortLabel: 'WRK', color: '#FFFFFF', bgColor: 'rgba(255,255,255,0.1)', icon: '💪', description: 'Standard working set' },
  { id: 'dropset', label: 'Drop Set', shortLabel: 'DRP', color: '#FF9100', bgColor: 'rgba(255,145,0,0.15)', icon: '📉', description: 'Reduce weight and continue' },
  { id: 'failure', label: 'Failure', shortLabel: 'FAIL', color: '#FF5252', bgColor: 'rgba(255,82,82,0.15)', icon: '🔥', description: 'Train until muscular failure' },
  { id: 'backoff', label: 'Back-off Set', shortLabel: 'BKF', color: '#448AFF', bgColor: 'rgba(68,138,255,0.15)', icon: '↩️', description: 'Lighter set after heavy sets' },
  { id: 'amrap', label: 'AMRAP', shortLabel: 'AMR', color: '#BB86FC', bgColor: 'rgba(187,134,252,0.15)', icon: '⚡', description: 'As Many Reps As Possible' },
  { id: 'rest-pause', label: 'Rest-Pause', shortLabel: 'RP', color: '#00BCD4', bgColor: 'rgba(0,188,212,0.15)', icon: '⏸️', description: 'Brief rest then continue set' },
  { id: 'superset', label: 'Superset', shortLabel: 'SS', color: '#CCFF00', bgColor: 'rgba(204,255,0,0.15)', icon: '🔄', description: 'Two exercises back-to-back' },
  { id: 'giant-set', label: 'Giant Set', shortLabel: 'GS', color: '#E040FB', bgColor: 'rgba(224,64,251,0.15)', icon: '🔁', description: 'Three+ exercises back-to-back' },
];

export function getSetTypeInfo(type: SetType): SetTypeInfo {
  return SET_TYPES.find((t) => t.id === type) || SET_TYPES[1];
}

export function getSetColor(type: SetType): string {
  return getSetTypeInfo(type).color;
}

export function getSetBgColor(type: SetType): string {
  return getSetTypeInfo(type).bgColor;
}
