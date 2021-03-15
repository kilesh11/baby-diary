import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FloatingButton = ({ style }) => {
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity>
                <Animated.View style={styles.button}>
                    <MaterialIcons name="add" size={24} color="white" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
    },
    button: {
        backgroundColor: '#788eec',
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        // shadowRadius: 10,
        // shadowColor: '#788eec',
        // shadowOpacity: 0.3,
        // shadowOffset: { height: 10 },
    },
});

export default FloatingButton;
