import { View, Text, Image } from "react-native";
import React from "react";

const DefaultResponse = (props) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <View>
        <Text>Este objecto se recicla en: </Text>
        <Text style={{ fontWeight: "bold", fontSize: 20, color: props.color}}>
          {props.name}
        </Text>
      </View>
      <Image style={{ height: 100, width: 90 }} source={props.url} />
    </View>
  );
};

export default DefaultResponse;
