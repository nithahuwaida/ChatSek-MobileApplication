import React from 'react';
import {Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import * as firebase from "firebase";
import SafeAreaView from 'react-native-safe-area-view';


export default class HomeScreen extends React.Component{
    state ={
        users: []
    }

    componentWillMount(){
        let dbRef = firebase.database().ref('users');
        const User = firebase.auth().currentUser;
        // console.log('User User',User)
        // console.log('UserDIsplay',User.displayName)
        dbRef.on('child_added', (val)=>{
            let person = val.val();
            person.uid = val.key;
            if(person.uid === User.uid){
                User.name = person.name
            }else{
                this.setState((prevState) =>{
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    renderRow=({item}) => {
        return (
            <TouchableOpacity 
                style={{padding:10, borderBottomColor:'#ccc', borderBottomWidth:1}}
                onPress={()=> this.props.navigation.navigate('Chat', item)}
            >
                <Text style={{fontSize:20}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    render(){
        return (
            <SafeAreaView>
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.uid}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    }
})