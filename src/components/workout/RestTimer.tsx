import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

let Haptics: any = null;
try { Haptics = require('expo-haptics'); } catch {}

let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}

interface RestTimerProps {
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
  nextSetPreview?: string;
  onPause?: () => void;
  onResume?: () => void;
}

const CIRCLE_SIZE = 200;
const BORDER_WIDTH = 8;
const INNER_CIRCLE = CIRCLE_SIZE - BORDER_WIDTH * 2;

function getColor(remaining: number): string {
  if (remaining > 30) return colors.success;
  if (remaining > 10) return colors.warning;
  return colors.error;
}

export function RestTimer({
  duration,
  onComplete,
  onSkip,
  nextSetPreview,
  onPause,
  onResume,
}: RestTimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const completedRef = useRef(false);

  const handlePause = useCallback(() => {
    setPaused((p) => {
      const next = !p;
      if (next) {
        onPause?.();
      } else {
        onResume?.();
      }
      return next;
    });
  }, [onPause, onResume]);

  useEffect(() => {
    completedRef.current = false;
    setRemaining(duration);
    setPaused(false);
  }, [duration]);

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paused, remaining]);

  useEffect(() => {
    if (remaining > 0 || completedRef.current) return;
    completedRef.current = true;

    const triggerHaptics = async () => {
      if (Haptics?.impactAsync) {
        try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
      }
    };

    const speakComplete = () => {
      if (Speech?.speak) {
        try { Speech.speak('Rest complete'); } catch {}
      }
    };

    triggerHaptics();
    speakComplete();
    onComplete();
  }, [remaining, onComplete]);

  const adjustTime = useCallback(
    (delta: number) => {
      setRemaining((prev) => Math.max(0, prev + delta));
      completedRef.current = false;
    },
    [],
  );

  const progress = duration > 0 ? remaining / duration : 0;
  const rotation = 360 * (1 - progress);
  const color = getColor(remaining);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: color }]}>
        <View
          style={[
            styles.overlay,
            {
              borderTopColor: color,
              transform: [{ rotate: `${rotation}deg` }],
            },
          ]}
        />
        <View style={styles.innerCircle}>
          <Text style={[styles.timeText, { color: colors.white }]}>{timeStr}</Text>
          <Text style={styles.label}>REST</Text>
        </View>
      </View>

      {nextSetPreview ? (
        <Text style={styles.preview}>Next: {nextSetPreview}</Text>
      ) : null}

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => adjustTime(-15)}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={18} color={colors.white} />
          <Text style={styles.controlText}>15s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={handlePause}
          activeOpacity={0.7}
        >
          <Ionicons
            name={paused ? 'play' : 'pause'}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => adjustTime(15)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color={colors.white} />
          <Text style={styles.controlText}>15s</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.7}>
        <Ionicons name="play-skip-forward" size={20} color={colors.textSecondary} />
        <Text style={styles.skipText}>Skip Rest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: -BORDER_WIDTH,
    left: -BORDER_WIDTH,
    width: CIRCLE_SIZE + BORDER_WIDTH,
    height: (CIRCLE_SIZE + BORDER_WIDTH) / 2,
    borderTopWidth: BORDER_WIDTH + 2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: colors.success,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  innerCircle: {
    width: INNER_CIRCLE,
    height: INNER_CIRCLE,
    borderRadius: INNER_CIRCLE / 2,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 44,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 13,
    letterSpacing: 3,
  },
  preview: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  controlBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    ...typography.label,
    color: colors.white,
    marginTop: 2,
    fontSize: 11,
  },
  pauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  skipText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
});
