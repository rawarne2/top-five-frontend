import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { AuthContextType, useAuth, User } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import { deleteTokenAndUserIdFromSS, saveTokenAndUserIdToSS } from '../utils/tokenManager';

type LoginResponseType = {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
};

type PhotoUpload = {
    key: number;
    image: ImagePickerAsset;
};

const findUrlByPhotoNumber = (urls: string[], photoNumber: number): string | null => {
    const regex = new RegExp(`photo_${photoNumber}\\.[^/]+$`);
    return urls.find(url => regex.test(url)) || null;
};

import { Profile } from '../hooks/queries';
import { getSecureStoreUID } from '../utils/secureStoreManager';

const uploadPhotos = async (photos: PhotoUpload[]): Promise<Profile> => {
    const userId = await getSecureStoreUID();
    const photoIndexes = photos.map(photo => photo?.key);

    try {
        // Get pre-signed URLs from backend
        const { data: { presigned_urls: presignedUrls } } = await apiClient.put(
            `/api/users/get_presigned_urls/${userId}/`,
            { photo_indexes: photoIndexes }
        );

        // Upload photos to S3
        const uploadPromises = photos.map(async (photo) => {
            const presignedUrl = findUrlByPhotoNumber(presignedUrls, photo.key);
            if (!presignedUrl) throw new Error(`No presigned URL found for photo ${photo.key}`);

            await FileSystem.uploadAsync(presignedUrl, photo.image.uri, {
                httpMethod: 'PUT',
                headers: {
                    'Content-Type': photo.image.mimeType || 'image/jpeg'
                }
            });
            return presignedUrl.split('?')[0]; // Return base URL without S3 presigned parameters
        });

        const uploadedPhotoUrls = await Promise.all(uploadPromises);

        // Update profile with new photo URLs
        const { data: updatedProfile } = await apiClient.patch(
            `/api/users/update_profile/${userId}/`,
            { picture_urls: uploadedPhotoUrls }
        );

        return updatedProfile;
    } catch (error) {
        console.error('Error uploading photos:', error);
        throw error;
    }
};

export const useLogin = (useAuth: () => AuthContextType) => {
    const queryClient = useQueryClient();
    const { setIsLoggedIn } = useAuth();

    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (credentials: {
            email: string;
            password: string;
        }): Promise<LoginResponseType | null> => {
            try {
                const response = await apiClient.post('api/users/login/', credentials);
                if (!response) return null;

                const { access, refresh } = response?.data?.tokens;
                const user: User = response.data.user;
                const userId = user?.id;

                await saveTokenAndUserIdToSS(access, refresh, userId.toString());

                return { user, tokens: { access, refresh } };
            } catch (error) {
                console.error('useLogin mutation error: ', error);
                return null;
            }
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user);
            setIsLoggedIn(true);
        },
        onError: (error) => {
            console.error('Error logging in: ', error);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { setIsLoggedIn } = useAuth();

    return useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            await SecureStore.deleteItemAsync('userToken');
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            delete apiClient.defaults.headers.common.Authorization;
            setIsLoggedIn(false);
            deleteTokenAndUserIdFromSS();
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profileData: Partial<Profile>) => {
            const userId = await getSecureStoreUID();
            const response = await apiClient.patch(`/api/users/update_profile/${userId}/`, profileData);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['profile'], data);
        },
    });
};

export const useUploadPhotosMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['uploadPhotos'],
        mutationFn: ({ photos }: { photos: PhotoUpload[] }) => uploadPhotos(photos),
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(['profile'], updatedProfile);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error) => {
            console.error('Error uploading photos:', error);
        }
    });
};