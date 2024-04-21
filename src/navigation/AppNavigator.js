import React, { useContext } from "react";
import { useTheme, themeColor } from "react-native-rapi-ui";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from "../provider/AuthProvider";

// Main Screens
import Home from "../screens/Home";

// Auth Screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";

// Additional Tab Screens
import SearchScreen from "../screens/Search";
import ProfileScreen from "../screens/Profile";
import SellScreen from "../screens/SellBook";
import SettingsScreen from "../screens/Settings";
import BookDetails from "../screens/BookDetails";

import Loading from "../screens/utils/Loading";

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Auth = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const TabNavigator = () => {
  const { isDarkmode } = useTheme(); // Retrieve theme mode

  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkmode ? themeColor.dark200 : '#fff', // Background color of the tab bar
        },
        tabBarActiveTintColor: isDarkmode ? '#fff' : '#333', // Active tab color
        tabBarInactiveTintColor: isDarkmode ? '#888' : '#ccc', // Inactive tab color
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};

const MainStackScreen = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen name="BookDetails" component={BookDetails} />
    </MainStack.Navigator>
  );
};

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
};

export default () => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  return (
    <NavigationContainer>
      {user === null && <Loading />}
      {user === false && <Auth />}
      {user && <MainStackScreen />}
    </NavigationContainer>
  );
};
