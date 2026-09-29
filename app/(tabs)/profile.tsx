import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Avatar, Badge } from '../../src/components/ui';
import { useUserStore } from '../../src/store/userStore';
import { useWorkoutStore } from '../../src/store/workoutStore';

const menuItems = [
  { icon: 'barbell-outline', label: 'Workout History', color: colors.primary },
  { icon: 'trophy-outline', label: 'Personal Records', color: colors.warning },
  { icon: 'stats-chart-outline', label: 'Progress Analytics', color: colors.blue },
  { icon: 'restaurant-outline', label: 'Nutrition', color: colors.success },
  { icon: 'body-outline', label: 'Body Measurements', color: colors.purple },
  { icon: 'storefront-outline', label: 'Gym Store', color: colors.orange },
];

const settingsItems = [
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Safety' },
  { icon: 'card-outline', label: 'Subscription' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'settings-outline', label: 'Settings' },
];

export default function ProfileScreen() {
  const profile = useUserStore((s) => s.profile);
  const { totalWorkouts, history, personalRecords } = useWorkoutStore();

  const level = Math.floor(totalWorkouts / 6) + 1;
  const xp = (totalWorkouts % 6) * 1000 + 240;
  const xpMax = 6000;
  const xpPercent = (xp / xpMax) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar name={profile.name || 'Alex'} size={80} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name || 'Alex'}</Text>
            <Text style={styles.profileBio}>Building strength, one rep at a time 💪</Text>
            <View style={styles.levelRow}>
              <Badge label={`LEVEL ${level}`} variant="primary" />
              <Badge label="IRON BUILDER" variant="muted" />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* XP Progress */}
        <Card style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>Experience Points</Text>
            <Text style={styles.xpLevel}>Level {level}</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xpText}>{xp.toLocaleString()} / {xpMax.toLocaleString()} XP</Text>
        </Card>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.menuItem}
              onPress={() => {
                if (item.label === 'Workout History') router.push('/workout/history');
                else if (item.label === 'Personal Records') router.push('/workout/prs');
                else if (item.label === 'Progress Analytics') router.push('/workout/analytics');
              }}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.menuSection}>
          {settingsItems.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.menuItem}
              onPress={() => {
                if (item.label === 'Settings') router.push('/settings');
              }}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileHeader: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileBio: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  levelRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.white,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.surfaceBorder,
  },
  xpCard: {
    marginBottom: spacing.xxl,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  xpTitle: {
    ...typography.bodyBold,
    color: colors.white,
  },
  xpLevel: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  xpBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  xpText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    ...typography.body,
    color: colors.white,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.error,
  },
});
