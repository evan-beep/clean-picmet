import * as React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';


import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";

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

export default function HomeScreen({ navigation }: { navigation: any }) {

  return (
    <View style={styles.container}>
      <Image
        style={styles.bg1}
        source={require('../assets/bg1.png')} />
      <Image
        style={styles.bg2}
        source={require('../assets/bg2.png')} />

      <View style={styles.titleContainer}>
        <Image
          style={styles.titleIMG}
          source={require('../assets/picmet.png')} />
        <Image
          style={styles.sloganIMG}
          source={require('../assets/slogan.png')} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={false ? () => { } : () => navigation.push('Login')}>
          <Image
            style={styles.button}
            source={require('../assets/loginButton.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={false ? () => { } : () => navigation.push('Register')}>
          <Image
            style={styles.button}
            source={require('../assets/registerButton.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={false ? () => { } : () => navigation.push('Main')}>
          <Image
            style={styles.button}
            source={require('../assets/noAccountButton.png')} />
        </TouchableOpacity>
      </View>

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  bg1: {
    position: 'absolute',
    top: '26%',
    width: '100%',
    height: '70%',
    resizeMode: 'stretch'
  },
  bg2: {
    position: 'absolute',
    top: '40%',
    width: '100%',
    height: '60%',
    resizeMode: 'stretch'
  },
  button: {
    width: 218,
    height: 51,
    resizeMode: 'contain',
    marginTop: '5%'
  },
  logo: {
    width: 66,
    height: 58,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    width: '100%',
  },
  titleIMG: {
    maxWidth: '80%',
    width: 150,
    resizeMode: 'contain',
    height: 60

  },
  sloganIMG: {
    maxWidth: '80%',
    width: 180,
    height: 40,
    resizeMode: 'contain',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    width: '100%',
  }
});