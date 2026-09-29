import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Badge, Avatar } from '../../src/components/ui';

const { width } = Dimensions.get('window');

const feedPosts = [
  {
    id: '1',
    user: 'Alex Kumar',
    timeAgo: '2h ago',
    title: '🔥 CHEST DAY',
    exercises: 'Bench Press 80kg × 6, Incline DB Press 30kg × 10, Cable Fly...',
    likes: '2.4K',
    comments: '182',
    isWorkout: true,
  },
  {
    id: '2',
    user: 'Priya Sharma',
    timeAgo: '4h ago',
    title: '🏆 NEW PR!',
    exercises: 'Deadlift: 120kg × 5! Finally hit this!',
    likes: '892',
    comments: '64',
    isWorkout: false,
  },
  {
    id: '3',
    user: 'Coach Ravi',
    timeAgo: '6h ago',
    title: '📋 30-Min Home Workout',
    exercises: 'Push-ups, Squats, Lunges, Planks, Burpees...',
    likes: '1.1K',
    comments: '89',
    isWorkout: true,
  },
];

const challenges = [
  { id: '1', name: '30-Day Push-Up Challenge', participants: '12.4K', daysLeft: 18 },
  { id: '2', name: '8-Week Strength Challenge', participants: '8.2K', daysLeft: 42 },
  { id: '3', name: '30-Day Gym Streak', participants: '24.1K', daysLeft: 25 },
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges'>('feed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.tabActive]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>
            Challenges
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' ? (
          <>
            {feedPosts.map((post) => (
              <Card key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Avatar name={post.user} size={40} />
                  <View style={styles.postUserInfo}>
                    <Text style={styles.postUserName}>{post.user}</Text>
                    <Text style={styles.postTime}>{post.timeAgo}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postExercises}>{post.exercises}</Text>

                {post.isWorkout && (
                  <TouchableOpacity style={styles.tryButton}>
                    <Ionicons name="play-circle-outline" size={18} color={colors.primary} />
                    <Text style={styles.tryButtonText}>TRY THIS WORKOUT</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
                    <Text style={styles.postActionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
                    <Text style={styles.postActionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction}>
                    <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </>
        ) : (
          <>
            {challenges.map((ch) => (
              <Card key={ch.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <Ionicons name="trophy-outline" size={24} color={colors.warning} />
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeName}>{ch.name}</Text>
                    <Text style={styles.challengeMeta}>
                      {ch.participants} participants · {ch.daysLeft} days left
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join Challenge</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    marginBottom: spacing.sm,
  },
  tab: {
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  postCard: {
    marginBottom: spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  postTime: {
    ...typography.small,
    color: colors.textMuted,
  },
  postTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  postExercises: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  tryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tryButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  postActions: {
    flexDirection: 'row',
    gap: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingTop: spacing.md,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  postActionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  challengeCard: {
    marginBottom: spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    ...typography.h4,
    color: colors.white,
    marginBottom: 2,
  },
  challengeMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  joinButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});
