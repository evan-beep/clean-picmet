
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import MainProductPage from './screens/NextScreen';
import StartSceen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';

import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';
import RegisterScreen from './screens/RegisterScreen';

import { Provider } from 'react-native-paper'
const Stack = createStackNavigator();

import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";
import { Alert } from 'react-native';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyC4sYfz1pRXlf1AobgQ69aDMzw3F3imGQo",
  authDomain: "picmet-app.firebaseapp.com",
  databaseURL: "https://picmet-app-default-rtdb.firebaseio.com",
  projectId: "picmet-app",
  storageBucket: "picmet-app.appspot.com",
  messagingSenderId: "1040692554774",
  appId: "1:1040692554774:web:ae603f95751b34ae465937",
  measurementId: "G-8RNR9L5QHF"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}


const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

function App() {

  const config: TransitionSpec = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Provider>

      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="Start" component={StartSceen} options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} />

          <Stack.Screen name="Main" component={MainProductPage} options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}

export default App;
