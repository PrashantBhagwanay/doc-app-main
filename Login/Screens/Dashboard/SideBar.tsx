

import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    Switch,
    FlatList,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native"; // 👈 for navigation

const { width } = Dimensions.get("window");

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    hasChildren?: boolean;
    children?: MenuItem[];
    hasSwitch?: boolean;
    isProfile?: boolean; // 👈 extra flag for profile
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
    const navigation = useNavigation<any>();
    const slideAnim = useRef(new Animated.Value(-250)).current;
    const [expanded, setExpanded] = useState<string | null>(null);
    const [settings, setSettings] = useState({
        notification: false,
        lightMode: true,
    });

    const menu: MenuItem[] = [
        { id: "1", label: "Profile", icon: "user", isProfile: true },
        { id: "2", label: "Dashboard", icon: "tachometer-alt" },
        {
            id: "3",
            label: "Settings",
            icon: "cog",
            hasChildren: true,
            children: [
                { id: "3-1", label: "Notification", icon: "bell", hasSwitch: true },
                { id: "3-2", label: "Light Mode", icon: "sun", hasSwitch: true },
            ],
        },
        { id: "4", label: "Contact Us", icon: "envelope" },
    ];

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -250,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    if (!visible) return null;

    const toggleExpand = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    const renderItem = ({ item }: { item: MenuItem }) => (
        <>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => toggleExpand(item.id)}
            >
                <FontAwesome5 name={item.icon} size={20} color="gray" />
                <Text style={styles.item}>{item.label}</Text>
                <FontAwesome5
                    name={expanded === item.id ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="gray"
                    style={{ marginLeft: "auto" }}
                />
            </TouchableOpacity>

            {/* Profile Expanded */}
            {item.isProfile && expanded === item.id && (
                <TouchableOpacity
                    style={styles.profileCard}
                    onPress={() => navigation.navigate("ProfileScreen")}
                >
                    {/* <Image
                        source={{
                            uri: 'https://trangile.com/wp-content/uploads/2024/09/Untitled-design-2025-04-23T163748.770.png',
                        }}
                        style={styles.profileImage}
                    /> */}
                    <View>
                        <Text style={styles.profileName}>Md Azad</Text>
                        <Text style={styles.profilePhone}>+91 72909 29298</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Settings Expanded */}
            {item.hasChildren && expanded === item.id && (
                <View style={styles.subMenu}>
                    {item.children?.map((child) => (
                        <View key={child.id} style={styles.subMenuItem}>
                            <Text style={styles.subItem}>{child.label}</Text>
                            {child.hasSwitch && (
                                <Switch
                                    value={
                                        child.label === "Notification"
                                            ? settings.notification
                                            : settings.lightMode
                                    }
                                    onValueChange={(val) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            [child.label === "Notification"
                                                ? "notification"
                                                : "lightMode"]: val,
                                        }))
                                    }
                                    trackColor={{ false: "#d3d3d3", true: "#007bff" }}
                                    thumbColor={"#fff"}
                                />
                            )}
                        </View>
                    ))}
                </View>
            )}
        </>
    );

    return (
        <>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
            >
                <Image
                    source={{
                        uri: 'https://trangile.com/wp-content/uploads/2024/09/Untitled-design-2025-04-23T163748.770.png',
                    }}
                    style={styles.logo}
                />

                <FlatList
                    data={menu}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ flexGrow: 1 }}
                />

                <TouchableOpacity
                    style={styles.logoutContainer}
                    onPress={() => console.log("Logout")}
                >
                    <FontAwesome5 name="sign-out-alt" size={20} color="gray" />
                    <Text style={styles.item}>Log Out</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        opacity: 0.4,
        zIndex: 5,
    },
    sidebar: {
        position: "absolute",
        top: 15,
        left: 0,
        width: 250,
        height: "90%",
        backgroundColor: "white",
        padding: 20,
        zIndex: 10,
        margin: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#eee",
        elevation: 5,
    },
    logo: { width: 80, height: 80, resizeMode: "contain", marginBottom: 20 },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12,
    },
    item: { fontSize: 16, marginLeft: 12, color: "gray", fontWeight: "500" },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F8FF",
        padding: 12,
        borderRadius: 10,
        // marginLeft: 35,
        marginVertical: 5,
        // paddingRight: 40,
        borderWidth: 1,
        marginRight: 10,
    },
    profileImage: { width: 20, height: 20, borderRadius: 25, marginRight: 12,padding: 20 },
    profileName: { fontSize: 16, fontWeight: "600", color: "#000" },
    profilePhone: { fontSize: 14, color: "gray" },
    subMenu: {
        paddingLeft: 40,
        marginTop: 5,
    },
    subMenuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
        backgroundColor: "#F0F8FF",
        padding: 10,
        borderRadius: 8,
    },
    subItem: { fontSize: 15, color: "gray", marginRight: 10 },
    logoutContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
});
