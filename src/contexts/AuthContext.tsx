import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { getSSAccessToken, isValidToken } from '../utils/tokenManager';
/*
This context is used to determine if the user is logged in or not.
if there is a valid token and a userId in the expo secure store,the context value isLoggedIn will be set to true.
*/

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
        console.warn('Error checking login status: ', error);
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
