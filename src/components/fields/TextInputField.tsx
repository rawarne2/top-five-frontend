import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';

interface TextInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  helperText?: string;
  error?: string;
}

export const TextInputField = ({
  value,
  onChangeText,
  onBlur,
  label,
  placeholder,
  multiline = false,
  maxLength,
  autoCapitalize = 'sentences',
  helperText,
  error,
}: TextInputFieldProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        mode='outlined'
        style={[styles.input, multiline && styles.multilineInput]}
        outlineColor={theme.colors.tertiary}
        activeOutlineColor={theme.colors.secondary}
        error={!!error}
      />

      <View style={styles.bottomRow}>
        {(error || helperText) && (
          <Text
            style={[styles.helperText, error && { color: theme.colors.error }]}
          >
            {error || helperText}
          </Text>
        )}

        {maxLength && focused && (
          <Text style={styles.counter}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
  },
  multilineInput: {
    maxHeight: 120,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    minHeight: 20,
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  counter: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});
