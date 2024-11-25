import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { useProfileChoices } from '../hooks/queries';

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  types: string[];
}

export const InterestsSelector = ({
  selectedInterests,
  onInterestsChange,
  types,
}: InterestsSelectorProps) => {
  const theme = useTheme();
  const { data: choices, isLoading } = useProfileChoices();
  const filteredChoices = types?.map((type) => choices && choices[type]);

  if (isLoading || !choices) {
    return null;
  }

  const toggleInterest = (value: string) => {
    if (selectedInterests.includes(value)) {
      onInterestsChange(selectedInterests.filter((i) => i !== value));
    } else {
      onInterestsChange([...selectedInterests, value]);
    }
  };

  return (
    <View style={styles.container}>
      {choices?.interests?.map((interest) => (
        <Chip
          key={interest.value}
          selected={selectedInterests.includes(interest.value)}
          onPress={() => toggleInterest(interest.value)}
          style={[styles.chip, { borderColor: theme.colors.tertiary }]}
          mode='outlined'
        >
          {interest.label}
        </Chip>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  chip: {
    marginBottom: 8,
  },
});
