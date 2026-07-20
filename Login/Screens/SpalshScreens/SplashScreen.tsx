// import React, { useEffect } from "react";
// import { View, Image, StyleSheet, Dimensions } from "react-native";

// const { width, height } = Dimensions.get("window");

// const SplashScreen = ({ navigation }: any) => {
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             navigation.replace("onboardSlider"); // 👈 replace karega, taki back press pe splash na aaye
//         }, 2500); // 2.5 seconds

//         return () => clearTimeout(timer);
//     }, [navigation]);

//     return (
//         <View style={styles.container}>
//             <Image
//                 source={require("../Login/logo.jpeg")} // 👈 apka logo.png
//                 style={styles.logo}
//                 resizeMode="contain"
//             />
//         </View>
//     );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff", // ya koi aur background
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     logo: {
//         width: width * 0.6,
//         height: height * 0.3,
//     },
// });



import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("onboardSlider"); 
        }, 2500); // 2.5 seconds

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: "https://trangile.com/wp-content/uploads/2024/09/Untitled-design-2025-04-23T163748.770.png",
                }}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: width * 0.6,
        height: height * 0.3,
    },
});