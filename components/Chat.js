import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, ImageBackground } from 'react-native';

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
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
        this.addMessage(this.state.messages[0]);
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
