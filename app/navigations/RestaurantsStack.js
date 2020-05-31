import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Restaurants from '../screens/Restaurants/Restaurants';
import AddRestaurant from '../screens/Restaurants/AddRestaurant';
import Restaurant from '../screens/Restaurants/Restaurant';
import AddReviewRestaurant from '../screens/Restaurants/AddReviewRestaurant';

// Se crea el componente Stack
const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                /* Este name debe ser único y no es el mismo que el del navigation Tab.screen */
                name="restaurants"
                component={Restaurants}
                options={{title: "Restaurantes"}}
            />
            <Stack.Screen 
                name="add-restaurant"
                component={AddRestaurant}
                options={{title: "Añadir nuevo restaurante"}}
            />
            <Stack.Screen 
                name="restaurant"
                component={Restaurant}
                /* No tiene título porque se va a hacer dinámico desde el propio componente */
            />
            <Stack.Screen 
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{title: "Nueva reseña"}}
            />
        </Stack.Navigator>
    )
}