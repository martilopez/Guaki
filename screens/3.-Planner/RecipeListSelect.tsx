import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect } from "react";
import { TouchableOpacity, View, FlatList, StyleSheet, Text } from "react-native";
import text from "../styles/text";
import Colors from "../../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../App";
import { Recepies } from "../../schema/recepies";
import { Entypo } from '@expo/vector-icons';
import { Planning } from "../../schema/planning";
import { realmContext } from "../../RealmContext";
import { useUser } from "@realm/react";
import { BSON } from "realm";

interface RecepieListSelectProps {
    data: Recepies[]
    meal: string
    date: Date
}

const { useRealm } = realmContext;

const RecipeListSelect: React.FC<RecepieListSelectProps> = ({ data, meal, date }) => {
    //Translation props
    const { t } = useTranslation();

    //Navigation prop
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    //Realm prop
    const realm = useRealm();
    const user = useUser();

    // Filter by food type
    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.removeAll(); // Clear existing subscriptions
            mutableSubs.add(realm.objects(Recepies));
            mutableSubs.add(realm.objects(Planning).filtered(`owner_id == "${user?.id}"`));
        });
    }, [realm]);

    // Add item to planning to the DB
    const addItem = useCallback(
        async (item: Recepies) => {
            try {
                console.log(meal + date)
                await realm.write(() => {
                    realm.create('Planning', {
                        _id: new BSON.ObjectID(),
                        owner_id: user.id,
                        date: date,
                        meal: meal,
                        recipe: item,
                    });
                });
                console.log("Added recipe to planner")

                navigation.navigate("Planner");
            } catch (error) {
                console.error("Error adding item:", error);
                // Handle the error appropriately (e.g., show an error message)
            }
        },
        [realm, user, navigation, meal, date] // Include other dependencies if needed
    );

    //Render each item that can be added to the planning
    const renderItem = ({ item }: { item: Recepies }) => {
        return (
            <View style={list.card}>
                <TouchableOpacity style={list.info} onPress={() => navigation.navigate("RecepieDetail", { recepie: item })}>
                    <View style={{ flex: 3 }}>
                        <Text style={text.BlackBold}>
                            {item.name}
                        </Text>
                        <Text numberOfLines={1} style={[text.generalGrey, { width: 270 }]}>
                            {item.description}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>
                            {item.calories} kcal.
                        </Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={list.add} onPress={() => addItem(item)}>
                    <Entypo name="plus" size={32} color={Colors.white} />
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
        />
    );
};

export default RecipeListSelect;

const list = StyleSheet.create({
    card: {
        position: "relative",
        flex: 1,
        borderRadius: 24,
        backgroundColor: Colors.lightgrey,
        flexDirection: "row",
        marginVertical: 5,
    },
    list: {
        flexDirection: "column",
    },
    add: {
        flex: 1,
        backgroundColor: Colors.secondary,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: "center",
        justifyContent: "center"
    },
    info: {
        flex: 5,
        flexDirection: "column",
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignContent: "center"
    }
})