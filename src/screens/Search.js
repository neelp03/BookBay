import React, { useState, useContext } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Layout, TopNav, themeColor, useTheme, Picker, Text, TextInput } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { BookContext } from "../provider/BookProvider";
import CustomTopNav from "../components/CustomTopNav";

export default function SearchScreen({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { books, searchBooks } = useContext(BookContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState('title');
  const [searchSubmitted, setSearchSubmitted] = useState(false);  // State to track if search has been submitted

  const handleSearch = () => {
    if (searchQuery === '') {
      Alert.alert("Empty Search", "Please enter a search query.");
      return;  // Do not search if search query is empty
    }
    if (selectedField === 'isbn' && isNaN(searchQuery)) {
      Alert.alert('Invalid ISBN', 'Please enter a valid ISBN number.');
      return;
    }
    searchBooks(searchQuery, selectedField);
    setSearchSubmitted(true);
  };


  const openBookDetails = (book) => {
    navigation.navigate('BookDetails', { Book: book });
  };

  const searchFields = [
    { label: 'Title', value: 'title' },
    { label: 'Author', value: 'author' },
    { label: 'ISBN', value: 'isbn' },
    { label: 'Course', value: 'course' }
  ];

  return (
    <Layout>
      <CustomTopNav title="Search" navigation={navigation} />
      <View style={{ margin: 20 }}>
        <Picker
          items={searchFields}
          value={selectedField}
          placeholder="Select a field"
          onValueChange={(val) => setSelectedField(val)}
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          placeholder="Enter search query"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchSubmitted && (  // Display results only after search is submitted
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.bookItem,
                  { backgroundColor: isDarkmode ? themeColor.dark200 : themeColor.white }
                ]}
                onPress={() => openBookDetails(item)}
              >
                <Image source={{ uri: item.coverUrl }} style={styles.bookImage} />
                <Text style={{
                  ...styles.bookTitle,
                  color: isDarkmode ? themeColor.white100 : themeColor.black
                }}>{item.title}</Text>
                <Text style={{
                  ...styles.bookInfo,
                  color: isDarkmode ? themeColor.grey600 : themeColor.grey900
                }}>{item.author}</Text>
                <Text style={{
                  ...styles.bookInfo,
                  color: isDarkmode ? themeColor.grey600 : themeColor.grey900
                }}>ISBN: {item.isbn}</Text>
                <Text style={{
                  ...styles.bookPrice,
                  color: isDarkmode ? themeColor.white100 : themeColor.black
                }}>${item.price}</Text>
              </TouchableOpacity>
            )}
            numColumns={2}
          />
        )}
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
