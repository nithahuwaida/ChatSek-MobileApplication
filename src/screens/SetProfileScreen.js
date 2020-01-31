import React from 'react';
import {View, Text, StyleSheet, Image, TextInput,
        TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import * as firebase from "firebase";


export default class SetProfileScreen extends React.Component{
    static navigationOptions = ({navigation}) =>{
        return{
            title : 'Profile',
        }
    }
    state = { email: "", displayName: "" };

    componentDidMount() {
        const { email, displayName } = firebase.auth().currentUser;
        this.setState({ email, displayName });
    }
    
    handleChange = key => val => {
        this.setState({[key]:val})
    }

    changeProfil = async () => {
        if(this.state.name.lenght<3){
            Alert.alert('Error', 'Please enter valid name');
        }else if(User.uid !== this.state.uid ){
            firebase.database().ref('users').child(User.uid).set({
                name : this.state.name,
                email : this.state.email
            });
            User.name= this.state.name;
            Alert.alert('Succes', 'Profil changed successful');
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View>
                    <KeyboardAvoidingView>
                        <View style={styles.form}>
                            <View>
                                <Text style={styles.inputTitle}>Nama Lengkap</Text>
                                <TextInput 
                                style={styles.input}
                                autoCapitalize="none"
                                value ={this.state.displayName}
                                onChangeText = {this.handleChange('name')}
                                />
                            </View>

                            <View style={{marginTop: 32}}>
                                <Text style={styles.inputTitle}>Email Address</Text>
                                <TextInput 
                                style={styles.input}
                                autoCapitalize="none"
                                value ={this.state.email}
                                onChangeText = {this.handleChange('email')}
                                />
                            </View>
                            <TouchableOpacity 
                                style={styles.btnUser} 
                                onPress={this.changeProfil}
                            >
                                <Text style={{color:"#FFF", fontWeight: "500", fontSize:15}}> Change Profile</Text>
                            </TouchableOpacity>
                        </View> 
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex : 1
    },
    avatarContainer:{
        shadowColor: "#151734",
        shadowRadius: 30,
        shadowOpacity : 0.4
    },
    avatar:{
        width: 136,
        height: 136,
        borderRadius: 68
    },
    name:{
        marginTop: 24,
        fontSize : 16,
        fontWeight : "600"
    },
    form:{
        marginTop: 20,
        marginBottom:20,
        marginHorizontal:50
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
    btnUser:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1B4F72",
        marginHorizontal: 50,
        borderRadius: 4,
        height: 32,
        marginTop: 30
    },
    btnName:{
        color: "red",
        fontSize: 20,
        fontWeight: "500",
    },
    button: {
        marginHorizontal: 100,
        backgroundColor: "#B03A2E",
        borderRadius: 4,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    }
})