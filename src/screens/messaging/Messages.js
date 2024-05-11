import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableOpacity, RefreshControl, Image, StyleSheet } from 'react-native';
import { Layout, Text, useTheme, themeColor, TopNav, Avatar } from 'react-native-rapi-ui';
import { useMessage } from '../../provider/MessageProvider';
import { useUser } from '../../provider/UserProvider';
import { auth } from '../../../firebase.config';
import CustomTopNav from '../../components/CustomTopNav';

const ConversationItem = ({ conversation, onPress }) => {
  const { isDarkmode } = useTheme();
  const { getUserData } = useUser();
  const [otherParticipant, setOtherParticipant] = useState({
    name: 'Unknown',
    avatar: 'https://ui-avatars.com/api/?name=Unknown',
  });

  useEffect(() => {
    const otherUserId = conversation.participants.find(p => p !== auth.currentUser.uid);
    const fetchUserData = async () => {
      const userData = await getUserData(otherUserId);
      if (userData && userData.avatar) {
        setOtherParticipant(userData);
      } else {
        setOtherParticipant({
          name: 'Unknown',
          avatar: 'https://i.imgur.com/CzXTtJV.jpg'
        });
      }
    };
    fetchUserData();
  }, [conversation.participants]);

  // Format the date from a Firebase Timestamp to 12-hour format with AM/PM
  const formatDate = (firebaseTimestamp) => {
    if (!firebaseTimestamp) return "";undefined
    const date = new Date(firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };



  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Avatar
          source={{ uri: `https://ui-avatars.com/api/?name=` + otherParticipant.name + `&background=random` }}
          shape='round'
          size='lg'
        />
        <View style={styles.textContainer}>
          <Text fontWeight="bold">{otherParticipant.name}</Text>
          <Text color="gray">
            {conversation.lastMessage.text || "No messages yet"}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(conversation.lastMessage.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: themeColor.white,
  },
  textContainer: {
    marginLeft: 10,
  },
  timestamp: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: 'gray',
  },
});

export default function MessagesScreen({ navigation }) {
  const { conversations, loading, refreshConversations } = useMessage();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshConversations();
    setRefreshing(false);
  };

  const renderEmptyComponent = () => {
    return conversations.length === 0 ? (
      <Text>No conversations yet. Start chatting from a book detail page!</Text>
    ) : (
      <Text>All conversations are empty. Send a message to start the chat!</Text>
    );
  };

  useEffect(() => {
    refreshConversations();
  }, []);
  
  return (
    <Layout>
      <CustomTopNav title="Messages" navigation={navigation} />
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
          />
        )}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={themeColor.primary}
          />
        }
      />
    </Layout>
  );
}
