import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InfoItem } from '../fields/InfoItem';
import { ProfileEditModal } from '../modals/ProfileEditModal';
import { SelectField } from '../fields/SelectField';
import { useProfileChoices } from '../../hooks/queries';
import { useUpdateProfile } from '../../hooks/mutations';
import { AgeRangeSelector } from '../fields/AgeRangeField';
import { CustomSurface } from '../../containers/CustomSurface';
import { Profile, Gender } from '../../types/profile';

type EditingField = 'age_range' | 'preferred_gender' | null;

interface FiltersSectionProps {
  profile: Profile;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({ profile }) => {
  const theme = useTheme();
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [ageRange, setAgeRange] = useState<[number, number]>([
    profile.min_preferred_age,
    profile.max_preferred_age,
  ]);
  const [selectedGender, setSelectedGender] = useState<Gender>(
    profile.preferred_gender
  );

  const { data: choices, isLoading: isLoadingChoices } = useProfileChoices();
  const updateProfile = useUpdateProfile();

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value as Gender);
  };

  const handleClose = () => {
    setAgeRange([profile.min_preferred_age, profile.max_preferred_age]);
    setSelectedGender(profile.preferred_gender);
    setEditingField(null);
  };

  const handleSave = async () => {
    if (!editingField) return;

    try {
      if (editingField === 'age_range') {
        await updateProfile.mutateAsync({
          min_preferred_age: ageRange[0],
          max_preferred_age: ageRange[1],
        });
      } else {
        await updateProfile.mutateAsync({
          preferred_gender: selectedGender,
        });
      }
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const hasChanges = () => {
    if (editingField === 'age_range') {
      return (
        ageRange[0] !== profile.min_preferred_age ||
        ageRange[1] !== profile.max_preferred_age
      );
    }
    if (editingField === 'preferred_gender') {
      return selectedGender !== profile.preferred_gender;
    }
    return false;
  };

  const renderEditContent = () => {
    if (editingField === 'age_range') {
      return (
        <AgeRangeSelector
          minAge={ageRange[0]}
          maxAge={ageRange[1]}
          onValuesChange={setAgeRange}
        />
      );
    }

    if (editingField === 'preferred_gender' && choices) {
      return (
        <SelectField
          choices={choices.gender}
          selectedValue={selectedGender}
          onSelect={handleGenderSelect}
        />
      );
    }

    return null;
  };

  return (
    <CustomSurface title='Filters'>
      <InfoItem
        icon='calendar-range'
        label='Age Range'
        value={`${profile.min_preferred_age} - ${profile.max_preferred_age} years`}
        onPress={() => setEditingField('age_range')}
      />

      <InfoItem
        icon='account-multiple'
        label='Preferred Gender'
        value={profile.preferred_gender_display}
        onPress={() => setEditingField('preferred_gender')}
      />

      <ProfileEditModal
        visible={editingField !== null}
        onClose={handleClose}
        onSave={handleSave}
        title={
          editingField === 'age_range'
            ? 'Edit Age Range'
            : 'Edit Preferred Gender'
        }
        hasChanges={hasChanges()}
      >
        {renderEditContent()}
      </ProfileEditModal>
    </CustomSurface>
  );
};
