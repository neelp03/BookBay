import React, { useState, useContext } from 'react';
import {
  View,
  Modal,
  ScrollView,
  StyleSheet
} from "react-native";
import { TextInput, Button, Text, TopNav, useTheme, themeColor } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { BookContext } from "../provider/BookProvider";
import { useUser } from "../provider/UserProvider";


const CustomTopNav = ({ title, navigation }) => {
  const { isDarkmode, setTheme } = useTheme();
  const { books, removeBook, addInterest } = useContext(BookContext);
  const { userInfo } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [notifyModalVisible, setNotifyModalVisible] = useState(false);
  const [isbnInput, setIsbnInput] = useState('');

  const toggleTheme = () => {
    setTheme(isDarkmode ? 'light' : 'dark');
  };

  const openNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleNotifySubmit = async () => {
    if (isbnInput.trim() && userInfo) {
      // Call the function from BookContext to register interest
      await addInterest(isbnInput.trim(), userInfo.uid);
      console.log("Notification request saved for ISBN:", isbnInput);
      setIsbnInput(''); 
      setNotifyModalVisible(false);
    }
  };

  return (
    <>
      <TopNav
        backgroundColor='transparent'
        borderColor='transparent'
        middleContent={title}
        leftContent={
          // show the menu icon only if title is not notifications, else show back icon
          (title !== 'My Books' && title !== 'Edit Book' && title !== 'Notifications') ? (
            <Ionicons name="menu" size={25} color={isDarkmode ? themeColor.white100 : themeColor.dark} onPress={() => setMenuVisible(true)} />
          ) : (
            <Ionicons name="chevron-back" size={25} color={isDarkmode ? themeColor.white100 : themeColor.dark} onPress={() => navigation.goBack()} />
          )
        }
        rightContent={
          // show the notification icon only if title is not notifications
          <View style={styles.iconContainer}>
          {title !== 'Notifications' && (<Ionicons
              name="notifications"
              size={25}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
              onPress={openNotifications}
            />)}
            <Ionicons
              name={isDarkmode ? 'sunny' : 'moon'}
              size={25}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
              onPress={toggleTheme}
            />
          </View>
        }
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
            <Button text="Close Menu" onPress={() => setMenuVisible(false)} style={styles.modalButton} color={themeColor.warning} />
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {books.length > 0 ? (
                books.map((item) => (
                  // Show only the books that the user has posted
                  userInfo && item.seller === userInfo.uid && (
                  <View key={item.id} style={styles.modalBookItem}>
                    <Text>{item.title}</Text>
                      <Button
                        text="Remove"
                        onPress={() => {
                          removeBook(item.id);
                          setRemoveModalVisible(false);
                        }}
                      />
                  </View>
                )))
              ) : (
                <Text>No books available to remove.</Text>
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
                onPress={handleNotifySubmit}
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
    </>
  );
};

export default CustomTopNav;


const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
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
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  scrollContainer: {
    width: '100%',
  }
});
