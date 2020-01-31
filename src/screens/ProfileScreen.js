// import React from 'react';
// import {View, Text, StyleSheet, Image, TextInput,
//          Button, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
// import logoPerson from '../../images/person.png';
// import * as firebase from "firebase";
// import Fire from './helpers/Fire';
// // import { User } from './helpers/User';


// export default class ProfileScreen extends React.Component{
//     static navigationOptions = ({navigation}) =>{
//         return{
//             title : 'Profile',
//         }
//     }
//     state = { email: "", displayName: "" };

//     componentDidMount() {
//         const { email, displayName } = firebase.auth().currentUser;
//         this.setState({ email, displayName });
//     }
//     // state ={
//     //     uid : User.uid,
//     //     name: User.name,
//     //     email: User.email
//     // }
    
//     // handleChange = key => val => {
//     //     this.setState({[key]:val})
//     // }

//     // changeProfil = async () => {
//     //     if(this.state.name.lenght<3){
//     //         Alert.alert('Error', 'Please enter valid name');
//     //     }else if(User.uid !== this.state.uid ){
//     //         firebase.database().ref('users').child(User.uid).set({
//     //             name : this.state.name,
//     //             email : this.state.email
//     //         });
//     //         User.name= this.state.name;
//     //         Alert.alert('Succes', 'Profil changed successful');
//     //     }
//     // }

//     render(){
//         // console.log(User)
//         return (
//             <View style={styles.container}>
//                 <View style={{marginTop: 24, alignItems: "center"}}>
//                     <View style={styles.avatarContainer}>
//                         <Image style={styles.avatar} source={logoPerson}/>
//                     </View>
//                     <Text style={styles.name}>{this.state.displayName}</Text>
//                 </View>
//                 <View>
//                     <KeyboardAvoidingView>
//                         <View style={styles.form}>
//                             <View>
//                                 <Text style={styles.inputTitle}>Nama Lengkap</Text>
//                                 <TextInput 
//                                 style={styles.input}
//                                 autoCapitalize="none"
//                                 value ={this.state.displayName}
//                                 // onChangeText = {this.handleChange('name')}
//                                 />
//                             </View>

//                             <View style={{marginTop: 32}}>
//                                 <Text style={styles.inputTitle}>Email Address</Text>
//                                 <TextInput 
//                                 style={styles.input}
//                                 autoCapitalize="none"
//                                 value ={this.state.email}
//                                 // onChangeText = {this.handleChange('email')}
//                                 />
//                             </View>
//                             <TouchableOpacity 
//                                 style={styles.btnUser} 
//                                 onPress={this.changeProfil}
//                             >
//                                 <Text style={{color:"#FFF", fontWeight: "500", fontSize:15}}> Change Profile</Text>
//                             </TouchableOpacity>
//                         </View> 
//                     </KeyboardAvoidingView>
//                     <TouchableOpacity 
//                         style={styles.button} 
//                         onPress={() => {
//                             Fire.shared.signOut();
//                         }}
//                     >
//                         <Text style={{color:"#FFF", fontWeight: "500", fontSize:15}}>Logout</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container:{
//         flex : 1
//     },
//     avatarContainer:{
//         shadowColor: "#151734",
//         shadowRadius: 30,
//         shadowOpacity : 0.4
//     },
//     avatar:{
//         width: 136,
//         height: 136,
//         borderRadius: 68
//     },
//     name:{
//         marginTop: 24,
//         fontSize : 16,
//         fontWeight : "600"
//     },
//     form:{
//         marginTop: 20,
//         marginBottom:20,
//         marginHorizontal:50
//     },
//     inputTitle: {
//         color: "#8A8F9E",
//         fontSize: 10,
//         textTransform: "uppercase"
//     },
//     input: {
//         borderBottomColor: "#8A8F9E",
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         height: 40,
//         fontSize: 15,
//         color: "#161F3D"
//     },
//     btnUser:{
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#1B4F72",
//         marginHorizontal: 50,
//         borderRadius: 4,
//         height: 32,
//         marginTop: 30
//     },
//     btnName:{
//         color: "red",
//         fontSize: 20,
//         fontWeight: "500",
//     },
//     button: {
//         marginHorizontal: 100,
//         backgroundColor: "#B03A2E",
//         borderRadius: 4,
//         height: 32,
//         alignItems: "center",
//         justifyContent: "center",
//     }
// })


import React from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  TextInput,
  BackHandler,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import Geocoder from 'react-native-geocoding';
import * as firebase from "firebase";
import Fire from './helpers/Fire';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      permissionsGranted: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
      location: [],
      photo: null,
      imageUri: null,
      imgSource: '',
      uploading: false,
      dialogVisible: false,
      city: '',
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  setDialogVisible(visible) {
    this.setState({dialogVisible: visible});
  }

  // {/* BACK HANDLER */}
  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  componentDidMount = async () => {
    console.log('ini uid', AsyncStorage.getItem('userid'));
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    const userEmail = await AsyncStorage.getItem('user.email');
    this.setState({userId, userName, userAvatar, userEmail});

    firebase
      .database()
      .ref(`/users/${userId}`)
      .on('value', snapshot => {
        let data = snapshot.val();
        let location = Object.values(data);
        this.setState({location});
      });
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  changeImage = async type => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) {
      console.log('camera');
      cameraPermission = await this.requestCameraPermission();
    } else {
      console.log('image');
      ImagePicker.showImagePicker(options, response => {
        ToastAndroid.show(
          'Wait a little bit, your photo is uploading',
          ToastAndroid.LONG,
        );
        let uploadBob = null;
        const imageRef = firebase
          .storage()
          .ref('avatar/' + this.state.userId)
          .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            return Blob.build(data, {type: `${response.mime};BASE64`});
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, {contentType: `${response.mime}`});
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            ToastAndroid.show(
              'Your cool photo is uploaded!',
              ToastAndroid.LONG,
            );
            firebase
              .database()
              .ref('users/' + this.state.userId)
              .update({photo: url});
            this.setState({userAvatar: url});
            AsyncStorage.setItem('user.photo', this.state.userAvatar);
          })

          .catch(err => console.log(err));
      });
    }
  };
  handleLogout = async () => {
    await AsyncStorage.getItem('userid')
      .then(async userid => {
        firebase.database().ref('users/' + userid).update({
          status: 'Offline',
        });
        await AsyncStorage.clear();
        firebase.auth().signOut();
        ToastAndroid.show('logout Successful', ToastAndroid.LONG);
        this.props.navigation.navigate('Login');
      })
      .catch(error => this.setState({errorMessage: error.message}));
  };

  render() {
    return (
      <>
        <View style={{height: 270}}>
          <Image source={{uri: this.state.userAvatar}} style={{height: 270}} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 28,
            marginTop: 45,
          }}>
          <View>
            <Text style={{fontSize: 16, color: 'grey', letterSpacing: 2}}>
              Full Name
            </Text>
            <Text
              style={{
                fontSize: 23,
                fontWeight: '500',
                letterSpacing: 1,
                color: '#404040',
              }}>
              {this.state.userName}
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}></View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 28,
            marginTop: 30,
          }}>
          <View>
            <Text style={{fontSize: 16, color: 'grey', letterSpacing: 2}}>
              Email
            </Text>
            <Text
              style={{
                fontSize: 23,
                fontWeight: '500',
                letterSpacing: 1,
                color: '#404040',
              }}>
              {this.state.userEmail}
            </Text>
          </View>
          <View style={{justifyContent: 'center'}}>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 28,
            marginTop: 30,
          }}>
        </View>
        <TouchableOpacity
          style={{
            width: 55,
            height: 55,
            borderRadius: 100,
            position: 'absolute',
            right: '5%',
            top: '31%',
          }}
          onPress={this.changeImage}>
          <Image
            source={require('../Assets/addimage.png')}
            style={{
              borderWidth: 3,
              borderColor: 'white',
              width: 55,
              height: 55,
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("SetProfileScreen")}>
          <Text style={{color: '#FFF', fontWeight: '400'}}> Change Profile </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.handleLogout}>
          <Text style={{color: '#FFF', fontWeight: '400'}}> Log Out </Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 150,
    backgroundColor: '#06adbd',
    borderRadius: 4,
    height: 52,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

