import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
  height?: number; // percentage of screen height
  hasChanges?: boolean;
}

export const ProfileEditModal = ({
  visible,
  onClose,
  onSave,
  title,
  children,
  height = 70, // default to 70% of screen height
  hasChanges = false,
}: ProfileEditModalProps) => {
  const theme = useTheme();

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.background,
              height: SCREEN_HEIGHT * (height / 100),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
              <MaterialCommunityIcons
                name='close'
                size={24}
                color={theme.colors.onBackground}
              />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity
              onPress={handleSave}
              style={styles.headerButton}
              disabled={!hasChanges}
            >
              <Text
                style={{
                  color: hasChanges
                    ? theme.colors.primary
                    : theme.colors.outline,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
