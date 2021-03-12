/* eslint-disable no-alert */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useAuth } from '../Context/AuthContext';
import DismissKeyboard from './DismissKeyboard';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { logIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onFooterLinkPress = () => {
        navigation.navigate('Registration');
    };

    const onLogin = async () => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            alert('Invalid email address');
        }
        try {
            await logIn({ email, password });
        } catch (error) {
            alert(error);
        }
    };

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                {/* <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always"> */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={() => onLogin()}>
                    <Text style={styles.buttonTitle}>Log In</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                    Don't have an account?{' '}
                    <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                        Register
                    </Text>
                </Text>
                {/* </KeyboardAwareScrollView> */}
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        width: '100%',
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
    footerText: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#2e2e2d',
    },
    footerLink: {
        color: '#788eec',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default LoginScreen;
