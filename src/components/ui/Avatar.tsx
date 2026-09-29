import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface AvatarProps {
  name: string;
  size?: number;
  style?: ViewStyle;
}

const avatarColors = ['#CCFF00', '#448AFF', '#BB86FC', '#FF9100', '#00E676', '#FF5252'];

function getColor(name: string) {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ name, size = 44, style }: AvatarProps) {
  const color = getColor(name);
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.4,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.bodyBold,
    color: colors.background,
    fontWeight: '800',
  },
});
