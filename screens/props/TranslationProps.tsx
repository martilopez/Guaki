import { TFunction } from "i18next";

// Used but not applied around the whole app
export interface TranslationProps {
    t: TFunction<"translation", undefined>;
    setLanguage: (lng: string) => void;
    lng: 'en';
}

