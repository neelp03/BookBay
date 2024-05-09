import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, Alert, Modal, KeyboardAvoidingView, ScrollView } from "react-native";
import {
  Layout,
  TextInput,
  useTheme,
  themeColor,
  Button,
} from "react-native-rapi-ui";
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
    status: "available",
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
      seller: userInfo.uid,
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
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
      <CustomTopNav title="Sell Book" navigation={navigation} />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 3,
              padding: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Button
              text="View My Books"
              onPress={() => navigation.navigate('MyBooks')}
              style={{ marginBottom: 20 }}
              color={themeColor.warning}
            />
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
              disabled={!bookDetails.title || !bookDetails.isbn || bookDetails.isbn.length < 10 || bookDetails.isbn.length > 13 || isNaN(bookDetails.isbn)}
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
                <View style={{ ...styles.modalView, backgroundColor: isDarkmode ? themeColor.dark : themeColor.white, }}>
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
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
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
