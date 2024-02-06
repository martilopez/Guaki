import Colors from "../../assets/colors";
import { StyleSheet } from "react-native";

// Styling for the login and signup pages
const webCard = StyleSheet.create({
    card: {
        flex: 1,
        width: "85%",
        margin: 175,
        borderRadius: 20,
        alignSelf: 'center',
        elevation: 20,
        minHeight: 500
    },

    background: {
        flex: 1,
        backgroundColor: Colors.secondary
    },

})

export default webCard;