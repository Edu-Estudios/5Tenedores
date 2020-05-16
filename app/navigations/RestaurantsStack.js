import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Restaurants from '../screens/Restaurants';

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
        </Stack.Navigator>
    )
}