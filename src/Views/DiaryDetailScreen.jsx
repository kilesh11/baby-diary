/* eslint-disable no-alert */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-raw-text */
import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    TextInput,
} from 'react-native';
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DismissKeyboard from './DismissKeyboard';
import { useDiary } from '../Context/DiaryContext';

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const getMilkVolume = (diary) => {
    if (diary) {
        return diary.ctx.infantMilk || diary.ctx.breastMilk;
    }
    return '';
};

const BabyDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { diaries, addDiary, removeDiary, updateDiary } = useDiary();

    const editDiary = useMemo(
        () =>
            route.params?.diaryId
                ? diaries?.find((diary) => diary.id === route.params?.diaryId) ?? false
                : false,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [route.params],
    );
    const [createdAtDate, setCreatedAtDate] = useState(
        editDiary ? editDiary?.createdAt.toDate() : new Date(),
    );
    const [createdAtTime, setCreatedAtTime] = useState(
        editDiary ? editDiary?.createdAt.toDate() : new Date(),
    );
    const [isInfantMilk, setIsInfantMilk] = useState(editDiary ? editDiary?.ctx.infantMilk : true);
    const [milkVolume, setMilkVolume] = useState(getMilkVolume(editDiary));
    const [isPee, setIsPee] = useState(editDiary ? editDiary?.ctx.pee : false);
    const [isPoop, setIsPoop] = useState(editDiary ? editDiary?.ctx.poop : false);
    const [remark, setRemark] = useState(editDiary ? editDiary?.ctx.remark : '');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const onAddDiary = useCallback(async () => {
        try {
            await addDiary({
                createdAt: new Date(
                    createdAtDate.getFullYear(),
                    createdAtDate.getMonth(),
                    createdAtDate.getDate(),
                    createdAtTime.getHours(),
                    createdAtTime.getMinutes(),
                    createdAtTime.getSeconds(),
                ),
                milkVolume: milkVolume === '' ? 0 : milkVolume,
                isInfantMilk,
                isPee,
                isPoop,
                remark,
            });
            navigation.goBack();
        } catch (err) {
            alert(err);
        }
    }, [
        addDiary,
        createdAtDate,
        createdAtTime,
        milkVolume,
        isInfantMilk,
        isPee,
        isPoop,
        remark,
        navigation,
    ]);

    const onModifyDiary = useCallback(async () => {
        try {
            await updateDiary(route.params?.diaryId, {
                createdAt: new Date(
                    createdAtDate.getFullYear(),
                    createdAtDate.getMonth(),
                    createdAtDate.getDate(),
                    createdAtTime.getHours(),
                    createdAtTime.getMinutes(),
                    createdAtTime.getSeconds(),
                ),
                milkVolume: milkVolume === '' ? 0 : milkVolume,
                isInfantMilk,
                isPee,
                isPoop,
                remark,
            });
            navigation.goBack();
        } catch (err) {
            alert(err);
        }
    }, [
        updateDiary,
        createdAtDate,
        createdAtTime,
        milkVolume,
        isInfantMilk,
        isPee,
        isPoop,
        remark,
        navigation,
        route.params,
    ]);

    const onDeleteDiary = useCallback(async () => {
        try {
            await removeDiary(route.params?.diaryId);
            navigation.goBack();
        } catch (err) {
            alert(err);
        }
    }, [removeDiary, navigation, route.params]);

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
                    <View style={styles.radioGroupWrapper}>
                        <RadioButton.Group
                            onValueChange={(newValue) => setIsInfantMilk(newValue === 'INFANT')}
                            value={isInfantMilk ? 'INFANT' : 'BREAST'}
                        >
                            <View style={styles.radioGroup}>
                                <View style={styles.radioGroup}>
                                    <RadioButton value="INFANT" />
                                    <MaterialCommunityIcons
                                        name="baby-bottle-outline"
                                        size={40}
                                        color="#788eec"
                                    />
                                </View>
                                <View style={styles.radioGroupIcon}>
                                    <RadioButton value="BREAST" />
                                    <MaterialCommunityIcons
                                        name="human-female-boy"
                                        size={40}
                                        color="#FFC0CB"
                                    />
                                </View>
                            </View>
                        </RadioButton.Group>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        mode="flat"
                        style={styles.input}
                        placeholder="Milk Volume"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={setMilkVolume}
                        value={milkVolume.toString()}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <Text
                        style={styles.dateText}
                        onPress={() => {
                            Keyboard.dismiss();
                            setDatePickerVisibility(true);
                        }}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    >
                        {`${createdAtDate?.toLocaleDateString(undefined, options)}`}
                    </Text>
                    <Text
                        style={styles.dateText}
                        onPress={() => {
                            Keyboard.dismiss();
                            setTimePickerVisibility(true);
                        }}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    >
                        {`${createdAtTime?.toTimeString().substring(0, 5)}`}
                    </Text>
                    <View style={styles.peePoopIconWrapper}>
                        <Entypo
                            name="water"
                            size={40}
                            color={isPee ? '#e1e114' : '#aaaaaa'}
                            onPress={() => setIsPee((prev) => !prev)}
                        />
                        <FontAwesome5
                            style={styles.poopIcon}
                            name="poo"
                            size={40}
                            color={isPoop ? '#7a5901' : '#aaaaaa'}
                            onPress={() => setIsPoop((prev) => !prev)}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Remark"
                        placeholderTextColor="#aaaaaa"
                        onChangeText={setRemark}
                        value={remark}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {route.params?.create ? (
                        <TouchableOpacity style={styles.button} onPress={onAddDiary}>
                            <Text style={styles.buttonTitle}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onModifyDiary}>
                                <Text style={styles.buttonTitle}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} onPress={onDeleteDiary}>
                                <Text style={styles.buttonTitle}>Delete</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={(date) => {
                            setCreatedAtDate(new Date(date));
                            setDatePickerVisibility(false);
                        }}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={(date) => {
                            setCreatedAtTime(new Date(date));
                            setTimePickerVisibility(false);
                        }}
                        onCancel={() => setTimePickerVisibility(false)}
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
    radioGroupWrapper: {
        marginLeft: 30,
    },
    radioGroup: {
        flexDirection: 'row',
    },
    radioGroupIcon: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    peePoopIconWrapper: { flexDirection: 'row', marginVertical: 10, marginLeft: 30 },
    poopIcon: { marginLeft: 30 },
});

export default BabyDetailScreen;