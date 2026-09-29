import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing, radii } from '../../../src/theme/spacing';
import { Card, Badge } from '../../../src/components/ui';
import { exercises } from '../../../src/constants/exercises';
import { muscles } from '../../../src/constants/muscles';
import { VideoPlayer } from '../../../src/components/video/VideoPlayer';

type VideoTab = 'demo' | 'tutorial' | 'mistakes';

const VIDEO_TABS: { key: VideoTab; label: string }[] = [
  { key: 'demo', label: 'Demo' },
  { key: 'tutorial', label: 'Tutorial' },
  { key: 'mistakes', label: 'Mistakes' },
];

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = exercises.find((e) => e.id === id);
  const [activeVideoTab, setActiveVideoTab] = useState<VideoTab>('demo');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exercise</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Exercise not found</Text>
        </View>
      </View>
    );
  }

  const targetMuscleNames = exercise.targetMuscles
    .map((id) => muscles.find((m) => m.id === id)?.name || id)
    .join(', ');

  const secondaryMuscleNames = exercise.secondaryMuscles
    .map((id) => muscles.find((m) => m.id === id)?.name || id)
    .join(', ');

  const targetMuscleLabels = exercise.targetMuscles
    .map((id) => muscles.find((m) => m.id === id)?.name || id);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exercise Detail</Text>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            style={styles.favButton}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.error : colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* Video Type Tabs */}
        <View style={styles.tabRow}>
          {VIDEO_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeVideoTab === tab.key && styles.tabActive]}
              onPress={() => setActiveVideoTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeVideoTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Video Player */}
        <View style={styles.videoSection}>
          <VideoPlayer exerciseName={exercise.name} category={targetMuscleLabels[0]} />
        </View>

        {/* Exercise Info */}
        <View style={styles.titleSection}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={exercise.difficulty.toUpperCase()} variant={exercise.difficulty === 'beginner' ? 'success' : exercise.difficulty === 'intermediate' ? 'warning' : 'error'} />
            <Badge label={exercise.location.toUpperCase()} variant="muted" />
            <Badge label={exercise.category.toUpperCase()} variant="muted" />
          </View>
        </View>

        {/* Target Muscles */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>TARGET MUSCLES</Text>
          <Text style={styles.infoValue}>{targetMuscleNames}</Text>
          {secondaryMuscleNames && (
            <>
              <Text style={[styles.infoLabel, { marginTop: spacing.md }]}>SECONDARY</Text>
              <Text style={styles.infoValue}>{secondaryMuscleNames}</Text>
            </>
          )}
        </Card>

        {/* Equipment */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>EQUIPMENT</Text>
          <View style={styles.equipRow}>
            {exercise.equipment.map((eq) => (
              <Badge key={eq} label={eq.replace('-', ' ')} variant="muted" />
            ))}
          </View>
        </Card>

        {/* Recommended Sets/Reps */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoLabel}>RECOMMENDED</Text>
          <View style={styles.recRow}>
            <View style={styles.recItem}>
              <Text style={styles.recValue}>{exercise.sets}</Text>
              <Text style={styles.recLabel}>SETS</Text>
            </View>
            <View style={styles.recDivider} />
            <View style={styles.recItem}>
              <Text style={styles.recValue}>{exercise.reps}</Text>
              <Text style={styles.recLabel}>REPS</Text>
            </View>
            <View style={styles.recDivider} />
            <View style={styles.recItem}>
              <Text style={styles.recValue}>{exercise.restTime}s</Text>
              <Text style={styles.recLabel}>REST</Text>
            </View>
          </View>
        </Card>

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        {exercise.instructions.map((step, i) => (
          <View key={i} style={styles.instructionRow}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>{i + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{step}</Text>
          </View>
        ))}

        {/* Form Cues */}
        <Text style={styles.sectionTitle}>Form Cues</Text>
        <Card style={styles.cuesCard}>
          {exercise.formCues.map((cue, i) => (
            <View key={i} style={[styles.cueRow, i < exercise.formCues.length - 1 && styles.cueRowBorder]}>
              <View style={styles.cueIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              </View>
              <Text style={styles.cueText}>{cue}</Text>
            </View>
          ))}
        </Card>

        {/* Common Mistakes */}
        <Text style={styles.sectionTitle}>Common Mistakes</Text>
        <Card style={styles.cuesCard}>
          {exercise.commonMistakes.map((mistake, i) => (
            <View key={i} style={[styles.cueRow, i < exercise.commonMistakes.length - 1 && styles.cueRowBorder]}>
              <View style={styles.mistakeIconContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.warning} />
              </View>
              <Text style={styles.cueText}>{mistake}</Text>
            </View>
          ))}
        </Card>

        {/* Exercise History */}
        <Text style={styles.sectionTitle}>History</Text>
        <Card style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={styles.historyIconWrap}>
              <Ionicons name="time-outline" size={20} color={colors.info} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyLabel}>Last workout</Text>
              <Text style={styles.historyValue}>60kg × 10 (3 sets)</Text>
            </View>
          </View>
          <View style={styles.historyDivider} />
          <View style={styles.historyRow}>
            <View style={styles.historyIconWrap}>
              <Ionicons name="trophy-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyLabel}>Best set</Text>
              <Text style={styles.historyValue}>65kg × 8</Text>
            </View>
          </View>
          <View style={styles.historyDivider} />
          <View style={styles.historyRow}>
            <View style={styles.historyIconWrap}>
              <Ionicons name="bar-chart-outline" size={20} color={colors.success} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyLabel}>Total volume</Text>
              <Text style={styles.historyValue}>1,800 kg</Text>
            </View>
          </View>
        </Card>

        {/* Alternatives */}
        {exercise.alternatives.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Alternatives</Text>
            <View style={styles.altGrid}>
              {exercise.alternatives.map((alt) => (
                <TouchableOpacity
                  key={alt}
                  style={styles.altCard}
                  onPress={() => router.push(`/workout/exercise/${alt}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.altCardIcon}>
                    <Ionicons name="repeat-outline" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.altCardName}>{alt.replace(/-/g, ' ')}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/workout/active')}
        >
          <Ionicons name="play" size={20} color={colors.background} />
          <Text style={styles.startButtonText}>Start Exercise</Text>
        </TouchableOpacity>
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
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.white,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
  },
  videoSection: {
    marginBottom: spacing.xl,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  exerciseName: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  infoValue: {
    ...typography.body,
    color: colors.white,
    textTransform: 'capitalize',
  },
  equipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recItem: {
    flex: 1,
    alignItems: 'center',
  },
  recValue: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: 2,
  },
  recLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  recDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.surfaceBorder,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.white,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  instructionText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  cuesCard: {
    marginBottom: spacing.md,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  cueRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  cueIconContainer: {
    marginTop: 2,
  },
  mistakeIconContainer: {
    marginTop: 2,
  },
  cueText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  historyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: 2,
  },
  historyValue: {
    ...typography.bodyBold,
    color: colors.white,
  },
  historyDivider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginLeft: 56,
  },
  altGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  altCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  altCardIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  altCardName: {
    ...typography.bodyBold,
    color: colors.white,
    textTransform: 'capitalize',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.lg,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  startButtonText: {
    ...typography.button,
    color: colors.background,
  },
});
