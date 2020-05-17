
import React from 'react';
import {StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';

export default function InfoUser(props) {
    const {userInfo} = props
    const {photoUrl, displayName, email} = userInfo

    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton
                containerStyle={styles.userInfoAvatar}
               source={
                   photoUrl ? {uri: photoUrl} : require('../../../assets/img/avatar-default.jpg')
               }
            />
            <View>
                <Text style={styles.displayName}>{displayName ? displayName : "Anónimo"}</Text>
                <Text>{email ? email : "Social Login"}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
})