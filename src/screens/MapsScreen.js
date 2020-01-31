import React from 'react';
import * as firebase from 'firebase';
import {View, Text, StyleSheet, PermissionsAndroid, ToastAndroid,
        Platform, Dimensions, TouchableOpacity, Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import markerLocation from '../../images/markerLoc.png';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapsScreen extends React.Component{
    state ={
        mapRegion: null,
        latitude:0,
        longitude:0,
        userList:[],
        uid : null,
    }

    componentDidMount= async () => {
        await this.getUser();
        await this.getLocation();
    }

    getUser = async () =>{
        const uid = await AsyncStorage.getItem('userid');
        this.setState({uid:uid})
        firebase.database().ref('/users').on('child_added', result => {
            let dataUser = result.val();
            if(dataUser !== null && dataUser.id != uid){
                this.setState(prevDataUser => {
                    return {userList: [...prevDataUser.userList, dataUser]}
                })
            }
        })
    }

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

    getLocation = async () =>{
        const hasLocationPermission = await this.hasLocationPermission();
        if(!hasLocationPermission){
            return;
        }

        this.setState({loading:true},()=>{
            Geolocation.getCurrentPosition(
                position => {
                    let region = {
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude,
                        latitudeDelta : 0.00922,
                        longitudeDelta: 0.00421 * 1.5
                    }
                    this.setState({
                        mapRegion : region,
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

    render(){
        return (
            <View style={styles.container}>
                <MapView style={styles.map}
                    showsMyLocationButton={true}
                    showsIndoorLevelPicker={true}
                    // showsUserLocation={true}
                    // zoomControlEnabled={true}
                    // showsCompass={true}
                    showsTraffic={true}
                    region={this.state.mapRegion}
                    initialRegion={{
                    latitude: -7.755322,
                    longitude: 110.381174,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                    }}
                >
                    {this.state.userList.map(item => {
                        return (
                            <Marker
                                key={item.name}
                                title={item.name}
                                description={item.status}
                                draggable
                                coordinate={{
                                    latitude: item.latitude || 0,
                                    longitude: item.longitude || 0,
                                }}
                            >
                            <View>
                                <Image
                                    source={{uri: item.photo}}
                                    style={styles.ImagePin}
                                />
                                <Text>{item.name}</Text>
                            </View>
                        </Marker>
                        )
                    })}
                </MapView>
                <TouchableOpacity style={styles.markerLoc}  onPress={() => this.getLocation()}>
                    <Image source={markerLocation} style={styles.imageMarker}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    ImagePin:{
        width: 40, 
        height: 40, 
        borderRadius: 50
    },
    markerLoc:{
        width: 50, 
        height: 50, 
        borderRadius:100,
        backgroundColor: "#7FB3D5",
        position: 'absolute', 
        right: "6%", 
        top: "88%"
    },
    imageMarker:{
        width: 30,
        height: 30,
        borderRadius:100,
        margin:10
    }
})