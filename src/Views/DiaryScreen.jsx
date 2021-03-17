import React, { useMemo } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Agenda } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import ActionButton from '../Util/ActionButton/ActionButton';
import { useBaby } from '../Context/BabyContext';
import { useDiary } from '../Context/DiaryContext';

const getTime = (date) => {
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    return `${hour}:${minute}`;
};

const getDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
};

const parseDiaries = (diaries) => {
    const parsedDiaries = {};
    diaries.forEach((diary) => {
        const date = getDate(diary.createdAt.toDate());
        if (date in parsedDiaries) {
            parsedDiaries[date] = [
                {
                    breastMilk: diary.ctx.breastMilk,
                    infantMilk: diary.ctx.infantMilk,
                    pee: diary.ctx.pee,
                    poop: diary.ctx.poop,
                    remark: diary.ctx.remark,
                    createdAt: diary.createdAt.toDate(),
                    id: diary.id,
                },
                ...parsedDiaries[date],
            ];
        } else {
            parsedDiaries[date] = [
                {
                    breastMilk: diary.ctx.breastMilk,
                    infantMilk: diary.ctx.infantMilk,
                    pee: diary.ctx.pee,
                    poop: diary.ctx.poop,
                    remark: diary.ctx.remark,
                    createdAt: diary.createdAt.toDate(),
                    id: diary.id,
                },
            ];
        }
    });
    return parsedDiaries;
};

const DiaryScreen = () => {
    const { babies, selectedBaby } = useBaby();
    const { diaries } = useDiary();
    const natvigation = useNavigation();
    const babyBirthDate = useMemo(
        () => babies?.find((baby) => baby.id === selectedBaby)?.birthDate.toDate() ?? new Date(),
        [babies, selectedBaby],
    );
    const items = useMemo(() => {
        if (diaries) {
            return parseDiaries(diaries);
        }
        return {};
    }, [diaries]);

    const renderItem = (item) => (
        <TouchableOpacity
            onPress={() =>
                natvigation.navigate('DiaryDetail', {
                    title: 'Edit Diary',
                    create: false,
                    diaryId: item.id,
                })
            }
        >
            <View style={styles.agendaWrapper}>
                <Text style={styles.agendaText}>{getTime(item.createdAt)}</Text>
                <View style={styles.agendaItem}>
                    <View style={styles.milkWrapper}>
                        {item.breastMilk || item.infantMilk ? (
                            <>
                                <MaterialCommunityIcons
                                    name="baby-bottle-outline"
                                    size={30}
                                    color={item.infantMilk ? '#788eec' : '#FFC0CB'}
                                />
                                <Text style={styles.milkVolume}>
                                    {item.breastMilk || item.infantMilk}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.none} />
                        )}
                    </View>
                    <View style={styles.rhsWrapper}>
                        {item.pee && (
                            <Entypo style={styles.rhsIcon} name="water" size={30} color="#e1e114" />
                        )}
                        {item.poop && (
                            <FontAwesome5
                                style={styles.rhsIcon}
                                name="poo"
                                size={30}
                                color="#7a5901"
                            />
                        )}
                        {item.remark.length > 0 && (
                            <FontAwesome5
                                style={styles.rhsIcon}
                                name="comment"
                                size={30}
                                color="#788eec"
                            />
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
    return (
        <>
            <Agenda
                // The list of items that have to be displayed in agenda. If you want to render item as empty date
                // the value of date key has to be an empty array []. If there exists no value for date key it is
                // considered that the date in question is not yet loaded
                items={items}
                // // Callback that gets called when items for a certain month should be loaded (month became visible)
                // loadItemsForMonth={(month) => {
                //     console.log('trigger items loading');
                // }}
                // // Callback that fires when the calendar is opened or closed
                // onCalendarToggled={(calendarOpened) => {
                //     console.log(calendarOpened);
                // }}
                // // Callback that gets called on day press
                // onDayPress={(day) => {
                //     console.log('day pressed');
                // }}
                // // Callback that gets called when day changes while scrolling agenda list
                // onDayChange={(day) => {
                //     console.log('day changed');
                // }}
                // // Initially selected day
                selected={new Date()}
                // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={babyBirthDate}
                // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate={'2012-05-30'}
                // // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={3}
                // // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={10}
                // // Specify how each item should be rendered in agenda
                renderItem={renderItem}
                // // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
                // renderDay={(day, item) => {
                //     return <View />;
                // }}
                // // Specify how empty date content with no items should be rendered
                // renderEmptyDate={() => {
                //     return <View />;
                // }}
                // // Specify how agenda knob should look like
                // renderKnob={() => {
                //     return <View />;
                // }}
                // // Specify what should be rendered instead of ActivityIndicator
                renderEmptyData={() => {
                    return <View />;
                }}
                // // Specify your item comparison function for increased performance
                // rowHasChanged={(r1, r2) => {
                //     return r1.text !== r2.text;
                // }}
                // // Hide knob button. Default = false
                // hideKnob={true}
                // // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                // markedDates={{
                //     '2021-04-16': { selected: true, marked: true },
                //     '2021-04-17': { marked: true },
                //     '2021-04-18': { disabled: true },
                // }}
                // // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
                // // disabledByDefault={true}
                // // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
                // onRefresh={() => console.log('refreshing...')}
                // // Set this true while waiting for new data from a refresh
                // refreshing={false}
                // // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
                // refreshControl={null}
                // // Agenda theme
                theme={{
                    // ...calendarTheme,
                    // agendaDayTextColor: 'yellow',
                    // agendaDayNumColor: 'green',
                    // agendaTodayColor: 'red',
                    // agendaKnobColor: 'blue',
                    dotColor: '#788eec',
                    selectedDotColor: '#ffffff',
                    selectedDayBackgroundColor: '#788eec',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#788eec',
                }}
                // // Agenda container style
                // style={{}}
            />
            <ActionButton
                buttonColor="#788eec"
                onPress={() =>
                    natvigation.navigate('DiaryDetail', { title: 'Add Diary', create: true })
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    agendaWrapper: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        height: 90,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        marginRight: 10,
    },
    agendaItem: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    none: { display: 'none' },
    agendaText: { marginLeft: 10, marginTop: 10, fontSize: 20 },
    milkWrapper: { marginLeft: 10, flexDirection: 'row' },
    milkVolume: { marginLeft: 5, alignSelf: 'center', fontSize: 23 },
    rhsWrapper: { flexDirection: 'row' },
    rhsIcon: { marginRight: 10 },
});

export default DiaryScreen;
