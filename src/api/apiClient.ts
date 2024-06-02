import axios from "axios";
import { getSSAccessToken, getSSRefreshToken, isValidToken, saveSecureStoreJWTs } from "../utils/tokenManager";


const apiClient = axios.create({

    // Ngrok static url needed for requests on external devices. Expected occasional errors to reload ngrok server
    // ngrok http --domain=blessed-constantly-hornet.ngrok-free.app 8000
    // baseURL: "https://blessed-constantly-hornet.ngrok-free.app/",

    // baseURL: "http://127.0.0.1:8000/",
    baseURL: "http://192.168.1.142:8000/", // run this in backend terminal: python manage.py runserver 192.168.1.142:8000
    headers: {
        Accept: "application/json",
        timeout: 5000,
        "Content-Type": "application/json",
    },
});

// Request Interceptor
apiClient.interceptors.request.use(async (config) => {
    console.log('starting request: ', config)
    if (!config.headers.Authorization && config.url !== 'api/token/refresh/') {
        const accessToken = await getSSAccessToken();

        if (isValidToken(accessToken)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            // get new tokens if accessToken is expired
            const refreshToken = await getSSRefreshToken()
            if (refreshToken) {
                try {
                    const response = await apiClient.post("api/token/refresh/", { refresh: refreshToken });
                    console.log('new token response: ', response)

                    const newAccessToken = response?.data?.access;
                    const newRefreshToken = response?.data?.refresh;

                    if (newAccessToken && newRefreshToken) {
                        await saveSecureStoreJWTs(newAccessToken, newRefreshToken)
                        config.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return config
                } catch (err) {
                    console.error('Error refreshing tokens: ', err);
                    return Promise.reject(err)
                }
            }
        }
    }
    return config
})

// Response Interceptor
apiClient.interceptors.response.use((response) => {
    console.log('starting response: ', response)
    return response
},
    async (error) => {
        if (error?.response?.status === 401 && !(error?.response?.data?.error === 'Invalid email or password')) {
            const refreshToken: string | null = await getSSRefreshToken()
            if (refreshToken) {
                try {
                    const response = await apiClient.post("api/token/refresh/", { refresh: refreshToken });
                    console.log('new token response: ', response)

                    const newAccessToken = response?.data?.access;
                    const newRefreshToken = response?.data?.refresh;
                    const errorConfig = error?.config;

                    if (newAccessToken && newRefreshToken) {
                        await saveSecureStoreJWTs(newAccessToken, newRefreshToken)
                        errorConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return apiClient(errorConfig);
                } catch (err) {
                    console.error('Error refreshing tokens: ', err);
                    return Promise.reject(err)
                }
            }
        }
        console.log("error response: ", error.message)
        return Promise.reject(error);
    }
);

export default apiClient;