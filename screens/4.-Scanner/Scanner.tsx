import { View, TouchableOpacity, StyleSheet, Text, Button } from "react-native";
import general from "../styles/general";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { StackParams } from "../../App";
import MobileNav from "../components/MobileNav";
import PageTitle from "../components/PageTitle";
import Colors from "../../assets/colors";
import { Camera, CameraType } from "expo-camera";
import { useEffect, useState } from "react";
import text from "../styles/text";
import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from "expo-barcode-scanner";
import { fetchFoodItemData } from "../props/FoodAPI";

const Scanner = () => {
    //Navigation props
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    //Scanner Props
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);

        fetchFoodItemData(data).then((foodItem) => {
            if (foodItem) {
                console.log('Mapped Fooditem:', foodItem);
                // Navigate to the food info page
                navigation.navigate("FoodInfo", { item: foodItem })
            } else {
                //Show error message
                console.log('Failed to fetch food item data: ' + data);
            }
        });
    };

    // Camera permision message handling
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // When persmision is given 
    return (
        <View style={general.os}>
            <View style={[general.general]}>
                <View style={{
                    flex: 10,
                    backgroundColor: Colors.primarydark,
                }}>

                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <Text style={[text.supertitle, { marginLeft: 20, paddingTop: 55 }]}>Scan</Text>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.secondary,
                            marginHorizontal: 20,
                            marginTop: 5,
                        }}
                    />
                    {scanned &&
                        <TouchableOpacity style={scanner.camera} onPress={() => setScanned(false)}>
                            <View style={scanner.button}>
                                <Text style={text.SecondaryBold}>Tap screen to scan again</Text>
                            </View>
                        </TouchableOpacity>
                    }

                </View>
            </View>
            <MobileNav current={"scan"} />
        </View>
    );
}

export default Scanner;

const scanner = StyleSheet.create({
    camera: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignSelf: "center",
    },
    buttonContainer: {
        flexDirection: "column",
        alignSelf: "center",
    },
    button: {
        width: "70%",
        padding: 12,
        margin: 12,
        borderRadius: 32,
        backgroundColor: Colors.white
    }
})
