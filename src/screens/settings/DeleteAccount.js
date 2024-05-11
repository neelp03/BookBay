import React from "react";
import { ScrollView, View, StyleSheet, Alert, Image, KeyboardAvoidingView } from "react-native";
import { useTheme, themeColor, Text, TextInput, Button, Layout, TopNav } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../provider/AuthProvider";

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
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <TopNav
          backgroundColor="transparent"
          borderColor="transparent"
          middleContent="Delete Account"
          leftContent={
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          leftAction={() => navigation.goBack()}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/delete-acc.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Delete Account?
            </Text>
            <Text>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button
              text="Delete Account"
              onPress={handleDeleteAccount}
              style={{ marginTop: 20 }}
              status="danger"
            />
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    marginBottom: 20,
  },
});