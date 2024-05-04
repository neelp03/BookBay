import React from "react";
import { ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
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

  // Function to handle the click on the seller's ID
  const contactSeller = () => {
    navigation.navigate('MessageTab', { sellerId: Book.sellerId })
  };

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
          source={{ uri: Book.coverUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text size="h3" style={styles.title}>{Book.title}</Text>
        <Text size="h4" style={styles.subtitle}>Author: {Book.author}</Text>
        <Text style={styles.details}>ISBN: {Book.isbn}</Text>
        <Text style={styles.details}>Condition: {Book.condition}</Text>
        <Text style={styles.details}>Course: {Book.course}</Text>
        <Text style={styles.price}>Price: ${Book.price}</Text>

        <TouchableOpacity onPress={contactSeller} style={styles.sellerButton}>
          <Text style={styles.sellerButtonText}>Contact Seller</Text>
        </TouchableOpacity>
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
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 24,
  },
  subtitle: {
    marginBottom: 5,
    fontSize: 18,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
  },
  sellerButton: {
    marginTop: 10,
    backgroundColor: themeColor.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
