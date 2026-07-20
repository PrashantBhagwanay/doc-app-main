import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { height } = Dimensions.get("window");

const ProfileScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Top Blue Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn}>
                        <FontAwesome5 name="arrow-left" size={18} color="#fff" />
                    </TouchableOpacity>

                    {/* Profile Image */}
                    <View style={styles.profileWrapper}>
                        <Image
                            source={require("../Login/logo.jpeg")} // Replace with your image path
                            style={styles.profileImage}
                        />
                        {/* Camera icon */}
                        <TouchableOpacity style={styles.cameraIcon}>
                            <FontAwesome5 name="camera" size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Name & Number */}
                    <Text style={styles.name}>Md. Meraj</Text>
                    <Text style={styles.phone}>+91 74887 83572</Text>
                </View>

                {/* White Card with Rounded Top */}
                <View style={styles.card}>
                    <MenuItem 
                        icon="user"
                        label="Profile"
                        onPress={() => navigation.navigate("dashboard")} 
                    />
                    <MenuItem icon="cog" label="Setting" />
                    <MenuItem icon="credit-card" label="Payment Method" />
                    <MenuItem icon="phone-alt" label="Contact Us" />
                    <MenuItem icon="sign-out-alt" label="Logout" danger />
                </View>

                {/* Bottom Navigation */}
                <View style={styles.bottomNav}>
                    <NavItem icon="home" label="Home" active />
                    <NavItem icon="th-large" label="Category" />
                    <NavItem icon="search" label="Search" />
                    <NavItem icon="wallet" label="Wallet" />
                    <NavItem icon="user" label="Profile" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const MenuItem = ({ icon, label, danger, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={[styles.iconWrapper, danger && styles.dangerBg]}>
            <FontAwesome5
                name={icon}
                size={16}
                color={danger ? "#ff4d4d" : "#4a90e2"}
            />
        </View>
        <Text style={[styles.menuText, danger && styles.dangerText]}>{label}</Text>
        <FontAwesome5
            name="chevron-right"
            size={14}
            color="#ccc"
            style={{ marginLeft: "auto" }}
        />
    </TouchableOpacity>
);


const NavItem = ({ icon, label, active }: any) => (
    <TouchableOpacity style={styles.navItem}>
        <FontAwesome5 name={icon} size={18} color={active ? "#4a90e2" : "#999"} />
        <Text style={[styles.navText, active && { color: "#4a90e2" }]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#1976D2",
        alignItems: "center",
        paddingTop: height * 0.1,      // 10% of screen height
        paddingBottom: height * 0.17,  // 7% of screen height
        position: "relative",
       
    },
    backBtn: {
        position: "absolute",
        top: 20,
        left: 15,
        zIndex: 2,
        padding: 8,
    },
    profileWrapper: {
        position: "relative",
        marginBottom: 10,
        
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: "#fff",
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#4a90e2",
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    name: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    phone: {
        color: "#fff",
        fontSize: 14,
        marginTop: 3,
    },
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: -40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        // elevation: 5,
        // borderWidth: 5,
        // borderColor: "yellow"
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        // borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
       
    },
    iconWrapper: {
        backgroundColor: "#eaf3ff",
        padding: 10,
        borderRadius: 25,
        marginRight: 15,
    },
    dangerBg: {
        backgroundColor: "#ffeaea",
    },
    menuText: {
        fontSize: 15,
        color: "#333",
    },
    dangerText: {
        color: "#ff4d4d",
    },
    bottomNav: {
        flexDirection: "row",
        backgroundColor: "#fff",
        elevation: 5,
        paddingVertical: 8,
        justifyContent: "space-around",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 4,
        // borderWidth:5,
        // borderColor:"red"
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: "#999",
        marginTop: 3,
    },
});

export default ProfileScreen;
