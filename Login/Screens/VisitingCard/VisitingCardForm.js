import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";



const VisitingCardForm = () => {
    const route = useRoute();
    const navigation = useNavigation(); // ✅ Fixed Navigation

    // const { imageUrl, clinicData } = route.params || {};

    const { imageUrl, clinicData, location } = route.params  || {};

    console.log("locationData from the VisitingCardForm", location)

    const [formData, setFormData] = useState({});
    const [isEditable, setIsEditable] = useState(false); // Control edit mode

    useEffect(() => {
        if (clinicData) {
            setFormData({
                ...clinicData,
                latitude: location?.latitude || "28.6305433",
                longitude: location?.longitude || "77.3562123",
            });
        }
    }, [clinicData, location]);


    const saveDataAndNavigate = async () => {
        try {
            const storedCards = await AsyncStorage.getItem("visitingCards");
            const cards = storedCards ? JSON.parse(storedCards) : [];

            // Add the current form data to local storage
            cards.push(formData);
            await AsyncStorage.setItem("visitingCards", JSON.stringify(cards));

            // Navigate to success screen
            navigation.navigate("success");
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    // Function to handle text input changes
    const handleInputChange = (key, text, index = null) => {
        setFormData((prev) => {
            if (index !== null && Array.isArray(prev[key])) {
                const updatedArray = [...prev[key]];
                updatedArray[index] = text;
                return { ...prev, [key]: updatedArray };
            }
            return { ...prev, [key]: text };
        });
    };

    // Function to handle doctor field changes
    const handleDoctorChange = (key, index, field, text) => {
        setFormData((prev) => {
            const updatedDoctors = [...prev[key]];
            updatedDoctors[index] = { ...updatedDoctors[index], [field]: text };
            return { ...prev, [key]: updatedDoctors };
        });
    };

    // Function to render fields dynamically
    const renderField = (key, value) => {
        if (value === null || value.length === 0) {
            return <Text style={styles.noDataText}>No {key.replace(/_/g, " ")} Available</Text>;
        }

        if (Array.isArray(value)) {
            return value.map((item, index) => {
                if (typeof item === "object") {
                    return (
                        <View key={index} style={styles.doctorContainer}>
                            <TextInput
                                style={styles.input}
                                value={item.name || ""}
                                editable={isEditable}
                                onChangeText={(text) => handleDoctorChange(key, index, "name", text)}
                            />
                            <TextInput
                                style={styles.input}
                                value={item.designation || ""}
                                editable={isEditable}
                                onChangeText={(text) => handleDoctorChange(key, index, "designation", text)}
                            />
                        </View>
                    );
                } else {
                    return (
                        <TextInput
                            key={index}
                            style={styles.input}
                            value={item}
                            editable={isEditable}
                            onChangeText={(text) => handleInputChange(key, text, index)}
                        />
                    );
                }
            });
        }

        return (
            <TextInput
                style={styles.input}
                value={value.toString()}
                editable={isEditable}
                onChangeText={(text) => handleInputChange(key, text)}
            />
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
         {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 8,
                    backgroundColor: '#fff',
                    zIndex: 999,
                    marginVertical:40,
                    marginBottom:70,
                    // borderWidth:4
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="chevron-left" size={20} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => console.log('Settings Pressed')}>
                    <FontAwesome5 name="cog" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text style={styles.noImageText}>No Image Available</Text>
                )}
                <View>
                    {/* Edit Button */}
                    <TouchableOpacity style={{ marginBottom: 130 }} onPress={() => setIsEditable(!isEditable)}>
                        <FontAwesome5 name="edit" size={34} color="#003366" />
                    </TouchableOpacity>

                    {/* Upload Button */}
                    <TouchableOpacity onPress={saveDataAndNavigate}>
                        <FontAwesome5 name="upload" size={34} color="#003366" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.formContainer}>
                {Object.keys(formData).map((key) => (
                    <View key={key}>
                        <Text style={styles.sectionTitle}>{key.replace(/_/g, " ")}</Text>
                         {renderField(key, formData[key], key !== "latitude" && key !== "longitude")}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
    imageContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    image: { width: "80%", height: 400, resizeMode: "contain" },
    noImageText: { textAlign: "center", fontSize: 16, color: "gray", marginBottom: 20 },
    formContainer: { gap: 1, minHeight: "100%" },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, textTransform: "capitalize" },
    doctorContainer: { padding: 10, backgroundColor: "#f2f2f2", borderRadius: 5, marginBottom: 10 },
    noDataText: { fontSize: 14, color: "red", marginTop: 5 },
    input: {
        fontSize: 14,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
        marginVertical: 3,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingLeft:5
    },
});

export default VisitingCardForm;
