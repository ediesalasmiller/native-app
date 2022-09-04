import React from "react";
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';


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

  componentDidMount() {
    //routing name from welcome screen
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
        // Reference to load messages via Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    //netinfo checks if the user is offline or onliner
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
          //must set the state of isConnected when connecting the server to true. 
        this.setState({
          isConnected: true,
        })

        //reference to load the messages from firebase
          this.referenceMessagesUser = firebase
                    .firestore()
                    .collection("messages")
                    .where("uid", '==', this.state.uid);
                  // save messages when user online
                    this.saveMessages();

        //authenticate the user anonymously
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

          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        })
      } else {
          this.setState({
            isConnected: false,
          });
          //offline but still showing messages when offline.
          this.getMessage
        }
    });
  }
 

  componentWillUnmount() {
    if (this.isConnected){
      this.unsubscribe();
      this.authUnsubscribe();
    }
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

  async addMessage() {
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
  saveMessages = async () =>{
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
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
        this.addMessage(this.state.messages[0]);
        this.saveMessages();
        this.deleteMessages()
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

  renderCustomActions = (props) => <CustomActions {...props} />;


  render() {
    
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
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
