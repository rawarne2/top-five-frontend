import * as SecureStore from "expo-secure-store";


export enum SSKey {
    access_token = 'access_token',
    refresh_token = 'refresh_token',
    user_id = 'user_id'
}

export const saveToSecureStore = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(value),);
    } catch (error) {
        console.error('error saving SecureStore value: ', error)
    }
}

export const getSecureStoreValue = async (key: SSKey): Promise<string | null> => {
    try {
        const value = await SecureStore.getItemAsync(key);
        return JSON.parse(value)
    } catch (error) {
        console.error(`error getting SecureStore value with key: ${key}: `, error)
        return null;
    }
}

export const deleteSecureStoreValue = async (key: string): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(key);
        console.log('successfully deleted SecureStore value with key: ', key)
    } catch (error) {
        console.error(`error deleting SecureStore key: ${key}: `, error)
    }
}

export const saveSecureStoreUID = async (id: string): Promise<void> => {
    await saveToSecureStore(SSKey.user_id, id);
}

export const getSecureStoreUID = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.user_id);
}

export const deleteSecureStoreUID = async (): Promise<void> => {
    await deleteSecureStoreValue(SSKey.user_id);
}