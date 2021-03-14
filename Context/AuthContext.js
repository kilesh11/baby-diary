import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../Util/firebase';
import wrapper from '../Util/common';

const AuthContext = createContext({
    user: null,
    setUser: () => null,
    register: async () => {},
    logIn: async () => {},
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
                        .set({ babies: [], email: newUser.email, name: newUser.displayName ?? '' });
                }
                setFirebaseUser(newUser);
            } else {
                setFirebaseUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        (async () => {
            if (firebaseUser) {
                const firestoreUser = await db.collection('Users').doc(firebaseUser.uid).get();
                setUser({ ...firestoreUser.data(), uid: firebaseUser.uid });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        })();
    }, [firebaseUser]);

    const register = useCallback(async (email, password) => {
        const { error } = await wrapper(auth.createUserWithEmailAndPassword(email, password));
        if (error) {
            return Promise.reject(error);
        }

        return true;
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

    return (
        <AuthContext.Provider
            value={{
                setUser,
                register,
                logIn,
                user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
