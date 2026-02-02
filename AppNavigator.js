import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PlayersScreen from '../screens/PlayersScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RoleRevealScreen from '../screens/RoleRevealScreen';
import GameScreen from '../screens/GameScreen';
import VotingScreen from '../screens/VotingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A306D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'GameImpostor' }}
      />
      <Stack.Screen 
        name="Players" 
        component={PlayersScreen} 
        options={{ title: 'Pemain' }}
      />
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{ title: 'Kategori' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Pengaturan Game' }}
      />
      <Stack.Screen 
        name="RoleReveal" 
        component={RoleRevealScreen} 
        options={{ title: 'Peran Pemain' }}
      />
      <Stack.Screen 
        name="Game" 
        component={GameScreen} 
        options={{ title: 'Game Berlangsung' }}
      />
      <Stack.Screen 
        name="Voting" 
        component={VotingScreen} 
        options={{ title: 'Voting' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;