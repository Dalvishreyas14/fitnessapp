import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = colors.primary,
  height = 8,
  style,
  animated = true,
}: ProgressBarProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 1);
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clamped,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(clamped);
    }
  }, [progress]);

  const scaleX = animatedValue;

  return (
    <View style={[styles.track, { height }, style]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            height,
            borderRadius: height / 2,
            transform: [{ scaleX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
  },
});
