import React, { useState } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import {
  Layout,
  TopNav,
  themeColor,
  useTheme,
  Text,
  TextInput,
  Avatar,
  Button
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../provider/UserProvider";

export default function Profile({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { userInfo, updateUserDetails } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phoneNo, setPhoneNo] = useState(userInfo?.phoneNo || '');
  const [loading, setLoading] = useState(false);
  const [emailEdited, setEmailEdited] = useState(false);

  const handleSaveChanges = async () => {
    setLoading(true);
    const result = await updateUserDetails({ name, email, phoneNo });
    if (result.success) {
      Alert.alert("Profile Updated", "Your profile has been updated successfully.");
      setEditMode(false);
    } else {
      Alert.alert("Update Failed", result.message || "Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <TopNav
        backgroundColor="transparent"
        borderColor="transparent"
        middleContent="Profile"
        leftContent={<Ionicons name="chevron-back" size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        leftAction={() => navigation.goBack()}
        rightContent={<Ionicons name={isDarkmode ? "sunny" : "moon"} size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        rightAction={() => setTheme(isDarkmode ? "light" : "dark")}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Avatar
          source={{ uri: userInfo?.avatar || 'https://via.placeholder.com/150' }}
          size="xl"
          shape="round"
          style={styles.avatar}
          margin={20}
        />
        {editMode ? (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (text !== userInfo?.email) setEmailEdited(true);
              }}
              placeholder="Email"
              keyboardType="email-address"
            />
            {emailEdited && (
              <Text style={styles.warningText}>
                Warning: Changing your email will require re-verification and you will be logged out.
              </Text>
            )}
            <TextInput
              value={phoneNo}
              onChangeText={setPhoneNo}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
            <Button text="Save Changes" onPress={handleSaveChanges} loading={loading} />
            <Button color={themeColor.warning} text="Cancel" onPress={() => { setEditMode(false); setEmailEdited(false); setEmail(userInfo.email) }} />
          </>
        ) : (
          <>
            <Text size="h2" fontWeight="bold">{name || 'Your Name'}</Text>
            <Text>{email || 'your.email@example.com'}</Text>
            <Text>{phoneNo || "Phone: Not set"}</Text>
            <Button text="Edit Profile" onPress={() => setEditMode(true)} />
          </>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  warningText: {
    fontSize: 14,
    color: themeColor.danger,
    textAlign: 'center',
    marginTop: 5,
  },
});
