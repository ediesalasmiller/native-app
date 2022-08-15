import React from 'react';
import { View, Text } from 'react-native';
import { ImageBackground } from 'react-native-web';

export default class Chat extends React.Component {
    componentDidMount(){
        let name = this.props.route.params.name; // OR ... let { name } = this.props.route.params;
       //using the setOptions function of navigation prop to set the TITLE as the name
        this.props.navigation.setOptions({ title: name });
    }

    render() {

        return (
            <View>
             
            </View>
        );
    };
}