import firebase from 'firebase';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../Util/firebase';
import { useAuth } from './AuthContext';
import { useBaby } from './BabyContext';

const DiaryContext = createContext({
    diaries: [],
    selectedDiary: '',
    setSelectedDiary: () => null,
    addDiary: async () => null,
    removeDiary: async () => null,
    updateDiary: async () => null,
});

export const useDiary = () => {
    return useContext(DiaryContext);
};

export const DiaryProvider = ({ children }) => {
    const { user } = useAuth();
    const { selectedBaby, setSelectedBaby } = useBaby();
    const [selectedDiary, setSelectedDiary] = useState('');
    const [diaries, setDiaries] = useState(null);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (user && selectedBaby) {
            const unsubscribe = db
                .collection('Entries')
                .where('baby', '==', selectedBaby)
                .onSnapshot((querySnapshot) => {
                    const queryDiaries = querySnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    queryDiaries.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
                    setDiaries(queryDiaries);
                });
            return () => unsubscribe();
        }
        if (!user) {
            setSelectedBaby(null);
        }
    }, [user, selectedBaby, setSelectedBaby]);

    const addDiary = useCallback(
        async (diary) => {
            try {
                await db
                    .collection('Entries')
                    .doc()
                    .set({
                        createdAt: firebase.firestore.Timestamp.fromDate(diary.createdAt),
                        baby: selectedBaby,
                        ctx: {
                            infantMilk: diary.foodType === 0 ? parseInt(diary.milkVolume, 10) : 0,
                            breastMilk: diary.foodType === 1 ? parseInt(diary.milkVolume, 10) : 0,
                            food: diary.foodType === 2 ? diary.foodPortion : '',
                            pee: diary.isPee,
                            poop: diary.isPoop,
                            remark: diary.remark,
                        },
                        parents: user.uid,
                    });
                return true;
            } catch (err) {
                return Promise.reject(err);
            }
        },
        [user, selectedBaby],
    );

    const removeDiary = useCallback(async (diaryId) => {
        try {
            await db.collection('Entries').doc(diaryId).delete();
            return true;
        } catch (err) {
            return Promise.reject(err);
        }
    }, []);

    const updateDiary = useCallback(async (diaryId, diary) => {
        try {
            await db
                .collection('Entries')
                .doc(diaryId)
                .update({
                    createdAt: firebase.firestore.Timestamp.fromDate(diary.createdAt),
                    ctx: {
                        infantMilk: diary.foodType === 0 ? parseInt(diary.milkVolume, 10) : 0,
                        breastMilk: diary.foodType === 1 ? parseInt(diary.milkVolume, 10) : 0,
                        food: diary.foodType === 2 ? diary.foodPortion : '',
                        pee: diary.isPee,
                        poop: diary.isPoop,
                        remark: diary.remark,
                    },
                });
            return true;
        } catch (err) {
            return Promise.reject(err);
        }
    }, []);

    return (
        <DiaryContext.Provider
            value={{
                diaries,
                selectedDiary,
                setSelectedDiary,
                addDiary,
                removeDiary,
                updateDiary,
            }}
        >
            {children}
        </DiaryContext.Provider>
    );
};
