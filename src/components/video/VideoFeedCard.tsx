import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { Avatar } from '../ui/Avatar';

interface VideoFeedCardProps {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  duration: string;
  category: string;
  onLike?: () => void;
  onTryWorkout?: () => void;
}

const categoryEmojis: Record<string, string> = {
  Chest: '💪',
  Back: '🏋️',
  Legs: '🦵',
  Arms: '💪',
  Shoulders: '🏋️',
  Core: '🔥',
  'Full Body': '⚡',
  Cardio: '❤️',
};

export function VideoFeedCard({
  id,
  title,
  creatorName,
  likes,
  comments,
  duration,
  category,
  onLike,
  onTryWorkout,
}: VideoFeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.();
  };

  const emoji = categoryEmojis[category] || '🏋️';

  return (
    <View style={styles.card}>
      <View style={styles.thumbnailArea}>
        <Text style={styles.thumbnailEmoji}>{emoji}</Text>
        <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
          <Ionicons name="play" size={32} color={colors.background} />
        </TouchableOpacity>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.creatorRow}>
          <Avatar name={creatorName} size={28} />
          <Text style={styles.creatorName}>{creatorName}</Text>
        </View>

        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? colors.error : colors.textSecondary}
            />
            <Text style={[styles.actionText, liked && styles.actionTextActive]}>
              {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => setBookmarked(!bookmarked)}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={bookmarked ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.tryButton} onPress={onTryWorkout} activeOpacity={0.8}>
          <Ionicons name="play-circle-outline" size={18} color={colors.background} />
          <Text style={styles.tryButtonText}>Try This Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  thumbnailArea: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: {
    fontSize: 64,
  },
  playButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  durationText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  categoryText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  infoSection: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  creatorName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actionTextActive: {
    color: colors.error,
  },
  tryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  tryButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});
