import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  secureTextEntry?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
  error?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  style,
  error,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          multiline && styles.multiline,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    ...typography.small,
    color: colors.error,
  },
});
