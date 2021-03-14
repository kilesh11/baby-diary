import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppScreen from './Views/AppScreen';
import { AuthProvider } from './Context/AuthContext';
import { BabyProvider } from './Context/BabyContext';

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <BabyProvider>
                    <AppScreen />
                </BabyProvider>
            </AuthProvider>
        </NavigationContainer>
    );
}
