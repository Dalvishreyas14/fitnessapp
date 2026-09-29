import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { equipmentList } from '../../src/constants/exercises';
import { useUserStore } from '../../src/store/userStore';

export default function EquipmentScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const setProfile = useUserStore((s) => s.setProfile);

  const toggleEquipment = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setProfile({ equipment: selected });
    router.push('/(onboarding)/body-profile');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>What equipment{'\n'}do you have?</Text>
          <Text style={styles.subtitle}>Select all available equipment</Text>
        </View>

        <View style={styles.grid}>
          {equipmentList.map((eq) => {
            const isSelected = selected.includes(eq);
            return (
              <TouchableOpacity
                key={eq}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleEquipment(eq)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardIcon}>🏋️</Text>
                <Text style={[styles.cardName, isSelected && styles.cardNameSelected]}>
                  {eq.replace(/-/g, ' ')}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
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
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  cardName: {
    ...typography.bodyBold,
    color: colors.white,
    textAlign: 'center',
  },
  cardNameSelected: {
    color: colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
});
