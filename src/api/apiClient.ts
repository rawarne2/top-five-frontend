import axios, { AxiosError } from "axios";
import { getSSAccessToken, getSSRefreshToken, isValidToken, saveSecureStoreJWTs } from "../utils/tokenManager";

const apiClient = axios.create({
    // TODO: Set base URL in environment variables
    // Ngrok static url needed for requests on external devices. Expected occasional errors to reload ngrok server
    // ngrok http --domain=blessed-constantly-hornet.ngrok-free.app 8000
    // baseURL: "https://blessed-constantly-hornet.ngrok-free.app/",
    // baseURL: "http://127.0.0.1:8000/",

    baseURL: "http://192.168.4.22:8000/", // external device: run this in backend terminal while in virtual env: python manage.py runserver 192.168.4.22:8000
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 10000
});

// Request Interceptor

apiClient.interceptors.request.use(async (config) => {
    if (config.url === 'api/token/refresh/' || config.url === 'api/users/login/') {
        return config;
    }
    console.log({ config })

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
                    await saveSecureStoreJWTs(newAccessToken, newRefreshToken);
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

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // TODO: Handle unauthorized error (e.g., logout user or get new access token with the refresh token)
        }
        return Promise.reject(error);
    }
);

export default apiClient;