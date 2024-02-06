import Colors from "../../assets/colors";
import { StyleSheet } from "react-native";

// Styling for the login and signup pages
const form = StyleSheet.create({
    text: {
        width: "100%",
        height: 48,
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        paddingLeft: 22,
        alignSelf: 'center'
    },
})

export default form;