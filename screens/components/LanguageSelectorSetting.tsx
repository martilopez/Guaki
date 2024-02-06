import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../assets/colors';
import i18n from '../../tools/i18n';

const data = [
    { label: 'CAT', value: 'cat' },
    { label: 'ESP', value: 'es' },
    { label: 'EN', value: 'en' },
];

//Language selector component NOT USED IN FINAL VERSION
const LanguageSelectorSettings = (_props: any) => {
    // Translation props
    const { t } = useTranslation();

    //Component props
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const setSelectedLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }


    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: Colors.secondary }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={t("general.abrv")}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setSelectedLanguage(item.value);
                    setIsFocus(false);
                }}

            />
        </View>
    );
};

export default LanguageSelectorSettings;

// selector styling
const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    dropdown: {
        width: 70,
        height: 30,
        borderColor: Colors.grey,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 10,
    },
    label: {
        position: 'absolute',
        backgroundColor: Colors.light,
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
        color: Colors.white,

    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },

});