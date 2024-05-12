// Import necessary React components, hooks, and utilities
import React, { useContext } from "react";
import { useTheme, themeColor } from "react-native-rapi-ui";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from "../provider/AuthProvider";

// Import screens for the navigation structure
import Home from "../screens/Home";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import SearchScreen from "../screens/Search";
import ProfileScreen from "../screens/settings/Profile";
import SellScreen from "../screens/SellBook";
import SettingsScreen from "../screens/settings/Settings";
import BookDetails from "../screens/books/BookDetails";
import Notifications from "../screens/Notifications";
import MyBooks from "../screens/books/MyBooks";
import EditBook from "../screens/books/EditBook";
import Messages from "../screens/messaging/Messages";
import Conversation from "../screens/messaging/Conversation";
import Loading from "../screens/utils/Loading";
import ChangePassword from "../screens/settings/ChangePassword";
import DeleteAccount from "../screens/settings/DeleteAccount";

// Create stack navigators for different sections of the app
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Component to handle the authentication flow
const Auth = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

// Tab Navigator for the main application interface
const TabNavigator = () => {
  const { isDarkmode } = useTheme(); // Access theme settings from context

  // Define screen options with icons based on the route name
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Sell':
              iconName = 'add-circle';
              break;
            case 'Messages':
              iconName = 'message';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'error';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: isDarkmode ? themeColor.dark200 : themeColor.light100,
        },
        tabBarActiveTintColor: isDarkmode ? themeColor.light100 : themeColor.primary,
        tabBarInactiveTintColor: isDarkmode ? themeColor.grey600 : themeColor.grey600,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator to handle main application screens
const MainStackScreen = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen name="BookDetails" component={BookDetails} />
      <MainStack.Screen name="Notifications" component={Notifications} />
      <MainStack.Screen name="MyBooks" component={MyBooks} />
      <MainStack.Screen name="EditBook" component={EditBook} />
      <MainStack.Screen name="Conversation" component={Conversation} />
    </MainStack.Navigator>
  );
};

// Stack Navigator for settings related screens
const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <SettingsStack.Screen name="DeleteAccount" component={DeleteAccount} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
};

// Root component to determine which navigator to display based on authentication status
export default () => {
  const authContext = useContext(AuthContext); // Access authentication context
  const user = authContext.user; // Get current user state

  // Conditionally render navigators based on the user's authentication status
  return (
    <NavigationContainer>
      {user === null && <Loading />}
      {user === false && <Auth />}
      {user && <MainStackScreen />}
    </NavigationContainer>
  );
};
