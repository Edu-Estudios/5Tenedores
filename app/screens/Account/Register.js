import React, {useRef} from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

import RegisterForm from '../../components/Account/RegisterForm';

export default function Register() {
    /* Para hacer una referencia de un elemento hay que utilizar useRef */
    const toastRef = useRef();

    return (
        <KeyboardAwareScrollView>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
        
            <View style={styles.viewForm}>
                {/* Le pasamos por los props la referencia al Toast */}
                <RegisterForm toastRef={toastRef}/>
            </View>

            {/* Es necesario utilizar useRef ya que se va a hacer referencia a este elemento desde otro componente (RegisterForm.js) */}
            <Toast ref={toastRef} position="center" opacity={0.9} />
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