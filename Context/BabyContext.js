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
                    const queryBabies = querySnapshot.docs.map((doc) => doc.data());
                    console.log(
                        'kyle_debug ~ file: BabyContext.js ~ line 28 ~ .onSnapshot ~ queryBabies',
                        queryBabies,
                    );
                    setBabies(queryBabies);
                });
            return unsubscribe;
        }
    }, [user]);

    const addBaby = useCallback(async (baby) => {
        console.log('kyle_debug ~ file: BabyContext.js ~ line 24 ~ addBaby ~ baby', baby);
        console.log('addBaby');

        return true;
    }, []);

    const removeBaby = useCallback(async (babyId) => {
        console.log('kyle_debug ~ file: BabyContext.js ~ line 33 ~ removeBaby ~ babyId', babyId);
        console.log('removeBaby');
        return true;
    }, []);

    const updateBaby = useCallback(async (babyId, baby) => {
        console.log('kyle_debug ~ file: BabyContext.js ~ line 43 ~ updateBaby ~ baby', baby);
        console.log('kyle_debug ~ file: BabyContext.js ~ line 43 ~ updateBaby ~ babyId', babyId);
        console.log('updateBaby');

        return true;
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
