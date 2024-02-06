import Colors from "../../assets/colors";
import { StyleSheet } from "react-native";


const general = StyleSheet.create({
    general: {
        flex: 9,
    },
    view: {
    },
    scrollView: {
        flex: 9,
        flexDirection: 'column',
        width: "100%",
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    contentContainer: {
        height: '100%',
        alignItems: 'center',
        backgroundColor: Colors.lightgrey,
        paddingBottom: 50
    },
    os: {
        flex: 1, 
        backgroundColor: Colors.black,
    }
})

export default general;