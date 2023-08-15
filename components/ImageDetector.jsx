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
import { API_KEY_GOOGLE_VISION, API_KEY_OPENAI } from "../config.js";

import { MaterialIcons } from "@expo/vector-icons";

const ImageDetector = () => {
  const [data, setData] = useState("");
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const BasureroAmarillo = require("../assets/img/Basureros/BasureroAmarillo.png");
  const BasureroNaranja = require("../assets/img/Basureros/BasureroNaranja.png");
  const BasureroVerde = require("../assets/img/Basureros/BasureroVerde.png");
  const BasureroAzul = require("../assets/img/Basureros/BasureroAzul.png");
  const BasureroGris = require("../assets/img/Basureros/BasureroGris.png");
  const BasureroRojo = require("../assets/img/Basureros/BasureroRojo.png");
  let profileComponet;

  console.log("Esta es la respuesta que va en el if: ",data)

  if (data === "Gris") {
    profileComponet = (
      <DefaultResponse name="Bote Gris" url={BasureroGris} color="#808080" />
    );
  } else if (data === "Naranja") {
    profileComponet = (
      <DefaultResponse
        name="Bote Naranja"
        url={BasureroNaranja}
        color="#FF8000"
      />
    );
  } else if (data === "Verde") {
    profileComponet = (
      <DefaultResponse name="Bote Verde" url={BasureroVerde} color="#74B654" />
    );
  } else if (data === "Amarillo") {
    profileComponet = (
      <DefaultResponse
        name="Bote Amarillo"
        url={BasureroAmarillo}
        color="#F8E20D"
      />
    );
  } else if (data === "Azul") {
    profileComponet = (
      <DefaultResponse name="Bote Azul" url={BasureroAzul} color="#094293" />
    );
  } else if (data === "Rojo") {
    profileComponet = (
      <DefaultResponse name="Bote Rojo" url={BasureroRojo} color="#CB3234" />
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
            features: [{ type: "OBJECT_LOCALIZATION", maxResults: 5 }],
          },
        ],
      };

      const apiResponse = await axios.post(apiURL, requestData);
      setLabels(
        apiResponse.data.responses[0].localizedObjectAnnotations[0].name
      );

      console.log("Esta es la deteccion de objectos: ", apiResponse.data.responses[0].localizedObjectAnnotations[0].name)

      //console.log(apiResponse.data.responses[0].localizedObjectAnnotations[0].name)

      //Request ChatGpt
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
      };

      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt: `A continuación recibirás 5 palabras que fueron extraídas de una imagen con una inteligencia artificial que analiza la 
          imagen y detecta los objectos que hay en esa imagen, lo que quiero lograr es que dependiendo de las palabras que contienen muestre 
          una SOLO una respuesta por todas las palabras, osea muestre una respuesta que mas se relacione (solo quiero que muestre esa respuesta 
          no quiero que muestres ningun texto adiccional solo lo que te pido), si las palabras estan relacionadas de cualquier forma con Desechos 
          en general (por ejemplo materiales biodegradables) quiero que des como respuesta solamente la palabra: "Gris" (exactamente escrita como te 
          indique), si las palabras estan relacionadas de cualquier forma con Restos de comida (por ejemplo huesos o cualquier resto de alimento cuenta) 
          quiero que des como respuesta solamente la palabra: "Naranja" (exactamente escrita como te indique), si las palabras estan relacionadas de cualquier
          forma con Vidrios  (por ejemplo Botellas de vidrio, vidrios rotos o vidrio en general) quiero que des como respuesta solamente la palabra: "Verde" (exactamente
          escrita como te indique), si las palabras estan relacionadas de cualquier forma con Plasticos y envases metalicos (por ejemplo latas o envases de alimentos y bebidas 
          en bolsas) quiero que des como respuesta solamente la palabra: "Amarillo" (exactamente escrita como te indique), si las palabras estan relacionadas de cualquier forma con 
          Papel (por ejemplo todo tipo de papeles, cartones, periodicos, revistas, papeles de envolver, o folletos publicitarios, etc) quiero que des como respuesta solamente la palabra: 
          "Azul" (exactamente escrita como te indique), si las palabras estan relacionadas de cualquier forma con  Desechos peligrosos (por ejemplo, baterias, pilas, insecticidas, aceites, 
          aerosoles o productos tecnologicos, residuos hospitalarios infecciosos) quiero que des como respuesta solamente la palabra: "Rojo" (exactamente escrita como te indique), si las 
          palabras no estan relacionadas con ninguna de las formas anteriores devuelve la palabra neutro, las palabras van a estar en ingles pero eso no deberia afectar por que lo que debes
          tomar en cuenta es el significado, recuerda dar la respuesta en español, a continuacion te dare las palabras y independientemente de la conclusion que llegues no devuelvas ningun texto
          adiccional devuelve solo la palabra relacionada a la conclusion que llegaste como te indique anteriomente: ${labels}`,
          max_tokens: 1200,
          temperature: 0.1,
          n: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY_OPENAI}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const responseData = response.data.choices[0].text.trim();
      setData(responseData);

      setLoading(false);
    } catch (error) {
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
