import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppScreen from './Views/AppScreen';
import { AuthProvider } from './Context/AuthContext';
import { BabyProvider } from './Context/BabyContext';
import { DiaryProvider } from './Context/DiaryContext';

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
