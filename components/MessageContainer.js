import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue' }, right: {} }}
  />
);

export const renderBubble = (props) => (
  <Bubble
    {...props}
    containerStyle={{
      left: { borderColor: 'teal', borderWidth: 1 },
      right: {},
    }}
    wrapperStyle={{
      left: { borderColor: 'tomato', borderWidth: 1 },
      right: {},
    }}
    bottomContainerStyle={{
      left: { borderColor: 'purple', borderWidth: 1 },
      right: {},
    }}
    tickStyle={{}}
    usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    containerToNextStyle={{
      left: { borderColor: 'navy', borderWidth: 1 },
      right: {},
    }}
    containerToPreviousStyle={{
      left: { borderColor: 'mediumorchid', borderWidth: 4 },
      right: {},
    }}
  />
);

// export const renderSystemMessage = (props) => (
//   <SystemMessage
//     {...props}
//     containerStyle={{ backgroundColor: 'pink' }}
//     wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
//     textStyle={{ color: 'crimson', fontWeight: '900' }}
//   />
// );

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'white' },
      right: { backgroundColor: '#b0e0e6' },
    }}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: 'white' },
      right: { backgroundColor: '#194751' },
    }}
    textStyle={{
      left: { color: 'red' },
      right: { color: 'white' },
    }}
    linkStyle={{
      left: { color: 'orange' },
      right: { color: 'orange' },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 24 }}
  />
);

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);