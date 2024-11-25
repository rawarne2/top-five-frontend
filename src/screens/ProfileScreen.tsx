import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import {
  Button,
  Text,
  Surface,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useLogout } from '../hooks/mutations';
import { PictureGridComponent } from '../components/PictureGridComponent';
import { BasicInfoSection } from '../components/profile/BasicInfoSection';
import { LifestyleSection } from '../components/profile/LifeStyleSection';
import { FiltersSection } from '../components/profile/FiltersSection';
import { PersonalityValuesSection } from '../components/profile/PersonalityValuesSection';
import { useFetchProfileQuery } from '../hooks/queries';

export const ProfileScreen = () => {
  const theme = useTheme();
  const logout = useLogout();
  const { data: profile, isLoading, isError } = useFetchProfileQuery();

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading profile...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error loading profile</Text>
        <Button mode='contained' onPress={() => window.location.reload()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text variant='headlineMedium' style={styles.title}>
        {`Hello, ${profile?.user_details?.first_name} ${profile?.user_details?.last_name}`}
      </Text>

      <View style={styles.content}>
        <Surface
          style={{
            ...styles.surface,
            backgroundColor: theme.colors.onSurfaceVariant,
          }}
          elevation={5}
        >
          <Text variant='titleLarge' style={styles.sectionTitle}>
            Pictures
          </Text>
          <PictureGridComponent />
        </Surface>

        <BasicInfoSection profile={profile} />
        <LifestyleSection profile={profile} />
        <FiltersSection profile={profile} />
        <PersonalityValuesSection profile={profile} />

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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    fontWeight: '600',
    paddingTop: 32,
    paddingBottom: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  surface: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: 'white',
  },
  logoutButton: {
    marginTop: 24,
  },
});

/*
Basic Info

Bio
Height
Location
Zodiac Sign
Sexual Orientation
Pronouns
Body Type
Company
Highest Education
Job Title

Lifestyle

Alcohol Frequency
Cannabis Friendly
Covid Vaccine Status
Exercise Level
Pet Preferences
Sleep Pattern
Social Media Usage
Dietary Preferences

Personality & Values

Family Plans
Interests
Life Goals
Love Languages
Personality Type
Political Views
Religion
Relationship Goals
Special Talents
Communication Style

Filters

Min Preferred Age
Max Preferred Age
Preferred Gender
*/
