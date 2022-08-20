import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput,Button, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
import Chat from './Chat';


export default class Home extends React.Component {
 constructor(props) {
   super(props);
   this.state = { text: '' };
 }

 render() {
   return (
     <View style={styles.container}>
        <ImageBackground style={styles.image} source={require('../assets/background-girl.png')}>
            <View styles={styles.box1}>
            <TextInput
            style={styles.input}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            placeholder='your name'
            ></TextInput>
               {/* Open chatroom, passing user name and background color as props */}
          <Pressable style={styles.button}
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
          >
            <Text style={styles.buttontext}>Start Chatting</Text>
          </Pressable>
            </View>
        </ImageBackground>
    </View>
    
   );
 }
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        justifyContent: 'center',
        fontFamily: "Cochin"
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        flexDirection: 'column',
        alignItems: 'center',
        
    },
      box1: {
      backgroundColor: "#FFFFFF",
      height: "46%",
      width: "88%",
      justifyContent: "space-around",
      alignItems: "center",
    },
  
    input: {
      height: 60,
      width: '88%',
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
      alignItems: "center"
    },

    inputText: {
        justifyContent:'center',
        fontSize: 20,
        fontWeight: "bold",
        height: 40,
        margin: 20,
        borderWidth: 1,
        paddingLeft: 100,
        paddingRight: 100,
        textAlignVertical: 'top',
        fontFamily: "Cochin"
    },
   button: {
      height: 50,
      width: '88%',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#FFC0CB',
    },
  
    buttontext: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    }
});