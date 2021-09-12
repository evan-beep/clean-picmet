import * as React from 'react';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import { View, Button, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { Modal, Portal, Provider, Text } from 'react-native-paper';


const DATA = [
  { id: 1, name: 'kajhdas', likes: '121', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 2, name: 'bruh', likes: '122', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 3, name: 'kkkk', likes: '125', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 4, name: 'aoskdpa', likes: '212', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 5, name: 'somethign', likes: '94', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 6, name: 'chekc', likes: '10', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 7, name: '已經沒有囉', likes: '10', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },

];

const COMMENTS = [
  { id: 1, userID: 'player1', itemID: 'kke', content: 'kajhdas', likes: '121', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 2, userID: 'player2', itemID: 'kke', content: 'bruh', likes: '122', dislikes: '3', comments: '10', imageURL: '../assets/london.png' },
  { id: 3, userID: 'player3', itemID: 'kke', content: 'kkkk', likes: '125', dislikes: '3', comments: '10', imageURL: '../assets/london.png' },
  { id: 4, userID: 'player4', itemID: 'kke', content: 'aoskdpa', likes: '212', dislikes: '3', comments: '10', imageURL: "https://i.imgur.com/I7zVE7v.jpeg" },
  { id: 5, userID: 'player5', itemID: 'kke', content: 'somethignsakdjfhaslfdjhli ishfiush osah ilshdfliauhfl s diufhalsifdusl sdiufhsiu fhsif sid hdiu shfi', likes: '94', dislikes: '3', comments: '10', imageURL: '../assets/london.png' },
  { id: 6, userID: 'player6', itemID: 'kke', content: '已經沒有囉', likes: '10', dislikes: '3', comments: '10', imageURL: '../assets/london.png' },
];




export default function Favourites({ navigation }: { navigation: any }) {
  const showModal = (item: any) => {
    setCurrItem(item.item.name)
    setVisible(true);
  };
  const hideModal = () => setVisible(false);
  const [visible, setVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currItem, setCurrItem] = React.useState('Surface Pro 7');
  const [myComment, setMyComment] = useState('');




  function removeFromFavourites() {

  }

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => showModal(item)}
        style={{
          width: Dimensions.get('screen').width * 0.95,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          height: 160,
          marginBottom: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
        }}>
        <View style={{
          width: '40%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 10,
          borderColor: '#DE75BE'
        }}>
          <Image
            source={{ uri: item.item.imageURL }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </View>
        <View style={{ width: '50%', height: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', }}>
          <View style={{ width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 30, color: '#DE75BE', fontWeight: '600' }}>
              {item.item.name}
            </Text>
          </View>

          <TouchableOpacity
            style={{ width: '80%', height: '35%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#DE75BE', borderRadius: 10 }}
          >
            <Text style={{ fontSize: 20, color: 'white', fontWeight: '600' }}>
              解除最愛
            </Text>
            <Image
              source={require('../assets/star_filled.png')} style={{ marginLeft: 20, width: 30, height: 30, resizeMode: 'contain' }}

            />
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    )

  }

  const ListHeader = () => {
    return (
      <View style={styles.flatlistHeaderContainer}>
        <View style={{ backgroundColor: 'white', width: '90%', height: 350, borderRadius: 20 }}>
          <Image source={{ uri: DATA[0].imageURL }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 40, color: 'white', fontWeight: '700', marginTop: 15 }}>
            {currItem}
          </Text>
        </View>
        <TouchableOpacity onPress={removeFromFavourites} style={{ marginTop: 15, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', height: 50, backgroundColor: '#7CAEDE', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>添加至我的最愛</Text>
          </View>
          <Image source={require('../assets/star_outline.png')} style={{ position: 'absolute', right: 80, width: 30, height: 30, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <View style={{ width: '100%', height: 50, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
            留言
          </Text>
        </View>
      </View>
    )
  }

  const mainHeader = () => {
    return (
      <Text style={{ fontSize: 30, color: 'white', fontWeight: '800', width: '50%' }}>
        我的最愛
      </Text>
    )
  }

  const CommentContainer = (item: any) => {
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
                {item.item.userID} 說：
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
                  onPress={() => { }}
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
                  onPress={() => { }}
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
            style={{
              width: '100%',
            }}
            data={DATA}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={mainHeader}
            ListHeaderComponentStyle={{ width: '90%', height: 60, alignItems: 'flex-start', justifyContent: 'center' }}
            renderItem={renderItem}
            horizontal={false}
            contentContainerStyle={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 120,
            }}
          />
        </View>

        <Portal>
          <Modal style={{ marginTop: 0, marginBottom: 0 }} visible={visible} onDismiss={hideModal}>
            <KeyboardAvoidingView
              behavior={(Platform.OS === 'ios') ? "padding" : undefined} style={{ backgroundColor: '#DE75BE' }}>
              <View style={{ height: '100%', width: '100%', backgroundColor: '#DE75BE', alignItems: 'center', justifyContent: 'flex-start' }}>
                <View style={[styles.topContainer,]}>
                  <TouchableOpacity style={styles.backButton} onPress={hideModal}>
                    <Image
                      style={[styles.backButton, { resizeMode: 'contain' }]}
                      source={require('../assets/backarrow.png')} />
                  </TouchableOpacity>
                </View>
                <View style={styles.flatList}>
                  <FlatList
                    data={COMMENTS}
                    keyExtractor={item => item.id.toString()}
                    renderItem={CommentContainer}
                    ListHeaderComponent={ListHeader}
                    horizontal={false}
                    contentContainerStyle={{
                      paddingBottom: 200
                    }}
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
                    onPress={() => { }}
                    style={{ width: 40, height: 40, marginTop: 20 }}>
                    <Image
                      style={{ width: 40, height: 40, resizeMode: 'contain' }}
                      source={require('../assets/send.png')} />

                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </Portal>
      </View>
    </Provider>
  )
}




const styles = StyleSheet.create({
  itemBlock: {
    width: '47%',
    display: 'flex',
    height: 260,
    backgroundColor: '#DE75BE',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
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
    height: 550,
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
  }

})
