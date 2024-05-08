import React from 'react';
import { FlatList } from 'react-native';
import { Layout, Text } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import CustomTopNav from '../components/CustomTopNav';
import NotificationItem from '../components/NotificationItem';
import { useNotifications } from '../provider/NotificationProvider';

export default function Notifications({ navigation }) {
  const { notifications, markAsRead } = useNotifications();

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

  const handlePress = (item) => {
    if (item.type === 'book_availability' && item.bookId) {
      navigation.navigate('BookDetails', { bookId: item.bookId });
    }
    markAsRead(item.id);
  };

  return (
    <Layout>
      <CustomTopNav title="Notifications" navigation={navigation} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem
            icon={getIcon(item.type)}
            title={item.title}
            subtitle={item.message}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </Layout>
  );
}
