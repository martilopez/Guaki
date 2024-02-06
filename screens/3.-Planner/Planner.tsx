import { View, Text, Platform, ScrollView, StatusBar, TouchableOpacity, StyleSheet, Image, Button } from "react-native";
import { TranslationProps } from "../props/TranslationProps";
import general from "../styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { StackParams } from "../../App";
import MobileNav from "../components/MobileNav";
import PageTitle from "../components/PageTitle";
import Colors from "../../assets/colors";
import text from "../styles/text";
import SearchDropdown from "../2.-Recepies/SearchDropdown";
import { useCallback, useEffect, useState } from "react";
import CalendarStrip from 'react-native-calendar-strip';
import { Entypo } from '@expo/vector-icons';
import { realmContext } from "../../RealmContext";
import { useUser } from "@realm/react";
import { Recepies } from "../../schema/recepies";
import { Planning } from "../../schema/planning";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';

const { useRealm, useObject, useQuery } = realmContext;


const Planner = () => {
    //Navigation props
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    // Create a new Date object with the current date and time
    var currentDate = new Date();

    // Set the time components to zero
    currentDate.setHours(0, 0, 0, 0);
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

    // Realm init
    const realm = useRealm();
    const user = useUser();

    //Meal props
    const [breakfastPlanner, setbreakfastPlanner] = useState<Planning>();
    const [lunchPlanner, setlunchPlanner] = useState<Planning>();
    const [dinnerPlanner, setdinnerPlanner] = useState<Planning>();
    const [snackPlanner, setsnackPlanner] = useState<Planning>();


    //Refreshing realm subscriptions
    useEffect(() => {
        // Add a listener for when the screen is focused
        const onFocus = () => {
            console.log('Planner is focused. Refreshing...');
            realm.subscriptions.update(mutableSubs => {
                mutableSubs.add(realm.objects(Recepies).sorted('_id'));
                mutableSubs.add(realm.objects(Planning).sorted('_id'));
            });
        };
        const unsubscribe = navigation.addListener('focus', onFocus);
        return () => {
            // Clean up the listener when the component is unmounted
            unsubscribe();
        };
    }, [navigation, realm]);


    //Handles removal of a recipe from planner
    const deleteRecipes = useCallback((planning: Planning) => {
        if (planning.meal == "breakfast") {
            setbreakfastPlanner(undefined)
        }
        if (planning.meal == "lunch") {
            setlunchPlanner(undefined)
        }

        if (planning.meal == "dinner") {
            setdinnerPlanner(undefined)
        }

        if (planning.meal == "snack") {
            setsnackPlanner(undefined)
        }

        realm.write(() => {
            realm.delete(planning);
        });
    }, [])

    // Gets the selected date planning
    useEffect(() => {
        // Gate planning
        const res = realm.objects(Planning).filtered('owner_id = $0', user?.id).filtered('date = $0', selectedDate);

        //Map Planning acording the the meal
        setbreakfastPlanner(res.filtered("meal = $0", "breakfast")[0]);
        setlunchPlanner(res.filtered("meal = $0", "lunch")[0]);
        setdinnerPlanner(res.filtered("meal = $0", "dinner")[0]);
        setsnackPlanner(res.filtered("meal = $0", "snack")[0]);

    }, [navigation, selectedDate, useIsFocused(), deleteRecipes])

    // Navigates to add recipe to planner
    const goToAddRecipe = useCallback((meal: string) => {
        navigation.navigate("AddRecipeToPlanner", { meal, date: selectedDate })
    }, [selectedDate])

    // Planner Screen
    return (
        <View style={general.os}>
            <View style={[general.general]}>
                <PageTitle title="Planner" />

                <View style={{
                    flex: 10,
                    backgroundColor: Colors.primarydark,
                }}>
                    <CalendarStrip
                        style={calendarStrip.general}
                        calendarAnimation={{ type: 'parallel', duration: 500 }}
                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: Colors.white }}
                        calendarHeaderStyle={{ color: Colors.white }}
                        dateNumberStyle={{ color: Colors.white }}
                        dateNameStyle={{ color: Colors.white }}
                        highlightDateNumberStyle={calendarStrip.selectedNumber}
                        highlightDateNameStyle={calendarStrip.selectedDay}
                        highlightDateContainerStyle={calendarStrip.selectedContainer}
                        disabledDateNameStyle={{ color: Colors.grey }}
                        disabledDateNumberStyle={{ color: Colors.grey }}
                        iconContainer={{ flex: 0.1 }}
                        scrollerPaging={true}
                        onDateSelected={(date) => {
                            setSelectedDate(date.toDate())
                        }}
                    />
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.white,
                            marginTop: 5,
                        }}
                    />
                    <ScrollView style={menus.general}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >

                        <View style={[menus.header, { marginTop: 8 }]}>
                            <Text style={text.boldWhite}>Breakfast</Text>
                        </View>

                        {breakfastPlanner != null ?
                            <TouchableOpacity style={menus.item} onPress={() => navigation.navigate("RecepieDetail", { recepie: breakfastPlanner.recipe })}>
                                <View style={menus.img}>
                                    <Image source={require("../../assets/salad.jpg")} style={menus.img} />
                                </View>
                                <View style={menus.text}>
                                    <TouchableOpacity
                                        onPress={() => deleteRecipes(breakfastPlanner)}
                                        style={menus.delete}
                                    >
                                        <FontAwesome name="trash-o" size={18} color={Colors.black} />
                                    </TouchableOpacity>
                                    <Text numberOfLines={2} style={[text.headerSecondary, { width: 200 }]}>{breakfastPlanner.recipe?.name}</Text>
                                    <Text numberOfLines={2} style={[text.generalBlack, { width: 230 }]}>{breakfastPlanner.recipe?.description}</Text>
                                    <Text style={text.generalGrey}>{breakfastPlanner.recipe?.calories} kcal</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={menus.itemEmpty} onPress={() => goToAddRecipe("breakfast")}>
                                <Entypo name="plus" size={36} color={Colors.white} />
                            </TouchableOpacity>
                        }


                        <View style={menus.header}>
                            <Text style={text.boldWhite}>Lunch</Text>
                        </View>
                        {lunchPlanner != null ?
                            <TouchableOpacity style={menus.item} onPress={() => navigation.navigate("RecepieDetail", { recepie: lunchPlanner.recipe })}>
                                <View style={menus.img}>
                                    <Image source={require("../../assets/salad.jpg")} style={menus.img} />
                                </View>
                                <View style={menus.text}>
                                    <TouchableOpacity
                                        onPress={() => deleteRecipes(lunchPlanner)}
                                        style={menus.delete}
                                    >
                                        <FontAwesome name="trash-o" size={18} color={Colors.black} />
                                    </TouchableOpacity>
                                    <Text numberOfLines={2} style={[text.headerSecondary, { width: 200 }]}>{lunchPlanner.recipe?.name}</Text>
                                    <Text numberOfLines={2} style={[text.generalBlack, { width: 230 }]}>{lunchPlanner.recipe?.description}</Text>
                                    <Text style={text.generalGrey}>{lunchPlanner.recipe?.calories} kcal</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={menus.itemEmpty} onPress={() => goToAddRecipe("lunch")}>
                                <Entypo name="plus" size={36} color={Colors.white} />
                            </TouchableOpacity>
                        }

                        <View style={menus.header}>
                            <Text style={text.boldWhite}>Dinner</Text>
                        </View>
                        {dinnerPlanner != null ?
                            <TouchableOpacity style={menus.item} onPress={() => navigation.navigate("RecepieDetail", { recepie: dinnerPlanner.recipe })}>
                                <View style={menus.img}>
                                    <Image source={require("../../assets/salad.jpg")} style={menus.img} />
                                </View>
                                <View style={menus.text}>
                                    <TouchableOpacity
                                        onPress={() => deleteRecipes(dinnerPlanner)}
                                        style={menus.delete}
                                    >
                                        <FontAwesome name="trash-o" size={18} color={Colors.black} />
                                    </TouchableOpacity>
                                    <Text numberOfLines={2} style={[text.headerSecondary, { width: 200 }]}>{dinnerPlanner.recipe?.name}</Text>
                                    <Text numberOfLines={2} style={[text.generalBlack, { width: 230 }]}>{dinnerPlanner.recipe?.description}</Text>
                                    <Text style={text.generalGrey}>{dinnerPlanner.recipe?.calories} kcal</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={menus.itemEmpty} onPress={() => goToAddRecipe("dinner")}>
                                <Entypo name="plus" size={36} color={Colors.white} />
                            </TouchableOpacity>
                        }


                        <View style={menus.header}>
                            <Text style={text.boldWhite}>Snacks</Text>
                        </View>
                        {snackPlanner != null ?
                            <TouchableOpacity style={menus.item} onPress={() => navigation.navigate("RecepieDetail", { recepie: snackPlanner.recipe })}>
                                <View style={menus.img}>
                                    <Image source={require("../../assets/salad.jpg")} style={menus.img} />
                                </View>
                                <View style={menus.text}>
                                    <TouchableOpacity
                                        onPress={() => deleteRecipes(snackPlanner)}
                                        style={menus.delete}
                                    >
                                        <FontAwesome name="trash-o" size={18} color={Colors.black} />
                                    </TouchableOpacity>
                                    <Text numberOfLines={2} style={[text.headerSecondary, { width: 200 }]}>{snackPlanner.recipe?.name}</Text>
                                    <Text numberOfLines={2} style={[text.generalBlack, { width: 230 }]}>{snackPlanner.recipe?.description}</Text>
                                    <Text style={text.generalGrey}>{snackPlanner.recipe?.calories} kcal</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={menus.itemEmpty} onPress={() => goToAddRecipe("snack")}>
                                <Entypo name="plus" size={36} color={Colors.white} />
                            </TouchableOpacity>
                        }

                    </ScrollView>
                </View>
            </View>
            <MobileNav current={"planner"} />
        </View>
    )
}

export default Planner;

//Planner Styling
const calendarStrip = StyleSheet.create({
    general: {
        height: 80,
        paddingTop: 0,
        paddingBottom: 0
    },
    selectedContainer: {
        backgroundColor: Colors.secondary,
        borderWidth: 0,
        height: 50,
        borderRadius: 16,
    },
    selectedNumber: {
        color: Colors.black
    },
    selectedDay: {
        color: Colors.black
    }
})

const menus = StyleSheet.create({
    general: {
    },
    itemEmpty: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        marginHorizontal: 12,
        marginVertical: 8,
        height: 140,

        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        marginHorizontal: 24,
        marginTop: 2,
    },
    item: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginHorizontal: 12,
        marginVertical: 8,
        height: 140,
        flexDirection: "row"
    },
    img: {
        borderRadius: 16,
        width: 120,
        height: 140,
    },
    text: {
        paddingVertical: 18,
        paddingHorizontal: 12,
        justifyContent: "center"
    },
    delete: {
        position: "absolute",
        backgroundColor: Colors.red,
        width: 22,
        justifyContent: "center",
        padding: 4,
        borderRadius: 6,
        alignSelf: "flex-end",
        right: 18,
        top: 10,
    }
})
