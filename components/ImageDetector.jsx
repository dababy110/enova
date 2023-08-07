import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_KEY_GOOGLE_VISION } from '../config.js';

const ImageDetector = () => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);

  console.log("Enova test");

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
      console.error("Error Picking the Image: ", e);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert("Please select an image first");
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
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
          },
        ],
      };

      const apiResponse = await axios.post(apiURL, requestData);
      setLabels(apiResponse.data.responses[0].labelAnnotations);

    } catch (error) {
      console.error("Error analyzing image", error);
      console.log("Response data:", error.response?.data); // Muestra la información de la respuesta si está disponible
      alert("Error analyzing image. Try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Enova</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={{width: 400, height: 300, objectFit: "contain",}}/>}
      <TouchableOpacity
        onPress={pickImage}
        style={styles.button}
      >
        <Text style={styles.text}>
            Choose an Image
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={analyzeImage}
        style={styles.button}
      >
        <Text style={styles.text}>
            AnalyzeImage an Image
        </Text>
      </TouchableOpacity>
      {
        labels.length > 0 && (
          <View>
              <Text style={styles.label}>
                  Labels:
              </Text>
              {
                labels.map((label) => (
                  <Text
                    key={label.mid}
                    style={styles.outputtext}
                  >
                    {label.description}
                  </Text>
                ))
              }
          </View>
        )
      }
    </View>
  );
};

export default ImageDetector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 100,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  text:{
    fontSize: 20,
    fontWeight: "bold",
  },
  label:{
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  outputtext: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
  },
});
