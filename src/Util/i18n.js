import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            foo: 'Foo',
            bar: 'Bar {{someValue}}',
            welcome: 'Welcome!!!!!',
        },
    },
    'en-HK': {
        translation: {
            foo: 'Foo',
            bar: 'Bar {{someValue}}',
            welcome: 'Welcome!!!!!',
        },
    },
    'zh-Hant-HK': {
        translation: {
            foo: 'Foo',
            bar: 'Bar {{someValue}}',
            welcome: '歡迎!!!!!',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: Localization.locale,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    cleanCode: true,
});

export default i18n;
