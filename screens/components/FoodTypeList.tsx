import { FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { foodTypes, foodType } from "../../public/food";
import { Dispatch, SetStateAction } from "react";
import Colors from "../../assets/colors";
import text from "../styles/text";
import { useTranslation } from "react-i18next";

interface FoodTypeProps {
    selected: string
    setSelectedType: Dispatch<SetStateAction<string>>
}

// Food category selector used in the add ingredients to pantry screen
const FoodTypeList: React.FC<FoodTypeProps> = ({ selected, setSelectedType }) => {
    //Translation props
    const { t } = useTranslation();

    //Function that selects the clicked category and updates the items
    const selectItem = (name: string) => {
        setSelectedType(name)
    }

    const renderItem = ({ item }: { item: foodType }) => {
        return (
            <TouchableOpacity style={(selected == item.name) ? typeList.selected : typeList.item} activeOpacity={1} onPress={() => selectItem(item.name)} >
                <Text style={[typeList.types, (selected == item.name) ? text.boldWhite : text.normal]}>{t("foodTypes." + item.name)}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <FlatList
            style={typeList.list}
            data={foodTypes}
            renderItem={renderItem}
            numColumns={1}
            keyExtractor={(item) => item.name}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        />
    );
}

// Styling
const typeList = StyleSheet.create({
    list: {
        padding: 2,
        maxHeight: 60,
    },
    item: {
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24,
        justifyContent: 'center',
        padding: 5,
        textAlignVertical: "center",
        width: 120,
        alignItems: "center",
        marginHorizontal: 2,
    },
    selected: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 24,
        padding: 5,
        width: 120,
        alignItems: "center",
        marginHorizontal: 2,
        justifyContent: 'center',
    },
    types: {
        textAlign: "center",
    }
})

export default FoodTypeList;