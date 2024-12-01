import axios from "axios";
import { API_URL } from "@env";
import { getSSAccessToken, getSSRefreshToken, isValidToken, saveTokenAndUserIdToSS } from "../utils/tokenManager";

const isNgrok = () => API_URL.includes('ngrok');

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: isNgrok() ? 15000 : 10000
});

// Log the current API configuration in development
if (__DEV__) {
    console.log('API Client Configuration:', API_URL);
}

// Request Interceptor
apiClient.interceptors.request.use(async (config) => {
    if (config.url === 'api/token/refresh/' || config.url === 'api/users/login/') {
        return config;
    }

    const accessToken = await getSSAccessToken();
    if (accessToken && isValidToken(accessToken)) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    } else {
        const refreshToken = await getSSRefreshToken();
        if (refreshToken) { // TODO: make sure refresh token is valid
            try {
                const response = await apiClient.post("api/token/refresh/", { refresh: refreshToken });
                const { access: newAccessToken, refresh: newRefreshToken } = response.data;

                if (newAccessToken && newRefreshToken) {
                    await saveTokenAndUserIdToSS(newAccessToken, newRefreshToken);
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                }
            } catch (err) {
                console.error('Error refreshing tokens: ', err);
                throw err;
            }
        }
    }
    return config;
});

export default apiClient;