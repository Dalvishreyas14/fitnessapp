import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { Button } from '../src/components/ui/Button';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={colors.primary} />
      </View>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>The screen you're looking for doesn't exist.</Text>
      <Button title="Go Home" onPress={() => router.replace('/(tabs)')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
});
