import { View, Text, Image, SafeAreaView, Platform } from "react-native";
import React from "react";
import Colors from "../assets/colors";
import Button from "./components/Button";
import { useNavigation } from "@react-navigation/core";
import { LinearGradient } from "expo-linear-gradient";
import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from "@react-navigation/native-stack";
import webCard from "./styles/webCard";
import { useTranslation } from "react-i18next";
import text from "./styles/text";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Login";
import Signup from "./Signup";

export type InitStackParams = {
    Welcome: any;
    Login: any;
    Signup: any;
};

const Stack = createNativeStackNavigator();

const Initial = () => {
    //Returns welcome and session stack
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    animation: Platform.OS != "ios" ? "none" : "fade",
                    presentation: "card",
                    orientation: "portrait_up",
                }}
            >
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{
                        headerShown: false,
                        animation: "simple_push",
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false,
                        animation: "simple_push",
                    }}
                />
                <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{
                        headerShown: false,
                        animation: "simple_push",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

//Welcome page component
const Welcome = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<InitStackParams>>();
    const { t } = useTranslation();

    return (
        <View style={webCard.background}>
            <LinearGradient
                style={{ flex: 1 }}
                colors={[Colors.secondary, Colors.primary]}
            >
                <SafeAreaView style={{ flex: 1, top: "20%" }}>
                    {/* content  */}

                    <Image
                        style={{
                            height: 150,
                            width: 150,
                            borderRadius: 20,
                            position: "absolute",
                            alignSelf: "center",
                        }}
                        source={require("../assets/guakilogoShadow.png")}
                    />

                    <View
                        style={{
                            paddingHorizontal: 22,
                            position: "absolute",
                            top: 175,
                            width: "100%",
                        }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text style={text.title}>{t("Welcome.greeting")}</Text>
                            <Text style={text.title}>{t("Welcome.greeting2")}</Text>
                        </View>

                        <View style={{ marginVertical: 22, alignItems: "center" }}>
                            <Text style={text.subtitle}>{t("Welcome.intro1")}</Text>
                            <Text style={text.subtitle}>{t("Welcome.intro2")}</Text>
                        </View>

                        <Button
                            title={t("Signup")}
                            onPress={() => navigation.navigate("Signup")}
                            style={{
                                marginTop: 22,
                                width: "100%",
                            }}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 10,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: Colors.primarydark,
                                    marginHorizontal: 10,
                                }}
                            />
                            <Text style={{ fontSize: 14, color: Colors.white }}>
                                {t("or")}
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: Colors.primarydark,
                                    marginHorizontal: 10,
                                }}
                            />
                        </View>
                        <Button
                            title={t("Login")}
                            onPress={() => navigation.navigate("Login")}
                            style={{
                                width: "100%",
                            }}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 12,
                                justifyContent: "center",
                            }}
                        ></View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};

export default Initial;
