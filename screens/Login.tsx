import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from '../assets/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from './components/Button';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import webCard from './styles/webCard';
import form from './styles/forms';
import { useTranslation } from 'react-i18next';
import { useApp } from '@realm/react';
import { InitStackParams } from './Welcome';

const Login = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<InitStackParams>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const app = useApp();

    // signIn() uses the emailPassword authentication provider to log in
    const signIn = useCallback(async () => {
        const creds = Realm.Credentials.emailPassword(email, password);
        await app.logIn(creds);
    }, [app, email, password]);

    // onPressSignIn() uses the emailPassword authentication provider to log in
    const onPressSignIn = useCallback(async () => {
        try {
            await signIn();
        } catch (error: any) {
            Alert.alert(`Failed to sign in: ${error?.message}`);
        }
    }, [signIn]);

    return (
        <View style={webCard.background}>
            <SafeAreaView style={[{ backgroundColor: Colors.white }, webCard.card]}>
                <View style={{ marginHorizontal: 22, justifyContent: 'center' }}>
                    <View style={{ marginBottom: 22 }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            color: Colors.black
                        }}>{t("form.greetingLogin")}
                        </Text>

                        <Text style={{
                            fontSize: 16,
                            color: Colors.black
                        }}>{t("form.smallGreetingLogin")}</Text>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text >{t("form.email")}</Text>

                        <View style={
                            form.text
                        }>
                            <TextInput
                                placeholder={t("form.emailPlaceholder")}
                                placeholderTextColor={Colors.black}
                                keyboardType='email-address'
                                onChangeText={setEmail}
                                style={{
                                    width: "100%"
                                }}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text>{t("form.password")}</Text>

                        <View style={
                            form.text
                        }>
                            <TextInput
                                placeholder={t("form.passwordPlaceholder")}
                                placeholderTextColor={Colors.black}
                                secureTextEntry={isPasswordShown}
                                onChangeText={setPassword}

                                style={{
                                    width: "100%"
                                }}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown == true ? (
                                        <Ionicons name="eye-off" size={24} color={Colors.black} />
                                    ) : (
                                        <Ionicons name="eye" size={24} color={Colors.black} />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        title={t("Login")}
                        onPress={onPressSignIn}
                        filled
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                        }}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: Colors.grey,
                                marginHorizontal: 10
                            }}
                        />
                        <Text style={{ fontSize: 14 }}>{t("or")}</Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: Colors.grey,
                                marginHorizontal: 10
                            }}
                        />
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",

                    }}>
                        <Text style={{ fontSize: 16, color: Colors.black }}>{t("form.alternative")}</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: Colors.primary,
                                fontWeight: "bold",
                                marginLeft: 6
                            }}>{t("form.register")}</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default Login
