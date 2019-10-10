import i18n from 'i18next';
import en from './en';
import de from './de';

i18n.init({
    interpolation: { escapeValue: false },
    ns: ['common'],
    defaultNS: 'common',
    lng: 'en',                              // language to use
    resources: {
        'en': {
            common: en              // 'common' is our custom namespace
        },
        'de': {
            common: de
        },
    },
});

export default i18n;