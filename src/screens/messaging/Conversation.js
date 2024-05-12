import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Layout, Text, TopNav, useTheme, themeColor, TextInput, Button } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { useMessage } from '../../provider/MessageProvider';
import { useUser } from '../../provider/UserProvider';
import { auth } from '../../../firebase.config';

export default function ConversationScreen({ route, navigation }) {
  const { conversationId } = route.params;
  const { sendMessage, fetchMessages, messages, conversations } = useMessage();
  const [messageText, setMessageText] = useState('');
  const { isDarkmode, setTheme } = useTheme();
  const { getUserData } = useUser();
  const [otherParticipantName, setOtherParticipantName] = useState("Loading...");

  useEffect(() => {
    const unsubscribe = fetchMessages(conversationId);
    return () => unsubscribe(); // Clean up on unmount
  }, [conversationId]);

  useEffect(() => {
    const conversation = conversations.find(convo => convo.id === conversationId);
    const otherUserId = conversation?.participants.find(p => p !== auth.currentUser.uid);
    if (otherUserId) {
      getUserData(otherUserId).then(userData => {
        if (userData) {
          setOtherParticipantName(userData.name);
        } else {
          setOtherParticipantName("Unknown");
        }
      });
    }
  }, [conversations, conversationId]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(conversationId, messageText.trim());
      setMessageText('');
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent={otherParticipantName}
        leftContent={<Ionicons name="chevron-back" size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        leftAction={() => navigation.goBack()}
        rightContent={<Ionicons name={isDarkmode ? 'sunny' : 'moon'} size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        rightAction={() => setTheme(isDarkmode ? 'light' : 'dark')}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages[conversationId]?.map((msg, index) => (
            <View key={index} style={[
              styles.messageBubble,
              msg.senderId === auth.currentUser.uid ? styles.sentMessage : styles.receivedMessage
            ]}>
              <Text style={{ color: msg.senderId === auth.currentUser.uid ? 'white' : 'black' }}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message"
            rightContent={
              <Ionicons name="send" size={20} color={themeColor.primary} onPress={handleSendMessage} />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    padding: 10
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: themeColor.primary,
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#dedede',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
