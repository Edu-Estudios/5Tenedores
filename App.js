import React from 'react';
import { YellowBox } from 'react-native';
import {firebaseApp} from './app/utils/firebase';
import Navigation from './app/navigations/Navigation';
// Necesario para que no pete al crear los restaurantes
import { decode, encode } from 'base-64';

// Esto sirve para ignorar un Warning que sale en Android al subir imágenes a Firebase (Solo en el dispositivo)
YellowBox.ignoreWarnings(["Setting a timer"])

// Necesario para que no pete al crear los restaurantes
if (!global.btoa) global.btoa = encode
if (!global.atob) global.atob = decode

export default function App() {
  return (
    <Navigation />
  );
}
