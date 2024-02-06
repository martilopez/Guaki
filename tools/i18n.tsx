import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import cat from "../locales/cat.json"
import en from "../locales/en.json"
import es from "../locales/es.json"

// Translation was implemented in the start of the project but removed later on 
// due to lack of time to develop with language translation
export const languageResources = {
    en: { translation: en},
    es: { translation: es},
    cat: { translation: cat}
}

i18n
.use(initReactI18next)
.init({
    debug: true,
    lng: 'en',
    resources: languageResources,
});

export default i18n;

