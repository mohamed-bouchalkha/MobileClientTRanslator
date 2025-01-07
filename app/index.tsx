import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const botAvatar = require('../assets/chatbot-avatar.jpg');

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const handleChatNavigation = () => {
    router.push('./ChatScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={botAvatar} 
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome to TranslatBot</Text>
          <Text style={styles.description}>
            Professional translation assistant for English to Darija Arabic communication
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleChatNavigation}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Translation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#F6F7FB',
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.2,
  },
  textContainer: {
    marginTop: 32,
    marginBottom: 48,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: Platform.select({ ios: '700', android: 'bold' }),
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    textAlign: 'center',
    maxWidth: '80%',
    letterSpacing: 0.3,
  },
  startButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});