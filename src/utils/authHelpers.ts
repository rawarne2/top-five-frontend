import apiClient from "../api/apiClient";
import { User } from "../contexts/AuthContext";
import { deleteSecureStoreUID, saveSecureStoreUID } from "./secureStoreManager";
import { deleteSecureStoreJWTs, getSSRefreshToken, saveSecureStoreJWTs } from "./tokenManager";


// type LoginResponseType 
type LoginResponseType = {
    user: User,
    tokens: {
        access: string,
        refresh: string,
    }
};

export const login = async (email: string, password: string): Promise<LoginResponseType | null> => {
    try {
        const response = await apiClient.post('api/users/login/', {
            email: email,
            password: password,
        })
        console.log('login response: ', response)
        if (response) {
            const { access, refresh } = response?.data?.tokens
            const user = response?.data?.user;

            await saveSecureStoreJWTs(access, refresh);
            await saveSecureStoreUID(user?.id);

            return {
                user, tokens: { access, refresh }
            }
        } else {
            return null
        }
    } catch (error) {
        console.log('login error: ', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 401) {
                console.log('Unauthorized access - 401');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up the request:', error.message);
        }
        return null
    }
};

export const logout = async (setUser, setIsLoggedIn, setIsLoading) => {
    try {
        const refreshToken = await getSSRefreshToken();
        if (refreshToken) {
            await apiClient.post("api/users/logout/", {
                refresh_token: refreshToken,
            });
            await deleteSecureStoreJWTs();
            await deleteSecureStoreUID();
            setUser(null);
            setIsLoggedIn(false);
            delete apiClient.defaults.headers.common.Authorization
        } else {
            console.warn('No refresh token provided in logout')
        }
    } catch (err) {
        console.error("logout error: ", err);
        setIsLoading(false);
    }
};