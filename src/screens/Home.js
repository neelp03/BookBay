import React, { useContext, useState, useCallback } from "react";
import { View, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { Layout, Text, TopNav, useTheme, themeColor } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { BookContext, refreshBooks } from "../provider/BookProvider";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { books, loading, refreshBooks } = useContext(BookContext);
  const [refreshing, setRefreshing] = useState(false);

  const openBookDetails = (book) => {
    navigation.navigate('BookDetails', { Book: book });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshBooks().then(() => {
      setRefreshing(false);
    }).catch((error) => {
      console.error(error);
      setRefreshing(false);
    })
    ;
  }, [refreshBooks]);

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
        rightAction={() => setTheme(isDarkmode ? "light" : "dark")}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.bookItem, {backgroundColor: isDarkmode ? themeColor.dark600 : themeColor.light200}]}
              onPress={() => openBookDetails(item)}
            >
              <Image source={{ uri: item.coverUrl }} style={styles.bookImage} />
              <Text style={[styles.bookTitle, {color: isDarkmode ? themeColor.white100 : themeColor.black}]}>{item.title}</Text>
              <Text style={[styles.bookInfo, {color: isDarkmode ? themeColor.grey600 : themeColor.grey900}]}>{item.author}</Text>
              <Text style={[styles.bookInfo, {color: isDarkmode ? themeColor.grey600 : themeColor.grey900}]}>ISBN: {item.isbn}</Text>
              <Text style={[styles.bookPrice, {color: isDarkmode ? themeColor.white100 : themeColor.black}]}>${item.price}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  bookItem: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  bookTitle: {
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookInfo: {
    fontSize: 12,
    textAlign: 'center',
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
