import React, {useState, useRef, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import { map } from 'lodash';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width

export default function Restaurant(props) {
    const {navigation, route} = props
    const {id, name} = route.params

    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)
    /* Para los restaurantes adds a favoritos */
    const [isFavourite, setIsFavourite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)

    const toastRef = useRef()

    navigation.setOptions({ title: name})

    // Para saber si el usuario está logueado o no
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            /* Recupera un elemento de la BBDD donde su id es igual al "doc(id)" */
            db.collection("restaurants").doc(id).get().then((response) => {
                const data = response.data()
                data.id = response.id
                setRestaurant(data)
                setRating(data.rating)
            })
        }, [])
    );

    useEffect(() => {
        if (userLogged && restaurant) {
            db.collection("favourites").where("idRestaurant", "==", restaurant.id).where("idUser", "==", firebase.auth().currentUser.uid).get().then((response) => {
                if (response.docs.length === 1) {
                    setIsFavourite(true)
                }
            })
        }
    }, [userLogged, restaurant])

    const addFavourite = () => {
        if (!userLogged) {
            toastRef.current.show("Para usar el sistema de favoritos tienes que estar logueado")
        } else {
            /* El objeto que se manda a la BBDD de firebase */
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id
            }

            db.collection("favourites").add(payload).then(() => {
                setIsFavourite(true)
                toastRef.current.show("Restaurante añadido a favoritos")
            }).catch(() => {
                toastRef.current.show("Error al añadir el restaurante a favoritos. Intentelo de nuevo más tarde")
            })
        }
    }

    const removeFavourite = () => {
        db.collection("favourites").where("idRestaurant", "==", restaurant.id).where("idUser", "==", firebase.auth().currentUser.uid).get().then((response) => {
            response.forEach((doc) => {
                const idFavourite = doc.id
                db.collection("favourites").doc(idFavourite).delete().then(() => {
                    setIsFavourite(false)
                    toastRef.current.show("Restaurante eliminado de la lista de favoritos")
                }).catch(() => {
                    toastRef.current.show("Error al eliminar el restaurante de favoritos")
                })
            })
        } )
    }
    
    if (!restaurant) return <Loading isVisible={true} text="Cargando..."/>

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavourite}>
                <Icon 
                    type="material-community"
                    name={isFavourite ? "heart" : "heart-outline"}
                    onPress={isFavourite ? removeFavourite : addFavourite}
                    color={isFavourite ? "#f00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <Carousel 
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant 
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo 
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast 
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const {name, description, rating} = props

    return(
        <View style={styles.viewRestaurantTitle}>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, address } = props

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null
        },
        {
            text: "111 222 333",
            iconName: "phone",
            iconType: "material-community",
            action: null
        },
        {
            text: "restaurante@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action: null
        }
    ]

    return(
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>Información sobre el restaurante</Text>
            <Map location={location} name={name} height={100}/>
            {map(listInfo, (item, index) => (
                <ListItem 
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#00a680"
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0,
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1
    },
    viewFavourite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 10,
        padding: 5,
        paddingLeft: 15
    }
})
