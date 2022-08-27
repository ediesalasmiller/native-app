import React from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, Image, Pressable } from 'react-native';


export default class Home extends React.Component {
 constructor(props) {
   super(props);
   this.state = { name: '' };
 }


  
 render() {
   return (
     <ImageBackground style={styles.image} source={require('../assets/background-girl.png')}>
        <View style={styles.container}>
              <Image
                source={require("../assets/signup.png")}
                style={styles.imageStyle}
              />
            
                <TextInput
                style={styles.input}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                placeholder='your name'
                 />

                {/* Open chatroom, passing user name and background color as props */}
                <Pressable style={styles.button}
                    onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}>
                    <Text style={styles.buttontext}>Start Chatting</Text>
                </Pressable>
            
        </View>
    </ImageBackground>
    
   );
 }
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
    image: {
        flex: 1,
        resizeMode: 'cover',
        flexDirection: 'column',
        alignItems: 'center',
        
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
     
    },
  
    buttontext: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
     imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignItems: "center",
  },
});