import React, {useState,useEffect, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import {firebaseApp} from "../../utils/firebase"
import firebase from 'firebase/app';
import "firebase/firestore";
import ListRestaurants from '../../components/Restaurants/ListRestaurants';

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
    const { navigation } = props

    const [user, setUser] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [totalRestaurants, setTotalRestaurants] = useState(0)
    const [startRestaurants, setStartRestaurants] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const limitRestaurants = 10

    // Para comprobar si el usuario esta logueado o no
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo)
        })
    }, [])

    /* El useFocusEffect permite que se pueda ejecutar el código cada vez que se navega a esta página de la app */
    useFocusEffect(
        /* El useCallback es obligatorio. La estructura es igual a la de un useEffect */
        useCallback(() => {
            db.collection("restaurants").get().then((snap) => {
                setTotalRestaurants(snap.size)
            })
    
            const resultRestaurants = []
    
            // Se van a obtener 10 restaurantes (limitRestaurants) ordenados por la fecha de creación
            db.collection("restaurants").orderBy("createAt", "desc").limit(limitRestaurants).get().then((response) => {
                // Se almacena el último restaurante para que cuando se quieran cargar los 10 siguientes se sepa cuál ha sido el último mostrado
                setStartRestaurants(response.docs[response.docs.length - 1])
    
                response.forEach((doc) => {
                    const restaurant = doc.data()
                    // Se le añade la propiedad "id" al objeto "restaurant" creado justo arriba
                    restaurant.id = doc.id
                    resultRestaurants.push(restaurant)
                })
                setRestaurants(resultRestaurants)
            })
        }, [])
    )

    // Función utilizada para ir cargando nuevos restaurantes. Con esto se consigue que la lista esté paginada
    const handleLoadMore = () => {
        const resultRestaurants = []

        /* El setIsLoading se utiliza para ver si quedan más restaurantes que cargar o no */
        restaurants.length < totalRestaurants && setIsLoading(true)

        db.collection("restaurants").orderBy("createAt", "desc").startAfter(startRestaurants.data().createAt).limit(limitRestaurants).get().then((response) => {
            if (response.docs.length > 0) {
                setStartRestaurants(response.docs[response.docs.length - 1])
            } else {
                setIsLoading(false)
            }

            response.forEach((doc) => {{
                const restaurant = doc.data()
                restaurant.id = doc.id
                resultRestaurants.push(restaurant)
            }})
            // Une los datos que ya había con los nuevos
            setRestaurants([...restaurants, ...resultRestaurants])
        })
     }

    return(
        <View style={styles.viewBody}>
            <ListRestaurants restaurants={restaurants} handleLoadMore={handleLoadMore} isLoading={isLoading}/>
            {user && (
                <Icon 
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    reverse
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-restaurant")}
                />
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5
    }
})