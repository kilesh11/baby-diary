import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { auth } from '../Util/firebase';

const ProfileScreen = () => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome Profile Screen</Text>
            <Text style={styles.text}>{user?.email ?? ''}</Text>
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

export default ProfileScreen;
