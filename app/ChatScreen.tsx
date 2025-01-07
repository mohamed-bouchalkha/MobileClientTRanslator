import React, { useState, useCallback, useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { View, TextInput, TouchableOpacity, Animated, StyleSheet, Platform, Image } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import axios from 'axios';

const botAvatar = require('../assets/chatbot-avatar.jpg');
const sendIcon = require('../assets/send-icon.png');

const TypingIndicator = () => {
  // ... TypingIndicator component remains the same ...
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      const animations = [dot1, dot2, dot3].map((dot, index) =>
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.loop(Animated.parallel(animations)).start();
    };

    animate();
  }, []);

  const dotStyle = (animatedValue: Animated.Value) => ({
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  });

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, dotStyle(dot1)]} />
      <Animated.View style={[styles.dot, dotStyle(dot2)]} />
      <Animated.View style={[styles.dot, dotStyle(dot3)]} />
    </View>
  );
};

export default function App() {
  const [messages, setMessages] = useState<any[]>([
    {
      _id: 1,
      text: 'Hello! I am your chatbot. I can translate messages from English to Darija Arabic. How can I assist you today?',
      createdAt: new Date(Date.now() - 1000), // Ensure initial message appears at top
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
    const userMessage = newMessages[0].text;
    if (!userMessage) return;

    // Add user message
    const userMessageObj = {
      _id: Math.round(Math.random() * 1000000),
      text: userMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    
    setMessages(previousMessages => [...previousMessages, userMessageObj]);
    setLoading(true);

    // Add typing indicator
    const loadingMessage = {
      _id: `loading-${Date.now()}`,
      text: '',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Bot',
        avatar: botAvatar,
      },
      isTyping: true,
    };
    setMessages(previousMessages => [...previousMessages, loadingMessage]);

    try {
      const response = await axios.post('http://192.168.1.9:5000/api/translate', {
        message: userMessage,
      });

      // Remove loading message and add bot response
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

      setMessages(previousMessages => 
        previousMessages
          .filter(msg => !msg.isTyping)
          .concat([botMessage])
      );
    } catch (error) {
      const errorMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: 'Error while processing the message. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          avatar: botAvatar,
        },
      };

      setMessages(previousMessages => 
        previousMessages
          .filter(msg => !msg.isTyping)
          .concat([errorMessage])
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const renderBubble = (props: any) => {
    if (props.currentMessage.isTyping) {
      return (
        <View style={styles.loadingBubble}>
          <TypingIndicator />
        </View>
      );
    }
    return <Bubble {...props} />;
  };

  const handleSend = () => {
    if (text.trim()) {
      const newMessage = [{
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date(),
        user: { _id: 1 },
      }];

      sendMessage(newMessage);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => sendMessage(newMessages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        inverted={false} // This is the key change
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  typingContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#90939970',
    marginHorizontal: 3,
  },
  loadingBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginLeft: 10,
    marginBottom: 10,
  },
});