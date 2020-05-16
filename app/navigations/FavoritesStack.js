import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Favorites from '../screens/Favorites';

// Se crea el componente Stack
const Stack = createStackNavigator();

export default function FavoritesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                /* Este name debe ser único y no es el mismo que el del navigation Tab.screen */
                name="favorites"
                component={Favorites}
                options={{title: "Restaurantes favoritos"}}
            />
        </Stack.Navigator>
    )
}