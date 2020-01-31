import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, 
        Image, KeyboardAvoidingView,PermissionsAndroid,
        ToastAndroid, Platform, ImageBackground} from "react-native";
import * as firebase from 'firebase';

import logoChat from '../../../images/chatseklogo.png';
import imageBg from '../../../images/bgImage.png';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

export default class RegisterScreen extends React.Component {
    static navigationOptions ={
        header: null,
    }
    constructor(props){
        super(props);
        this.isMounted = false;
        this.state = {
            name: "",
            email: "",
            password: "",
            errorMessage: null
        };
    }

    componentDidMount = async () =>{
        this.isMounted = true;
        await this.getLocation();
    }

    componentWillUnmount(){
        this.isMounted = false;
        Geolocation.clearWatch();
        Geolocation.stopObserving();
    }

    //Get location permissions
    hasLocationPermission = async () => {
        if(
            Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.version < 23)
        ){ return true }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
        
        if(hasPermission){ return true }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )

        if(status===PermissionsAndroid.RESULTS.GRANTED){return true}
        if(status===PermissionsAndroid.RESULTS.DENIED){
            ToastAndroid.show(
                'Location Permission Denied By User', ToastAndroid.LONG
            )
        }else if(status===PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN){
            ToastAndroid.show(
                'Location Permissions Revoked By User', ToastAndroid.LONG
            )
        }
        return false;
    }

    //Set Location
    getLocation = async () =>{
        const hasLocationPermission = await this.hasLocationPermission();
        if(!hasLocationPermission){
            return;
        }

        this.setState({loading:true},()=>{
            Geolocation.getCurrentPosition(
                position => {
                    this.setState({
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude,
                        loading : false
                    })
                },
                error => {
                    this.setState({errorMessage: error});
                },{
                    enableHighAccuracy : true,
                    timeout : 8000,
                    maximumAge : 8000,
                    distanceFilter : 50,
                    forceRequestLocation: true,
                }
            )
        })
    }
    

    handleRegister = async () => {
        const { name, email, password } = this.state;
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async response => {
            console.log('response', response)
            firebase.database().ref('/users/'+ response.user.uid).set({
                name: name,
                email: email,
                status: 'Online',
                latitude : this.state.latitude || null,
                longitude : this.state.longitude || null,
            })

            ToastAndroid.show('Login success', ToastAndroid.LONG);
            await AsyncStorage.setItem('userid', response.user.uid);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));

            // this.props.navigation.navigate('App')
        }).catch(error => {
            console.warn(error);
            this.setState({
                errorMessage: error.message,
                email: '',
                password: '',
            });
            ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={imageBg} style={styles.backgroundContainer}>
                    <View style={{marginTop: 54, alignItems: "center"}}>
                        <View style={styles.avatarContainer}>
                            <Image style={styles.avatar} source={logoChat}/>
                        </View>
                        <Text style={styles.greeting}>{`\nRegister to get started`}</Text>
                    </View>

                    <KeyboardAvoidingView>
                        <View style={styles.form}>
                            <View>
                                <Text style={styles.inputTitle}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    onChangeText={name => this.setState({name})}
                                    value={this.state.name}
                                ></TextInput>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.inputTitle}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    onChangeText={email => this.setState({email})}
                                    value={this.state.email}
                                ></TextInput>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.inputTitle}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    onChangeText={password => this.setState({password})}
                                    value={this.state.password}
                                ></TextInput>
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
                        <Text style={{ color: "#FFF", fontWeight: "500" }}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 20 }}
                    onPress={() => this.props.navigation.navigate("Login")}>
                        <Text style={{ color: "#414959", fontSize: 13 }}>
                            Have an account? <Text style={{ fontWeight: "500", color: "#5f9ea0" }}>  Login</Text>
                        </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroundContainer:{
        width: null,
        height: null,
    },
    greeting: {
        marginTop: 35,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    avatarContainer:{
        shadowColor: "#151734",
        shadowRadius: 30,
        shadowOpacity : 0.4,
    },
    avatar:{
        width: 160,
        height: 136,
        marginLeft:20
    },
    form: {
        marginBottom: 35,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        marginHorizontal: 40,
        backgroundColor: "#1B4F72",
        borderRadius: 4,
        height: 42,
        alignItems: "center",
        justifyContent: "center"
    }
});