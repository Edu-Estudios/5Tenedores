import React from 'react';
import MapView from 'react-native-maps';
// Componente que permitirá abrir la app de Mapas del móvil
import openMap from 'react-native-open-maps';

export default function Map(props) {

    const { location, name, height } = props

    // Permitirá abrir la app de mapas del móvil al pulsar sobre el mapa de los datos del restaurante
    const openAppMap = () => {
        openMap({
            /* latitude y longitude permiten que aparezca marcado la ubicación del restaurante */
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name
        })
    }

    return (
        <MapView
            style={{height: height, width: "100%"}}
            initialRegion={location}
            onPress={openAppMap}
        >
            <MapView.Marker 
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}


