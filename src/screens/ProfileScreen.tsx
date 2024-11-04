import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useLogout } from '../hooks/mutations';
import { PictureGridComponent } from '../components/PictureGridComponent';

// Main profile screen component for user profile management
export const ProfileScreen = () => {
  const theme = useTheme();
  const logout = useLogout();

  const handleLogout = async () => {
    logout.mutate();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant='headlineMedium' style={styles.title}>
          Profile
        </Text>
      </View>

      <View style={styles.content}>
        <PictureGridComponent />

        <Button
          onPress={handleLogout}
          mode='contained-tonal'
          style={styles.logoutButton}
          icon='logout'
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  logoutButton: {
    marginTop: 24,
  },
});
