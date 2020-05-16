import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RestaurantsStack from './RestaurantsStack';
import FavoritesStack from './FavoritesStack';
import TopRestaurantsStack from './TopRestaurantsStack';
import SearchStack from './SearchStack'
import AccountStack from './AccountStack';

import { Icon } from 'react-native-elements';

// Se crea el componente de la barra de navegación
const Tab = createBottomTabNavigator();

export default function Navigation() {
    return(
        <NavigationContainer>
            {/* initialRouteName es la pagina inicial de la app */}
            <Tab.Navigator 
                initialRouteName="restaurants" 
                tabBarOptions={{
                    /* Para los colores de la barra de navegacion */
                    inactiveTintColor: "#646464",
                    activeTintColor: "#00a680"
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}>
                <Tab.Screen 
                /* name -> Es el nombre que se va a utilizar para referenciar a esta navegacion */
                name="restaurants" 
                /* component -> Tiene que ser el stack (conjunto de paginas) de esa sección de la app */
                component={RestaurantsStack} 
                options={{ title: "Restaurantes"}}/>
                <Tab.Screen 
                name="favorites" 
                component={FavoritesStack} 
                options={{ title: "Favoritos"}}/>
                <Tab.Screen 
                name="top-restaurants" 
                component={TopRestaurantsStack} 
                options={{ title: "Top 5"}}/>
                <Tab.Screen 
                name="search" 
                component={SearchStack} 
                options={{ title: "Buscador"}}/>
                <Tab.Screen 
                name="account" 
                component={AccountStack} 
                options={{ title: "Mi cuenta"}}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

/* Esta función se utiliza para poner los iconos en cada opción de la barra de navegación */
function screenOptions(route, color) {
    let iconName;

    switch(route.name) {
        case "restaurants":
            iconName = "compass-outline"
            break;
        case "favorites":
            iconName = "heart-outline"
            break;
        case "top-restaurants":
            iconName = "star-outline"
            break;
        case "search":
            iconName = "magnify"
            break;
        case "account":
            iconName = "home-outline"
            break;
    }

    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}