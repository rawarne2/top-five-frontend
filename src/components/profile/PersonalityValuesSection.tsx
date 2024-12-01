import React, { useState, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InfoItem } from '../fields/InfoItem';
import { ProfileEditModal } from '../modals/ProfileEditModal';
import { SelectField } from '../fields/SelectField';
import { MultiSelectField } from '../fields/MultiSelectField';
import { TextInputField } from '../fields/TextInputField';
import { useProfileChoices } from '../../hooks/queries';
import { useUpdateProfile } from '../../hooks/mutations';
import isEqual from 'lodash/isEqual';
import { InterestsSelector } from '../InterestsSelector';
import { CustomSurface } from '../../containers/CustomSurface';
import { Profile } from '../../types/profile';

type EditingField =
  | 'core_values'
  | 'interests'
  | 'life_goals'
  | 'love_languages'
  | 'personality_type'
  | 'political_views'
  | 'religion'
  | 'relationship_goals'
  | 'special_talents'
  | 'communication_style'
  | null;

interface PersonalityValuesSectionProps {
  profile: Profile;
}

interface FieldConfig {
  key: EditingField;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  getDisplayValue: (profile: Profile) => string | null;
  getValue: (profile: Profile) => any;
  renderEditContent: (
    value: any,
    choices: any,
    onChange: (value: any) => void
  ) => React.ReactNode;
  choicesKey?: string;
  modalHeight?: number;
}

export const PersonalityValuesSection: React.FC<
  PersonalityValuesSectionProps
> = ({ profile }) => {
  const theme = useTheme();
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [draftValue, setDraftValue] = useState<any>(null);
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
      key: 'core_values',
      label: 'Core Values',
      icon: 'star',
      getValue: (p) => p.core_values || '',
      getDisplayValue: (p) => p.core_values,
      renderEditContent: (value, _, onChange) => (
        <TextInputField
          value={value}
          onChangeText={onChange}
          label='Core Values'
          multiline
          maxLength={500}
        />
      ),
      modalHeight: 80,
    },
    {
      key: 'interests',
      label: 'Interests',
      icon: 'heart-multiple',
      getValue: (p) => p.interests || [],
      getDisplayValue: (p) => p.interests_display?.join(', '),
      renderEditContent: (value, _, onChange) => (
        <InterestsSelector
          selectedInterests={value}
          onInterestsChange={onChange}
          types={['interests']}
        />
      ),
      modalHeight: 80,
    },
    {
      key: 'life_goals',
      label: 'Life Goals',
      icon: 'flag',
      getValue: (p) => p.life_goals || '',
      getDisplayValue: (p) => p.life_goals,
      renderEditContent: (value, _, onChange) => (
        <TextInputField
          value={value}
          onChangeText={onChange}
          label='Life Goals'
          multiline
          maxLength={500}
        />
      ),
      modalHeight: 80,
    },
    {
      key: 'love_languages',
      label: 'Love Languages',
      icon: 'cards-heart',
      getValue: (p) => p.love_languages || [],
      getDisplayValue: (p) => p.love_languages_display?.join(', '),
      renderEditContent: (value, c, onChange) => (
        <MultiSelectField
          choices={c.love_languages}
          selectedValues={value}
          onSelect={onChange}
          maxSelections={3}
        />
      ),
      choicesKey: 'love_languages',
    },
    {
      key: 'personality_type',
      label: 'Personality Type',
      icon: 'account-group',
      getValue: (p) => p.personality_type,
      getDisplayValue: (p) => p.personality_type_display,
      renderEditContent: (value, c, onChange) => (
        <SelectField
          choices={c.personality_type}
          selectedValue={value}
          onSelect={onChange}
        />
      ),
      choicesKey: 'personality_type',
    },
    {
      key: 'political_views',
      label: 'Political Views',
      icon: 'bank',
      getValue: (p) => p.political_views,
      getDisplayValue: (p) => p.political_views_display,
      renderEditContent: (value, c, onChange) => (
        <SelectField
          choices={c.political}
          selectedValue={value}
          onSelect={onChange}
        />
      ),
      choicesKey: 'political',
    },
    {
      key: 'religion',
      label: 'Religion',
      icon: 'church',
      getValue: (p) => p.religion,
      getDisplayValue: (p) => p.religion_display,
      renderEditContent: (value, c, onChange) => (
        <SelectField
          choices={c.religion}
          selectedValue={value}
          onSelect={onChange}
        />
      ),
      choicesKey: 'religion',
    },
    {
      key: 'relationship_goals',
      label: 'Relationship Goals',
      icon: 'target',
      getValue: (p) => p.relationship_goals,
      getDisplayValue: (p) => p.relationship_goals_display,
      renderEditContent: (value, c, onChange) => (
        <SelectField
          choices={c.relationship_goals}
          selectedValue={value}
          onSelect={onChange}
        />
      ),
      choicesKey: 'relationship_goals',
    },
    {
      key: 'special_talents',
      label: 'Special Talents',
      icon: 'trophy',
      getValue: (p) => p.special_talents || '',
      getDisplayValue: (p) => p.special_talents,
      renderEditContent: (value, _, onChange) => (
        <TextInputField
          value={value}
          onChangeText={onChange}
          label='Special Talents'
          multiline
          maxLength={500}
        />
      ),
      modalHeight: 80,
    },
    {
      key: 'communication_style',
      label: 'Communication Style',
      icon: 'message-text',
      getValue: (p) => p.communication_style,
      getDisplayValue: (p) => p.communication_style_display,
      renderEditContent: (value, c, onChange) => (
        <SelectField
          choices={c.communication_style}
          selectedValue={value}
          onSelect={onChange}
        />
      ),
      choicesKey: 'communication_style',
    },
  ];

  const currentField = fieldConfigs.find(
    (config) => config.key === editingField
  );

  return (
    <CustomSurface title='Personality & Values'>
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
