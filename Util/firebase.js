import firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
    apiKey: 'AIzaSyDnpCiYaAcDQpRhhjxS23qXcbT0FH_fzzk',
    authDomain: 'baby-diary-8cbb1.firebaseapp.com',
    projectId: 'baby-diary-8cbb1',
    storageBucket: 'baby-diary-8cbb1.appspot.com',
    messagingSenderId: '381551236352',
    appId: '1:381551236352:web:33c610146740b622afcfe5',
    measurementId: 'G-ZLM8VY4EJR',
});

export const auth = app.auth();
export default app;
