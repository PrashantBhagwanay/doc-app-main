import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { Camera, CameraDevice, useCameraDevice } from 'react-native-vision-camera';

const CameraScreen = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    let device: CameraDevice | undefined = useCameraDevice('back'); // ✅ Always call hooks at the top level
   
   
    console.log("..........................device", device)
    useEffect(() => {
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
    if (hasPermission !== true || !device) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: 'white' }}>Loading Camera...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>KYC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Visiting Card</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Vehicle/Passport</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    overlay: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#000',
    },
});
