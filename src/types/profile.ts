export enum Gender {
    Male = 'male',
    Female = 'female',
    NonBinary = 'non-binary',
}


export interface Profile {
    user_id: number;
    user_details: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        birthdate: any;
    };
    // Fields with their values and display values
    alcohol_frequency: 'prefer_not_to_say' | 'never' | 'occasionally' | 'regularly';
    alcohol_frequency_display: string;

    bio: string;

    body_type: 'prefer_not_to_say' | 'slim' | 'average' | 'athletic' | 'curvy' | 'muscular';
    body_type_display: string;

    cannabis_friendly: 'prefer_not_to_say' | 'yes' | 'no';
    cannabis_friendly_display: string;

    communication_style: 'mixed' | 'direct' | 'indirect';
    communication_style_display: string;

    company: string | null;

    core_values: string | null;

    covid_vaccine_status: 'prefer_not_to_say' | 'vaccinated' | 'unvaccinated';
    covid_vaccine_status_display: string;

    dietary_preferences: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian';
    dietary_preferences_display: string;

    emotional_triggers: string | null;

    ethnicity: 'prefer_not_to_say' | 'white' | 'black' | 'asian' | 'hispanic' | 'mixed' | 'other';
    ethnicity_display: string;

    exercise_level: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily' | null;
    exercise_level_display: string;

    gender: Gender;
    gender_display: string;

    height: number | null;

    highest_education: 'high_school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'other' | null;
    highest_education_display: string;

    interests: string[];
    interests_display: string[];

    job_title: string | null;

    life_goals: string | null;

    location: string;

    love_languages: string[];
    love_languages_display: string[];

    max_preferred_age: number;
    min_preferred_age: number;

    personality_type: 'unknown' | 'introvert' | 'extrovert' | 'ambivert';
    personality_type_display: string;

    pet_preferences: 'none' | 'dogs' | 'cats' | 'birds' | 'reptiles' | 'small_animals' | 'multiple';
    pet_preferences_display: string;

    phone_number: string | null;
    picture_urls: string[];

    political_views: 'liberal' | 'conservative' | 'moderate' | 'apolitical' | 'other' | null;
    political_views_display: string;

    preferred_gender: Gender
    preferred_gender_display: string;

    pronouns: ('he/him' | 'she/her' | 'they/them' | 'other' | null)[];
    pronouns_display: string[];

    relationship_goals: 'not_sure' | 'casual' | 'committed' | 'marriage';
    relationship_goals_display: string;

    religion: 'prefer_not_to_say' | 'christian' | 'muslim' | 'jewish' | 'hindu' | 'buddhist' | 'other';
    religion_display: string;

    sexual_orientation: 'prefer_not_to_say' | 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'pansexual' | 'asexual';
    sexual_orientation_display: string;

    sleep_pattern: 'regular' | 'irregular' | 'night_owl' | 'early_bird';
    sleep_pattern_display: string;

    social_media_usage: 'none' | 'light' | 'moderate' | 'heavy';
    social_media_usage_display: string;

    special_talents: string | null;
    zodiac_sign: string | null;
    zodiac_sign_display: string;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    birthdate: Date;
}

export interface Choice {
    value: string;
    label: string;
}

export interface PromptResponse {
    id: number;
    prompt: number;
    prompt_text: string;
    response: string;
    created_at: string;
    updated_at: string;
}

export interface ProfileChoices {
    alcohol: Choice[];
    body_type: Choice[];
    cannabis: Choice[];
    communication_style: Choice[];
    diet: Choice[];
    education: Choice[];
    ethnicity: Choice[];
    exercise: Choice[];
    gender: Choice[];
    interests: Choice[];
    love_languages: Choice[];
    personality_type: Choice[];
    pets: Choice[];
    political: Choice[];
    pronouns: Choice[];
    relationship_goals: Choice[];
    religion: Choice[];
    sexual_orientation: Choice[];
    sleep_pattern: Choice[];
    social_media_usage: Choice[];
    vaccine_status: Choice[];
    zodiac: Choice[];
}