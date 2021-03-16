/* eslint-disable react-native/no-inline-styles */
/* eslint-disable global-require */
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    FlatList,
    Dimensions,
} from 'react-native';
import ActionButton from '../Util/ActionButton/ActionButton';
import { useBaby } from '../Context/BabyContext';
import { auth } from '../Util/firebase';

const BabyScreen = () => {
    const route = useRoute();
    const natvigation = useNavigation();
    const { babies, setSelectedBaby } = useBaby();
    const [updateMode, setUpdateMode] = useState(false);

    const renderItem = (items) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => {
                if (updateMode) {
                    setUpdateMode(false);
                    natvigation.navigate('BabyDetail', {
                        title: items.item.name ?? 'Baby',
                        create: false,
                        babyId: items.item.id,
                    });
                } else {
                    setSelectedBaby(items.item.id);
                    if (!route.params?.firstLogin) {
                        natvigation.navigate('Home');
                    }
                }
            }}
        >
            <View style={[styles.gridItemImage, { opacity: updateMode ? 0.4 : 1 }]}>
                <Image
                    onPress={() => natvigation}
                    style={styles.image}
                    source={require('../assets/default-avatar.jpg')}
                />
                {updateMode && (
                    <FontAwesome5
                        style={styles.updateModeIcon}
                        name="wrench"
                        size={24}
                        color="black"
                    />
                )}
            </View>
            <Text style={styles.gridItemText}>{items.item.name ?? 'Baby'}</Text>
        </TouchableOpacity>
    );

    return babies ? (
        <View style={styles.container}>
            {babies.length > 0 ? (
                <>
                    <FlatList
                        style={styles.flatList}
                        data={babies}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        numColumns={2}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setUpdateMode((prevState) => !prevState)}
                    >
                        <Text style={styles.buttonTitle}>Manage Babies</Text>
                    </TouchableOpacity>
                    {route.params?.firstLogin && (
                        <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
                            <Text style={styles.buttonTitle}>Logout</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <View style={styles.noBabyFound}>
                    <Text style={styles.noBabyFoundText}>Please add baby to continue</Text>
                    <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
                        <Text style={styles.buttonTitle}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ActionButton
                buttonColor="#788eec"
                onPress={() =>
                    natvigation.navigate('BabyDetail', { title: 'Add Baby', create: true })
                }
            />
        </View>
    ) : (
        <View style={[styles.loadingContainer, styles.horizontal]}>
            <ActivityIndicator />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    container: {
        flex: 1,
    },
    noBabyFound: {
        flex: 1,
        justifyContent: 'center',
    },
    noBabyFoundText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        alignSelf: 'center',
        height: 100,
        width: 100,
        borderWidth: 1.5,
        borderColor: 'white',
        borderRadius: 50,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    flatList: {
        paddingHorizontal: '10%',
        maxHeight: Dimensions.get('window').height * 0.6,
    },
    gridItem: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateModeIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemText: {
        marginTop: 5,
        textAlign: 'center',
        color: '#788eec',
    },
});

export default BabyScreen;
