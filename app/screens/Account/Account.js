import React, {useState, useEffect } from 'react';

import * as firebase from 'firebase';

import UserGuest from './UserGuest';
import UserLogged from './UserLogged';

import Loading from '../../components/Loading';

export default function Account() {

    const [login, setLogin] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            /* Si devuelve null es que el usuario no está logueado */
            !user ? setLogin(false) : setLogin(true);/* Si el usuario no está logueado setLogin false, sino true */
        })
    }, []);

    /* Si el login es null es que la peticion de onAuthStateChanged no ha terminado */
    if(login === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    // Si el usuario está logueado entonces se renderiza la pantalla de UserLogged, sino la de UserGuest
    return login ? <UserLogged /> : <UserGuest />
}