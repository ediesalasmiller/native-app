import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

//   mounting the system messages and messages in a componenetDidMount function

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Welcome to the chat room!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
            _id: 2,
            text: 'Last login { here } ',
            createdAt: new Date(),
            system: true,
        },  
      ],
    });
  }

    //message sending function , take components previous state and appends new message to the messages object
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

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
