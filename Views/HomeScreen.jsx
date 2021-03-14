import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import BabyScreen from './BabyScreen';
import DiaryScreen from './DiaryScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Baby':
                            iconName = 'baby';
                            break;
                        case 'Diary':
                            iconName = 'book';
                            break;
                        case 'Profile':
                            iconName = 'user-alt';
                            break;
                        default:
                            iconName = 'book';
                    }

                    return (
                        <FontAwesome5
                            name={iconName}
                            size={size}
                            color={focused ? '#788eec' : color}
                        />
                    );
                },
            })}
            tabBarOptions={{
                activeTintColor: '#788eec',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Baby" component={BabyScreen} />
            <Tab.Screen name="Diary" component={DiaryScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default HomeScreen;
