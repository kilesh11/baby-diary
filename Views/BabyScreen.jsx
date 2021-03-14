/* eslint-disable global-require */
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { useBaby } from '../Context/BabyContext';
import { auth } from '../Util/firebase';

const BabyScreen = () => {
    const { user } = useAuth();
    const { babies } = useBaby();
    console.log('kyle_debug ~ file: BabyScreen.jsx ~ line 10 ~ BabyScreen ~ babies', babies);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome Baby Screen</Text>
            <Text style={styles.text}>{user?.email ?? ''}</Text>
            <Image style={styles.image} source={require('../assets/default-avatar.jpg')} />
            <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
                <Text style={styles.buttonTitle}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    image: {
        alignSelf: 'center',
        height: 100,
        width: 100,
    },
    text: {
        alignSelf: 'center',
        fontSize: 30,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BabyScreen;
