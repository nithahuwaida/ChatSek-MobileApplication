import React from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, 
        FlatList, KeyboardAvoidingView} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import * as firebase from "firebase";

export default class ChatScreen extends React.Component{
    static navigationOptions = ({navigation})=>{
        return {
            title : navigation.getParam('name'),
            headerLeft: <TouchableOpacity onPress={() => navigation.goBack(null)}></TouchableOpacity>
        }
    }

    constructor(props){
        super(props);
        this.state ={
            person:{
                name: props.navigation.getParam('name'),
                uid: props.navigation.getParam('uid'),
            },
            textMessage: '',
            messageList : ''
        }
    }

    componentWillMount(){
        const User = firebase.auth().currentUser;
        firebase.database().ref('messages').child(User.uid).child(this.state.person.uid)
        .on('child_added', (value)=>{
            this.setState((prevState)=>{
                return{
                    messageList:[...prevState.messageList, value.val()]
                }
            })
        })
    }
    
    handleChange = key => val => {
        this.setState({ [key] : val })
    }

    convertTime = (time) =>{
        let d = new Date(time);
        let c = new Date();

        let result = ( d.getHours()< 10? '0' : '' ) + d.getHours() + ':';
        result += ( d.getMinutes() < 10 ? '0' : '' ) + d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result = d.getDay()+ '-' + d.getMonth() + '-' + d.getFullYear() + '   (' + result + ')';
        }
        return result;
    }

    sendMessage = async () =>{
        if(this.state.textMessage.length > 0){
            const User = firebase.auth().currentUser;
            let msgId = firebase.database().ref('messages')
            .child(User.uid).child(this.state.person.uid)
            .push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.uid,
            }
            updates['messages/'+User.uid+'/'+this.state.person.uid+'/'+msgId] = message;
            updates['messages/'+this.state.person.uid+'/'+User.uid+'/'+msgId] = message;
            firebase.database().ref().update(updates);
            this.setState({ textMessage: '' });
        }
    }

    renderRow=({item}) => {
        const User = firebase.auth().currentUser;
        return(
            <View 
                style ={{
                    flexDirection:'row',
                    width:'60%',
                    alignSelf: item.from===User.uid ? 'flex-end' : 'flex-start',
                    backgroundColor : item.from===User.uid ? '#00897b' : '#7cb342',
                    borderRadius: 5,
                    marginBottom : 10
                }}
            >
                <Text style={{color:'#fff', padding:7, fontSize:16}}>
                    {item.message}
                </Text>
                <Text style={{color:'#eee', padding:3, fontSize:12}}>{this.convertTime(item.time)}</Text>
            </View>
        )
    }

    render(){
        let {height, width} = Dimensions.get('window');
        return(
            <SafeAreaView>
                <FlatList
                    style={{padding:10, height: height * 0.7}}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                />
                <KeyboardAvoidingView>
                    <View style={{flexDirection:'row', alignItems:'center', marginHorizontal: 5}}>
                        <TextInput
                            style ={styles.input}
                            value ={this.state.textMessage}
                            placeholder = "Type message...."
                            onChangeText = {this.handleChange('textMessage')}
                        />
                        <TouchableOpacity onPress={this.sendMessage} style={{paddingBottom:10,marginLeft:5}}>
                            <Text style={styles.btnText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor: '#F5FCFF'
    },
    input:{
        padding: 10,
        borderWidth: 1,
        borderColor : '#ccc',
        width : '80%',
        marginBottom : 10,
        borderRadius : 5
    },
    btnText:{
        color : 'darkblue',
        fontSize : 20
    }

})