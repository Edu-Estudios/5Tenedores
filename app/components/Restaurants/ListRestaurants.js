import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import { size } from 'lodash';
import { useNavigation } from '@react-navigation/native';

export default function ListRestaurants(props) {
    const {restaurants, handleLoadMore, isLoading} = props
    const navigation = useNavigation()

    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList 
                    /* El array de datos */
                    data={restaurants}
                    /* Permite renderizar cada uno de los elementos del array de "data" */
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation}/>}
                    /* Es obligatorio que sea asi */
                    keyExtractor={(item, index) => index.toString()}
                    /* Esta propiedad sirve para indicar cuando se va a ejecutar la funcion del onEndReached. Con 0.5 se va a ejecutar cuando estemos viendo la mitad del ultimo elemento de la lista */
                    onEndReachedThreshold={0.5}
                    /* Va a ejecutar la funcion handleLoadMore encargada de cargar nuevos restaurantes. Viene desde Restaurants.js */
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large"/>
                    <Text>Cargando restaurantes</Text>
                </View>
            )}
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props
    const { id, images, name, description, address } = restaurant.item
    const imageRestaurant = images[0]

    const goRestaurant = () => {
        /* En este caso en el navigate se le está diciendo que cuando vaya a la pantalla "restaurant" envíe el id y el name del restaurante que se va a visualizar */
        navigation.navigate("restaurant", {
            id: id,
            name: name
        })
    }

    return (
        /* Permite que los elementos sean pulsables */
        <TouchableOpacity onPress={goRestaurant}>
            <View style={styles.viewRestaurants}>
                <View style={styles.viewRestaurantImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                        source={
                            imageRestaurant ? {uri: imageRestaurant} : require("../../../assets/img/original.png")
                        }
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList(props) {
    const {isLoading} = props

    if (isLoading) {
        return (
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View style={styles.notFoundRestaurants}>  
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    viewRestaurants: {
        flexDirection: "row",
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    },
    imageRestaurant: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: "bold"
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300
    },
    notFoundRestaurants: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center"
    }
})
