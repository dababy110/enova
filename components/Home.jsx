import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { useFonts } from "expo-font";

import { AntDesign, Feather } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const [showComponent, setShowComponent,] = useState(false);

    const [fontsLoaded] = useFonts({
        "Batangas-Bold": require("../assets/fonts/Batangas-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleComponent = () => {
        setShowComponent(!showComponent);
    }

    return (
        <>
            {!showComponent ? (
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        height: "100%",
                    }}
                >
                    <View>
                        <View style={{ alignItems: "center" }}>
                            <Image
                                style={{ width: 50, height: 25, top: 20 }}
                                source={require("../assets/img/wabi-rostro.png")}
                            ></Image>
                            <Text
                                style={{
                                    fontFamily: "Batangas-Bold",
                                    fontSize: 80,
                                    color: "#B400AA",
                                }}
                            >
                                Enova
                            </Text>
                            <Text style={{ textAlign: "center", width: 280 }}>
                                Cuidar al medio ambiente, la opción más inteligente
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ alignItems: "center", justifyContent: "center" }}
                        onPress={handleComponent}
                    >
                        <ImageBackground
                            style={{
                                width: 250,
                                height: 140,
                                alignItems: "flex-end",
                                justifyContent: "center",
                            }}
                            source={require("../assets/img/Button.png")}
                        >
                            <Text
                                style={{
                                    fontSize: 17,
                                    color: "#fff",
                                    fontWeight: "bold",
                                    marginTop: 75,
                                    textAlign: "center",
                                    marginRight: 30,
                                    fontFamily: "Batangas-Bold",
                                }}
                            >
                                Comencemos
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            ) : (
                <ChooseTools />
            )}
        </>
    );
};

const ChooseTools = () => {
    const navigation = useNavigation();

    return (
        <View style={{ gap: 20, height: '100%',  alignItems: "center", justifyContent: "center"}}>
            <Text style={{ fontSize: 25, fontWeight: 500, margin: 20, }}>Elige la funcion que quieres utilizar: </Text>
            <View style={{ gap: 30, alignItems: "center", justifyContent: "center", }}>
                <TouchableOpacity onPress={() => navigation.navigate('ChatBot')} style={{ backgroundColor: "#5B2273", padding: 10, borderRadius: 10, alignItems: "center", justifyContent: "center", gap: 10, width: 230, height: 200 }}>
                    <AntDesign name="message1" size={40} color="#D9D9D9" />
                    <Text style={{ color: "#D9D9D9", fontWeight: "600", fontFamily: "Batangas-Bold", fontSize: 18, margin: 10, }}>ChatBot</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ImageDetector')} style={{ backgroundColor: "#BF68C9", padding: 10, borderRadius: 10, alignItems: "center", justifyContent: "center", gap: 10, width: 230, height: 200 }}>
                    <Feather name="image" size={40} color="#D9D9D9" />
                    <Text style={{ color: "#D9D9D9", fontWeight: "600", fontFamily: "Batangas-Bold", fontSize: 18, margin: 8, width: 100, textAlign: "center", }}>Detector de Imagenes</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home;
