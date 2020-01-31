import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ChatScreen from './chats/ChatScreen';
import SetProfileScreen from './SetProfileScreen';

const AppNavigator = createStackNavigator({
    Chat : ChatScreen,
    SetProfile: SetProfileScreen
  })

  export default AppNavigator;
