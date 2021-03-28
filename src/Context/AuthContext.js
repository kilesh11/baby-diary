import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../Util/firebase';
import wrapper from '../Util/common';

const AuthContext = createContext({
    user: null,
    setUser: () => null,
    signUp: async () => {},
    logIn: async () => {},
    updateUser: async () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (newUser) => {
            if (newUser) {
                const firestoreUser = await db.collection('Users').doc(newUser.uid).get();
                if (!firestoreUser.exists) {
                    await db
                        .collection('Users')
                        .doc(newUser.uid)
                        .set({ email: newUser.email, name: newUser.displayName ?? '' });
                }
                setFirebaseUser(newUser);
            } else {
                setFirebaseUser(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        (async () => {
            if (firebaseUser) {
                const firestoreUser = await db.collection('Users').doc(firebaseUser.uid).get();
                setUser({ ...firestoreUser.data(), uid: firebaseUser.uid });
                setIsLoading(false);
            } else {
                setUser(null);
            }
        })();
    }, [firebaseUser]);

    // eslint-disable-next-line consistent-return
    const signUp = useCallback(async (email, password) => {
        const { error } = await wrapper(auth.createUserWithEmailAndPassword(email, password));
        if (error) {
            return Promise.reject(error);
        }
        // const checkUser = await db.collection('Users').where('email', '==', email).get();
        // if (checkUser.docs.length === 0) {

        // } else {
        //     return Promise.reject(new Error('user exist!'));
        // }
    }, []);

    const logIn = useCallback(async ({ email, password }) => {
        if (email && password) {
            const { error } = await wrapper(auth.signInWithEmailAndPassword(email, password));
            if (error) {
                return Promise.reject(error);
            }
        }
        return true;
    }, []);

    const updateUser = useCallback(
        async (userName) => {
            if (userName) {
                try {
                    await db.collection('Users').doc(user.uid).update({
                        name: userName,
                    });
                    const firestoreUser = await db.collection('Users').doc(firebaseUser.uid).get();
                    setUser({ ...firestoreUser.data(), uid: firebaseUser.uid });
                    return true;
                } catch (err) {
                    return Promise.reject(err);
                }
            }
            return true;
        },
        [user, firebaseUser],
    );

    return (
        <AuthContext.Provider
            value={{
                setUser,
                updateUser,
                signUp,
                logIn,
                user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
