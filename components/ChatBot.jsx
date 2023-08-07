import React, { useState } from 'react'
import {
  Image,
  View,
} from "react-native";
import axios from 'axios';
import { API_KEY_OPENAI } from '../config.js';
import { GiftedChat, InputToolbar, Composer, Send } from 'react-native-gifted-chat'

const ChatBot = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = async (newMessages = []) => {
    try {
      const userMessage = newMessages[0];
      const messageText = userMessage.text.toLowerCase();
      const keywords = ['reciclar', 'reutilizar', 'realmacenar', "reciclo", "desechar", "degradarse", "qué es", "reutilizo"];
      const welcomes = ['¡Hola!', '¡Buenos Días!', '¡Buenas Noches!', '¡Buenas Tardes!', '¿Cómo estas?'];

      setMessages(previousMessages => GiftedChat.append(previousMessages, userMessage));

      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
      }

      if (welcomes.some(welcome => messageText.includes(welcome)) || !keywords.some(keyword => messageText.includes(keyword))) {
        const botMessage = {
          _id: new Date().getTime() + 1,
          text: `¡Hola! Soy Enova y estoy disponible para ayudarte en cualquier duda que tengas respecto al reciclaje.`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Enova',
            avatar: require("../assets/img/wabi-circulo.png"),
            pending: true,

          }
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
        return;
      }

      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `Dame un respuesta detallada y no de mas de 50 palabras ${messageText}`,
        max_tokens: 1200,
        temperature: 0.2,
        n: 1,
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY_OPENAI}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestBody)
      })
      const recipe = response.data.choices[0].text.trim();

      const botMessage = {
        _id: new Date().getTime() + 1,
        text: recipe,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Enova',
          avatar: require("../assets/img/wabi-circulo.png"),
          pending: true,
        }
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={{ flex: 1, width: 380, marginBottom: 10, height: "100%" }}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => handleSend(newMessages)}
        user={{ _id: 1 }}
        renderInputToolbar={props => (
          <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 5, borderBottomWidth: 7, borderRadius: 10, borderColor: "#B95CC4",}}>
            <InputToolbar
              {...props}
              containerStyle={{ backgroundColor: 'rgba(0,0,0,0.001)', borderTopWidth: 0, borderTopColor: '#000', borderWidth: 0, marginTop: 0, width: "100%", }}
            />
          </View>
        )}
        renderComposer={props => (
          <Composer {...props} textInputStyle={{ color: 'black', fontSize: 16, padding: 10, }} placeholderTextColor="#888" />
        )}
        renderSend={props => (
          <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 100, height: 65, marginBottom: 25, }} source={require("../assets/img/SendButton.png")} />
          </Send>
        )}
      />
    </View>
  )
};

export default ChatBot;