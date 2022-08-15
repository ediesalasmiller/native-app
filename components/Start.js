import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput,Button, ImageBackground } from 'react-native';
import Chat from './Chat';


export default class Home extends React.Component {
 constructor(props) {
   super(props);
   this.state = { text: '' };
 }

 render() {
   return (
     <View style={styles.container}>
        <ImageBackground style={styles.image} source={require('../assets/Background-Image.png')}>
            <TextInput
            style={styles.inputText}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            placeholder='Your Name'
            />
             <Button
            style={styles.button}
            title ="Begin Chatting"
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
            />
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
        fontSize: 16,
        fontWeight: 300,
        color: '#757083',
        opacity: '100%',
        fontFamily: "Cochin",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
  }
});