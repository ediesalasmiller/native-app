
//  import PropTypes
import PropTypes from "prop-types";
//import react
import React from "react";
//import necessary components from react-native
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//import locations and image finder (permissions within API , permission API is deprecated)
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";


//connect action sheet
import { connectActionSheet } from '@expo/react-native-action-sheet';

import firebase from 'firebase';
import firestore from 'firebase';



//import firebase
// const firebase = require("firebase");
// require("firebase/firestore");

class CustomAction extends React.Component {
  
  async pickImage() {
    // expo permission
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    try {
      if (status === "granted") {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        // if not cancelled, uplaod + send images
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);

          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //UPLOAD TO FIREBASE, convert to blob, collection of binary data stored in db
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };


 //take photo with device camera
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 //get location of user w GPS
  async getLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({})

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  //HANDLES COMMUNICATION FEATURES
 
  onActionPress = () => {
    
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];

    const cancelButtonIndex = options.length - 1;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.pickImage();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
          case 3:
            console.log("user canceled list")
        }
      }
    );
  };

  //render function
  render() {
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="More options"
          accessibilityHint="allows you choose to send an image or your geolocation."
          style={[styles.container]}
          onPress={this.onActionPress}
        >
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </TouchableOpacity>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});


CustomAction.contextTypes = {
  actionSheet: PropTypes.func,
};

const CustomActions = connectActionSheet(CustomAction);

export default CustomActions;