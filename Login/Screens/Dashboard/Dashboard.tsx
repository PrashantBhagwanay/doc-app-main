
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Text,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
    FlatList,
    BackHandler,
    Modal,
    StatusBar
} from 'react-native';
import { launchCamera, CameraOptions, launchImageLibrary, CameraType } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import VisitingCardForm from '../VisitingCard/VisitingCardForm';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Camera, CameraDevice, useCameraDevice } from 'react-native-vision-camera';
import changeNavigationBarColor from 'react-native-navigation-bar-color';


// import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
const Dashboard = () => {

    const navigation = useNavigation<NavigationProps>();
    const cameraRef = useRef<Camera>(null);


    let device: CameraDevice | undefined = useCameraDevice('back'); // ✅ Always call hooks at the top level


    // console.log("..........................device", device)
    useEffect(() => {
        changeNavigationBarColor('black', true);
        const getPermissions = async () => {
            let cameraPermission: any = Camera.getCameraPermissionStatus();

            if (cameraPermission !== 'authorized') {
                cameraPermission = await Camera.requestCameraPermission();
            }

            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to your camera',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (
                    granted === PermissionsAndroid.RESULTS.GRANTED &&
                    cameraPermission === 'authorized'
                ) {
                    setHasPermission(true);
                } else {
                    setHasPermission(true);
                }
            } else {
                setHasPermission(cameraPermission === 'authorized');
            }
        };

        getPermissions();
    }, []);

    // ✅ Wait for both permission and device to be ready


    type NavigationProps = StackNavigationProp<RootStackParamList, 'VisitingCardForm'>;



    const getRandomCoordinates = () => {
        return {
            latitude: (28.5000 + Math.random() * 0.2).toFixed(6),  // Random latitude near 28.5
            longitude: (77.3000 + Math.random() * 0.2).toFixed(6), // Random longitude near 77.3
        };
    };
    const [selectedCard, setSelectedCard] = useState('');
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [clinicData, setClinicData] = useState<any>(null);
    const [locationData, setLocationData] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [kyc, setKyc] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);




    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'This app requires camera access to take photos.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK'
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.error('Permission Error:', err);
                return false;
            }
        }
        return true;
    };

    const abc = (item: any) => {
        // setSelected(item)
        if (item == "KYC") {
            setKyc(true)
        }
        setSelectedCard(item)
        // setModalVisible(true)
        // takePhoto()
    }

    const takePhoto = async () => {
        // const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required.');
            return;
        }

        // if (cameraRef.current == null) return;

        if (!selectedCard) {
            Alert.alert('Error', 'Please select a card before taking a photo.');
            return;
        }


        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('User Location:............', latitude, longitude);
                // setLocationData()
                // setClinicData({ latitude, longitude }); 
                setLocationData({ latitude, longitude });
            },
            (error) => {
                // console.error('Location Error:', error);
                // Alert.alert('Location Error', error.message);
            },
            { enableHighAccuracy: false, timeout: 25000, maximumAge: 25000 }
        );

        if (cameraRef.current == null) return;

        try {
            const photo = await cameraRef.current.takePhoto({
                flash: 'off', // or 'on'/'auto' if needed
            });

            console.log('Photo captured:', photo);

            if (photo) {
                console.log('Captured Image URI:', photo.path);

                // Convert image to base64
                try {

                    const base64Image = await RNFS.readFile(photo.path, 'base64');
                    const imageUri = 'file://' + photo.path;
                    setSelectedImage(imageUri);
                    await sendImageToAPI(base64Image, photo.path);
                } catch (error: any) {
                    console.error('Image Processing Error:', error);
                    Alert.alert("launchCamera error line 162", error);
                }
            } else {
                Alert.alert('Error line 165', 'Could not retrieve image URI.');
            }

            // Do whatever you want with the photo — preview, upload, etc.
            // Optional preview
        } catch (error) {
            console.error('Failed to take photo:', error);
        }



    };

    const handleGalleryLaunch = async () => {

        if (!selectedCard) {
            Alert.alert('Error', 'Please select a card before upload a photo.');
            return;
        }
        try {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationData({ latitude, longitude });
                },
                (error) => {
                    console.error('Location Error:', error);
                    Alert.alert('Location Error', error?.message || 'Location fetch failed');
                },
                { enableHighAccuracy: false, timeout: 25000, maximumAge: 25000 }
            );

            launchImageLibrary(
                { mediaType: 'photo', quality: 1 },
                async (response) => {
                    if (response.assets && response.assets.length > 0) {
                        let imageUri: any = response.assets[0].uri;
                        setSelectedImage(imageUri);

                        if (Platform.OS === 'android' && !imageUri.startsWith('file://')) {
                            imageUri = 'file://' + imageUri;
                        }

                        if (imageUri) {
                            const base64Image = await RNFS.readFile(imageUri, 'base64');
                            // console.log(".....................................", base64Image)
                            await sendImageToAPI(base64Image, imageUri);
                        } else {
                            Alert.alert('Error', 'Could not retrieve image URI.');
                        }
                    }
                }
            );
        } catch (error: any) {
            console.error('Gallery Upload Error:', error);
            Alert.alert('Something went wrong');
        }
    };

    const filterEmptyFields = (data: any) => {
        return Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value)  // null, undefined, '' 
        );
    };

    const mergeAadhaarData = (top: any, bottom: any) => {
        return filterEmptyFields({
            aadhaar: bottom?.aadhaar?.value || top?.aadhaar?.value || null,
            name: bottom?.name?.value || top?.name?.value || null,
            dob: bottom?.dob?.value || top?.dob?.value || null,
            gender: bottom?.gender?.value || top?.gender?.value || null,
            phoneNumber: top?.phoneNumber?.value || null,
            address: top?.address?.value || null,
            careOf: top?.addressSplit?.careOf || null,
            city: top?.addressSplit?.city || null,
            district: top?.addressSplit?.district || null,
            state: top?.addressSplit?.state || null,
            pin: top?.addressSplit?.pin || null,
            line1: top?.addressSplit?.line1 || null,
            line2: top?.addressSplit?.line2 || null,
            houseNumber: top?.addressSplit?.houseNumber || null,
        });
    };

    const parseDocumentData = (response: any) => {
        const results = response?.data?.result || [];

        // ✅ Handle Aadhaar Front Top + Bottom combined case
        if (results.length === 2) {
            const top = results.find((doc: any) => doc?.type === "Aadhaar Front Top")?.details || {};
            const bottom = results.find((doc: any) => doc?.type === "Aadhaar Front Bottom")?.details || {};

            if (top && bottom) {
                return mergeAadhaarData(top, bottom);
            }
        }

        // ✅ Handle individual document types
        const result = results?.[0] || {};
        const details = result?.details || {};
        const type = result?.type || "";

        switch (type) {
            case "Aadhaar Front":
                return filterEmptyFields({
                    aadhaar: details?.aadhaar?.value || null,
                    name: details?.name?.value || null,
                    dob: details?.dob?.value || null,
                    gender: details?.gender?.value || null,
                    phoneNumber: details?.phoneNumber?.value || null,
                    guardianName: details?.guardianName?.value || null,
                    father: details?.father?.value || null,
                    mother: details?.mother?.value || null,
                    yob: details?.yob?.value || null
                });

            case "Aadhaar Back":
                return filterEmptyFields({
                    aadhaar: details?.aadhaar?.value || null,
                    address: details?.address?.value || null,
                    district: details?.addressSplit?.district || null,
                    state: details?.addressSplit?.state || null,
                    pin: details?.addressSplit?.pin || null,
                    careOf: details?.addressSplit?.careOf || null,
                    line1: details?.addressSplit?.line1 || null,
                    line2: details?.addressSplit?.line2 || null,
                });

            case "DL":  // ✅ Driving License
                return filterEmptyFields({
                    dl: details?.dl?.value || null,
                    name: details?.name?.value || null,
                    dob: details?.dob?.value || null,
                    guardianName: details?.guardianName?.value || null,
                    address: details?.address?.value || null,
                    pin: details?.addressSplit?.pin || null,
                });

            case "Passport":  // ✅ Passport
                return filterEmptyFields({
                    passport: details?.passport?.value || null,
                    firstName: details?.firstName?.value || null,
                    lastName: details?.lastName?.value || null,
                    dob: details?.dob?.value || null,
                    nationality: details?.nationality?.value || null,
                    gender: details?.gender?.value || null,
                });

            case "Pan":  // ✅ PAN Card
                return filterEmptyFields({
                    pan: details?.pan?.value || null,
                    name: details?.name?.value || null,
                    dob: details?.dob?.value || null,
                    guardianName: details?.guardianName?.value || null,
                });

            case "Voter ID":  // ✅ Voter ID
                return filterEmptyFields({
                    voterId: details?.voterId?.value || null,
                    name: details?.name?.value || null,
                    dob: details?.dob?.value || null,
                    gender: details?.gender?.value || null,
                    guardianName: details?.guardianName?.value || null,
                });

            default:
                return filterEmptyFields({
                    message: "Unknown document type"
                });
        }
    };

    console.log("   ")

    const sendImageToAPI = async (imageUrl: string, imageUri: any) => {
        // const payload = { urls: [imageUrl] };
        let payload = { base64_images: [imageUrl] };
        let payload2 = { base64_image_data: imageUrl };
        // console.log("payload", payload)
        // console.log("payload2", payload2)
        console.log("kyc", kyc)
        console.log(" { base64_image_data: [imageUrl] }")
        setModalVisible(false)
        setLoading(true);

        try {

            let response;

            kyc ? response = await axios.post(
                // 'http://103.233.244.174:8088/api/v1/clinic-predictions',
                // 'https://doc-api.noosyn.ai/api/v1/clinic-predictions',
                'https://kyc-api.noosyn.ai/api/v1/predictions',
                payload2,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer pG4XBvliGN3tfzpI7AiwZ9PhVJsWXN4G8sa6MdwD',
                        'Authorization': 'Bearer pG4XBvliGN3tfzpI7AiwZ9PhVJsWXN4G8sa6MdwD',
                    },
                }
            ) : response = await axios.post(
                // 'http://103.233.244.174:8088/api/v1/clinic-predictions',
                'https://doc-extraction-api.noosyn.ai/api/v1/clinic-predictions',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer pG4XBvliGN3tfzpI7AiwZ9PhVJsWXN4G8sa6MdwD',
                        'Authorization': 'Bearer 123456789',
                    },
                }
            );


            console.log("url")
            console.log('API Response:', response.data);
            // setClinicData(response.data);
            setKyc(false)


            // navigation.navigate('VisitingCardForm', {
            //     imageUrl: imageUri,
            //     clinicData: response.data,
            //     location: locationData
            // });

            console.log("locationData from the Dashboard", locationData)

            navigation.navigate('VisitingCardForm', {
                imageUrl: 'file://' + imageUri,
                clinicData: kyc
                    ? parseDocumentData(response)   // KYC case: parsed data
                    : response.data,                // Non-KYC case: pura response
                location: locationData
            });

            setSelectedImage("");
            setLoading(false);
        } catch (error: any) {
            console.error('API Error:', error);
            Alert.alert("Error from api")


            setLoading(false);
        }
    };


    const onRefresh = () => {
        setRefreshing(true);
        setSelectedCard(""); // Reset selected card
        setClinicData(null); // Reset clinic data
        setTimeout(() => setRefreshing(false), 1000);
    };


    const options = [
        { label: 'Visiting Card', image: require('../../scrollbuttonimages/image1.png') },
        { label: 'KYC', image: require('../../scrollbuttonimages/image2.png') },
        { label: 'Vehicle No.', image: require('../../scrollbuttonimages/image3.png') },
        { label: 'Invoice', image: require('../../scrollbuttonimages/image4.png') },
        { label: 'Document', image: require('../../scrollbuttonimages/image4.png') },
    ];

    const [selectedIndex, setSelectedIndex] = useState(null);

    const [selectedOption, setSelectedOption] = useState(""); // Manage KYC, Visiting Card etc.

    const xyz = (item: any, index: any) => {
        setSelectedIndex(index);
        setSelectedOption(item.label);
        setSelectedCard(item.label)
        console.log("...", item)
        if (item.label == "KYC") {
            setKyc(true)
            console.log("KYC PRESSED")
        }
        // abc(item)
    }


    if (hasPermission !== true || !device) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
            }}>
                <Text style={{ color: 'white' }}>Loading Camera...</Text>
            </View>
        );
    }

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                backgroundColor: "black",
            }}
        >
            <StatusBar
                backgroundColor="black"
                barStyle="light-content"
                translucent={false}
            />
            {/* Top Section - Camera and Scrollable Area */}
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 8,
                    backgroundColor: 'black',
                    zIndex: 999,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack?.()}>
                    <FontAwesome5 name="chevron-left" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => console.log('Settings Pressed')}>
                    <FontAwesome5 name="cog" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <View>
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {!clinicData && (
                        <>
                            {selectedImage ? (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={StyleSheet.absoluteFill}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Camera
                                    ref={cameraRef}
                                    style={StyleSheet.absoluteFill}
                                    device={device}
                                    isActive={true}
                                    photo={true}
                                />
                            )}

                            {
                                !selectedImage ? <TouchableOpacity style={styles.button} disabled={loading}>
                                    <TouchableOpacity style={styles.frameBox} disabled={loading}>
                                        {/* Top Left */}
                                        <View style={[styles.corner, styles.topLeft]} />
                                        {/* Top Right */}
                                        <View style={[styles.corner, styles.topRight]} />
                                        {/* Bottom Left */}
                                        <View style={[styles.corner, styles.bottomLeft]} />
                                        {/* Bottom Right */}
                                        <View style={[styles.corner, styles.bottomRight]} />
                                    </TouchableOpacity>
                                </TouchableOpacity> : <></>
                            }
                        </>
                    )}


                    {loading && (
                        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
                    )}
                </ScrollView>
            </View>

            {/* Middle Section - Options Bar */}
            <View style={{ marginTop: 0, marginLeft: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {options.map((item, index) => (
                        <View
                            key={index}
                            style={{ alignItems: 'center', marginHorizontal: 15, marginVertical: 20 }}
                        >
                            <TouchableOpacity
                                onPress={() => xyz(item, index)}
                                style={{
                                    // width: 60,
                                    height: 60,
                                    // borderRadius: 30,
                                    backgroundColor: 'black',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // borderWidth: selectedIndex === index ? 2 : 0,
                                    // borderColor: selectedIndex === index ? '#456dfc' : 'transparent',
                                }}
                            >
                                {/* <Image source={item.image} style={{ width: 24, height: 24 }} resizeMode="contain" /> */}
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: selectedIndex === index ? '#0096FF' : 'white',
                                        marginTop: 2,
                                        textAlign: 'center',
                                        width: '100%', // 👈 ensures it wraps within available space
                                    }}
                                >
                                    {item.label}
                                </Text>

                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>


            {/* Bottom Section - Controls */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    // paddingVertical: 12,
                    backgroundColor: 'black',
                    marginBottom: 30,
                    // borderWidth:2

                }}
            >
                <TouchableOpacity onPress={handleGalleryLaunch}>
                    <FontAwesome5 name="images" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <FontAwesome5 name="crosshairs" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={takePhoto} style={styles.captureOuter}>
                    <View style={styles.captureInner} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <FontAwesome5 name="bolt" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity>
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: 37, height: 45, borderRadius: 5 }}
                        />
                    ) : (
                        <FontAwesome5 name="id-card" size={24} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
            {/* Modal */}
        </View>

    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff', height: 470 },
    dropdownContainer: { width: '90%', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff', overflow: 'hidden' },
    picker: { width: '100%' },
    disabled: { opacity: 0.5 },
    button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flexDirection: "column", alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    cameraImage: { width: 250, height: 250, marginRight: 10, resizeMode: "contain" },
    buttonText: { fontSize: 22, color: '#ED008C', fontWeight: '900', marginRight: 12 },
    loader: { marginTop: 20 },
    dataContainer: { padding: 16, backgroundColor: '#fff', width: "100%", display: "flex" },
    dataTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    dataLabel: { fontSize: 16, fontWeight: '600', marginTop: 8 },
    dataValue: { fontSize: 16, color: '#333' },
    doctorContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    dataTitle1: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    dataDesignation: {
        fontSize: 14,
        color: "#666",
    },


    footerplz: {  // Updated style name
        width: "100%",
        paddingVertical: 10,
        backgroundColor: "#f8f8f8",
    },
    footerButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: "#003366",
    },
    selectedButton: {
        backgroundColor: "#2B3991",
    },
    footerText: {
        color: "#ED008C",
        fontSize: 16,
        fontWeight: "900"
    },
    selectedText: {
        color: "#fff",
        fontWeight: "bold",
    },




    logo: {
        width: 120,  // Adjust as needed
        height: 120, // Adjust as needed
        alignSelf: "center", // Center the logo
        marginBottom: 10, // Spacing between logo and camera icon
    },




    captureOuter: {
        width: 70, // Slightly bigger than the black button
        height: 70,
        borderRadius: 37,
        backgroundColor: '#fff', // white outer
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 32,
        backgroundColor: '#000', // black inner circle
    },




    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    modalButton: {
        padding: 15,
        fontWeight: "900"
    },
    modalText: {
        fontSize: 18,
        fontWeight: "500"
    },
    modalCancel: {
        padding: 15,
        alignItems: 'center',
        fontWeight: "900"
    },
    cancelText: {
        color: 'red',
        fontSize: 16,
        fontWeight: "900"
    },

















    frameBox: {
        width: 350, // Adjust as needed
        height: 350,
        position: 'relative',
        alignSelf: 'center',
    },

    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#0096FF',
    },

    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },

    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },

    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },

    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },

});

export default Dashboard;




