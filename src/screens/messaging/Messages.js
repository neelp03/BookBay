import React, { useContext } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { MessageContext } from '../../provider/MessageProvider'; // You'll create this

export default function Messages({ navigation }) {
  const { conversations, loading } = []; // Assuming you have a context for messages

  if (loading) return <Text>Loading messages...</Text>;

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
