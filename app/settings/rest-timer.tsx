import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Button } from '../../src/components/ui';
import { useWorkoutStore } from '../../src/store/workoutStore';

const PRESETS = [30, 45, 60, 90, 120, 180];

export default function RestTimerScreen() {
  const { restTimerConfig, updateRestTimerConfig } = useWorkoutStore();

  const [duration, setDuration] = useState(String(restTimerConfig.defaultDuration));
  const [countdownWarning, setCountdownWarning] = useState(restTimerConfig.countdownWarning);
  const [audioEnabled, setAudioEnabled] = useState(restTimerConfig.audioEnabled);
  const [hapticEnabled, setHapticEnabled] = useState(restTimerConfig.hapticEnabled);

  const selectedDuration = Number(duration) || 0;

  const handlePresetPress = (seconds: number) => {
    setDuration(String(seconds));
  };

  const handleSave = () => {
    const value = Number(duration);
    if (value > 0 && value <= 600) {
      updateRestTimerConfig({
        defaultDuration: value,
        countdownWarning,
        audioEnabled,
        hapticEnabled,
      });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rest Timer</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.durationPreview}>
          <Text style={styles.durationValue}>{duration || '0'}</Text>
          <Text style={styles.durationUnit}>seconds</Text>
        </View>

        <Text style={styles.sectionLabel}>QUICK PRESETS</Text>
        <View style={styles.presetGrid}>
          {PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.presetButton,
                selectedDuration === preset && styles.presetButtonActive,
              ]}
              onPress={() => handlePresetPress(preset)}
            >
              <Text
                style={[
                  styles.presetButtonText,
                  selectedDuration === preset && styles.presetButtonTextActive,
                ]}
              >
                {preset}s
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>CUSTOM DURATION</Text>
        <Card style={styles.card}>
          <View style={styles.inputRow}>
            <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                if (cleaned.length <= 3) setDuration(cleaned);
              }}
              keyboardType="number-pad"
              placeholder="Enter seconds"
              placeholderTextColor={colors.textMuted}
              maxLength={3}
            />
            <Text style={styles.inputUnit}>sec</Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>OPTIONS</Text>
        <Card style={styles.card}>
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Ionicons name="alert-circle-outline" size={22} color={colors.textSecondary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Countdown Warning</Text>
                <Text style={styles.optionHint}>Beep 10 seconds before rest ends</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setCountdownWarning(countdownWarning > 0 ? 0 : 10)}
              style={[styles.toggle, countdownWarning > 0 && styles.toggleActive]}
            >
              <View style={[styles.toggleThumb, countdownWarning > 0 && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Ionicons name="volume-high-outline" size={22} color={colors.textSecondary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Audio Notification</Text>
                <Text style={styles.optionHint}>Voice says "Rest complete"</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setAudioEnabled(!audioEnabled)}
              style={[styles.toggle, audioEnabled && styles.toggleActive]}
            >
              <View style={[styles.toggleThumb, audioEnabled && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <Ionicons name="phone-portrait-outline" size={22} color={colors.textSecondary} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>Haptic Feedback</Text>
                <Text style={styles.optionHint}>Vibrate when rest is complete</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setHapticEnabled(!hapticEnabled)}
              style={[styles.toggle, hapticEnabled && styles.toggleActive]}
            >
              <View style={[styles.toggleThumb, hapticEnabled && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </Card>

        <Button
          title="Save"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={!selectedDuration || selectedDuration <= 0}
        />

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
  durationPreview: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  durationValue: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  durationUnit: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  presetButton: {
    width: '31%',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetButtonText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '600',
  },
  presetButtonTextActive: {
    color: colors.textSecondary,
  },
  card: {
    padding: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.h2,
    color: colors.textSecondary,
    padding: 0,
  },
  inputUnit: {
    ...typography.body,
    color: colors.textMuted,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  optionHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textSecondary,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceLight,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
  bottomSpacer: {
    height: 40,
  },
});
