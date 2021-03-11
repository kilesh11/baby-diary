import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import firebase from 'firebase/app';
import { auth } from '../Util/firebase';
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
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (newUser) => {
            if (newUser) {
                setUser(newUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        return Promise.reject(new Error('no email or password'));
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
