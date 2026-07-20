// import { useNavigation } from '@react-navigation/native';
// import React, { useRef } from 'react';
// import {
//     View,
//     Text,
//     Animated,
//     Image,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions
// } from 'react-native';
// // import FastImage from 'react-native-fast-image';
// import { ImageBackground } from 'react-native';


// const { width } = Dimensions.get('window');

// const slides = [
//     {
//         key: '1',
//         title: 'Import files from multiple sources',

//         centerIcon: require('../assets/tilesImage/bluetooth.png'),
//         icons: [
//             // require('../assets/tilesImage/phone.png'),
//             require('../assets/tilesImage/usb.png'),
//             require('../assets/tilesImage/cloud.png'),
//             require('../assets/tilesImage/web.png'),
//             require('../assets/tilesImage/photos.png'),
//         ],
//     },
//     {
//         key: '2',
//         title: 'Supports all file formats',
//         centerIcon: require('../assets/tilesImage/csv.png'),
//         icons: [
//             require('../assets/tilesImage/word.png'),
//             require('../assets/tilesImage/pdf.png'),
//             require('../assets/tilesImage/ppt.png'),
//             require('../assets/tilesImage/tsxt.png'),
//             require('../assets/tilesImage/excel.png'),
//         ],
//     },
//     {
//         key: '3',
//         title: 'Quick print with an easy mobile scan',
//         centerIcon: require('../assets/tilesImage/printerStatic.png'),
//         icons: [
//             require('../assets/tilesImage/scanner.png'),
//             require('../assets/tilesImage/faceid.png'),
//             require('../assets/tilesImage/fingerprint.png'),
//             require('../assets/tilesImage/esignature.png'),
//             require('../assets/tilesImage/email.png'),
//         ],
//     },
// ];

// const OnboardingSlider = ({ navigations }: any) => {
//     const scrollX = useRef(new Animated.Value(0)).current;

//      const navigation = useNavigation();
//     // 🎯 Custom animation for icons moving outward from center
//     const renderIconsWithAnimation = (icons: any[], index: number) => {
//         const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

//         const offsets = [
//             { x: -100, y: -100 }, // top-left
//             { x: 100, y: -100 },  // top-right
//             { x: -100, y: 100 },  // bottom-left
//             { x: 100, y: 100 },   // bottom-right
//             { x: 0, y: 130 },     // bottom-center
//         ];

//         return icons.map((icon, i) => {
//             const translateX = scrollX.interpolate({
//                 inputRange,
//                 outputRange: [0, offsets[i].x, 0],
//                 extrapolate: 'clamp',
//             });

//             const translateY = scrollX.interpolate({
//                 inputRange,
//                 outputRange: [0, offsets[i].y, 0],
//                 extrapolate: 'clamp',
//             });

//             const scale = scrollX.interpolate({
//                 inputRange,
//                 outputRange: [0.5, 1, 0.5],
//                 extrapolate: 'clamp',
//             });

//             return (
//                 <Animated.Image
//                     key={i}
//                     source={icon}
//                     style={[
//                         styles.icon,
//                         {
//                             transform: [{ translateX }, { translateY }, { scale }],
//                         },
//                     ]}
//                 />
//             );
//         });
//     };

//     const renderItem = ({ item, index }: any) => (
//         <View style={styles.slide}>
//             <View style={styles.iconWrapper}>
//                 {renderIconsWithAnimation(item.icons, index)}
//                 <Image source={item.centerIcon} style={styles.centerImage} />
//             </View>
//             <Text style={styles.title}>{item.title}</Text>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <Animated.FlatList
//                 horizontal
//                 pagingEnabled
//                 data={slides}
//                 keyExtractor={(item) => item.key}
//                 renderItem={renderItem}
//                 showsHorizontalScrollIndicator={false}
//                 onScroll={Animated.event(
//                     [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//                     { useNativeDriver: false }
//                 )}
//             />

//             {/* Page Dots */}
//             <View style={styles.pagination}>
//                 {slides.map((_, i) => {
//                     const opacity = scrollX.interpolate({
//                         inputRange: [(i - 1) * width, i * width, (i + 1) * width],
//                         outputRange: [0.3, 1, 0.3],
//                         extrapolate: 'clamp',
//                     });
//                     return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
//                 })}
//             </View>

//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={() => navigation.navigate('login')}>
//                 <Text style={styles.buttonText}>Welcome</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default OnboardingSlider;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     slide: {
//         width,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//     },
//     iconWrapper: {
//         width: 400,
//         height: 400,
//         alignItems: 'center',
//         justifyContent: 'center',
//         position: 'relative',
//     },
//     centerImage: {
//         width: 100,
//         height: 100,
//         zIndex: 10,
//         position: 'absolute',
//     },
//     icon: {
//         width: 60,
//         height: 60,
//         position: 'absolute',
//     },
//     title: {
//         fontSize: 24,
//         fontFamily: 'Poppins-Bold',
//         fontWeight: '600',
//         textAlign: 'center',
//         marginTop: 20,
//         color: '#333',
//     },
//     pagination: {
//         flexDirection: 'row',
//         alignSelf: 'center',
//         marginVertical: 20,
//     },
//     dot: {
//         height: 8,
//         width: 8,
//         borderRadius: 4,
//         backgroundColor: '#4A90E2',
//         marginHorizontal: 5,
//     },
//     button: {
//         backgroundColor: '#4A90E2',
//         marginHorizontal: 40,
//         paddingVertical: 14,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginBottom: 60,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });






import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
// import FastImage from 'react-native-fast-image';
import { ImageBackground } from 'react-native';


const { width } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Import files from multiple sources',

        centerIcon: require('../assets/tilesImage/bluetooth.png'),
        icons: [
            // require('../assets/tilesImage/phone.png'),
            require('../assets/tilesImage/usb.png'),
            require('../assets/tilesImage/cloud.png'),
            require('../assets/tilesImage/web.png'),
            require('../assets/tilesImage/photos.png'),
        ],
    },
    {
        key: '2',
        title: 'Supports all file formats',
        centerIcon: require('../assets/tilesImage/csv.png'),
        icons: [
            require('../assets/tilesImage/word.png'),
            require('../assets/tilesImage/pdf.png'),
            require('../assets/tilesImage/ppt.png'),
            require('../assets/tilesImage/tsxt.png'),
            require('../assets/tilesImage/excel.png'),
        ],
    },
    {
        key: '3',
        title: 'Quick print with an easy mobile scan',
        centerIcon: require('../assets/tilesImage/printerStatic.png'),
        icons: [
            require('../assets/tilesImage/scanner.png'),
            require('../assets/tilesImage/faceid.png'),
            require('../assets/tilesImage/fingerprint.png'),
            require('../assets/tilesImage/esignature.png'),
            require('../assets/tilesImage/email.png'),
        ],
    },
];

const OnboardingSlider = ({ navigations }: any) => {
    const scrollX = useRef(new Animated.Value(0)).current;

    const navigation = useNavigation();

    const renderIconsWithAnimation = (icons: any[], index: number) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const offsets = [
            { x: -100, y: -100 },
            { x: 100, y: -100 },
            { x: -100, y: 100 },
            { x: 100, y: 100 },
            { x: 0, y: 130 },
        ];

        return icons.map((icon, i) => {
            const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [0, offsets[i].x, 0],
                extrapolate: 'clamp',
            });

            const translateY = scrollX.interpolate({
                inputRange,
                outputRange: [0, offsets[i].y, 0],
                extrapolate: 'clamp',
            });

            const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.5, 1, 0.5],
                extrapolate: 'clamp',
            });

            return (
                <Animated.Image
                    key={i}
                    source={icon}
                    style={[
                        styles.icon,
                        {
                            transform: [{ translateX }, { translateY }, { scale }],
                        },
                    ]}
                />
            );
        });
    };

    const renderItem = ({ item, index }: any) => (
        <View style={styles.slide}>
            <View style={styles.iconWrapper}>
                {renderIconsWithAnimation(item.icons, index)}
                <Image source={item.centerIcon} style={styles.centerImage} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: 'https://trangile.com/wp-content/uploads/2024/09/Untitled-design-2025-04-23T163748.770.png',
                }}
                style={styles.topLogo}
                resizeMode="contain"
            />

            <Animated.FlatList
                horizontal
                pagingEnabled
                data={slides}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />

            {/* Page Dots */}
            <View style={styles.pagination}>
                {slides.map((_, i) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
                })}
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('login')}>
                <Text style={styles.buttonText}>Welcome</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OnboardingSlider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topLogo: {
        width: 100,
        height: 60,
        alignSelf: 'center',
        marginTop: 80,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    iconWrapper: {
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerImage: {
        width: 100,
        height: 100,
        zIndex: 10,
        position: 'absolute',
    },
    icon: {
        width: 60,
        height: 60,
        position: 'absolute',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
        color: '#333',
    },
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 20,
    },
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#4A90E2',
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: '#4A90E2',
        marginHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 60,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});