import React, { useContext } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Layout, Text, useTheme } from 'react-native-rapi-ui';
import CustomTopNav from '../../components/CustomTopNav';
import { useMessage } from '../../provider/MessageProvider';

export default function MessagesScreen({ navigation }) {
  const { conversations, loading } = useMessage;
  const { isDarkmode } = useTheme(); // This is for additional theme-specific customizations if needed

  const renderEmptyComponent = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', margin:20}}>
      <Text>No conversations yet.</Text>
      <Text style={{ textAlign: 'center', justifyContent: 'center'}}>
        You can start a new conversation by clicking the 'Contact Seller' button in any book details screen.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <Layout>
        <CustomTopNav title="Messages" navigation={navigation} />
        <Text>Loading messages...</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <CustomTopNav title="Messages" navigation={navigation} />
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: isDarkmode ? '#2c2c2c' : '#eaeaea',
            }}
          >
            <Text size="md" style={{ fontWeight: 'bold' }}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmptyComponent}
      />
      </View>
    </Layout>
  );
}
