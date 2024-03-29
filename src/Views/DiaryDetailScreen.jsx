/* eslint-disable no-alert */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-raw-text */
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native-appearance';
import moment from 'moment';
import * as Localization from 'expo-localization';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    TextInput,
    Text,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

const checkFoodType = (ctx) => {
    const { infantMilk, breastMilk, food = '' } = ctx;
    if (infantMilk) {
        return 0;
    }
    if (breastMilk) {
        return 1;
    }
    if (food) {
        return 2;
    }
    return 0;
};

const BabyDetailScreen = () => {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { diaries, addDiary, removeDiary, updateDiary, selectedDiary } = useDiary();

    const editDiary = useMemo(
        () =>
            selectedDiary !== ''
                ? diaries?.find((diary) => diary.id === selectedDiary) ?? false
                : false,
        [selectedDiary, diaries],
    );
    const [createdAtDate, setCreatedAtDate] = useState(
        editDiary ? editDiary?.createdAt.toDate() : new Date(),
    );
    const [createdAtTime, setCreatedAtTime] = useState(
        editDiary ? editDiary?.createdAt.toDate() : new Date(),
    );
    const [foodType, setFoodType] = useState(editDiary ? checkFoodType(editDiary?.ctx) : 0);
    const [milkVolume, setMilkVolume] = useState(getMilkVolume(editDiary));
    const [foodPortion, setFoodPortion] = useState(editDiary ? editDiary?.ctx.food : '');
    const [isPee, setIsPee] = useState(editDiary ? editDiary?.ctx.pee : false);
    const [isPoop, setIsPoop] = useState(editDiary ? editDiary?.ctx.poop : false);
    const [remark, setRemark] = useState(editDiary ? editDiary?.ctx.remark : '');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
                foodPortion,
                foodType,
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
        foodPortion,
        foodType,
        isPee,
        isPoop,
        remark,
        navigation,
    ]);

    const onModifyDiary = useCallback(async () => {
        try {
            await updateDiary(selectedDiary, {
                createdAt: new Date(
                    createdAtDate.getFullYear(),
                    createdAtDate.getMonth(),
                    createdAtDate.getDate(),
                    createdAtTime.getHours(),
                    createdAtTime.getMinutes(),
                    createdAtTime.getSeconds(),
                ),
                milkVolume: milkVolume === '' ? 0 : milkVolume,
                foodPortion,
                foodType,
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
        foodPortion,
        foodType,
        isPee,
        isPoop,
        remark,
        navigation,
        selectedDiary,
    ]);

    const onDeleteDiary = useCallback(async () => {
        try {
            await removeDiary(selectedDiary);
            navigation.goBack();
        } catch (err) {
            alert(err);
        }
    }, [removeDiary, navigation, selectedDiary]);

    const buttons = useMemo(
        () => [
            {
                element: () => (
                    <MaterialCommunityIcons
                        name="baby-bottle-outline"
                        size={20}
                        color={foodType === 0 ? '#788eec' : 'grey'}
                    />
                ),
            },
            {
                element: () => (
                    <MaterialCommunityIcons
                        name="human-female-boy"
                        size={20}
                        color={foodType === 1 ? '#FFC0CB' : 'grey'}
                    />
                ),
            },
            {
                element: () => (
                    <MaterialCommunityIcons
                        name="food-drumstick"
                        size={20}
                        color={foodType === 2 ? '#cd7b34' : 'grey'}
                    />
                ),
            },
        ],
        [foodType],
    );

    return (
        <DismissKeyboard>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
                    <View>
                        <ButtonGroup
                            onPress={setFoodType}
                            selectedIndex={foodType}
                            buttons={buttons}
                            containerStyle={styles.containerStyle}
                            selectedButtonStyle={styles.selectedButtonStyle}
                        />
                    </View>
                    {foodType !== 2 ? (
                        <TextInput
                            keyboardType="number-pad"
                            mode="flat"
                            style={styles.input}
                            placeholder={t('DiaryDetailScreen.volumePlaceholder')}
                            placeholderTextColor="#aaaaaa"
                            onChangeText={setMilkVolume}
                            value={milkVolume.toString()}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                    ) : (
                        <TextInput
                            mode="flat"
                            style={styles.input}
                            placeholder={t('DiaryDetailScreen.foodPlaceholder')}
                            placeholderTextColor="#aaaaaa"
                            onChangeText={setFoodPortion}
                            value={foodPortion.toString()}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                    )}
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
                            setDatePickerVisibility(true);
                        }}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    >
                        {`${moment(createdAtTime).format('hh:mm A')}`}
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
                        placeholder={t('DiaryDetailScreen.remarkPlaceholder')}
                        placeholderTextColor="#aaaaaa"
                        onChangeText={setRemark}
                        value={remark}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    {selectedDiary === '' ? (
                        <TouchableOpacity style={styles.button} onPress={onAddDiary}>
                            <Text style={styles.buttonTitle}>{t('DiaryDetailScreen.saveBtn')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={onModifyDiary}>
                                <Text style={styles.buttonTitle}>
                                    {t('DiaryDetailScreen.updateBtn')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} onPress={onDeleteDiary}>
                                <Text style={styles.buttonTitle}>
                                    {t('DiaryDetailScreen.deleteBtn')}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        isDarkModeEnabled={colorScheme === 'dark'}
                        locale={Localization.locale}
                        onConfirm={(date) => {
                            setCreatedAtDate(new Date(date));
                            setCreatedAtTime(new Date(date));
                            setDatePickerVisibility(false);
                        }}
                        onCancel={() => setDatePickerVisibility(false)}
                        display="inline"
                    />
                </KeyboardAvoidingView>
            </View>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    containerStyle: { marginHorizontal: 30 },
    selectedButtonStyle: { backgroundColor: 'transparent' },
    peePoopIconWrapper: { flexDirection: 'row', marginVertical: 10, alignSelf: 'center' },
    poopIcon: { marginLeft: 30 },
});

export default BabyDetailScreen;
