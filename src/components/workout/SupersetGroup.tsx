import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SupersetGroupProps {
  label: string;
  children: React.ReactNode;
}

export function SupersetGroup({ label, children }: SupersetGroupProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.content}>
        <View style={styles.leftBorder} />
        <View style={styles.children}>{children}</View>
      </View>
      <View style={styles.endLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.primary,
    marginRight: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
  },
  leftBorder: {
    width: 2,
    backgroundColor: colors.primary,
    opacity: 0.3,
    marginRight: spacing.md,
  },
  children: {
    flex: 1,
  },
  endLine: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginTop: spacing.sm,
    marginLeft: spacing.md,
  },
});
