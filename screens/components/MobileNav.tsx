import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../App";
import Colors from "../../assets/colors";
import { useTranslation } from "react-i18next";

import {
    MaterialCommunityIcons,
} from "@expo/vector-icons";

interface tabs {
    current: 'recepies' | 'scan' | 'pantry' | 'planner' | 'user';
}

//Navigation component
const MobileNav: React.FC<tabs> = ({ current }) => {
    //Translation props
    const { t } = useTranslation();

    //Navigation props
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    return (
        <View style={[nav.general, Platform.OS === 'ios' && nav.iosContainer]}>
            <TouchableOpacity
                style={nav.buttonNav}
                onPressIn={() => navigation.navigate("Recipes")}
            >
                <MaterialCommunityIcons name="bookshelf"
                    size={30}
                    color={current == "recepies" ? Colors.secondary : Colors.white} style={nav.buttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity
                style={nav.buttonNav}
                onPressIn={() => navigation.navigate("Scanner")}
            >
                <MaterialCommunityIcons name="barcode-scan"
                    size={30}
                    color={current == "scan" ? Colors.secondary : Colors.white} style={nav.buttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity
                style={nav.buttonNav}
                onPressIn={() => navigation.navigate("Pantry")}
            >
                <MaterialCommunityIcons name="food-variant"
                    size={30}
                    color={current == "pantry" ? Colors.secondary : Colors.white} style={nav.buttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity
                style={nav.buttonNav}
                onPressIn={() => navigation.navigate("Planner")}
            >
                <MaterialCommunityIcons name="calendar-month"
                    size={30}
                    color={current == "planner" ? Colors.secondary : Colors.white} style={nav.buttonIcon} />
            </TouchableOpacity>
        </View>
    );
};

export default MobileNav;

// Navigation styling
const nav = StyleSheet.create({
    general: {

        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        gap: 20,
        backgroundColor: Colors.primarydark,
        flex: 0.75,
        elevation: 5,
        borderColor: Colors.light,
        borderTopWidth: 1,
        width: "100%",
    },
    iosContainer: {
        gap: 10,
        paddingBottom: 10
    },
    buttonNav: {
        alignContent: "center",
        margin: 5,
    },
    buttonIcon: {
        alignSelf: "center"
    },
    text: {
        alignSelf: "center"
    },
    active: {
        backgroundColor: Colors.primarydark
    },
    notActive: {
        backgroundColor: Colors.grey
    }
});
