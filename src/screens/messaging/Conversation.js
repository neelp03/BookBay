import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Layout, Text, TextInput, Button, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
import { useMessage } from "../../provider/MessageProvider";

export default function ConversationScreen({ navigation, route }) {
  const { conversationId } = route.params;
  const { messages, fetchMessages, sendMessage, markMessagesAsRead } = useMessage();
  const [messageText, setMessageText] = useState("");
  const { isDarkmode } = useTheme();
  const conversationMessages = messages[conversationId] || [];

  useEffect(() => {
    const unsubscribe = fetchMessages(conversationId);
    return () => unsubscribe();  // Cleanup subscription on unmount
  }, [conversationId]);

  useEffect(() => {
    markMessagesAsRead(conversationId);
  }, [conversationMessages]);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      await sendMessage(conversationId, messageText.trim());
      setMessageText("");
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Conversation"
        leftContent={<Ionicons name="chevron-back" size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        leftAction={() => navigation.goBack()}
      />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView style={styles.messagesContainer}>
          {conversationMessages.map((msg, index) => (
            <View key={index} style={styles.messageBubble(isDarkmode, msg.senderId)}>
              <Text>{msg.text}</Text>
              <Text style={styles.messageTime}>{new Date(msg.createdAt.seconds * 1000).toLocaleTimeString()}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            style={styles.input}
          />
          <Button text="Send" onPress={handleSendMessage} style={styles.sendButton} />
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: (isDarkmode, isSender) => ({
    padding: 10,
    borderRadius: 10,
    backgroundColor: isSender ? themeColor.primary : (isDarkmode ? themeColor.dark200 : themeColor.grey200),
    alignSelf: isSender ? 'flex-end' : 'flex-start',
    marginBottom: 10,
  }),
  messageTime: {
    fontSize: 12,
    color: themeColor.gray600,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  }
});
