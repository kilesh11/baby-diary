import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegistrationScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text>RegisterScreen123</Text>
            <Button title="Registration" onPress={() => navigation.navigate('Registration')} />
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RegistrationScreen;
