import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CreatorUploadFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: { title: string; description: string; exercises: string[] }) => void;
}

const exerciseOptions = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull-ups',
  'Lunges',
  'Bicep Curls',
  'Tricep Pushdown',
  'Leg Press',
  'Cable Fly',
  'Lateral Raise',
];

const tagOptions = ['Strength', 'Hypertrophy', 'Fat Loss', 'Beginner', 'Advanced', 'Home', 'Gym'];

export function CreatorUploadForm({ visible, onClose, onSubmit }: CreatorUploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleExercise = (exercise: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise) ? prev.filter((e) => e !== exercise) : [...prev, exercise]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      title,
      description,
      exercises: selectedExercises,
    });
    setTitle('');
    setDescription('');
    setSelectedExercises([]);
    setSelectedTags([]);
    onClose();
  };

  const isFormValid = title.trim().length > 0 && selectedExercises.length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Video Post</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Title"
              placeholder="e.g., 30-Min Full Body Blast"
              value={title}
              onChangeText={setTitle}
            />

            <Input
              label="Description"
              placeholder="Describe your workout..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Exercises</Text>
              <Text style={styles.fieldHint}>Select the exercises in this workout</Text>
              <View style={styles.chipGrid}>
                {exerciseOptions.map((exercise) => {
                  const isSelected = selectedExercises.includes(exercise);
                  return (
                    <TouchableOpacity
                      key={exercise}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => toggleExercise(exercise)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {exercise}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Tags</Text>
              <View style={styles.chipGrid}>
                {tagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        #{tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
              <Ionicons name="cloud-upload-outline" size={36} color={colors.textMuted} />
              <Text style={styles.uploadText}>Upload Video</Text>
              <Text style={styles.uploadSubtext}>MP4, MOV up to 500MB</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Cancel" onPress={onClose} variant="ghost" size="md" />
            <Button
              title="Post Workout"
              onPress={handleSubmit}
              disabled={!isFormValid}
              size="md"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceBorder,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  fieldSection: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  fieldHint: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  chipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 1.5,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    borderStyle: 'dashed',
    gap: spacing.sm,
  },
  uploadText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  uploadSubtext: {
    ...typography.small,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
});
