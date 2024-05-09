import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert, Switch } from "react-native";
import {
  Layout,
  TextInput,
  useTheme,
  themeColor,
  Button,
  Text
} from "react-native-rapi-ui";
import { BookContext } from "../provider/BookProvider";
import CustomTopNav from "../components/CustomTopNav";

export default function EditBook({ route, navigation }) {
  const { book } = route.params;
  const { isDarkmode } = useTheme();
  const { updateBook, removeBook } = useContext(BookContext);
  const [bookDetails, setBookDetails] = useState({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    description: book.description,
    condition: book.condition,
    course: book.course,
    price: book.price,
    status: book.status === "available",
    coverUrl: book.coverUrl,
  });

  const handleChange = (name, value) => {
    setBookDetails({ ...bookDetails, [name]: value });
    if (name === "isbn") {
      setBookDetails({
        ...bookDetails,
        [name]: value,
        coverUrl: `https://covers.openlibrary.org/b/isbn/${value}-M.jpg?default=false`
      });
    }
  };

  const handleToggleAvailability = () => {
    setBookDetails({ ...bookDetails, status: !bookDetails.status });
  };

  const handleDelete = async () => {
    try {
      await removeBook(book.id);
      Alert.alert("Success", "Book removed successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error removing book: ", error);
      Alert.alert("Error", "Could not remove the book. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const updatedBook = {
      ...bookDetails,
      status: bookDetails.status ? "available" : "unavailable"
    };

    try {
      await updateBook(book.id, updatedBook);
      Alert.alert("Success", "Book updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating book: ", error);
      Alert.alert("Error", "Could not update the book. Please try again.");
    }
  };

  return (
    <Layout>
      <CustomTopNav title="Edit Book" navigation={navigation} />
      <View style={{
        flex: 1,
        padding: 20,
        backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
      }}>
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.title}
          onChangeText={(value) => handleChange("title", value)}
          placeholder="Title"
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.author}
          onChangeText={(value) => handleChange("author", value)}
          placeholder="Author"
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.isbn}
          onChangeText={(value) => handleChange("isbn", value)}
          placeholder="ISBN"
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.description}
          onChangeText={(value) => handleChange("description", value)}
          placeholder="Description"
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.condition}
          onChangeText={(value) => handleChange("condition", value)}
          placeholder="Condition"
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.course}
          onChangeText={(value) => handleChange("course", value)}
          placeholder="Course"
        />
        <TextInput
          containerStyle={{ marginTop: 15 }}
          value={bookDetails.price}
          onChangeText={(value) => handleChange("price", value)}
          placeholder="Price"
        />

        <View style={styles.toggleContainer}>
          <Text>Availability: </Text>
          <Switch
            trackColor={{ false: themeColor.grey, true: themeColor.primary }}
            thumbColor={bookDetails.status ? themeColor.white : themeColor.grey600}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleAvailability}
            value={bookDetails.status}
          />
        </View>

        <Button
          text="Update Book"
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
        />

        <Button
          text="Delete Book"
          onPress={handleDelete}
          style={{ marginTop: 10 }}
          color={themeColor.danger}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
