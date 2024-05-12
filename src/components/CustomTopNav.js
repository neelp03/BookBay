// Import necessary React and React Native components, hooks, and other utilities
import React, { useState, useContext, useEffect } from 'react';
import { View, Modal, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, TopNav, useTheme, themeColor } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { BookContext } from "../provider/BookProvider";
import { useUser } from "../provider/UserProvider";

/**
 * CustomTopNav component that provides a customizable navigation bar with various functionalities.
 * It includes theme switching, navigating to notifications, and managing book-related operations.
 * 
 * @param {string} title - Title to display in the top navigation bar.
 * @param {object} navigation - Navigation object to handle routing.
 */
const CustomTopNav = ({ title, navigation }) => {
  const { isDarkmode, setTheme } = useTheme(); // Hook to access and modify theme settings
  const { books, removeBook, interest, addInterest, removeInterest, getInterest } = useContext(BookContext); // Context to manage book data and operations
  const { userInfo } = useUser(); // Context to access user information
  const [menuVisible, setMenuVisible] = useState(false); // State to control the visibility of the menu modal
  const [removeModalVisible, setRemoveModalVisible] = useState(false); // State to control the visibility of the remove books modal
  const [notifyModalVisible, setNotifyModalVisible] = useState(false); // State to control the visibility of the notification modal
  const [interestModalVisible, setInterestModalVisible] = useState(false); // State to control the visibility of the interest removal modal
  const [isbnInput, setIsbnInput] = useState(''); // State for handling ISBN input in the notification modal

  // Function to toggle the theme between light and dark modes
  const toggleTheme = () => {
    setTheme(isDarkmode ? 'light' : 'dark');
  };

  // Function to navigate to the notifications screen
  const openNotifications = () => {
    navigation.navigate('Notifications');
  };

  // Function to handle submission of the notification request
  const handleNotifySubmit = async () => {
    if (isbnInput.trim() && userInfo) {
      await addInterest(isbnInput.trim(), userInfo.uid);
      console.log("Notification request saved for ISBN:", isbnInput);
      setIsbnInput(''); // Clear the input field
      setNotifyModalVisible(false); // Close the modal
    }
  };

  // Function to handle the removal of interest in a book
  const handleRemoveInterest = async (isbn) => {
    await removeInterest(isbn, userInfo.uid);
    getInterest(userInfo.uid); // Refresh the list of interests
  };

  // Effect to fetch interests when the user info or modal visibility changes
  useEffect(() => {
    if (userInfo && userInfo.uid) {
      getInterest(userInfo.uid);
    }
  }, [userInfo, interestModalVisible]);

  // Render the component and all its modals
  return (
    <>
      <TopNav
        backgroundColor='transparent'
        borderColor='transparent'
        middleContent={title}
        leftContent={
          (title !== 'My Books' && title !== 'Edit Book' && title !== 'Notifications') ? (
            <Ionicons name="menu" size={25} color={isDarkmode ? themeColor.white100 : themeColor.dark} onPress={() => setMenuVisible(true)} />
          ) : (
            <Ionicons name="chevron-back" size={25} color={isDarkmode ? themeColor.white100 : themeColor.dark} onPress={() => navigation.goBack()} />
          )
        }
        rightContent={
          <View style={styles.iconContainer}>
            {title !== 'Notifications' && <Ionicons
                name="notifications"
                size={25}
                color={isDarkmode ? themeColor.white100 : themeColor.dark}
                onPress={openNotifications}
              />}
            <Ionicons
              name={isDarkmode ? 'sunny' : 'moon'}
              size={25}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
              onPress={toggleTheme}
            />
          </View>
        }
      />
      {/* Modal for menu options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* Modal content */}
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Button for removing books */}
            <Button text="Remove Books" onPress={() => {
              setMenuVisible(false);
              setRemoveModalVisible(true);
            }} style={styles.modalButton} />
            {/* Button for adding notification sign up */}
            <Button text="Notify me about a book" onPress={() => {
              setMenuVisible(false);
              setNotifyModalVisible(true);
            }} style={styles.modalButton} />
            {/* Button for removing notification sign up */}
            <Button text="Remove notification sign up" onPress={() => {
              setMenuVisible(false);
              setInterestModalVisible(true);
            }} style={styles.modalButton} />
            {/* Button to close the menu */}
            <Button text="Close Menu" onPress={() => setMenuVisible(false)} style={styles.modalButton} color={themeColor.warning} />
          </View>
        </View>
      </Modal>
      {/* Modal for removing books */}
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
      {/* Modal for notifying about a book */}
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
      {/* Modal for removing notification sign up */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={interestModalVisible}
        onRequestClose={() => setInterestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {interest.length > 0 ? (
              interest.map((item) => (
                <View key={item.id} style={styles.modalBookItem}>
                  <Text>ISBN: {item.isbn}</Text>
                  <Button text="Unsubscribe" onPress={() => handleRemoveInterest(item.isbn)} />
                </View>
              ))
            ) : (
              <Text>No current interests.</Text>
            )}
            </ScrollView>
            <Button text="Close" onPress={() => setInterestModalVisible(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomTopNav;

// StyleSheet definitions for the component
const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay for modals
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
    width: '100%', // Buttons take the full width of their container
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
