import { View, Text, Platform, ScrollView, TouchableOpacity, TextInput, StyleSheet, FlatList, Switch, Keyboard } from "react-native";
import general from "../styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { StackParams } from "../../App";
import MobileNav from "../components/MobileNav";
import PageTitle from "../components/PageTitle";
import Colors from "../../assets/colors";
import text from "../styles/text";
import { useTranslation } from "react-i18next";
import RecepieList from "./RecepieList";
import { useEffect, useState } from "react";
import { FavouriteRecipes, Recepies } from "../../schema/recepies";
import { realmContext } from "../../RealmContext";
import { Food, FoodPantry } from "../../schema/food";
import SearchDropdown from "./SearchDropdown";
import { useUser } from "@realm/react";
import { deleteLastWord, getLastWord, quitarTildesYMayusculas } from "./Search";
import FilterFoods from "./FilterFoods";
import RecipeCarousel from "./RecipeCarousel";

const { useRealm, useQuery } = realmContext;

const Recipes = () => {
    // Navigarion and translation
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const { t } = useTranslation();

    //Search init
    const [searching, setSearching] = useState(false)
    const [search, setSearch] = useState('');

    // Realm init
    const RecepieRealm = useRealm();
    const user = useUser();
    const Recipes = useQuery(Recepies).sorted('_id');

    //Recepies props
    const formatedRecipes = Recipes?.map((recipe) => recipe) ?? []
    const [filteredRecipes, setFilteredRecipes] = useState<Recepies[]>([])

    //Food Filte props
    const food = RecepieRealm.objects(Food)
    const [filterFoodRecomendation, setFilterFoodRecomendation] = useState<Food | null>()
    const [foodFilters, setFoodFilters] = useState<Food[]>([])

    //Pantry Filter props
    const [onlyPantry, setOnlyPantry] = useState<boolean>(true)
    const [userPantryIngredients, setUserPantryIngredients] = useState<Food[]>([]);

    // Fav Recepies props
    const userFavsRes = RecepieRealm.objects(FavouriteRecipes).filtered('owner_id = $0', user?.id)[0];
    const userFavRecipes = userFavsRes?.items.map((recipe) => recipe) ?? []

    // Page management
    const [onFavourites, setOnFavourites] = useState<boolean>(false)

    //Refreshing realm subscriptions
    useEffect(() => {
        // Add a listener for when the screen is focused
        const onFocus = () => {
            console.log('Recipes is focused. Refreshing...');
            RecepieRealm.subscriptions.update(mutableSubs => {
                mutableSubs.add(RecepieRealm.objects(Recepies).sorted('_id'));
                mutableSubs.add(RecepieRealm.objects(Food).sorted('_id'));
                mutableSubs.add(RecepieRealm.objects(FoodPantry).filtered('owner_id = $0', user?.id));
                mutableSubs.add(RecepieRealm.objects(FavouriteRecipes).filtered('owner_id = $0', user?.id));
            });
        };
        const unsubscribe = navigation.addListener('focus', onFocus);
        return () => {
            // Clean up the listener when the component is unmounted
            unsubscribe();
        };
    }, [navigation, RecepieRealm]);

    // Search managment
    // Applies food filter if its on
    useEffect(() => {
        var recipes = Recipes.filtered("name CONTAINS[c] $0", search).slice();
        if (onlyPantry) {
            recipes = pantryFilter(recipes)
        }
        if (FilterFoods.length > 0) {
            recipes = ingredientFilter(recipes)
        }
        setFilteredRecipes(recipes)

        var lastWord = getLastWord(search)
        for (let element of food) {
            if (lastWord != null) {
                const itemTranslated = quitarTildesYMayusculas(t("food." + element.name))
                lastWord = quitarTildesYMayusculas(lastWord)

                if (lastWord == itemTranslated) {
                    console.log("Food filter succesful: " + element.name)
                    const item = food.filtered("name == $0", element.name).slice()[0]
                    setFilterFoodRecomendation(item)
                    break;
                }
                else {
                    setFilterFoodRecomendation(null)
                }
            }
        }
    }, [search, foodFilters, searching, onlyPantry]);

    //Gets user pantry ingredients
    useEffect(() => {
        const userPantry = RecepieRealm.objects(FoodPantry).filtered('owner_id = $0', user?.id)[0];
        setUserPantryIngredients(userPantry?.items.map((ingredient) => ingredient) ?? []);
    }, [onFavourites])

    // Seach visuals management
    const onSearch = (search: string) => {
        if (search.length > 0) {
            setSearching(true);
        }
        else {
            setSearching(false);
        }
        setSearch(search);
    }

    // Filter in charge of checking if the user has all the items in order to complete the recepie
    const pantryFilter = (recipes: Recepies[]) => {
        const validRecipes: Recepies[] = []

        // Iterate the recepies        
        recipes.forEach(recipe => {
            var validRecipe = true

            // Get the recipe ingredients
            const ingredients = recipe.ingredients ? recipe.ingredients.map((ingredient) => ingredient) : [];

            // Iteration of the recipe ingredients
            for (let recipeIngredient of ingredients) {
                if (recipeIngredient.food != undefined) {
                    const item = recipeIngredient.food;
                    var validIngredient = false;

                    // Iteration of the pantry ingredients
                    for (let pantryIngredient of userPantryIngredients) {

                        // Check that the user has the recipe ingredient
                        if (recipeIngredient.food?._id.equals(pantryIngredient._id)) {
                            validIngredient = true;
                            break;
                        }
                    };
                    if (!validIngredient) {
                        //User doesnt have an ingredient so recepie completion is false                        
                        validRecipe = false
                    }
                }
            }
            //If its valid we show it to the user
            if (validRecipe) {
                validRecipes.push(recipe);
            }
        });
        return validRecipes;
    }

    // Handles the food filter
    const addFoodFilter = (filter: Food) => {
        var found = false;
        for (let item of foodFilters) {
            if (item.name == filter.name) {
                found = true;
            }
        }
        if (!found) {
            console.log("Adding to FoodFilters: " + filter.name)
            setFoodFilters((prevList) => [...prevList, filter]);
            setSearch(deleteLastWord(search))
        }
        setFilterFoodRecomendation(null)
    }

    // Removes the food filter
    const removeFoodFilter = (filterToRemove: Food) => {
        console.log("Deleting food filter: " + filterToRemove.name)
        setFoodFilters((prevList) => prevList.filter(filter => filter !== filterToRemove));
        console.log("food filter remove search: " + search)
        onSearch(search)
    }

    const getFoodFilters = () => {
        var res = ""
        foodFilters.forEach(element => {
            res += element.name.toString() + " "
        });
        return res;
    }

    // Checks if there is a food filter in the recepie list and returns only the ones that have the specified ingredient
    const ingredientFilter = (recipes: Recepies[]) => {
        const validRecipes: Recepies[] = []
        recipes.forEach(recipe => {
            var validRecipe = false
            const ingredients = recipe.ingredients ? recipe.ingredients.map((ingredient) => ingredient) : [];
            let counter = 0

            // Iteration of the recipe ingredients
            for (let recipeIngredient of ingredients) {
                if (recipeIngredient.food != undefined) {
                    for (let foodFilter of foodFilters) {
                        if (recipeIngredient.food._id.equals(foodFilter._id)) {
                            counter++;
                            break;
                        }
                    }
                    if (counter == foodFilters.length) {
                        validRecipe = true
                        break;
                    }
                }
            }

            //If its valid we add it to the returned recepies

            if (validRecipe) {
                validRecipes.push(recipe);
            }
        });
        return validRecipes;
    }

    // Recepies screen
    return (
        <View style={general.os}>
            <View style={[general.general]}>
                <PageTitle title="Recepies" />
                <View style={{
                    flex: 10,
                    backgroundColor: Colors.primarydark,
                }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingBottom: 5, }}>
                            <View style={{ flexDirection: "row", gap: 20, alignSelf: "center", paddingBottom: 10 }}>
                                <TouchableOpacity onPress={() => setOnFavourites(false)}>
                                    {onFavourites ?
                                        <Text style={text.headerWhite}>{t("recipes.discover")}</Text>
                                        :
                                        <View style={{ flexDirection: "column" }} >
                                            <Text style={text.headerWhite}>{t("recipes.discover")}</Text>
                                            <View
                                                style={{
                                                    height: 2,
                                                    backgroundColor: Colors.secondary,
                                                    marginHorizontal: 10,

                                                }}
                                            />
                                        </View>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setOnFavourites(true)}>
                                    {onFavourites ?
                                        <View style={{ flexDirection: "column" }} >
                                            <Text style={text.headerWhite}>{t("recipes.favourites")}</Text>
                                            <View
                                                style={{
                                                    height: 2,
                                                    backgroundColor: Colors.secondary,
                                                    marginHorizontal: 10,

                                                }}
                                            />
                                        </View>
                                        :
                                        <Text style={text.headerWhite}>{t("recipes.favourites")}</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        {onFavourites ?
                            <View>
                                <RecepieList
                                    data={userFavRecipes}
                                />
                            </View>
                            :
                            <View>
                                <View style={{ elevation: 2, zIndex: 2, marginHorizontal: 20 }}>
                                    <View style={
                                        recepies.form
                                    }>
                                        <TextInput
                                            placeholder={t("recipes.search")}
                                            placeholderTextColor={Colors.white}
                                            value={search}
                                            onChangeText={onSearch}
                                            style={{
                                                width: "100%",
                                                color: Colors.white,
                                                fontWeight: "bold"
                                            }}
                                        />
                                        {filterFoodRecomendation != null && !foodFilters.includes(filterFoodRecomendation) && foodFilters.length < 3 ? <SearchDropdown data={filterFoodRecomendation} setFilter={addFoodFilter} /> : null}
                                    </View >
                                </View>
                                <View style={[recepies.toggle, { elevation: 1, zIndex: 1, flexDirection: "column", marginHorizontal: 20 }]}>
                                    <View style={recepies.toggle}>
                                        <Text style={[text.generalWhite, recepies.toggleText]}>
                                            Search only with ingredients in the pantry
                                        </Text>
                                        <Switch
                                            onValueChange={setOnlyPantry}
                                            trackColor={{ false: Colors.tertiary, true: Colors.secondary }}
                                            thumbColor={Colors.lightgrey}
                                            ios_backgroundColor="#3e3e3e"
                                            value={onlyPantry}
                                        />
                                    </View>
                                    <View style={recepies.filters}>

                                        <FilterFoods data={foodFilters} removeFilter={removeFoodFilter} />
                                    </View>
                                </View>
                                {searching || foodFilters.length > 0 ?
                                    <View style={{ zIndex: 1, }}>
                                        {filteredRecipes.length > 0 ? <RecepieList
                                            data={filteredRecipes}
                                        /> :
                                            <View style={recepies.main}>
                                                <Text style={text.boldWhite}>No results</Text>
                                                <Text style={text.generalWhite}>Food Filter(s): {getFoodFilters()}
                                                </Text>
                                                <Text style={text.generalWhite}>Pantry ingredients only: {onlyPantry ? "ON" : "OFF"}</Text>

                                            </View>
                                        }

                                    </View>
                                    :
                                    <View style={{ zIndex: 1 }}>
                                        <Text style={[text.headerWhite, { marginTop: 6, marginHorizontal: 20 }]}> Recommendations</Text>
                                        <Text style={[text.generalWhite, { marginBottom: 6, marginHorizontal: 20 }]}> according to the items in your pantry</Text>
                                        <RecipeCarousel
                                            data={formatedRecipes}
                                        />
                                        <Text style={[text.headerWhite, { marginVertical: 6, marginHorizontal: 20 }]}>Our Recipes</Text>
                                        <RecipeCarousel
                                            data={ingredientFilter(formatedRecipes)}
                                        />
                                    </View>
                                }
                            </View>
                        }
                    </View>
                </View>
            </View>
            <MobileNav current={"recepies"} />
        </View>
    );
}

export default Recipes;

//Recepies styling
const recepies = StyleSheet.create({
    form: {
        width: "100%",
        height: 48,
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        paddingLeft: 22,
        alignSelf: 'center'
    },
    toggle: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 6,
    },
    toggleText: {
        textAlignVertical: "center",
        alignSelf: "center"
    },
    main: {
        marginTop: 150,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
        alignSelf: "center"
    },
    filters: {
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 6,
        paddingVertical: 0,
    }
})