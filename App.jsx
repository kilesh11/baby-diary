import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppScreen from './Views/AppScreen';
import { AuthProvider } from './Context/AuthContext';
// import { AuthProvider } from './Context/AuthContext';

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <AppScreen />
            </AuthProvider>
        </NavigationContainer>
    );
}
