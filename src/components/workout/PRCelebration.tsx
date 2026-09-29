import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';

interface PRCelebrationProps {
  visible: boolean;
  exerciseName: string;
  prType: 'weight' | 'reps' | 'volume' | 'e1rm';
  previousBest: { weight: number; reps: number; value: number };
  newBest: { weight: number; reps: number; value: number };
  onDismiss: () => void;
}

const PR_LABELS: Record<string, string> = {
  weight: 'Heaviest Weight!',
  reps: 'Most Reps!',
  volume: 'Highest Volume!',
  e1rm: 'Best e1RM!',
};

const { width } = Dimensions.get('window');

export default function PRCelebration({
  visible,
  exerciseName,
  prType,
  previousBest,
  newBest,
  onDismiss,
}: PRCelebrationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            damping: 8,
            stiffness: 100,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onDismiss}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.prTitle}>NEW PR!</Text>
        <Text style={styles.exerciseName}>{exerciseName}</Text>
        <Text style={styles.prType}>{PR_LABELS[prType]}</Text>

        <View style={styles.comparisonContainer}>
          <View style={styles.bestBox}>
            <Text style={styles.bestLabel}>Previous Best</Text>
            <Text style={styles.bestValue}>
              {previousBest.weight}kg × {previousBest.reps}
            </Text>
            <Text style={styles.bestNumber}>
              {previousBest.value.toFixed(1)}
            </Text>
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>→</Text>
          </View>

          <View style={[styles.bestBox, styles.newBestBox]}>
            <Text style={styles.bestLabel}>New Best</Text>
            <Text style={[styles.bestValue, styles.newBestValue]}>
              {newBest.weight}kg × {newBest.reps}
            </Text>
            <Text style={[styles.bestNumber, styles.newBestNumber]}>
              {newBest.value.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.dismissText}>Tap to dismiss</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: width * 0.85,
    maxWidth: 360,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  trophy: {
    fontSize: 64,
    marginBottom: 8,
  },
  prTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD700',
    marginBottom: 8,
    letterSpacing: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  prType: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 24,
    fontWeight: '700',
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  bestBox: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  newBestBox: {
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  bestLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bestValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  newBestValue: {
    color: '#FFD700',
  },
  bestNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  newBestNumber: {
    color: '#FFD700',
  },
  vsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 24,
    color: colors.textMuted,
  },
  dismissText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
