import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SetType, SET_TYPES, SetTypeInfo } from '../../constants/setTypes';
import { colors } from '../../theme/colors';

interface SetTypeSelectorProps {
  visible: boolean;
  onSelect: (setType: SetType) => void;
  onClose: () => void;
  currentType?: SetType;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHIP_SIZE = (SCREEN_WIDTH - 80) / 3;

export default function SetTypeSelector({
  visible,
  onSelect,
  onClose,
  currentType,
}: SetTypeSelectorProps) {
  const handleSelect = (type: SetType) => {
    onSelect(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select Set Type</Text>

          <View style={styles.grid}>
            {SET_TYPES.map((type: SetTypeInfo) => {
              const isSelected = currentType === type.id;

              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.chip,
                    {
                      borderColor: type.color,
                      backgroundColor: isSelected ? type.bgColor : 'transparent',
                    },
                  ]}
                  onPress={() => handleSelect(type.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.icon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: isSelected ? type.color : colors.textSecondary },
                    ]}
                  >
                    {type.shortLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  chip: {
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 22,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
