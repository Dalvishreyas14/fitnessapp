import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge } from '../../src/components/ui';
import { exercises } from '../../src/constants/exercises';
import { muscleGroups } from '../../src/constants/muscles';
import { useWorkoutStore } from '../../src/store/workoutStore';

export default function WorkoutScreen() {
  const { history } = useWorkoutStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workout</Text>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Quick Start */}
        <Card style={styles.quickStartCard}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.quickStartRow}>
            <TouchableOpacity
              style={styles.quickStartButton}
              onPress={() => router.push('/workout/active')}
            >
              <View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.primary, borderRadius: radii.lg }]} />
              <Ionicons name="play" size={24} color={colors.background} />
              <Text style={styles.quickStartText}>Start{'\n'}Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickStartButton}>
              <Ionicons name="add-circle-outline" size={24} color={colors.white} />
              <Text style={styles.quickStartText}>Create{'\n'}Program</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickStartButton}>
              <Ionicons name="calendar-outline" size={24} color={colors.white} />
              <Text style={styles.quickStartText}>Schedule{'\n'}Workout</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Muscle Groups */}
        <Text style={styles.sectionTitle}>Browse by Muscle</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleScroll}>
          {muscleGroups.map((mg) => (
            <TouchableOpacity key={mg.id} style={styles.muscleChip}>
              <Text style={styles.muscleIcon}>{mg.icon}</Text>
              <Text style={styles.muscleName}>{mg.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Workouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <TouchableOpacity onPress={() => router.push('/workout/history')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {history.length > 0 ? (
          history.map((w) => (
            <Card key={w.id} style={styles.recentCard}>
              <View style={styles.recentHeader}>
                <View>
                  <Text style={styles.recentName}>{w.name}</Text>
                  <Text style={styles.recentDate}>{w.date}</Text>
                </View>
                <Badge label={w.duration} variant="muted" />
              </View>
              <View style={styles.recentStats}>
                <View style={styles.recentStat}>
                  <Ionicons name="barbell-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.recentStatText}>{w.exercises} exercises</Text>
                </View>
                <View style={styles.recentStat}>
                  <Ionicons name="trending-up-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.recentStatText}>{w.volume}</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Start your first workout to see it here</Text>
          </Card>
        )}

        {/* Exercise Library */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercise Library</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {exercises.slice(0, 4).map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={styles.exerciseItem}
            onPress={() => router.push(`/workout/exercise/${ex.id}`)}
          >
            <View style={styles.exerciseIconContainer}>
              <Ionicons name="fitness-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMuscles}>
                {ex.targetMuscles.slice(0, 2).join(', ')}
              </Text>
            </View>
            <Badge label={ex.difficulty} variant={ex.difficulty === 'beginner' ? 'success' : ex.difficulty === 'intermediate' ? 'warning' : 'error'} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  quickStartCard: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.md,
  },
  quickStartRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickStartButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 90,
  },
  quickStartText: {
    ...typography.captionBold,
    color: colors.white,
    textAlign: 'center',
  },
  muscleScroll: {
    marginBottom: spacing.xxl,
  },
  muscleChip: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  muscleIcon: {
    fontSize: 18,
  },
  muscleName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  seeAll: {
    ...typography.body,
    color: colors.primary,
  },
  recentCard: {
    marginBottom: spacing.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  recentName: {
    ...typography.h4,
    color: colors.white,
  },
  recentDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  recentStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  recentStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  recentStatText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xxxl,
    marginBottom: spacing.sm,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.bodyBold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textMuted,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  exerciseMuscles: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
