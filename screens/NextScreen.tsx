import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity, Image, StyleSheet, TextInput, FlatList, Platform, KeyboardAvoidingView, Appearance } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerMenu, } from './DrawerMenu';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Modal, Portal, Provider, Text } from 'react-native-paper';

import History from './History'
import Favourites from './Favourites';
import WishNotes from './WishNotes';

import firebase from 'firebase/app'

// Optionally import the services that you want to use
import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
import "firebase/storage";
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ItemView from './ItemView';

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

const Drawer = createDrawerNavigator();


var itemList: any = []

function HotMain({ navigation }: { navigation: any }) {

  useEffect(getItem, []);

  const [currImage, setCurrImage] = useState('https://imgur.com/bPYmREY');
  const [currItem, setCurrItem] = React.useState(null);

  const [commentsLikedList, setCommentsLikedList] = useState<string[]>([])
  const [commentsDisLikedList, setCommentsDisLikedList] = useState<string[]>([])

  function detectBday() {
    if (currUser) {
      let user_list = firebase.database().ref('user_list');
      user_list.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          if (childData.email == currUser.email) {
            setDisplayName(childData.displayName)
            if (!childData.bday || childData.bday == "") {
              setHasBirthday(false);
            }
            if (childData.comments_liked_list) {
              let temp = []
              Object.values(childData.comments_liked_list).forEach(function (e) {
                temp.push(e.comment_id);
              })
              setCommentsLikedList(temp)
            }
            if (childData.comments_disliked_list) {
              let temp = []
              Object.values(childData.comments_disliked_list).forEach(function (e) {
                temp.push(e.comment_id);
              })
              setCommentsDisLikedList(temp)
            }
          }
        })
      })
    }
  }



  const [currUser, setCurrUser] = useState<any>(null);

  const firebaseUser = firebase.auth().currentUser;

  const showModal = (item: any) => {
    setCurrItem(item.item)
    if (currImage !== item.item.photourl) {
      setCurrImage('https://firebasestorage.googleapis.com/v0/b/picmet-app.appspot.com/o/photo%2Ftest1?alt=media&token=64634594-1188-47ba-9e74-aa816f53ce3a')
    }

    setVisible(true);
    firebase.database().ref("item_list/" + item.item.id + "/click").get().then(function (e) {
      e.val();
      firebase.database().ref("item_list/" + item.item.id + "/click").set(e.val() + 1);
    });
    navigation.push('Item', { CurrItem: item, OutsideUser: currUser, CommentDislikeList: commentsDisLikedList, CommentLikeList: commentsLikedList })
  };

  useEffect(() => {
    console.log(firebaseUser)

    if (firebaseUser) {
      setCurrUser(firebaseUser);
    } else {
      setCurrUser(null)
    }
  }, []);

  useEffect(() => {
    detectBday();
  }, [currUser])

  const [visible, setVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [hotMainItems, setHotMainItems] = useState<any>([]);

  const [hasBirthday, setHasBirthday] = useState(true);

  const [myComment, setMyComment] = useState('');
  const [likeOrDis, setLikeOrDis] = useState('None');

  const [bday, setBday] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [is_favorite, setIs_favorite] = useState(false);


  const [itemRefreshing, setItemRefreshing] = useState(false)

  function onItemRefresh() {
    setItemRefreshing(true)
    getItem()
  }
  useEffect(() => {
    setDarkMode(Appearance.getColorScheme() === 'dark');
  }, [])


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setBday(date);
    hideDatePicker();
  };




  function fixLayout(somelist: any[]) {
    let temp: any = [];
    temp = somelist;
    if (somelist.length % 2 !== 0) {
      temp.push({ id: 'yobros', name: 'empty', likes: '', dislikes: '', comments: '', imageURL: "" });
      setHotMainItems(temp);
    } else {
      setHotMainItems(temp);
    }
  }




  function getItem() {

    firebase.database().ref("item_list").once('value').then(
      function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var itemkey = childSnapshot.val();
          itemList.push({ id: childSnapshot.key, ...itemkey });
        })
      }).then(
        () => {
          setItemRefreshing(false)
          fixLayout(itemList);
          itemList = [];
        }
      )
  }


  const renderItem = (item: any) => {
    return (
      item.item.name !== 'empty'
        ?
        <TouchableOpacity
          onPress={() => {
            if (currUser) {
              let user_email = currUser.email;
              let user_list = firebase.database().ref('user_list');
              user_list.once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                  var childData = childSnapshot.val();
                  if (childData.email == user_email) {
                    let user_favorite_list = firebase.database().ref('user_list/' + childSnapshot.key + "/favorite_list");
                    let user_liked_list = firebase.database().ref('user_list/' + childSnapshot.key + '/liked_list');
                    let user_disliked_list = firebase.database().ref('user_list/' + childSnapshot.key + '/disliked_list');
                    user_favorite_list.once('value').then(function (s) {
                      s.forEach(function (c) {
                        let itemID = c.val().itemID;
                        if (itemID == item.item.id) {
                          setIs_favorite(true);
                        }
                      })
                    })
                    user_liked_list.once('value').then(function (s) {
                      s.forEach(function (c) {
                        let itemID = c.val().itemID;
                        if (itemID == item.item.id) {
                          setLikeOrDis("Like");
                        }
                      })
                    })
                    user_disliked_list.once('value').then(function (s) {
                      s.forEach(function (c) {
                        let itemID = c.val().itemID;
                        if (itemID == item.item.id) {
                          setLikeOrDis("Dislike");
                        }
                      })
                    })
                    let user_history_list = firebase.database().ref('user_list/' + childSnapshot.key + "/history_list");
                    user_history_list.once('value').then(function (s) {
                      s.forEach(function (c) {
                        let itemID = c.val().itemID;
                        if (itemID == item.item.id) {
                          firebase.database().ref('user_list/' + childSnapshot.key + "/history_list/" + c.key).remove();
                        }
                      })
                    }).then(function () {
                      user_history_list.push({
                        itemID: item.item.id
                      })
                    })
                  }
                })
              })
            }
            showModal(item)
          }
          }
          style={styles.itemBlock}>
          <View style={styles.itemTouch}>
            <Image
              source={{ uri: item.item.photourl }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </View>
          <View style={{ width: '100%', height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ maxWidth: '90%', fontSize: 20, color: 'white', fontWeight: '600' }}>
              {item.item.name}
            </Text>
          </View>
          <View style={styles.likeDis}>
            <View style={styles.likes}>
              <Image
                source={require('../assets/like.png')}
                style={{ marginRight: 5, width: 20, height: 20, resizeMode: 'contain' }}
              />
              <Text style={styles.likeTXT}>
                {item.item.likeNum ? item.item.likeNum : 0}
              </Text>
            </View>
            <View style={styles.likes}>
              <Image
                source={require('../assets/dislike.png')}
                style={{ marginRight: 5, width: 20, height: 20, resizeMode: 'contain' }}
              />
              <Text style={styles.likeTXT}>
                {item.item.dislikeNum ? item.item.dislikeNum : 0}
              </Text>
            </View>
            <View style={styles.likes}>
              <Image
                source={require('../assets/commentsIcon.png')}
                style={{ marginRight: 5, width: 20, height: 20, resizeMode: 'contain' }}
              />
              <Text style={styles.likeTXT}>
                {item.item.comments ? item.item.comments : 0}
              </Text>
            </View>

          </View>

        </TouchableOpacity>
        :
        <View style={styles.itemBlock}>
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
              沒有更多囉
            </Text>
          </View>


        </View>

    )

  }



  const mainHeader = () => {
    return (
      <Text style={{ fontSize: 30, color: 'white', fontWeight: '800', width: '50%' }}>
        熱門商品
      </Text>
    )
  }

  function updateDNameBDay() {
    if (!bday || bday == '') {
      Alert.alert('請輸入您的生日')
      return
    }
    if (!displayName || displayName == '') {
      Alert.alert('請輸入您的使用者名稱')
      return
    }
    let user_list = firebase.database().ref('user_list');
    user_list.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (childData.email == currUser.email) {
          if (!childData.bday) {
            let user_data = firebase.database().ref('user_list/' + childSnapshot.key);
            user_data.set({
              bday: bday.toString()
            })
          }
        }
      })
    })
    setHasBirthday(true);
  }

  const GetBdayModal = () => {
    return (

      <View style={styles.container}>
        <View style={styles.topContainer}>

        </View>
        <View style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ width: '100%', height: 100, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 25, width: '60%', lineHeight: 30 }}>
              {
                `在開始之前請先輸入您的使用者名稱以及生日`
              }

            </Text>
          </View>
          <View style={[styles.textInputBG, styles.midCol]}>
            <TextInput
              style={styles.input}
              onChangeText={setDisplayName}
              value={displayName}
              placeholder="使用者名稱"
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            onPress={showDatePicker}
            style={[styles.midCol, styles.textInputBG, {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#7CAEDE'
            }]}>
            <Text style={{
              fontSize: 20,
              color: 'white',
              fontWeight: '700'
            }}>
              選擇生日{bday ? '：' + bday.toISOString().substring(0, 10) : ''}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            isDarkModeEnabled={darkMode}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />


          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => { updateDNameBDay() }}
              style={[styles.midCol, styles.textInputBG, {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#71D0DA'
              }]}>
              <Text style={{
                fontSize: 20,
                color: 'white',
                fontWeight: '700'
              }}>
                完成
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.midCol, {
            height: 80,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }]}>
          </View>
        </View>
      </View>)
  }


  return (
    <Provider>
      <View style={{ backgroundColor: '#71D0DA', flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={styles.topBlock}>
          <TouchableOpacity
            onPress={() => { navigation.openDrawer() }}
            style={styles.topButton}>
            <Image
              style={[{
                height: 40,
                width: 40,
                resizeMode: 'contain',
                opacity: 1
              }]}
              source={require('../assets/openmenu.png')}
            />
          </TouchableOpacity>
          <View style={styles.textInputBG}>
            <TextInput
              style={styles.input}
              onChangeText={setSearchQuery}
              value={searchQuery}
              placeholder="搜尋"
            />
          </View>
          <TouchableOpacity
            onPress={() => { }}
            style={styles.topButton}>
            <Image
              style={[{
                height: 40,
                width: 40,
                resizeMode: 'contain',
                opacity: 1
              }]}
              source={require('../assets/search.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.commentList}>
          <FlatList
            data={hotMainItems}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={mainHeader}
            ListHeaderComponentStyle={{ width: '90%', height: 60, alignItems: 'flex-start', justifyContent: 'center' }}
            columnWrapperStyle={styles.row}
            renderItem={renderItem}
            horizontal={false}
            numColumns={2}
            onRefresh={onItemRefresh}
            refreshing={itemRefreshing}
            contentContainerStyle={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 120
            }}
          />
        </View>

        <Portal>
          <Modal style={{ marginTop: 0, marginBottom: 0 }} visible={!hasBirthday}>
            {GetBdayModal()}
          </Modal>
        </Portal>
      </View>
    </Provider>
  )
}
const Stack2 = createStackNavigator();

function MainNavi({ navigation }: { navigation: any }) {
  return (
    <Provider>
      <Stack2.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack2.Screen name="HotMain" component={HotMain} />
        <Stack2.Screen name="Item" component={ItemView} />
      </Stack2.Navigator>
    </Provider>

  );
}

export default function MainProductPage({ navigation }: { navigation: any }) {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
      initialRouteName="Home" drawerContent={props => <DrawerMenu {...props} />}>
      <Drawer.Screen name="Home" component={MainNavi} />
      <Drawer.Screen name="History" component={History} />
      <Drawer.Screen name="Fav" component={Favourites} />
      <Drawer.Screen name="Wish" component={WishNotes} />

    </Drawer.Navigator>
  )
}




const styles = StyleSheet.create({
  itemBlock: {
    width: '47%',
    display: 'flex',
    height: 260,
    backgroundColor: '#DE75BE',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  itemTouch: {
    width: '90%',
    height: 170,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 8
  },
  itemIMG: {

  },
  topBlock: {
    width: '100%',
    height: 80,
    //backgroundColor: 'red',
    marginTop: 60,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  input: {
    width: '60%',
    height: 50,
    marginLeft: 20,
    fontSize: 20,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  textInputBG: {
    width: '60%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center'
  },
  topButton: {
    width: 50,
    height: 50,
    //backgroundColor: 'blue',
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatList: {
    height: '90%',
    width: '100%',
  },
  row: {
    justifyContent: 'space-around'
  },
  likeDis: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  likes: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  likeTXT: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  topContainer: {
    width: '90%',
    height: '10%',
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    //backgroundColor: 'red'
  },
  backButton: {
    width: 50,
    height: 50,
    //resizeMode: 'contain',
    display: 'flex'
  },
  commentList: {
    height: '90%',
    width: '100%',
  },
  itemModal: {
    backgroundColor: '#DE75BE',
    width: '100%',
    height: '100%'
  },
  flatlistHeaderContainer: {
    width: '100%',
    //backgroundColor: 'blue',
    alignItems: 'center',
    //justifyContent: 'center'
  },
  commentContainer: {
    minHeight: 90,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#B184CF',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center'
    //justifyContent: 'center'
  },

  midContainer: {
    width: '80%',
    height: '50%',
    display: 'flex',
    //backgroundColor: 'red',
    flexDirection: 'column',
  },

  loginTXT: {
    width: '100%',
    height: 50
  },


  midCol: {
    marginTop: 25
  },
  socialMediaButton: {
    width: '40%',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 20
  },
  visibility: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    position: 'absolute',
    right: 15
  }


})
