import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SwipeCards } from '../screens/SwipeCards';
import MatchesScreen from '../screens/MatchesScreen';
import { useTheme } from 'react-native-paper';

const TabNavigator = () => {
  const Tab = createMaterialBottomTabNavigator();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName='SwipeCards'
      activeColor={colors.secondary}
      activeIndicatorStyle={{ backgroundColor: colors.primary }}
      barStyle={{ height: 80 }}
      shifting
    >
      <Tab.Screen
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
