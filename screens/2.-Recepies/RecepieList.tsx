import { useTranslation } from "react-i18next";
import React from "react";
import { TouchableOpacity, View, FlatList, StyleSheet, Text } from "react-native";
import text from "../styles/text";
import Colors from "../../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../App";
import { Recepies } from "../../schema/recepies";

interface RecepieListProps {
    data: Recepies[]
}

const RecepieList: React.FC<RecepieListProps> = ({ data }) => {
    //Translation props
    const { t } = useTranslation();

    //Navigation props
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    const renderItem = ({ item }: { item: Recepies }) => {
        return (
            <TouchableOpacity style={list.card} onPress={() => navigation.navigate("RecepieDetail", { recepie: item })}>
                <View style={{ flex: 3 }}>
                    <Text style={text.SecondaryBold}>
                        {item.name}
                    </Text>
                    <Text numberOfLines={1} style={[text.generalGrey, { width: 320 }]}>
                        {item.description}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>
                        {item.calories} kcal.
                    </Text>

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
            keyExtractor={(item) => item.name}
        />
    );
};

export default RecepieList;

const list = StyleSheet.create({
    card: {
        position: "relative",
        flex: 1,

        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: Colors.light,
        borderRadius: 24,
        flexDirection: "column",
        marginVertical: 5,
        marginHorizontal: 10,
        alignContent: "center"
    },
    list: {
        flexDirection: "column",
    },
})