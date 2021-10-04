import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity, Image, StyleSheet, TextInput, FlatList, Platform, KeyboardAvoidingView, Appearance } from 'react-native';

import { Text } from 'react-native-paper';

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




export default function ItemView({ route, navigation }: { route: any, navigation: any }) {

  const props = route.params.CurrItem
  const outsideUser = route.params.OutsideUser
  const commentLikes = route.params.CommentLikeList
  const commentDislikes = route.params.CommentDislikeList

  const [itemComments, setItemComments] = useState<any[]>([]);
  const [commentRefreshing, setCommentRefreshing] = useState(false)
  const [myComment, setMyComment] = useState('');
  const [currUser, setCurrUser] = useState<any>(null);

  const [commentsLikedList, setCommentsLikedList] = useState(commentLikes)
  const [commentsDisLikedList, setCommentsDisLikedList] = useState(commentDislikes)
  const [currItem, setCurrItem] = React.useState(props.item);
  const [currImage, setCurrImage] = useState(props.item.photourl);
  const [likeOrDis, setLikeOrDis] = useState('none');
  const [is_favorite, setIs_favorite] = useState(false);


  const firebaseUser = firebase.auth().currentUser;

  useEffect(() => {
    if (firebaseUser) {
      setCurrUser(firebaseUser);
    } else {
      setCurrUser(outsideUser)
    }
    getComment(props.item);
    if (outsideUser) {
      let user_email = outsideUser.email;
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
                if (itemID == currItem.id) {
                  setIs_favorite(true);
                }
              })
            })
            user_liked_list.once('value').then(function (s) {
              s.forEach(function (c) {
                let itemID = c.val().itemID;
                if (itemID == currItem.id) {
                  setLikeOrDis("Like");
                }
              })
            })
            user_disliked_list.once('value').then(function (s) {
              s.forEach(function (c) {
                let itemID = c.val().itemID;
                if (itemID == currItem.id) {
                  setLikeOrDis("Dislike");
                }
              })
            })
            let user_history_list = firebase.database().ref('user_list/' + childSnapshot.key + "/history_list");
            user_history_list.once('value').then(function (s) {
              s.forEach(function (c) {
                let itemID = c.val().itemID;
                if (itemID == currItem.id) {
                  firebase.database().ref('user_list/' + childSnapshot.key + "/history_list/" + c.key).remove();
                }
              })
            }).then(function () {
              user_history_list.push({
                itemID: currItem.id
              })
            })
          }
        })
      })
    }

  }, []);


  const CommentContainer = (item: any) => {
    function commentLike() {
      if (currUser) {
        let user_email = currUser.email;
        let user_list = firebase.database().ref("user_list");
        let comment_like_userlist = firebase.database().ref("comment_list/" + item.item.comment_id + "/like_userlist");
        let comment_dislike_userlist = firebase.database().ref("comment_list/" + item.item.comment_id + "/dislike_userlist");
        let user_liked_list = null;
        let user_disliked_list = null;
        let userKey = null;
        if (commentsLikedList.includes(item.item.comment_id)) {
          comment_like_userlist.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              let email = childSnapshot.val().email;
              if (email == user_email)
                firebase.database().ref('comment_list/' + item.item.comment_id + "/like_userlist/" + childSnapshot.key).remove();
            })
          }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                let email = childSnapshot.val().email;
                if (email == user_email) {
                  user_liked_list = firebase.database().ref("user_list/" + childSnapshot.key + "/comments_liked_list");
                  userKey = childSnapshot.key;
                }
              })
            }).then(function () {
              user_liked_list.once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                  if (item.item.comment_id == childSnapshot.val().comment_id) {
                    firebase.database().ref('user_list/' + userKey + "/comments_liked_list/" + childSnapshot.key).remove();
                  }
                })
              })
            })
          }).then(function () {
            firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").get().then(function (e) {
              e.val();
              firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").set(e.val() - 1);
            });
          }).then(function () {
            let temp = []
            temp = commentsLikedList
            temp.splice(temp.indexOf(item.item.comment_id), 1);
            setCommentsLikedList(temp);
          })
        }
        else if (commentsDisLikedList.includes(item.item.comment_id)) {
          comment_dislike_userlist.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              let email = childSnapshot.val().email;
              if (email == user_email)
                firebase.database().ref('comment_list/' + item.item.comment_id + "/dislike_userlist/" + childSnapshot.key).remove();
            })
          }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                let email = childSnapshot.val().email;
                if (email == user_email) {
                  user_disliked_list = firebase.database().ref("user_list/" + childSnapshot.key + "/comments_disliked_list");
                  userKey = childSnapshot.key;
                }
              })
            }).then(function () {
              user_disliked_list.once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                  if (item.item.comment_id == childSnapshot.val().comment_id) {
                    firebase.database().ref('user_list/' + userKey + "/comments_disliked_list/" + childSnapshot.key).remove();
                  }
                })
              })
            })
          }).then(function () {
            firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").get().then(function (e) {
              e.val();
              firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").set(e.val() - 1);
            });
          })

          comment_like_userlist.push({ email: user_email }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.email == user_email) {
                  let comments_liked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/comments_liked_list");
                  comments_liked_list.push({
                    comment_id: item.item.comment_id
                  })
                }
              })
            }).then(function () {
              firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").get().then(function (e) {
                e.val();
                firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").set(e.val() + 1);
              });
            })
          }).then(function () {
            let temp = []
            temp = commentsLikedList
            temp.push(item.item.comment_id)
            setCommentsLikedList(temp)
            let temp2 = []
            temp2 = commentsDisLikedList
            temp2.splice(temp2.indexOf(item.item.comment_id), 1);
            setCommentsDisLikedList(temp2)
          })
        }
        else {
          comment_like_userlist.push({ email: user_email }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.email == user_email) {
                  let comments_liked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/comments_liked_list");
                  comments_liked_list.push({
                    comment_id: item.item.comment_id
                  })
                }
              })
            }).then(function () {
              firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").get().then(function (e) {
                e.val();
                firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").set(e.val() + 1);
              });
            })
          }).then(function () {
            let temp = []
            temp = commentsLikedList
            temp.push(item.item.comment_id)
            setCommentsLikedList(temp)
          });
        }
      }

    }
    function commentDislike() {
      if (currUser) {
        let user_email = currUser.email;
        let user_list = firebase.database().ref("user_list");
        let comment_like_userlist = firebase.database().ref("comment_list/" + item.item.comment_id + "/like_userlist");
        let comment_dislike_userlist = firebase.database().ref("comment_list/" + item.item.comment_id + "/dislike_userlist");
        let user_liked_list = null;
        let user_disliked_list = null;
        let userKey = null;
        if (commentsDisLikedList.includes(item.item.comment_id)) {
          comment_dislike_userlist.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              let email = childSnapshot.val().email;
              if (email == user_email)
                firebase.database().ref('comment_list/' + item.item.comment_id + "/dislike_userlist/" + childSnapshot.key).remove();
            })
          }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                let email = childSnapshot.val().email;
                if (email == user_email) {
                  user_disliked_list = firebase.database().ref("user_list/" + childSnapshot.key + "/comments_disliked_list");
                  userKey = childSnapshot.key;
                }
              })
            }).then(function () {
              user_disliked_list.once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                  if (item.item.comment_id == childSnapshot.val().comment_id) {
                    firebase.database().ref('user_list/' + userKey + "/comments_disliked_list/" + childSnapshot.key).remove();
                  }
                })
              })
            })
          }).then(function () {
            firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").get().then(function (e) {
              e.val();
              firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").set(e.val() - 1);
            });
          }).then(function () {
            let temp = []
            temp = commentsDisLikedList
            temp.splice(temp.indexOf(item.item.comment_id), 1);
            setCommentsDisLikedList(temp);
          })
        }
        else if (commentsLikedList.includes(item.item.comment_id)) {
          comment_like_userlist.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              let email = childSnapshot.val().email;
              if (email == user_email)
                firebase.database().ref('comment_list/' + item.item.comment_id + "/like_userlist/" + childSnapshot.key).remove();
            })
          }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                let email = childSnapshot.val().email;
                if (email == user_email) {
                  user_liked_list = firebase.database().ref("user_list/" + childSnapshot.key + "/comments_liked_list");
                  userKey = childSnapshot.key;
                }
              })
            }).then(function () {
              user_liked_list.once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                  if (item.item.comment_id == childSnapshot.val().comment_id) {
                    firebase.database().ref('user_list/' + userKey + "/comments_liked_list/" + childSnapshot.key).remove();
                  }
                })
              })
            })
          }).then(function () {
            firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").get().then(function (e) {
              e.val();
              firebase.database().ref("comment_list/" + item.item.comment_id + "/likeNum").set(e.val() - 1);
            });
          })
          comment_dislike_userlist.push({ email: user_email }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.email == user_email) {
                  let comments_disliked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/comments_disliked_list");
                  comments_disliked_list.push({
                    comment_id: item.item.comment_id
                  })
                }
              })
            }).then(function () {
              firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").get().then(function (e) {
                e.val();
                firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").set(e.val() + 1);
              });
            }).then(function () {
              let temp = []
              temp = commentsDisLikedList
              temp.push(item.item.comment_id)
              setCommentsDisLikedList(temp)
              let temp2 = []
              temp2 = commentsLikedList
              temp2.splice(temp2.indexOf(item.item.comment_id), 1);
              setCommentsLikedList(temp2)
            })
          });
        }
        else {
          comment_dislike_userlist.push({ email: user_email }).then(function () {
            user_list.once('value').then(function (snapshot) {
              snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.email == user_email) {
                  let comments_disliked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/comments_disliked_list");
                  comments_disliked_list.push({
                    comment_id: item.item.comment_id
                  })
                }
              })
            }).then(function () {
              firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").get().then(function (e) {
                e.val();
                firebase.database().ref("comment_list/" + item.item.comment_id + "/dislikeNum").set(e.val() + 1);
              });
            })
          }).then(function () {
            let temp = []
            temp = commentsDisLikedList
            temp.push(item.item.comment_id)
            setCommentsDisLikedList(temp)
          });
        }
      }
    }

    let likeStat = 'none';
    if (commentsLikedList.includes(item.item.comment_id)) {
      likeStat = 'liked'
    } else if (commentsDisLikedList.includes(item.item.comment_id)) {
      likeStat = 'dislike'
    } else {
      likeStat = 'none'
    }

    return (
      <View style={styles.commentContainer}>
        <View style={{ height: 90, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <View style={{ height: 50, width: 50, marginLeft: 10 }}>
            <Image
              style={{ width: 50, height: 50, resizeMode: 'contain', flex: 1 }}
              source={require('../assets/account_default.png')}
            />
          </View>

        </View>
        <View style={{ display: 'flex', flexGrow: 6, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ minHeight: 80, width: '90%', backgroundColor: '#00C7DC', borderRadius: 10, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ height: 30, width: '90%', marginTop: 10 }}>
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '500' }}>
                {item.item.name} 說：
              </Text>
            </View>
            <View style={{ width: '90%' }}>
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '500' }}>{item.item.content}</Text>
            </View>
            <View style={{ height: 30, width: '100%', justifyContent: 'flex-end', marginBottom: 5 }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <View style={{ flex: 2 }}>

                </View>
                <TouchableOpacity
                  onPress={() => { commentLike() }}
                  style={styles.likes}>
                  <View style={{ marginRight: 5, width: 20, height: 20 }}>
                    <Image
                      source={require('../assets/like.png')}
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  </View>
                  <Text style={styles.likeTXT}>
                    {item.item.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={commentDislike}
                  style={styles.likes}>
                  <View style={{ marginRight: 5, width: 20, height: 20 }}>
                    <Image
                      source={require('../assets/dislike.png')}
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  </View>

                  <Text style={styles.likeTXT}>
                    {item.item.dislikes}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  function MainImage() {
    return (
      <Image source={{ uri: currImage ? currImage : 'https://i.imgur.com/QkPGFdF.jpeg' }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
    )
  }


  function itemLike() {
    if (currUser) {
      let user_email = currUser.email;
      let user_list = firebase.database().ref("user_list");
      let like_userlist = firebase.database().ref("item_list/" + currItem.id + "/like_userlist");
      if (likeOrDis === 'Like') {
        like_userlist.once('value').then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            let email = childSnapshot.val().email;
            if (email == user_email)
              firebase.database().ref('item_list/' + currItem.id + "/like_userlist/" + childSnapshot.key).remove();
          })
        }).then(function () {
          user_list.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              if (childData.email == user_email) {
                let user_liked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/liked_list");
                user_liked_list.once('value').then(function (s) {
                  s.forEach(function (c) {
                    let itemID = c.val().itemID;
                    if (itemID == currItem.id) {
                      firebase.database().ref('user_list/' + childSnapshot.key + "/liked_list/" + c.key).remove();
                    }
                  })
                }).then(function () {
                  firebase.database().ref("item_list/" + currItem.id + "/likeNum").get().then(function (e) {
                    firebase.database().ref("item_list/" + currItem.id + "/likeNum").set(e.val() - 1);
                  });
                  setLikeOrDis("none")
                })
              }
            })
          })
        })
      }
      if (likeOrDis === 'none') {
        like_userlist.push({
          email: user_email
        }).then(function () {
          user_list.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              if (childData.email == user_email) {
                let user_liked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/liked_list");
                user_liked_list.push({
                  itemID: currItem.id
                })
              }
            })
          })
        }).then(function () {
          firebase.database().ref("item_list/" + currItem.id + "/likeNum").get().then(function (e) {
            firebase.database().ref("item_list/" + currItem.id + "/likeNum").set(e.val() + 1);
          });
          setLikeOrDis("Like")
        })
      }
    }
    else {
      Alert.alert("錯誤", "請先登入才可使用此功能");
    }
  }

  function itemDislike() {
    if (currUser) {
      let user_email = currUser.email;
      let user_list = firebase.database().ref("user_list");
      let dislike_userlist = firebase.database().ref("item_list/" + currItem.id + "/dislike_userlist");
      if (likeOrDis === 'Dislike') {
        dislike_userlist.once('value').then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            let email = childSnapshot.val().email;
            if (email == user_email)
              firebase.database().ref('item_list/' + currItem.id + "/dislike_userlist/" + childSnapshot.key).remove();
          })
        }).then(function () {
          user_list.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              if (childData.email == user_email) {
                let user_disliked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/disliked_list");
                user_disliked_list.once('value').then(function (s) {
                  s.forEach(function (c) {
                    let itemID = c.val().itemID;
                    if (itemID == currItem.id) {
                      firebase.database().ref('user_list/' + childSnapshot.key + "/disliked_list/" + c.key).remove();
                    }
                  })
                }).then(function () {
                  firebase.database().ref("item_list/" + currItem.id + "/dislikeNum").get().then(function (e) {
                    firebase.database().ref("item_list/" + currItem.id + "/dislikeNum").set(e.val() - 1);
                  });
                  setLikeOrDis("none")
                })
              }
            })
          })
        })
      }
      if (likeOrDis === 'none') {
        dislike_userlist.push({
          email: user_email
        }).then(function () {
          user_list.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              if (childData.email == user_email) {
                let user_disliked_list = firebase.database().ref('user_list/' + childSnapshot.key + "/disliked_list");
                user_disliked_list.push({
                  itemID: currItem.id
                })
              }
            })
          })
        }).then(function () {
          firebase.database().ref("item_list/" + currItem.id + "/dislikeNum").get().then(function (e) {
            firebase.database().ref("item_list/" + currItem.id + "/dislikeNum").set(e.val() + 1);
          });
          setLikeOrDis("Dislike")
        })
      }
    }
    else {
      Alert.alert("錯誤", "請先登入才可使用此功能");
    }
  }

  function ListHeader() {
    return (
      <View style={styles.flatlistHeaderContainer}>
        <View style={{ backgroundColor: 'white', width: '90%', height: 350, borderRadius: 20 }}>
          <MainImage photourl={currImage} />
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 40, color: 'white', fontWeight: '700', marginTop: 15, maxWidth: '80%', overflow: 'scroll' }}>
            {currItem.name}
          </Text>
        </View>
        <View style={{ marginTop: 15, width: '80%', height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={itemLike}
            style={likeOrDis === 'Dislike' ? { display: 'none' } : { width: '40%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
              source={require('../assets/like.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={itemDislike}
            style={likeOrDis === 'Like' ? { display: 'none' } : { width: '40%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
              source={require('../assets/dislike.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={addToFavourite} style={{ marginTop: 15, width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '100%', height: 50, backgroundColor: '#7CAEDE', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ width: 50, height: 30 }}></View>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{is_favorite ? '已添加至我的最愛' : '添加至我的最愛'}</Text>
            <Image source={require('../assets/star_outline.png')} style={is_favorite ? { display: 'none' } : { marginLeft: 20, width: 30, height: 30, resizeMode: 'contain' }} />
            <Image source={require('../assets/star_filled.png')} style={is_favorite ? { marginLeft: 20, width: 30, height: 30, resizeMode: 'contain' } : { display: 'none' }} />
          </View>

        </TouchableOpacity>
        <View style={{ width: '100%', height: 50, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
            留言
          </Text>
        </View>
      </View>
    )
  }



  function getComment(item: any) {
    let comment_list: any = [];
    let current_item_comment = firebase.database().ref("item_list/" + item.id + "/comment_list");
    current_item_comment.once('value').then(
      function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          firebase.database().ref("comment_list/" + childData).get().then(
            function (e) {
              comment_list.push({ comment_id: e.key, ...e.val() });
            }
          );
        })

      }).then(() => {
        setCommentRefreshing(false)
        setItemComments(comment_list);
      }
      )
  }

  function addToFavourite() {
    if (currUser) {
      let user_email = currUser.email;
      let user_list = firebase.database().ref('user_list');
      user_list.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          if (childData.email == user_email) {
            let user_favorite_list = firebase.database().ref('user_list/' + childSnapshot.key + "/favorite_list");
            user_favorite_list.once('value').then(function (s) {
              s.forEach(function (c) {
                let itemID = c.val().itemID;
                if (itemID == currItem.id) {
                  firebase.database().ref('user_list/' + childSnapshot.key + "/favorite_list/" + c.key).remove();
                }
              })
            }).then(function () {
              if (!is_favorite) {
                user_favorite_list.push({
                  itemID: currItem.id
                })
                setIs_favorite(true);
                Alert.alert("添加成功", "成功添加至我的最愛");
              }
              else {
                setIs_favorite(false);
                Alert.alert("刪除成功", "成功從我的最愛中刪除");
              }
            })
          }
        })
      })

    }
    else {
      Alert.alert("添加失敗", "請先等入才可添加商品至最愛！");
    }
  }



  function sendMyComment() {
    if (currUser) {
      let user_email = currUser.email;
      let comment_list = firebase.database().ref('comment_list');
      comment_list.push({
        user_email: user_email,
        itemID: currItem.id,
        content: myComment,
        name: currUser.displayName
      }).then(async function (e) {
        let comment_id = e.path.pieces_[1];
        let user_list = firebase.database().ref('user_list');
        await user_list.once('value').then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.email == user_email) {
              firebase.database().ref("user_list/" + childSnapshot.key + "/comment_list").push(comment_id)
            }
          })
        })
        firebase.database().ref('item_list/' + currItem.id + "/comment_list").push(comment_id);
        firebase.database().ref('item_list/' + currItem.id + "/commentNum").get().then(function (e) {
          firebase.database().ref('item_list/' + currItem.id + "/commentNum").set(e.val() + 1);
        })
      }).then(function () {
        setMyComment("");
        getComment(currItem)
      })
    }
    else {
      Alert.alert("錯誤", "請先登入才可使用此功能");
      setMyComment("");
    }
  }


  return (
    <View>
      <KeyboardAvoidingView
        behavior={(Platform.OS === 'ios') ? "padding" : undefined} style={{ backgroundColor: '#DE75BE' }}>
        <View style={{ height: '100%', width: '100%', backgroundColor: '#DE75BE', alignItems: 'center', justifyContent: 'flex-start' }}>
          <View style={[styles.topContainer,]}>
            <TouchableOpacity style={styles.backButton} onPress={() => {
              navigation.navigate('HotMain')
              setLikeOrDis('none')
            }}>
              <Image
                style={[styles.backButton, { resizeMode: 'contain' }]}
                source={require('../assets/backarrow.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.flatList}>
            <FlatList
              data={itemComments}
              keyExtractor={item => item.comment_id.toString()}
              renderItem={CommentContainer}
              ListHeaderComponent={ListHeader}
              horizontal={false}
              onRefresh={() => getComment(currItem)}
              refreshing={commentRefreshing}
              contentContainerStyle={{
                paddingBottom: 200
              }}
              extraData={itemComments}
            />
          </View>
          <View style={{ position: 'absolute', bottom: 0, height: 100, width: '100%', backgroundColor: '#7CAEDE', display: 'flex', flexDirection: 'row' }}>
            <View style={{ width: '80%', height: 40, backgroundColor: 'white', borderRadius: 10, display: 'flex', justifyContent: 'center', margin: 10, marginTop: 20 }}>
              <TextInput
                value={myComment}
                onChangeText={setMyComment}
                style={{ marginLeft: 10, width: '95%', height: '90%', fontSize: 20, fontWeight: '500' }}
                placeholder="我想說⋯⋯"
              />
            </View>
            <TouchableOpacity
              onPress={sendMyComment}
              style={{ width: 40, height: 40, marginTop: 20 }}>
              <Image
                style={{ width: 40, height: 40, resizeMode: 'contain' }}
                source={require('../assets/send.png')} />

            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
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
