import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RegisterForm from '../../components/Account/RegisterForm';

export default function Register() {
    return (
        <KeyboardAwareScrollView>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
        
            <View style={styles.viewForm}>
                <RegisterForm />
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    logo: {
        height: 150,
        width: "100%",
        marginTop: 20
    },
    viewForm: {
        marginRight: 40,
        marginLeft: 40
    }
})