import axios from "axios";
import { deleteSecureStoreJWTs, getSSAccessToken, getSSRefreshToken, isTokenExpired, saveSecureStoreJWTs } from "../utils/tokenManager";


const apiClient = axios.create({

    // Ngrok static url needed for requests on external devices. Expected occasional errors to reload ngrok server
    // ngrok http --domain=blessed-constantly-hornet.ngrok-free.app 80
    baseURL: "https://blessed-constantly-hornet.ngrok-free.app/",

    // baseURL: "http://127.0.0.1:8000/",  
    headers: {
        Accept: "application/json",
        timeout: 5000,
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(async (config) => {
    // tokens should be verified, in SecureStore already, and in axios request headers
    const accessToken = await getSSAccessToken();
    if (!!accessToken && !isTokenExpired(accessToken)) {  // TODO: figure out how to not check for every request
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config
})

apiClient.interceptors.response.use((response) => response,
    async (error) => {
        // Handle 401 Unauthorized errors (token expired or incorrect login credentials)
        // TODO: Return different responses for these in the backend
        if (error?.response?.status === 401 && !(error?.response?.data?.error === 'Invalid email or password')) {
            const refreshToken: string | null = await getSSRefreshToken()

            if (refreshToken) {
                // get new tokens if accessToken is expired
                try {
                    const response = await apiClient.post("api/token/refresh/", { refresh: refreshToken });
                    const newAccessToken = response?.data?.access;
                    const newRefreshToken = response?.data?.refresh;
                    const errorConfig = error?.config;

                    if (newAccessToken && newRefreshToken) {
                        await saveSecureStoreJWTs(newAccessToken, newRefreshToken)
                        errorConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return errorConfig
                } catch (err) {
                    console.error('Error refreshing tokens: ', err);
                    await deleteSecureStoreJWTs()
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;