import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

interface HeightFieldProps {
  feet: number;
  inches: number;
  onChangeFeet: (feet: number) => void;
  onChangeInches: (inches: number) => void;
}

export const HeightField = ({
  feet,
  inches,
  onChangeFeet,
  onChangeInches,
}: HeightFieldProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Feet</Text>
          <Picker
            selectedValue={feet}
            onValueChange={(value) => onChangeFeet(Number(value))}
            style={[
              styles.picker,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            {Array.from({ length: 5 }, (_, i) => i + 3).map((num) => (
              <Picker.Item key={num} label={`${num} ft`} value={num} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Inches</Text>
          <Picker
            selectedValue={inches}
            onValueChange={(value) => onChangeInches(Number(value))}
            style={[
              styles.picker,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            {Array.from({ length: 12 }, (_, i) => i).map((num) => (
              <Picker.Item key={num} label={`${num} in`} value={num} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.totalHeight}>
        {feet}' {inches}"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  picker: {
    width: '100%',
    height: 150,
  },
  totalHeight: {
    fontSize: 24,
    fontWeight: '600',
  },
});
