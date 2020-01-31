import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import * as firebase from 'firebase';
import logoChat from '../../images/chatseklogo.png';

export default class LoadingScreen extends React.Component{
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user=> {
            this.props.navigation.navigate(user ? "App" : "Auth");
        });
    }
    
    render(){
        return(
            <View style={styles.container}>
                <Image source={logoChat} style={styles.logoChatSek}/>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#1B4F72'
    },
    logoChatSek :{
        width:200,
        height: 170
    }
})