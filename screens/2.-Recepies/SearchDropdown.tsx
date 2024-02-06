import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, StyleSheet, Text, Switch, FlatList, TouchableOpacity } from "react-native";
import Colors from "../../assets/colors";
import text from "../styles/text";
import { Food } from "../../schema/food";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchDropdownProps {
    data: Food,
    setFilter: (filter: Food) => void
}

//Dropdown component
const SearchDropdown: React.FC<SearchDropdownProps> = ({ data, setFilter }) => {
    const { t } = useTranslation();
    return (
        <TouchableOpacity style={dropdown.general} activeOpacity={1} onPress={() => setFilter(data)}>
            <View style={dropdown.item}>
                <Text style={[text.generalBlack, { textAlignVertical: "center" }]}>Add </Text>
                <Text style={[text.BlackBold, { textAlignVertical: "center" }]}>{t("food." + data.name)}</Text>
                <Text style={[text.generalBlack, { textAlignVertical: "center" }]}> as a filter... </Text>
            </View>
            <View style={dropdown.icon}>
                <MaterialCommunityIcons name="filter-plus-outline" size={24} color={Colors.secondary} />
            </View>
        </TouchableOpacity>
    );
}

export default SearchDropdown;

const dropdown = StyleSheet.create({
    general: {
        position: "absolute",
        maxHeight: "700%",
        top: "100%",
        width: "106.5%",
        backgroundColor: Colors.white,
        borderRadius: 6,
        flexDirection: "row",
        elevation: 21,
        justifyContent: "space-between"
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: "row",
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        alignSelf: "center",
        justifyContent: "center",
        paddingRight: 15
    }
})