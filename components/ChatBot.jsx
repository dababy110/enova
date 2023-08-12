import React, { useState } from "react";
import { Image, View, ActivityIndicator } from "react-native";

import { API_KEY_OPENAI } from "../config.js";

import axios from "axios";
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Bubble,
} from "react-native-gifted-chat";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (newMessages = []) => {
    try {
      setIsLoading(true);

      const userMessage = newMessages[0];
      const messageText = userMessage.text.toLowerCase();

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, userMessage)
      );

      const apiRequestBody = {
        model: "gpt-3.5-turbo",
      };

      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt: `A partir de ahora eres un ChatBot que se llama Wabi y respondes dudas solo relacionadas con reciclar, reutilizar y reducir en terminos 
          generales (me refiero a terminos generales que no tiene que ser extrictamente relacionado pero si tiene que relacionarse) Si las preguntas 
          NO ESTAN relacionadas con reciclar, reutilizar y reducir en terminos generales (me refiero a terminos generales que no tiene que ser 
          extrictamente relacionado pero si tiene que relacionarse) responderas este mensaje default: "Lo siento, Wabi solo esta disponible para 
          ayudarte en dudas que tengas respecto al reciclaje." Si la pregunta SI ESTA relacionadas con reciclar, reutilizar y reducir en terminos 
          generales (me refiero a terminos generales que no tiene que ser extrictamente relacionado pero si tiene que relacionarse) daras una respuesta de 
          menos de 100 palabras a la pregunta anterior, Si la pregunta del usuario tiene que ver con el funcionamiento o informacion de 
          la empresa enova o el funcionamiento de la empresa en general(Que es la empresa en la cual pertenece el chatbot wabi) basaras 
          tus respuestas en la siguiente informacion: "" y si la pregunta se sale tus conocimiento y no viene en el texto anterior, responderas 
          lo siguiente: "Lo siento esta pregunta esta fuera de los conocimientos de Wabi", y si la pregunta es un saludo o una pregunta de como te 
          encuentras responderas este mensaje default: "¡Hola! Soy Wabi y estoy disponible para ayudarte en cualquier duda que tengas respecto al 
          reciclaje." La pregunta es la siguente recuerda comparla bien dependiendo de cada caso: ${messageText}`,
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
      const recipe = response.data.choices[0].text.trim();

      const botMessage = {
        _id: new Date().getTime() + 1,
        text: recipe,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Enova",
          avatar: require("../assets/img/wabi-circulo.png"),
          pending: true,
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
      );
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        marginBottom: 10,
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => handleSend(newMessages)}
        user={{ _id: 1 }}
        alwaysShowSend
        renderInputToolbar={(props) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 10,
              marginTop: 0,
              borderBottomWidth: 7,
              borderRadius: 10,
              borderColor: "#B95CC4",
            }}
          >
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: "rgba(0,0,0,0.001)",
                borderTopWidth: 0,
                borderTopColor: "#000",
                borderWidth: 0,
                marginTop: 0,
                width: "100%",
              }}
            />
          </View>
        )}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{ color: "black", fontSize: 16, padding: 10 }}
            placeholderTextColor="#888"
            placeholder={isLoading ? "Escribiendo..." : "Escribe un mensaje..."}
          />
        )}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{ justifyContent: "center", alignItems: "center" }}
          >
            {isLoading ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  marginRight: 25,
                }}
              >
                <ActivityIndicator size="small" color="#B95CC4" />
              </View>
            ) : (
              <Image
                style={{ width: 100, height: 65, marginBottom: 30 }}
                source={require("../assets/img/SendButton.png")}
              />
            )}
          </Send>
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: "#f1e2f4" }, // Cambia el color de las burbujas de respuestas
              right: { backgroundColor: "#B95CC4" }, // Cambia el color de las burbujas de preguntas
            }}
          />
        )}
      />
    </View>
  );
};

export default ChatBot;
