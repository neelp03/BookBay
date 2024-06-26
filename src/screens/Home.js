import React, { useContext, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import {
  Layout,
  Text,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { BookContext } from "../provider/BookProvider";
import CustomTopNav from "../components/CustomTopNav";
import { useFocusEffect } from "@react-navigation/native";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { books, refreshBooks } = useContext(BookContext);
  const [refreshing, setRefreshing] = useState(false);

  const openBookDetails = (book) => {
    navigation.navigate('BookDetails', { Book: book });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      refreshBooks();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshBooks]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [refreshBooks])
  );
  return (
    <Layout>
      <CustomTopNav title="Home" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.bookItem,
                { backgroundColor: isDarkmode ? themeColor.dark200 : themeColor.white }
              ]}
              onPress={() => openBookDetails(item)}
            >
              <Image source={{ uri: item.coverUrl }} style={styles.bookImage} />
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookInfo}>{item.author}</Text>
              <Text style={styles.bookInfo}>ISBN: {item.isbn}</Text>
              <Text style={styles.bookPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  bookItem: {
    flex: 1,
    margin: 10,
    padding: 10,
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
