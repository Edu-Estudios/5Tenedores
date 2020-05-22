import React from 'react';
import { YellowBox } from 'react-native';
import {firebaseApp} from './app/utils/firebase';
import Navigation from './app/navigations/Navigation';

// Esto sirve para ignorar un Warning que sale en Android al subir imágenes a Firebase (Solo en el dispositivo)
YellowBox.ignoreWarnings(["Setting a timer"])

export default function App() {
  return (
    <Navigation />
  );
}
