import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import en from './en';
import de from './de';

import { LANG_DETECT } from './config';

if (LANG_DETECT) {
    i18n.use(detector);
}
i18n.init({
    interpolation: { escapeValue: false },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    resources: {
        'en': {
            common: en
        },
        'de': {
            common: de
        },
    },
});

export default i18n;