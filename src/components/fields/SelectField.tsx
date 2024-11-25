import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Choice {
  value: string;
  label: string;
}

interface SelectFieldProps<T> {
  choices: Choice[];
  selectedValue?: T | null;
  onSelect: (value: T) => void;
}

export function SelectField<T>({
  choices,
  selectedValue,
  onSelect,
}: SelectFieldProps<T>) {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      {choices.map((choice) => {
        const isSelected = choice.value === selectedValue;

        return (
          <TouchableOpacity
            key={choice.value}
            style={styles.option}
            onPress={() => onSelect(choice.value as T)}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && { color: theme.colors.primary },
              ]}
            >
              {choice.label}
            </Text>

            {isSelected && (
              <MaterialCommunityIcons
                name='check'
                size={24}
                color={theme.colors.primary}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionText: {
    fontSize: 16,
  },
});
