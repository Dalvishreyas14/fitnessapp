import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface RPEInputProps {
  value: number | null;
  onChange: (rpe: number) => void;
}

const rpeLabels: Record<number, string> = {
  1: 'Very Light',
  2: 'Light',
  3: 'Easy',
  4: 'Moderate',
  5: 'Somewhat Hard',
  6: 'Hard',
  7: 'Very Hard',
  8: 'Very Hard+',
  9: 'Max Effort',
  10: 'Absolute Max',
};

export function RPEInput({ value, onChange }: RPEInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>RPE (Rate of Perceived Exertion)</Text>
      <View style={styles.scale}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.rpeButton,
              value === num && styles.rpeButtonSelected,
              num <= 3 && styles.rpeButtonEasy,
              num >= 4 && num <= 6 && styles.rpeButtonModerate,
              num >= 7 && num <= 8 && styles.rpeButtonHard,
              num >= 9 && styles.rpeButtonMax,
              value === num && num <= 3 && styles.rpeButtonEasySelected,
              value === num && num >= 4 && num <= 6 && styles.rpeButtonModerateSelected,
              value === num && num >= 7 && num <= 8 && styles.rpeButtonHardSelected,
              value === num && num >= 9 && styles.rpeButtonMaxSelected,
            ]}
            onPress={() => onChange(num)}
          >
            <Text style={[
              styles.rpeNumber,
              value === num && styles.rpeNumberSelected,
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {value && (
        <Text style={styles.rpeDescription}>{rpeLabels[value]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scale: {
    flexDirection: 'row',
    gap: 4,
  },
  rpeButton: {
    flex: 1,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeButtonEasy: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  rpeButtonModerate: {
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
  },
  rpeButtonHard: {
    backgroundColor: 'rgba(255, 145, 0, 0.15)',
  },
  rpeButtonMax: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
  },
  rpeButtonSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  rpeButtonEasySelected: {
    backgroundColor: 'rgba(0, 230, 118, 0.3)',
    borderColor: colors.success,
  },
  rpeButtonModerateSelected: {
    backgroundColor: 'rgba(255, 179, 0, 0.3)',
    borderColor: colors.warning,
  },
  rpeButtonHardSelected: {
    backgroundColor: 'rgba(255, 145, 0, 0.3)',
    borderColor: colors.orange,
  },
  rpeButtonMaxSelected: {
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
    borderColor: colors.error,
  },
  rpeNumber: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  rpeNumberSelected: {
    color: colors.white,
  },
  rpeDescription: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
