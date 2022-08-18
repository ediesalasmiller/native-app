import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView, Text } from 'react-native';

//import firebase data storage
const firebase = require('firebase');
require('firebase/firestore');


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
            loggedInText: "Welcome to the chat room. You are now logged in.",
            user: {

            },
        };

        // Initialize Firebase
    if (!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
    }
    //referring to the document ID in the firebase store
    this.referenceChatMessages = firebase.firestore().collection("messages");
    }

      //message sending function , take components previous state and appends new message to the messages object
  onSend(messages = []) {
     this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  addMessage() {
    this.referenceChatMessages.add({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        uid: this.state.uid,
    })
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
            user: data.user,
        });
    });
    this.setState({
        messages,
    })
   }


//   mounting the system messages and messages in a componenetDidMount function
    componentDidMount() {
        this.referenceChatMessages = firebase
        .firestore()
        .collection("messages");


    //check if user is authorized anonymously
   this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
     if (!user) {
       firebase.auth().signInAnonymously();
     }



    //update user with newly logged in user
     this.setState({
       uid: user.uid,
       messages: [],
     });


     //create reference to current users active documents
     this.referenceChatMessages = firebase.firestore().collection("messages").where("uid", "===", this.state.uid)



    this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);

    
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: "Welcome to the chat room!",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: "React Native",
    //         avatar: "https://placeimg.com/140/140/any",
    //       },
    //     },
    //     {
    //         _id: 2,
    //         text: 'Last login { here } ',
    //         createdAt: new Date(),
    //         system: true,
    //     },  
    //   ],
    // });
   });
 }



  componentWillUnmount() {
    this.authUnsubscribe();
  };


  //changing the bubble color
    renderBubble(props) {
        return (
            <Bubble
            {...props}
            wrapperStyle={{
                right: {
                backgroundColor: '#000'
                }
            }}
            />
        )
    }

  render() {
    return (
        <View style={{ flex: 1 }}>
            <Text>{this.state.loggedInText}</Text>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                    _id: 1,
                    }}
                />
            {/* fixing the keyboard on android from being */}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
  }
}
