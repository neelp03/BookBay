import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, Alert, Modal } from "react-native";
import {
  Layout,
  TopNav,
  TextInput,
  useTheme,
  themeColor,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../provider/UserProvider";
import { BookContext } from "../provider/BookProvider";
import CustomTopNav from "../components/CustomTopNav";

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
  const { addBook } = useContext(BookContext);

  const handleChange = (name, value) => {
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const fetchCover = () => {
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
      addBook(docData);
      Alert.alert("Success", "Book added successfully!");
      setModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Could not add the book. Please try again.");
    }
  };

  return (
    <Layout>
      <CustomTopNav title="Sell Book" navigation={navigation} />
      <View
        style={{
          flex: 3,
          padding: 20,
          backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
        }}
      >
        {Object.keys(bookDetails).map((key) => ((
          <TextInput
            key={key}
            containerStyle={{ marginTop: 15 }}
            value={bookDetails[key]}
            onChangeText={(value) => handleChange(key, value)}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        )
        ))}

        <Button
          text="Fetch Cover"
          onPress={fetchCover}
          style={{ marginTop: 20 }}
          disabled={!bookDetails.isbn}
        />

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
            <View style={{...styles.modalView, backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,}}>
              <Image 
              source={{ uri: coverUrl }} 
              style={{
                width: 200,
                height: 300,
                resizeMode: 'contain',
                marginBottom: 20,
                borderColor: isDarkmode ? themeColor.white100 : themeColor.dark,
                borderWidth: 1,
                borderRadius: 8,
              }}
              />
              <Button
                text="Submit"
                onPress={handleSubmit}
                style={{
                  marginTop: 20,
                }}
              />
              <Button
                text="Cancel"
                onPress={() => setModalVisible(false)}
                style={{
                  marginTop: 20,
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});
