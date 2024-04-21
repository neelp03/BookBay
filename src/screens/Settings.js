import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth"; // Assuming you are using Firebase Auth

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Handle successful sign out (e.g., navigate to login screen)
      navigation.navigate("Login");
    } catch (error) {
      // Handle error if sign out fails
      console.error("Sign out error", error);
    }
  };

  return (
    <Layout>
      <TopNav
        middleContent="Settings"
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
        rightAction={() => {
          setTheme(isDarkmode ? "light" : "dark");
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Profile')}>
          <Text>Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={themeColor.grey} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleSignOut}>
          <Text>Sign Out</Text>
          <Ionicons name="chevron-forward" size={20} color={themeColor.grey} />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: themeColor.grey200,
  },
});
