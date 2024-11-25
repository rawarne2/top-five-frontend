import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Slider } from '@miblanchard/react-native-slider';

interface AgeRangeSelectorProps {
  minAge: number;
  maxAge: number;
  onValuesChange: (values: [number, number]) => void;
}

export const AgeRangeSelector: React.FC<AgeRangeSelectorProps> = ({
  minAge,
  maxAge,
  onValuesChange,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Age Range: {minAge} - {maxAge} years
      </Text>
      <Slider
        value={[minAge, maxAge]}
        onValueChange={(values) => onValuesChange(values as [number, number])}
        minimumValue={18}
        maximumValue={99}
        step={1}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.surfaceVariant}
        thumbTintColor={theme.colors.primary}
        trackStyle={styles.track}
        containerStyle={styles.slider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  slider: {
    height: 40,
  },
  track: {
    height: 4,
  },
});
