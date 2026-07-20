import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function ExtractedTextScreen({ route, navigation }: any) {
    const { extractedText, photoUri } = route.params;

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Extracted Text</Text>
                <View style={{ width: 20 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Image source={{ uri: photoUri }} style={styles.thumb} />
                <View style={styles.textBox}>
                    <Text style={styles.text}>{extractedText}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    title: { fontSize: 16, fontWeight: "700" },
    thumb: { width: "100%", height: 200, borderRadius: 10, marginBottom: 16 },
    textBox: { backgroundColor: "#f7f7f7", borderRadius: 10, padding: 12 },
    text: { fontSize: 14, color: "#333", lineHeight: 20 },
});