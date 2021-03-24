import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locale/en';
import zh from '../locale/zh';

const resources = {
    en: {
        translation: en,
    },
    'en-HK': {
        translation: en,
    },
    'zh-Hant-HK': {
        translation: zh,
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
