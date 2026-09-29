import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

function TabBarIcon({ name, color, focused }: { name: string; color: ColorValue; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Ionicons name={name as any} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'barbell' : 'barbell-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-coach"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'people' : 'people-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.surfaceBorder,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl : spacing.sm,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconFocused: {
    // Subtle glow effect
  },
});
