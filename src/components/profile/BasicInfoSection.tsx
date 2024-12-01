import React, { useState, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InfoItem } from '../fields/InfoItem';
import { ProfileEditModal } from '../modals/ProfileEditModal';
import { HeightField } from '../fields/HeightField';
import { TextInputField } from '../fields/TextInputField';
import { useProfileChoices } from '../../hooks/queries';
import { useUpdateProfile } from '../../hooks/mutations';
import {
  convertCmToFeetInches,
  convertHeightToCm,
} from '../../utils/helperFunctions';
import type { Profile } from '../../hooks/queries';
import isEqual from 'lodash/isEqual';
import { CustomSurface } from '../../containers/CustomSurface';

type EditingField =
  | 'bio'
  | 'height'
  | 'location'
  | 'zodiac_sign'
  | 'sexual_orientation'
  | 'pronouns'
  | 'body_type'
  | 'company'
  | 'highest_education'
  | 'job_title'
  | null;

interface BasicInfoSectionProps {
  profile: Profile;
}

interface FieldConfig {
  key: EditingField;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  getDisplayValue: (profile: Profile) => string | null;
  renderEditContent: (
    value: any,
    choices: any,
    onChange: (value: any) => void
  ) => React.ReactNode;
  getValue: (profile: Profile) => any;
  modalHeight?: number;
  choicesKey?: string;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  profile,
}) => {
  const theme = useTheme();
  const [editingField, setEditingField] = useState<EditingField>(null);
  const { data: choices, isLoading: isLoadingChoices } = useProfileChoices();
  const updateProfile = useUpdateProfile();

  // Draft state for current edit
  const [draftValue, setDraftValue] = useState<any>(null);

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
      if (editingField === 'height') {
        await updateProfile.mutateAsync({
          height: convertHeightToCm(draftValue.feet, draftValue.inches),
        });
      } else {
        await updateProfile.mutateAsync({ [editingField]: draftValue });
      }
      handleClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Check if current draft value is different from original
  const hasChanges = useCallback(() => {
    if (!editingField || draftValue === null) return false;

    const config = fieldConfigs.find((c) => c.key === editingField);
    if (!config) return false;

    const originalValue = config.getValue(profile);
    return !isEqual(draftValue, originalValue);
  }, [editingField, draftValue, profile]);

  const fieldConfigs: FieldConfig[] = [
    {
      key: 'bio',
      label: 'Bio',
      icon: 'pencil-outline',
      getDisplayValue: (p) => p.bio,
      getValue: (p) => p.bio || '',
      renderEditContent: (value, _, onChange) => (
        <TextInputField
          value={value}
          onChangeText={onChange}
          label='Bio'
          multiline
          maxLength={500}
        />
      ),
      modalHeight: 80,
    },
    {
      key: 'height',
      label: 'Height',
      icon: 'human-male-height',
      getValue: (p) => {
        const { feet, inches } = convertCmToFeetInches(p.height || 170);
        return { feet, inches };
      },
      getDisplayValue: (p) => {
        const { feet, inches } = convertCmToFeetInches(p.height || 170);
        return p.height ? `${feet}' ${inches}"` : null;
      },
      renderEditContent: (value, _, onChange) => (
        <HeightField
          feet={value.feet}
          inches={value.inches}
          onChangeFeet={(f) => onChange({ ...value, feet: f })}
          onChangeInches={(i) => onChange({ ...value, inches: i })}
        />
      ),
    },
  ];

  const currentField = fieldConfigs.find(
    (config) => config.key === editingField
  );

  return (
    <CustomSurface title='Basic Information'>
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
        height={currentField?.modalHeight || 70}
        hasChanges={hasChanges()}
      >
        {currentField &&
          !isLoadingChoices &&
          currentField.renderEditContent(draftValue, choices, setDraftValue)}
      </ProfileEditModal>
    </CustomSurface>
  );
};
