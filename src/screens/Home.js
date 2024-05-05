import React, { useContext, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Modal,
  ScrollView
} from "react-native";
import {
  Layout,
  Text,
  TopNav,
  useTheme,
  themeColor,
  Button,
  TextInput
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { BookContext } from "../provider/BookProvider";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { books, refreshBooks, removeBook } = useContext(BookContext);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [notifyModalVisible, setNotifyModalVisible] = useState(false);
  const [isbnInput, setIsbnInput] = useState('');

  const openBookDetails = (book) => {
    navigation.navigate('BookDetails', { Book: book });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshBooks().then(() => setRefreshing(false)).catch((error) => {
      console.error(error);
      setRefreshing(false);
    });
  }, [refreshBooks]);

  return (
    <Layout>
      <TopNav
        middleContent="Home"
        leftContent={<Ionicons name="menu" size={25} color={isDarkmode ? themeColor.white100 : themeColor.dark} onPress={() => setMenuVisible(true)} />}
        rightContent={<Ionicons name={isDarkmode ? "sunny" : "moon"} size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        rightAction={() => setTheme(isDarkmode ? "light" : "dark")}
      />
      {/* Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Button text="Remove Books" onPress={() => {
              setMenuVisible(false);
              setRemoveModalVisible(true);
            }} style={styles.modalButton} />
            <Button text="Notify me about a book" onPress={() => {
              setMenuVisible(false);
              setNotifyModalVisible(true);
            }} style={styles.modalButton} />
            <Button text="Close Menu" onPress={() => setMenuVisible(false)} style={styles.modalButton} color={themeColor.danger} />
          </View>
        </View>
      </Modal>
      {/* Remove Books Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={removeModalVisible}
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Make sure the ScrollView handles the layout properly */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {books.length > 0 ? (
                books.map((item) => (
                  <View key={item.id} style={styles.modalBookItem}>
                    <Text>{item.title}</Text>
                    <Button text="Remove" onPress={() => {
                      removeBook(item.id);
                      setRemoveModalVisible(false);
                    }} />
                  </View>
                ))
              ) : (
                <Text>No books available to remove.</Text>  // Fallback text if no books are present
              )}
            </ScrollView>
            <Button text="Close" onPress={() => setRemoveModalVisible(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
      {/* Notify Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notifyModalVisible}
        onRequestClose={() => setNotifyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={{ ...styles.centeredView, ...styles.modalContainer }}>
            <TextInput
              value={isbnInput}
              onChangeText={setIsbnInput}
              placeholder="Enter ISBN"
              style={styles.textInput}
            />
            <View style={styles.buttonContainer}>
              <Button
                text="Submit"
                onPress={() => {
                  console.log("Request notification for ISBN:", isbnInput);
                  setNotifyModalVisible(false);
                }}
                style={{ ...styles.modalButton, marginRight: 10 }}
              />
              <Button
                text="Cancel"
                onPress={() => setNotifyModalVisible(false)}
                style={styles.modalButton}
                color={themeColor.danger}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    overflow: 'hidden',  // Ensures that nothing spills out of the container
  },
  modalButton: {
    marginTop: 10,
    width: '100%',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
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
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  scrollContainer: {
    width: '100%',
  }
});
