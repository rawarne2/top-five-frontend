import {
    QueryClient,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { AuthContextType, useAuth, User } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import {
    deleteSecureStoreJWTs,
    saveSecureStoreJWTs,
} from '../utils/tokenManager';
import {
    deleteSecureStoreUID,
    saveUserToSecureStore,
} from '../utils/secureStoreManager';

type LoginResponseType = {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
};

export const useLogin = (
    client: QueryClient,
    useAuth: () => AuthContextType
) => {
    const queryClient = client;
    const { setIsLoggedIn } = useAuth();
    return useMutation({
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }): Promise<LoginResponseType | null> => {
            try {
                console.log('logging in here');

                const response = await apiClient.post('api/users/login/', credentials);
                if (response) {
                    console.log('response: ', response);

                    const { access, refresh } = response?.data?.tokens;
                    const user = response?.data?.user;

                    await saveSecureStoreJWTs(access, refresh);
                    await saveUserToSecureStore({
                        id: user?.id,
                        first_name: user?.first_name,
                        last_name: user?.last_name,
                        email: user?.email,
                    });

                    return { user, tokens: { access, refresh } };
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user);
            saveSecureStoreJWTs(user.tokens.access, user.tokens.refresh);
            setIsLoggedIn(true);
        },
        // onError: (error) => {
        //     // TODO
        // }
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { setIsLoggedIn } = useAuth();
    return useMutation({
        mutationFn: async () => {
            await SecureStore.deleteItemAsync('userToken');
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            delete apiClient.defaults.headers.common.Authorization;
            setIsLoggedIn(false);
            deleteSecureStoreJWTs();
            deleteSecureStoreUID();
        },
        // onError: (error) => {
        //     // TODO
        // }
    });
};

export const useCreateProfile = (user_id: number, profileData: any) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createProfile'],
        mutationFn: async () => {
            await apiClient.put(`/update_profile/${user_id}/`, profileData);
        },
    });
};

export const useUpdateProfile = (user_id: number, profileData: any) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['updateProfile'],
        mutationFn: async () => {
            await apiClient.put(`/update_profile/${user_id}/`, profileData);
        },
    });
};

// export const uploadPhotos = async (userId: number, photos: any[]) => { // not working yet
//     const formData = new FormData();

//     photos.forEach((photo, index) => {
//         // send to s3
//         console.log('sending to s3: ', { photo, index })
//     });

//     try {
//         const response = await apiClient.put(`/update_profile/${userId}/`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error uploading photos:', error);
//         throw error;
//     }
// };
