import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'muted';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantColors = {
  primary: { bg: colors.primaryMuted, text: colors.primary },
  success: { bg: 'rgba(0, 230, 118, 0.15)', text: colors.success },
  warning: { bg: 'rgba(255, 179, 0, 0.15)', text: colors.warning },
  error: { bg: 'rgba(255, 82, 82, 0.15)', text: colors.error },
  info: { bg: 'rgba(68, 138, 255, 0.15)', text: colors.blue },
  muted: { bg: colors.surfaceLight, text: colors.textMuted },
};

export function Badge({ label, variant = 'primary', size = 'sm', style }: BadgeProps) {
  const vColors = variantColors[variant];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: vColors.bg },
        size === 'md' && styles.md,
        style,
      ]}
    >
      <Text style={[styles.text, { color: vColors.text }, size === 'md' && styles.textMd]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.small,
    fontWeight: '600',
  },
  textMd: {
    ...typography.captionBold,
  },
});
