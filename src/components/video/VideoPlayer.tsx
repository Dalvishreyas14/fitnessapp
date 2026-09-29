import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface VideoPlayerProps {
  videoUrl?: string;
  exerciseName: string;
  category?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  chest: '🫁',
  back: '🔙',
  shoulders: '🎯',
  arms: '💪',
  legs: '🦵',
  core: '🔥',
};

const PLAYBACK_SPEEDS = ['0.5x', '1x', '1.5x', '2x'] as const;

export function VideoPlayer({
  videoUrl,
  exerciseName,
  category,
  onLoad,
  onError,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);

  const emoji = CATEGORY_EMOJI[category?.toLowerCase() ?? ''] ?? '🏋️';

  const handlePlayPause = () => {
    if (videoUrl) {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleSpeedToggle = () => {
    setSpeedIndex((prev) => (prev + 1) % PLAYBACK_SPEEDS.length);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    // Simulate retry
    setTimeout(() => {
      setIsLoading(false);
      onLoad?.();
    }, 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.videoArea}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.videoArea}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>Failed to load video</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoArea}>
        {/* Placeholder content */}
        <View style={styles.placeholderContent}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.exerciseName}>{exerciseName}</Text>
          <Text style={styles.demoLabel}>Demo Video</Text>
          {!videoUrl && (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          )}
        </View>

        {/* Play/Pause button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={36}
            color={colors.background}
            style={isPlaying ? {} : { marginLeft: 4 }}
          />
        </TouchableOpacity>

        {/* Controls overlay */}
        <View style={styles.controlsOverlay}>
          <View style={styles.seekBarContainer}>
            <View style={styles.seekBarBg}>
              <View style={[styles.seekBarFill, { width: isPlaying ? '45%' : '0%' }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>0:00</Text>
              <Text style={styles.timeText}>3:24</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={handleSpeedToggle} style={styles.speedButton}>
              <Text style={styles.speedText}>{PLAYBACK_SPEEDS[speedIndex]}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fullscreenButton}>
              <Ionicons name="expand-outline" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  videoArea: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  exerciseName: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  demoLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: spacing.xs,
  },
  comingSoonBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  comingSoonText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    paddingTop: spacing.xxxl,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  seekBarContainer: {
    marginBottom: spacing.sm,
  },
  seekBarBg: {
    height: 4,
    backgroundColor: colors.surfaceBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  seekBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  timeText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speedButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.sm,
  },
  speedText: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  fullscreenButton: {
    padding: spacing.xs,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    marginTop: spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.md,
  },
  retryText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
