import React, {useState} from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import {map, size, filter } from 'lodash';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Modal from '../Modal';

/* Con esto conseguimos el ancho de la pantalla */
const widthScreen = Dimensions.get("window").width;


export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props

    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAddress, setRestaurantAddress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [imageSelected, setImageSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)

    console.log(imageSelected)

    const addRestaurant = () => {
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
    const {setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap} = props
    
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
                    color: "#c2c2c2",
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
    const { isVisibleMap, setIsVisibleMap } = props

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>

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
    }
})