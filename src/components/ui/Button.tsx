import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.background : colors.white} size="small" />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
  },
  secondary: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: radii.lg,
  },
  danger: {
    backgroundColor: colors.error,
    borderRadius: radii.lg,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 40,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 60,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  text_primary: {
    color: colors.background,
  },
  text_secondary: {
    color: colors.white,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.white,
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
});
