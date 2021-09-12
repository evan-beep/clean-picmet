import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Start Screen</Text>
      <Button title="Nxt page" onPress={() => navigation.navigate('Home')}></Button>
    </View>
  )
}