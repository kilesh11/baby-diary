import firebase from 'firebase';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { db } from '../Util/firebase';
import { useAuth } from './AuthContext';

const BabyContext = createContext({
    babies: null,
    babiesUrl: {},
    addBaby: async () => null,
    removeBaby: async () => null,
    updateBaby: async () => null,
    unregisterBaby: async () => null,
    importBaby: async () => null,
    setBabiesUrl: () => null,
});

export const useBaby = () => {
    return useContext(BabyContext);
};

export const BabyProvider = ({ children }) => {
    const { user } = useAuth();
    const [babies, setBabies] = useState(null);
    const [babiesUrl, setBabiesUrl] = useState({});
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
            return () => unsubscribe();
        }
        setSelectedBaby(null);
    }, [user]);

    useEffect(() => {
        (async () => {
            if (babies && babies.length > 0) {
                const newBabiesUrl = {};
                const results = await Promise.all(
                    babies.map(async (baby) => {
                        let imageUrl = false;
                        try {
                            const babyImgRef = firebase.storage().ref(`baby/${baby.id}`);
                            imageUrl = await babyImgRef.getDownloadURL();
                        } catch (err) {
                            if (err.code !== 'storage/object-not-found') {
                                Alert.alert('image got problem');
                            }
                        }
                        return { id: baby.id, imageUrl };
                    }),
                );
                results.forEach((result) => {
                    newBabiesUrl[result.id] = result.imageUrl;
                });
                setBabiesUrl(newBabiesUrl);
            }
        })();
    }, [babies]);

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

    const unregisterBaby = useCallback(
        async (babyId) => {
            try {
                await db
                    .collection('Babies')
                    .doc(babyId)
                    .update({
                        parents: firebase.firestore.FieldValue.arrayRemove(user.uid),
                    });
                return true;
            } catch (err) {
                return Promise.reject(err);
            }
        },
        [user],
    );

    const importBaby = useCallback(
        async (babyId) => {
            try {
                await db
                    .collection('Babies')
                    .doc(babyId)
                    .update({
                        parents: firebase.firestore.FieldValue.arrayUnion(user.uid),
                    });
                return true;
            } catch (err) {
                return Promise.reject(err);
            }
        },
        [user],
    );

    return (
        <BabyContext.Provider
            value={{
                babies,
                babiesUrl,
                selectedBaby,
                setSelectedBaby,
                addBaby,
                removeBaby,
                updateBaby,
                unregisterBaby,
                importBaby,
                setBabiesUrl,
            }}
        >
            {children}
        </BabyContext.Provider>
    );
};
