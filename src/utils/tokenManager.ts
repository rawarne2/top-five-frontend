import { saveToSecureStore, getSecureStoreValue, deleteSecureStoreValue, SSKey } from "./secureStoreManager";
import { decode as atob } from "base-64";

// There is always only zero or one access_token, refresh_token, and user_id in the SecureStore at a time 

export const saveSecureStoreJWTs = async (access_token: string, refresh_token: string): Promise<void> => {
    await saveToSecureStore(SSKey.access_token, access_token);
    await saveToSecureStore(SSKey.refresh_token, refresh_token);
}

// used for logout or deleting account
export const deleteSecureStoreJWTs = async (): Promise<void> => {
    await deleteSecureStoreValue('access_token');
    await deleteSecureStoreValue('refresh_token');
}

export const getSSAccessToken = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.access_token);
}

export const getSSRefreshToken = (): Promise<string | null> => {
    return getSecureStoreValue(SSKey.refresh_token);
}


// Token Verification

// TODO: make it work for refresh tokens too
export function parseAccessToken(accessToken: string) {
    console.log("accessToken: ", accessToken)
    const tokenParts = accessToken?.split(".");
    // The payload is the second part of the token
    const tokenDate = atob(tokenParts[1]);
    const payload = JSON.parse(tokenDate);
    return payload;
}

export function isTokenExpired(tokenString: string) {
    const tokenData = parseAccessToken(tokenString);
    const expirationTime = tokenData.exp * 1000; // Convert expiration time from seconds to milliseconds
    const currentTime = Date.now(); // Current time in milliseconds

    // Compare the expiration time with the current time
    return expirationTime < currentTime;
}