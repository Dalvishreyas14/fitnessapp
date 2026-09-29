import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { useUserStore } from '../../src/store/userStore';

const locationOptions = [
  { id: 'gym', name: 'GYM', icon: '🏋️', description: 'Equipment-rich training.' },
  { id: 'home', name: 'HOME', icon: '🏠', description: 'Bodyweight / dumbbell / resistance band training.' },
];

export default function LocationScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const setProfile = useUserStore((s) => s.setProfile);

  const toggleLocation = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setProfile({ location: selected });
    router.push('/(onboarding)/equipment');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Where do you{'\n'}train?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <View style={styles.grid}>
          {locationOptions.map((loc) => {
            const isSelected = selected.includes(loc.id);
            return (
              <TouchableOpacity
                key={loc.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleLocation(loc.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardIcon}>{loc.icon}</Text>
                <Text style={[styles.cardName, isSelected && styles.cardNameSelected]}>
                  {loc.name}
                </Text>
                <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
                  {loc.description}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={selected.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  grid: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  cardName: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  cardNameSelected: {
    color: colors.primary,
  },
  cardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardDescSelected: {
    color: colors.textPrimary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
});
