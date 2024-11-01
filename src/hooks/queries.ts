import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from 'expo-image-picker';
import { getSecureStoreUID } from "../utils/secureStoreManager";
import apiClient from "../api/apiClient";
import cards from '../data/usersCardData.json';


export interface UserProfile {
    user_id: number;
    bio?: string;
    interests?: number[]; // Assuming Interest is referenced by IDs
    picture_urls?: string[];
    gender: 'male' | 'female' | 'non-binary';
    location: string;
    preferred_gender?: 'male' | 'female' | 'non-binary' | null;
    min_preferred_age: number;
    max_preferred_age: number;
    phone_number?: string | null;
    height?: number | null;
    pronouns?: 'he/him' | 'she/her' | 'they/them' | 'other' | null;
    highest_education?:
    | 'high_school'
    | 'associate'
    | 'bachelor'
    | 'master'
    | 'phd'
    | 'other'
    | null;
    political_views?:
    | 'liberal'
    | 'conservative'
    | 'moderate'
    | 'apolitical'
    | 'other'
    | null;
    pet_preferences:
    | 'dogs'
    | 'cats'
    | 'birds'
    | 'reptiles'
    | 'small_animals'
    | 'multiple'
    | 'none';
    exercise_level?:
    | 'never'
    | 'rarely'
    | 'sometimes'
    | 'often'
    | 'daily'
    | null;
    additional_info?: string | null;
    occupation?: string | null;
    goals?: string | null;
}

const fetchUserProfile = async (): Promise<UserProfile> => {
    const userId = await getSecureStoreUID();
    if (!userId) throw new Error('User ID not found');

    const { data } = await apiClient.get(`/api/users/get_profile/${userId}/`);
    return data;
};

export const useFetchProfileQuery = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
    });
};

// uncomment to use real data
export const useFetchPotentialMatches = () => {
    return useQuery({
        queryKey: ['potentialMatches'],
        queryFn: async () => { // using temporary data for now until there are a lot of potential matches in db with data backups setup to restart swiping on people
            return cards.users;
            // const response = await apiClient.get('/api/users/potential_matches/');
            // return response.data;
        },
    });
}

// uncomment to use real data
export const useFetchMatches = () => {
    return useQuery({
        queryKey: ['matches'],
        queryFn: async () => {
            // const response = await apiClient.get('api/users/matches/');
            // return response.data;
            return cards.users;
        }

    })
}
