import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  Layout,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth"; // Assuming you are using Firebase Auth
import CustomTopNav from "../components/CustomTopNav";

export default function ({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <Layout>
      <CustomTopNav title="Settings" navigation={navigation} />
      <View style={styles.container}>
        <TouchableOpacity style={{ ...styles.option, borderBottomColor: isDarkmode ? themeColor.white200 : themeColor.dark }} onPress={() => navigation.navigate('Profile')}>
          <Text>Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkmode ? themeColor.white200 : themeColor.dark} />
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.option, borderBottomColor: isDarkmode ? themeColor.white200 : themeColor.dark }} onPress={() => navigation.navigate('ChangePassword')}>
          <Text>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkmode ? themeColor.white200 : themeColor.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.option, borderBottomColor: isDarkmode ? themeColor.white200 : themeColor.dark }} onPress={() => navigation.navigate('DeleteAccount')}>
          <Text>Delete Account</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkmode ? themeColor.white200 : themeColor.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.option, borderBottomColor: isDarkmode ? themeColor.white200 : themeColor.dark }} onPress={handleSignOut}>
          <Text style={{ color: themeColor.danger }}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={20} color={isDarkmode ? themeColor.white200 : themeColor.dark} />
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
  },
});
