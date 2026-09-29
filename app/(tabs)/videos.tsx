import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { VideoFeedCard } from '../../src/components/video/VideoFeedCard';

const categories = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

const mockVideos = [
  {
    id: '1',
    title: 'Massive Chest Workout — 5 Exercises for Growth',
    creatorName: 'Coach Ravi',
    likes: 2400,
    comments: 182,
    duration: '12:34',
    category: 'Chest',
  },
  {
    id: '2',
    title: 'Pull Day Masterclass — Back & Biceps',
    creatorName: 'Alex Kumar',
    likes: 1850,
    comments: 96,
    duration: '18:22',
    category: 'Back',
  },
  {
    id: '3',
    title: 'Leg Day Never Skip — Quad & Hamstring Blast',
    creatorName: 'Priya Sharma',
    likes: 3100,
    comments: 241,
    duration: '15:45',
    category: 'Legs',
  },
  {
    id: '4',
    title: 'Bigger Arms in 20 Minutes — Dumbbell Only',
    creatorName: 'Mike Torres',
    likes: 980,
    comments: 67,
    duration: '20:10',
    category: 'Arms',
  },
  {
    id: '5',
    title: 'Shoulder Sculpt — Arnold Press Variations',
    creatorName: 'Nina Patel',
    likes: 1200,
    comments: 88,
    duration: '14:18',
    category: 'Shoulders',
  },
  {
    id: '6',
    title: '6-Pack Abs Core Destroyer — No Equipment',
    creatorName: 'Coach Ravi',
    likes: 4200,
    comments: 312,
    duration: '10:55',
    category: 'Core',
  },
];

export default function VideosScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredVideos =
    selectedCategory === 'All'
      ? mockVideos
      : mockVideos.filter((v) => v.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Videos</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCategory === item && styles.chipActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.chipText, selectedCategory === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VideoFeedCard
            id={item.id}
            title={item.title}
            creatorName={item.creatorName}
            likes={item.likes}
            comments={item.comments}
            duration={item.duration}
            category={item.category}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No videos in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  chipContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
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
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.massive * 2,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
