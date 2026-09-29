import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'bordered';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  default: {},
  elevated: {
    backgroundColor: colors.surfaceLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
});
