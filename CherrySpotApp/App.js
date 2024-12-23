// Rev 1
// File: App.js

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './src/config'; // Updated from default import
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Initialize Firebase once at the top level
initializeApp(firebaseConfig);

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Audiowide': require('./assets/fonts/Audiowide-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;