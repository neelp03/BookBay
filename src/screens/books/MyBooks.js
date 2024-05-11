import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Layout, Text, useTheme, themeColor } from "react-native-rapi-ui";
import { BookContext } from "../../provider/BookProvider";
import { useUser } from "../../provider/UserProvider";
import CustomTopNav from "../../components/CustomTopNav";

export default function MyBooks({ navigation }) {
  const { books } = useContext(BookContext);
  const { userInfo } = useUser();
  const { isDarkmode } = useTheme();
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    const filteredBooks = books.filter(book => book.seller === userInfo?.uid);
    setUserBooks(filteredBooks);
  }, [books, userInfo?.uid]);

  const openEditBook = (book) => {
    navigation.navigate('EditBook', { book });
  };

  return (
    <Layout>
      <CustomTopNav title="My Books" navigation={navigation} />
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Click on a book to edit or remove it
          </Text>
          {userBooks.length > 0 ? (
            <View style={styles.grid}>
              {userBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={[
                    styles.bookItem,
                    { backgroundColor: isDarkmode ? themeColor.dark200 : themeColor.white }
                  ]}
                  onPress={() => openEditBook(book)}
                >
                  <Image source={{ uri: book.coverUrl }} style={styles.bookImage} />
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookInfo}>{book.author}</Text>
                  <Text style={styles.bookInfo}>ISBN: {book.isbn}</Text>
                  <Text style={styles.bookPrice}>${book.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noBooksText}>You have not posted any books yet.</Text>
          )}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookItem: {
    margin: 10,
    padding: 10,
    width: 150,
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
  noBooksText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});
