import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import { SwipeCards } from '../screens/SwipeCards';
import MatchesScreen from '../screens/MatchesScreen';

const TabNavigator = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName='SwipeCards'
      activeColor='#e91e63'
      barStyle={{ height: 75 }}
    >
      <Tab.Screen
        key={1}
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='bell' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        key={2}
        name='SwipeCards'
        component={SwipeCards}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        key={3}
        name='Matches'
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account' color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
