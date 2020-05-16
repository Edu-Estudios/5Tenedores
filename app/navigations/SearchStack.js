import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/Search';

// Se crea el componente Stack
const Stack = createStackNavigator();

export default function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                /* Este name debe ser único y no es el mismo que el del navigation Tab.screen */
                name="search"
                component={Search}
                options={{title: "Buscador"}}
            />
        </Stack.Navigator>
    )
}