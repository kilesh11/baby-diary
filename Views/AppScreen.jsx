/* eslint-disable no-nested-ternary */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { useAuth } from '../Context/AuthContext';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import LoadingScreen from './LoadingScreen';
import HomeScreen from './HomeScreen';

const Stack = createStackNavigator();

const AppScreen = () => {
    // const { user, isLoading } = useAuth();
    const isLoading = false;
    const user = null;
    return (
        <Stack.Navigator>
            {isLoading ? (
                <Stack.Screen
                    name="Loading"
                    component={LoadingScreen}
                    options={{ headerShown: false }}
                />
            ) : user ? (
                <Stack.Screen name="Home" component={HomeScreen} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Registration" component={RegistrationScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppScreen;
