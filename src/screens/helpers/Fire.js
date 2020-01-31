import FirebaseKeys from "./config";
import { Alert } from 'react-native';
import * as firebase from "firebase";

class Fire {
    constructor() {
        firebase.initializeApp(FirebaseKeys);
    }

    signOut = () => {
        firebase.auth().signOut();
    };
}

Fire.shared = new Fire();
export default Fire;