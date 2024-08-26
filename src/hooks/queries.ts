import { useQuery } from "@tanstack/react-query";
import { getSecureStoreUID } from "../utils/secureStoreManager";
import apiClient from "../api/apiClient";
import cards from '../data/usersCardData.json';


export const useFetchUser = (user_id) => {
    return useQuery({
        queryKey: ['fetchUser'], // TODO: make naming consistent
        queryFn: async () => {
            const response = await apiClient.get(`/api/users/${user_id}/`);
            return response.data;
        },
    });
};

export const useFetchProfile = (user_id) => {
    return useQuery({
        queryKey: ['fetchProfile'],
        queryFn: async () => {
            const response = await apiClient.get(`/get_profile/${user_id}/`)
            return response.data;
        },
    });
};

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
