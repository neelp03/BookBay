import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme, themeColor, Text, TextInput, Button, Layout, TopNav } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../provider/AuthProvider';

export default function ChangePassword({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const { reauthenticate, changePassword, signOut } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    const reauthResult = await reauthenticate(currentPassword);
    if (!reauthResult.success) {
      Alert.alert("Error", "Current password is incorrect");
      return;
    }

    const changeResult = await changePassword(newPassword);
    if (changeResult.success) {
      Alert.alert("Success", "Password updated successfully.");
      signOut();  // Optional: Sign out user after password change
    } else {
      Alert.alert("Error", changeResult.message);
    }
  };

  return (
    <Layout>
      <TopNav
        backgroundColor='transparent'
        borderColor='transparent'
        middleContent="Change Password"
        leftContent={<Ionicons name="chevron-back" size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        leftAction={() => navigation.goBack()}
        rightContent={<Ionicons name={isDarkmode ? "sunny" : "moon"} size={20} color={isDarkmode ? themeColor.white100 : themeColor.dark} />}
        rightAction={() => setTheme(isDarkmode ? "light" : "dark")}
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <Text style={{color: isDarkmode ? themeColor.warning300 : themeColor.warning500}}>
          Recommended password format: {'\n\n'}
          - At least 8 characters{'\n'}
          - At least one uppercase letter{'\n'}
          - At least one lowercase letter{'\n'}
          - At least one number{'\n'}
          - At least one special character{'\n'}
        </Text>
        <Button
          text="Change Password"
          onPress={handleChangePassword}
          style={{ backgroundColor: themeColor.primary, marginTop: 20 }}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 15
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
});
