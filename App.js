import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import AppTabNavigator from './src/screens/AppTabNavigator';
import AppNavigator from './src/screens/AppNavigator';

const AuthStack = createStackNavigator({
  Login : LoginScreen,
  Register : RegisterScreen
})

const AppStack = createStackNavigator({
  AppTabNavigator,
  Screen : AppNavigator,
},{
  headerMode: 'none',
})

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading : LoadingScreen,
      App :  AppStack,
      Auth : AuthStack
    },
    {
      initialRouteName : "Loading"
    }
  )
);