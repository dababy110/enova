import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";

import { API_KEY_GOOGLE_VISION, API_KEY_OPENAI } from "../config.js";

import { MaterialIcons } from "@expo/vector-icons";

const ImageDetector = () => {
  const [data, setData] = useState("");
  const [labels, setLabels] = useState([]);
  const [imageUri, setImageUri] = useState(null);

  let detectorImageLabels = [];

  labels.map((label) => detectorImageLabels.push(label.description));

  if (data == "Gris") {
    return (
      <View>
        <Text>Gris</Text>
      </View>
    )
  } else if (data == "Naranja") {
    return (
      <View>
        <Text>Naranja</Text>
      </View>
    )
  } else if (data == "Verde") {
    return (
      <View>
        <Text>Verde</Text>
      </View>
    )
  } else if (data == "Amariilo") {
    return (
      <View>
        <Text>Amarillo</Text>
      </View>
    )
  } else if (data == "Azul") {
    return (
      <View>
        <Text>Azul</Text>
      </View>
    )
  } else if (data == "Rojo") {
    return (
      <View>
        <Text>Rojo</Text>
      </View>
    )
  }

  const handleSend = async (newMessages = []) => {
    try {
      setIsLoading(true);

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
          adiccional devuelve solo la palabra relacionada a la conclusion que llegaste como te indique anteriomente: ${detectorImageLabels}`,
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

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

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
      console.log(result);
    } catch (e) {
      console.error(e);
      Alert("Error eligiendo la imagen, Intente De nuevo");
    }
  };

  const analyzeImage = async () => {
    try {
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
            features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
          },
        ],
      };

      const apiResponse = await axios.post(apiURL, requestData);
      setLabels(apiResponse.data.responses[0].labelAnnotations);
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
      {/* labels.length > 0 && (
        <View>
          <Text>Labels:</Text>
          {labels.map((label) => (
            <Text key={label.mid}>{label.description}</Text>
          ))}
        </View>
          ) */}
    </View>
  );
};

export default ImageDetector;