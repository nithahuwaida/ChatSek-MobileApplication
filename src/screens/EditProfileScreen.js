import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity,TextInput,
        ToastAndroid, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from 'firebase';

export default class EditProfileScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user: null,
            name : null,
            email: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }  

    componentDidMount = async() => {
        const userId = await AsyncStorage.getItem('userid');
        const name = await AsyncStorage.getItem('user.name');
        const email = await AsyncStorage.getItem('user.email');
        this.setState({email, name, userId })
    }

    handleChange = key => value => {
        this.setState({[key]:value})
        console.log('key',key)
        console.log('value', value)
        
        console.log('name', this.state.userId)
    }

    handleUpdateProfile = () => {
        const { email, name, userId} = this.state;
        console.log(email)
        console.log(name)
        console.log(userId)
        firebase.database().ref('users'+ userId).update({
            name : name,
            email : email
        }).then( async ()=>{
            ToastAndroid.show('Update Success', ToastAndroid.LONG);
            await AsyncStorage.setItem('user.email', email);
            await AsyncStorage.setItem('user.name', name);
        }).catch(error => {
            console.warn(error);
            ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });      
    };

    render(){
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView>
                    <View style={styles.form}>
                        <View>
                            <Text style={styles.textTitle}>Nama Lengkap</Text>
                            <TextInput 
                            style={styles.input}
                            autoCapitalize="none"
                            defaultValue={this.state.name}
                            onChangeText = {this.handleChange('name')}
                            />
                        </View>

                        <View style={{marginTop: 32}}>
                            <Text style={styles.textTitle}>Email Address</Text>
                            <TextInput 
                            style={styles.input}
                            autoCapitalize="none"
                            defaultValue={this.state.email}
                            onChangeText = {this.handleChange('email')}
                            />
                        </View>
                        <TouchableOpacity 
                            style={styles.btnUser}
                            onPress={this.handleUpdateProfile}
                        >
                            <Text style={{color:"#FFF", fontWeight: "500", fontSize:18}}> Save</Text>
                        </TouchableOpacity>
                    </View> 
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor: "#D4E6F1",
    },
    form:{
        marginBottom:40,
        marginHorizontal:30,
        marginTop: 60
    },
    textTitle: {
        color: "#8A8F9E",
        fontSize:16,
        letterSpacing:2
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D",
    },
    btnUser:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1B4F72",
        marginHorizontal: 50,
        borderRadius: 4,
        height: 32,
        marginTop: 30
    },
})