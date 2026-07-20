import React, { useImperativeHandle, useRef, useState, forwardRef, useEffect } from "react";
import { Animated, Dimensions, Text, View, StyleSheet, Easing } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width } = Dimensions.get("window");

export type ToastType = "success" | "error" | "info";
export type ToastHandle = { show: (msg: string, type?: ToastType, ms?: number) => void };

export const ToastBar = forwardRef<ToastHandle, {}>((props, ref) => {
    const [msg, setMsg] = useState("");
    const [type, setType] = useState<ToastType>("info");
    const [visible, setVisible] = useState(false);

    const animX = useRef(new Animated.Value(-width)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // cleanup on unmount (stop animations)
    useEffect(() => {
        return () => {
            animX.stopAnimation();
            opacity.stopAnimation();
        };
    }, [animX, opacity]);

    const show = (message: string, t: ToastType = "info", duration = 2500) => {
        setMsg(message);
        setType(t);
        setVisible(true);

        animX.stopAnimation();
        opacity.stopAnimation();

        animX.setValue(-width);
        opacity.setValue(0);

        Animated.sequence([
            // slide in + fade in
            Animated.parallel([
                Animated.timing(animX, {
                    toValue: 0,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(duration),
            // slide out + fade out
            Animated.parallel([
                Animated.timing(animX, {
                    toValue: width,
                    duration: 260,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // animation complete: unmount to avoid any residue
            setVisible(false);
            setMsg("");
            // reset position so next time starts clean
            animX.setValue(-width);
        });
    };

    useImperativeHandle(ref, () => ({ show }), []);

    if (!visible) return null; // 🔥 not rendering when hidden = no “pichla nishan”

    const bg =
        type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#2563eb";
    const icon =
        type === "success" ? "check-circle" : type === "error" ? "times-circle" : "info-circle";

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                toastStyles.container,
                { transform: [{ translateX: animX }], opacity },
            ]}
        >
            <View style={[toastStyles.bar, { backgroundColor: bg }]}>
                <FontAwesome5 name={icon} size={16} color="#fff" />
                <Text style={toastStyles.text} numberOfLines={2}>
                    {msg}
                </Text>
            </View>
        </Animated.View>
    );
});

const toastStyles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 12,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 9999,
    },
    bar: {
        minWidth: "80%",
        borderRadius: 17,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    text: { color: "#fff", fontWeight: "600" },
});
