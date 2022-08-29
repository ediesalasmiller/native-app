import React from "react";
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, ImageBackground } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTimestamp } from "react-native-reanimated/lib/reanimated2/core";
import NetInfo from '@react-native-community/netinfo';
import CustomActions from "./CustomActions";


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
      user: {
        name: '',
        _id: '',
      },
      isConnected: false,
      image: null,
    };

    // Initialize Firebase
    if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

 //   mounting the system messages and messages in a componenetDidMount function
  // componentDidMount is a "lifecycle method". Lifecycle methods run the
  // function at various times during a component's "lifecycle". For example
  // componentDidMount will run right after the component was added to the page.
  componentDidMount() {
    //routing name from welcome screen
    let { name } = this.props.route.params;

        // Reference to load messages via Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
      } else {
        console.log('offline');
      }
    });

   this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
     if (!user) {
       firebase.auth().signInAnonymously();
     }
     this.setState({
       uid: user.uid,
       messages: [],
        user: {
        _id: user.uid,
        name: name,
      },
     });
    this.referenceMessagesUser = firebase
                .firestore()
                .collection("messages")
                .where("uid", '==', this.state.uid);
              // save messages when user online
                this.saveMessages();
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
   })
  }
 

  componentWillUnmount() {
      // this.unsubscribe();
      this.authUnsubscribe();
  }

    // Reading snapshot data of messages collection, adding messages to messages state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each doc
    querySnapshot.forEach((doc)=> {
        var data = doc.data();
        messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data._id,
              name: data.user.name
            },
            image: data.image,
        });
    });
    this.setState({
        messages,
    })
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      user: message.user,
      text: message.text,
      createdAt: message.createdAt,
      uid: this.state.uid,
      _id: message._id,
      image: message.image || null,
      location: message.location || null,
        })
  };
    //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };


  async getMessage() {
    let messages = '';
      try {
        messages = await AsyncStorage.getItem('messages') 
        || [];
        this.setState ({
          messages: JSON.parse(messages)
        });  
      }
      catch(error) {
        console.log(error.message)
      }
  }

   
  // firebase storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };


      //message sending function , take components previous state and appends new message to the messages object
  onSend (messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };


  // hide input filed when user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return(
        <InputToolbar {...props} />
      )
    }
  }

  // Customize the color of the sender bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#fafafa'
          },
          right: {
            backgroundColor: '#ADD8E6'
          },
        }}
      />
    )
  }

  renderCustomActions = (props) => < CustomActions {...props} />;

  //custom map view.. check if the currentMessage contains location data.
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView}
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.user.name
          }}
        />
          {/* fixing the keyboard on android from being */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>

       
    );
  }

}
