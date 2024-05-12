import React, { useContext } from "react";
import { ScrollView, Image, StyleSheet } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useMessage } from "../../provider/MessageProvider";
import { auth } from "../../../firebase.config";

export default function ({ navigation, route }) {
  const { isDarkmode, setTheme } = useTheme();
  const { Book } = route.params;
  const { createConversation } = useMessage(); // Use the context

  const contactSeller = async () => {
    try {
      const conversation = await createConversation(Book.seller);
      if (conversation) {
        navigation.navigate('Conversation', { conversationId: conversation.id });
      }
    } catch (error) {
      console.error('Error in contactSeller:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditBook", { book: Book });
  }

  return (
    <Layout>
      <TopNav
        middleContent={Book.title || "Book Details"}
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: Book.coverUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text fontWeight="bold" size="xl" style={{ marginTop: 20 }}>
          {Book.title} {Book.author ? `by ${Book.author}` : ""}
        </Text>
        <Text fontWeight="light" style={{ marginTop: 10, color: themeColor.gray400 }}>
          {Book.description || "No description available."}
        </Text>
        <Text fontWeight="light" style={{ marginTop: 10 }}>
          Course: {Book.course}
        </Text>
        <Text fontWeight="light" style={{ marginTop: 10 }}>
          Condition: {Book.condition}
        </Text>
        <Text fontWeight="medium" style={{ marginTop: 10, color: Book.status ? 'green' : 'red' }}>
          {Book.status ? "Available" : "Unavailable"}
        </Text>
        <Text fontWeight="medium" size="xl" style={{ marginTop: 10 }}>
          ${Book.price}
        </Text>
        {
          Book.seller == auth.currentUser.uid ? (
            <Button
              text="Edit"
              onPress={handleEdit}
              style={{ marginTop: 20 }}
            />
          ) : <Button
            text="Contact Seller"
            onPress={contactSeller}
            style={{ marginTop: 20 }}
          />
        }
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
});
