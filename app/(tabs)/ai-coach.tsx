import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Card, Avatar } from '../../src/components/ui';

const suggestions = [
  'What should I train today?',
  'How can I improve my bench press?',
  'Give me a 30-minute workout',
  'I only have dumbbells',
  'Why did you change my workout?',
  'How is my progress?',
];

interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

const messages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    text: "Hey Alex! 👋 I'm your AI coach. I can help you with workout planning, exercise form, nutrition advice, and training guidance. What would you like to know?",
  },
];

export default function AICoachScreen() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>(messages);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setChat((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', text: text.trim() },
      {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Based on your training history and goals, I'd recommend focusing on progressive overload. Your last bench press session showed good form consistency. Let's build on that!",
      },
    ]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Coach</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
        {chat.map((msg) => (
          <View
            key={msg.id}
            style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.aiMessage]}
          >
            {msg.role === 'ai' && (
              <View style={styles.msgAvatar}>
                <Text style={{ fontSize: 16 }}>🤖</Text>
              </View>
            )}
            <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Suggestions */}
        {chat.length === 1 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>Quick questions</Text>
            {suggestions.map((s, i) => (
              <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI coach..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={18} color={input.trim() ? colors.background : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    fontSize: 22,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.white,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusText: {
    ...typography.small,
    color: colors.success,
  },
  messages: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  message: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: spacing.xs,
  },
  bubbleText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  userBubbleText: {
    color: colors.background,
  },
  suggestions: {
    marginTop: spacing.xxl,
  },
  suggestionsTitle: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  suggestionText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  inputBar: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.white,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceLight,
  },
});
