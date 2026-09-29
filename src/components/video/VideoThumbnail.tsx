import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface VideoThumbnailProps {
  exerciseName: string;
  category?: string;
  duration?: string;
  onPress?: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  chest: '🫁',
  back: '🔙',
  shoulders: '🎯',
  arms: '💪',
  legs: '🦵',
  core: '🔥',
};

export function VideoThumbnail({
  exerciseName,
  category,
  duration,
  onPress,
}: VideoThumbnailProps) {
  const emoji = CATEGORY_EMOJI[category?.toLowerCase() ?? ''] ?? '🏋️';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnail}>
        <Text style={styles.emoji}>{emoji}</Text>

        {/* Play button overlay */}
        <View style={styles.playOverlay}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={24} color={colors.background} />
          </View>
        </View>

        {/* Duration badge */}
        {duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
      </View>

      <Text style={styles.exerciseName} numberOfLines={1}>
        {exerciseName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.overlay,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  durationText: {
    ...typography.small,
    color: colors.white,
    fontWeight: '600',
  },
  exerciseName: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
});
