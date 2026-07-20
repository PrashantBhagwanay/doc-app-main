// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { RootStackParamList } from "../App";

// const { width, height } = Dimensions.get("window");

// const LoginScreen = () => {
//     const navigation = useNavigation < RootStackParamList>(); // Hook to access navigation

//     return (
//         <View style={styles.container}>
//             {/* Title */}
//             <Text style={styles.title}>TAI</Text>

//             {/* Buttons */}
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("login")}>
//                     <Text style={styles.buttonText}>SIGN IN</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("signup")}>
//                     <Text style={styles.buttonText}>SIGN UP</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Bottom Image */}
//             <Image source={require("./image.png")} style={styles.bottomImage} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#F8F8F8",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     title: {
//         fontSize: 45,
//         fontWeight: "900",
//         color: "#2B3991",
//         marginBottom: 20,
//     },
//     buttonContainer: {
//         marginTop: 80,
//         width: "80%",
//         alignItems: "center",
//         marginBottom: 150,
//     },
//     button: {
//         backgroundColor: "#2B3991",
//         width: "100%",
//         padding: 15,
//         borderRadius: 10,
//         alignItems: "center",
//         marginVertical: 10,
//     },
//     buttonText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
//     bottomImage: {
//         width: width,
//         height: height * 0.35,
//         resizeMode: "contain",
//         position: "absolute",
//         bottom: 0,
//     },
// });

// export default LoginScreen;


import React, { useEffect, useState } from "react";
import {
    View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, RefreshControl, DevSettings,
    Platform,
    PermissionsAndroid
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const { width, height } = Dimensions.get("window");

const OnboardScreen = () => {
    const navigation = useNavigation<RootStackParamList>();

    const [refreshing, setRefreshing] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    // useEffect(() => {
    //     const getPermissions = async () => {
    //         try {
    //             let cameraPermission: any = await Camera.getCameraPermissionStatus();

    //             if (cameraPermission !== 'authorized') {
    //                 cameraPermission = await Camera.requestCameraPermission();
    //             }

    //             if (Platform.OS === 'android') {
    //                 const granted = await PermissionsAndroid.request(
    //                     PermissionsAndroid.PERMISSIONS.CAMERA,
    //                     {
    //                         title: 'Camera Permission',
    //                         message: 'App needs access to your camera',
    //                         buttonNeutral: 'Ask Me Later',
    //                         buttonNegative: 'Cancel',
    //                         buttonPositive: 'OK',
    //                     }
    //                 );

    //                 setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED && cameraPermission === 'authorized');
    //             } else {
    //                 setHasPermission(cameraPermission === 'authorized');
    //             }
    //         } catch (error) {
    //             console.error('Permission error:', error);
    //             setHasPermission(false);
    //         }
    //     };

    //     getPermissions();
    // }, []);

    // Function to refresh the entire app
    const onRefresh = () => {
        setRefreshing(true);

        // Simulate a short delay before full app reload
        setTimeout(() => {
            setRefreshing(false);
            DevSettings.reload();  // 🔥 Reload the entire app
        }, 1500);  // 1.5-second refresh delay
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Title */}
            {/* <Text style={styles.title}>TAI</Text> */}
            <Image source={require("../../Images/Trangile.Logo.png")} style={styles.image1} />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("login")}>
                    <Text style={styles.buttonText}>SIGN IN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProfileScreen")}>
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Image */}

            <Image source={require("../../Images/image1.png")} style={styles.bottomImage} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    title: {
        fontSize: 45,
        fontWeight: "900",
        color: "#2B3991",
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 80,
        width: "80%",
        alignItems: "center",
        marginBottom: 150,
    },
    image1: {
        width: 100,
        resizeMode: "contain",
        marginBottom: 20,
        // borderWidth:2,
        height: 100
    },
    button: {
        backgroundColor: "#2B3991",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
    },
    bottomImage: {
        width: 100,
        // height: height * 0.35,
        resizeMode: "contain",
        position: "absolute",
        bottom: 0,
        // borderWidth:1
    },
});

export default OnboardScreen;
