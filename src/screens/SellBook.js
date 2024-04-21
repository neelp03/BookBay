import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button, Image, Alert, Modal } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { useUser } from "../provider/UserProvider";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { userInfo } = useUser();
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    isbn: "",
    condition: "",
    availability: "",
    course: "",
    price: "",
    description: ""
  });
  const [coverUrl, setCoverUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (name, value) => {
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const fetchCover = () => {
    if (!bookDetails.isbn) {
      Alert.alert("ISBN Field Empty", "Please enter an ISBN number first.");
      return;
    }
    const url = `https://covers.openlibrary.org/b/isbn/${bookDetails.isbn}-M.jpg?default=false`;
    setCoverUrl(url);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const docData = {
      ...bookDetails,
      seller: userInfo.uid, // Assuming the useUser hook provides the user's UID
      coverUrl: coverUrl
    };

    try {
      await addDoc(collection(db, "books"), docData);
      Alert.alert("Success", "Book added successfully!");
      setModalVisible(false); // Close the modal
      navigation.goBack(); // Or navigate to another screen as needed
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Could not add the book. Please try again.");
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Sell Book"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => setTheme(isDarkmode ? "light" : "dark")}
      />
      <View style={styles.container}>
        {Object.keys(bookDetails).map((key) => ((
            <TextInput
              key={key}
              style={[
                styles.input,
                {
                  borderColor: isDarkmode ? themeColor.grey700 : themeColor.grey200, // Example for border color
                  color: isDarkmode ? themeColor.white100 : themeColor.dark, // Text color
                  backgroundColor: isDarkmode ? themeColor.dark600 : themeColor.light200, // Background color
                },
              ]}
              value={bookDetails[key]}
              onChangeText={(value) => handleChange(key, value)}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              placeholderTextColor={isDarkmode ? themeColor.grey600 : themeColor.dark} // Placeholder text color
            />
          )
        ))}
        
        <Button title="Fetch Cover" onPress={fetchCover} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={{ uri: coverUrl }} style={styles.coverImage} />
              <Button title="Confirm and Submit" onPress={handleSubmit} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: themeColor.grey200,
    borderRadius: 5,
  },
  coverImage: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  }, centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
