import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, ImageBackground } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTimestamp } from "react-native-reanimated/lib/reanimated2/core";
import NetInfo from '@react-native-community/netinfo';

//import firebase data storage
const firebase = require('firebase');
require('firebase/firestore');


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0huTyquGu2trRzuyOo-VMKWcE3RJwnAg",
  authDomain: "chat-app-30da6.firebaseapp.com",
  projectId: "chat-app-30da6",
  storageBucket: "chat-app-30da6.appspot.com",
  messagingSenderId: "868349973895",
  appId: "1:868349973895:web:43fe48d29ee4ae705faf22"
};


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
    };

    // Initialize Firebase
    if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each doc
    querySnapshot.forEach((doc)=> {
        var data = doc.data();
        messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
        });
    });
    this.setState({
        messages,
    })
   }


     //message sending function , take components previous state and appends new message to the messages object
  onSend(messages = []) {
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }), () => {
    this.saveMessages();
  });
  }

    addMessage(message) {
        this.referenceChatMessages.add({
            text: message.text,
            createdAt: message.createdAt,
            uid: this.state.uid,
            _id: message._id
        })
    };

   async getMessage() {
    let messages = '';
      try {
        messages = await AsyncStorage.getItem('messages') 
        || [];
        this.setState ({
          messages: JSON.stringify(messages)
        });  
      }
      catch(error) {
        console.log(error.message)
      }
   }

    async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
    }
    catch(error) {
        console.log(error.message)
      }
   }

   async deleteMessages() {
    try { 
      await AsyncStorage.removeItem('messages');
      this.setState({ 
        messages: []
      })
    }
    catch(error) {
      console.log(error.message)
    }
   }

//   mounting the system messages and messages in a componenetDidMount function

  componentDidMount() {
   this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
     if (!user) {
       firebase.auth().signInAnonymously();
     }
     this.setState({
       uid: user.uid,
       messages: [],
       loggedInText: "Hello there"
     });
     this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
   });
 }

  componentWillUnmount() {
      this.unsubscribe();
      this.authUnsubscribe();
  }


render() {

    <Text>{this.state.loggedInText}</Text>
    

    return (
            <View style={{flex: 1}}>
                <GiftedChat

                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                    _id: 1,
                    }}
                />
                {/* fixing the keyboard on android from being */}
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
    }
            </View>

       
    );
  }

}
