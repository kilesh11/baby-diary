import firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
    apiKey: 'AIzaSyC2of1dgN8SYR6o9sal6TPc4SgORyjm0js',
    authDomain: 'auth-c657c.firebaseapp.com',
    projectId: 'auth-c657c',
    storageBucket: 'auth-c657c.appspot.com',
    messagingSenderId: '448028693494',
    appId: '1:448028693494:web:06201487673b469746add7',
});

export const auth = app.auth();
export default app;
