import Colors from "../../assets/colors";
import { StyleSheet } from "react-native";

//Styling for text throughout the app
const text = StyleSheet.create({
    generalBlack: {
        color: Colors.black,
        fontSize: 14
    },
    generalWhite: {
        color: Colors.white,
        fontSize: 14
    },
    generalGrey: {
        color: Colors.grey,
        fontSize: 14
    },
    generalSecondary: {
        color: Colors.secondary,
        fontSize: 14
    },

    headerGrey: {
        fontWeight: "bold",
        color: Colors.grey,
        fontSize: 18
    },
    headerSecondary: {
        fontWeight: "bold",
        color: Colors.secondary,
        fontSize: 18
    },
    headerBlack: {
        fontWeight: "bold",
        color: Colors.black,
        fontSize: 18
    },
    headerWhite: {
        fontWeight: "bold",
        color: Colors.white,
        fontSize: 18
    },
    supertitle: {
        fontWeight: "900",
        color: Colors.white,
        fontSize: 26,
    },
    title: {
        fontWeight: "bold",
        color: Colors.white,
        fontSize: 22,
    },
    titleBlack: {
        fontWeight: "bold",
        color: Colors.black,
        fontSize: 22,
    },
    titleGrey: {
        fontWeight: "bold",
        color: Colors.grey,
        fontSize: 22,
    },
    titleSecondary: {
        fontWeight: "bold",
        color: Colors.secondary,
        fontSize: 22,
        paddingBottom: 5
    },
    subtitle: {
        color: Colors.light,
        fontSize: 18,
        paddingBottom: 10,
        textAlign: 'center',
    },

    normal: {
        color: Colors.black,
        fontSize: 16,
        paddingBottom: 2
    },
    SecondaryBold: {
        fontWeight: "bold",
        color: Colors.secondary,
        fontSize: 16,
        paddingBottom: 2
    },
    BlackBold: {
        fontWeight: "bold",
        color: Colors.black,
        fontSize: 16,
        paddingBottom: 2
    },
    GreyBold: {
        fontWeight: "bold",
        color: Colors.grey,
        fontSize: 14,
        paddingBottom: 2
    },
    normalWhite: {
        color: Colors.white,
        fontSize: 16,
        paddingBottom: 2
    },
    boldWhite: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: "bold",
    },
    subnormal: {
        color: Colors.grey,
        fontSize: 14

    },

})

export default text;