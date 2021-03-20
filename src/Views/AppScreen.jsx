/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */
import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../Context/AuthContext';
import { useBaby } from '../Context/BabyContext';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import LoadingScreen from './LoadingScreen';
import HomeScreen from './HomeScreen';
import BabyScreen from './BabyScreen';
import BabyDetailScreen from './BabyDetailScreen';
import DiaryDetailScreen from './DiaryDetailScreen';

const Stack = createStackNavigator();

const AppScreen = () => {
    const { user, isLoading } = useAuth();
    const { selectedBaby, babies, babiesUrl } = useBaby();

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
                                    <TouchableOpacity
                                        style={styles.gridItem}
                                        onPress={() => navigation.navigate('HomeBaby')}
                                    >
                                        <Image
                                            style={styles.image}
                                            source={
                                                babiesUrl?.[selectedBaby]
                                                    ? { uri: babiesUrl?.[selectedBaby] }
                                                    : require('../../assets/default-avatar.jpg')
                                            }
                                        />
                                    </TouchableOpacity>
                                ),
                            })}
                        />
                        <Stack.Screen
                            name="HomeBaby"
                            component={BabyScreen}
                            options={{
                                headerTitle: 'Baby',
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
                        <Stack.Screen
                            name="DiaryDetail"
                            component={DiaryDetailScreen}
                            initialParams={{ firstLogin: false }}
                            options={({ route }) => ({
                                headerTitle: route.params?.title ?? 'Add Diary',
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
    gridItem: {
        width: 34,
        height: 34,
        // backgroundColor: 'red',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    image: {
        alignSelf: 'center',
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
    },
});

export default AppScreen;
