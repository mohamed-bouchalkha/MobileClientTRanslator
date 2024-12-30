import React, { useState, useCallback } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

// Path to bot avatar
const botAvatar = require('../assets/chatbot-avatar.jpg');
// Path to Send button icon
const sendIcon = require('../assets/send-icon.png');

export default function App() {
  const [messages, setMessages] = useState<any[]>([
    {
      _id: 1,
      text: 'Hello! I am your chatbot. I can translate messages from English to Darija Arabic. How can I assist you today?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Bot',
        avatar: botAvatar,
      },
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const sendMessage = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;
    if (!userMessage) return;

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.7:5000/api/translate', {
        message: userMessage,
      });

      const botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: response.data.reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          avatar: botAvatar,
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
          avatar: botAvatar,
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      const newMessage = {
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date(),
        user: { _id: 1 },
      };

      sendMessage([newMessage]);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => sendMessage(newMessages)}
        user={{
          _id: 1,
        }}
        renderInputToolbar={() => (
          <View style={styles.inputToolbar}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={text}
              onChangeText={setText}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Image source={sendIcon} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
        )}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  loader: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -25 }],
  },
});
