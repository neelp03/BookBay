import React, { useContext } from "react";
import { View, Linking, FlatList, Image, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { BookContext } from "../provider/BookProvider"

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth();

  // Consume the books data from the BookContext
  const { books, loading } = useContext(BookContext);

  return (
    <Layout>
      <TopNav
        middleContent="Home"
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <View style={{ flex: 1 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {/* Navigate to book details screen */ }}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                  />
                  <Text>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Layout>
  );
}
