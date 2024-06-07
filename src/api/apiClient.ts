import axios from "axios";
import { getSSAccessToken, getSSRefreshToken, isValidToken, saveSecureStoreJWTs } from "../utils/tokenManager";

const apiClient = axios.create({

    // Ngrok static url needed for requests on external devices. Expected occasional errors to reload ngrok server
    // ngrok http --domain=blessed-constantly-hornet.ngrok-free.app 8000
    // baseURL: "https://blessed-constantly-hornet.ngrok-free.app/",
    // baseURL: "http://127.0.0.1:8000/",

    baseURL: "http://192.168.1.142:8000/", // external device: run this in backend terminal while in virtual env: python manage.py runserver 192.168.1.142:8000
    headers: {
        Accept: "application/json",
        timeout: 5000,
        "Content-Type": "application/json",
    },
});

// Request Interceptor
/**
 * Request Interceptor: Adds JWT to request headers if one exists and is valid.
 * If not, it tries to refresh the JWTs.
 * @param {Object} config - The request configuration object
 * @returns {Promise<Object>} - The modified request configuration object
 */
apiClient.interceptors.request.use(async (config) => {
    // Don't add tokens to refresh token urls or login urls
    if (config.url === 'api/token/refresh/' || config.url === 'api/users/login') {
        return config;
    }

    // Check if access token is valid
    const accessToken = await getSSAccessToken();
    if (accessToken && isValidToken(accessToken)) {
        // Add access token to request headers
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    }

    // If access token is not valid, try to refresh it
    const refreshToken = await getSSRefreshToken();
    if (refreshToken) {
        try {
            // Make a POST request to refresh the JWTs
            const response = await apiClient.post("api/token/refresh/", { refresh: refreshToken });
            const newAccessToken = response?.data?.access;
            const newRefreshToken = response?.data?.refresh;

            // If refresh was successful, save the new JWTs and add access token to request headers
            if (newAccessToken && newRefreshToken) {
                await saveSecureStoreJWTs(newAccessToken, newRefreshToken);
                config.headers.Authorization = `Bearer ${newAccessToken}`;
            }
        } catch (err) {
            console.error('Error refreshing tokens: ', err);
            return Promise.reject(err);
        }
    }

    return config;
});

// Response Interceptor
apiClient.interceptors.response.use((response) => {
    console.log('axios response: ', response)
    return response
},
    async (error) => {
        console.error("error response: ", error)
        return Promise.reject(error);
    }
);

export default apiClient;