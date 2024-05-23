import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeCards } from './src/screens/SwipeCards';
import LoginScreen from './src/screens/LoginScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { logout } from './src/utils/authHelpers';

function Matches() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Matches!</Text>
    </View>
  );
}

function Settings() {
  const { setUser, setIsLoggedIn, setIsLoading } = useAuth();

  const handleLogout = async () => {
    logout(setUser, setIsLoggedIn, setIsLoading);
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title='Logout' onPress={handleLogout} />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function AuthorizedUserTabs() {
  return (
    <Tab.Navigator
      initialRouteName='SwipeCards'
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name='Settings'
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='bell' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='SwipeCards'
        component={SwipeCards}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Matches'
        component={Matches}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
}

function MainComponent() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  } else {
    return isLoggedIn ? <AuthorizedUserTabs /> : <LoginScreen />;
  }
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <MainComponent />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
});
