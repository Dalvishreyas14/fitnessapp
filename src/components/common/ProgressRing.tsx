import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = colors.primary,
  label,
  value,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.backgroundRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: colors.surfaceLight,
          },
        ]}
      />
      <View
        style={[
          styles.progressRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: '-90deg' }],
            borderRightColor: clampedProgress >= 0.25 ? color : 'transparent',
            borderBottomColor: clampedProgress >= 0.5 ? color : 'transparent',
            borderLeftColor: clampedProgress >= 0.75 ? color : 'transparent',
            borderTopColor: clampedProgress >= 1 ? color : 'transparent',
          },
        ]}
      />
      <View style={styles.content}>
        {value && <Text style={[styles.value, { fontSize: size * 0.22 }]}>{value}</Text>}
        {label && <Text style={[styles.label, { fontSize: size * 0.1 }]}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundRing: {
    position: 'absolute',
  },
  progressRing: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '800',
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
