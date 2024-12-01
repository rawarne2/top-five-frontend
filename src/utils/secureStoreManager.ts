import * as SecureStore from 'expo-secure-store';

export enum SSKey {
    access_token = 'access_token',
    refresh_token = 'refresh_token',
    user_id = 'user_id',
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
        const value = JSON.parse(await SecureStore.getItemAsync(key));
        if (value === null) {
            console.warn('No value found in Secure Store for key: ', key);
            return null;
        }
        return value;
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


export const getSecureStoreUID = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.user_id);
};

export const deleteSecureStoreUID = async (): Promise<void> => {
    await deleteSecureStoreValue(SSKey.user_id);
};
