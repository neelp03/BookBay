import React, { useContext, useCallback } from 'react';
import { FlatList, ScrollView, RefreshControl } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import CustomTopNav from '../components/CustomTopNav';
import NotificationItem from '../components/NotificationItem';
import { useNotifications } from '../provider/NotificationProvider';
import { BookContext } from '../provider/BookProvider';

export default function Notifications({ navigation }) {
  const { notifications, markAsRead, loading, refreshNotifications } = useNotifications();
  const { getBookById } = useContext(BookContext);

  const onRefresh = useCallback(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'chat':
        return <Ionicons name="chatbubble-ellipses-outline" size={30} />;
      case 'book_availability':
        return <Ionicons name="book-outline" size={30} />;
      case 'developer':
        return <Ionicons name="code-slash-outline" size={30} />;
      default:
        return <Ionicons name="notifications-outline" size={30} />;
    }
  };

  const handlePress = async (item) => {
    if (item.type === 'book_availability' && item.bookId) {
      const bookItem = await getBookById(item.bookId);
      if (bookItem) {
        navigation.navigate('BookDetails', { Book: bookItem });
      } else {
        console.log("Book not found.");
      }
    }
    markAsRead(item.id);
  };

  return (
    <Layout>
      <CustomTopNav title="Notifications" navigation={navigation} />
      {/* if no notification say  no notifications or make flatlist*/}
      {notifications.length === 0 ? (
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>No notifications</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationItem
              icon={getIcon(item.type)}
              title={item.title}
              subtitle={item.message}
              read={item.read}
              onPress={() => handlePress(item)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      )}
    </Layout>
  );
}
