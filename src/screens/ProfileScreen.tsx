import { Button, Text, View } from 'react-native';
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
      <Button title='Logout' onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
