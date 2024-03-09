import React from "react";
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

export default function ({ navigation, route }) {
  const { isDarkmode, setTheme } = useTheme();
  const { Book } = route.params;

  // Ensure the 'Book' object has the required properties
  if (!Book) {
    throw new Error("No book data provided");
    return (
      <Layout>
        <Text>Book data is unavailable.</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <TopNav
        middleContent={Book.title}
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
          source={{ uri: Book.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text size="h3" style={styles.title}>{Book.title}</Text>
        <Text size="h4" style={styles.author}>Author: {Book.author}</Text>
        <Text style={styles.price}>Price: ${Book.price}</Text>
        <Text style={styles.description}>{Book.description || "No description available."}</Text>
        
        <Button 
          text="Contact Seller"
          onPress={() => {
            // Implement the action to contact the seller
          }}
          style={styles.button}
        />
        {/* Additional buttons and information can be added here */}
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
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
  author: {
    marginBottom: 5,
  },
  price: {
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
