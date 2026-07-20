// import React from "react";
// import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

// const { width, height } = Dimensions.get("window");

// const SplashScreen = () => {
//     return (
//         <View style={styles.container}>
//             {/* Brand Name */}
//             {/* <Text style={styles.brand}>Trangile</Text> */}
//             <View style={styles.mainCont}>
//                 <Image source={require("./Tragilelogo/image.png")} style={styles.image1} />
//                 <Text style={styles.title}>TAI</Text>

//             </View>
//             {/* Main Title */}

//             {/* Image */}

//             {/* Bottom Half-Circle */}
//             {/* <Image source={require("./")} style={styles.bottomCircle} /> */}
//             <Image source={require("./image.png")} style={styles.image} />
//             {/* <View style={styles.bottomCircle} /> */}
//             {/* <View style={styles.bottomCircleUppar} /> */}
//         </View>
//     );
// };




// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#2B3991", // Dark Blue Background
//         alignItems: "center",
//         justifyContent: "center",
//     },

//     mainCont: {
//         // flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         position:"relative",
//         top:-45
//     },
//     image1: {
//         width: 70,
//         resizeMode: "contain",
//         // borderWidth:1,

//     },
//     title: {
//         fontSize: 70,
//         fontWeight: "bold",
//         color: "#fff",
//         position:"relative",
//         top:-20
//         // position: "absolute",
//         // top: 140,
//     },

//     image: {
//         width: width ,
//         height: height * 0.7,
//         resizeMode: "contain",
//         position: "absolute",
//         bottom: -height * 0.17,
//     },

// });

// export default SplashScreen;



import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
    const [screenIndex, setScreenIndex] = useState(0);
    // const texts = ["Trangile Services", "AI Service Demo", "Powering Automation"];
    const screen1 = () => {
        return (< View style={{ ...styles.mainContScreen1 }} >
            <Image source={require("../../Tragilelogo/image.png")} style={styles.imageScreen1} />
            <Text style={{ ...styles.title, fontSize: 20 }}>AI Service Demo</Text>
        </View >)
    }
    const screen2 = () => {
        return (< View style={{...styles.mainCont,top:-80}} >
            <Image source={require("../../Tragilelogo/image.png")} style={styles.image1} />
            <Text style={styles.title}></Text>
        </View >)
    }
    const screen3 = () => {
        return (< View style={{...styles.mainCont,top:-43}} >
            <Image source={require("../../Tragilelogo/image.png")} style={{...styles.image1,marginBottom:70}} />
            <Text style={{...styles.title,width:250,textAlign:"center",fontSize:25}}>Powering Automation with Structured Ai</Text>
        </View >)
    }


    // Array of screens
    const screens = [screen1, screen2, screen3];
    // const screens = [screen3];

    useEffect(() => {
        const interval = setInterval(() => {
            setScreenIndex((prevIndex) => (prevIndex + 1) % screens.length);
        }, 1000); // Change screen every 1 second

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>

            {screens[screenIndex]()}
            <Image source={require("../../Images/image.png")} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2B3991", // Dark Blue Background
        alignItems: "center",
        justifyContent: "center",
    },
    mainCont: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        top: -45,
    },
    mainContScreen1: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        top: -100
    },
    imageScreen1: {
        width: 90,
        resizeMode: "contain",
        marginBottom: 50
    },
    image1: {
        width: 150,
        resizeMode: "contain",
        marginBottom: 20
    },
    title: {
        fontSize: 30,
        fontWeight: "400",
        color: "#fff",
        position: "relative",
        top: -20,
    },
    image: {
        width: width,
        height: height * 0.7,
        resizeMode: "contain",
        position: "absolute",
        bottom: -height * 0.17,
    },
});

export default SplashScreen;
