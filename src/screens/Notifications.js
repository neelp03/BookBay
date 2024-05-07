import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';
import { Layout } from 'react-native-rapi-ui';
import CustomTopNav from '../components/CustomTopNav';
import NotificationItem from '../components/NotificationItem';
import { NotificationContext } from '../provider/NotificationProvider';

export default function NotificationsScreen({ navigation }) {
  const { notifications } = useContext(NotificationContext);

  return (
    <Layout>
      <CustomTopNav title="Notifications" navigation={navigation} />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem
            icon={item.icon} // Make sure to provide the correct icon path
            title={item.title}
            subtitle={item.subtitle} // Adjust according to your data structure
          />
        )}
      />
    </Layout>
  );
}
