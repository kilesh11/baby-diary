import React from 'react';
import './src/Util/i18n';
import { NavigationContainer } from '@react-navigation/native';
import AppScreen from './src/Views/AppScreen';
import { AuthProvider } from './src/Context/AuthContext';
import { BabyProvider } from './src/Context/BabyContext';
import { DiaryProvider } from './src/Context/DiaryContext';

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <BabyProvider>
                    <DiaryProvider>
                        <AppScreen />
                    </DiaryProvider>
                </BabyProvider>
            </AuthProvider>
        </NavigationContainer>
    );
}
