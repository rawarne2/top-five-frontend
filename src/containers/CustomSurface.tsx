import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export interface CustomSurfaceProps {
  title: string;
  children: React.ReactNode;
}

export const CustomSurface: React.FC<CustomSurfaceProps> = ({
  title,
  children,
}) => {
  const theme = useTheme();

  return (
    <Surface
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.onSurfaceVariant,
        },
      ]}
      elevation={5}
    >
      <Text variant='titleLarge' style={styles.title}>
        {title}
      </Text>
      <View style={styles.content}>{children}</View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    gap: 8,
  },
});
