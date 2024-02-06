import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Colors from "../../assets/colors";
import { useTranslation } from "react-i18next";
import text from "../styles/text";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../App";

interface PageTitleProps {
    title: string;
}

//Component that renders the title of the screen 
const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    //Translation Props
    const { t } = useTranslation();
    var tag: string = "nav." + title

    //Nav Props
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    return (
        <View style={[user.ios, { justifyContent: 'center', flex: 1, backgroundColor: Colors.primarydark }]}>
            <Text style={[text.supertitle, { marginLeft: 20 }]}>{t(tag)}</Text>
            {title != "User" && <TouchableOpacity
                style={user.wrapper}
                onPress={() => navigation.navigate("User")}
            >
                <FontAwesome name="user-circle" size={24} color={Colors.white} style={{ marginTop: 37 }} />
            </TouchableOpacity>}
            <View
                style={{
                    height: 1,
                    backgroundColor: Colors.secondary,
                    marginHorizontal: 20,
                    marginTop: 5,
                }}
            />
        </View>
    );
}

export default PageTitle;

const user = StyleSheet.create({
    wrapper: {
        position: "absolute",
        right: 25
    },
    ios: {
        paddingTop: 40
    }
})
