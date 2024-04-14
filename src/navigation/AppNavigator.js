import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from "../provider/AuthProvider";
import { auth } from "../../firebase.config";

// Main Screens
import Home from "../screens/Home";

// Auth Screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";

// Additional Tab Screens
import SearchScreen from "../screens/Search";
import OrdersScreen from "../screens/Orders";
import ProfileScreen from "../screens/Profile";
import SellScreen from "../screens/SellBook";
import SettingsScreen from "../screens/Settings";
import BookDetails from "../screens/BookDetails";

import Loading from "../screens/utils/Loading";

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
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
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
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
