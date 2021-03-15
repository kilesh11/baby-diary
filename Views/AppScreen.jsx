/* eslint-disable no-nested-ternary */
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../Context/AuthContext';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import LoadingScreen from './LoadingScreen';
import HomeScreen from './HomeScreen';
import BabyScreen from './BabyScreen';
import { useBaby } from '../Context/BabyContext';
import BabyDetailScreen from './BabyDetailScreen';

const Stack = createStackNavigator();

const AppScreen = () => {
    const { user, isLoading } = useAuth();
    const { selectedBaby, babies } = useBaby();

    return (
        <Stack.Navigator>
            {isLoading ? (
                <Stack.Screen
                    name="Loading"
                    component={LoadingScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            ) : user ? (
                selectedBaby ? (
                    <>
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={({ navigation }) => ({
                                headerTintColor: 'white',
                                headerTitle:
                                    babies?.find((baby) => baby.id === selectedBaby)?.name ?? '',
                                headerStyle: {
                                    backgroundColor: '#788eec',
                                    elevation: 0,
                                    shadowOpacity: 0,
                                },
                                headerRight: () => (
                                    <FontAwesome5
                                        style={styles.headerButton}
                                        name="baby"
                                        size={20}
                                        color="white"
                                        onPress={() => navigation.navigate('HomeBaby')}
                                    />
                                ),
                            })}
                        />
                        <Stack.Screen
                            name="HomeBaby"
                            component={BabyScreen}
                            options={{
                                headerTintColor: 'white',
                                headerStyle: {
                                    backgroundColor: '#788eec',
                                    elevation: 0,
                                    shadowOpacity: 0,
                                },
                            }}
                        />
                        <Stack.Screen
                            name="BabyDetail"
                            component={BabyDetailScreen}
                            initialParams={{ firstLogin: false }}
                            options={({ route }) => ({
                                headerTitle: route.params?.title ?? 'Baby',
                                headerTintColor: 'white',
                                headerStyle: {
                                    backgroundColor: '#788eec',
                                    elevation: 0,
                                    shadowOpacity: 0,
                                },
                            })}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="ChooseBaby"
                            component={BabyScreen}
                            initialParams={{ firstLogin: true }}
                            options={{
                                headerTitle: 'Which Baby to Record',
                                headerTintColor: 'white',
                                headerStyle: {
                                    backgroundColor: '#788eec',
                                    elevation: 0,
                                    shadowOpacity: 0,
                                },
                            }}
                        />
                        <Stack.Screen
                            name="BabyDetail"
                            component={BabyDetailScreen}
                            initialParams={{ firstLogin: true }}
                            options={({ route }) => ({
                                headerTitle: route.params?.title ?? 'Baby',
                                headerTintColor: 'white',
                                headerStyle: {
                                    backgroundColor: '#788eec',
                                    elevation: 0,
                                    shadowOpacity: 0,
                                },
                            })}
                        />
                    </>
                )
            ) : (
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#788eec',
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                        }}
                    />
                    <Stack.Screen
                        name="Registration"
                        component={RegistrationScreen}
                        options={{
                            headerLeft: () => null,
                            headerTintColor: 'white',
                            headerStyle: {
                                backgroundColor: '#788eec',
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginRight: 20,
    },
});

export default AppScreen;
