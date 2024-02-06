import {
    View,
    Text,
    Pressable,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import Button from "./components/Button";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import webCard from "./styles/webCard";
import form from "./styles/forms";
import { useTranslation } from "react-i18next";
import { useApp } from "@realm/react";
import { InitStackParams } from "./Welcome";

const Signup = () => {

    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const app = useApp();

    const navigation = useNavigation<NativeStackNavigationProp<InitStackParams>>();
    const { t } = useTranslation();

    const signIn = useCallback(async () => {
        //Validate credentials preveously created
        const creds = Realm.Credentials.emailPassword(email, password);
        //Await credentials
        await app.logIn(creds);
    }, [app, email, password]);


    const onPressSignUp = useCallback(async () => {
        try {
            //Register user
            await app.emailPasswordAuth.registerUser({ email, password });
            // Normal signIn
            await signIn();
        } catch (error: any) {
            Alert.alert(`Failed to sign up: ${error?.message}`);
        }
    }, [signIn, app, email, password]);

    return (
        <View style={webCard.background}>
            <SafeAreaView style={[{ backgroundColor: Colors.white }, webCard.card]}>
                <View style={{ marginHorizontal: 22, justifyContent: "center" }}>
                    <View style={{ marginBottom: 22 }}>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: "bold",
                                marginVertical: 12,
                                color: Colors.black,
                            }}
                        >
                            {t("form.greetingSignup")}
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors.black,
                            }}
                        >
                            {t("form.smallGreetingSignup")}
                        </Text>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text>{t("form.email")}</Text>

                        <View style={form.text}>
                            <TextInput
                                placeholder={t("form.emailPlaceholder")}
                                placeholderTextColor={Colors.black}
                                keyboardType="email-address"
                                style={{
                                    width: "100%",
                                }}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text>{t("form.password")}</Text>

                        <View style={form.text}>
                            <TextInput
                                placeholder={t("form.passwordPlaceholder")}
                                placeholderTextColor={Colors.black}
                                secureTextEntry={isPasswordShown}
                                onChangeText={setPassword}
                                style={{
                                    width: "100%",
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                }}
                            >
                                {isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={Colors.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={Colors.black} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        title={t("Signup")}
                        onPress={onPressSignUp}
                        filled
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                        }}
                    />

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 20,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: Colors.grey,
                                marginHorizontal: 10,
                            }}
                        />
                        <Text style={{ fontSize: 14 }}>{t("or")}</Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: Colors.grey,
                                marginHorizontal: 10,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ fontSize: 16, color: Colors.black }}>
                            {t("form.alternative2")}
                        </Text>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors.primary,
                                    fontWeight: "bold",
                                    marginLeft: 6,
                                }}
                            >
                                {t("Login")}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Signup;
