import React, {useState, useRef, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { Image, Icon, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';

import { firebaseApp } from '../utils/firebase';
import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp)

export default function Favorites(props) {
    const {navigation} = props

    const [restaurants, setRestaurants] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)

    const toastRef = useRef()

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            if (userLogged) {
                const idUser = firebase.auth().currentUser.uid
                db.collection("favourites").where("idUser", "==", idUser).get().then((response) => {
                    const idRestaurantsArray = []
                    response.forEach((doc) => {
                        console.log(doc.data())
                        idRestaurantsArray.push(doc.data().idRestaurant)
                    })
                    /* Como este método devuelve una promesa es obligatorio poner el "then" */
                    getDataRestaurant(idRestaurantsArray).then((response) => {
                        const restaurants = []
                        response.forEach((doc) => {
                            const restaurant = doc.data()
                            restaurant.id = doc.id
                            restaurants.push(restaurant)
                        })
                        setRestaurants(restaurants)
                    })
                })
            }
            setReloadData(false)
        }, [userLogged, reloadData])
    )

    const getDataRestaurant = (idRestaurantsArray) => {
        const arrayRestaurants = []
        idRestaurantsArray.forEach((idRestaurant) => {
            const result = db.collection("restaurants").doc(idRestaurant).get()
            arrayRestaurants.push(result)
        });
        /* Tiene que devolver una promesa para que la ejecución se pare hasta que se obtengan todos los datos de todos los restaurantes */
        return Promise.all(arrayRestaurants)
    }

    if (!userLogged) {
        return <UserNotLogged navigation={navigation} />
    }

    if (!restaurants) {
        return <Loading isVisible={true} text="Cargando restaurantes" />
    } else if (restaurants?.length === 0) {
        return <NotFoundRestaurants />
    }

    return(
        <View style={styles.viewBody}>
            {restaurants ? (
                <FlatList 
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} setIsLoading={setIsLoading} toastRef={toastRef} setReloadData={setReloadData} navigation={navigation}/>}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large">
                        <Text style={{textAlign: "center"}}>Cargando restaurantes</Text>
                    </ActivityIndicator>
                </View>
            )}
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text="Eliminando restaurante" isVisible={isLoading}/>
        </View>
    )
}

function NotFoundRestaurants() {
    /* alignItems centra horizontalmente y justifyContente verticalmente */
    return (
        <View style={{flex: 1, alignItems:"center", justifyContent:"center"}}>
            <Icon 
                type="material-community"
                name="alert-outline"
                size={50}
            />
            <Text style={{fontSize: 20, fontWeight:"bold"}}>No tienes restaurantes favoritos</Text>
        </View>
    )
}

function UserNotLogged(props) {
    const {navigation} = props

    /* Como la ventana de "login" está en un stack distinto al de favoritos es necesario indicar primero el stack y luego la screen que queremos de ese stack. 
    Esto pasa en la versión 5 de navigation */
    return (
        <View style={{flex: 1, alignItems:"center", justifyContent: "center"}}>
            <Icon 
                type="material-community"
                name="alert-outline"
                size={50}
            />
            <Text style={{fontWeight: "bold", fontSize:20, textAlign:"center"}}>Necesitas estar logueado para ver esta sección</Text>
            <Button 
                title="Ir al login"
                containerStyle={{marginTop: 20, width: "80%"}}
                buttonStyle={{backgroundColor: "#00a680"}}
                onPress={() => navigation.navigate("account", {screen:"login"})}
            />
        </View>
    )
}

function Restaurant(props) {
    const {restaurant, setIsLoading, toastRef, setReloadData, navigation} = props
    const {id, name, images} = restaurant.item

    const confirmRemoveFavourite = () => {
        Alert.alert(
            "Eliminar Restaurante de Favoritos",
            "¿Estás seguro de que quieres eliminar el restaurante de favoritos?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                }, 
                {
                    text: "Eliminar",
                    onPress: removeFavourite
                }
            ],
            { cancelable : false}
        )
    }

    const removeFavourite = () => {
        setIsLoading(true)
        db.collection("favourites").where("idRestaurant", "==", id).where("idUser", "==", firebase.auth().currentUser.uid).get().then((response) => {
            response.forEach((doc) => {
                const idFavourite = doc.id
                db.collection("favourites").doc(idFavourite).delete().then(() => {
                    setIsLoading(false)
                    toastRef.current.show("Restaurante eliminado de favoritos")
                    setReloadData(true)
                }).catch(() => {
                    setIsLoading(false)
                    toastRef.current.show("Error al eliminar el restaurante de favoritos")
                })
            })
        })
    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity onPress={() => navigation.navigate("restaurants", {screen: "restaurant", params: {id}})}>
                <Image 
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff" />}
                    source={
                        images[0] ? {uri: images[0]} : require("../../assets/img/original.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favourites}
                        onPress={confirmRemoveFavourite}
                        underlayColor="transparent"
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10
    },
    restaurant: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff"
    },
    name: {
        fontWeight: "bold",
        fontSize: 20
    },
    favourites: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100
    }
})