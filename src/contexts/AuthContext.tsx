import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { getSSAccessToken, isValidToken } from '../utils/tokenManager';
/*
context will hold user data (firstName, lastName, email) AND isLoggedIn with setIsLoggedIn.
React Query will hold profile data (age, bio, birthdate, gender, location, preferred_age_max, preferred_age_min, preferred_gender, etc.)
since it was split up in the backend.
if there is a valid token in the secure storage and and the user exists, the context value isLoggedIn will be set to true.
*/
export type User = {
  // TODO: move to different file
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // check if there is a valid token in secure storage and log in user if it is valid
  useEffect(() => {
    (async function () {
      // middleware is ran before this code even on initial load. So token should be in axios header if they are in SS
      try {
        const accessToken = await getSSAccessToken();
        if (accessToken && isValidToken(accessToken)) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.warn('No userId found in Secure Store: ', error);
        return null;
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
