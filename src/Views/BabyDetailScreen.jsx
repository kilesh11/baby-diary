/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-raw-text */
/* eslint-disable global-require */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import firebase from 'firebase';
import { Overlay } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Image,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import DismissKeyboard from './DismissKeyboard';
import { useBaby } from '../Context/BabyContext';

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const BabyDetailScreen = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation();
    const {
        babies,
        babiesUrl,
        addBaby,
        updateBaby,
        removeBaby,
        importBaby,
        unregisterBaby,
        selectedBaby,
        editBaby,
        setBabiesUrl,
    } = useBaby();

    const onEditBaby = useMemo(
        () => (editBaby !== '' ? babies?.find((baby) => baby.id === editBaby) ?? false : false),
        [editBaby, babies],
    );

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.cancelled) {
            await uploadImage(result.uri);
        }
    }, [uploadImage]);

    const uploadImage = useCallback(
        async (uri) => {
            try {
                const response = await fetch(uri);
                const blob = await response.blob();
                const metadata = { contentType: 'image/jpeg' };
                const ref = firebase.storage().ref().child(`baby/${editBaby}`);
                const snapshot = await ref.put(blob, metadata);
                const downloadUrl = await snapshot.ref.getDownloadURL();
                await updateBaby(editBaby, { birthDate, name, image: true });
                setBabiesUrl((prevState) => ({
                    ...prevState,
                    [editBaby]: downloadUrl,
                }));
            } catch (err) {
                alert(err);
            }
        },
        [editBaby, updateBaby, setBabiesUrl, birthDate, name],
    );

    const [name, setName] = useState(onEditBaby ? onEditBaby.name ?? '' : '');
    const [birthDate, setBirthDate] = useState(
        onEditBaby ? onEditBaby.birthDate.toDate() ?? null : null,
    );
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [visible, setVisible] = useState(false);
    const [importBabyId, setImportBabyId] = useState('');
    const image = onEditBaby ? onEditBaby.name ?? false : false;

    const onAddBaby = useCallback(async () => {
        try {
            await addBaby({ birthDate, name, image });
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [addBaby, birthDate, name, image, navigation, route.params]);

    const onModifyBaby = useCallback(async () => {
        try {
            await updateBaby(editBaby, { birthDate, name, image });
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [updateBaby, birthDate, name, image, navigation, route.params, editBaby]);

    const onDeleteBaby = useCallback(async () => {
        try {
            await removeBaby(editBaby);
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [removeBaby, navigation, route.params, editBaby]);

    const onImportBaby = useCallback(async () => {
        try {
            await importBaby(importBabyId);
            hideDialog();
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [importBaby, importBabyId, navigation, route.params, hideDialog]);

    const onUnregisterBaby = useCallback(async () => {
        try {
            await unregisterBaby(editBaby);
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [unregisterBaby, navigation, route.params, editBaby]);

    const showDialog = useCallback(() => {
        setVisible(true);
    }, []);

    const hideDialog = useCallback(() => {
        setVisible(false);
    }, []);

    const editBabyParent = onEditBaby ? onEditBaby.parents.length ?? 0 : 0;

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
                    {editBaby !== '' && (
                        <TouchableOpacity style={styles.gridItem} onPress={pickImage}>
                            <Image
                                style={styles.image}
                                source={
                                    babiesUrl?.[editBaby]
                                        ? { uri: babiesUrl?.[editBaby] }
                                        : require('../../assets/default-avatar.jpg')
                                }
                            />
                        </TouchableOpacity>
                    )}
                    <Text selectable style={styles.babyIdText}>
                        {editBaby}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('BabyDetailScreen.namePlaceholder')}
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setName(text)}
                        value={name}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <Text
                        style={styles.dateText}
                        onPress={() => {
                            Keyboard.dismiss();
                            setDatePickerVisibility(true);
                        }}
                        value={birthDate}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    >
                        {birthDate?.toLocaleDateString(undefined, options) ?? 'Birth Date'}
                    </Text>
                    {editBaby === '' ? (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onAddBaby}>
                                <Text style={styles.buttonTitle}>
                                    {t('BabyDetailScreen.saveBtn')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={showDialog}>
                                <Text style={styles.buttonTitle}>
                                    {t('BabyDetailScreen.importBtn')}
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onModifyBaby}>
                                <Text style={styles.buttonTitle}>
                                    {t('BabyDetailScreen.updateBtn')}
                                </Text>
                            </TouchableOpacity>
                            {selectedBaby !== editBaby ? (
                                editBabyParent === 1 ? (
                                    <TouchableOpacity
                                        style={styles.buttonDelete}
                                        onPress={onDeleteBaby}
                                    >
                                        <Text style={styles.buttonTitle}>
                                            {t('BabyDetailScreen.deleteBtn')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.buttonDelete}
                                        onPress={onUnregisterBaby}
                                    >
                                        <Text style={styles.buttonTitle}>
                                            {t('BabyDetailScreen.unRegBtn')}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={(date) => {
                            setBirthDate(new Date(date));
                            setDatePickerVisibility(false);
                        }}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                </KeyboardAvoidingView>
                <Overlay
                    isVisible={visible}
                    overlayStyle={styles.overlayStyle}
                    onBackdropPress={() => setVisible((prevState) => !prevState)}
                >
                    <View style={styles.overlayContainerStyle}>
                        <Text style={styles.overlayTitleStyle}>
                            {t('BabyDetailScreen.importDialogTitle')}
                        </Text>
                        <TextInput
                            style={styles.dialogInput}
                            placeholder={t('BabyDetailScreen.babyIdPlaceholder')}
                            placeholderTextColor="#aaaaaa"
                            onChangeText={setImportBabyId}
                            value={importBabyId}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={styles.button} onPress={onImportBaby}>
                            <Text style={styles.buttonTitle}>
                                {t('BabyDetailScreen.importDialogSaveBtn')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Overlay>
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    babyIdText: {
        alignSelf: 'center',
    },
    avoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
    dialogInput: {
        height: 48,
        borderRadius: 5,
        borderColor: '#788eec',
        borderWidth: 1,
        marginVertical: 10,
        paddingLeft: 16,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 30,
        paddingLeft: 16,
    },
    dateText: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 30,
        paddingLeft: 16,
        paddingTop: 16,
    },
    gridItem: {
        width: 180,
        height: 180,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    image: {
        alignSelf: 'center',
        height: 180,
        width: 180,
        borderRadius: 90,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#788eec',
        marginHorizontal: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDelete: {
        backgroundColor: '#dc3545',
        marginHorizontal: 30,
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
    overlayStyle: {
        width: Dimensions.get('window').width * 0.8,
    },
    overlayContainerStyle: { margin: 10 },
    overlayTitleStyle: {
        alignSelf: 'flex-start',
        fontSize: 25,
        marginBottom: 10,
    },
});

export default BabyDetailScreen;
