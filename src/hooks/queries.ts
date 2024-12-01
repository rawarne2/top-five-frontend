import { useQuery } from "@tanstack/react-query";
import { getSecureStoreUID } from "../utils/secureStoreManager";
import apiClient from "../api/apiClient";
import cards from '../data/usersCardData.json';


export enum Gender {
    Male = 'male',
    Female = 'female',
    NonBinary = 'non-binary',
}


export interface Profile { // TODO: move to new file
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

const fetchProfile = async (): Promise<Profile> => {
    try {
        const userId = await getSecureStoreUID();
        if (!userId) throw new Error('User ID not found');

        const { data } = await apiClient.get<Profile>(`/api/users/get_profile/${userId}/`);
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const useFetchProfileQuery = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
    });
};

export const fetchPotentialMatches = async () => {
    // using temporary data for now until there are a lot of potential matches in db with data backups setup to restart swiping on people
    try {
        return cards.users;
        // const response = await apiClient.get('/api/users/potential_matches/');
        // return response.data;
    } catch (error) {
        console.error('Error fetching potential matches:', error);
        throw error;
    }
}

// uncomment to use real data
export const useFetchPotentialMatches = () => {
    return useQuery({
        queryKey: ['potentialMatches'],
        queryFn: fetchPotentialMatches,
    });
}

export const fetchMatches = async () => {
    try {
        // const response = await apiClient.get('api/users/matches/');
        // return response.data;
        return cards.users;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
}

// uncomment to use real data
export const useFetchMatches = () => {
    return useQuery({
        queryKey: ['matches'],
        queryFn: fetchMatches,
    })
}

export interface Choice {
    value: string;
    label: string;
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

const fetchProfileChoices = async (): Promise<ProfileChoices> => {
    try {
        const response = await apiClient.get('/api/users/profile_choices/');
        return response.data;
    } catch (error) {
        console.error('Error fetching profile choices:', error);
        throw error;
    }
};

export const useProfileChoices = () => {
    return useQuery({
        queryKey: ['profileChoices'],
        queryFn: fetchProfileChoices,
        staleTime: Infinity,
    });
};