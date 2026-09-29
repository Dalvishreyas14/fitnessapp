import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge, ProgressBar } from '../../src/components/ui';
import { useUserStore } from '../../src/store/userStore';
import { useWorkoutStore } from '../../src/store/workoutStore';
import { generateTodayWorkout, getAIRecommendation } from '../../src/utils/aiWorkoutGenerator';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const profile = useUserStore((s) => s.profile);
  const { streak, weeklyVolume, personalRecords, history } = useWorkoutStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayWorkout = useMemo(() => {
    return generateTodayWorkout(
      profile.goals,
      profile.experience,
      profile.equipment,
      profile.trainingStyle,
    );
  }, [profile.goals, profile.experience, profile.equipment, profile.trainingStyle]);

  const aiRecommendation = useMemo(() => {
    return getAIRecommendation(profile.goals, weeklyVolume);
  }, [profile.goals, weeklyVolume]);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const completedDays = history.length > 0 ? Math.min(history.length, 5) : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {profile.name} 👋</Text>
            <Text style={styles.date}>
              {today.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Today's Workout */}
        <Card style={styles.workoutCard}>
          <LinearGradient
            colors={['rgba(204, 255, 0, 0.1)', 'transparent']}
            style={styles.workoutGradient}
          />
          <View style={styles.workoutHeader}>
            <Badge label="TODAY'S TRAINING" variant="primary" />
            <Badge label={`${todayWorkout.duration} min`} variant="muted" />
          </View>
          <Text style={styles.workoutTitle}>{todayWorkout.name.toUpperCase()}</Text>
          <Text style={styles.workoutMeta}>
            {todayWorkout.exercises.length} exercises · {todayWorkout.exercises.length * 3} working sets
          </Text>

          {/* Muscle Focus */}
          <View style={styles.muscleFocus}>
            <Text style={styles.muscleFocusTitle}>🔥 Muscle Focus</Text>
            {todayWorkout.muscleGroups.slice(0, 3).map((muscle, i) => (
              <View key={muscle} style={styles.muscleBar}>
                <Text style={styles.muscleName}>{muscle}</Text>
                <ProgressBar
                  progress={0.9 - i * 0.15}
                  color={i === 0 ? colors.primary : i === 1 ? colors.blue : colors.purple}
                />
                <Text style={styles.musclePercent}>{Math.round((0.9 - i * 0.15) * 100)}%</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push('/workout/active')}
          >
            <Ionicons name="play" size={20} color={colors.background} />
            <Text style={styles.startButtonText}>START WORKOUT</Text>
          </TouchableOpacity>
        </Card>

        {/* AI Recommendation */}
        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <Text style={styles.aiIcon}>🤖</Text>
            </View>
            <View style={styles.aiContent}>
              <Badge label="AI RECOMMENDATION" variant="info" size="sm" />
              <Text style={styles.aiText}>{aiRecommendation}</Text>
            </View>
          </View>
          <View style={styles.aiActions}>
            <TouchableOpacity style={styles.aiButton} onPress={() => router.push('/workout/active')}>
              <Text style={styles.aiButtonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.aiButton, styles.aiButtonSecondary]}
              onPress={() => router.push('/workout/import')}
            >
              <Text style={[styles.aiButtonText, styles.aiButtonTextSecondary]}>Customize</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard icon="🔥" value={`${streak}`} label="Day Streak" color={colors.orange} />
          <StatCard icon="📈" value={`${(weeklyVolume / 1000).toFixed(1)}k`} label="Weekly Volume" color={colors.blue} />
          <StatCard icon="🏆" value={`${personalRecords.length}`} label="PRs This Month" color={colors.purple} />
        </View>

        {/* Weekly Progress */}
        <Card style={styles.weeklyCard}>
          <Text style={styles.weeklyTitle}>Weekly Progress</Text>
          <View style={styles.weeklyDays}>
            {weekDays.map((day, i) => (
              <View key={i} style={styles.dayColumn}>
                <View
                  style={[
                    styles.dayCircle,
                    i < completedDays && styles.dayCompleted,
                    i === dayOfWeek && styles.dayToday,
                  ]}
                >
                  {i < completedDays && <Ionicons name="checkmark" size={14} color={colors.background} />}
                  {i === dayOfWeek && completedDays <= i && <View style={styles.dayDot} />}
                </View>
                <Text style={[styles.dayLabel, i === dayOfWeek && styles.dayLabelToday]}>{day}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/workout/active')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
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
  greeting: {
    ...typography.h2,
    color: colors.white,
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  workoutCard: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  workoutGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  workoutHeader: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  workoutTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  workoutMeta: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  muscleFocus: {
    marginBottom: spacing.xl,
  },
  muscleFocusTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  muscleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  muscleName: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 70,
    textTransform: 'capitalize',
  },
  musclePercent: {
    ...typography.captionBold,
    color: colors.textPrimary,
    width: 35,
    textAlign: 'right',
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
  aiCard: {
    marginBottom: spacing.lg,
  },
  aiHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: 'rgba(68, 138, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIcon: {
    fontSize: 20,
  },
  aiContent: {
    flex: 1,
    gap: spacing.sm,
  },
  aiText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  aiActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  aiButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  aiButtonSecondary: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  aiButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
  aiButtonTextSecondary: {
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
  },
  weeklyCard: {
    marginBottom: spacing.lg,
  },
  weeklyTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  weeklyDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCompleted: {
    backgroundColor: colors.primary,
  },
  dayToday: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dayLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  dayLabelToday: {
    color: colors.primary,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
