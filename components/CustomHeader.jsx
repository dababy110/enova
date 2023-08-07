import React from 'react'
import { View, Text, Image } from 'react-native'

import { useFonts } from "expo-font";

const CustomHeader = () => {
    const [fontsLoaded] = useFonts({
        "Batangas-Bold": require("../assets/fonts/Batangas-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
                style={{ width: 50, height: 25, }}
                source={require("../assets/img/wabi-rostro.png")}
            />
            <Text
                style={{
                    fontSize: 40,
                    fontWeight: 600,
                    color: "#B400AA",
                    fontFamily: "Batangas-Bold",
                }}
            >
                Enova
            </Text>
        </View>
    )
}

export default CustomHeader