import { useQuery } from "@tanstack/react-query";
import { getSecureStoreUID } from "../utils/secureStoreManager";
import apiClient from "../api/apiClient";
import cards from '../data/usersCardData.json';
import { Profile, ProfileChoices } from "../types/profile";




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