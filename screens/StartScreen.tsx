import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }: { navigation: any }) {
  useEffect(() => {
    setTimeout(() => { navigation.navigate('Home') }, 500);
  }, [])
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Start Screen</Text>
      <Button title="Nxt page" onPress={() => navigation.navigate('Home')}></Button>
    </View>
  )
}