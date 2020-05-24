import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import {map, size, filter } from 'lodash';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'random-uuid-v4';
import Modal from '../Modal';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import "firebase/storage";
import 'firebase/firestore';
// Inicialización de la BBDD de firebase
const db = firebase.firestore(firebaseApp)

/* Con esto conseguimos el ancho de la pantalla */
const widthScreen = Dimensions.get("window").width;


export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props

    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAddress, setRestaurantAddress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = () => {
        if (!restaurantName || !restaurantAddress || !restaurantDescription) {
            toastRef.current.show("Todos los campos son obligatorios")
        } else if (size(imageSelected) === 0) {
            toastRef.current.show("Es necesario adjuntar una imagen como mínimo")
        } else if (!locationRestaurant) {
            toastRef.current.show("Tienes que indicar la localización del restaurante")
        } else {
            setIsLoading(true)
            uploadImageStorage().then(response => {
                /* Se utiliza, si no está creada la crea primero, la colección de datos "restaurants" para indicar donde se irán guardando los restaurantes que se crean */
                db.collection("restaurants").add({
                    name: restaurantName,
                    address: restaurantAddress,
                    description: restaurantDescription,
                    location: locationRestaurant,
                    images: response,
                    rating: 0,
                    ratingTotal: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebase.auth().currentUser.uid
                }).then(() => {
                    setIsLoading(false)
                    navigation.navigate("restaurants")
                }).catch(() => {
                    setIsLoading(false)
                    toastRef.current.show("Error al subir el restaurante. Inténtelo más tarde")
                })
            })
        }
    }

    const uploadImageStorage = async () => {
        const imageBlob = []

        // Es necesario meterlo todo dentro de una promesa porque sino se haría el return antes de que se ejecutará todo el código del "map"
        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image)
                const blob = await response.blob()
                /* Se indica la carpeta del storage donde se van a ir guardando las imágenes. uuid() permite crear una nombre aleatorio para que no haya problemas de duplicidad en la BBDD */
                const ref = firebase.storage().ref("restaurants").child(uuid())
                await ref.put(blob).then(async (result) => {
                    await firebase.storage().ref(`restaurants/${result.metadata.name}`).getDownloadURL().then((photoUrl) => {
                        imageBlob.push(photoUrl)
                    })
                })
            })
        )
        
        return imageBlob
    }

    return(
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant 
                imageRestaurant={imageSelected[0]}
            />
            <FormAdd 
                setRestaurantName={setRestaurantName} 
                setRestaurantAddress={setRestaurantAddress} 
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage 
                toastRef={toastRef}
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}
            />
            <Button 
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map 
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props

    return(
        <View style={styles.viewPhoto}>
            <Image 
                source={imageRestaurant ? {uri: imageRestaurant} : require("../../../assets/img/original.png")}
                style={{width: widthScreen, height: 200}}
            />
        </View>
    )
}

function FormAdd(props) {
    const {setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap, locationRestaurant} = props
    
    return(
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={e => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input 
                placeholder="Descripción del restaurante"
                inputContainerStyle={styles.textArea}
                multiline={true}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props
    
    const [location, setLocation] = useState(null)

    useEffect(() => {
        /* Función asíncrona (el async), anónima (los primeros "()") y autoejecutable (los segundos "()") */
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            )

            const statusPermissions = resultPermissions.permissions.location.status

            if (statusPermissions !== "granted") {
                toastRef.current.show("Se han cancelado los permisos necesarios para acceder a la localización")
            } else {
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location)
        toastRef.current.show("Localización guardada correctamente")
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button 
                        title="Cancelar" 
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage(props) {
    const { toastRef, setImageSelected, imageSelected }  = props

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL)

        if(resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos para poder acceder a la galería")
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            
            if(result.cancelled) {
                toastRef.current.show("Se ha cancelado la selección de imágenes")
            } else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {
        const arrayImages = imageSelected

        Alert.alert(
            "Eliminar Imagen",
            "¿Estás seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            /* Salva todos los elementos del array que no coincidan con el indicado */
                            filter(arrayImages, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {cancelable: false}
        )
    }

    return(
        <View style={styles.viewImage}>
            {size(imageSelected) < 4 && (
                <Icon 
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            
            {map(imageSelected, (imageRestaurant, index) => (
                <Avatar 
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageRestaurant}}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
        width: 150
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
        width: 150
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})