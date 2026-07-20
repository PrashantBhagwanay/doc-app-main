// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     Image,
//     SafeAreaView
// } from 'react-native';
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import { Camera } from 'react-native-vision-camera';

// export default function LoginScreen() {


//     const navigation = useNavigation();
    
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [rememberMe, setRememberMe] = useState(false);

//     const handleLogin = () => {
//         // console.log('Email:', email, 'Password:', password, 'Remember Me:', rememberMe);
//         navigation.navigate("dashboard")
//     };


//     useEffect(() => {
//             (async () => {
//                 const status: any = await Camera.requestCameraPermission();
//                 // setHasPermission(status === "authorized");
//             })();
//         }, []);

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.centerWrapper}>
//                 {/* Logo */}
//                 <View style={styles.logoContainer}>
//                     <Image
//                         source={require('./image.png')}
//                         style={styles.logo}
//                         resizeMode="contain"
//                     />
//                 </View>

//                 {/* Card */}
//                 <View style={styles.card}>
//                     <Text style={styles.title}>Sign In to DocSence</Text>

//                     {/* Email */}
//                     <Text style={styles.label}>Email Address</Text>
//                     <View style={styles.inputRow}>
//                         <FontAwesome5 name="envelope" size={16} color="#999" style={styles.icon} />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="youremail@gmail.com"
//                             placeholderTextColor="#999"
//                             keyboardType="email-address"
//                             value={email}
//                             onChangeText={setEmail}
//                         />
//                     </View>

//                     {/* Password */}
//                     <Text style={styles.label}>Password</Text>
//                     <View style={styles.passwordContainer}>
//                         <TextInput
//                             style={styles.passwordInput}
//                             placeholder="Password"
//                             placeholderTextColor="#999"
//                             secureTextEntry={!showPassword}
//                             value={password}
//                             onChangeText={setPassword}
//                         />
//                         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                             <FontAwesome5
//                                 name={showPassword ? "eye" : "eye-slash"}
//                                 size={18}
//                                 color="gray"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Remember & Forgot */}
//                     <View style={styles.optionsRow}>
//                         <TouchableOpacity
//                             onPress={() => setRememberMe(!rememberMe)}
//                             style={styles.rememberMe}
//                         >
//                             <FontAwesome5
//                                 name={rememberMe ? "check-square" : "square"}
//                                 size={16}
//                                 color="#007AFF"
//                             />
//                             <Text style={styles.rememberText}> Remember me</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity>
//                             <Text style={styles.forgotPassword}>Forgot Password?</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Sign In Button */}
//                     <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
//                         <Text style={styles.signInText}>Sign In</Text>
//                         <FontAwesome5 name="arrow-right" size={14} color="#fff" style={{ marginLeft: 5 }} />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // backgroundColor: '#F4F8FF',
//         backgroundColor: "#F0F8FF",
//         paddingBottom: 80,
//     },
//     centerWrapper: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//     },
//     logoContainer: {
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     logo: {
//         width: 280,
//         height: 90,
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         width: '100%',

//         // iOS shadow
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.08,
//         shadowRadius: 10,

//         // Android shadow
//         elevation: 8,
//     },

//     title: {
//         fontSize: 18,
//         fontWeight: '600',
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#000',
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: 'gray',
//         marginBottom: 6,
//     },
//     inputRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#E5E5E5',
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         height: 45,
//         marginBottom: 15,
//         backgroundColor: '#fff',
//     },
//     icon: {
//         marginRight: 8,
//     },
//     input: {
//         flex: 1,
//     },
//     passwordContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#E5E5E5',
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         height: 45,
//         marginBottom: 15,
//     },
//     passwordInput: {
//         flex: 1,
//     },
//     optionsRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 25,
//     },
//     rememberMe: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rememberText: {
//         fontSize: 13,
//         color: '#333',
//     },
//     forgotPassword: {
//         fontSize: 13,
//         color: '#007AFF',
//     },
//     signInButton: {
//         flexDirection: 'row',
//         backgroundColor: '#007AFF',
//         paddingVertical: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     signInText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });




import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView
} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Camera } from 'react-native-vision-camera';

export default function LoginScreen() {


    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = () => {
        // console.log('Email:', email, 'Password:', password, 'Remember Me:', rememberMe);
        navigation.navigate("dashboard")
    };


    useEffect(() => {
        (async () => {
            const status: any = await Camera.requestCameraPermission();
            // setHasPermission(status === "authorized");
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerWrapper}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={{
                            uri: 'https://trangile.com/wp-content/uploads/2024/09/Untitled-design-2025-04-23T163748.770.png',
                        }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.title}>Sign In to Trangile</Text>

                    {/* Email */}
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputRow}>
                        <FontAwesome5 name="envelope" size={16} color="#999" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="youremail@gmail.com"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <FontAwesome5
                                name={showPassword ? "eye" : "eye-slash"}
                                size={18}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Remember & Forgot */}
                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            onPress={() => setRememberMe(!rememberMe)}
                            style={styles.rememberMe}
                        >
                            <FontAwesome5
                                name={rememberMe ? "check-square" : "square"}
                                size={16}
                                color="#007AFF"
                            />
                            <Text style={styles.rememberText}> Remember me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                        <Text style={styles.signInText}>Sign In</Text>
                        <FontAwesome5 name="arrow-right" size={14} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F4F8FF',
        // backgroundColor: "#F0F8FF",
        backgroundColor: "white",
        paddingBottom: 80,
    },
    centerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 280,
        height: 90,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        // Android shadow
        elevation: 8,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: 'gray',
        marginBottom: 6,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 45,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 45,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberText: {
        fontSize: 13,
        color: '#333',
    },
    forgotPassword: {
        fontSize: 13,
        color: '#007AFF',
    },
    signInButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});