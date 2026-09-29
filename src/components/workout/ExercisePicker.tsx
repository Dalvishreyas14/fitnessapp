import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { Exercise, exercises } from '../../constants/exercises';
import { Exercise as ExerciseType } from '../../types';

interface ExercisePickerProps {
  visible: boolean;
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  currentExerciseId?: string;
}

const difficultyColors: Record<string, string> = {
  beginner: colors.success,
  intermediate: colors.warning,
  advanced: colors.error,
};

const equipmentIcons: Record<string, string> = {
  barbell: 'barbell-outline',
  dumbbells: 'barbell-outline',
  dumbbell: 'barbell-outline',
  'cable-machine': 'cable-outline',
  machine: 'settings-outline',
  bench: 'body-outline',
  'flat-bench': 'body-outline',
  'incline-bench': 'body-outline',
  'squat-rack': 'fitness-outline',
  'pull-up-bar': 'fitness-outline',
  'landmine': 'radio-button-off-outline',
};

export function ExercisePicker({
  visible,
  exercises: exerciseList,
  onSelect,
  onClose,
  currentExerciseId,
}: ExercisePickerProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return exerciseList;
    const q = search.toLowerCase();
    return exerciseList.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.targetMuscles.some((m) => m.toLowerCase().includes(q)) ||
        ex.equipment.some((e) => e.toLowerCase().includes(q))
    );
  }, [search, exerciseList]);

  const renderItem = ({ item }: { item: Exercise }) => {
    const isCurrent = item.id === currentExerciseId;

    return (
      <View style={[styles.card, isCurrent && styles.cardCurrent]}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text
              style={[styles.cardName, isCurrent && styles.cardNameCurrent]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={styles.cardMuscles} numberOfLines={1}>
              {item.targetMuscles.join(' · ')}
            </Text>
            <View style={styles.cardMeta}>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: difficultyColors[item.difficulty] + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: difficultyColors[item.difficulty] },
                  ]}
                >
                  {item.difficulty}
                </Text>
              </View>
              <View style={styles.equipmentIcons}>
                {item.equipment.slice(0, 3).map((eq) => (
                  <Ionicons
                    key={eq}
                    name={(equipmentIcons[eq] || 'ellipse-outline') as any}
                    size={14}
                    color={colors.textMuted}
                    style={styles.equipmentIcon}
                  />
                ))}
              </View>
            </View>
          </View>
          {isCurrent ? (
            <Text style={styles.currentLabel}>Current</Text>
          ) : (
            <TouchableOpacity
              style={styles.useButton}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.useButtonText}>Use This</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Replace Exercise</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>No exercises found</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  title: {
    ...typography.h3,
    color: colors.white,
  },
  closeButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.white,
    paddingVertical: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  cardCurrent: {
    opacity: 0.5,
    borderColor: colors.textMuted,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    ...typography.bodyBold,
    color: colors.white,
    marginBottom: 2,
  },
  cardNameCurrent: {
    color: colors.textMuted,
  },
  cardMuscles: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'capitalize',
    marginBottom: spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  difficultyText: {
    ...typography.small,
    textTransform: 'capitalize',
  },
  equipmentIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentIcon: {
    marginRight: spacing.xs,
  },
  useButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  useButtonText: {
    ...typography.captionBold,
    color: colors.background,
  },
  currentLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.massive,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
