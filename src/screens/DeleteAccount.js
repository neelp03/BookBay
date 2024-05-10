import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useTheme, Text, TextInput, Button, Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../provider/AuthProvider";

export default function DeleteAccount({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { reauthenticate, deleteAccount, signOut } = React.useContext(AuthContext);
  const [password, setPassword] = React.useState("");

  const handleDeleteAccount = async () => {
    const reauthResult = await reauthenticate(password);
    if (!reauthResult.success) {
      Alert.alert("Error", "Password is incorrect");
      return;
    }

    const deleteResult = await deleteAccount();
    if (deleteResult.success) {
      Alert.alert("Success", "Account deleted successfully.");
      signOut();
    } else {
      Alert.alert("Error", deleteResult.message);
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Delete Account"
        leftContent={<Ionicons name="chevron-back" size={20} color={isDarkmode ? "#fff" : "#333"} />}
        leftAction={() => navigation.goBack()}
        rightContent={<Ionicons name={isDarkmode ? "sunny" : "moon"} size={20} color={isDarkmode ? "#fff" : "#333"} />}
        rightAction={() => setTheme(isDarkmode ? "light" : "dark")}
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button
          text="Delete Account"
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
        />
      </View>
    </Layout>
  );
}