import { TouchableOpacity, View, StyleSheet, Platform, Image, Text, FlatList } from "react-native";
import Colors from "../../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { StackParams } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import text from "../styles/text";
import { useTranslation } from "react-i18next";
import { FavouriteRecipes, Recepies } from "../../schema/recepies";
import { realmContext } from "../../RealmContext";
import { useUser } from "@realm/react";


interface RecepieDetailProps {
    route: {
        params: {
            recepie: Recepies;
        };
    };
}

const { useRealm } = realmContext;

// Recepie detail screen 
const RecepieDetail: React.FC<RecepieDetailProps> = ({ route }) => {
    const { recepie } = route.params;

    //Navigation props
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    //Translation props
    const { t } = useTranslation();

    //Realm props
    const realm = useRealm();
    const user = useUser();
    const ingredientsArray = recepie.ingredients ? recepie.ingredients.map((ingredient) => ingredient) : [];

    // Favourites props
    const [isFavorited, setFavourite] = useState<boolean>(false)
    const userFavRecipes = realm.objects(FavouriteRecipes).filtered('owner_id = $0', user?.id)[0];
    const [favouriteIndex, setFavouriteIndex] = useState<number>(-1)

    // Gets the favourite state of the recepie
    useEffect(() => {
        setFavouriteIndex(userFavRecipes.items.findIndex((item) => item._id!.equals(recepie._id!)))
        if (favouriteIndex !== -1) {
            setFavourite(true)
        }
        else {
            setFavourite(false)
        }
    }, [isFavorited, userFavRecipes])

    // Handles modification of the favourite state
    const modifyFavourite = (bool: boolean) => {
        // Unfovaourite
        if (isFavorited == true) {
            try {
                realm.write(() => {
                    // Remove the item at the found index
                    userFavRecipes.items.splice(favouriteIndex, 1);
                });
                setFavourite(false)
                console.log("Unfavourited recipe: " + recepie.name)
            } catch (error) {
                console.log("ERROR while unfavouriting recipe: " + recepie.name)
                console.log(error)
            }
        }
        // Favourite
        else {
            try {
                realm.write(() => {
                    userFavRecipes.items.push(recepie)
                })
                console.log("Favourited recipe: " + recepie.name)
                setFavourite(true)
            } catch (error) {
                console.log("ERROR while favouriting recipe: " + recepie.name)
                console.log(error)
            }
        }

    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={{ maxHeight: 220 }}>
                <Image source={require("../../assets/salad.jpg")} style={detail.img} />
                <TouchableOpacity style={detail.back}
                    onPress={() => navigation.navigate("Recipes")}>
                    <MaterialCommunityIcons name="chevron-left" size={40} color={Colors.secondary} />
                </TouchableOpacity>
                {isFavorited ?
                    <TouchableOpacity style={detail.fav} onPress={() => modifyFavourite(false)}>
                        <MaterialCommunityIcons name="cards-heart" size={36} color={Colors.red} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={detail.fav} onPress={() => modifyFavourite(true)}>
                        <MaterialCommunityIcons name="cards-heart-outline" size={36} color={Colors.secondary} />
                    </TouchableOpacity>
                }
            </View>

            <View style={[detail.header, detail.text]}>
                <Text style={[text.titleSecondary, { textAlign: "center" }]}>{recepie?.name}</Text>
                <View style={{ paddingHorizontal: 5, flex: 4 }}>
                    <View >
                        <Text style={text.headerGrey}>
                            {recepie?.description}
                        </Text>
                    </View>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.grey,
                            marginHorizontal: 20,
                            marginVertical: 5,
                            marginBottom: 10,
                        }}
                    />
                    <Text style={[text.SecondaryBold, { textAlign: "center" }]}>{recepie?.calories} kcal.</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap", marginBottom: 10 }}>

                        <Text style={text.GreyBold}>{recepie?.fats} g. of Fat</Text>
                        <View style={{
                            width: 1,
                            backgroundColor: Colors.grey,
                            marginHorizontal: 5
                        }} />
                        <Text style={text.GreyBold}>{recepie?.protein} g. of Protein</Text>
                        <View style={{
                            width: 1,
                            backgroundColor: Colors.grey,
                            marginHorizontal: 5
                        }} />
                        <Text style={text.GreyBold}>{recepie?.carbohydrates} g. of Carbs</Text>
                        <View style={{
                            width: 1,
                            backgroundColor: Colors.grey,
                            marginHorizontal: 5
                        }} />
                        <Text style={text.GreyBold}>{recepie?.fiber} g. of Fiber</Text>
                    </View>

                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.grey,
                            marginHorizontal: 20,

                            marginBottom: 10,
                        }}
                    />

                    <View style={{ marginBottom: 10 }}>
                        <Text style={[text.headerSecondary, { paddingVertical: 5 }]}>{t("pantry.Ingredients")}</Text>
                        <FlatList
                            data={ingredientsArray}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={text.BlackBold} key={index}>{item.food?.name}</Text>
                                    <Text style={text.GreyBold}>{" - " + item.quantity + " " + item.unit}</Text>
                                </View>
                            )}
                        />
                    </View>


                    <View style={{ marginBottom: 10 }}>
                        <Text style={[text.headerSecondary, { paddingVertical: 5 }]}>{t("recepie.steps")}</Text>
                        <FlatList
                            data={recepie?.steps.slice()}
                            keyExtractor={(item, index2) => index2.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={text.BlackBold} key={index}> {`${index + 1}.`}</Text>
                                    <Text style={[text.GreyBold, { paddingLeft: 5, paddingTop: 2, width: "95%" }]}>{item}</Text>
                                </View>
                            )}
                        />
                    </View>

                </View>
            </View>
        </View>
    )
}

export default RecepieDetail;

const detail = StyleSheet.create({
    back: {
        position: "absolute",
        top: Platform.OS == "ios" ? 10 : 40,
        left: 10,
    },
    img: {
        position: "relative",
        width: "100%",
        maxHeight: 220,
    },
    fav: {
        position: "absolute",
        width: 36,
        bottom: 10,
        right: 20,
        borderRadius: 30,
        alignItems: "center",
    },
    text: {
        paddingHorizontal: 12,
    },
    header: {
        flex: 1,
        paddingVertical: 12,
    },
})
