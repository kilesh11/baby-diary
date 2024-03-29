/* eslint-disable react-native/no-inline-styles */
/* eslint-disable global-require */
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const route = useRoute();
    const natvigation = useNavigation();
    const { babies, setSelectedBaby, babiesUrl, setEditBaby } = useBaby();
    const [updateMode, setUpdateMode] = useState(false);

    const renderItem = (items) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => {
                if (updateMode) {
                    setUpdateMode(false);
                    setEditBaby(items.item.id);
                    natvigation.navigate('BabyDetail', { title: items.item.name ?? 'Baby' });
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
                    style={[
                        styles.image,
                        {
                            ...(updateMode && { borderWidth: 1.5 }),
                            ...(updateMode && { borderColor: 'black' }),
                        },
                    ]}
                    source={
                        babiesUrl?.[items.item.id]
                            ? { uri: babiesUrl?.[items.item.id] }
                            : require('../../assets/default-avatar.jpg')
                    }
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

    // eslint-disable-next-line no-nested-ternary
    return babies ? (
        babies.length > 0 ? (
            <View style={styles.container}>
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
                    <Text style={styles.buttonTitle}>{t('BabyScreen.manageBabyBtn')}</Text>
                </TouchableOpacity>
                {route.params?.firstLogin && (
                    <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
                        <Text style={styles.buttonTitle}>{t('BabyScreen.logoutBtn')}</Text>
                    </TouchableOpacity>
                )}

                <ActionButton
                    buttonColor="#788eec"
                    onPress={() => {
                        setEditBaby('');
                        natvigation.navigate('BabyDetail', { title: 'Add Baby' });
                    }}
                />
            </View>
        ) : (
            <View style={styles.container}>
                <View style={styles.noBabyFound}>
                    <Text style={styles.noBabyFoundText}>{t('BabyScreen.addBabyTitle')}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
                        <Text style={styles.buttonTitle}>{t('BabyScreen.logoutBtn')}</Text>
                    </TouchableOpacity>
                </View>
                <ActionButton
                    buttonColor="#788eec"
                    onPress={() => {
                        setEditBaby('');
                        natvigation.navigate('BabyDetail', { title: 'Add Baby' });
                    }}
                />
            </View>
        )
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
        alignItems: 'center',
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
        borderRadius: 50,
        justifyContent: 'center',
    },
    button: {
        width: Dimensions.get('window').width * 0.8,
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
