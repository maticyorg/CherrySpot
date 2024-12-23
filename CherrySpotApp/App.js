// Rev 1
// File: App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import { initializeApp } from 'firebase/app';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

async function accessSecretVersion(name) {
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Audiowide': require('./assets/fonts/Audiowide-Regular.ttf'),
  });

  const [firebaseConfig, setFirebaseConfig] = useState(null);

  useEffect(() => {
    async function fetchSecrets() {
      const FIREBASE_API_KEY = await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_API_KEY/versions/latest');
      const FIREBASE_AUTH_DOMAIN = await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_AUTH_DOMAIN/versions/latest');
      const FIREBASE_PROJECT_ID = await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_PROJECT_ID/versions/latest');
      const FIREBASE_STORAGE_BUCKET = await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_STORAGE_BUCKET/versions/latest');
      const FIREBASE_MESSAGING_SENDER_ID = await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_MESSAGING_SENDER_ID/versions/latest');
      const FIREBASE_APP_ID = await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_APP_ID/versions/latest');

      setFirebaseConfig({
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
      });

      // Initialize Firebase once the config is set
      initializeApp({
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
      });
    }

    fetchSecrets();

    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !firebaseConfig) {
    return null; // Render nothing until fonts and config are loaded
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