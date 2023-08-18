import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";

import DefaultResponse from "./DefaultResponse.jsx";
import { API_KEY_GOOGLE_VISION, API_KEY_IMAGE_DETECTION } from "../config.js";

import { MaterialIcons } from "@expo/vector-icons";

const ImageDetector = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const BasureroAmarillo = require("../assets/img/Basureros/BasureroAmarillo.png");
  const BasureroNaranja = require("../assets/img/Basureros/BasureroNaranja.png");
  const BasureroVerde = require("../assets/img/Basureros/BasureroVerde.png");
  const BasureroAzul = require("../assets/img/Basureros/BasureroAzul.png");
  const BasureroGris = require("../assets/img/Basureros/BasureroGris.png");
  const BasureroRojo = require("../assets/img/Basureros/BasureroRojo.png");

  let profileComponet;

  if (data === "Gris") {
    profileComponet = (
      <DefaultResponse
        name="Bote de Desechos Generales"
        url={BasureroGris}
        color="#808080"
      />
    );
  } else if (data === "Naranja") {
    profileComponet = (
      <DefaultResponse
        name="Bote Orgánico"
        url={BasureroNaranja}
        color="#FF8000"
      />
    );
  } else if (data === "Verde") {
    profileComponet = (
      <DefaultResponse name="Bote Vidrio" url={BasureroVerde} color="#74B654" />
    );
  } else if (data === "Amarillo") {
    profileComponet = (
      <DefaultResponse
        name="Bote Plastico"
        url={BasureroAmarillo}
        color="#F8E20D"
      />
    );
  } else if (data === "Azul") {
    profileComponet = (
      <DefaultResponse name="Bote Papel" url={BasureroAzul} color="#094293" />
    );
  } else if (data === "Rojo") {
    profileComponet = (
      <DefaultResponse
        name="Bote Desechos Peligrosos"
        url={BasureroRojo}
        color="#CB3234"
      />
    );
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert("Error eligiendo la imagen, Intente De nuevo");
    }
  };

  const analyzeImage = async () => {
    try {
      setLoading(true);

      //GoogleVision
      if (!imageUri) {
        alert("Seleccione una imagen primero");
        return;
      }

      const apiKey = API_KEY_GOOGLE_VISION;
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: "OBJECT_LOCALIZATION" }],
          },
        ],
      };

      const apiResponse = await axios.post(apiURL, requestData);
      const test =
        apiResponse.data.responses[0].localizedObjectAnnotations[0].name;

      console.log(test);

      //Request ChatGpt
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
      };

      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt: `A continuacion recibiras una palabra que fue extraida de una imagen, con una inteligencia artificial de detecion de objectos, me vas a ayudar a clasificarlas devolviendo un texto que te indicare la palabra es en ingles pero tu respuesta tiene que estar en español, si la palabra se relaciona con Desechos generales, quiero que des unicamente como respuesta solamente la palabra: "Gris",si la palabra estan relacionada de cualquier forma con Desechos organicos como restos de comida, residuos de jardinería, cáscaras de frutas y verduras, posos de café y filtros de té, quiero que des unicamente como respuesta la palabra: "Naranja", si la palabra esta relacionada de cualquier forma con Vidrio como botellas de vidrio, tarros de vidrio, restos de vidrios o cualquier cosa relacionada con vidrio, quiero que des unicamente como respuesta la palabra naranja: "Verde", si la palabra se relaciona con plasticos o envases metalicos como botellas plasticaslatas, envases plasticos de alimentos, bebidas o cualquier tipo de plastico como bolsas o envoltorios, quiero que des unicamente como respuesta la palabra: "Amarillo", si la palabra esta relacionada de cualquier forma con Papel o carton como cajas de carton, hojas de papel, documentos, bolas de papel arrugado o cualquier clase de papel o carton, quiero que des unicamente como respuesta la palabra: "Azul", si la palabra esta relacionada de cualquier forma con Desechos peligrosos como Pilas y baterías, Productos químicos domésticos, Medicamentos vencidos, Bombillas o productor electronicos dañados, qiero que des unicamente como respuesta la palabra: "Rojo", a continuacion te dare la palabra y independientemente de la conclusion que llegues no devuelvas ningun texto adiccional devuelve solo la palabra relacionada a la conclusion que llegaste como te indique anteriomente aqui va la palabra: "${test}"`,
          max_tokens: 1200,
          temperature: 0.1,
          n: 1,         
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY_IMAGE_DETECTION}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const responseData = response.data.choices[0].text.trim();
      setData(responseData);

      console.log(responseData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Error analizando la imagen. Intente de nuevo");
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        height: "100%",
        width: "100%",
      }}
    >
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 280,
            height: 300,
            objectFit: "cover",
            borderRadius: 10,
            borderWidth: 4,
            borderColor: "#B400AA",
          }}
        />
      )}
      {!imageUri && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            Analiza tus fotos 📸
          </Text>
          <Text
            style={{
              marginLeft: 40,
              marginTop: 10,
              marginRight: 40,
              marginBottom: 0,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Sube tus imagenes de objectos para saber en que clase de basurero se
            desecha
          </Text>
        </View>
      )}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          margin: 20,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={pickImage}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#BF68C9",
            borderRadius: 5,
            height: 70,
            width: 90,
          }}
        >
          <MaterialIcons name="file-upload" size={24} color="white" />
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Subir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={analyzeImage}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#5B2273",
            borderRadius: 5,
            padding: 10,
            height: 70,
            width: 90,
          }}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
          >
            Analizar Imagen
          </Text>
        </TouchableOpacity>
      </View>
      {!loading ? (
        profileComponet
      ) : (
        <ActivityIndicator size="large" color="#B95CC4" />
      )}
    </View>
  );
};

export default ImageDetector;
