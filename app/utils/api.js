import * as firebase from 'firebase';

// Función que permite hacer una reautenticación en firebase
export function reauthenticate(password) {
    const user = firebase.auth().currentUser

    const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    )
    return user.reauthenticateWithCredential(credentials)
}