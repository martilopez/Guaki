import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Button,
    TouchableOpacity,
} from "react-native";
import MobileNav from "./components/MobileNav";
import general from "./styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { StackParams } from "../App";
import text from "./styles/text";
import Colors from "../assets/colors";
import { useTranslation } from "react-i18next";
import PageTitle from "./components/PageTitle";
import { useAuth, useUser } from "@realm/react";
import { AntDesign } from "@expo/vector-icons";

const User = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const { t } = useTranslation();

    const user = useUser();
    const { logOut } = useAuth();
    const performLogout = () => {
        logOut();
    };
    return (
        <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
            <View style={general.scrollView}>
                <PageTitle title="User" />
                <View
                    style={{
                        flex: 10,
                        backgroundColor: Colors.primarydark,
                    }}
                >
                    <View style={profile.section}>
                        <Text style={text.title}>Session</Text>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: Colors.grey,
                                margin: 10,
                                width: "70%",
                                alignSelf: "center",
                            }}
                        />
                        <View style={profile.item}>
                            <Text style={text.normalWhite}>Logout: </Text>

                            <TouchableOpacity
                                accessibilityLabel="Learn more about this purple button"
                                onPress={performLogout}
                                style={profile.logout}
                            >
                                <AntDesign name="logout" size={24} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <MobileNav current="user" />
        </View>
    );
};

export default User;

const profile = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    item: {
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
    },
    divider: {
        height: 2,
        backgroundColor: Colors.primary,
        marginTop: 10,
        width: "25%",
        alignSelf: "center",
    },
    logout: {
        backgroundColor: Colors.secondary,
        padding: 6,
        borderRadius: 8,
    },
});
