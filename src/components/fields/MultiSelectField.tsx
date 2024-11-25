import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Choice } from '../../types/profile';

interface MultiSelectFieldProps {
  choices: Choice[];
  selectedValues: string[];
  onSelect: (values: string[]) => void;
  maxSelections?: number;
}

export const MultiSelectField = ({
  choices,
  selectedValues,
  onSelect,
  maxSelections,
}: MultiSelectFieldProps) => {
  const theme = useTheme();

  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter((v) => v !== value));
    } else if (!maxSelections || selectedValues.length < maxSelections) {
      onSelect([...selectedValues, value]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Selected Chips */}
      {selectedValues.length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {selectedValues.map((value) => {
              const choice = choices.find((c) => c.value === value);
              if (!choice) return null;

              return (
                <Chip
                  key={value}
                  onClose={() => toggleSelection(value)}
                  style={styles.chip}
                >
                  {choice.label}
                </Chip>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Choices List */}
      <ScrollView style={styles.choicesList}>
        {choices.map((choice) => {
          const isSelected = selectedValues.includes(choice.value);
          const isDisabled =
            !isSelected &&
            maxSelections !== undefined &&
            selectedValues.length >= maxSelections;

          return (
            <TouchableOpacity
              key={choice.value}
              style={[styles.option, isDisabled && styles.optionDisabled]}
              onPress={() => toggleSelection(choice.value)}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && { color: theme.colors.primary },
                  isDisabled && styles.optionTextDisabled,
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

      {/* Max Selections Notice */}
      {maxSelections && (
        <Text style={styles.notice}>Select up to {maxSelections} options</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 8,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  choicesList: {
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
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
  },
  optionTextDisabled: {
    color: 'rgba(0, 0, 0, 0.4)',
  },
  notice: {
    textAlign: 'center',
    padding: 8,
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 14,
  },
});
