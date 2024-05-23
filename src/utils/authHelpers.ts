import apiClient from "../api/apiClient";
import { User } from "../contexts/AuthContext";
import { deleteSecureStoreUID, saveSecureStoreUID } from "./secureStoreManager";
import { deleteSecureStoreJWTs, getSSRefreshToken, saveSecureStoreJWTs } from "./tokenManager";



export const login = async (
    email: string,
    password: string,
    setUser: {
        (user: User | null): void;
        (arg0: any): void;
    },
    setIsLoggedIn: any,
    setIsLoading: any,
) => {
    try {
        await setIsLoading(true);
        const { data, config, headers, status, request } = await apiClient.post('api/users/login/', {
            email: email,
            password: password,
        });
        console.log({ data, config, headers, status, request })

        const refreshToken = data?.tokens?.refresh;
        const accessToken = data?.tokens?.access;
        const userId = String(data?.user?.id);

        if (accessToken && refreshToken && userId) {
            await saveSecureStoreJWTs(accessToken, refreshToken);
            await saveSecureStoreUID(userId);
            setUser(data?.user); // TODO: validate user response
            setIsLoggedIn(true);
        }
    } catch (error) {
        console.error('login error: ', error);
        // TODO: handle 401 for incorrect email and/or password
    }
    setIsLoading(false);
};

export const logout = async (setUser, setIsLoggedIn, setIsLoading) => {
    try {
        setIsLoading(true);
        const refreshToken = await getSSRefreshToken();
        await apiClient.post("api/users/logout/", {
            refresh_token: refreshToken,
        });
        await deleteSecureStoreJWTs();
        await deleteSecureStoreUID();
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
    } catch (err) {
        console.error("logout error: ", err);
        setIsLoading(false);
    }
};