import React, { useState, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InfoItem } from '../fields/InfoItem';
import { ProfileEditModal } from '../modals/ProfileEditModal';
import { SelectField } from '../fields/SelectField';
import { useProfileChoices } from '../../hooks/queries';
import { useUpdateProfile } from '../../hooks/mutations';
import type { Profile } from '../../hooks/queries';
import isEqual from 'lodash/isEqual';
import { CustomSurface } from '../../containers/CustomSurface';

type EditingField =
  | 'alcohol_frequency'
  | 'cannabis_friendly'
  | 'covid_vaccine_status'
  | 'exercise_level'
  | 'pet_preferences'
  | 'sleep_pattern'
  | 'social_media_usage'
  | 'dietary_preferences'
  | null;

interface FieldConfig {
  key: EditingField;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  getDisplayValue: (profile: Profile) => string | null;
  getValue: (profile: Profile) => string | null;
  choicesKey: string;
}

interface LifestyleSectionProps {
  profile: Profile;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  profile,
}) => {
  const theme = useTheme();
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const { data: choices, isLoading: isLoadingChoices } = useProfileChoices();
  const updateProfile = useUpdateProfile();

  const handleStartEdit = (field: EditingField) => {
    const config = fieldConfigs.find((c) => c.key === field);
    if (config) {
      setDraftValue(config.getValue(profile));
      setEditingField(field);
    }
  };

  const handleClose = () => {
    setDraftValue(null);
    setEditingField(null);
  };

  const handleSave = async () => {
    if (!editingField || draftValue === null) return;

    try {
      await updateProfile.mutateAsync({ [editingField]: draftValue });
      handleClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const hasChanges = useCallback(() => {
    if (!editingField || draftValue === null) return false;

    const config = fieldConfigs.find((c) => c.key === editingField);
    if (!config) return false;

    const originalValue = config.getValue(profile);
    return !isEqual(draftValue, originalValue);
  }, [editingField, draftValue, profile]);

  const fieldConfigs: FieldConfig[] = [
    {
      key: 'alcohol_frequency',
      label: 'Alcohol Frequency',
      icon: 'glass-cocktail',
      getDisplayValue: (p) => p.alcohol_frequency_display,
      getValue: (p) => p.alcohol_frequency,
      choicesKey: 'alcohol',
    },
    {
      key: 'cannabis_friendly',
      label: 'Cannabis Friendly',
      icon: 'cannabis',
      getDisplayValue: (p) => p.cannabis_friendly_display,
      getValue: (p) => p.cannabis_friendly,
      choicesKey: 'cannabis',
    },
    {
      key: 'covid_vaccine_status',
      label: 'Vaccine Status',
      icon: 'needle',
      getDisplayValue: (p) => p.covid_vaccine_status_display,
      getValue: (p) => p.covid_vaccine_status,
      choicesKey: 'vaccine_status',
    },
    {
      key: 'exercise_level',
      label: 'Exercise Level',
      icon: 'weight-lifter',
      getDisplayValue: (p) => p.exercise_level_display,
      getValue: (p) => p.exercise_level,
      choicesKey: 'exercise',
    },
    {
      key: 'pet_preferences',
      label: 'Pet Preferences',
      icon: 'paw',
      getDisplayValue: (p) => p.pet_preferences_display,
      getValue: (p) => p.pet_preferences,
      choicesKey: 'pets',
    },
    {
      key: 'sleep_pattern',
      label: 'Sleep Pattern',
      icon: 'bed',
      getDisplayValue: (p) => p.sleep_pattern_display,
      getValue: (p) => p.sleep_pattern,
      choicesKey: 'sleep_pattern',
    },
    {
      key: 'social_media_usage',
      label: 'Social Media Usage',
      icon: 'cellphone',
      getDisplayValue: (p) => p.social_media_usage_display,
      getValue: (p) => p.social_media_usage,
      choicesKey: 'social_media_usage',
    },
    {
      key: 'dietary_preferences',
      label: 'Dietary Preferences',
      icon: 'food-apple',
      getDisplayValue: (p) => p.dietary_preferences_display,
      getValue: (p) => p.dietary_preferences,
      choicesKey: 'diet',
    },
  ];

  const currentField = fieldConfigs.find(
    (config) => config.key === editingField
  );

  return (
    <CustomSurface title='Lifestyle'>
      {fieldConfigs.map((config) => (
        <InfoItem
          key={config.key}
          icon={config.icon}
          label={config.label}
          value={config.getDisplayValue(profile)}
          onPress={() => handleStartEdit(config.key)}
        />
      ))}

      <ProfileEditModal
        visible={editingField !== null}
        onClose={handleClose}
        onSave={handleSave}
        title={currentField ? `Edit ${currentField.label}` : ''}
        hasChanges={hasChanges()}
      >
        {currentField && !isLoadingChoices && choices && (
          <SelectField
            choices={choices[currentField.choicesKey]}
            selectedValue={draftValue}
            onSelect={setDraftValue}
          />
        )}
      </ProfileEditModal>
    </CustomSurface>
  );
};
