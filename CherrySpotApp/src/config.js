// Rev 6
// File: src/config.js

import Constants from 'expo-constants';

const expoConfig = Constants.expoConfig || { extra: {} };

// Firebase configuration using environment variables from expo-constants
const firebaseConfig = {
  apiKey: expoConfig.extra.FIREBASE_API_KEY,
  authDomain: expoConfig.extra.FIREBASE_AUTH_DOMAIN,
  projectId: expoConfig.extra.FIREBASE_PROJECT_ID,
  storageBucket: expoConfig.extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: expoConfig.extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: expoConfig.extra.FIREBASE_APP_ID || '',
};

// App configuration
const appConfig = {
  defaultKeyword: "AIK", // Change this dynamically based on app context
  infosourcePrefix: "Infosource_", // Prefix for dynamic collections
  fontFamily: 'Audiowide', // Set the font family here
};

export { firebaseConfig, appConfig };
