import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InfoItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value?: string | null;
  onPress: () => void;
  showChevron?: boolean;
}

export const InfoItem = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
}: InfoItemProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.rightContent}>
        <Text
          style={[styles.value, !value && styles.placeholder]}
          numberOfLines={1}
        >
          {value || 'Add'}
        </Text>
        {showChevron && (
          <MaterialCommunityIcons
            name='chevron-right'
            size={24}
            color={theme.colors.outline}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: 'white',
    borderBlockColor: 'white',
    color: 'white',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  value: {
    fontSize: 16,
    color: 'white',
    textAlign: 'right',
    flex: 1,
  },
  placeholder: {
    color: 'white',
    fontStyle: 'italic',
  },
});
