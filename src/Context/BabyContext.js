import firebase from 'firebase';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../Util/firebase';
import { useAuth } from './AuthContext';

const BabyContext = createContext({
    babies: null,
    addBaby: async () => null,
    removeBaby: async () => null,
    updateBaby: async () => null,
});

export const useBaby = () => {
    return useContext(BabyContext);
};

export const BabyProvider = ({ children }) => {
    const { user } = useAuth();
    const [babies, setBabies] = useState(null);
    const [selectedBaby, setSelectedBaby] = useState(null);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (user) {
            const unsubscribe = db
                .collection('Babies')
                .where('parents', 'array-contains', user.uid)
                .onSnapshot((querySnapshot) => {
                    const queryBabies = querySnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    queryBabies.sort((a, b) => b.updatedAt.toDate() - a.updatedAt.toDate());
                    setBabies(queryBabies);
                });
            return unsubscribe;
        }
        setSelectedBaby(null);
    }, [user]);

    const addBaby = useCallback(
        async (baby) => {
            try {
                await db
                    .collection('Babies')
                    .doc()
                    .set({
                        birthDate: firebase.firestore.Timestamp.fromDate(baby.birthDate),
                        updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
                        name: baby.name,
                        parents: [user.uid],
                    });
                return true;
            } catch (err) {
                return Promise.reject(err);
            }
        },
        [user],
    );

    const removeBaby = useCallback(async (babyId) => {
        try {
            await db.collection('Babies').doc(babyId).delete();
            return true;
        } catch (err) {
            return Promise.reject(err);
        }
    }, []);

    const updateBaby = useCallback(async (babyId, baby) => {
        try {
            await db
                .collection('Babies')
                .doc(babyId)
                .update({
                    birthDate: firebase.firestore.Timestamp.fromDate(baby.birthDate),
                    updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
                    name: baby.name,
                });
            return true;
        } catch (err) {
            return Promise.reject(err);
        }
    }, []);

    return (
        <BabyContext.Provider
            value={{
                babies,
                selectedBaby,
                setSelectedBaby,
                addBaby,
                removeBaby,
                updateBaby,
            }}
        >
            {children}
        </BabyContext.Provider>
    );
};
