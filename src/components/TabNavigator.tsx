import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SwipeCards } from '../screens/SwipeCards';
import MatchesScreen from '../screens/MatchesScreen';
import { useTheme } from 'react-native-paper';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      id={'TabNavigator' as undefined}
      initialRouteName='SwipeCards'
      screenOptions={{
        tabBarActiveTintColor: colors.secondary,
        headerShown: false,
        tabBarStyle: { height: 80, backgroundColor: colors.onSurfaceVariant },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='bell' color={color} size={28} />
          ),
          animation: 'shift',
        }}
      />
      <Tab.Screen
        name='SwipeCards'
        component={SwipeCards}
        options={{
          tabBarLabel: 'Swiper',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='heart' color={color} size={28} />
          ),
          animation: 'shift',
        }}
      />
      <Tab.Screen
        name='Matches'
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account' color={color} size={28} />
          ),
          animation: 'shift',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
