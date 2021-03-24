import React from 'react';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import DiaryScreen from './DiaryScreen';
import DashboardScreen from './DashboardScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Diary':
                            iconName = 'book';
                            break;
                        case 'Profile':
                            iconName = 'user-alt';
                            break;
                        case 'Dashboard':
                            iconName = 'clipboard';
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
            <Tab.Screen
                name="Diary"
                component={DiaryScreen}
                options={{ title: t('HomeScreen.diaryTab') }}
            />
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: t('HomeScreen.dashboardTab') }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: t('HomeScreen.profileTab') }}
            />
        </Tab.Navigator>
    );
};

export default HomeScreen;
