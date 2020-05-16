import firebase from 'firebase/app';

// Código sacado de la config del proyecto firebase
const FirebaseConfig = {
    apiKey: "AIzaSyAlH87USyhBvrWMoietx5x-983w5Y_ri0I",
    authDomain: "tenedores-e6fcf.firebaseapp.com",
    databaseURL: "https://tenedores-e6fcf.firebaseio.com",
    projectId: "tenedores-e6fcf",
    storageBucket: "tenedores-e6fcf.appspot.com",
    messagingSenderId: "328206384583",
    appId: "1:328206384583:web:6ef5041231f5ef7c13ede2"
};

export const firebaseApp = firebase.initializeApp(FirebaseConfig);