import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { VideoPlayer } from './VideoPlayer';

interface VideoBottomSheetProps {
  visible: boolean;
  exerciseName: string;
  videoUrl?: string;
  formCues?: string[];
  onClose: () => void;
}

export function VideoBottomSheet({
  visible,
  exerciseName,
  videoUrl,
  formCues = [],
  onClose,
}: VideoBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {exerciseName}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Video Player */}
            <VideoPlayer
              videoUrl={videoUrl}
              exerciseName={exerciseName}
            />

            {/* Form Cues */}
            {formCues.length > 0 && (
              <View style={styles.cuesSection}>
                <Text style={styles.cuesTitle}>Form Cues</Text>
                {formCues.map((cue, index) => (
                  <View key={index} style={styles.cueItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.primary}
                      style={styles.cueIcon}
                    />
                    <Text style={styles.cueText}>{cue}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Resume Workout Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.resumeText}>Resume Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    maxHeight: '90%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  exerciseName: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flexGrow: 0,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  cuesSection: {
    marginTop: spacing.xl,
  },
  cuesTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cueIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  cueText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  bottomBar: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  resumeButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  resumeText: {
    ...typography.button,
    color: colors.background,
  },
});
