/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-raw-text */
import React, { useState, useCallback, useMemo } from 'react';
import { Button, Dialog, Portal } from 'react-native-paper';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DismissKeyboard from './DismissKeyboard';
import { useBaby } from '../Context/BabyContext';

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const BabyDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {
        babies,
        addBaby,
        updateBaby,
        removeBaby,
        importBaby,
        unregisterBaby,
        selectedBaby,
    } = useBaby();

    const babyParents = useMemo(
        () =>
            route.params?.babyId
                ? babies?.find((baby) => baby.id === route.params?.babyId)?.parents ?? []
                : [],
        [route.params, babies],
    );
    const [name, setName] = useState(
        route.params?.babyId
            ? babies?.find((baby) => baby.id === route.params?.babyId)?.name ?? ''
            : '',
    );
    const [birthDate, setBirthDate] = useState(
        route.params?.babyId
            ? babies?.find((baby) => baby.id === route.params?.babyId)?.birthDate.toDate() ?? null
            : null,
    );
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [visible, setVisible] = useState(false);
    const [importBabyId, setImportBabyId] = useState('');

    const onAddBaby = useCallback(async () => {
        try {
            await addBaby({ birthDate, name });
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [addBaby, birthDate, name, navigation, route.params]);

    const onModifyBaby = useCallback(async () => {
        try {
            await updateBaby(route.params?.babyId, { birthDate, name });
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [updateBaby, birthDate, name, navigation, route.params]);

    const onDeleteBaby = useCallback(async () => {
        try {
            await removeBaby(route.params?.babyId);
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [removeBaby, navigation, route.params]);

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
            await unregisterBaby(route.params?.babyId);
            if (route.params.firstLogin) {
                navigation.navigate('ChooseBaby');
            } else {
                navigation.goBack();
            }
        } catch (err) {
            alert(err);
        }
    }, [unregisterBaby, navigation, route.params]);

    const showDialog = useCallback(() => {
        setVisible(true);
    }, []);

    const hideDialog = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
                    <Text selectable style={styles.babyIdText}>
                        {route.params?.babyId}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
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
                    {route.params?.create ? (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onAddBaby}>
                                <Text style={styles.buttonTitle}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={showDialog}>
                                <Text style={styles.buttonTitle}>Import Baby</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onModifyBaby}>
                                <Text style={styles.buttonTitle}>Update</Text>
                            </TouchableOpacity>
                            {selectedBaby !== route.params?.babyId ? (
                                babyParents.length === 1 ? (
                                    <TouchableOpacity
                                        style={styles.buttonDelete}
                                        onPress={onDeleteBaby}
                                    >
                                        <Text style={styles.buttonTitle}>Delete</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.buttonDelete}
                                        onPress={onUnregisterBaby}
                                    >
                                        <Text style={styles.buttonTitle}>Unregister</Text>
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
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Import</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                style={styles.dialogInput}
                                placeholder="Baby ID"
                                placeholderTextColor="#aaaaaa"
                                onChangeText={setImportBabyId}
                                value={importBabyId}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button color="#788eec" onPress={onImportBaby}>
                                Import
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
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
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 16,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
    },
    dateText: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
        paddingTop: 16,
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
    buttonDelete: {
        backgroundColor: '#dc3545',
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
});

export default BabyDetailScreen;
