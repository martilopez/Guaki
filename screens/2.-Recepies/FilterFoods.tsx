import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View, StyleSheet, Text, Switch, FlatList, TouchableOpacity } from "react-native";
import Colors from "../../assets/colors";
import text from "../styles/text";
import { Food } from "../../schema/food";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { foodTypes } from "../../public/food";

interface FilterFoodsProps {
    data: Food[],
    removeFilter: (filter: Food) => void
}

// If there is a food filter applied this component is called 
// This component shows the tags of the recepie filters
const FilterFoods: React.FC<FilterFoodsProps> = ({ data, removeFilter }) => {
    //Translation props
    const { t } = useTranslation();

    const renderItem = ({ item }: { item: Food }) => {
        return (
            <View style={list.card}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[list.typeBadge, { backgroundColor: foodTypes.find(type => type.name == item.type)?.color }]}>
                    </View>
                    <Text>
                        {t("food." + item.name)}
                    </Text>
                </View>

                <TouchableOpacity style={list.delete} activeOpacity={1} onPress={() => removeFilter(item)}>
                    <FontAwesome name="remove" size={14} color={Colors.grey} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <FlatList
            style={list.list}
            data={data}
            extraData={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
        />
    );
}

export default FilterFoods;

const list = StyleSheet.create({
    card: {
        position: "relative",
        paddingVertical: 5,
        paddingHorizontal: 5,
        backgroundColor: Colors.light,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 4
    },

    list: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    typeBadge: {
        height: 14,
        width: 14,
        borderRadius: 24,
        paddingHorizontal: 7,
        marginHorizontal: 5,
    },
    delete: {
        marginHorizontal: 4,
    }
})