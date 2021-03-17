import React, { useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useState } from 'react/cjs/react.development';
import { useAuth } from '../Context/AuthContext';
import { auth } from '../Util/firebase';
import DismissKeyboard from './DismissKeyboard';

const ProfileScreen = () => {
    const { user, updateUser } = useAuth();
    const [userName, setUserName] = useState(user?.name ?? '');

    const onUpdateUser = useCallback(async () => {
        try {
            await updateUser(userName);
        } catch (err) {
            Alert.alert(err);
        }
    }, [updateUser, userName]);

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <Text style={styles.text}>Welcome</Text>
                <Text style={styles.text}>{user?.name || user?.email}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={setUserName}
                    value={userName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onUpdateUser}>
                    <Text style={styles.buttonTitle}>Update Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
                    <Text style={styles.buttonTitle}>Logout</Text>
                </TouchableOpacity>
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
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
