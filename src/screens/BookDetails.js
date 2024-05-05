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
        {/* if author field is empty, dont show author */}
        <Text fontWeight="bold" size="xl" style={{ marginTop: 20 }}>
          {Book.title} {Book.author ? `by ${Book.author}` : ""}
        </Text>
        <Text fontWeight="light" style={{ marginTop: 10, color:themeColor.gray400 }}>
          {Book.description}
        </Text>
        <Text fontWeight="light" style={{ marginTop: 10 }}>
          Condition: {Book.condition}
        </Text>
        <Text fontWeight="medium" size="xl" style={{ marginTop: 10 }}>
          ${Book.price}
        </Text>

        <Button
          text="Contact Seller"
          onPress={contactSeller}
          style={{ marginTop: 20 }}
        />
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
