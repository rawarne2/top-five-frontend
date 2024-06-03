import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useAuth } from '../contexts/AuthContext';
import { logout } from '../utils/authHelpers';

const ProfileScreen = () => {
  const { setUser, setIsLoggedIn, setIsLoading } = useAuth();

  const handleLogout = async () => {
    logout(setUser, setIsLoggedIn, setIsLoading);
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
      <Button onPress={handleLogout} mode='contained-tonal'>
        Logout
      </Button>
    </View>
  );
};

export default ProfileScreen;
