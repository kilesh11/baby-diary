/* eslint-disable no-alert */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-raw-text */
import React, { useState, useCallback } from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DismissKeyboard from './DismissKeyboard';
import { useBaby } from '../Context/BabyContext';

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const BabyDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const { babies, addBaby, updateBaby, removeBaby } = useBaby();
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

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
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
                        <TouchableOpacity style={styles.button} onPress={onAddBaby}>
                            <Text style={styles.buttonTitle}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onModifyBaby}>
                                <Text style={styles.buttonTitle}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} onPress={onDeleteBaby}>
                                <Text style={styles.buttonTitle}>Delete</Text>
                            </TouchableOpacity>
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
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
    },
    avoidingView: {
        flex: 1,
        justifyContent: 'center',
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
