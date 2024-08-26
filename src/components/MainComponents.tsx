import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';

const MainComponents = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <TabNavigator /> : <LoginScreen />;
};

export default MainComponents;
