import { Food } from '../../schema/food';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, SectionList } from 'react-native';
import Colors from "../../assets/colors";
import text from "../styles/text";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BSON, List, Results } from "realm/dist/bundle";
import { foodTypes } from '../../public/food';

interface FoodListProps {
    selectedComponents: string[];
    setSelectedComponents: React.Dispatch<React.SetStateAction<string[]>>;
    data: List<Food> | Food[];
}

// Food list component used in the pantry and add items to pantry screens 
const FoodList: React.FC<FoodListProps> = ({ selectedComponents, setSelectedComponents, data }) => {
    //Translation props
    const { t } = useTranslation();

    // Handles selection and deselection of each item
    const toggleSelection = useCallback((item: Food) => {
        // Check if the component is already selected
        const isSelected = selectedComponents.some((selectedItem) => selectedItem === item.name);
        if (isSelected) {
            setSelectedComponents((prevSelected) => prevSelected.filter((selectedItem) => selectedItem !== item.name));
        } else {
            setSelectedComponents((prevSelected) => [...prevSelected, item.name]);
        }
    }, [selectedComponents, setSelectedComponents]);

    // Render each food item
    const renderItem = ({ item }: { item: Food }) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => toggleSelection(item)}
                style={list.card}>
                <View style={[list.img, { backgroundColor: foodTypes.find(type => type.name == item.type)?.color }]} />
                <View style={list.info}>
                    <Text style={text.normal}>{t("food." + item.name)}</Text>
                    <Text style={text.subnormal}>{t("foodTypes." + item.type)}</Text>
                </View>
                <View style={selectedComponents.includes(item.name) ? list.selectorActive : list.selector}>
                    {selectedComponents.includes(item.name) && <MaterialCommunityIcons name="check" size={18} color="black" />}
                </View>
            </TouchableOpacity>
        );
    }
    return (
        <FlatList
            style={list.list}
            data={data}
            extraData={data}
            renderItem={renderItem}
            numColumns={3}
            keyExtractor={(item) => item._id.toString() + selectedComponents.join('-')}
            columnWrapperStyle={list.row}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
    );
};

export default FoodList;

// Food list styling
const list = StyleSheet.create({
    card: {
        backgroundColor: Colors.light,
        height: 110,
        width: 110,
        borderRadius: 24,
        elevation: 2,
        flexDirection: "column",
        marginVertical: 5,
        marginHorizontal: 10,
        alignContent: "center",
    },
    img: {
        flex: 6,
        width: "100%",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    info: {
        flex: 8,
        margin: 10,
        marginTop: 5
    },
    list: {
        flexDirection: "row",
        flexWrap: 'wrap',
        marginBottom: 100,
        width: "100%",
        marginHorizontal: 10,
    },
    row: {
        justifyContent: "space-around"
    },
    selectorActive: {
        position: "absolute",
        backgroundColor: Colors.tertiary,
        right: 10,
        top: 10,
        width: 20,
        height: 20,
        borderRadius: 100,
        justifyContent: "center"
    },
    selector: {
        position: "absolute",
        borderColor: Colors.grey,
        borderWidth: 2,
        right: 10,
        top: 10,
        width: 20,
        height: 20,
        borderRadius: 100,
    },

})