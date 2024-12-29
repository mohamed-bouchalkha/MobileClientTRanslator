// App.js
import React, { useState, useCallback } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { View, TextInput, Button, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

export default function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const sendMessage = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;
    if (!userMessage) return;

    setLoading(true);
    
    try {
      const response = await axios.post('http://192.168.1.7:5000/api/translate', {
        message: userMessage
      });

      const botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: response.data.reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    } catch (error) {
      const botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: 'Error while processing the message. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => sendMessage(newMessages)}
        user={{
          _id: 1,
        }}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ position: 'absolute', bottom: 20, left: '50%', transform: [{ translateX: -25 }] }}
        />
      )}
    </View>
  );
}
