import react from 'react';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// import the start page and chat page
import Home from './components/Start';
import Chat from './components/Chat';
// Create the navigator

export default function App() {
  const Stack = createStackNavigator();
  return (
    <View style= {styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
          
            name="Welcome"
            component={Home}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    fontFamily: "Cochin"
  },
});
