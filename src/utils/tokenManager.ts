import { saveToSecureStore, getSecureStoreValue, deleteSecureStoreValue, SSKey } from "./secureStoreManager";
import { decode as atob } from "base-64";

export const saveTokenAndUserIdToSS = async (access_token: string, refresh_token: string, userId?: string): Promise<void> => {
    await saveToSecureStore(SSKey.access_token, access_token);
    await saveToSecureStore(SSKey.refresh_token, refresh_token);
    if (userId) await saveToSecureStore(SSKey.user_id, userId);
}

// used for logout or deleting account
export const deleteTokenAndUserIdFromSS = async (): Promise<void> => {
    await deleteSecureStoreValue('access_token');
    await deleteSecureStoreValue('refresh_token');
    await deleteSecureStoreValue('user_id');
}

export const getSSAccessToken = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.access_token);
}

export const getSSRefreshToken = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.refresh_token);
}


// Token Verification

export function parseAccessToken(accessToken: string) {
    const tokenParts = accessToken?.split(".");
    // The payload is the second part of the token
    const tokenDate = atob(tokenParts[1]);
    const payload = JSON.parse(tokenDate);
    return payload;
}

export function isValidToken(tokenString: string) {
    if (tokenString) {
        const tokenData = parseAccessToken(tokenString);
        const expirationTime = tokenData.exp * 1000; // Convert expiration time from seconds to milliseconds
        const currentTime = Date.now(); // Current time in milliseconds

        // Compare the expiration time with the current time
        return expirationTime > currentTime;
    } else {
        console.warn('No token passed to token isValidToken')
        return false;
    }
}