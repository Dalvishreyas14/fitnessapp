import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(204, 255, 0, 0.15)', 'rgba(204, 255, 0, 0)', 'transparent']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.appIcon}>🏋️</Text>
        </View>

        <Text style={styles.title}>
          Your body.{'\n'}Your goals.{'\n'}Your AI coach.
        </Text>

        <Text style={styles.subtitle}>
          Train smarter. Build stronger.{'\n'}Let AI adapt every workout to you.
        </Text>

        <View style={styles.features}>
          <FeatureItem icon="🤖" text="AI-Personalized Workouts" />
          <FeatureItem icon="📊" text="Track Every Set & Rep" />
          <FeatureItem icon="🎥" text="Form Analysis" />
          <FeatureItem icon="👥" text="Fitness Community" />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(onboarding)/goals')}
          size="lg"
        />
        <Button
          title="I already have an account"
          onPress={() => {
            // TODO: Auth flow
            router.replace('/(tabs)');
          }}
          variant="ghost"
          size="md"
        />
      </View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: width * 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: 80,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.xxl,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  appIcon: {
    fontSize: 40,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    lineHeight: 28,
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.xxl,
    paddingBottom: 48,
    gap: spacing.sm,
  },
});
