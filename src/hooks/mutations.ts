import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { AuthContextType, useAuth, User } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import { deleteSecureStoreJWTs, saveSecureStoreJWTs } from '../utils/tokenManager';
import {
    deleteSecureStoreUID,
    saveUserToSecureStore,
    getSecureStoreUID,
} from '../utils/secureStoreManager';

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

import { UserProfile } from '../hooks/queries';

const uploadPhotos = async (photos: PhotoUpload[]): Promise<UserProfile> => {
    const userId = await getSecureStoreUID();
    const photoIndexes = photos.map(photo => photo.key);

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
            const response = await apiClient.post('api/users/login/', credentials);
            if (!response) return null;

            const { access, refresh } = response.data.tokens;
            const user = response.data.user;

            await saveSecureStoreJWTs(access, refresh);
            await saveUserToSecureStore({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            });

            return { user, tokens: { access, refresh } };
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user);
            saveSecureStoreJWTs(user.tokens.access, user.tokens.refresh);
            setIsLoggedIn(true);
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
            deleteSecureStoreJWTs();
            deleteSecureStoreUID();
        },
    });
};

export const useUpdateProfile = (userId: number, profileData: any) => {
    return useMutation({
        mutationKey: ['updateProfile'],
        mutationFn: async () => {
            await apiClient.put(`/update_profile/${userId}/`, profileData);
        },
    });
};

export const useUploadPhotosMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['uploadPhotos'],
        mutationFn: ({ photos }: { photos: PhotoUpload[] }) => uploadPhotos(photos),
        onSuccess: (updatedProfile) => {
            // Immediately update the cache with new data
            queryClient.setQueryData(['userProfile'], updatedProfile);
            // Also invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (error) => {
            console.error('Error uploading photos:', error);
        }
    });
};