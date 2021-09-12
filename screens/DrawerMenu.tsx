import * as React from 'react';
import { View, StyleSheet, Image, } from 'react-native';

import {
  DrawerContent,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer'

import { useRoute } from '@react-navigation/native';

import {
  Avatar,
  Title,
  Drawer,
  Text,
  TouchableRipple
} from 'react-native-paper'
import { useState } from 'react';

import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";
import { Alert } from 'react-native';
import { useEffect } from 'react';

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

export function DrawerMenu(props: any) {

  const [currPage, setCurrPage] = useState('hotmain');
  const [currUser, setCurrUser] = useState<any>(null);

  const firebaseUser = firebase.auth().currentUser;

  useEffect(() => {
    if (firebaseUser) {
      setCurrUser(firebaseUser);
    }

  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: '#DE75BE' }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>

            <View style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              marginLeft: 15
            }}>
              <Avatar.Image
                source={
                  require('../assets/account_default.png')
                }
                size={72}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                }}
              />
              <View style={{
                marginTop: 16,
                marginLeft: 15
              }}>
                <Title style={{
                  fontSize: 35,
                  color: 'white',
                  fontWeight: '800',
                  lineHeight: 40
                }}>
                  {currUser ? currUser.displayName : '訪客'}
                </Title>
              </View>
            </View>

            <View style={styles.drawerSection}>
              <DrawerItem
                style={[styles.drawerTab, currPage == 'hotmain' ? styles.currTab : {}]}
                label={() => (
                  <View style={styles.drawerTabView}>
                    <Text style={styles.drawerTabText}>
                      熱門商品
                    </Text>
                  </View>
                )}
                onPress={() => { setCurrPage('hotmain'); props.navigation.navigate('Home') }}
              />
              <DrawerItem
                style={[styles.drawerTab, currPage == 'favs' ? styles.currTab : {}]}
                label={() => (
                  <View style={styles.drawerTabView}>
                    <Text style={styles.drawerTabText}>
                      我的最愛
                    </Text>
                  </View>
                )}
                onPress={() => { setCurrPage('favs'); props.navigation.navigate('Fav') }}
              />
              <DrawerItem
                style={[styles.drawerTab, currPage == 'hist' ? styles.currTab : {}]}
                label={() => (
                  <View style={styles.drawerTabView}>
                    <Text style={styles.drawerTabText}>
                      歷史瀏覽紀錄
                    </Text>
                  </View>
                )}
                onPress={() => { setCurrPage('hist'); props.navigation.navigate('History') }}
              />
              <DrawerItem
                style={[styles.drawerTab, currPage == 'wish' ? styles.currTab : {}]}
                label={() => (
                  <View style={styles.drawerTabView}>
                    <Text style={styles.drawerTabText}>
                      願望筆記
                    </Text>
                  </View>
                )}
                onPress={() => { setCurrPage('wish'); props.navigation.navigate('Wish') }}
              />


            </View>
          </View>

        </View>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Image
              source={require('../assets/logoutButton.png')}
              style={{
                height: 30,
                width: 30,
                marginLeft: 20,
                padding: 0
              }}
            />
          )}
          label={() => (
            <Text style={{
              fontSize: 25,
              borderRadius: 1,
              color: 'white',
              fontWeight: '600',
              padding: 0
            }}>
              {currUser ? '登出' : '登入頁面'}
            </Text>
          )}
          onPress={() => {
            firebase.auth().signOut();
            props.navigation.navigate('Login')
          }}

        />
      </Drawer.Section>

    </View>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    width: '100%',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 25,
    marginLeft: 0,
    width: '100%',
  },
  bottomDrawerSection: {
    borderColor: 'black',
    marginBottom: 15,

  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerTab: {
    marginLeft: 0,
    paddingLeft: 0,
    width: '100%',
    height: 80
  },
  drawerTabView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  drawerTabText: {
    fontSize: 22,
    borderRadius: 1,
    color: 'white',
    fontWeight: '600',
    padding: 0
  },
  currTab: {
    backgroundColor: '#B184CF'
  }
});