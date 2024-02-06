import Colors from "../../assets/colors";
import { realmContext } from "../../RealmContext";
import { Fooditem } from "../props/FoodAPI";
import { View, Text, StyleSheet, Image } from "react-native";
import text from "../styles/text";

interface RecepieDetailProps {
    route: {
        params: {
            item: Fooditem;
        };
    };
}

const FoodInfo: React.FC<RecepieDetailProps> = ({ route }) => {
    const { item } = route.params;

    const getColorFromRating = (rating: string): string => {
        switch (rating.toLowerCase()) {
            case 'a':
                return 'green';
            case 'b':
                return 'yellow';
            case 'c':
                return 'orange';
            case 'd':
                return 'red';
            default:
                return 'black'; // Default color if rating is not recognized
        }
    };

    //Format the allergens string
    const formattedString = item.allergens.map(allergen => {
        const parts = allergen.split(':');
        return parts.length === 2 ? parts[1] : allergen;
    }).join(', ');

    // Get the color based on the rating
    const textColor = getColorFromRating(item.nutriscore);

    //Item page component
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={{ maxHeight: 220 }}>
                <Image source={{ uri: item.img }} style={info.img} />
            </View>
            <View style={info.headerContainer}>
                <Text style={text.titleBlack}>{item.name}</Text>
                <Text style={text.generalGrey}>{item.brand}</Text>
                <Text style={text.headerBlack}>Nutri-Score: <Text style={{ color: textColor }}>{item.nutriscore.toLocaleUpperCase()}</Text></Text>
            </View>
            <View
                style={{
                    height: 1,
                    backgroundColor: Colors.lightgrey,
                    marginVertical: 4,
                    marginHorizontal: 22,
                    marginBottom: 8,
                }}
            />
            <View style={info.nutrientsContainer}>
                <View style={info.smallContainer}>
                    <Text style={text.BlackBold}>Allergens: </Text>
                    <Text style={text.generalGrey}>{formattedString}</Text>
                </View>
            </View>
            <View
                style={{
                    height: 1,
                    backgroundColor: Colors.lightgrey,
                    marginVertical: 4,
                    marginHorizontal: 22,
                    marginBottom: 8,
                }}
            />
            <View style={info.nutrientsContainer}>
                <View style={info.smallContainer}>
                    <Text style={text.BlackBold}>Nutrients </Text>
                    <Text style={text.generalGrey}>per 100g</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
                <View style={info.smallContainer}>
                    <Text style={text.generalBlack}>Protein: </Text>
                    <Text style={text.generalGrey}>{item.protein} g</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
                <View style={info.smallContainer}>
                    <Text style={text.generalBlack}>Fat: </Text>
                    <Text style={text.generalGrey}>{item.fat} g</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
                <View style={info.smallContainer}>
                    <Text style={text.generalBlack}>Carbohydrates: </Text>
                    <Text style={text.generalGrey}>{item.carbs} g</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
                <View style={info.smallContainer}>
                    <Text style={text.generalBlack}>Fiber: </Text>
                    <Text style={text.generalGrey}>{item.fiber} g</Text>
                </View>

                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
                <View style={info.smallContainer}>
                    <Text style={text.generalBlack}>Sugar: </Text>
                    <Text style={text.generalGrey}>{item.surgar} g</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
                <View style={info.smallContainer}>
                    <Text style={text.generalBlack}>Salt: </Text>
                    <Text style={text.generalGrey}>{item.salt} g</Text>
                </View>
                <View
                    style={{
                        height: 1,
                        backgroundColor: Colors.secondary,
                        marginVertical: 4,
                    }}
                />
            </View>
        </View>
    )
}

export default FoodInfo;

const info = StyleSheet.create({
    headerContainer: {
        paddingTop: 32,
        paddingBottom: 12,
        paddingHorizontal: 24
    },
    nutrientsContainer: {
        paddingHorizontal: 24,
    },
    smallContainer: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    img: {
        position: "relative",
        width: "100%",
        height: 220,

    },
})
