import * as SecureStore from 'expo-secure-store';
import { User } from '../contexts/AuthContext';

export enum SSKey {
    access_token = 'access_token',
    refresh_token = 'refresh_token',
    user_id = 'user_id',
    first_name = 'first_name',
    last_name = 'last_name',
    email = 'email',
}

export const saveToSecureStore = async (
    key: string,
    value: string
): Promise<void> => {
    if (!key || !value) {
        console.warn(
            `Missing key or value provided to saveToSecureStore. Key: ${key}, Value: ${value}`
        );
        return;
    }
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving SecureStore value: ', error);
    }
};

export const getSecureStoreValue = async (
    key: SSKey
): Promise<string | null> => {
    if (!key || !Object.values(SSKey).includes(key)) {
        console.warn('No valid SSkey provided to getSecureStoreValue');
        return null;
    }
    try {
        const value = await SecureStore.getItemAsync(key);
        if (value === null) {
            return null;
        }
        return JSON.parse(value);
    } catch (error) {
        console.error(`Error getting SecureStore value with key: ${key}: `, error);
        return null;
    }
};

export const deleteSecureStoreValue = async (key: string): Promise<void> => {
    if (!key) {
        console.warn('No key provided to deleteSecureStoreValue');
        return;
    }
    try {
        await SecureStore.deleteItemAsync(key);
        console.log('Successfully deleted SecureStore value with key: ', key);
    } catch (error) {
        console.error(`Error deleting SecureStore key: ${key}: `, error);
    }
};

export const saveUserToSecureStore = async (user: User): Promise<void> => {
    if (!user) {
        console.warn('No user object provided to saveUserToSecureStore');
        return;
    }
    await saveToSecureStore(SSKey.user_id, user.id.toString());
    await saveToSecureStore(SSKey.first_name, user.first_name);
    await saveToSecureStore(SSKey.last_name, user.last_name);
    await saveToSecureStore(SSKey.email, user.email);
};

export const getSecureStoreUID = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.user_id);
};

export const deleteSecureStoreUID = async (): Promise<void> => {
    await deleteSecureStoreValue(SSKey.user_id);
};

export const getFullNameFromSecureStore = async (): Promise<string | null> => {
    const firstName = await getSecureStoreValue(SSKey.first_name);
    const lastName = await getSecureStoreValue(SSKey.last_name);
    if (firstName === null && lastName === null) {
        return null;
    }
    return `${firstName || ''} ${lastName || ''}`.trim();
};

export const getEmailFromSecureStore = async (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.email);
};
