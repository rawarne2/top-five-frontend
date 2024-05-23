import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';

const MainComponents = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (!isLoading) {
    return isLoggedIn ? <TabNavigator /> : <LoginScreen />;
  } else {
    return <LoadingScreen />;
  }
};

export default MainComponents;
