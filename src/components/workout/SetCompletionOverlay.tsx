import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface SetCompletionOverlayProps {
  visible: boolean;
  setNumber: number;
  volume: number;
  isPR?: boolean;
  onDismiss: () => void;
}

export default function SetCompletionOverlay({
  visible,
  setNumber,
  volume,
  isPR = false,
  onDismiss,
}: SetCompletionOverlayProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss();
        });
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      opacityAnim.setValue(0);
      slideAnim.setValue(-20);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.badge}>
        <View style={styles.setCompleteContainer}>
          <Text style={styles.setCompleteText}>SET COMPLETE ✓</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.volumeBadge}>
            <Text style={styles.volumeText}>+{volume} kg</Text>
          </View>

          {isPR && (
            <View style={styles.prBadge}>
              <Text style={styles.prText}>🏆 PR!</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    zIndex: 999,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  badge: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  setCompleteContainer: {
    marginBottom: 6,
  },
  setCompleteText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  volumeBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  volumeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  prBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  prText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
  },
});
