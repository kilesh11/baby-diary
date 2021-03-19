import React, { useMemo, useState, useCallback } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';
import { useBaby } from '../Context/BabyContext';
import { useDiary } from '../Context/DiaryContext';

const DashboardScreen = () => {
    const { babies, selectedBaby } = useBaby();
    const { diaries } = useDiary();

    const [{ startDate, endDate, displayedDate }, updateDates] = useState({
        startDate: moment(),
        endDate: moment(),
        displayedDate: moment(),
    });

    const babyBirthDate = useMemo(
        () => babies?.find((baby) => baby.id === selectedBaby)?.birthDate.toDate() ?? new Date(),
        [babies, selectedBaby],
    );

    const averageMilkVolume = useMemo(() => {
        if (diaries && endDate && startDate) {
            const newEndDate = endDate.clone().add(1, 'days').startOf('day');
            const newStartDate = startDate.clone().startOf('day');
            const milkDay = new Set();
            const total = diaries.reduce((acc, diary) => {
                const createdDay = moment(diary.createdAt.toDate());
                if (createdDay.isBetween(newStartDate, newEndDate)) {
                    const newAcc = acc + (diary.ctx.infantMilk + diary.ctx.breastMilk);
                    milkDay.add(createdDay.format('YYYYMMDD'));
                    return newAcc;
                }
                return acc;
            }, 0);

            return Math.round(total / (milkDay.size || 1));
        }
        return 0;
    }, [diaries, startDate, endDate]);

    const setDates = useCallback((dates) => {
        updateDates((prevState) => ({
            ...prevState,
            ...dates,
        }));
    }, []);

    return (
        <View style={styles.container}>
            <DateRangePicker
                minDate={moment(babyBirthDate)}
                onChange={setDates}
                endDate={endDate}
                startDate={startDate}
                displayedDate={displayedDate}
                range
                containerStyle={styles.dateRangePickerContainer}
                selectedStyle={styles.dateRangePickerSelected}
            >
                <View style={styles.dateRangePickerWrapper}>
                    <Text style={styles.dateRangePickerText}>
                        {startDate?.format('YYYY-MM-DD').toString() ?? ''}
                    </Text>
                    <FontAwesome5 name="arrows-alt-h" size={24} color="#788eec" />
                    {endDate ? (
                        <Text style={styles.dateRangePickerText}>
                            {endDate?.format('YYYY-MM-DD').toString() ?? ''}
                        </Text>
                    ) : (
                        <Text style={styles.dateRangePickerInvisibleText}>
                            {moment().format('YYYY-MM-DD').toString()}
                        </Text>
                    )}
                </View>
            </DateRangePicker>
            <ScrollView style={styles.content}>
                <View style={styles.averageMilkWrapper}>
                    <View style={styles.lhsWrapper}>
                        <Text style={styles.averageMilkText}>Average Milk Consumption</Text>
                        <Text style={styles.averageMilkVolume}>{averageMilkVolume.toString()}</Text>
                    </View>
                    <View style={styles.rhsWrapper}>
                        <MaterialCommunityIcons name="baby-bottle-outline" size={50} color="#fff" />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        marginHorizontal: '3%',
        flex: 1,
    },
    dateRangePickerWrapper: {
        backgroundColor: '#fff',
        fontSize: 26,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    dateRangePickerText: { fontSize: 20, color: '#788eec' },
    dateRangePickerInvisibleText: { fontSize: 20, opacity: 0 },
    dateRangePickerContainer: { marginBottom: '30%' },
    dateRangePickerSelected: { backgroundColor: '#788eec' },
    averageMilkWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#788eec',
        height: 100,
        marginVertical: '3%',
        padding: 10,
        borderRadius: 15,
    },
    lhsWrapper: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    averageMilkText: { fontSize: 20, color: '#fff' },
    averageMilkVolume: { fontSize: 25, color: '#fff' },
    rhsWrapper: { alignSelf: 'flex-end' },
});

export default DashboardScreen;
