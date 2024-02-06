import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import general from "../styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../assets/colors";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FoodList from "../components/FoodList";
import MobileNav from "../components/MobileNav";
import PageTitle from "../components/PageTitle";
import text from "../styles/text";
import { StackParams } from "../../App";
import { realmContext } from "../../RealmContext";
import { Food, FoodPantry } from "../../schema/food";
import { useUser } from "@realm/react";

const { useRealm } = realmContext;

const Pantry = () => {
    // Translation and navigation props
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    // Realm props
    const realm = useRealm();
    const user = useUser();

    // Check if a pantry already exists for the given owner ID
    const existingPantry = realm.objects(FoodPantry).filtered('owner_id = $0', user?.id)[0];
    // State for selected components
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    useEffect(() => {
        // Add a listener for when the screen is focused
        const onFocus = () => {
            realm.subscriptions.update((mutableSubs) => {
                mutableSubs.removeAll();
                mutableSubs.add(realm.objects(FoodPantry).filtered(`owner_id == "${user?.id}"`));
                mutableSubs.add(realm.objects(Food).sorted("_id"));
            });
            console.log('Pantry is focused. Refreshing...');
        };
        const unsubscribe = navigation.addListener('focus', onFocus);
        return () => {
            // Clean up the listener when the component is unmounted
            unsubscribe();
        };
    }, [navigation]);

    // Clear all the selected food items
    const removeAllSelected = useCallback(() => {
        setSelectedComponents([]);
    }, [setSelectedComponents])

    // Removes selected items from the pantry
    const removeFromPantry = useCallback(() => {
        selectedComponents.forEach(itemName => {
            realm.write(() => {
                const food = realm.objects(Food).filtered('name = $0', itemName)[0]
                const pantry = realm.objects(FoodPantry).filtered('owner_id = $0', user?.id)[0];
                const itemIndex = pantry.items.findIndex((item) => item._id.equals(food._id));
                if (itemIndex !== -1) {
                    // Remove the item at the found index
                    pantry.items.splice(itemIndex, 1);
                }
                console.log("Eliminated:" + itemName)
            });
        });
        removeAllSelected()
    }, [realm, user, selectedComponents])

    // Add item passed by the add item to pantry screen to the pantry
    const addItem = useCallback(
        (itemName: string) => {
            const item = realm.objects(Food).filtered('name = $0', itemName)[0]
            if (item) {
                const parent = realm.objects(FoodPantry).filtered('owner_id = $0', user?.id)[0];

                // Check if the item is not already in the parent.items array
                const itemIsntInParent = parent.items.findIndex((existingItem) => existingItem.name == item.name) == -1;
                if (itemIsntInParent) {
                    realm.write(() => {
                        parent.items.push(item)
                    });
                    console.log("Added item: " + item.name)
                }
                else {
                    console.log('Item is already in parent.items' + item);
                }
            } else {
                console.error('Food not found with the specified name' + item);
            }
        },
        [realm, user, selectedComponents]
    );

    //Navigates to add
    const goToAdd = useCallback(() => {
        navigation.navigate("addItemsPantry", { addItem })
    }, [existingPantry])

    //Pantry Screen
    return (
        <View style={general.os}>
            <View style={general.scrollView}>
                <PageTitle title="Pantry" />
                <View style={{
                    flex: 10,
                    backgroundColor: Colors.primarydark,
                }}>
                    <View style={pantry.section}>
                        <Text style={text.normalWhite}>{t("pantry.description")}</Text>
                        <View style={pantry.myIngredients}>
                            <View style={{ flexDirection: "row", gap: 15 }}>
                                <Text style={text.boldWhite}>{t("pantry.my")} - {existingPantry?.items.length}</Text>
                                {(selectedComponents.length > 0) && <TouchableOpacity onPress={removeAllSelected} style={pantry.deselect}><Text style={[text.normalWhite, { marginHorizontal: 15 }]}>Deselect All</Text></TouchableOpacity>}
                            </View>
                            <View
                                style={{
                                    height: 3,
                                    backgroundColor: Colors.white,
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                        {existingPantry?.items.length > 0 ?
                            <FoodList selectedComponents={selectedComponents} setSelectedComponents={setSelectedComponents} data={existingPantry.items} />
                            :
                            <View style={pantry.empty}>
                                <Text style={text.boldWhite}>{t("pantry.empty")}</Text>
                                <Text style={text.normalWhite}>{t("pantry.empty2")}</Text>
                            </View>
                        }
                    </View>
                    <TouchableOpacity
                        style={[pantry.button, selectedComponents.length > 0 ? pantry.active : pantry.unactive]}
                        onPress={selectedComponents.length > 0 ? () => removeFromPantry() : () =>
                            goToAdd()
                        }
                    >
                        <Text style={selectedComponents.length > 0 ? text.title : text.titleBlack}>{selectedComponents.length > 0 ? t("pantry.delete") : t("pantry.AddItems")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <MobileNav current={"pantry"} />
        </View>
    );
}

export default Pantry;

const pantry = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    myIngredients: {
        marginTop: 10,
        alignSelf: 'center',
    },
    button: {
        position: "absolute",
        bottom: 10,
        height: 40,
        width: 350,
        borderRadius: 100,
        alignSelf: "center",
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 20,
    },
    active: {
        backgroundColor: Colors.red,
        transition: '0.5s, transform 0.5s'
    },
    unactive: {
        backgroundColor: Colors.white,
        transition: 'transform 0.5s'
    },
    deselect: {
        backgroundColor: Colors.primarylight,
        borderRadius: 30,
        width: "auto"
    },
    empty: {
        marginTop: 150,
        backgroundColor: Colors.primary,
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        alignSelf: "center"
    }
})