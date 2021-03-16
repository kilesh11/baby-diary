import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppScreen from './src/Views/AppScreen';
import { AuthProvider } from './src/Context/AuthContext';
import { BabyProvider } from './src/Context/BabyContext';
import { DiaryProvider } from './src/Context/DiaryContext';

export default function App() {
    return (
        <NavigationContainer>
            <PaperProvider>
                <AuthProvider>
                    <BabyProvider>
                        <DiaryProvider>
                            <AppScreen />
                        </DiaryProvider>
                    </BabyProvider>
                </AuthProvider>
            </PaperProvider>
        </NavigationContainer>
    );
}
