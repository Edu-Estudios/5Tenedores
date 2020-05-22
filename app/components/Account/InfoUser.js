
import React from 'react';
import {StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function InfoUser(props) {
    const {userInfo, toastRef, setLoading, setLoadingText} = props
    const {photoURL, displayName, email} = userInfo

    console.log(userInfo)

    // Función para pedir los permisos
    const changeAvatar = async () => {
        // Con esto lanzamos el dialog de permitir o denegar los permisos
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status

        if (resultPermissionCamera === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galería")
        } else {
            // Si se acepta el permiso entonces se lanza la galería del teléfono
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            if (result.cancelled) {
                toastRef.current.show("Has cerrado la selección de imagenes")
            } else {
                uploadImage(result.uri).then(() => {
                    updatePhotoUrl()
                    toastRef.current.show("Imagen actualizada correctamente")
                }).catch(() => {
                    toastRef.current.show("Error al subir la imagen")
                })
            }
        }
    }

    // Función para subir la imagen
    const uploadImage = async (uri) => {
        setLoadingText("Actualizando avatar")
        setLoading(true)
        // Con esto conseguimos todos los datos de una imagen
        const response = await fetch(uri);
        // Con esto recuperamos los datos necesarios para subir la imagen a Firebase
        const blob = await response.blob();

        // Con esto subimos la imagen a firebase
        const ref = firebase.storage().ref().child(`avatar/${userInfo.uid}`)
        // Se hace return para que devuelva una promesa
        return ref.put(blob)
    }

    // Función para mostrar la foto de perfil
    const updatePhotoUrl = () => {
        // Devuelve la url de la imagen
        firebase.storage().ref(`avatar/${userInfo.uid}`).getDownloadURL().then(async (response) => {
            const update = {
                photoURL: response
            }
            // Con esto actualizamos la foto de perfil del usuario en Firebase
            await firebase.auth().currentUser.updateProfile(update)
            setLoading(false)
        }).catch(() => {
            toastRef.current.show("Error al actualizar la imagen de perfil")
        })
    }


    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
               source={
                photoURL ? {uri: photoURL} : require('../../../assets/img/avatar-default.jpg')
               }
            />
            <View>
                <Text style={styles.displayName}>{displayName ? displayName : "Anónimo"}</Text>
                <Text>{email ? email : "Social Login"}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})