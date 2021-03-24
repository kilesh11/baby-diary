/* eslint-disable no-alert */
/* eslint-disable react-native/no-raw-text */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import DismissKeyboard from './DismissKeyboard';

const RegistrationScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    };

    const onRegisterPress = async () => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            alert('Invalid email address');
            return null;
        }
        if (password !== confirmPassword) {
            alert("Passwords don't match.");
            return null;
        }
        try {
            await register(email, password);
        } catch (err) {
            Alert.alert(err);
        }
        return null;
    };

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
                    <TextInput
                        style={styles.input}
                        placeholder={t('RegistrationScreen.emailPlaceholder')}
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
                        placeholder={t('RegistrationScreen.passwordPlaceholder')}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder={t('RegistrationScreen.confirmPasswordPlaceholder')}
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.button} onPress={() => onRegisterPress()}>
                        <Text style={styles.buttonTitle}>
                            {t('RegistrationScreen.createAccountBtn')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.footerText}>
                        {`${t('RegistrationScreen.loginTitle')} `}
                        <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                            {t('RegistrationScreen.loginBtn')}
                        </Text>
                    </Text>
                </KeyboardAvoidingView>
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
    },
    avoidingView: {
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

export default RegistrationScreen;
