import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { getSecureStoreUID } from '../utils/secureStoreManager';

export type User = {
  // TODO: move to different file
  id: number;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  age: number | null;
  bio: string;
  birthdate: string;
  email: string;
  gender: string;
  is_staff: boolean;
  is_active: boolean;
  location: string;
  preferred_age_max: number;
  preferred_age_min: number;
  preferred_gender: string;
  groups: any[];
  user_permissions: any[];
};

const AuthContext = createContext<{
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  setIsLoading: any;
  setIsLoggedIn: any;
  setUser: any;
}>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  setIsLoading: () => {},
  setIsLoggedIn: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }, props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    // middleware is ran before this code even on initial load. So token should be in axios header if they are in SS
    try {
      const userId = await getSecureStoreUID();
      if (userId) {
        const result = await apiClient.get(`api/users/user_by_id/${userId}/`);
        if (result.status === 200) {
          setUser(result?.data);
          setIsLoading(false);
          setIsLoggedIn(true);
        }
        return result?.data as User;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.warn('No userId found in Secure Store: ', error);
      setIsLoading(false);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
