import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from "../../assets/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackParams } from "../../App";
import FoodTypeList from "../components/FoodTypeList";
import text from "../styles/text";
import FoodList from "../components/FoodList";
import { useEffect, useState } from "react";
import { Food, FoodPantry } from "../../schema/food";
import { realmContext } from "../../RealmContext";
import { useUser } from "@realm/react";

const { useRealm, useQuery } = realmContext;

type RootStackParamList = {
    AddItemToPantry: { addItem: (itemName: string) => void };
};

type AddItemToPantryProps = {
    route: RouteProp<RootStackParamList, 'AddItemToPantry'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'AddItemToPantry'>;
};

// Add items to pantry screen
const AddItemToPantry: React.FC<AddItemToPantryProps> = ({ route }) => {
    const { addItem } = route.params;

    // Translation and navigation props
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    // Food type manager prop
    const [selectedType, changeSelectedType] = useState<string>("Fruit")

    // Realm props
    const realm = useRealm();
    var items = useQuery(Food).sorted('_id').filtered(`type == "${selectedType}"`).slice();
    const user = useUser();

    // Selected food manager
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    // Filter by food type
    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.removeAll(); // Clear existing subscriptions
            mutableSubs.add(realm.objects(Food));
            mutableSubs.add(realm.objects(FoodPantry).filtered(`owner_id == "${user?.id}"`));
        });
        console.log(selectedType)
    }, [realm, selectedType]);

    const removeAllSelected = () => {
        setSelectedComponents([]);
    }

    const handleAddToPantry = () => {
        // Add teh items individualy to the pantry
        selectedComponents.forEach(item => {
            addItem(item)
        });
        console.log(selectedComponents)
        navigation.navigate("Pantry")
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity style={add.back}
                onPress={() => navigation.navigate("Pantry")}>
                <MaterialCommunityIcons name="chevron-left" size={40} color={Colors.secondary} />
            </TouchableOpacity>
            <View style={add.header}>
                <Text style={[text.titleBlack, { height: 30 }]}>
                    {t("pantry.Ingredients") + ":"}
                </Text>
                {(selectedComponents.length > 0) && <TouchableOpacity onPress={removeAllSelected} style={add.deselect}><Text style={[text.normalWhite, { marginHorizontal: 15, textAlign: "center" }]}>Deselect All</Text></TouchableOpacity>}
            </View>
            <View>
                <FoodTypeList selected={selectedType} setSelectedType={changeSelectedType} />
            </View>
            <View
                style={{
                    height: 1,
                    backgroundColor: Colors.secondary,
                    marginHorizontal: 20,
                    marginVertical: 5,
                }}
            />
            <View style={{ alignSelf: "center" }}>
                <FoodList selectedComponents={selectedComponents} setSelectedComponents={setSelectedComponents} data={items} />
            </View>
            <TouchableOpacity
                style={add.button}
                onPress={handleAddToPantry}
            >
                <Text style={text.title}>{t("pantry.AddItems")}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default AddItemToPantry;

const add = StyleSheet.create({
    back: {
        position: "absolute",
        top: Platform.OS == "ios" ? 10 : 40,
        left: 10
    },
    header: {
        height: 70,
        marginTop: 60,
        padding: 20,
    },
    button: {
        backgroundColor: Colors.secondary,
        position: "absolute",
        bottom: 20,
        height: 40,
        width: 350,
        borderRadius: 100,
        alignSelf: "center",
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 20,
    },
    deselect: {
        position: "absolute",
        backgroundColor: Colors.primarylight,
        borderRadius: 30,
        top: 15,
        right: 10,
        width: 100,
        textAlign: "center"
    }
})
