import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card } from '../../src/components/ui';
import { useWorkoutStore } from '../../src/store/workoutStore';

export default function SettingsScreen() {
  const { restTimerConfig, updateRestTimerConfig, history, personalRecords } = useWorkoutStore();

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Workout History',
      'This will permanently delete all your workout history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Workout history cleared.') },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your data including preferences, workout history, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: () => Alert.alert('All data cleared.') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>WORKOUT SETTINGS</Text>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/settings/rest-timer')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="timer-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Default Rest Duration</Text>
                <Text style={styles.settingValue}>{restTimerConfig.defaultDuration} sec</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="barbell-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Weight Unit</Text>
              </View>
            </View>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
                onPress={() => setWeightUnit('kg')}
              >
                <Text style={[styles.unitButtonText, weightUnit === 'kg' && styles.unitButtonTextActive]}>kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, weightUnit === 'lb' && styles.unitButtonActive]}
                onPress={() => setWeightUnit('lb')}
              >
                <Text style={[styles.unitButtonText, weightUnit === 'lb' && styles.unitButtonTextActive]}>lb</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
              </View>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={colors.textSecondary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Audio Feedback</Text>
              </View>
            </View>
            <Switch
              value={audioFeedback}
              onValueChange={setAudioFeedback}
              trackColor={{ false: colors.surfaceLight, true: colors.primary }}
              thumbColor={colors.textSecondary}
            />
          </View>
        </Card>

        <Text style={styles.sectionLabel}>DATA MANAGEMENT</Text>
        <Card style={styles.card}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="download-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Export Data</Text>
                <Text style={styles.settingHint}>Export your workout data as CSV</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} onPress={handleClearHistory}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.error }]}>Clear Workout History</Text>
                <Text style={styles.settingHint}>Remove all past workouts</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRow} onPress={handleClearAllData}>
            <View style={styles.settingInfo}>
              <Ionicons name="warning-outline" size={22} color={colors.error} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.error }]}>Clear All Data</Text>
                <Text style={styles.settingHint}>Delete everything and reset the app</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>App Version</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>FitPro AI v1.0.0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="code-outline" size={22} color={colors.textSecondary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Build</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>Expo SDK 57</Text>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  settingValue: {
    ...typography.body,
    color: colors.textMuted,
  },
  settingHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceLight,
    marginLeft: 54,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.sm,
    padding: 2,
  },
  unitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm - 2,
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
  },
  unitButtonText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  unitButtonTextActive: {
    color: colors.textSecondary,
  },
  bottomSpacer: {
    height: 40,
  },
});
