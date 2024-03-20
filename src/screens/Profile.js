import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button, Alert } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
  Avatar,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from "firebase/auth";
import { useUser } from "../provider/UserProvider";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { userInfo } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  const handleChangePassword = () => {
    setLoading(true);
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    reauthenticateWithCredential(user, credential).then(() => {
      updatePassword(user, newPassword).then(() => {
        setMessage("Password updated successfully.");
        setCurrentPassword('');
        setNewPassword('');
      }).catch((error) => {
        setMessage(error.message);
      });
    }).catch((error) => {
      setMessage(error.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteUser(user).then(() => {
          // User deleted, handle post-deletion logic
          Alert.alert("Account deleted", "Your account has been successfully deleted.");
        }).catch((error) => {
          // Handle errors
          Alert.alert("Error deleting account", error.message);
        }), style: "destructive" },
      ]
    );
  };

  return (
    <Layout>
      <TopNav
        middleContent="Profile"
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
        <Avatar
          source={{ uri: userInfo?.avatar }}
          size="lg"
          shape="round"
        />
        <Text fontWeight="bold" style={styles.username}>{userInfo?.name || 'Your Name'}</Text>
        <Text style={styles.email}>{userInfo?.email || 'your.email@example.com'}</Text>

        <TextInput
          style={[styles.input, { borderColor: isDarkmode ? themeColor.white100 : themeColor.dark, color: isDarkmode ? themeColor.white100 : themeColor.dark }]}
          onChangeText={setCurrentPassword}
          value={currentPassword}
          placeholder="Current password"
          secureTextEntry
          placeholderTextColor={isDarkmode ? "#bfbfbf" : "#5f5f5f"}
        />
        <TextInput
          style={[styles.input, { borderColor: isDarkmode ? themeColor.white100 : themeColor.dark, color: isDarkmode ? themeColor.white100 : themeColor.dark }]}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholder="New password"
          secureTextEntry
          placeholderTextColor={isDarkmode ? "#bfbfbf" : "#5f5f5f"}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Button title={loading ? "Updating..." : "Change Password"} onPress={handleChangePassword} disabled={loading} />
        <Button title="Delete Account" color="red" onPress={handleDeleteAccount} />
      </View>
    </Layout>
  );
}

// TextStyle for the Text component imported from react-native-rapi-ui
// it uses the default text font style, change the style to a google font
// or any other font if needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  username: {
    marginTop: 20,
  },
  email: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  message: {
    color: 'red',
  },
});
