import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

export default function BodyScanScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera-outline" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>Analyze My Body</Text>
        <Text style={styles.subtitle}>
          Upload photos or use your camera for an AI-powered fitness assessment.
        </Text>

        <View style={styles.features}>
          <FeatureItem
            icon="📊"
            title="Visible Muscle Development"
            description="See how your muscles compare"
          />
          <FeatureItem
            icon="⚖️"
            title="General Symmetry"
            description="Identify areas that need more focus"
          />
          <FeatureItem
            icon="🎯"
            title="Training Recommendations"
            description="Get personalized training suggestions"
          />
        </View>

        <View style={styles.privacy}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
          <Text style={styles.privacyText}>
            Your photos are encrypted, stored securely, and can be deleted at any time. We never
            diagnose medical conditions.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Take Photo"
          onPress={() => {
            // TODO: Camera
            router.push('/(onboarding)/personalization');
          }}
          size="lg"
        />
        <Button
          title="Upload Photo"
          onPress={() => {
            // TODO: Image picker
            router.push('/(onboarding)/personalization');
          }}
          variant="secondary"
        />
        <Button
          title="Skip for now"
          onPress={() => router.push('/(onboarding)/personalization')}
          variant="ghost"
        />
      </View>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radii.xxl,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  features: {
    gap: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  featureItem: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: colors.white,
    marginBottom: 2,
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  privacy: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  privacyText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.sm,
  },
});
