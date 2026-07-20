import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Platform,
    ToastAndroid,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import SideBar from "./SideBar";
import { ToastBar, ToastHandle, ToastType } from "../Toast/ToastBar";


import TextRecognition from "@react-native-ml-kit/text-recognition";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function DocumentCameraScreen() {
    const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back");
    const device = useCameraDevice(cameraPosition);
    const cameraRef = useRef<Camera>(null);

    const toastRef = useRef<ToastHandle>(null);
    const toast = (m: string, t: ToastType = "info", ms?: number) => toastRef.current?.show(m, t, ms);


    const [hasPermission, setHasPermission] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [zoomIdx, setZoomIdx] = useState(1); // default 1x
    const zoomSteps = [0.6, 1, 2, 3, 10];
    const zoom = zoomSteps[zoomIdx];

    // useEffect(() => {
    //     (async () => {
    //         const status: any = await Camera.requestCameraPermission();
    //         setHasPermission(status === "authorized");
    //     })();
    // }, []);


    const navigation = useNavigation<any>();
    const [extracting, setExtracting] = useState(false);

    const extractTextFromPhoto = async () => {
        if (!photo || extracting) return;
        try {
            setExtracting(true);
            const result = await TextRecognition.recognize(photo);
            // result.text = puri combined text
            // result.blocks = line/block wise breakdown 

            console.log("OCR result:", result);
            Alert.alert("OCR Debug", JSON.stringify(result, null, 2));
            console.log(JSON.stringify(result, null, 2))

            if (!result.text?.trim()) {
                toast("No text detected", "error");
                return;
            }

            navigation.navigate("ExtractedTextScreen", {
                extractedText: result.text,
                photoUri: photo,
            });
        } catch (err: any) {
            console.log("OCR error:", err);
            toast("Text not extracted", "error");
        } finally {
            setExtracting(false);
        }
    };

    
    const showToast = (msg: string) => {
        if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    };

    const takePhoto = async () => {
        if (!cameraRef.current) return;
        try {
            const p = await cameraRef.current.takePhoto({ flash: "off" });
            setPhoto("file://" + p.path);
            showToast("Captured");
        } catch {
            showToast("Failed to capture");
        }
    };

    const pickFromGallery = () => {
        ImagePicker.launchImageLibrary({ mediaType: "photo" }, (res: any) => {
            if (!res.didCancel && res.assets?.length > 0) {
                setPhoto(res.assets[0].uri);
            }
        });
    };

    const resetPhoto = () => setPhoto(null);

    // 🔧 FIX: correct loading condition
    if (!device || hasPermission) {
        return (
            <View style={styles.center}>
                <Text>Loading camera…</Text>
            </View>
        );
    }

    
    const uploadPhoto = async () => {
        if (!photo || uploading) return;

        try {
            setUploading(true);

            // Extract filename
            let fileName = (photo.split("/").pop() || "").split("?")[0] || "invoice.jpeg";

            // Detect extension and mime
            const ext = (fileName.split(".").pop() || "").toLowerCase();
            const mime =
                ext === "png" ? "image/png" :
                    ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
                        ext === "pdf" ? "application/pdf" :
                            "application/octet-stream";

            // Build form data EXACT like curl
            const formData = new FormData();
            formData.append("invoice_file", {
                uri: photo,        // local path (file:// or content:// in RN)
                type: mime,        // e.g. image/jpeg
                name: fileName,    // e.g. invoice3.jpeg
            } as any);

            console.log("Uploading file:", formData);

            const res = await axios.post(
                "https://deploy.evolveonai.in/upload",
                formData,
                {
                    headers: {
                        // Let axios set boundary automatically
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 20000,
                }
            );

            const msg = res?.data?.message || "File uploaded successfully!";
            toast(msg, "success");
            setPhoto(null);

        } catch (error: any) {
            let errMsg = "Upload failed";

            if (error?.response) {
                const status = error.response.status;
                errMsg = error.response.data?.message || `Error ${status}`;
                if (status === 413) errMsg = "File too large to upload.";
                else if (status === 415) errMsg = "Unsupported file type.";
                else if (status === 404) errMsg = "Upload URL not found.";
                else if (status === 405) errMsg = "Method not allowed on this endpoint.";
                else if (status === 500) errMsg = "Server error. Please try again.";
            } else if (error?.code === "ECONNABORTED") {
                errMsg = "Network timeout. Try again.";
            } else if (error?.message?.toLowerCase?.().includes("network")) {
                errMsg = "Network error. Check internet and retry.";
            } else if (error?.message) {
                errMsg = error.message;
            }

            toast(errMsg, "error");
            console.log("Upload error detail:", {
                status: error?.response?.status,
                data: error?.response?.data,
                headers: error?.response?.headers,
                code: error?.code,
                message: error?.message,
            });
        } finally {
            setUploading(false);
        }
    };

   
    const extractViaAPI = async () => {
        if (!photo || uploading) return;
        console.log("Starting extraction for:", photo);

        try {
            setUploading(true);

            let fileName = (photo.split("/").pop() || "").split("?")[0] || "label.jpg";
            const ext = (fileName.split(".").pop() || "").toLowerCase();
            const mime =
                ext === "png" ? "image/png" :
                    ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
                        "image/jpeg";

            const formData = new FormData();
            formData.append("file", {
                uri: photo,
                type: mime,
                name: fileName,
            } as any);
            formData.append("doc_type", "EXTRACTION");
            formData.append("mode", "ONLINE");

            const res = await axios.post(
                "http://17.224.50.181:8150/api/v1/extract",
                formData,
                {
                    headers: {
                        "Authorization": "Bearer 123456789",
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 30000,
                }
            );

            console.log("Extraction result:", res.data);

            navigation.navigate("ExtractedTextScreen", {
                extractedText: JSON.stringify(res.data, null, 2), 
                photoUri: photo,
            });

        } catch (error: any) {
            console.log("Extract error:", error?.response?.data || error?.message);
            toast("Extraction failed", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.root}>
            <ToastBar ref={toastRef} />

            {/* Top bar */}
            <View style={styles.statusBar}>
                <FontAwesome5 name="bolt" size={12} />
                <TouchableOpacity
                    style={styles.hamburgerButton}
                    onPress={() => setSidebarOpen(true)}
                >
                    <FontAwesome5 name="bars" size={24} color="black" />
                </TouchableOpacity>
                <FontAwesome5 name="play-circle" size={14} />
                <FontAwesome5 name="dot-circle" size={14} />
            </View>

            {/* Camera fills area; stays mounted. We just deactivate while previewing */}
            <View style={styles.previewWrap}>
                <Camera
                    ref={cameraRef}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={!photo} // ❗ stop camera when preview is open
                    photo={true}
                    zoom={zoom}
                />

                {/* Zoom chips overlay (hide when previewing) */}
                {!photo && (
                    <View style={styles.zoomOverlay}>
                        {zoomSteps.map((z, i) => (
                            <TouchableOpacity
                                key={z}
                                style={[styles.zoomChip, i === zoomIdx && styles.zoomChipActive]}
                                onPress={() => setZoomIdx(i)}
                            >
                                <Text style={[styles.zoomTxt, i === zoomIdx && styles.zoomTxtActive]}>
                                    {z === 1 ? "1x" : z.toString()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* 🔥 PREVIEW MODAL OVERLAY */}
                {photo && (
                    <View style={styles.previewOverlay}>
                        {/* dark backdrop */}
                        <View style={styles.backdrop} />

                        {/* preview card */}
                        <View style={styles.previewCard}>
                            <Image source={{ uri: photo }} style={styles.previewImg} />

                            <View style={styles.previewActions}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.uploadBtn]}
                                    onPress={uploadPhoto}
                                    disabled={uploading}
                                >
                                    <FontAwesome5 name="cloud-upload-alt" size={18} color="#fff" />
                                    <Text style={styles.actionTxtLight}>
                                        {uploading ? "Uploading..." : "Upload"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.retakeBtn]}
                                    onPress={resetPhoto}
                                    disabled={uploading}
                                >
                                    <FontAwesome5 name="redo" size={16} color="#000" />
                                    <Text style={styles.actionTxtDark}>Retake</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.extractBtn]}
                                    onPress={extractViaAPI}          // 👈 change kiya
                                    disabled={uploading || extracting}
                                >
                                    <Text style={styles.actionTxtLight}>
                                        {uploading ? "Extracting..." : "Extract Text"}   {/* uploading state use kiya */}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* loader on top when uploading */}
                        {uploading && (
                            <View style={styles.loaderOverlay}>
                                <ActivityIndicator size="large" />
                                <Text style={{ color: "#fff", marginTop: 8 }}>Uploading…</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            <SideBar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Bottom black dock */}
            <View style={styles.bottomDock}>
                <TouchableOpacity style={styles.thumb} onPress={pickFromGallery}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.thumbImg} />
                    ) : (
                        <View style={styles.thumbPlaceholder} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={takePhoto}
                    style={[styles.shutter, photo && styles.shutterDisabled]}
                    disabled={!!photo}
                />

                <TouchableOpacity
                    style={styles.rotate}
                    onPress={() =>
                        setCameraPosition((p) => (p === "front" ? "back" : "front"))
                    }
                    disabled={!!photo}
                >
                    <FontAwesome5 name="sync-alt" size={25} color="black" />
                </TouchableOpacity>
            </View>

            {/* Scrollable modes bar */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modeTabs}
            >
                <Text style={styles.modeDim}>PORTRAIT</Text>
                <Text style={styles.modeDim}>PHOTO</Text>
                <Text style={styles.modeActive}>DOCUMENT</Text>
                <Text style={styles.modeDim}>VIDEO</Text>
                <Text style={styles.modeDim}>MORE</Text>
            </ScrollView>
        </View>
    );
}

const PAD = 16;

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#000" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    statusBar: {
        paddingTop:8,
        height: 80,
        paddingHorizontal: PAD,
        flexDirection: "row",
        alignItems: "center",
        // gap: 10,
    },

    extractBtn: { backgroundColor: "#007bff" },

    hamburgerButton: {
        marginLeft: 8,
        backgroundColor: "white",
        padding: 6,
        borderRadius: 8,
    },

    previewWrap: {
        width: "100%",
        height: height * 0.64, // a bit taller
        position: "relative",
        backgroundColor: "#111",
    },

    /* Zoom overlay */
    zoomOverlay: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 30,
        paddingHorizontal: 6,
    },
    zoomChip: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        margin: 6,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    zoomChipActive: { backgroundColor: "#fff" },
    zoomTxt: { color: "#eee", fontWeight: "600" },
    zoomTxtActive: { color: "#000" },

    /* Preview modal */
    previewOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.75)", // dim background
    },
    previewCard: {
        width: width * 0.88,
        borderRadius: 14,
        backgroundColor: "#111",
        overflow: "hidden",
    },
    previewImg: { width: "100%", height: width * 0.88 * (4 / 3) }, // nice card ratio
    previewActions: {
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    uploadBtn: { backgroundColor: "#28a745" ,padding:9},
    retakeBtn: { backgroundColor: "#fff" },
    actionTxtLight: { color: "#fff", fontWeight: "700" },
    actionTxtDark: { color: "#000", fontWeight: "700" },

    /* Bottom dock */
    bottomDock: {
        marginTop: 8,
        height: 120,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#000",
    },
    thumb: { width: 60, height: 60, borderRadius: 30, overflow: "hidden" },
    thumbImg: { width: "100%", height: "100%" },
    thumbPlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: 30,
        backgroundColor: "#333",
    },
    shutter: {
        width: 78,
        height: 78,
        borderRadius: 43,
        backgroundColor: "#fff",
        borderWidth: 4,
        borderColor: "#ddd",
    },
    shutterDisabled: { opacity: 0.4 },
    rotate: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    /* Modes bar */
    modeTabs: {
        paddingHorizontal: 20,
        backgroundColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginBottom: 70,
    },
    modeDim: { color: "#888", letterSpacing: 1, fontWeight: "700", fontSize: 12 },
    modeActive: { color: "#fff", letterSpacing: 1, fontWeight: "800", fontSize: 12 },

    /* Upload loader overlay */
    loaderOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
});
